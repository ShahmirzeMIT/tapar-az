import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  ArrowRightOutlined, GiftOutlined, HomeOutlined, LaptopOutlined,
  SettingOutlined, TeamOutlined,
} from '@ant-design/icons';
import { CATEGORIES } from '@/config/categories';
import { useTranslation } from 'react-i18next';

export default function Categories() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-offwhite dark:bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-20">
       

        <div className="mb-5 flex items-center justify-between">
          <div><p className="market-section-label mb-1">Kəşf et</p><h2 className="font-display text-xl font-bold text-ink dark:text-white md:text-2xl">Bütün kateqoriyalar</h2></div>
          <span className="text-sm text-muted">{CATEGORIES.length} kateqoriya</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, index) => {
            const accents = [
              'from-[#eaf4fb] to-[#f5faff] text-[#4f91c1] dark:from-[#18364d] dark:to-[#112536] dark:text-[#9ac8e8]',
              'from-blue-100 to-blue-50 text-blue-600 dark:from-blue-950/60 dark:to-blue-900/20 dark:text-blue-300',
              'from-violet-100 to-violet-50 text-violet-600 dark:from-violet-950/60 dark:to-violet-900/20 dark:text-violet-300',
              'from-emerald-100 to-emerald-50 text-emerald-600 dark:from-emerald-950/60 dark:to-emerald-900/20 dark:text-emerald-300',
              'from-sky-100 to-sky-50 text-sky-600 dark:from-sky-950/60 dark:to-sky-900/20 dark:text-sky-300',
              'from-[#eaf4fb] to-[#f5faff] text-[#4f91c1] dark:from-[#18364d] dark:to-[#112536] dark:text-[#9ac8e8]',
            ];
            return (
              <Link key={cat.key} to={`/elanlar?category=${cat.key}`} className="group relative overflow-hidden rounded-2xl border border-line bg-paper p-5 transition-all duration-300 ease-editorial hover:-translate-y-1 hover:border-action/40 hover:shadow-[0_18px_35px_rgb(17_24_39/0.1)] dark:border-line-dark dark:bg-graphite">
                <span className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-action/5 transition-transform duration-500 group-hover:scale-150" />
                <div className="relative flex items-start justify-between">
                  <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-sm transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 ${accents[index % accents.length]}`}><CategoryIcon name={cat.icon} /></span>
                  <span className="font-display text-4xl font-bold text-ink/10 dark:text-white/10">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="relative mt-8 flex items-end justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink transition-colors group-hover:text-action dark:text-white">{t(`category.${cat.key}`, cat.label)}</h3>
                    <p className="mt-2 text-sm text-muted">{cat.subcategories[0]?.label}</p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-all duration-300 group-hover:border-action group-hover:bg-action group-hover:text-white dark:border-line-dark"><ArrowRightOutlined className="text-xs transition-transform group-hover:translate-x-0.5" /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CategoryIcon({ name }: { name: string }): ReactNode {
  const icons: Record<string, ReactNode> = {
    home: <HomeOutlined />, briefcase: <TeamOutlined />,
    tool: <SettingOutlined />, laptop: <LaptopOutlined />, gift: <GiftOutlined />,
  };
  return icons[name] ?? <GiftOutlined />;
}
