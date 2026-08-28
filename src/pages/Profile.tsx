import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, Avatar, Tag, Dropdown, Empty, message, Popconfirm } from 'antd';
import { UserOutlined, MoreOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { useMyListings } from '@/hooks/useMyListings';
import { formatPrice, formatRelativeDate } from '@/utils/format';
import type { Listing, ListingStatus } from '@/types';

const STATUS_LABEL: Record<ListingStatus, string> = { active: 'Aktiv', inactive: 'Deaktiv', sold: 'Satılıb' };
const STATUS_COLOR: Record<ListingStatus, string> = { active: 'green', inactive: 'default', sold: 'blue' };

export default function Profile() {
  const { user, profile } = useAuth();
  const { listings, loading, setStatus, remove } = useMyListings();
  const [tab, setTab] = useState('listings');

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Avatar size={64} src={profile?.photoURL} icon={<UserOutlined />} className="bg-graphite" />
        <div>
          <h1 className="font-display text-xl font-bold text-ink dark:text-white">{profile?.displayName ?? user.displayName}</h1>
          <p className="text-sm text-muted">{profile?.email ?? user.email}</p>
        </div>
      </div>

      <Tabs
        activeKey={tab}
        onChange={setTab}
        items={[
          {
            key: 'listings',
            label: 'Mənim elanlarım',
            children: <MyListingsTab listings={listings} loading={loading} onStatusChange={setStatus} onDelete={remove} />,
          },
          {
            key: 'info',
            label: 'Şəxsi məlumat',
            children: (
              <div className="max-w-sm space-y-3 text-sm">
                <InfoRow label="Ad Soyad" value={profile?.displayName ?? '—'} />
                <InfoRow label="Email" value={profile?.email ?? user.email ?? '—'} />
                <InfoRow label="Telefon" value={profile?.phone ?? 'Əlavə edilməyib'} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-line dark:border-line-dark pb-2">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-ink dark:text-white">{value}</span>
    </div>
  );
}

function MyListingsTab({
  listings, loading, onStatusChange, onDelete,
}: {
  listings: Listing[]; loading: boolean;
  onStatusChange: (id: string, status: ListingStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  if (loading) return <p className="text-muted text-sm py-8">Yüklənir...</p>;
  if (listings.length === 0) {
    return (
      <Empty description="Hələ elan yerləşdirməmisiniz" className="py-16">
        <Link to="/elan-yerlesdir" className="text-ink dark:text-white underline text-sm">Elan yerləşdir</Link>
      </Empty>
    );
  }

  return (
    <div className="divide-y divide-line dark:divide-line-dark border-t border-b border-line dark:border-line-dark mt-2">
      {listings.map((l) => (
        <div key={l.id} className="flex items-center gap-4 py-4">
          <div className="w-20 h-16 bg-offwhite dark:bg-black shrink-0 overflow-hidden border border-line dark:border-line-dark">
            {l.media[0] && <img src={l.media[0].url} alt="" className="w-full h-full object-cover" />}
          </div>
          <div className="flex-1 min-w-0">
            <Link to={`/elanlar/${l.id}`} className="font-medium text-ink dark:text-white hover:underline truncate block">{l.title}</Link>
            <div className="flex items-center gap-3 text-xs text-muted mt-1">
              <span>{l.price != null ? formatPrice(l.price) : 'Razılaşma'}</span>
              <span className="inline-flex items-center gap-1"><EnvironmentOutlined /> {l.city}</span>
              <span>{formatRelativeDate(l.createdAt)}</span>
            </div>
          </div>
          <Tag color={STATUS_COLOR[l.status]}>{STATUS_LABEL[l.status]}</Tag>
          <Dropdown
            menu={{
              items: [
                { key: 'edit', label: <Link to="/elan-yerlesdir">Redaktə et</Link> },
                l.status === 'active'
                  ? { key: 'deactivate', label: 'Deaktiv et', onClick: () => onStatusChange(l.id, 'inactive') }
                  : { key: 'activate', label: 'Aktivləşdir', onClick: () => onStatusChange(l.id, 'active') },
                { key: 'sold', label: 'Satıldı kimi işarələ', onClick: () => onStatusChange(l.id, 'sold') },
                {
                  key: 'delete',
                  label: (
                    <Popconfirm
                      title="Elanı silmək istədiyinizə əminsiniz?"
                      onConfirm={() => onDelete(l.id).then(() => message.success('Elan silindi.'))}
                      okText="Bəli" cancelText="Xeyr"
                    >
                      <span className="text-red-500">Sil</span>
                    </Popconfirm>
                  ),
                },
              ],
            }}
          >
            <button className="p-2 hover:bg-offwhite dark:hover:bg-graphite"><MoreOutlined /></button>
          </Dropdown>
        </div>
      ))}
    </div>
  );
}
