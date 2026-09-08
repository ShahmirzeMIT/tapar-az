import { useEffect, useState } from 'react';
import { Button, Input, Select, message } from 'antd';
import { collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '@/firebase/config';
import { CATEGORIES } from '@/config/categories';
import { useAuth } from '@/context/AuthContext';
import { storeSlug, useMyStore } from '@/hooks/useStore';

export default function CreateStore() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { store, loading } = useMyStore(user?.uid);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bakı');
  const [category, setCategory] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!store) return;
    setName(store.name); setDescription(store.description); setPhone(store.phone ?? ''); setCity(store.city ?? 'Bakı'); setCategory(store.category ?? ''); setLogoPreview(store.logoUrl ?? '');
  }, [store]);

  if (!user) return null;
  const save = async () => {
    const cleanName = name.trim();
    const slug = storeSlug(cleanName);
    if (!cleanName || !slug) { message.error('Mağaza adı daxil edin.'); return; }
    setSaving(true);
    try {
      const id = store?.id ?? doc(collection(db, 'stores')).id;
      let logoUrl = store?.logoUrl ?? '';
      if (logoFile) {
        const logoRef = ref(storage, `stores/${user.uid}/${id}/logo-${Date.now()}-${logoFile.name}`);
        await uploadBytes(logoRef, logoFile, { contentType: logoFile.type });
        logoUrl = await getDownloadURL(logoRef);
      }
      const storeRef = doc(db, 'stores', id);
      const storeData = { name: cleanName, slug, description: description.trim(), phone: phone.trim(), city: city.trim(), category: category || null, logoUrl, updatedAt: serverTimestamp() };
      if (store) await updateDoc(storeRef, storeData);
      else await setDoc(storeRef, { ...storeData, ownerId: user.uid, verified: false, createdAt: serverTimestamp() });
      message.success(store ? 'Mağaza yeniləndi.' : 'Mağaza yaradıldı.');
      navigate(`/magaza/${slug}`);
    } catch (error) { message.error(error instanceof Error ? error.message : 'Mağazanı yadda saxlamaq olmadı.'); }
    finally { setSaving(false); }
  };
  return <main className="mx-auto max-w-3xl px-6 py-10 md:py-16">
    <div className="mb-8"><p className="market-section-label mb-2">TAPAR.AZ mağaza</p><h1 className="font-display text-3xl font-bold text-ink dark:text-white">{loading ? 'Mağaza yüklənir…' : store ? 'Mağazanı idarə et' : 'Öz mağazanı yarat'}</h1><p className="mt-2 text-sm text-muted">Elanlarınızı bir vitrində toplayın və alıcıların sizə daha asan güvənməsinə kömək edin.</p></div>
    <div className="market-surface space-y-5 p-6 md:p-8">
      <div className="flex items-center gap-4"><div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-action/10 text-3xl text-action">{logoPreview ? <img src={logoPreview} alt="Mağaza loqosu" className="h-full w-full object-cover" /> : '🏪'}</div><label className="text-sm font-medium text-ink dark:text-white">Mağaza profil şəkli<input className="mt-2 block w-full text-sm text-muted" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0] ?? null; setLogoFile(file); if (file) setLogoPreview(URL.createObjectURL(file)); }} /></label></div>
      <label className="block text-sm font-medium text-ink dark:text-white">Mağaza adı<Input className="mt-1.5" size="large" value={name} onChange={(event) => setName(event.target.value)} placeholder="Məs: Bakı Telefon Mərkəzi" /></label>
      <label className="block text-sm font-medium text-ink dark:text-white">Haqqında<Input.TextArea className="mt-1.5" rows={5} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Mağazanız və satdığınız məhsullar haqqında qısa məlumat" /></label>
      <div className="grid gap-5 md:grid-cols-3"><label className="block text-sm font-medium text-ink dark:text-white">Telefon<Input className="mt-1.5" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+994 50 123 45 67" /></label><label className="block text-sm font-medium text-ink dark:text-white">Şəhər<Input className="mt-1.5" value={city} onChange={(event) => setCity(event.target.value)} /></label><label className="block text-sm font-medium text-ink dark:text-white">Kateqoriya<Select allowClear className="mt-1.5 w-full" value={category || undefined} onChange={(value) => setCategory(value ?? '')} placeholder="Seçin" options={CATEGORIES.map((item) => ({ value: item.key, label: item.label }))} /></label></div>
      <Button type="primary" size="large" loading={saving} onClick={() => void save()}>Mağazanı yadda saxla</Button>
    </div>
  </main>;
}
