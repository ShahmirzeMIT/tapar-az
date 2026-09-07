import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined, ArrowRightOutlined, HomeOutlined, MobileOutlined, DashboardOutlined, SettingOutlined, TeamOutlined, AppstoreOutlined, UsergroupAddOutlined, DatabaseOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { DEMO_EXTERNAL_LISTINGS } from '@/data/externalListings';
import { useExternalListings, externalListingLabel } from '@/hooks/useExternalListings';
import ListingCard from '@/components/ListingCard';
import { sourceLogo } from '@/utils/sourceLogos';

const categories = [
  { key: 'home_garden', label: 'Ev və bağ üçün', image: 'home-garden', text: 'Mebel, dekor və bağ məhsulları' },
  { key: 'electronics', label: 'Elektronika', image: 'electronics', text: 'Telefon, kompüter və elektronika' },
  { key: 'automobile', label: 'Nəqliyyat', image: 'transport', text: 'Avtomobil, motosiklet və nəqliyyat' },
  { key: 'spare_parts', label: 'Ehtiyat hissələri və aksesuarlar', image: 'spare-parts', text: 'Avtomobil hissələri və aksesuarlar' },
  { key: 'real_estate', label: 'Daşınmaz əmlak', image: 'real-estate', text: 'Mənzil, ev, torpaq və obyektlər' },
  { key: 'services_business', label: 'Xidmətlər və biznes', image: 'services-business', text: 'Usta, xidmət və biznes elanları' },
  { key: 'personal', label: 'Şəxsi əşyalar', image: 'personal-items', text: 'Geyim, ayaqqabı və aksesuarlar' },
  { key: 'hobby', label: 'Hobbi və asudə', image: 'hobby-leisure', text: 'İdman, musiqi və istirahət' },
  { key: 'appliances', label: 'Məişət texnikası', image: 'home-appliances', text: 'Ev üçün texnika və avadanlıq' },
  { key: 'phones', label: 'Telefonlar', image: 'phones', text: 'Smartfon və telefon aksesuarları' },
  { key: 'kids', label: 'Uşaq aləmi', image: 'kids', text: 'Uşaq geyimi, arabalar və oyuncaqlar' },
  { key: 'animals', label: 'Heyvanlar', image: 'animals', text: 'Ev heyvanları və heyvan məhsulları' },
];

const sources = [
  { key: 'tap.az', label: 'Tap.az', image: sourceLogo('tap.az') },
  { key: 'bina.az', label: 'Bina.az', image: sourceLogo('bina.az') },
  { key: 'turbo.az', label: 'Turbo.az', image: sourceLogo('turbo.az') },
  { key: 'birmarket.az', label: 'Birmarket', image: sourceLogo('birmarket.az') },
];

const priceFilters = [
  { label: '0–10K AZN', query: '?maxPrice=10000' },
  { label: '10–50K AZN', query: '?minPrice=10000&maxPrice=50000' },
  { label: '50K+ AZN', query: '?minPrice=50000' },
];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { listings } = useExternalListings();
  const goSearch = () => navigate(`/elanlar${search.trim() ? `?q=${encodeURIComponent(search.trim())}` : ''}`);

  return <div className="bg-paper dark:bg-background">
    <section className="relative overflow-hidden bg-gradient-to-br from-[#611F69] via-[#7b3285] to-[#b26abb] text-white dark:from-[#180d1a] dark:via-[#27132b] dark:to-[#3c1c42] dark:text-white">
      <div className="pointer-events-none absolute -right-32 -top-32 h-[34rem] w-[34rem] rounded-full bg-white/35 blur-3xl dark:bg-[#611F69]/20" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-[#3c1241]/25 blur-3xl dark:bg-black/35" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-[1.05fr_.95fr] md:py-24">
        <div className="w-full">
          <div className="mb-8 text-left">
            <h1 className="font-display text-4xl font-bold leading-[.95] tracking-[-.04em] text-white sm:text-5xl md:text-6xl">Axtar.<br /><span className="text-[#f7edf9] dark:text-[#f0d9f3]">Müqayisə et.</span><br />Tap.</h1>
          </div>
          <div className="flex w-full max-w-5xl gap-2 rounded-2xl border border-white/70 bg-white/95 p-2 shadow-[0_22px_60px_rgb(23_59_85/0.2)] dark:border-white/10 dark:bg-[#111820]/95 dark:shadow-[0_22px_60px_rgb(0_0_0/0.45)]">
            <Input bordered={false} size="large" prefix={<SearchOutlined className="mr-2 text-[#8d5b94] dark:text-[#c185c9]" />} placeholder="Elan, marka və ya model axtarın..." value={search} onChange={(e) => setSearch(e.target.value)} onPressEnter={goSearch} className="min-w-0 flex-1 !bg-transparent !text-[#3c1241] dark:!text-white" />
            <button onClick={goSearch} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3c1241] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#3c1241]/20 transition hover:bg-[#2b0d2f] dark:bg-[#611F69] dark:text-white dark:hover:bg-[#7b3285]">Axtar <ArrowRightOutlined /></button>
          </div>
          <div className="mt-5 flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 rounded-xl border border-white/40 bg-white/20 px-4 py-3 text-xs text-white/85 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-white/65">
            <div className="flex flex-wrap items-center gap-2"><span className="mr-1 font-semibold uppercase tracking-[.12em]">Sürətli axtarış</span>{categories.slice(0, 4).map((cat) => <button key={cat.key} onClick={() => navigate(`/elanlar?category=${cat.key}`)} className="rounded-full border border-white/45 bg-white/35 px-3 py-1.5 font-medium transition hover:border-white hover:bg-white/60 hover:text-[#3c1241] dark:border-white/15 dark:bg-white/10 dark:hover:bg-white/20 dark:hover:text-white">{cat.label}</button>)}</div>
            <div className="flex items-center gap-2 border-l border-white/40 pl-3 dark:border-white/15"><span className="h-1.5 w-1.5 rounded-full bg-[#2f9b68]" /> 4 mənbə bir yerdə</div>
          </div>
        </div>
        <div className="relative hidden md:block">
          <div className="absolute -right-4 -top-5 h-24 w-24 rounded-full border border-white/40 bg-white/20 blur-[1px]" />
          <div className="relative overflow-hidden rounded-[26px] border border-white/60 bg-white/55 p-3 shadow-[0_26px_80px_rgb(23_59_85/0.22)] backdrop-blur-xl dark:border-white/10 dark:bg-[#111820]/80 dark:shadow-[0_26px_80px_rgb(0_0_0/0.45)]">
            <div className="relative aspect-[1.5] overflow-hidden rounded-[18px] bg-[#f3e8f5]"><img src={DEMO_EXTERNAL_LISTINGS[0].images[0]} alt="Seçilmiş elan" className="h-full w-full object-cover" /><span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-[#3c1241] shadow-sm">{DEMO_EXTERNAL_LISTINGS[0].source}</span><span className="absolute bottom-3 left-3 rounded-full bg-[#3c1241]/85 px-3 py-1.5 text-[11px] font-semibold text-white">Seçilmiş elan</span></div>
            <div className="px-2 pb-2 pt-4"><p className="truncate text-sm font-bold text-[#3c1241] dark:text-white">{DEMO_EXTERNAL_LISTINGS[0].title}</p><div className="mt-3 flex items-end justify-between"><span className="text-xs text-[#3c1241]/60 dark:text-white/55">{DEMO_EXTERNAL_LISTINGS[0].city} · {DEMO_EXTERNAL_LISTINGS[0].area} m²</span><span className="text-lg font-extrabold text-[#16a34a] dark:text-[#4ade80]">280 000 AZN</span></div></div>
          </div>
          <div className="absolute -bottom-7 -left-8 grid grid-cols-2 gap-2 rounded-2xl border border-white/60 bg-white/75 p-2 shadow-xl backdrop-blur dark:border-white/10 dark:bg-[#111820]/90"><div className="rounded-xl bg-[#f7edf9] px-3 py-2.5 dark:bg-[#36163b]"><UsergroupAddOutlined className="text-[#611F69]" /><p className="mt-1 text-lg font-bold text-[#3c1241] dark:text-white">24K+</p><p className="text-[10px] text-[#3c1241]/60 dark:text-white/55">aktiv istifadəçi</p></div><div className="rounded-xl bg-[#f7edf9] px-3 py-2.5 dark:bg-[#36163b]"><DatabaseOutlined className="text-[#611F69]" /><p className="mt-1 text-lg font-bold text-[#3c1241] dark:text-white">4</p><p className="text-[10px] text-[#3c1241]/60 dark:text-white/55">elan mənbəyi</p></div></div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <div className="mb-6 flex items-end justify-between">
        <div><p className="market-section-label mb-2">Kəşfə başla</p><h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Nə axtarırsınız?</h2></div>
        <button onClick={() => navigate('/elanlar')} className="hidden items-center gap-2 text-sm font-semibold text-muted hover:text-action sm:flex">Bütün elanlar <ArrowRightOutlined /></button>
      </div>
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="mr-1 text-[10px] font-bold uppercase tracking-[.14em] text-muted">Kateqoriya</span>
          <button onClick={() => navigate('/elanlar')} className="rounded-lg bg-action px-4 py-2 text-sm font-semibold text-white transition hover:bg-action/90">Hamısı</button>
          {categories.map((cat, index) => <button key={`${cat.key}-${index}`} onClick={() => navigate(`/elanlar?category=${cat.key}`)} className="inline-flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2 text-sm font-medium text-muted transition hover:border-action hover:text-action dark:border-line-dark dark:bg-graphite"><img src={`/category-icons/${cat.image}.png`} alt="" className="h-7 w-7 object-contain" />{cat.label}</button>)}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3 dark:border-line-dark">
          <span className="mr-1 text-[10px] font-bold uppercase tracking-[.14em] text-muted">Mənbə</span>
          {sources.map((source) => <button key={source.key} onClick={() => navigate(`/elanlar?source=${source.key}`)} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:border-action hover:text-action dark:border-line-dark"><img src={source.image} alt="" className="h-4 w-4 rounded-full bg-white object-contain" />{source.label}</button>)}
          <span className="ml-1 mr-1 text-[10px] font-bold uppercase tracking-[.14em] text-muted">Qiymət</span>
          {priceFilters.map((filter) => <button key={filter.label} onClick={() => navigate(`/elanlar${filter.query}`)} className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:border-action hover:text-action dark:border-line-dark">{filter.label}</button>)}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 pb-20"><div className="mb-7 flex items-end justify-between"><div><p className="market-section-label mb-2">Yenilənən nəticələr</p><h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Son elanlar</h2></div><span className="text-sm text-muted">{listings.length} nəticə · {new Set(listings.map((x) => x.source)).size} mənbə</span></div><div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{listings.map((item) => <ListingCard key={item.id} listing={item} />)}</div></section>
  </div>;
}
