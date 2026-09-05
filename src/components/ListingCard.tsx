import { HeartOutlined, HeartFilled, EnvironmentOutlined, CalendarOutlined, CarOutlined, HomeOutlined, AppstoreOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { message } from 'antd';
import type { ExternalListing, Listing } from '@/types';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/utils/format';
import { externalListingLabel } from '@/hooks/useExternalListings';

const sourceStyles: Record<string, string> = {
  'bina.az': 'bg-[#e9f7ef] text-[#138a4b] dark:bg-[#123c28] dark:text-[#72dda2]',
  'tap.az': 'bg-[#fff1e8] text-[#ee5b12] dark:bg-[#4b2818] dark:text-[#ffae7c]',
  'turbo.az': 'bg-[#e9f0ff] text-[#2563eb] dark:bg-[#172d57] dark:text-[#8eb4ff]',
  'birmarket.az': 'bg-[#f2eaff] text-[#7c3aed] dark:bg-[#332052] dark:text-[#c6a9ff]',
};

export default function ListingCard({ listing }: { listing: ExternalListing | Listing }) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const external = 'source' in listing;
  const source = external ? listing.source : 'TAPAR.AZ';
  const coverImage = external ? listing.images[0] : listing.media[0]?.url;
  const fav = isFavorite(listing.id);
  const categoryIcon = external && listing.category === 'real_estate' ? <HomeOutlined /> : external && listing.category === 'automobile' ? <CarOutlined /> : <AppstoreOutlined />;
  const categoryLabel = external ? externalListingLabel(listing) : 'Elan';

  const handleFavorite = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!user) return message.info('Sevimlilərə əlavə etmək üçün daxil olun.');
    try { await toggleFavorite(listing.id); } catch { message.error('Xəta baş verdi.'); }
  };

  return (
    <a href={external ? listing.original_url : `/elanlar/${listing.id}`} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className="group block overflow-hidden rounded-[22px] border border-line bg-paper shadow-[0_4px_18px_rgb(17_24_39/0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-action/40 hover:shadow-[0_20px_45px_rgb(17_24_39/0.12)] dark:border-line-dark dark:bg-graphite">
      <div className="relative aspect-[1.18] overflow-hidden bg-offwhite dark:bg-background">
        {coverImage ? <img src={coverImage} alt={listing.title} loading="lazy" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-sm text-muted">Şəkil yoxdur</div>}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
        <div className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-[11px] font-extrabold tracking-tight shadow-sm ${sourceStyles[source] ?? 'bg-ink text-white'}`}>{source}</div>
        <button onClick={handleFavorite} aria-label="Sevimlilərə əlavə et" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition hover:scale-110 hover:text-action dark:bg-graphite/90 dark:text-white">
          {fav ? <HeartFilled className="text-urgent" /> : <HeartOutlined />}
        </button>
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-medium text-white/90"><span>{categoryLabel}</span><span className="rounded-full bg-black/25 px-2 py-1 backdrop-blur">Xarici elan</span></div>
      </div>
      <div className="p-5">
        <h3 className="min-h-[2.75em] text-[15px] font-bold leading-[1.35] tracking-[-.01em] text-ink transition-colors group-hover:text-action dark:text-white">{listing.title}</h3>
        <div className="mt-4 flex items-end justify-between gap-3"><p className="text-[22px] font-extrabold tracking-[-.04em] text-[#16a34a] dark:text-[#4ade80]">{listing.price === null ? 'Qiymət soruşun' : formatPrice(listing.price)}</p>{external && listing.listing_type && <span className="mb-1 rounded-md bg-offwhite px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-muted dark:bg-background">{listing.listing_type === 'sell' ? 'Satılır' : listing.listing_type}</span>}</div>
        <div className="mt-4 flex min-h-8 flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted">
          <span className="inline-flex items-center gap-1"><EnvironmentOutlined /> {listing.city ?? 'Azərbaycan'}{external && listing.district ? `, ${listing.district}` : ''}</span>
          {external && listing.rooms && <span>{listing.rooms} otaq</span>}
          {external && listing.area && <span>{listing.area} m²</span>}
          {external && listing.year && <span>{listing.year}</span>}
          {external && listing.mileage !== null && listing.mileage !== undefined && <span>{listing.mileage.toLocaleString('az-AZ')} km</span>}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-line pt-4 dark:border-line-dark"><span className="inline-flex items-center gap-1.5 text-[11px] text-muted"><CalendarOutlined /> {external && listing.published_at ? new Date(listing.published_at).toLocaleDateString('az-AZ') : 'Yeni elan'}</span><span className="inline-flex items-center gap-1 text-xs font-extrabold text-action transition-transform group-hover:translate-x-0.5">{source}-da bax <ArrowRightOutlined /></span></div>
      </div>
    </a>
  );
}
