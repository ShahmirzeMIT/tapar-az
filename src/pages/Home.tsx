import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Skeleton } from 'antd';
import {
  SearchOutlined, ArrowRightOutlined, BulbFilled, CarOutlined, HomeOutlined,
  LaptopOutlined, ToolOutlined, GiftOutlined, TeamOutlined, SafetyCertificateOutlined,
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
      <section className="border-b border-line dark:border-line-dark bg-offwhite dark:bg-graphite">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
          <p className="market-section-label mb-4">{t('heroKicker')}</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tightest text-ink dark:text-white">
            {t('heroTitle')}
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted max-w-xl mx-auto">
            {t('heroText')}
          </p>

          <div className="mt-8 max-w-xl mx-auto flex gap-2">
            <Input
              size="large"
              placeholder={t('searchPlaceholder')}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onPressEnter={() => navigate(`/elanlar${q ? `?q=${encodeURIComponent(q)}` : ''}`)}
              className="flex-1"
            />
            <button
              onClick={() => navigate(`/elanlar${q ? `?q=${encodeURIComponent(q)}` : ''}`)}
              className="market-action px-6"
            >
              <SearchOutlined /> {t('search')}
            </button>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs text-muted">
            {['iPhone', 'Avtomobil', 'Laptop', 'PlayStation', 'Ev', 'Mebel'].map((item) => (
              <button key={item} onClick={() => navigate(`/elanlar?q=${encodeURIComponent(item)}`)} className="rounded-full border border-line dark:border-line-dark bg-paper dark:bg-graphite px-3 py-1.5 hover:border-action hover:text-action transition-colors">
                {item}
              </button>
            ))}
          </div>
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
