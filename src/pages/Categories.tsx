import { Link } from 'react-router-dom';
import { CATEGORIES } from '@/config/categories';

export default function Categories() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-white mb-6">Kateqoriyalar</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <div key={cat.key} className="border border-line dark:border-line-dark p-6">
            <Link to={`/elanlar?category=${cat.key}`} className="font-display text-lg font-bold text-ink dark:text-white hover:underline">
              {cat.label}
            </Link>
            <ul className="mt-3 space-y-1.5">
              {cat.subcategories.map((s) => (
                <li key={s.key}>
                  <Link to={`/elanlar?category=${cat.key}`} className="text-sm text-muted hover:text-ink dark:hover:text-white">
                    {s.label}
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
