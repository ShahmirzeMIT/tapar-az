import { useEffect, useState } from 'react';
import { Alert, Avatar, Button, Empty, Input, Spin, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';
import AdminAccess from './AdminAccess';

type UserRow = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  phone?: string;
  createdAt?: unknown;
};

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U';
}

function formatDate(value: unknown) {
  if (!value) return '—';
  const millis = typeof value === 'number' ? value : typeof (value as { toMillis?: () => number }).toMillis === 'function' ? (value as { toMillis: () => number }).toMillis() : 0;
  return millis ? new Intl.DateTimeFormat('az-AZ', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(millis) : '—';
}

export default function AdminUsers() {
  const { isAdmin, user } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [access, setAccess] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) { setLoading(false); return; }
    let active = true;
    setLoading(true);
    setError(null);
    void Promise.all([getDocs(collection(db, 'users')), getDocs(collection(db, 'tapar_admins'))])
      .then(([usersSnapshot, adminsSnapshot]) => {
        if (!active) return;
        setUsers(usersSnapshot.docs.map((snapshot) => {
          const data = snapshot.data() as Partial<UserRow>;
          return {
            uid: data.uid || snapshot.id,
            email: data.email || '',
            displayName: data.displayName || data.email || 'Adsız istifadəçi',
            photoURL: data.photoURL || '',
            phone: data.phone,
            createdAt: data.createdAt,
          };
        }).filter((item) => item.uid).sort((a, b) => a.displayName.localeCompare(b.displayName, 'az')));
        setAccess(adminsSnapshot.docs.map((snapshot) => snapshot.id));
      })
      .catch((loadError) => { if (active) setError(loadError instanceof Error ? loadError.message : 'İstifadəçilər yüklənmədi.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [isAdmin]);

  if (!isAdmin) return <AdminAccess />;

  const grant = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const target = users.find((item) => item.email.toLowerCase() === normalizedEmail);
    if (!target) { message.error('Bu email ilə qeydiyyatda olan istifadəçi tapılmadı.'); return; }
    setWorking(true);
    try {
      await setDoc(doc(db, 'tapar_admins', target.uid), { uid: target.uid, email: target.email.toLowerCase(), name: target.displayName, active: true, grantedBy: user?.uid, grantedAt: Date.now() });
      setAccess((current) => [...new Set([...current, target.uid])]);
      setEmail('');
      message.success(`${target.email} üçün admin access verildi.`);
    } catch (grantError) { message.error(grantError instanceof Error ? grantError.message : 'Admin access verilə bilmədi.'); }
    finally { setWorking(false); }
  };

  const revoke = async (uid: string) => {
    if (uid === user?.uid) { message.warning('Öz access-inizi silə bilməzsiniz.'); return; }
    setWorking(true);
    try {
      await deleteDoc(doc(db, 'tapar_admins', uid));
      setAccess((current) => current.filter((id) => id !== uid));
      message.success('Access silindi.');
    } catch (revokeError) { message.error(revokeError instanceof Error ? revokeError.message : 'Access silinə bilmədi.'); }
    finally { setWorking(false); }
  };

  const columns: ColumnsType<UserRow> = [
    {
      title: 'İstifadəçi',
      key: 'user',
      render: (_, item) => <div className="flex items-center gap-3 min-w-[220px]">
        <Avatar size={44} src={item.photoURL || undefined} className="shrink-0 bg-action text-white" alt={item.displayName}>{!item.photoURL && initials(item.displayName)}</Avatar>
        <div className="min-w-0"><div className="font-semibold text-ink dark:text-white truncate">{item.displayName}</div><div className="text-xs text-muted mt-1 truncate">ID: {item.uid}</div></div>
      </div>,
    },
    { title: 'Email', dataIndex: 'email', key: 'email', render: (value: string) => <span className="text-ink dark:text-white break-all">{value || 'Email yoxdur'}</span> },
    { title: 'Telefon', dataIndex: 'phone', key: 'phone', render: (value: string) => <span className="text-muted">{value || '—'}</span> },
    { title: 'Qeydiyyat', dataIndex: 'createdAt', key: 'createdAt', render: (value: unknown) => <span className="text-muted whitespace-nowrap">{formatDate(value)}</span> },
    {
      title: 'Status', key: 'status', render: (_, item) => access.includes(item.uid) ? <Tag color="success">Admin</Tag> : <Tag>Adi user</Tag>,
    },
    {
      title: 'Əməliyyat', key: 'actions', align: 'right', render: (_, item) => access.includes(item.uid) ? <Button danger size="small" loading={working} disabled={item.uid === user?.uid || working} onClick={() => void revoke(item.uid)}>Access sil</Button> : <Button type="primary" ghost size="small" loading={working} disabled={working} onClick={() => { setEmail(item.email); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Access ver</Button>,
    },
  ];

  return <div className="max-w-[1400px] mx-auto py-3">
    <div className="mb-8"><p className="market-section-label">Access control</p><h1 className="font-display text-3xl font-bold text-ink dark:text-white mt-2">İstifadəçilər</h1><p className="text-sm text-muted mt-2">Bütün istifadəçiləri, profil şəkillərini və admin girişlərini idarə edin.</p></div>
    <Alert className="mb-6" type="info" showIcon message="Email ilə admin access ver" description="İstifadəçi əvvəlcə sistemdə qeydiyyatda olmalıdır." />
    <div className="flex flex-col sm:flex-row gap-2 max-w-xl mb-8"><Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="user@example.com" aria-label="İstifadəçi email-i" onPressEnter={() => void grant()} /><Button type="primary" loading={working} onClick={() => void grant()}>Access ver</Button></div>
    {error && <Alert className="mb-6" type="error" showIcon message="İstifadəçilər yüklənmədi" description={error} />}
    <div className="market-surface overflow-hidden">
      {loading ? <div className="flex justify-center py-16"><Spin size="large" /></div> : users.length === 0 ? <div className="py-16"><Empty description="Qeydiyyatda olan istifadəçi yoxdur" /></div> : <Table<UserRow> rowKey="uid" columns={columns} dataSource={users} pagination={{ pageSize: 10, showSizeChanger: false, hideOnSinglePage: true }} scroll={{ x: 980 }} />}
    </div>
  </div>;
}
