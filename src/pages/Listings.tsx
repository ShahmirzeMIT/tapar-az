import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Select, InputNumber, Button, Drawer, Skeleton, Empty } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { CATEGORIES } from '@/config/categories';
import { useListings, type ListingFilters } from '@/hooks/useListings';
import ListingCard from '@/components/ListingCard';
import type { CategoryKey } from '@/types';

const CITIES = ['Bakı', 'Gəncə', 'Sumqayıt', 'Mingəçevir', 'Şəki', 'Naxçıvan', 'Lənkəran'];

export default function Listings() {
  const [params, setParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [category, setCategory] = useState<CategoryKey | undefined>(params.get('category') as CategoryKey ?? undefined);
  const [city, setCity] = useState<string | undefined>(params.get('city') ?? undefined);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState<ListingFilters['sort']>('newest');
  const searchTerm = params.get('q') ?? undefined;

  useEffect(() => {
    const next = new URLSearchParams(params);
    category ? next.set('category', category) : next.delete('category');
    city ? next.set('city', city) : next.delete('city');
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, city]);

  const filters = useMemo<ListingFilters>(() => ({
    category, city, minPrice, maxPrice, sort, searchTerm,
  }), [category, city, minPrice, maxPrice, sort, searchTerm]);

  const { listings, loading, loadingMore, hasMore, loadMore, error } = useListings(filters);

  const filterPanel = (
    <div className="space-y-5">
      <FilterField label="Kateqoriya">
        <Select
          className="w-full" allowClear placeholder="Bütün kateqoriyalar"
          value={category} onChange={setCategory}
          options={CATEGORIES.map((c) => ({ label: c.label, value: c.key }))}
        />
      </FilterField>
      <FilterField label="Şəhər">
        <Select
          className="w-full" allowClear placeholder="Bütün şəhərlər"
          value={city} onChange={setCity}
          options={CITIES.map((c) => ({ label: c, value: c }))}
        />
      </FilterField>
      <FilterField label="Qiymət aralığı (AZN)">
        <div className="flex gap-2">
          <InputNumber className="w-full" placeholder="min" value={minPrice} onChange={(v) => setMinPrice(v ?? undefined)} />
          <InputNumber className="w-full" placeholder="maks" value={maxPrice} onChange={(v) => setMaxPrice(v ?? undefined)} />
        </div>
      </FilterField>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-white">
          {searchTerm ? `"${searchTerm}" üçün nəticələr` : 'Bütün Elanlar'}
        </h1>
        <div className="flex items-center gap-2">
          <Select
            value={sort} onChange={setSort} className="w-44"
            options={[
              { label: 'Əvvəlcə yeni', value: 'newest' },
              { label: 'Ucuzdan bahaya', value: 'cheapest' },
              { label: 'Bahadan ucuza', value: 'expensive' },
              { label: 'Ən çox baxılan', value: 'most_viewed' },
              { label: 'Ən yüksək reytinq', value: 'top_rated' },
            ]}
          />
          <Button className="lg:hidden" icon={<FilterOutlined />} onClick={() => setDrawerOpen(true)}>Filtr</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden lg:block">{filterPanel}</aside>

        <Drawer title="Filtrlər" open={drawerOpen} onClose={() => setDrawerOpen(false)} placement="left">
          {filterPanel}
        </Drawer>

        <div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => <Skeleton.Image key={i} active className="!w-full !h-48" />)}
            </div>
          ) : listings.length === 0 ? (
            <Empty description="Bu filtrlərə uyğun elan tapılmadı" className="py-20" />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
      </div>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">{label}</p>
      {children}
    </div>
  );
}
