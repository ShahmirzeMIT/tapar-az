import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Skeleton } from 'antd';
import {
  SearchOutlined, ArrowRightOutlined, BulbFilled, CarOutlined, HomeOutlined,
  LaptopOutlined, ToolOutlined, GiftOutlined, TeamOutlined, SafetyCertificateOutlined,
  CheckCircleFilled, EnvironmentOutlined, HeartFilled, TagOutlined,
} from '@ant-design/icons';
import { CATEGORIES } from '@/config/categories';
import { useListings } from '@/hooks/useListings';
import ListingCard from '@/components/ListingCard';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [q, setQ] = useState('');
  const { listings: latest, loading: latestLoading } = useListings({ sort: 'newest' });
  const { listings: cars, loading: carsLoading } = useListings({ category: 'avtomobiller', sort: 'newest' });

  return (
    <div>
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-line dark:border-line-dark bg-offwhite dark:bg-graphite">
        <div className="pointer-events-none absolute -right-24 -top-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-action/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 -z-10 h-80 w-80 rounded-full bg-premium/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-14 md:grid-cols-[1.02fr_.98fr] md:gap-16 md:py-24">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-action/20 bg-action/10 px-3 py-1.5 text-xs font-semibold text-action">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-action" />
              {t('heroKicker')}
            </div>
            <h1 className="font-display text-5xl font-bold leading-[.94] tracking-tightest text-ink dark:text-white md:text-7xl">
              {t('heroTitle')}
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-secondary dark:text-muted md:text-lg">
              {t('heroText')}
            </p>

            <div className="mt-8 flex max-w-xl rounded-xl border border-line bg-paper p-1.5 shadow-[0_14px_35px_rgb(17_24_39/0.09)] dark:border-line-dark dark:bg-graphite">
              <Input
                bordered={false}
                size="large"
                prefix={<SearchOutlined className="mr-1 text-muted" />}
                placeholder={t('searchPlaceholder')}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onPressEnter={() => navigate(`/elanlar${q ? `?q=${encodeURIComponent(q)}` : ''}`)}
                className="min-w-0 flex-1 !bg-transparent"
              />
              <button onClick={() => navigate(`/elanlar${q ? `?q=${encodeURIComponent(q)}` : ''}`)} className="market-action shrink-0 px-5 md:px-7">
                {t('search')} <ArrowRightOutlined />
              </button>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="mr-1 font-medium">Trend:</span>
              {['iPhone', 'Avtomobil', 'Laptop', 'PlayStation'].map((item) => (
                <button key={item} onClick={() => navigate(`/elanlar?q=${encodeURIComponent(item)}`)} className="rounded-full border border-line bg-paper px-3 py-1.5 transition-colors hover:border-action hover:text-action dark:border-line-dark dark:bg-graphite">
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="relative mx-auto h-[25rem] w-full max-w-[30rem] md:h-[32rem]">
            <div className="absolute inset-5 rotate-3 rounded-[2rem] bg-action shadow-2xl shadow-action/20" />
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/70 bg-[#fffaf7] p-5 shadow-2xl dark:border-white/10 dark:bg-[#242424] md:p-7">
              <div className="flex items-center justify-between border-b border-black/10 pb-5 dark:border-white/10">
                <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-action">TAPAR.AZ</p><p className="mt-1 text-sm font-bold text-ink dark:text-white">Günün seçimi</p></div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-action/10 text-action"><HeartFilled /></span>
              </div>
              <div className="mt-5 rounded-2xl bg-gradient-to-br from-[#ffd7c2] via-[#fff0e7] to-[#f4b28c] p-5 dark:from-[#593222] dark:via-[#3b2923] dark:to-[#70402a]">
                <div className="flex h-36 items-center justify-center text-7xl drop-shadow-xl md:h-48 md:text-8xl">🚗</div>
              </div>
              <div className="mt-5 flex items-start justify-between gap-3">
                <div><p className="text-xs text-muted">Avtomobil · Bakı</p><p className="mt-1 font-display text-xl font-bold text-ink dark:text-white">Yeni imkanlar</p><p className="mt-1 flex items-center gap-1 text-xs text-muted"><EnvironmentOutlined /> Bakı, Azərbaycan</p></div>
                <p className="whitespace-nowrap text-lg font-bold text-action">12 500 AZN</p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-4 text-xs dark:border-white/10"><span className="flex items-center gap-1.5 text-success"><CheckCircleFilled /> Təsdiqlənmiş satıcı</span><span className="text-muted">Bu gün</span></div>
            </div>
            <div className="absolute -left-3 top-14 flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3 shadow-xl dark:border-line-dark dark:bg-graphite md:-left-8">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success"><TagOutlined /></span><span><b className="block text-sm text-ink dark:text-white">Minlərlə elan</b><small className="text-xs text-muted">Hər gün yenilənir</small></span>
            </div>
            <div className="absolute -bottom-4 -right-2 rounded-xl border border-line bg-paper px-4 py-3 shadow-xl dark:border-line-dark dark:bg-graphite md:-right-7"><p className="text-[10px] uppercase tracking-wider text-muted">Aktiv alıcılar</p><p className="mt-1 font-display text-2xl font-bold text-ink dark:text-white">24<span className="text-action">k+</span></p></div>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="border-b border-line bg-paper dark:border-line-dark dark:bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="market-section-label mb-2">TAPAR.AZ marketplace</p>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-white md:text-3xl">{t('popularCategories')}</h2>
            </div>
            <Link to="/kateqoriyalar" className="hidden items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-action sm:inline-flex">
              {t('viewAll')} <ArrowRightOutlined />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {CATEGORIES.map((cat, index) => {
            const accents = [
              'from-orange-100 to-orange-50 text-orange-600 dark:from-orange-950/60 dark:to-orange-900/20 dark:text-orange-300',
              'from-blue-100 to-blue-50 text-blue-600 dark:from-blue-950/60 dark:to-blue-900/20 dark:text-blue-300',
              'from-violet-100 to-violet-50 text-violet-600 dark:from-violet-950/60 dark:to-violet-900/20 dark:text-violet-300',
              'from-emerald-100 to-emerald-50 text-emerald-600 dark:from-emerald-950/60 dark:to-emerald-900/20 dark:text-emerald-300',
              'from-sky-100 to-sky-50 text-sky-600 dark:from-sky-950/60 dark:to-sky-900/20 dark:text-sky-300',
              'from-amber-100 to-amber-50 text-amber-600 dark:from-amber-950/60 dark:to-amber-900/20 dark:text-amber-300',
            ];
            return (
            <Link
              key={cat.key}
              to={`/elanlar?category=${cat.key}`}
              className="group relative min-h-44 overflow-hidden rounded-2xl border border-line bg-offwhite p-4 transition-all duration-300 ease-editorial hover:-translate-y-1 hover:border-action/40 hover:shadow-[0_16px_30px_rgb(17_24_39/0.09)] dark:border-line-dark dark:bg-graphite"
            >
              <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-action/5 transition-transform duration-500 group-hover:scale-[2.2]" />
              <span className="relative flex items-start justify-between">
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-xl shadow-sm transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 ${accents[index % accents.length]}`}>
                  <CategoryIcon name={cat.icon} />
                </span>
                <span className="font-display text-3xl font-bold text-ink/10 dark:text-white/10">0{index + 1}</span>
              </span>
              <span className="relative mt-8 block">
                <p className="text-sm font-bold leading-snug text-ink transition-colors group-hover:text-action dark:text-white">{cat.label}</p>
                <p className="mt-2 flex items-center gap-1 text-xs text-muted transition-colors group-hover:text-ink/60 dark:group-hover:text-white/70">{t('browseAds')} <ArrowRightOutlined className="text-[10px] transition-transform duration-300 group-hover:translate-x-1" /></p>
              </span>
            </Link>
            );
          })}
          </div>
          <Link to="/kateqoriyalar" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-action sm:hidden">
            {t('viewAll')} <ArrowRightOutlined />
          </Link>
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
