import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Alert, Spin } from 'antd';
import { BulbFilled } from '@ant-design/icons';
import { useAIListing } from '@/hooks/useAIListing';
import { getCategory, getSubcategory } from '@/config/categories';
import { formatPrice } from '@/utils/format';

const { TextArea } = Input;

export default function AIListing() {
  const [input, setInput] = useState('');
  const { draft, loading, unavailable, error, generate, reset } = useAIListing();
  const navigate = useNavigate();

  const handleGenerate = () => {
    if (!input.trim()) return;
    generate(input);
  };

  const category = draft?.category ? getCategory(draft.category) : null;
  const subcategory = draft ? getSubcategory(draft.category, draft.subcategory) : null;

  const goToManualForm = () => navigate('/elan-yerlesdir');
  const goToFormWithDraft = () => {
    if (draft) navigate('/elan-yerlesdir', { state: { aiDraft: draft } });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <BulbFilled className="text-2xl text-ink dark:text-white" />
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-ink dark:text-white mt-2">
          AI Elan Yardımçısı
        </h1>
        <p className="text-sm text-muted mt-1">Sadəcə nə satdığınızı yazın, süni intellekt qalanını edəcək.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* INPUT — left on desktop, top on mobile */}
        <div>
          <label className="block text-sm font-medium mb-2 text-ink dark:text-white">Elanınızı təsvir edin</label>
          <TextArea
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Məs: 2015 Toyota Camry satıram, 145000 km yürüşü var, tam full paket, Bakıda yerləşir, qiyməti 24000 AZN"
          />
          <div className="flex gap-2 mt-3">
            <Button type="primary" size="large" loading={loading} onClick={handleGenerate} disabled={!input.trim()}>
              AI ilə elan yerləşdir
            </Button>
            {draft && <Button size="large" onClick={() => { reset(); setInput(''); }}>Yenidən yarat</Button>}
          </div>

          {unavailable && (
            <Alert
              className="mt-4"
              type="warning"
              showIcon
              message="AI xidməti hazırda əlçatan deyil"
              description={
                <span>
                  Narahat olmayın — heç bir məlumat itirilməyib. Elanı əl ilə yerləşdirə bilərsiniz.
                  <br />
                  <Button type="link" className="!p-0 !h-auto mt-1" onClick={goToManualForm}>Əl ilə davam et →</Button>
                </span>
              }
            />
          )}
          {error && !unavailable && <Alert className="mt-4" type="error" showIcon message={error} />}
        </div>

        {/* RESULT — right on desktop, below on mobile */}
        <div>
          <label className="block text-sm font-medium mb-2 text-ink dark:text-white">AI nəticəsi</label>
          <div className="border border-line dark:border-line-dark p-6 min-h-[20rem]">
            {loading && (
              <div className="flex items-center justify-center h-64"><Spin size="large" tip="AI hazırlanır..." /></div>
            )}

            {!loading && !draft && (
              <div className="flex items-center justify-center h-64 text-center text-muted text-sm">
                Elanınızı təsvir edin, AI nəticəsi burada görünəcək.
              </div>
            )}

            {!loading && draft && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted uppercase tracking-wide">Başlıq</p>
                  <p className="font-semibold text-ink dark:text-white">{draft.title || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wide">Təsvir</p>
                  <p className="text-sm whitespace-pre-line">{draft.description || '—'}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wide">Qiymət</p>
                    <p className="font-medium text-ink dark:text-white">{draft.price != null ? formatPrice(draft.price) : '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wide">Şəhər</p>
                    <p className="font-medium text-ink dark:text-white">{draft.city ?? '—'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wide">Kateqoriya</p>
                  <p className="font-medium text-ink dark:text-white">
                    {category ? `${category.label}${subcategory ? ` / ${subcategory.label}` : ''}` : 'Müəyyən edilmədi'}
                  </p>
                </div>

                {draft.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {draft.tags.map((t) => (
                      <span key={t} className="text-xs bg-offwhite dark:bg-graphite border border-line dark:border-line-dark px-2 py-1">{t}</span>
                    ))}
                  </div>
                )}

                {draft.warnings.length > 0 && (
                  <Alert
                    type="warning"
                    showIcon
                    message="Diqqət"
                    description={
                      <ul className="list-disc list-inside text-xs">
                        {draft.warnings.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    }
                  />
                )}

                <div className="flex gap-2 pt-2 border-t border-line dark:border-line-dark">
                  <Button type="primary" onClick={goToFormWithDraft}>Redaktə et</Button>
                  <Button onClick={handleGenerate}>Yenidən yarat</Button>
                </div>
                <p className="text-xs text-muted">
                  AI heç vaxt avtomatik dərc etmir — bütün məlumatları formada yoxlayıb özünüz dərc edəcəksiniz.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
