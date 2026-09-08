import { Link } from 'react-router-dom';
import { ArrowRightOutlined, AppstoreOutlined, CheckCircleFilled, RightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { CATEGORIES, categoryLabel, subcategoryLabel } from '@/config/categories';
import { useLanguage } from '@/context/LanguageContext';

export default function Categories() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return <main className="min-h-screen bg-offwhite pb-20 dark:bg-background">
    <section className="relative overflow-hidden bg-[#FF5A00] px-6 py-14 text-white md:py-20">
      <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-[#ffb07c]/30 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl"><p className="mb-4 text-xs font-bold uppercase tracking-[.22em] text-orange-300">TAPAR.AZ marketplace</p><h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl">{t('categories')}</h1><p className="mt-5 max-w-xl text-base leading-7 text-white/65 md:text-lg">Axtardığınız məhsulu kateqoriyalar üzrə daha tez tapın. Hər bölmədə özünə uyğun alt kateqoriyalar və filterlər mövcuddur.</p></div>
        </div>
        <div className="mt-10 flex flex-wrap gap-3 text-sm text-white/70"><span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">{CATEGORIES.length} əsas kateqoriya</span><span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">{CATEGORIES.reduce((total, category) => total + category.subcategories.length, 0)} alt kateqoriya</span><span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">Premium axtarış</span></div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-10 md:py-14"><div className="mb-7 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-action">Kataloq</p><h2 className="mt-2 font-display text-2xl font-bold text-ink dark:text-white md:text-3xl">Kateqoriya seçin</h2></div><Link to="/elanlar" className="hidden items-center gap-2 text-sm font-semibold text-action sm:inline-flex">Bütün elanlar <ArrowRightOutlined /></Link></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => <article key={category.key} className="group relative overflow-hidden rounded-2xl border border-line bg-paper p-5 shadow-[0_8px_30px_rgba(17,24,39,.05)] transition duration-300 hover:-translate-y-1 hover:border-action/40 hover:shadow-[0_18px_40px_rgba(17,24,39,.1)] dark:border-line-dark dark:bg-graphite">
          <Link to={`/elanlar?category=${encodeURIComponent(category.key)}`} className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-action/10 p-2.5 text-action transition group-hover:bg-action group-hover:text-white">{category.image ? <img src={`/category-icons/${category.image}.png`} alt="" className="h-full w-full object-contain" /> : <AppstoreOutlined className="text-2xl" />}</span>
            <span className="min-w-0 flex-1"><span className="flex items-center gap-1.5 font-display text-lg font-bold text-ink dark:text-white">{categoryLabel(category.key, language)}{category.key === 'elektronika' && <CheckCircleFilled className="text-xs text-action" />}</span><span className="mt-1 block text-xs text-muted">{category.subcategories.length} alt kateqoriya</span></span><RightOutlined className="mt-2 text-sm text-muted transition group-hover:translate-x-1 group-hover:text-action" />
          </Link>
          <div className="mt-5 border-t border-line pt-4 dark:border-line-dark"><div className="space-y-1">{category.subcategories.slice(0, 6).map((subcategory) => <Link key={subcategory.key} to={`/elanlar?category=${encodeURIComponent(category.key)}&subcategory=${encodeURIComponent(subcategory.key)}`} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-muted transition hover:bg-action/10 hover:text-action"><span className="truncate">{subcategoryLabel(subcategory.key, language)}</span><RightOutlined className="text-[10px] opacity-0 transition group-hover:opacity-100" /></Link>)}</div>{category.subcategories.length > 6 && <Link to={`/elanlar?category=${encodeURIComponent(category.key)}`} className="mt-3 inline-flex items-center gap-1 px-2 text-xs font-bold text-action">Hamısına bax <ArrowRightOutlined /></Link>}</div>
        </article>)}
      </div>
    </section>
  </main>;
}
