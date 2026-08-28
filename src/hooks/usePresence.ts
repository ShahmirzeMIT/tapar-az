import { useEffect, useState } from 'react';
import {
  ref, set, onValue, onDisconnect, serverTimestamp, remove,
  query as rtdbQuery, orderByChild, startAt,
} from 'firebase/database';
import { rtdb } from '@/firebase/config';

const HEARTBEAT_MS = 25_000; // within the 20-30s window from PRD §9
const STALE_AFTER_MS = 90_000; // sessions with no heartbeat in 90s are considered gone

/** Generates a random anonymous session id, stored per-tab in sessionStorage. */
function getSessionId(): string {
  const key = 'tapar-az-session-id';
  let id = window.sessionStorage.getItem(key);
  if (!id) {
    id = `s_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    window.sessionStorage.setItem(key, id);
  }
  return id;
}

/**
 * Tracks that the current anonymous session is viewing `listingId`, and
 * subscribes to a live count of all currently-active viewers of that
 * listing. Writes only a sessionId + timestamp — no user identity — per
 * the presence-security requirement in PRD §18.
 */
export function usePresence(listingId: string | undefined) {
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    if (!listingId) return;
    const sessionId = getSessionId();
    const myPresenceRef = ref(rtdb, `presence/${listingId}/${sessionId}`);

    const beat = () => set(myPresenceRef, { lastSeen: serverTimestamp(), active: true });
    beat();
    const interval = window.setInterval(beat, HEARTBEAT_MS);

    // Best-effort cleanup if the tab closes / connection drops
    onDisconnect(myPresenceRef).remove();

    const listRef = rtdb ? ref(rtdb, `presence/${listingId}`) : null;
    const unsub = listRef
      ? onValue(listRef, (snap) => {
          const now = Date.now();
          let count = 0;
          snap.forEach((child) => {
            const val = child.val() as { lastSeen?: number };
            // lastSeen is a server timestamp (ms epoch) once resolved by Firebase
            if (val?.lastSeen && now - val.lastSeen < STALE_AFTER_MS) count++;
          });
          setActiveCount(count);
        })
      : undefined;

    return () => {
      window.clearInterval(interval);
      remove(myPresenceRef).catch(() => {});
      if (unsub) unsub();
    };
  }, [listingId]);

  return { activeCount };
}

/**
 * Optional maintenance helper: prune stale presence rows older than a cutoff.
 * Intended to be called occasionally client-side (e.g. on app load) since
 * this project has no Cloud Functions / scheduled backend job.
 */
export async function pruneStalePresence(listingId: string): Promise<void> {
  const cutoff = Date.now() - STALE_AFTER_MS;
  const q = rtdbQuery(ref(rtdb, `presence/${listingId}`), orderByChild('lastSeen'), startAt(0));

  await new Promise<void>((resolve) => {
    onValue(
      q,
      (snap) => {
        const removals: Promise<void>[] = [];
        snap.forEach((child) => {
          const val = child.val() as { lastSeen?: number } | null;
          if (val?.lastSeen && val.lastSeen < cutoff) {
            removals.push(remove(child.ref).catch(() => {}));
          }
        });
        Promise.all(removals).finally(resolve);
      },
      { onlyOnce: true },
    );
  });
}
