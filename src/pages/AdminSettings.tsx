import { Alert, Card } from 'antd';
import { useAuth } from '@/context/AuthContext';
import AdminAccess from './AdminAccess';
export default function AdminSettings() {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <AdminAccess />;
  return <><div className="mb-8"><p className="text-orange-400 text-xs uppercase tracking-[.2em]">System</p><h1 className="text-3xl font-bold mt-2">Ayarlar</h1></div><div className="grid gap-5 max-w-3xl"><Card title="Admin təhlükəsizliyi"><Alert type="success" showIcon message="Admin access aktivdir" description="Bu hesab elan təsdiqləyə və istifadəçilərə admin access verə bilər." /></Card><Card title="Brevo SMTP xidməti"><p className="text-sm text-gray-500">Approve, decline və yeni elan bildirişləri birbaşa server-side Brevo SMTP function-u ilə göndərilir. SMTP parolu frontend koduna daxil edilmir.</p></Card></div></>;
}
