import { Link } from 'react-router-dom';
import { HeartOutlined, HeartFilled, StarFilled, VideoCameraFilled, EnvironmentOutlined, EyeOutlined, CalendarOutlined } from '@ant-design/icons';
import { message } from 'antd';
import type { Listing } from '@/types';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/context/AuthContext';
import { formatDateTime, formatPrice } from '@/utils/format';
import { useTranslation } from 'react-i18next';

export default function ListingCard({ listing }: { listing: Listing }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(listing.id);
  const hasVideo = listing.media.some((m) => m.type === 'video');
  const coverImage = listing.media.find((m) => m.type === 'image')?.url ?? listing.media[0]?.url;

  const handleFavClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      message.info('Sevimlilərə əlavə etmək üçün daxil olun.');
      return;
    }
    try {
      await toggleFavorite(listing.id);
    } catch {
      message.error('Xəta baş verdi.');
    }
  };

  return (
    <Link
      to={`/elanlar/${listing.id}`}
      className="group block rounded-xl border border-line dark:border-line-dark bg-paper dark:bg-graphite shadow-card hover:shadow-card-hover hover:-translate-y-0.5 hover:border-action transition-all duration-200 ease-editorial overflow-hidden"
    >
      <div className="relative aspect-[4/3] bg-offwhite dark:bg-graphite overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={listing.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-editorial"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-xs">{t('noImage')}</div>
        )}

        <button
          onClick={handleFavClick}
          aria-label="Sevimlilərə əlavə et"
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-graphite/70 backdrop-blur flex items-center justify-center hover:scale-110 hover:text-action transition-all"
        >
          {fav ? <HeartFilled className="text-urgent" /> : <HeartOutlined className="text-ink dark:text-white" />}
        </button>

        {hasVideo && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-action/85 text-white text-[10px] font-semibold px-2 py-1 rounded-sm">
            <VideoCameraFilled /> VIDEO
          </span>
        )}
      </div>

      <div className="p-3.5">
        <h3 className="text-sm font-semibold text-ink dark:text-white group-hover:text-action line-clamp-2 leading-snug min-h-[2.5em] transition-colors">
          {listing.title}
        </h3>

        <p className="mt-1.5 text-lg font-bold tracking-tight text-success">
          {listing.priceHidden || listing.price == null ? t('negotiable') : formatPrice(listing.price)}
        </p>

        <div className="mt-2 flex items-center justify-between text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <EnvironmentOutlined /> {listing.city}
          </span>
          <span title={`Əlavə olunub: ${formatDateTime(listing.createdAt)}`} className="inline-flex items-center gap-1">
            <CalendarOutlined /> {t('added')}: {formatDateTime(listing.createdAt)}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 text-ink dark:text-white">
            <StarFilled className="text-action" />
            {listing.ratingCount > 0 ? listing.ratingAvg.toFixed(1) : '—'}
            <span className="text-muted">({listing.ratingCount} {t('rating')})</span>
          </span>
          {listing.viewCount > 0 && (
            <span className="inline-flex items-center gap-1 text-muted">
            <EyeOutlined /> {listing.viewCount} {t('viewers')}
            </span>
          )}
        </div>

        <span className="market-action mt-4 w-full">
          {t('details')}
        </span>
      </div>
    </Link>
  );
}
