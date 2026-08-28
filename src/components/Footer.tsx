import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="hidden md:block border-t border-line dark:border-line-dark mt-20 bg-footer">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-4 gap-10">
        <div>
          <div className="font-display text-xl font-bold tracking-tightest text-ink dark:text-white mb-3">
            TAPAR<span className="text-action">.AZ</span>
          </div>
          <p className="text-sm text-secondary dark:text-muted leading-relaxed">
            Azərbaycanın müasir elanlar bazarı. AI dəstəyi ilə sürətli və rahat alqı-satqı.
          </p>
        </div>
        <FooterCol title="Kateqoriyalar" links={[
          ['Avtomobillər', '/avtomobiller'], ['Daşınmaz Əmlak', '/kateqoriyalar'],
          ['İş Elanları', '/kateqoriyalar'], ['Xidmətlər', '/kateqoriyalar'],
        ]} />
        <FooterCol title="Platform" links={[
          ['Elan yerləşdir', '/elan-yerlesdir'], ['AI Elan', '/ai-elan'],
          ['Sevimlilər', '/favoriler'], ['Profil', '/profil'],
        ]} />
        <FooterCol title="Hesab" links={[['Daxil ol', '/login'], ['Qeydiyyat', '/register']]} />
      </div>
      <div className="border-t border-line dark:border-line-dark py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} TAPAR.AZ — Bütün hüquqlar qorunur.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-action mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="text-sm text-ink dark:text-white/90 hover:text-action transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
