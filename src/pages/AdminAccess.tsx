import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, Alert, message } from 'antd';
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD, useAuth } from '@/context/AuthContext';

export default function AdminAccess() {
  const { user, isAdmin, loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_ADMIN_EMAIL);
  const [password, setPassword] = useState(DEMO_ADMIN_PASSWORD);
  const [loading, setLoading] = useState(false);
  useEffect(() => { if (isAdmin) navigate('/admin', { replace: true }); }, [isAdmin, navigate]);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password) return message.error('Email və parol daxil edin.');
    setLoading(true);
    try { await loginAdmin(email, password); message.success('Admin giriş uğurludur.'); }
    catch (error) { message.error(error instanceof Error ? error.message : 'Admin giriş mümkün olmadı.'); }
    finally { setLoading(false); }
  };
  return <div className="max-w-xl mx-auto py-10 lg:py-20">
    <div className="rounded-2xl border border-line bg-paper shadow-card p-7 lg:p-10">
      <div className="w-12 h-12 rounded-2xl bg-action/10 text-action flex items-center justify-center mb-6"><span className="text-2xl">🔐</span></div>
      <p className="text-xs uppercase tracking-[.2em] text-action mb-3">Admin giriş</p>
      <h1 className="text-3xl font-bold text-ink mb-3">TAPAR admin paneli</h1>
      <p className="text-muted text-sm leading-6 mb-6">Bu səhifə hamı üçün açıqdır. İdarəetmə linkləri yalnız admin access-i olan istifadəçilər üçün görünür.</p>
      {!user ? <Alert className="mb-6" type="info" message="Demo ilə başlamaq üçün məlumatları dəyişmədən Submit edin" /> : <Alert className="mb-6" type="warning" message="Bu hesabda admin access yoxdur" description={<Link className="text-action" to="/">Sayta qayıt</Link>} />}
      <form onSubmit={submit} className="space-y-4">
        <div><label className="block text-sm font-medium text-ink mb-1.5">Email</label><Input size="large" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></div>
        <div><label className="block text-sm font-medium text-ink mb-1.5">Password</label><Input.Password size="large" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></div>
        <Button htmlType="submit" type="primary" size="large" loading={loading} className="w-full">Submit</Button>
      </form>
      <p className="text-xs text-muted mt-5">Demo: {DEMO_ADMIN_EMAIL} · {DEMO_ADMIN_PASSWORD}</p>
    </div>
  </div>;
}
