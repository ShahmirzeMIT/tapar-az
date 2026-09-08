import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Empty, Input, InputNumber, Select } from 'antd';
import { SearchOutlined, SlidersOutlined } from '@ant-design/icons';
import ListingCard from '@/components/ListingCard';
import { useListings } from '@/hooks/useListings';
import type { CategoryKey } from '@/types';
import { CATEGORIES } from '@/config/categories';

const categories = CATEGORIES.map((item) => ({ value: item.key, label: item.label, image: item.image }));

export default function Listings() {
  const [params, setParams] = useSearchParams();
  const [term, setTerm] = useState(params.get('q') ?? '');
  const [category, setCategory] = useState<CategoryKey | undefined>(params.get('category') as CategoryKey | undefined);
  const [minPrice, setMinPrice] = useState<number>();
  const [maxPrice, setMaxPrice] = useState<number>();
  const { listings, loading, loadingMore, hasMore, loadMore, error } = useListings({ searchTerm: params.get('q') ?? undefined, category, minPrice, maxPrice, sort: 'newest' });
  const activeSearch = params.get('q');
  const search = () => { const next = new URLSearchParams(params); term.trim() ? next.set('q', term.trim()) : next.delete('q'); setParams(next); };

  return <main className="min-h-screen bg-offwhite dark:bg-background"><div className="mx-auto max-w-7xl px-6 py-8 md:py-12">
    <div className="mb-8 rounded-2xl bg-action p-5 text-white shadow-card dark:bg-gradient-to-br dark:from-[#070709] dark:via-[#141418] dark:to-[#202027] dark:text-white md:p-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-white/80 dark:text-[#FB923C]">TAPAR.AZ Axtarış</p><h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{activeSearch ? `“${activeSearch}” üçün nəticələr` : 'Bütün elanlar'}</h1><div className="mt-5 flex max-w-3xl rounded-xl border border-white/70 bg-white/95 p-1 shadow-lg shadow-black/10 dark:border-white/10 dark:bg-[#1B1B20] dark:shadow-black/25"><Input bordered={false} prefix={<SearchOutlined className="text-action dark:text-[#FB923C]" />} value={term} onChange={(e) => setTerm(e.target.value)} onPressEnter={search} placeholder="Elan, marka və ya model axtarın..." className="flex-1 !bg-transparent !text-ink dark:!text-white" /><button onClick={search} className="inline-flex items-center justify-center rounded-lg bg-action px-5 py-2 text-sm font-semibold text-white transition hover:bg-action/90 dark:bg-[#F97316] dark:text-[#070709] dark:hover:bg-[#FB923C]">Axtar</button></div></div>
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-paper p-3 dark:border-line-dark dark:bg-graphite"><SlidersOutlined className="text-action" /><Select allowClear showSearch optionFilterProp="label" listHeight={480} popupMatchSelectWidth={false} getPopupContainer={() => document.body} placeholder="Kateqoriya seçin" value={category} onChange={(value) => { setCategory(value as CategoryKey | undefined); const next = new URLSearchParams(params); value ? next.set('category', value) : next.delete('category'); setParams(next); }} options={categories} optionRender={(option) => <div className="flex items-center gap-3 py-1"><img src={option.data.image ? `/category-icons/${option.data.image}.png` : ''} alt="" className="h-9 w-9 shrink-0 object-contain" /><span className="text-sm">{option.data.label}</span></div>} className="w-64" /><InputNumber min={0} placeholder="Min qiymət" value={minPrice} onChange={(value) => setMinPrice(value ?? undefined)} /><InputNumber min={0} placeholder="Maks qiymət" value={maxPrice} onChange={(value) => setMaxPrice(value ?? undefined)} /><span className="ml-auto text-sm text-muted">{listings.length} elan</span></div>
    {loading && listings.length === 0 ? <div className="py-24 text-center text-muted">Firebase elanları yüklənir…</div> : listings.length === 0 ? <Empty description={error ? 'Firebase elanlarını yükləmək mümkün olmadı.' : 'Axtarışa uyğun elan tapılmadı'} className="rounded-2xl bg-paper py-24 dark:bg-graphite" /> : <><div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{listings.map((item) => <ListingCard key={item.id} listing={item} />)}</div>{hasMore && <div className="mt-8 text-center"><button onClick={loadMore} disabled={loadingMore} className="market-action px-5 py-2.5">{loadingMore ? 'Yüklənir…' : 'Daha çox göstər'}</button></div>}</>}
  </div></main>;
}
