import { useEffect, useState } from 'react';
import { Alert, Button, Input, List, Tag, message } from 'antd';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';
import AdminAccess from './AdminAccess';

type UserRow = { uid: string; email: string; displayName: string };
export default function AdminUsers() {
  const { isAdmin, user } = useAuth(); const [users, setUsers] = useState<UserRow[]>([]); const [access, setAccess] = useState<string[]>([]); const [email, setEmail] = useState('');
  useEffect(() => { if (!isAdmin) return; void Promise.all([getDocs(collection(db, 'users')), getDocs(collection(db, 'tapar_admins'))]).then(([u, a]) => { setUsers(u.docs.map((d) => d.data() as UserRow)); setAccess(a.docs.map((d) => d.id)); }); }, [isAdmin]);
  if (!isAdmin) return <AdminAccess />;
  const grant = async () => { const target = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()); if (!target) { message.error('Bu email ilə qeydiyyatda olan user tapılmadı.'); return; } await setDoc(doc(db, 'tapar_admins', target.uid), { uid: target.uid, email: target.email.toLowerCase(), name: target.displayName, active: true, grantedBy: user?.uid, grantedAt: Date.now() }); setAccess((x) => [...new Set([...x, target.uid])]); setEmail(''); message.success(`${target.email} üçün admin access verildi.`); };
  const revoke = async (uid: string) => { if (uid === user?.uid) return message.warning('Öz access-inizi silə bilməzsiniz.'); await deleteDoc(doc(db, 'tapar_admins', uid)); setAccess((x) => x.filter((id) => id !== uid)); message.success('Access silindi.'); };
  return <><div className="mb-8"><p className="text-orange-400 text-xs uppercase tracking-[.2em]">Access control</p><h1 className="text-3xl font-bold mt-2">İstifadəçilər</h1></div><Alert className="mb-6" type="info" message="Email ilə admin access ver" description="İstifadəçi əvvəlcə sistemdə qeydiyyatda olmalıdır." /><div className="flex gap-2 max-w-xl mb-8"><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" onPressEnter={() => void grant()} /><Button type="primary" onClick={() => void grant()}>Access ver</Button></div><List className="admin-dark-list" bordered dataSource={users} renderItem={(u) => <List.Item actions={[access.includes(u.uid) ? <Button danger onClick={() => void revoke(u.uid)} disabled={u.uid === user?.uid}>Access sil</Button> : <Tag>Adi user</Tag>]}><List.Item.Meta title={<span className="text-white">{u.displayName}</span>} description={<span className="text-white/45">{u.email}</span>} /></List.Item>} />
  </>;
}
