import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Empty, Input, InputNumber, Select } from 'antd';
import { SearchOutlined, SlidersOutlined } from '@ant-design/icons';
import ListingCard from '@/components/ListingCard';
import { useExternalListings } from '@/hooks/useExternalListings';

const sources = ['tap.az', 'bina.az', 'turbo.az', 'birmarket.az'];
const categories = [{ value: 'real_estate', label: 'Daşınmaz əmlak' }, { value: 'automobile', label: 'Avtomobil' }, { value: 'electronics', label: 'Elektronika' }];

export default function Listings() {
  const [params, setParams] = useSearchParams();
  const [term, setTerm] = useState(params.get('q') ?? '');
  const [source, setSource] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>(params.get('category') ?? undefined);
  const [minPrice, setMinPrice] = useState<number>();
  const [maxPrice, setMaxPrice] = useState<number>();
  const { listings } = useExternalListings({ searchTerm: params.get('q') ?? undefined, source, category, minPrice, maxPrice });
  const activeSearch = params.get('q');
  const sourceCount = useMemo(() => new Set(listings.map((item) => item.source)).size, [listings]);
  const search = () => { const next = new URLSearchParams(params); term.trim() ? next.set('q', term.trim()) : next.delete('q'); setParams(next); };

  return <main className="min-h-screen bg-offwhite dark:bg-background"><div className="mx-auto max-w-7xl px-6 py-8 md:py-12">
    <div className="mb-8 rounded-2xl bg-[#611F69] p-5 text-white shadow-card dark:bg-gradient-to-br dark:from-[#180d1a] dark:via-[#27132b] dark:to-[#3c1c42] dark:text-white md:p-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#f7edf9] dark:text-[#c185c9]">TAPAR.AZ Axtarış</p><h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{activeSearch ? `“${activeSearch}” üçün nəticələr` : 'Bütün elanlar'}</h1><div className="mt-5 flex max-w-3xl rounded-xl border border-white/70 bg-white/95 p-1 shadow-lg shadow-[#3c1241]/10 dark:border-white/10 dark:bg-[#0b1117] dark:shadow-black/25"><Input bordered={false} prefix={<SearchOutlined className="text-[#8d5b94] dark:text-[#c185c9]" />} value={term} onChange={(e) => setTerm(e.target.value)} onPressEnter={search} placeholder="Elan, marka və ya model axtarın..." className="flex-1 !bg-transparent !text-[#3c1241] dark:!text-white" /><button onClick={search} className="inline-flex items-center justify-center rounded-lg bg-[#3c1241] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2b0d2f] dark:bg-[#611F69] dark:text-white dark:hover:bg-[#7b3285]">Axtar</button></div></div>
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-paper p-3 dark:border-line-dark dark:bg-graphite"><SlidersOutlined className="text-action" /><Select allowClear placeholder="Kateqoriya" value={category} onChange={(value) => { setCategory(value); const next = new URLSearchParams(params); value ? next.set('category', value) : next.delete('category'); setParams(next); }} options={categories} className="w-48" /><Select allowClear placeholder="Mənbə" value={source} onChange={setSource} options={sources.map((value) => ({ value, label: value }))} className="w-44" /><InputNumber min={0} placeholder="Min qiymət" value={minPrice} onChange={(value) => setMinPrice(value ?? undefined)} /><InputNumber min={0} placeholder="Maks qiymət" value={maxPrice} onChange={(value) => setMaxPrice(value ?? undefined)} /><span className="ml-auto text-sm text-muted">{listings.length} elan · {sourceCount} mənbə</span></div>
    {listings.length === 0 ? <Empty description="Axtarışa uyğun elan tapılmadı" className="rounded-2xl bg-paper py-24 dark:bg-graphite" /> : <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{listings.map((item) => <ListingCard key={item.id} listing={item} />)}</div>}
  </div></main>;
}
