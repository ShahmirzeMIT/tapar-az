import { useState } from 'react';
import { Avatar, Input, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { formatDateTime } from '@/utils/format';

export default function Profile() {
  const { user, profile, updateUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName ?? user?.displayName ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="market-surface flex items-center gap-4 mb-8 p-5">
        <Avatar size={64} src={profile?.photoURL} icon={<UserOutlined />} className="bg-graphite" />
        <div>
          <h1 className="font-display text-xl font-bold text-ink dark:text-white">{profile?.displayName ?? user.displayName}</h1>
          <p className="text-sm text-muted">{profile?.email ?? user.email}</p>
        </div>
      </div>
      <div className="max-w-xl grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="market-surface md:col-span-2 p-5 space-y-4">
          <div><label className="block text-sm font-medium mb-1.5 text-ink dark:text-white">Ad Soyad</label><Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></div>
          <div><label className="block text-sm font-medium mb-1.5 text-ink dark:text-white">Telefon</label><Input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="+994 50 123 45 67" /></div>
          <Button type="primary" loading={saving} onClick={async () => {
            setSaving(true);
            try { await updateUserProfile(displayName, phone); message.success('Şəxsi məlumatlar yeniləndi.'); }
            catch (error) { message.error(error instanceof Error ? error.message : 'Məlumatları yeniləmək mümkün olmadı.'); }
            finally { setSaving(false); }
          }}>Məlumatları yadda saxla</Button>
        </div>
        <InfoRow label="Email" value={profile?.email ?? user.email ?? '—'} hint="Email dəyişdirilə bilməz" />
        <InfoRow label="Qeydiyyat tarixi" value={formatDateTime(profile?.createdAt)} />
      </div>
    </div>
  );
}

function InfoRow({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return <div className="border border-line dark:border-line-dark p-4"><span className="text-xs text-muted block">{label}</span><span className="font-medium text-ink dark:text-white block mt-1 break-all">{value}</span>{hint && <span className="text-[11px] text-muted block mt-1">{hint}</span>}</div>;
}
