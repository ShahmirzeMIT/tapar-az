import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Steps, Input, InputNumber, Select, Button, Switch, message, Alert } from 'antd';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { CATEGORIES, getCategory } from '@/config/categories';
import DynamicForm from '@/components/DynamicForm';
import MediaUploader from '@/components/MediaUploader';
import { pruneHiddenValues } from '@/utils/conditionalFields';
import { useAIListing } from '@/hooks/useAIListing';
import type { CategoryKey, ListingAttributes, MediaItem } from '@/types';
import { formatPrice } from '@/utils/format';

const { TextArea } = Input;
const CITIES = ['Bakı', 'Gəncə', 'Sumqayıt', 'Mingəçevir', 'Şəki', 'Naxçıvan', 'Lənkəran'];

const STEP_LABELS = ['Kateqoriya', 'Alt kateqoriya', 'Məlumatlar', 'Media', 'AI yoxlanışı', 'Önizləmə', 'Dərc et'];

export default function CreateListing() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = (location.state as { aiDraft?: import('@/types').AIListingDraft } | null)?.aiDraft;

  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<CategoryKey | undefined>(prefill?.category ?? undefined);
  const [subcategory, setSubcategory] = useState<string | undefined>(prefill?.subcategory ?? undefined);

  const [title, setTitle] = useState(prefill?.title ?? '');
  const [price, setPrice] = useState<number | undefined>(prefill?.price ?? undefined);
  const [priceHidden, setPriceHidden] = useState(false);
  const [city, setCity] = useState<string | undefined>(prefill?.city ?? undefined);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState(prefill?.description ?? '');
  const [attributes, setAttributes] = useState<ListingAttributes>(prefill?.attributes ?? {});
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [publishing, setPublishing] = useState(false);

  // A stable draft id used for storage paths before the Firestore doc exists
  const draftId = useMemo(() => doc(collection(db, 'listings')).id, []);

  const { draft, loading: aiLoading, unavailable, generate, improve } = useAIListing();
  const [aiInput, setAiInput] = useState('');

  const categoryConfig = getCategory(category);
  const subConfig = categoryConfig?.subcategories.find((s) => s.key === subcategory);

  const canProceedFrom = (s: number): boolean => {
    switch (s) {
      case 0: return Boolean(category);
      case 1: return Boolean(subcategory);
      case 2: return Boolean(title && city && description);
      default: return true;
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const applyAIDraft = () => {
    if (!draft) return;
    if (draft.title) setTitle(draft.title);
    if (draft.description) setDescription(draft.description);
    if (draft.price != null) setPrice(draft.price);
    if (draft.city) setCity(draft.city);
    if (draft.category) setCategory(draft.category);
    if (draft.subcategory) setSubcategory(draft.subcategory);
    setAttributes((prev) => ({ ...prev, ...draft.attributes }));
    message.success('AI təklifi tətbiq olundu — məlumatları yoxlayın.');
  };

  const handleImproveDescription = async () => {
    const improved = await improve(description, category ?? null);
    if (improved) setDescription(improved);
  };

  const handlePublish = async () => {
    if (!user) { message.error('Zəhmət olmasa daxil olun.'); return; }
    if (!category || !subcategory || !title || !city) { message.error('Zəhmət olmasa bütün tələb olunan sahələri doldurun.'); return; }

    setPublishing(true);
    try {
      const cleanedAttrs = subConfig ? pruneHiddenValues(subConfig.fields, attributes) : attributes;
      const ref = doc(db, 'listings', draftId);
      await setDoc(ref, {
        ownerId: user.uid,
        ownerName: profile?.displayName ?? user.displayName ?? 'İstifadəçi',
        category, subcategory, title,
        price: priceHidden ? null : price ?? null,
        priceHidden,
        currency: 'AZN',
        city, address, description,
        media,
        attributes: cleanedAttrs,
        status: 'active',
        viewCount: 0,
        ratingAvg: 0,
        ratingCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        aiAssisted: Boolean(prefill),
      });
      message.success('Elan uğurla dərc olundu!');
      navigate(`/elanlar/${draftId}`);
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Elan dərc edilərkən xəta baş verdi.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-white mb-6">Elan yerləşdir</h1>

      <Steps current={step} size="small" items={STEP_LABELS.map((label) => ({ title: label }))} className="mb-10 hidden md:flex" />
      <p className="md:hidden text-sm text-muted mb-6">Addım {step + 1} / {STEP_LABELS.length}: {STEP_LABELS[step]}</p>

      {/* STEP 0: CATEGORY */}
      {step === 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => { setCategory(c.key); setSubcategory(undefined); }}
              className={`p-6 border text-left transition-colors ${category === c.key ? 'border-ink dark:border-white bg-offwhite dark:bg-graphite' : 'border-line dark:border-line-dark hover:border-ink dark:hover:border-white'}`}
            >
              <p className="font-semibold text-ink dark:text-white">{c.label}</p>
            </button>
          ))}
        </div>
      )}

      {/* STEP 1: SUBCATEGORY */}
      {step === 1 && categoryConfig && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categoryConfig.subcategories.map((s) => (
            <button
              key={s.key}
              onClick={() => setSubcategory(s.key)}
              className={`p-6 border text-left transition-colors ${subcategory === s.key ? 'border-ink dark:border-white bg-offwhite dark:bg-graphite' : 'border-line dark:border-line-dark hover:border-ink dark:hover:border-white'}`}
            >
              <p className="font-semibold text-ink dark:text-white">{s.label}</p>
            </button>
          ))}
        </div>
      )}

      {/* STEP 2: UNIVERSAL + CATEGORY-SPECIFIC FIELDS */}
      {step === 2 && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div className="sm:col-span-2">
              <FieldLabel required>Başlıq</FieldLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Elanın başlığı" />
            </div>
            <div>
              <FieldLabel>Qiymət (AZN)</FieldLabel>
              <InputNumber className="w-full" value={price} onChange={(v) => setPrice(v ?? undefined)} disabled={priceHidden} min={0} />
              <label className="mt-1.5 flex items-center gap-2 text-xs text-muted">
                <Switch size="small" checked={priceHidden} onChange={setPriceHidden} /> Qiyməti gizlət (razılaşma yolu ilə)
              </label>
            </div>
            <div>
              <FieldLabel required>Şəhər</FieldLabel>
              <Select className="w-full" value={city} onChange={setCity} options={CITIES.map((c) => ({ label: c, value: c }))} />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Ünvan</FieldLabel>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Küçə, məhəllə (istəyə bağlı)" />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel required>Təsvir</FieldLabel>
              <TextArea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Elanınızı ətraflı təsvir edin" />
            </div>
          </div>

          {subConfig && (
            <div>
              <h3 className="font-semibold text-ink dark:text-white mb-4 border-t border-line dark:border-line-dark pt-6">
                {subConfig.label} — detallar
              </h3>
              <DynamicForm
                fields={subConfig.fields}
                values={attributes}
                onChange={(name, value) => setAttributes((prev) => ({ ...prev, [name]: value }))}
              />
            </div>
          )}
        </div>
      )}

      {/* STEP 3: MEDIA */}
      {step === 3 && (
        <MediaUploader listingId={draftId} media={media} onChange={setMedia} />
      )}

      {/* STEP 4: AI CHECK/IMPROVE (optional) */}
      {step === 4 && (
        <div className="space-y-5">
          <Alert
            type="info"
            showIcon
            message="AI ilə elanı yoxlayın və yaxşılaşdırın (istəyə bağlı)"
            description="AI yalnız sizin daxil etdiyiniz məlumatlar əsasında işləyir və heç vaxt uydurma fakt əlavə etmir."
          />
          {unavailable && (
            <Alert type="warning" showIcon message="AI xidməti hazırda əlçatan deyil" description="Elanı əl ilə davam etdirə bilərsiniz — heç bir məlumat itirilməyib." />
          )}
          <div>
            <FieldLabel>Təsviri əlavə təlimatla yaxşılaşdırın</FieldLabel>
            <div className="flex gap-2">
              <Input value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Məs: daha peşəkar tonda yaz" />
              <Button loading={aiLoading} onClick={handleImproveDescription}>AI ilə təsviri yaxşılaşdır</Button>
            </div>
          </div>
          <div>
            <FieldLabel>Sərbəst mətndən yenidən yarat</FieldLabel>
            <TextArea rows={4} value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Elanınızı sərbəst şəkildə təsvir edin..." />
            <Button className="mt-2" loading={aiLoading} onClick={() => generate(aiInput)}>AI ilə sahələri doldur</Button>
          </div>
          {draft && (
            <div className="border border-line dark:border-line-dark p-4">
              <p className="font-semibold text-sm mb-2">AI təklifi:</p>
              <p className="text-sm"><strong>Başlıq:</strong> {draft.title}</p>
              <p className="text-sm mt-1"><strong>Təsvir:</strong> {draft.description}</p>
              {draft.warnings.length > 0 && (
                <ul className="mt-2 text-xs text-amber-600 list-disc list-inside">
                  {draft.warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              )}
              <div className="flex gap-2 mt-3">
                <Button type="primary" onClick={applyAIDraft}>Redaktə et / Tətbiq et</Button>
                <Button onClick={() => generate(aiInput)}>Yenidən yarat</Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 5: PREVIEW */}
      {step === 5 && (
        <div className="border border-line dark:border-line-dark p-6 max-w-sm">
          <p className="text-xs text-muted mb-1">{categoryConfig?.label} / {subConfig?.label}</p>
          <h3 className="font-semibold text-lg text-ink dark:text-white">{title || 'Başlıqsız elan'}</h3>
          <p className="text-2xl font-bold mt-1 text-ink dark:text-white">
            {priceHidden || !price ? 'Razılaşma yolu ilə' : formatPrice(price)}
          </p>
          <p className="text-sm text-muted mt-1">{city}</p>
          <p className="text-sm mt-3 whitespace-pre-line">{description}</p>
          <p className="text-xs text-muted mt-3">{media.length} media faylı əlavə edilib</p>
        </div>
      )}

      {/* STEP 6: PUBLISH */}
      {step === 6 && (
        <div className="text-center py-10">
          <p className="text-lg font-semibold text-ink dark:text-white mb-2">Elanı dərc etməyə hazırsınız</p>
          <p className="text-sm text-muted mb-6">Dərc etdikdən sonra elanınız dərhal görünəcək.</p>
          <Button type="primary" size="large" loading={publishing} onClick={handlePublish}>Elanı yerləşdir</Button>
        </div>
      )}

      {/* NAVIGATION */}
      <div className="flex justify-between mt-10 pt-6 border-t border-line dark:border-line-dark">
        <Button disabled={step === 0} onClick={back}>Geri</Button>
        {step < STEP_LABELS.length - 1 && (
          <Button type="primary" disabled={!canProceedFrom(step)} onClick={next}>Növbəti</Button>
        )}
      </div>
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium mb-1.5 text-ink dark:text-white">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}
