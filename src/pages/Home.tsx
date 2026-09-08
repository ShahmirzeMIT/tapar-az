import { useEffect, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Carousel, Input, Skeleton } from 'antd';
import { collection, getCountFromServer } from 'firebase/firestore';
import {
  SearchOutlined, ArrowRightOutlined, BulbFilled, CarOutlined, HomeOutlined,
  LaptopOutlined, ToolOutlined, GiftOutlined, TeamOutlined, SafetyCertificateOutlined, EnvironmentOutlined,
} from '@ant-design/icons';
import { CATEGORIES } from '@/config/categories';
import { useListings } from '@/hooks/useListings';
import ListingCard from '@/components/ListingCard';
import { useTranslation } from 'react-i18next';
import { db } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/utils/format';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [q, setQ] = useState('');
  const [userCount, setUserCount] = useState<number | null>(null);
  const { listings: latest, loading: latestLoading } = useListings({ sort: 'newest' });
  const { listings: cars, loading: carsLoading } = useListings({ category: 'nəqliyyat', sort: 'newest' });
  const latestTen = latest.slice(0, 10);

  useEffect(() => {
    if (!user) { setUserCount(null); return; }
    void getCountFromServer(collection(db, 'users')).then((result) => setUserCount(result.data().count)).catch(() => setUserCount(null));
  }, [user]);

  return (
    <div>
      {/* HERO */}
      <section className="overflow-hidden bg-[#fff7f2] dark:bg-graphite">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-12 md:grid-cols-[minmax(0,1fr)_minmax(360px,500px)] md:py-16 lg:gap-16">
          <div className="relative z-10"><p className="mb-4 text-xs font-bold uppercase tracking-[.22em] text-action">{t('heroKicker')}</p><h1 className="max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tightest text-ink dark:text-white md:text-6xl">{t('heroTitle')}</h1><p className="mt-5 max-w-xl text-base leading-7 text-muted md:text-lg">{t('heroText')}</p>
            <div className="mt-8 flex max-w-2xl gap-2 rounded-2xl border border-line bg-paper p-1.5 shadow-[0_14px_35px_rgba(255,90,0,.12)] dark:border-line-dark dark:bg-background"><Input size="large" bordered={false} placeholder={t('searchPlaceholder')} value={q} onChange={(e) => setQ(e.target.value)} onPressEnter={() => navigate(`/elanlar${q ? `?q=${encodeURIComponent(q)}` : ''}`)} className="flex-1 !bg-transparent" /><button onClick={() => navigate(`/elanlar${q ? `?q=${encodeURIComponent(q)}` : ''}`)} className="market-action rounded-xl px-5"><SearchOutlined /> {t('search')}</button></div>
          </div>
          <div className="relative"><div className="absolute -inset-5 rounded-[2rem] bg-action/10 blur-2xl" /><div className="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white p-3 shadow-[0_25px_70px_rgba(255,90,0,.2)] dark:border-line-dark dark:bg-background"><div className="mb-3 flex items-center justify-between px-2"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-action">Təzə elanlar</p><p className="mt-1 font-display text-lg font-bold text-ink dark:text-white">Son əlavə edilənlər</p></div><Link to="/elanlar" className="text-xs font-semibold text-action">Hamısına bax <ArrowRightOutlined /></Link></div><div className="relative">{latestLoading ? <div className="aspect-[4/3] animate-pulse rounded-2xl bg-offwhite dark:bg-graphite" /> : latestTen.length ? <Carousel autoplay autoplaySpeed={4200} pauseOnHover dots={{ className: '!bottom-3' }} className="hero-listing-carousel">{latestTen.map((listing) => <HeroListing key={listing.id} listing={listing} />)}</Carousel> : <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-offwhite text-sm text-muted dark:bg-graphite">Hələ aktiv elan yoxdur</div>}<div className="pointer-events-none absolute inset-x-5 top-4 z-10 grid grid-cols-3 gap-2"><HeroStat value={latest.length ? `${latest.length}+` : '0'} label="Aktiv elan" /><HeroStat value={userCount == null ? '—' : `${userCount}+`} label="İstifadəçi" /><HeroStat value="24/7" label="Axtarış imkanı" /></div></div></div></div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <SectionHeading title={t('popularCategories')} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              to={`/elanlar?category=${cat.key}`}
              className="group market-surface p-5 text-center hover:border-action hover:-translate-y-0.5 transition-all duration-200 ease-editorial"
            >
                <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-offwhite dark:bg-graphite text-ink dark:text-white group-hover:bg-action/10 group-hover:text-action transition-colors">
                <CategoryIcon name={cat.icon} />
              </span>
              <p className="text-sm font-semibold text-ink dark:text-white group-hover:text-action transition-colors">{cat.label}</p>
              <p className="mt-1 text-xs text-muted">{t('browseAds')}</p>
            </Link>
          ))}
        </div>
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

      {/* SELL CTA */}
      <section className="my-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-action/10 border border-action/20 px-8 py-14 md:py-20 text-center relative overflow-hidden shadow-card">
            <BulbFilled className="text-action text-3xl mb-4" />
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tightest text-ink dark:text-white">
              {t('sellEasy')}
            </h2>
            <p className="mt-4 text-sm md:text-base text-secondary dark:text-muted max-w-lg mx-auto">
              Elanınızı yerləşdirin, doğru alıcıya çatın. İstəsəniz AI köməkçisi başlıq və təsviri də sizin üçün hazırlayar.
            </p>
            <Link
              to="/ai-elan"
              className="market-action mt-8 px-7 py-3"
            >
              {t('placeYourAd')} <ArrowRightOutlined />
            </Link>
          </div>
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

function HeroStat({ value, label }: { value: string; label: string }) {
  return <div className="rounded-xl border border-white/60 bg-white/80 px-2 py-2 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-black/45"><p className="font-display text-base font-bold text-ink dark:text-white sm:text-xl">{value}</p><p className="mt-0.5 truncate text-[9px] font-medium text-ink/70 dark:text-white/75 sm:text-[10px]">{label}</p></div>;
}

function HeroListing({ listing }: { listing: import('@/types').Listing }) {
  const image = listing.media?.find((item) => item.type === 'image')?.url ?? listing.media?.[0]?.url;
  return <Link to={`/elanlar/${listing.id}`} className="group block overflow-hidden rounded-2xl bg-offwhite dark:bg-graphite"><div className="relative aspect-[4/3] overflow-hidden bg-[#f3eee9] dark:bg-background">{image ? <img src={image} alt={listing.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-sm text-muted">Şəkil yoxdur</div>}<div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" /><div className="absolute bottom-4 left-4 right-4"><p className="line-clamp-1 text-lg font-bold text-white">{listing.title}</p><div className="mt-1 flex items-center justify-between gap-2"><span className="text-sm text-white/80"><EnvironmentOutlined /> {listing.city}</span><span className="text-lg font-bold text-white">{listing.price == null ? 'Razılaşma' : formatPrice(listing.price)}</span></div></div></div></Link>;
}

function CategoryIcon({ name }: { name: string }) {
  const icons: Record<string, ReactNode> = {
    car: <CarOutlined />, home: <HomeOutlined />, briefcase: <TeamOutlined />,
    tool: <ToolOutlined />, laptop: <LaptopOutlined />, gift: <GiftOutlined />,
  };
  return icons[name] ?? <GiftOutlined />;
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
