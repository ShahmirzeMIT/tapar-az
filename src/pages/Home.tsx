import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined, ArrowRightOutlined, HomeOutlined, MobileOutlined, DashboardOutlined, SettingOutlined, TeamOutlined, AppstoreOutlined, UsergroupAddOutlined, DatabaseOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { DEMO_EXTERNAL_LISTINGS } from '@/data/externalListings';
import { useExternalListings, externalListingLabel } from '@/hooks/useExternalListings';
import ListingCard from '@/components/ListingCard';

const categories = [
  { key: 'real_estate', label: 'Daşınmaz əmlak', icon: <HomeOutlined />, text: 'Bina və ev elanları' },
  { key: 'automobile', label: 'Avtomobil', icon: <DashboardOutlined />, text: 'Turbo.az-dan avtomobillər' },
  { key: 'electronics', label: 'Elektronika', icon: <MobileOutlined />, text: 'Telefon, kompüter və daha çox' },
  { key: 'services', label: 'Xidmətlər', icon: <SettingOutlined />, text: 'Usta və peşəkar xidmətlər' },
  { key: 'jobs', label: 'İş elanları', icon: <TeamOutlined />, text: 'Yeni iş imkanlarını tapın' },
  { key: 'home_garden', label: 'Ev və bağ', icon: <AppstoreOutlined />, text: 'Ev üçün hər şey bir yerdə' },
];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { listings } = useExternalListings();
  const goSearch = () => navigate(`/elanlar${search.trim() ? `?q=${encodeURIComponent(search.trim())}` : ''}`);

  return <div className="bg-paper dark:bg-background">
    <section className="relative overflow-hidden bg-gradient-to-br from-[#6BA8D8] via-[#78b3df] to-[#9bcae7] text-[#102b40] dark:from-[#080c10] dark:via-[#101a23] dark:to-[#182b3a] dark:text-white">
      <div className="pointer-events-none absolute -right-32 -top-32 h-[34rem] w-[34rem] rounded-full bg-white/35 blur-3xl dark:bg-[#6BA8D8]/10" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-[#2d6f9d]/20 blur-3xl dark:bg-black/35" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-[1.05fr_.95fr] md:py-24">
        <div className="w-full">
          <div className="mb-8 text-left">
            <h1 className="font-display text-4xl font-bold leading-[.95] tracking-[-.04em] text-white sm:text-5xl md:text-6xl">Axtar.<br /><span className="text-[#173b55] dark:text-[#d9efff]">Müqayisə et.</span><br />Tap.</h1>
          </div>
          <div className="flex w-full max-w-5xl rounded-2xl border border-white/70 bg-white/95 p-2 shadow-[0_22px_60px_rgb(23_59_85/0.2)] dark:border-white/10 dark:bg-[#111820]/95 dark:shadow-[0_22px_60px_rgb(0_0_0/0.45)]">
            <Input bordered={false} size="large" prefix={<SearchOutlined className="mr-2 text-[#6b879b] dark:text-[#8ba8bc]" />} placeholder="Elan, marka və ya model axtarın..." value={search} onChange={(e) => setSearch(e.target.value)} onPressEnter={goSearch} className="min-w-0 flex-1 !bg-transparent !text-[#173b55] dark:!text-white" />
            <button onClick={goSearch} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173b55] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#173b55]/20 transition hover:bg-[#102b40] dark:bg-[#6BA8D8] dark:text-[#08131c] dark:hover:bg-[#83b9df]">Axtar <ArrowRightOutlined /></button>
          </div>
          <div className="mt-5 flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 rounded-xl border border-white/40 bg-white/20 px-4 py-3 text-xs text-[#173b55]/75 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-white/65">
            <div className="flex flex-wrap items-center gap-2"><span className="mr-1 font-semibold uppercase tracking-[.12em]">Sürətli axtarış</span>{categories.slice(0, 4).map((cat) => <button key={cat.key} onClick={() => navigate(`/elanlar?category=${cat.key}`)} className="rounded-full border border-white/45 bg-white/35 px-3 py-1.5 font-medium transition hover:border-white hover:bg-white/60 hover:text-[#173b55] dark:border-white/15 dark:bg-white/10 dark:hover:bg-white/20 dark:hover:text-white">{cat.label}</button>)}</div>
            <div className="flex items-center gap-2 border-l border-white/40 pl-3 dark:border-white/15"><span className="h-1.5 w-1.5 rounded-full bg-[#2f9b68]" /> 4 mənbə bir yerdə</div>
          </div>
        </div>
        <div className="relative hidden md:block">
          <div className="absolute -right-4 -top-5 h-24 w-24 rounded-full border border-white/40 bg-white/20 blur-[1px]" />
          <div className="relative overflow-hidden rounded-[26px] border border-white/60 bg-white/55 p-3 shadow-[0_26px_80px_rgb(23_59_85/0.22)] backdrop-blur-xl dark:border-white/10 dark:bg-[#111820]/80 dark:shadow-[0_26px_80px_rgb(0_0_0/0.45)]">
            <div className="relative aspect-[1.5] overflow-hidden rounded-[18px] bg-[#dcecf6]"><img src={DEMO_EXTERNAL_LISTINGS[0].images[0]} alt="Seçilmiş elan" className="h-full w-full object-cover" /><span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-[#173b55] shadow-sm">{DEMO_EXTERNAL_LISTINGS[0].source}</span><span className="absolute bottom-3 left-3 rounded-full bg-[#173b55]/85 px-3 py-1.5 text-[11px] font-semibold text-white">Seçilmiş elan</span></div>
            <div className="px-2 pb-2 pt-4"><p className="truncate text-sm font-bold text-[#173b55] dark:text-white">{DEMO_EXTERNAL_LISTINGS[0].title}</p><div className="mt-3 flex items-end justify-between"><span className="text-xs text-[#173b55]/60 dark:text-white/55">{DEMO_EXTERNAL_LISTINGS[0].city} · {DEMO_EXTERNAL_LISTINGS[0].area} m²</span><span className="text-lg font-extrabold text-[#16a34a] dark:text-[#4ade80]">280 000 AZN</span></div></div>
          </div>
          <div className="absolute -bottom-7 -left-8 grid grid-cols-2 gap-2 rounded-2xl border border-white/60 bg-white/75 p-2 shadow-xl backdrop-blur dark:border-white/10 dark:bg-[#111820]/90"><div className="rounded-xl bg-[#eaf4fb] px-3 py-2.5 dark:bg-[#18364d]"><UsergroupAddOutlined className="text-[#4f91c1]" /><p className="mt-1 text-lg font-bold text-[#173b55] dark:text-white">24K+</p><p className="text-[10px] text-[#173b55]/60 dark:text-white/55">aktiv istifadəçi</p></div><div className="rounded-xl bg-[#eaf4fb] px-3 py-2.5 dark:bg-[#18364d]"><DatabaseOutlined className="text-[#4f91c1]" /><p className="mt-1 text-lg font-bold text-[#173b55] dark:text-white">4</p><p className="text-[10px] text-[#173b55]/60 dark:text-white/55">elan mənbəyi</p></div></div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <div className="mb-6 flex items-end justify-between">
        <div><p className="market-section-label mb-2">Kəşfə başla</p><h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Nə axtarırsınız?</h2></div>
        <button onClick={() => navigate('/elanlar')} className="hidden items-center gap-2 text-sm font-semibold text-muted hover:text-action sm:flex">Bütün elanlar <ArrowRightOutlined /></button>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, index) => <button key={cat.key} onClick={() => navigate(`/elanlar?category=${cat.key}`)} className="group flex min-h-[112px] items-center gap-4 rounded-2xl border border-line bg-paper px-4 py-4 text-left shadow-[0_4px_18px_rgb(17_24_39/0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-action/50 hover:shadow-card-hover dark:border-line-dark dark:bg-graphite md:min-h-[124px] md:px-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#eaf4fb] text-[25px] text-[#4f91c1] shadow-inner dark:bg-[#18364d] dark:text-[#9ac8e8]">{cat.icon}</span>
          <span className="min-w-0 flex-1"><span className="mb-1 block text-[10px] font-bold uppercase tracking-[.14em] text-action">0{index + 1} · Tapar</span><span className="block truncate font-display text-lg font-bold text-ink transition-colors group-hover:text-action dark:text-white">{cat.label}</span><span className="mt-1 block truncate text-xs text-muted">{cat.text}</span></span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-all group-hover:border-action group-hover:bg-action group-hover:text-white dark:border-line-dark"><ArrowRightOutlined className="text-xs" /></span>
        </button>)}
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 pb-20"><div className="mb-7 flex items-end justify-between"><div><p className="market-section-label mb-2">Yenilənən nəticələr</p><h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Son elanlar</h2></div><span className="text-sm text-muted">{listings.length} nəticə · {new Set(listings.map((x) => x.source)).size} mənbə</span></div><div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{listings.map((item) => <ListingCard key={item.id} listing={item} />)}</div></section>
  </div>;
}
