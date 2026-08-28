import { TeamOutlined } from '@ant-design/icons';
import { usePresence } from '@/hooks/usePresence';

/** Full-message variant used on the listing details page. */
export function ActiveViewersFull({ listingId }: { listingId: string }) {
  const { activeCount } = usePresence(listingId);
  if (activeCount <= 0) return null;
  return (
    <div className="inline-flex items-center gap-1.5 text-sm text-ink dark:text-white bg-offwhite dark:bg-graphite px-3 py-1.5 border border-line dark:border-line-dark">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <TeamOutlined />
      {activeCount} nəfər hazırda bu elana baxır
    </div>
  );
}
