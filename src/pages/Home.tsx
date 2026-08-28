import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Skeleton } from 'antd';
import { SearchOutlined, ArrowRightOutlined, BulbFilled } from '@ant-design/icons';
import { CATEGORIES } from '@/config/categories';
import { useListings } from '@/hooks/useListings';
import ListingCard from '@/components/ListingCard';

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const { listings: latest, loading: latestLoading } = useListings({ sort: 'newest' });
  const { listings: cars, loading: carsLoading } = useListings({ category: 'avtomobiller', sort: 'newest' });

  return (
    <div>
      {/* HERO */}
      <section className="border-b border-line dark:border-line-dark bg-offwhite dark:bg-graphite">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tightest text-ink dark:text-white">
            Azərbaycanın müasir<br />elanlar bazarı
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted max-w-xl mx-auto">
            Avtomobil, daşınmaz əmlak, iş elanları və daha çoxu — AI dəstəyi ilə saniyələr içində.
          </p>

          <div className="mt-8 max-w-xl mx-auto flex gap-2">
            <Input
              size="large"
              placeholder="Nə axtarırsınız?"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onPressEnter={() => navigate(`/elanlar${q ? `?q=${encodeURIComponent(q)}` : ''}`)}
              className="flex-1"
            />
            <button
              onClick={() => navigate(`/elanlar${q ? `?q=${encodeURIComponent(q)}` : ''}`)}
              className="bg-action text-white px-6 font-semibold hover:opacity-85 transition-opacity flex items-center gap-2"
            >
              <SearchOutlined /> Axtar
            </button>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <SectionHeading title="Populyar kateqoriyalar" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              to={`/elanlar?category=${cat.key}`}
              className="group border border-line dark:border-line-dark p-5 text-center hover:border-action hover:-translate-y-0.5 transition-all duration-200 ease-editorial bg-paper dark:bg-graphite"
            >
              <p className="text-sm font-medium text-ink dark:text-white">{cat.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* LATEST LISTINGS */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <SectionHeading title="Ən son elanlar" linkTo="/elanlar" />
        <ListingGrid listings={latest} loading={latestLoading} />
      </section>

      {/* AI CTA — main differentiator, PRD §16 */}
      <section className="my-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-action text-white px-8 py-14 md:py-20 text-center relative overflow-hidden">
            <BulbFilled className="text-3xl mb-4 opacity-90" />
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tightest">
              Elanınızı AI ilə saniyələr<br className="hidden md:block" /> içində yaradın
            </h2>
            <p className="mt-4 text-sm md:text-base opacity-80 max-w-lg mx-auto">
              Sadəcə nə satdığınızı yazın — TAPAR.AZ süni intellekti başlığı, təsviri və detalları
              sizin üçün hazırlayır. Siz yalnız yoxlayıb dərc edirsiniz.
            </p>
            <Link
              to="/ai-elan"
              className="mt-8 inline-flex items-center gap-2 bg-paper text-ink px-7 py-3 font-semibold hover:opacity-85 transition-opacity"
            >
              AI ilə elan yerləşdir <ArrowRightOutlined />
            </Link>
          </div>
        </div>
      </section>

      {/* POPULAR AUTOMOBILES */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <SectionHeading title="Populyar avtomobillər" linkTo="/avtomobiller" />
        <ListingGrid listings={cars} loading={carsLoading} />
      </section>
    </div>
  );
}

function SectionHeading({ title, linkTo }: { title: string; linkTo?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-ink dark:text-white">{title}</h2>
      {linkTo && (
        <Link to={linkTo} className="text-sm font-medium text-muted hover:text-ink dark:hover:text-white inline-flex items-center gap-1">
          Hamısına bax <ArrowRightOutlined className="text-xs" />
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
          <div key={i} className="border border-line dark:border-line-dark p-3">
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
