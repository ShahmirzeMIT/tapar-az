import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { Empty, Skeleton, Result } from 'antd';
import { db } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import ListingCard from '@/components/ListingCard';
import type { Listing } from '@/types';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { user } = useAuth();
  const { favorites, loading: favLoading } = useFavorites();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favLoading) return;
    if (favorites.length === 0) { setListings([]); setLoading(false); return; }

    setLoading(true);
    Promise.all(
      favorites.map(async (f) => {
        const snap = await getDoc(doc(db, 'listings', f.listingId));
        return snap.exists() ? ({ id: snap.id, ...snap.data() } as Listing) : null;
      }),
    ).then((results) => {
      setListings(results.filter((l): l is Listing => l !== null));
      setLoading(false);
    });
  }, [favorites, favLoading]);

  if (!user) {
    return (
      <Result
        status="403"
        title="Daxil olun"
        subTitle="Sevimlilərinizi görmək üçün hesabınıza daxil olun."
        extra={<Link to="/login" className="text-ink dark:text-white underline">Daxil ol</Link>}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-white mb-6">Sevimlilər</h1>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton.Image key={i} active className="!w-full !h-48" />)}
        </div>
      ) : listings.length === 0 ? (
        <Empty description="Hələ sevimli elan yoxdur" className="py-20" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  );
}
