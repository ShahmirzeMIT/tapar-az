import { useCallback, useEffect, useState } from 'react';
import {
  collection, query, where, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';
import type { Favorite } from '@/types';

/** Favorite doc id is deterministic: `${userId}_${listingId}` — makes toggling idempotent. */
function favId(userId: string, listingId: string) {
  return `${userId}_${listingId}`;
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'favorites'), where('userId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setFavorites(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Favorite));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [user]);

  const isFavorite = useCallback(
    (listingId: string) => favorites.some((f) => f.listingId === listingId),
    [favorites],
  );

  const toggleFavorite = useCallback(async (listingId: string) => {
    if (!user) throw new Error('Zəhmət olmasa daxil olun.');
    const ref = doc(db, 'favorites', favId(user.uid, listingId));
    if (isFavorite(listingId)) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, { userId: user.uid, listingId, createdAt: serverTimestamp() });
    }
  }, [user, isFavorite]);

  return { favorites, loading, isFavorite, toggleFavorite };
}
