import { Skeleton, Empty, Button } from 'antd';
import { useListings } from '@/hooks/useListings';
import ListingCard from '@/components/ListingCard';

export default function Automobiles() {
  const { listings, loading, loadingMore, hasMore, loadMore } = useListings({ category: 'avtomobiller', sort: 'newest' });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-white mb-6">Avtomobillər</h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton.Image key={i} active className="!w-full !h-48" />)}
        </div>
      ) : listings.length === 0 ? (
        <Empty description="Hələ avtomobil elanı yoxdur" className="py-20" />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
          {hasMore && (
            <div className="text-center mt-8">
              <Button onClick={loadMore} loading={loadingMore} size="large">Daha çox göstər</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
