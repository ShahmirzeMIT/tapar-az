import { Link } from 'react-router-dom';
import { HeartOutlined, HeartFilled, StarFilled, VideoCameraFilled, EnvironmentOutlined, TeamOutlined } from '@ant-design/icons';
import { message } from 'antd';
import type { Listing } from '@/types';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/context/AuthContext';
import { formatDateTime, formatPrice, formatRelativeDate } from '@/utils/format';

export default function ListingCard({ listing }: { listing: Listing }) {
  const { user } = useAuth();
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
      className="group block border border-line dark:border-line-dark bg-paper dark:bg-graphite hover:border-ink dark:hover:border-white transition-colors duration-200 ease-editorial"
    >
      <div className="relative aspect-[4/3] bg-offwhite dark:bg-black overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={listing.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-editorial"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-xs">Şəkil yoxdur</div>
        )}

        <button
          onClick={handleFavClick}
          aria-label="Sevimlilərə əlavə et"
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform"
        >
          {fav ? <HeartFilled className="text-red-500" /> : <HeartOutlined className="text-ink dark:text-white" />}
        </button>

        {hasVideo && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-ink/85 text-white text-[10px] font-semibold px-2 py-1 rounded-sm">
            <VideoCameraFilled /> VIDEO
          </span>
        )}
      </div>

      <div className="p-3.5">
        <h3 className="text-sm font-medium text-ink dark:text-white line-clamp-2 leading-snug min-h-[2.5em]">
          {listing.title}
        </h3>

        <p className="mt-1.5 text-lg font-bold tracking-tight text-ink dark:text-white">
          {listing.priceHidden || listing.price == null ? 'Razılaşma yolu ilə' : formatPrice(listing.price)}
        </p>

        <div className="mt-2 flex items-center justify-between text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <EnvironmentOutlined /> {listing.city}
          </span>
          <span title={`Əlavə olunub: ${formatDateTime(listing.createdAt)}`}>
            Əlavə olunub: {formatRelativeDate(listing.createdAt)}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 text-ink dark:text-white">
            <StarFilled className="text-yellow-500" />
            {listing.ratingCount > 0 ? listing.ratingAvg.toFixed(1) : '—'}
            <span className="text-muted">({listing.ratingCount})</span>
          </span>
          {listing.viewCount > 0 && (
            <span className="inline-flex items-center gap-1 text-muted">
              <TeamOutlined /> {listing.viewCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
