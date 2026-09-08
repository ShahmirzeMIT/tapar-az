import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Empty, Input, InputNumber, Select } from 'antd';
import { SearchOutlined, SlidersOutlined } from '@ant-design/icons';
import ListingCard from '@/components/ListingCard';
import { useExternalListings } from '@/hooks/useExternalListings';
import { useListings } from '@/hooks/useListings';
import { sourceLogo } from '@/utils/sourceLogos';
import type { Listing } from '@/types';

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
  const { listings: externalListings, loading: externalLoading } = useExternalListings({ searchTerm: params.get('q') ?? undefined, source, category, minPrice, maxPrice });
  const { listings: firebaseListings, loading: firebaseLoading, error: firebaseError } = useListings({ sort: 'newest' });
  const listings = useMemo(() => {
    const term = (params.get('q') ?? '').trim().toLocaleLowerCase('az-AZ');
    const local = firebaseListings.filter((item: Listing) => {
      const text = `${item.title} ${item.description}`.toLocaleLowerCase('az-AZ');
      const categoryMatches = !category || item.category === category || (category === 'automobile' && item.category === 'nəqliyyat') || (category === 'electronics' && item.category === 'elektronika');
      return (!term || text.includes(term)) && categoryMatches && (minPrice === undefined || (item.price ?? 0) >= minPrice) && (maxPrice === undefined || (item.price ?? 0) <= maxPrice);
    });
    return [...local, ...externalListings];
  }, [category, externalListings, firebaseListings, maxPrice, minPrice, params]);
  const activeSearch = params.get('q');
  const sourceCount = useMemo(() => new Set(listings.map((item) => 'source' in item ? item.source : 'TAPAR.AZ')).size, [listings]);
  const search = () => { const next = new URLSearchParams(params); term.trim() ? next.set('q', term.trim()) : next.delete('q'); setParams(next); };

  return <main className="min-h-screen bg-offwhite dark:bg-background"><div className="mx-auto max-w-7xl px-6 py-8 md:py-12">
    <div className="mb-8 rounded-2xl bg-action p-5 text-white shadow-card dark:bg-gradient-to-br dark:from-[#070709] dark:via-[#141418] dark:to-[#202027] dark:text-white md:p-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-white/80 dark:text-[#FB923C]">TAPAR.AZ Axtarış</p><h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{activeSearch ? `“${activeSearch}” üçün nəticələr` : 'Bütün elanlar'}</h1><div className="mt-5 flex max-w-3xl rounded-xl border border-white/70 bg-white/95 p-1 shadow-lg shadow-black/10 dark:border-white/10 dark:bg-[#1B1B20] dark:shadow-black/25"><Input bordered={false} prefix={<SearchOutlined className="text-action dark:text-[#FB923C]" />} value={term} onChange={(e) => setTerm(e.target.value)} onPressEnter={search} placeholder="Elan, marka və ya model axtarın..." className="flex-1 !bg-transparent !text-ink dark:!text-white" /><button onClick={search} className="inline-flex items-center justify-center rounded-lg bg-action px-5 py-2 text-sm font-semibold text-white transition hover:bg-action/90 dark:bg-[#F97316] dark:text-[#070709] dark:hover:bg-[#FB923C]">Axtar</button></div></div>
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-paper p-3 dark:border-line-dark dark:bg-graphite"><SlidersOutlined className="text-action" /><Select allowClear showSearch optionFilterProp="label" listHeight={480} popupMatchSelectWidth={false} getPopupContainer={() => document.body} placeholder="Kateqoriya seçin" value={category} onChange={(value) => { setCategory(value); const next = new URLSearchParams(params); value ? next.set('category', value) : next.delete('category'); setParams(next); }} options={categories} optionRender={(option) => <div className="flex items-center gap-3 py-1"><img src={`/category-icons/${option.data.image}.png`} alt="" className="h-9 w-9 shrink-0 object-contain" /><span className="text-sm">{option.data.label}</span></div>} className="w-64" /><Select allowClear showSearch optionFilterProp="label" placeholder="Mənbə seçin" value={source} onChange={setSource} options={sources} optionRender={(option) => <div className="flex items-center gap-3 py-1"><img src={option.data.image} alt="" className="h-6 w-6 rounded-full bg-white object-contain" /><span>{option.data.label}</span></div>} className="w-52" /><InputNumber min={0} placeholder="Min qiymət" value={minPrice} onChange={(value) => setMinPrice(value ?? undefined)} /><InputNumber min={0} placeholder="Maks qiymət" value={maxPrice} onChange={(value) => setMaxPrice(value ?? undefined)} /><span className="ml-auto text-sm text-muted">{listings.length} elan · {sourceCount} mənbə</span></div>
    {(externalLoading || firebaseLoading) && listings.length === 0 ? <div className="py-24 text-center text-muted">Elanlar yüklənir…</div> : listings.length === 0 ? <Empty description={firebaseError ? 'Firebase elanlarını yükləmək mümkün olmadı.' : 'Axtarışa uyğun elan tapılmadı'} className="rounded-2xl bg-paper py-24 dark:bg-graphite" /> : <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{listings.map((item) => <ListingCard key={`${'source' in item ? item.source : 'tapar'}-${item.id}`} listing={item} />)}</div>}
  </div></main>;
}
