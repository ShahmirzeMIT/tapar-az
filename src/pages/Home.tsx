import { useEffect, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Carousel, Input, Skeleton } from 'antd';
import { collection, getCountFromServer } from 'firebase/firestore';
import {
  SearchOutlined, ArrowRightOutlined, BulbFilled, CarOutlined, HomeOutlined, LaptopOutlined,
  ToolOutlined, GiftOutlined, TeamOutlined, SafetyCertificateOutlined,
} from '@ant-design/icons';
import { CATEGORIES } from '@/config/categories';
import { useListings } from '@/hooks/useListings';
import ListingCard from '@/components/ListingCard';
import { useTranslation } from 'react-i18next';
import { db } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [q, setQ] = useState('');
  const [userCount, setUserCount] = useState<number | null>(null);
  const { listings: latest, loading: latestLoading } = useListings({ sort: 'newest' });
  const { listings: cars, loading: carsLoading } = useListings({ category: 'nəqliyyat', sort: 'newest' });
  const latestSix = latest.slice(0, 6);

  useEffect(() => {
    if (!user) { setUserCount(null); return; }
    void getCountFromServer(collection(db, 'users')).then((result) => setUserCount(result.data().count)).catch(() => setUserCount(null));
  }, [user]);

  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      {/* HERO */}
      <section className="w-full min-w-0 overflow-visible bg-[#FF6C2C]">
        <div className="mx-auto grid w-full max-w-full min-w-0 grid-cols-1 items-center gap-10 px-4 py-10 sm:px-6 md:py-16 lg:max-w-7xl lg:grid-cols-[minmax(0,1fr)_minmax(360px,500px)] lg:gap-16">
          <div className="relative z-10"><p className="mb-4 text-xs font-bold uppercase tracking-[.22em] text-white/85">{t('heroKicker')}</p><h1 className="max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tightest text-white md:text-6xl">{t('heroTitle')}</h1><p className="mt-5 max-w-xl text-base leading-7 text-white/85 md:text-lg">{t('heroText')}</p>
            <div className="mt-8 flex max-w-2xl gap-2 rounded-2xl border border-line bg-paper p-1.5 shadow-[0_14px_35px_rgba(255,90,0,.12)] dark:border-line-dark dark:bg-background"><Input size="large" bordered={false} placeholder={t('searchPlaceholder')} value={q} onChange={(e) => setQ(e.target.value)} onPressEnter={() => navigate(`/elanlar${q ? `?q=${encodeURIComponent(q)}` : ''}`)} className="flex-1 !bg-transparent" /><button onClick={() => navigate(`/elanlar${q ? `?q=${encodeURIComponent(q)}` : ''}`)} className="market-action rounded-xl px-5"><SearchOutlined /> {t('search')}</button></div>
          </div>
          <div className="relative pb-3 md:pb-14">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-[#16A34A]/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/90 bg-white p-4 shadow-[0_25px_70px_rgba(22,163,74,.22)] dark:border-line-dark dark:bg-background">
              <div className="mb-4 flex flex-col items-start gap-2 px-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#16A34A]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-[#16A34A]"><span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />Canlı elanlar</div>
                  <p className="mt-2 font-display text-xl font-bold text-ink dark:text-white">Son əlavə edilənlər</p>
                </div>
                <Link to="/elanlar" className="inline-flex items-center gap-1 rounded-full border border-[#16A34A]/20 px-3 py-1.5 text-xs font-bold text-[#16A34A] transition hover:bg-[#16A34A]/10">Hamısına bax <ArrowRightOutlined /></Link>
              </div>
              <div>{latestLoading ? <div className="aspect-[4/3] animate-pulse rounded-[1.25rem] bg-offwhite dark:bg-graphite" /> : latestSix.length ? <Carousel autoplay autoplaySpeed={4200} pauseOnHover dots={{ className: '!bottom-3' }} className="hero-listing-carousel">{latestSix.map((listing) => <HeroListing key={listing.id} listing={listing} />)}</Carousel> : <div className="flex aspect-[4/3] items-center justify-center rounded-[1.25rem] bg-offwhite text-sm text-muted dark:bg-graphite">Hələ aktiv elan yoxdur</div>}</div>
            </div>
            <div className="pointer-events-none relative mt-5 grid grid-cols-3 gap-2 lg:absolute lg:inset-0 lg:mt-0 lg:block">
              <div className="z-20 lg:absolute lg:-right-[6.5rem] lg:top-14"><HeroStat value={latest.length ? `${latest.length}+` : '0'} label="Aktiv elan" delay="0ms" /></div>
              <div className="z-20 lg:absolute lg:-left-[6.5rem] lg:top-1/2 lg:-translate-y-1/2"><HeroStat value={userCount == null ? '—' : `${userCount}+`} label="İstifadəçi" delay="180ms" /></div>
              <div className="z-20 lg:absolute lg:bottom-[-3.5rem] lg:right-12"><HeroStat value="24/7" label="Axtarış imkanı" delay="360ms" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="mx-auto max-w-7xl bg-white px-6 py-14 md:px-8">
        <div className="flex items-end justify-between gap-4">
          <div><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[#FE6C2C]">Tapar.az seçimi</p><SectionHeading title={t('popularCategories')} /></div>
          <Link to="/kateqoriyalar" className="hidden rounded-full border border-[#FE6C2C]/25 px-4 py-2 text-sm font-bold text-[#FE6C2C] transition hover:bg-[#FE6C2C] hover:text-white sm:inline-flex">Hamısına bax</Link>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          {CATEGORIES.map((cat, index) => {
            return <Link key={cat.key} to={`/elanlar?category=${cat.key}`} style={{ animationDelay: `${index * 70}ms` }} className="category-card-reveal group relative flex h-24 items-center gap-2 overflow-hidden rounded-xl border border-[#E7E7E7] bg-white px-3 shadow-[0_8px_16px_rgba(17,24,39,.08)] transition duration-500 hover:-translate-y-1 hover:border-[#FE6C2C]/35 hover:shadow-[0_14px_26px_rgba(254,108,44,.22)]"><div className="absolute -right-8 -top-8 z-0 h-28 w-28 rounded-full bg-[#FE6C2C]/75 opacity-0 blur-[1px] transition duration-500 group-hover:opacity-100 group-hover:scale-125" /><CategoryIcon name={cat.icon} /><p className="relative z-10 min-w-0 flex-1 pr-10 font-display text-xs font-bold leading-tight text-black sm:text-sm">{cat.label}</p><span className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[#FE6C2C] text-[10px] font-extrabold text-white shadow-md transition duration-500 group-hover:rotate-6 group-hover:bg-white group-hover:text-[#FE6C2C]">{index + 1}</span></Link>;
          })}
        </div>
        <Link to="/kateqoriyalar" className="mt-5 inline-flex rounded-full border border-[#FE6C2C]/25 px-4 py-2 text-sm font-bold text-[#FE6C2C] transition hover:bg-[#FE6C2C] hover:text-white sm:hidden">Hamısına bax</Link>
      </section>

      {/* LATEST LISTINGS */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <SectionHeading title={t('latest')} linkTo="/elanlar" />
        <ListingGrid listings={latest} loading={latestLoading} />
      </section>

      {/* TRUST */}
      <section className="max-w-7xl mx-auto px-6 py-4 md:py-10">
        <div className="mb-5">
          <p className="market-section-label mb-2">{t('why')}</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-ink dark:text-white">{t('trustTitle')}</h2>
        </div>
        <div className="market-surface grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
          <TrustItem icon={<SafetyCertificateOutlined />} title={t('trust1')} text={t('trustText1')} />
          <TrustItem icon={<SearchOutlined />} title={t('trust2')} text={t('trustText2')} />
          <TrustItem icon={<TeamOutlined />} title={t('trust3')} text={t('trustText3')} />
        </div>
      </section>

  

      {/* POPULAR AUTOMOBILES */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <SectionHeading title={t('popularCars')} linkTo="/avtomobiller" />
        <ListingGrid listings={cars} loading={carsLoading} />
      </section>
    </div>
  );
}

function HeroStat({ value, label, delay }: { value: string; label: string; delay: string }) {
  return <div style={{ animationDelay: delay }} className="hero-stat-float pointer-events-auto flex h-[88px] w-[88px] shrink-0 cursor-default flex-col items-center justify-center rounded-full border-2 border-[#16A34A]/25 bg-white text-center shadow-[0_12px_28px_rgba(22,163,74,.2)] transition duration-300 hover:scale-110 hover:border-[#16A34A]/60 hover:shadow-[0_18px_42px_rgba(22,163,74,.42)] sm:h-[104px] sm:w-[104px]"><p className="font-display text-xl font-extrabold leading-none text-[#16A34A] sm:text-2xl">{value}</p><p className="mt-2 max-w-[80px] text-[9px] font-semibold leading-tight text-ink/70 sm:text-[10px]">{label}</p></div>;
}

function HeroListing({ listing }: { listing: import('@/types').Listing }) {
  const image = listing.media?.find((item) => item.type === 'image')?.url ?? listing.media?.[0]?.url;
  return <Link to={`/elanlar/${listing.id}`} className="group block overflow-hidden rounded-[1.35rem] border border-line bg-white shadow-[0_12px_32px_rgba(17,24,39,.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(17,24,39,.15)] dark:border-line-dark dark:bg-graphite"><div className="relative aspect-[1.8] overflow-hidden rounded-t-[1.35rem] bg-[#eee8e2] dark:bg-background">{image ? <img src={image} alt={listing.title} className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-sm text-muted">Şəkil yoxdur</div>}</div><div className="rounded-b-[1.35rem] p-3"><h3 className="line-clamp-2 font-display text-base font-bold leading-tight text-ink transition group-hover:text-[#16A34A] dark:text-white">{listing.title}</h3></div></Link>;
}

function TrustItem({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-action/10 text-action text-lg">{icon}</span>
      <div>
        <h3 className="font-semibold text-ink dark:text-white">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
      </div>
    </div>
  );
}

function CategoryIcon({ name }: { name: string }) {
  const icons: Record<string, ReactNode> = {
    car: <CarOutlined />, home: <HomeOutlined />, briefcase: <TeamOutlined />,
    tool: <ToolOutlined />, laptop: <LaptopOutlined />, gift: <GiftOutlined />,
  };
  return <span className="shrink-0 text-base text-black drop-shadow-sm"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">{icons[name] ?? <GiftOutlined />}</span></span>;
}

function SectionHeading({ title, linkTo }: { title: string; linkTo?: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-ink dark:text-white">{title}</h2>
      {linkTo && (
        <Link to={linkTo} className="text-sm font-medium text-muted hover:text-ink dark:hover:text-white inline-flex items-center gap-1">
          {t('viewAll')} <ArrowRightOutlined className="text-xs" />
        </Link>
      )}
    </div>
  );
}

function ListingGrid({ listings, loading }: { listings: import('@/types').Listing[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="market-surface p-3">
            <Skeleton.Image active className="!w-full !h-40" />
            <Skeleton active paragraph={{ rows: 2 }} title={false} className="mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return <p className="text-muted text-sm mt-6">Hələ elan yoxdur.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
      {listings.slice(0, 8).map((l) => <ListingCard key={l.id} listing={l} />)}
    </div>
  );
}
