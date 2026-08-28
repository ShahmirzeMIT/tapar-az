import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Select, InputNumber, Input, Button, Drawer, Skeleton, Empty, Switch } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { CATEGORIES, getCategory } from '@/config/categories';
import { useListings, type ListingFilters } from '@/hooks/useListings';
import ListingCard from '@/components/ListingCard';
import type { CategoryKey, FieldSchema, ListingAttributes } from '@/types';
import { visibleFields } from '@/utils/conditionalFields';
import { useTranslation } from 'react-i18next';

const CITIES = ['Bakı', 'Gəncə', 'Sumqayıt', 'Mingəçevir', 'Şəki', 'Naxçıvan', 'Lənkəran'];

export default function Listings() {
  const [params, setParams] = useSearchParams();
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [category, setCategory] = useState<CategoryKey | undefined>(params.get('category') as CategoryKey ?? undefined);
  const [city, setCity] = useState<string | undefined>(params.get('city') ?? undefined);
  const [subcategory, setSubcategory] = useState<string | undefined>(params.get('subcategory') ?? undefined);
  const [attributeFilters, setAttributeFilters] = useState<ListingAttributes>({});
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState<ListingFilters['sort']>('newest');
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const searchTerm = params.get('q') ?? undefined;

  useEffect(() => {
    const next = new URLSearchParams(params);
    category ? next.set('category', category) : next.delete('category');
    city ? next.set('city', city) : next.delete('city');
    subcategory ? next.set('subcategory', subcategory) : next.delete('subcategory');
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, city, subcategory]);

  const categoryConfig = getCategory(category);
  const selectedSubcategory = categoryConfig?.subcategories.find((s) => s.key === subcategory);
  const filterFields = selectedSubcategory?.fields ?? categoryConfig?.subcategories.flatMap((s) => s.fields) ?? [];

  const filters = useMemo<ListingFilters>(() => ({
    category,
    city,
    minPrice,
    maxPrice,
    sort,
    searchTerm,
    subcategory,
    attributes: attributeFilters,
  }), [category, city, minPrice, maxPrice, sort, searchTerm, subcategory, attributeFilters]);

  const { listings, loading, loadingMore, hasMore, loadMore, error } = useListings(filters);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore();
    }, { rootMargin: '500px 0px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const updateAttributeFilter = (name: string, value: ListingAttributes[string]) => {
    setAttributeFilters((previous) => {
      const next = { ...previous };
      if (value === undefined || value === '' || value === false || (Array.isArray(value) && value.length === 0)) {
        delete next[name];
      } else {
        next[name] = value;
      }
      return next;
    });
  };

  const handleCategoryChange = (value: CategoryKey | undefined) => {
    setCategory(value);
    setSubcategory(undefined);
    setAttributeFilters({});
  };

  const filterPanel = (
    <div className="space-y-5">
        <FilterField label={t('category')}>
        <Select
          className="w-full" allowClear placeholder={t('allCategories')}
          value={category} onChange={handleCategoryChange}
          options={CATEGORIES.map((c) => ({ label: c.label, value: c.key }))}
        />
      </FilterField>
      {categoryConfig && categoryConfig.subcategories.length > 1 && (
        <FilterField label={t('subcategory')}>
          <Select
            className="w-full" allowClear placeholder={t('allSubcategories')}
            value={subcategory} onChange={(value) => { setSubcategory(value); setAttributeFilters({}); }}
            options={categoryConfig.subcategories.map((s) => ({ label: s.label, value: s.key }))}
          />
        </FilterField>
      )}
      {categoryConfig && filterFields.filter(isFilterableField).length > 0 && (
        <div className="border-t border-line dark:border-line-dark pt-5 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Kateqoriya detalları</p>
          {visibleFields(filterFields, attributeFilters)
            .filter(isFilterableField)
            .map((field) => (
              <AttributeFilter
                key={field.name}
                field={field}
                value={attributeFilters[field.name]}
                onChange={updateAttributeFilter}
              />
            ))}
        </div>
      )}
          <FilterField label={t('city')}>
        <Select
          className="w-full" allowClear placeholder={t('allCities')}
          value={city} onChange={setCity}
          options={CITIES.map((c) => ({ label: c, value: c }))}
        />
      </FilterField>
      <FilterField label={t('priceRange')}>
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
        <div>
          <p className="market-section-label mb-2">TAPAR.AZ marketplace</p>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-white">
            {searchTerm ? `"${searchTerm}"` : t('allListings')}
          </h1>
          <p className="text-sm text-muted mt-1">{listings.length} {t('shown')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={sort} onChange={setSort} className="w-44"
            options={[
              { label: t('newest'), value: 'newest' },
              { label: t('cheapest'), value: 'cheapest' },
              { label: t('expensive'), value: 'expensive' },
              { label: t('mostViewed'), value: 'most_viewed' },
              { label: t('topRated'), value: 'top_rated' },
            ]}
          />
          <Button className="lg:hidden" icon={<FilterOutlined />} onClick={() => setDrawerOpen(true)}>{t('filters')}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden lg:block market-surface p-5 h-fit">{filterPanel}</aside>

        <Drawer title="Filtrlər" open={drawerOpen} onClose={() => setDrawerOpen(false)} placement="left">
          {filterPanel}
        </Drawer>

        <div>
          {error && <p className="text-urgent text-sm mb-4">{error}</p>}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => <Skeleton.Image key={i} active className="!w-full !h-48" />)}
            </div>
          ) : listings.length === 0 ? (
          <Empty description={t('noResults')} className="py-20" />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
              </div>
              <div ref={loadMoreRef} className="h-16 flex items-center justify-center mt-5 text-xs text-muted">
                {loadingMore && 'Daha çox elan yüklənir...'}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function isFilterableField(field: FieldSchema) {
  return ['select', 'radio', 'multiselect', 'number', 'text', 'switch'].includes(field.type);
}

function AttributeFilter({
  field, value, onChange,
}: {
  field: FieldSchema;
  value: ListingAttributes[string];
  onChange: (name: string, value: ListingAttributes[string]) => void;
}) {
  return (
    <FilterField label={field.label}>
      {field.type === 'number' ? (
        <InputNumber
          className="w-full"
          min={field.min}
          max={field.max}
          placeholder="İstənilən"
          value={typeof value === 'number' ? value : undefined}
          onChange={(next) => onChange(field.name, next ?? undefined)}
        />
      ) : field.type === 'text' ? (
        <Input
          className="w-full"
          placeholder={field.placeholder ?? 'Axtar'}
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(field.name, event.target.value)}
        />
      ) : field.type === 'switch' ? (
        <Switch checked={Boolean(value)} onChange={(checked) => onChange(field.name, checked)} />
      ) : (
        <Select
          className="w-full"
          allowClear
          mode={field.type === 'multiselect' ? 'multiple' : undefined}
          placeholder="İstənilən"
          value={value as string | string[] | undefined}
          options={field.options}
          onChange={(next) => onChange(field.name, next)}
        />
      )}
    </FilterField>
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
