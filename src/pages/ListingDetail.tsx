import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Breadcrumb, Skeleton, Result, Avatar, message } from 'antd';
import {
  EnvironmentOutlined, PhoneOutlined, UserOutlined, StarFilled,
} from '@ant-design/icons';
import { useListing } from '@/hooks/useListing';
import { useListings } from '@/hooks/useListings';
import RatingStars from '@/components/RatingStars';
import { ActiveViewersFull } from '@/components/ActiveViewers';
import ListingCard from '@/components/ListingCard';
import { getCategory, getSubcategory } from '@/config/categories';
import { formatDateTime, formatFullDateTime, formatPrice } from '@/utils/format';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { listing, loading, error } = useListing(id);
  const [activeMedia, setActiveMedia] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

  const handleMessageClick = () => {
    if (!user) {
      navigate('/login', { state: { from: `/elanlar/${id}` } });
      return;
    }
    if (user.uid === listing?.ownerId) {
      message.info('Öz elanınıza mesaj göndərə bilməzsiniz.');
      return;
    }
    if (listing) navigate(`/mesajlar/${listing.id}`);
  };

  const { listings: similar } = useListings({ category: listing?.category, sort: 'newest' });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Skeleton.Image active className="!w-full !h-96" />
        <Skeleton active className="mt-6" />
      </div>
    );
  }

  if (error || !listing) {
    return <Result status="404" title="Elan tapılmadı" subTitle={error ?? undefined} extra={<Link to="/elanlar">Elanlara qayıt</Link>} />;
  }

  const category = getCategory(listing.category);
  const subcategory = getSubcategory(listing.category, listing.subcategory);
  const specFields = subcategory?.fields ?? [];
  const media = listing.media.length > 0 ? listing.media : [];
  const current = media[activeMedia];

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 pb-28 md:pb-10">
      <Breadcrumb
        className="mb-4 text-sm"
        items={[
          { title: <Link to="/">Ana səhifə</Link> },
            { title: <Link to="/elanlar">{t('listings')}</Link> },
          { title: category?.label ?? listing.category },
          { title: listing.title },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
        {/* GALLERY */}
        <div>
          <div className="market-surface aspect-[4/3] bg-offwhite dark:bg-graphite overflow-hidden">
            {current ? (
              current.type === 'video' ? (
                <video src={current.url} controls className="w-full h-full object-contain" />
              ) : (
                <img src={current.url} alt={listing.title} className="w-full h-full object-contain" />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted">Şəkil yoxdur</div>
            )}
          </div>
          {media.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {media.map((m, i) => (
                <button
                  key={m.path}
                  onClick={() => setActiveMedia(i)}
                  className={`shrink-0 w-16 h-16 border ${i === activeMedia ? 'border-action' : 'border-line dark:border-line-dark'} overflow-hidden`}
                >
                  {m.type === 'video' ? (
                    <video src={m.url} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={m.url} alt="" className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* DESCRIPTION + SPECS */}
          <div className="mt-8">
            <h2 className="font-display text-lg font-bold text-ink dark:text-white mb-2">Təsvir</h2>
            <p className="text-sm text-ink/90 dark:text-white/90 whitespace-pre-line leading-relaxed">{listing.description}</p>
          </div>

          {specFields.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-lg font-bold text-ink dark:text-white mb-3">Xüsusiyyətlər</h2>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line dark:border-line-dark pt-4">
                {specFields
                  .filter((f) => listing.attributes[f.name] !== undefined && listing.attributes[f.name] !== '')
                  .map((f) => (
                    <div key={f.name} className="flex justify-between border-b border-line dark:border-line-dark pb-2 text-sm">
                      <dt className="text-muted">{f.label}</dt>
                      <dd className="font-medium text-ink dark:text-white text-right">
                        {formatAttrValue(listing.attributes[f.name], f)}
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-white">{listing.title}</h1>
          <p className="mt-2 text-3xl font-bold text-success">
            {listing.priceHidden || listing.price == null ? 'Razılaşma yolu ilə' : formatPrice(listing.price)}
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted">
            <span className="inline-flex items-center gap-1"><EnvironmentOutlined /> {listing.city}</span>
              <span title={formatDateTime(listing.createdAt)}>{t('added')}: {formatFullDateTime(listing.createdAt)}</span>
          </div>

          <div className="mt-4"><RatingStars listingId={listing.id} ratingAvg={listing.ratingAvg} ratingCount={listing.ratingCount} /></div>
          <div className="mt-3"><ActiveViewersFull listingId={listing.id} /></div>

          {/* SELLER */}
          <div className="market-surface mt-6 p-5">
            <div className="flex items-center gap-3">
              <Avatar size={44} icon={<UserOutlined />} className="bg-graphite" />
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted mb-0.5">{t('seller')}</p>
                <p className="font-semibold text-ink dark:text-white">{listing.ownerName}</p>
                <p className="text-xs text-muted inline-flex items-center gap-1">
                  <StarFilled className="text-action" /> {listing.ratingCount > 0 ? listing.ratingAvg.toFixed(1) : 'Yeni satıcı'}
                </p>
              </div>
            </div>
          
            <div className="mt-4">
              <button onClick={handleMessageClick} className="market-secondary-action mb-2 w-full">
                {t('messageSeller')}
              </button>
              <button
                onClick={() => setShowPhone(true)}
                className="w-full bg-action text-white py-2.5 text-sm font-semibold inline-flex items-center justify-center gap-2 hover:opacity-85"
              >
                <PhoneOutlined /> {showPhone ? (listing.phone || '—') : t('showPhone')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SIMILAR LISTINGS */}
      {similar.length > 1 && (
        <div className="mt-14">
          <h2 className="font-display text-xl font-bold text-ink dark:text-white mb-4">Oxşar elanlar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similar.filter((l) => l.id !== listing.id).slice(0, 4).map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </div>
      )}

      {/* MOBILE STICKY ACTIONS — does not block the gallery */}
      <div className="md:hidden fixed bottom-16 inset-x-0 z-30 bg-paper dark:bg-offwhite border-t border-line dark:border-line-dark p-3 flex gap-2">
        <button onClick={handleMessageClick} className="market-secondary-action w-1/2 py-3">
          Mesaj yaz
        </button>
        <button
          onClick={() => setShowPhone(true)}
          className="market-action w-1/2 py-3"
        >
          <PhoneOutlined /> {showPhone ? (listing.phone || '—') : t('showPhone')}
        </button>
      </div>
    </div>
  );
}

function formatAttrValue(value: unknown, field: { type: string; options?: { label: string; value: string }[] }): string {
  if (Array.isArray(value)) {
    if (field.options) {
      return value.map((v) => field.options!.find((o) => o.value === v)?.label ?? v).join(', ');
    }
    return value.join(', ');
  }
  if (typeof value === 'boolean') return value ? 'Bəli' : 'Xeyr';
  if (field.options) {
    return field.options.find((o) => o.value === value)?.label ?? String(value);
  }
  return String(value);
}
