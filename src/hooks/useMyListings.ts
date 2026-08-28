import { useCallback, useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';
import type { Listing, ListingStatus } from '@/types';

/** Manages the current user's own listings: fetch + status transitions + delete. */
export function useMyListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setListings([]); setLoading(false); return; }
    // Keep this query owner-only. Adding orderBy('createdAt') creates a
    // composite index requirement; sorting locally is sufficient here.
    const q = query(collection(db, 'listings'), where('ownerId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const next = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Listing);
      next.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
      setListings(next);
      setLoading(false);
    }, (error) => {
      console.error('Failed to load my listings:', error);
      setListings([]);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const setStatus = useCallback(async (listingId: string, status: ListingStatus) => {
    await updateDoc(doc(db, 'listings', listingId), { status, updatedAt: Date.now() });
  }, []);

  const remove = useCallback(async (listingId: string) => {
    await deleteDoc(doc(db, 'listings', listingId));
  }, []);

  return { listings, loading, setStatus, remove };
}

function toMillis(value: unknown): number {
  if (typeof value === 'number') return value;
  if (value && typeof (value as { toMillis?: () => number }).toMillis === 'function') {
    return (value as { toMillis: () => number }).toMillis();
  }
  return 0;
}
