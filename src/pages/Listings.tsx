import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Empty, Input, InputNumber, Radio, Select, Switch } from 'antd';
import { SearchOutlined, SlidersOutlined } from '@ant-design/icons';
import ListingCard from '@/components/ListingCard';
import { useListings } from '@/hooks/useListings';
import type { CategoryKey, FieldSchema, ListingAttributes } from '@/types';
import { CATEGORIES, getCategory } from '@/config/categories';

const categories = CATEGORIES.map((item) => ({ value: item.key, label: item.label, image: item.image }));
const cities = ['Bakı', 'Gəncə', 'Sumqayıt', 'Mingəçevir', 'Şəki', 'Naxçıvan', 'Lənkəran'];

function isFieldVisible(field: FieldSchema, values: ListingAttributes) {
  const condition = field.showIf;
  if (!condition) return true;
  const actual = values[condition.field];
  if (condition.equals !== undefined) return actual === condition.equals;
  if (condition.notEquals !== undefined) return actual !== condition.notEquals;
  return condition.in ? condition.in.some((item) => item === actual) : true;
}

function FilterField({ field, value, onChange }: { field: FieldSchema; value: ListingAttributes[string]; onChange: (value: ListingAttributes[string]) => void }) {
  if (field.type === 'switch' || field.type === 'checkbox') return <div className="flex items-center justify-between rounded-lg border border-line px-3 py-2 dark:border-line-dark"><span className="text-sm text-ink dark:text-white">{field.label}</span><Switch checked={Boolean(value)} onChange={onChange} /></div>;
  if (field.type === 'number') return <InputNumber className="w-full" min={field.min} max={field.max} value={typeof value === 'number' ? value : undefined} placeholder={field.placeholder ?? field.label} onChange={(next) => onChange(next ?? undefined)} />;
  if (field.type === 'radio') return <Radio.Group value={value as string | undefined} onChange={(event) => onChange(event.target.value)} className="flex flex-col gap-2 [&_.ant-radio-wrapper]:mr-0 [&_.ant-radio-wrapper]:text-sm [&_.ant-radio-wrapper]:text-ink dark:[&_.ant-radio-wrapper]:text-white" options={field.options} />;
  if (field.type === 'select') return <Select allowClear className="w-full" value={value as string | undefined} placeholder={field.label} options={field.options} onChange={onChange} />;
  if (field.type === 'multiselect') return <Select mode="multiple" allowClear className="w-full" value={Array.isArray(value) ? value : []} placeholder={field.label} options={field.options} onChange={onChange} />;
  if (field.type === 'tags') return <Select mode="tags" allowClear className="w-full" value={Array.isArray(value) ? value : []} placeholder={field.placeholder ?? field.label} onChange={onChange} />;
  return <Input value={typeof value === 'string' ? value : ''} placeholder={field.placeholder ?? field.label} onChange={(event) => onChange(event.target.value || undefined)} />;
}

export default function Listings() {
  const [params, setParams] = useSearchParams();
  const [term, setTerm] = useState(params.get('q') ?? '');
  const [category, setCategory] = useState<CategoryKey | undefined>(params.get('category') as CategoryKey | undefined);
  const [subcategory, setSubcategory] = useState(params.get('subcategory') ?? undefined);
  const [city, setCity] = useState<string | undefined>();
  const [minPrice, setMinPrice] = useState<number>();
  const [maxPrice, setMaxPrice] = useState<number>();
  const [attributes, setAttributes] = useState<ListingAttributes>({});
  const activeCategory = getCategory(category);
  const activeSubcategory = activeCategory?.subcategories.find((item) => item.key === subcategory) ?? activeCategory?.subcategories[0];
  const visibleFields = activeSubcategory?.fields.filter((field) => isFieldVisible(field, attributes)) ?? [];
  const listingFilters = useMemo(() => ({ searchTerm: params.get('q') ?? undefined, category, city, minPrice, maxPrice, sort: 'newest' as const, subcategory: activeSubcategory?.key, attributes }), [params, category, city, minPrice, maxPrice, activeSubcategory?.key, attributes]);
  const { listings, loading, loadingMore, hasMore, loadMore, error } = useListings(listingFilters);
  const activeSearch = params.get('q');

  const search = () => {
    const next = new URLSearchParams(params);
    term.trim() ? next.set('q', term.trim()) : next.delete('q');
    setParams(next);
  };
  const updateCategory = (value?: CategoryKey) => {
    const nextSubcategory = value ? getCategory(value)?.subcategories[0]?.key : undefined;
    setCategory(value); setSubcategory(nextSubcategory); setAttributes({});
    const next = new URLSearchParams(params);
    value ? next.set('category', value) : next.delete('category');
    nextSubcategory ? next.set('subcategory', nextSubcategory) : next.delete('subcategory');
    setParams(next);
  };
  const updateSubcategory = (value: string) => {
    setSubcategory(value); setAttributes({});
    const next = new URLSearchParams(params); next.set('subcategory', value); setParams(next);
  };
  const updateAttribute = (name: string, value: ListingAttributes[string]) => setAttributes((current) => {
    const next = { ...current };
    if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) delete next[name]; else next[name] = value;
    return next;
  });
  const clearFilters = () => {
    setCategory(undefined); setSubcategory(undefined); setCity(undefined); setMinPrice(undefined); setMaxPrice(undefined); setAttributes({});
    const next = new URLSearchParams(params); next.delete('category'); next.delete('subcategory'); setParams(next);
  };

  return <main className="min-h-screen bg-offwhite dark:bg-background"><div className="mx-auto max-w-7xl px-6 py-8 md:py-12">
    <div className="mb-8 rounded-2xl bg-action p-5 text-white shadow-card dark:bg-gradient-to-br dark:from-[#070709] dark:via-[#141418] dark:to-[#202027] dark:text-white md:p-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-white/80 dark:text-[#FB923C]">TAPAR.AZ Axtarış</p><h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{activeSearch ? `“${activeSearch}” üçün nəticələr` : 'Bütün elanlar'}</h1><div className="mt-5 flex max-w-3xl rounded-xl border border-white/70 bg-white/95 p-1 shadow-lg shadow-black/10 dark:border-white/10 dark:bg-[#1B1B20] dark:shadow-black/25"><Input bordered={false} prefix={<SearchOutlined className="text-action dark:text-[#FB923C]" />} value={term} onChange={(event) => setTerm(event.target.value)} onPressEnter={search} placeholder="Elan, marka və ya model axtarın..." className="flex-1 !bg-transparent !text-ink dark:!text-white" /><button onClick={search} className="inline-flex items-center justify-center rounded-lg bg-action px-5 py-2 text-sm font-semibold text-white transition hover:bg-action/90 dark:bg-[#F97316] dark:text-[#070709] dark:hover:bg-[#FB923C]">Axtar</button></div></div>
    <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="market-surface p-4 lg:sticky lg:top-24"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><SlidersOutlined className="text-action" /><h2 className="font-semibold text-ink dark:text-white">Filterlər</h2></div><button type="button" onClick={clearFilters} className="text-xs font-semibold text-action">Təmizlə</button></div>
        <div className="mt-4 space-y-4"><label className="block"><span className="mb-1.5 block text-xs font-medium text-muted">Kateqoriya</span><Select allowClear showSearch optionFilterProp="label" listHeight={480} getPopupContainer={() => document.body} placeholder="Bütün kateqoriyalar" value={category} onChange={(value) => updateCategory(value as CategoryKey | undefined)} options={categories} optionRender={(option) => <div className="flex min-h-8 items-center gap-2"><img src={option.data.image ? `/category-icons/${option.data.image}.png` : undefined} alt="" width={20} height={20} className="!h-5 !w-5 max-h-5 max-w-5 shrink-0 object-contain" /><span className="truncate">{option.data.label}</span></div>} className="w-full" /></label>
          {activeCategory && <div><span className="mb-1.5 block text-xs font-medium text-muted">Alt kateqoriya</span><Select showSearch optionFilterProp="label" value={activeSubcategory?.key} options={activeCategory.subcategories.map((item) => ({ value: item.key, label: item.label }))} onChange={updateSubcategory} className="w-full" /></div>}
          <div><span className="mb-1.5 block text-xs font-medium text-muted">Şəhər</span><Select allowClear showSearch className="w-full" placeholder="Bütün şəhərlər" value={city} options={cities.map((item) => ({ value: item, label: item }))} onChange={setCity} /></div>
          <div><span className="mb-1.5 block text-xs font-medium text-muted">Qiymət (AZN)</span><div className="grid grid-cols-2 gap-2"><InputNumber min={0} className="w-full" placeholder="Min" value={minPrice} onChange={(value) => setMinPrice(value ?? undefined)} /><InputNumber min={0} className="w-full" placeholder="Maks" value={maxPrice} onChange={(value) => setMaxPrice(value ?? undefined)} /></div></div>
          {visibleFields.length > 0 && <div className="border-t border-line pt-4 dark:border-line-dark"><p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">{activeCategory?.label} filterləri</p><div className="space-y-3">{visibleFields.map((field) => <label key={field.name} className="block"><span className="mb-1.5 block text-xs font-medium text-muted">{field.label}</span><FilterField field={field} value={attributes[field.name]} onChange={(value) => updateAttribute(field.name, value)} /></label>)}</div></div>}
        </div>
      </aside>
      <section className="min-w-0"><div className="mb-4 flex items-center justify-between"><p className="text-sm text-muted">{loading && listings.length === 0 ? 'Elanlar yüklənir…' : `${listings.length} elan`}</p>{activeCategory && <span className="rounded-full bg-action/10 px-3 py-1 text-xs font-semibold text-action">{activeCategory.label}</span>}</div>{loading && listings.length === 0 ? <div className="market-surface py-24 text-center text-muted">Firebase elanları yüklənir…</div> : listings.length === 0 ? <Empty description={error ? 'Firebase elanlarını yükləmək mümkün olmadı.' : 'Axtarışa uyğun elan tapılmadı'} className="market-surface py-24" /> : <><div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">{listings.map((item) => <ListingCard key={item.id} listing={item} />)}</div>{hasMore && <div className="mt-8 text-center"><button onClick={loadMore} disabled={loadingMore} className="market-action px-5 py-2.5">{loadingMore ? 'Yüklənir…' : 'Daha çox göstər'}</button></div>}</>}</section>
    </div>
  </div></main>;
}
