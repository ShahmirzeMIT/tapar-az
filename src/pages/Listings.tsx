import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Empty, Input, InputNumber, Select } from 'antd';
import { SearchOutlined, SlidersOutlined } from '@ant-design/icons';
import ListingCard from '@/components/ListingCard';
import { useExternalListings } from '@/hooks/useExternalListings';
import { sourceLogo } from '@/utils/sourceLogos';

const sources = ['tap.az', 'bina.az', 'turbo.az', 'birmarket.az'].map((value) => ({ value, label: value, image: sourceLogo(value) }));
const categories = [
  { value: 'home_garden', label: 'Ev və bağ üçün', image: 'home-garden' },
  { value: 'electronics', label: 'Elektronika', image: 'electronics' },
  { value: 'automobile', label: 'Nəqliyyat', image: 'transport' },
  { value: 'spare_parts', label: 'Ehtiyat hissələri və aksesuarlar', image: 'spare-parts' },
  { value: 'real_estate', label: 'Daşınmaz əmlak', image: 'real-estate' },
  { value: 'services_business', label: 'Xidmətlər və biznes', image: 'services-business' },
  { value: 'personal', label: 'Şəxsi əşyalar', image: 'personal-items' },
  { value: 'hobby', label: 'Hobbi və asudə', image: 'hobby-leisure' },
  { value: 'appliances', label: 'Məişət texnikası', image: 'home-appliances' },
  { value: 'phones', label: 'Telefonlar', image: 'phones' },
  { value: 'kids', label: 'Uşaq aləmi', image: 'kids' },
  { value: 'animals', label: 'Heyvanlar', image: 'animals' },
];

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
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-paper p-3 dark:border-line-dark dark:bg-graphite"><SlidersOutlined className="text-action" /><Select allowClear showSearch optionFilterProp="label" listHeight={480} popupMatchSelectWidth={false} getPopupContainer={() => document.body} placeholder="Kateqoriya seçin" value={category} onChange={(value) => { setCategory(value); const next = new URLSearchParams(params); value ? next.set('category', value) : next.delete('category'); setParams(next); }} options={categories} optionRender={(option) => <div className="flex items-center gap-3 py-1"><img src={`/category-icons/${option.data.image}.png`} alt="" className="h-9 w-9 shrink-0 object-contain" /><span className="text-sm">{option.data.label}</span></div>} className="w-64" /><Select allowClear showSearch optionFilterProp="label" placeholder="Mənbə seçin" value={source} onChange={setSource} options={sources} optionRender={(option) => <div className="flex items-center gap-3 py-1"><img src={option.data.image} alt="" className="h-6 w-6 rounded-full bg-white object-contain" /><span>{option.data.label}</span></div>} className="w-52" /><InputNumber min={0} placeholder="Min qiymət" value={minPrice} onChange={(value) => setMinPrice(value ?? undefined)} /><InputNumber min={0} placeholder="Maks qiymət" value={maxPrice} onChange={(value) => setMaxPrice(value ?? undefined)} /><span className="ml-auto text-sm text-muted">{listings.length} elan · {sourceCount} mənbə</span></div>
    {listings.length === 0 ? <Empty description="Axtarışa uyğun elan tapılmadı" className="rounded-2xl bg-paper py-24 dark:bg-graphite" /> : <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{listings.map((item) => <ListingCard key={item.id} listing={item} />)}</div>}
  </div></main>;
}
