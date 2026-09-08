import { Link } from 'react-router-dom';
import { CATEGORIES, categoryLabel, subcategoryLabel } from '@/config/categories';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';

export default function Categories() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-white mb-6">{t('categories')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <div key={cat.key} className="border border-line dark:border-line-dark p-6">
            <Link to={`/elanlar?category=${cat.key}`} className="font-display text-lg font-bold text-ink dark:text-white hover:underline">
              {categoryLabel(cat.key, language)}
            </Link>
            <ul className="mt-3 space-y-1.5">
              {cat.subcategories.map((s) => (
                <li key={s.key}>
                  <Link to={`/elanlar?category=${cat.key}`} className="text-sm text-muted hover:text-ink dark:hover:text-white">
                    {subcategoryLabel(s.key, language)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
