import { useCallback, useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
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
    const q = query(collection(db, 'listings'), where('ownerId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setListings(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Listing));
      setLoading(false);
    }, () => setLoading(false));
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
