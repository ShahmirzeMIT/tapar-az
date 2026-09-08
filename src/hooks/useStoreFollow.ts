import { useCallback, useEffect, useState } from 'react';
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';

export function useStoreFollow(storeId: string) {
  const { user } = useAuth();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(Boolean(user));
  const followId = user ? `${user.uid}_${storeId}` : '';

  useEffect(() => {
    let active = true;
    if (!followId) { setFollowing(false); setLoading(false); return undefined; }
    setLoading(true);
    void getDoc(doc(db, 'store_followers', followId)).then((snapshot) => { if (active) setFollowing(snapshot.exists()); }).catch(() => undefined).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [followId]);

  const toggle = useCallback(async () => {
    if (!user) throw new Error('Mağazanı izləmək üçün daxil olun.');
    const ref = doc(db, 'store_followers', `${user.uid}_${storeId}`);
    if (following) { await deleteDoc(ref); setFollowing(false); }
    else { await setDoc(ref, { userId: user.uid, storeId, createdAt: serverTimestamp() }); setFollowing(true); }
  }, [following, storeId, user]);

  return { following, loading, toggle };
}
