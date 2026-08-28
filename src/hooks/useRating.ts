import { useCallback, useEffect, useState } from 'react';
import {
  doc, getDoc, setDoc, runTransaction, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';

function ratingId(userId: string, listingId: string) {
  return `${listingId}_${userId}`;
}

/**
 * Handles submitting/updating a user's 1-5 star rating for a listing, and
 * keeps the listing's denormalized ratingAvg/ratingCount in sync via a
 * Firestore transaction (safe under concurrent writes).
 */
export function useRating(listingId: string) {
  const { user } = useAuth();
  const [myRating, setMyRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user || !listingId) { setLoaded(true); return; }
    (async () => {
      const snap = await getDoc(doc(db, 'ratings', ratingId(user.uid, listingId)));
      if (snap.exists()) setMyRating(snap.data().value as number);
      setLoaded(true);
    })();
  }, [user, listingId]);

  const submitRating = useCallback(async (value: number) => {
    if (!user) throw new Error('Zəhmət olmasa daxil olun.');
    setSubmitting(true);
    const ratingRef = doc(db, 'ratings', ratingId(user.uid, listingId));
    const listingRef = doc(db, 'listings', listingId);

    try {
      await runTransaction(db, async (tx) => {
        const existing = await tx.get(ratingRef);
        const listingSnap = await tx.get(listingRef);
        if (!listingSnap.exists()) throw new Error('Elan tapılmadı.');

        const data = listingSnap.data();
        const prevAvg = (data.ratingAvg as number) ?? 0;
        const prevCount = (data.ratingCount as number) ?? 0;

        let nextAvg: number;
        let nextCount: number;

        if (existing.exists()) {
          const prevValue = existing.data().value as number;
          const total = prevAvg * prevCount - prevValue + value;
          nextCount = prevCount;
          nextAvg = prevCount > 0 ? total / prevCount : value;
          tx.update(ratingRef, { value, updatedAt: serverTimestamp() });
        } else {
          const total = prevAvg * prevCount + value;
          nextCount = prevCount + 1;
          nextAvg = total / nextCount;
          tx.set(ratingRef, {
            listingId, userId: user.uid, value,
            createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
          });
        }

        tx.update(listingRef, { ratingAvg: Math.round(nextAvg * 10) / 10, ratingCount: nextCount });
      });
      setMyRating(value);
    } finally {
      setSubmitting(false);
    }
  }, [user, listingId]);

  return { myRating, submitRating, submitting, loaded };
}
