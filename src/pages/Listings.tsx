import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Select, InputNumber, Input, Button, Drawer, Skeleton, Empty, Switch } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { CATEGORIES, getCategory } from '@/config/categories';
import { useListings, type ListingFilters } from '@/hooks/useListings';
import ListingCard from '@/components/ListingCard';
import type { CategoryKey, FieldSchema, ListingAttributes } from '@/types';
import { visibleFields } from '@/utils/conditionalFields';

const CITIES = ['Bakı', 'Gəncə', 'Sumqayıt', 'Mingəçevir', 'Şəki', 'Naxçıvan', 'Lənkəran'];

export default function Listings() {
  const [params, setParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [category, setCategory] = useState<CategoryKey | undefined>(params.get('category') as CategoryKey ?? undefined);
  const [city, setCity] = useState<string | undefined>(params.get('city') ?? undefined);
  const [subcategory, setSubcategory] = useState<string | undefined>(params.get('subcategory') ?? undefined);
  const [attributeFilters, setAttributeFilters] = useState<ListingAttributes>({});
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [appliedFilters, setAppliedFilters] = useState({
    category,
    city,
    subcategory,
    minPrice,
    maxPrice,
    attributes: {} as ListingAttributes,
  });
  const [sort, setSort] = useState<ListingFilters['sort']>('newest');
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
    category: appliedFilters.category,
    city: appliedFilters.city,
    minPrice: appliedFilters.minPrice,
    maxPrice: appliedFilters.maxPrice,
    sort,
    searchTerm,
    subcategory: appliedFilters.subcategory,
    attributes: appliedFilters.attributes,
  }), [appliedFilters, sort, searchTerm]);

  const { listings, loading, loadingMore, hasMore, loadMore, error } = useListings(filters);

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

  const applyFilters = () => {
    setAppliedFilters({ category, city, subcategory, minPrice, maxPrice, attributes: attributeFilters });
    setDrawerOpen(false);
  };

  const clearFilters = () => {
    setCategory(undefined);
    setCity(undefined);
    setSubcategory(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setAttributeFilters({});
    setAppliedFilters({ category: undefined, city: undefined, subcategory: undefined, minPrice: undefined, maxPrice: undefined, attributes: {} });
  };

  const filterPanel = (
    <div className="space-y-5">
      <FilterField label="Kateqoriya">
        <Select
          className="w-full" allowClear placeholder="Bütün kateqoriyalar"
          value={category} onChange={handleCategoryChange}
          options={CATEGORIES.map((c) => ({ label: c.label, value: c.key }))}
        />
      </FilterField>
      {categoryConfig && categoryConfig.subcategories.length > 1 && (
        <FilterField label="Alt kateqoriya">
          <Select
            className="w-full" allowClear placeholder="Bütün alt kateqoriyalar"
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
      <div className="pt-1 space-y-2">
        <Button type="primary" block onClick={applyFilters}>Axtar</Button>
        <Button block onClick={clearFilters}>Filtrləri təmizlə</Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="market-section-label mb-2">TAPAR.AZ marketplace</p>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-white">
            {searchTerm ? `"${searchTerm}" üçün nəticələr` : 'Bütün Elanlar'}
          </h1>
          <p className="text-sm text-muted mt-1">{listings.length} elan göstərilir</p>
        </div>
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
