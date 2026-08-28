import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { Listing } from '@/types';

export function useListing(id: string | undefined) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const ref = doc(db, 'listings', id);
        const snap = await getDoc(ref);
        if (cancelled) return;
        if (!snap.exists()) {
          setError('Elan tapılmadı.');
          setListing(null);
        } else {
          setListing({ id: snap.id, ...snap.data() } as Listing);
          // Fire-and-forget view increment; ownership rules don't block reads/increment of viewCount
          updateDoc(ref, { viewCount: increment(1) }).catch(() => {});
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Xəta baş verdi.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  return { listing, loading, error };
}
