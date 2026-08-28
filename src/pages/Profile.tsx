import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, Avatar, Tag, Dropdown, Empty, message, Popconfirm, Input, Button } from 'antd';
import { UserOutlined, MoreOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { useMyListings } from '@/hooks/useMyListings';
import { formatDateTime, formatPrice, formatRelativeDate } from '@/utils/format';
import type { Listing, ListingStatus } from '@/types';

const STATUS_LABEL: Record<ListingStatus, string> = { active: 'Aktiv', inactive: 'Deaktiv', sold: 'Satılıb' };
const STATUS_COLOR: Record<ListingStatus, string> = { active: 'green', inactive: 'default', sold: 'blue' };

export default function Profile() {
  const { user, profile, updateUserProfile } = useAuth();
  const { listings, loading, setStatus, remove } = useMyListings();
  const [tab, setTab] = useState('listings');
  const [displayName, setDisplayName] = useState(profile?.displayName ?? user?.displayName ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [saving, setSaving] = useState(false);

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
              <div className="max-w-xl grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 border border-line dark:border-line-dark p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-ink dark:text-white">Ad Soyad</label>
                    <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-ink dark:text-white">Telefon</label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="+994 50 123 45 67" />
                  </div>
                  <Button
                    type="primary"
                    loading={saving}
                    onClick={async () => {
                      setSaving(true);
                      try {
                        await updateUserProfile(displayName, phone);
                        message.success('Şəxsi məlumatlar yeniləndi.');
                      } catch (error) {
                        message.error(error instanceof Error ? error.message : 'Məlumatları yeniləmək mümkün olmadı.');
                      } finally {
                        setSaving(false);
                      }
                    }}
                  >Məlumatları yadda saxla</Button>
                </div>
                <InfoRow label="Email" value={profile?.email ?? user.email ?? '—'} hint="Email dəyişdirilə bilməz" />
               
                <InfoRow label="Qeydiyyat tarixi" value={formatDateTime(profile?.createdAt)} />
                <InfoRow label="Elan sayı" value={String(listings.length)} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

function InfoRow({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="border border-line dark:border-line-dark p-4">
      <span className="text-xs text-muted block">{label}</span>
      <span className="font-medium text-ink dark:text-white block mt-1 break-all">{value}</span>
      {hint && <span className="text-[11px] text-muted block mt-1">{hint}</span>}
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
          <div className="w-20 h-16 bg-offwhite dark:bg-graphite shrink-0 overflow-hidden border border-line dark:border-line-dark">
            {l.media[0] && (l.media[0].type === 'video' ? (
              <video src={l.media[0].url} muted className="w-full h-full object-cover" />
            ) : (
              <img src={l.media[0].url} alt="" className="w-full h-full object-cover" />
            ))}
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
                      <span className="text-urgent">Sil</span>
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
