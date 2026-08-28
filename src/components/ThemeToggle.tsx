import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { mode, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={mode === 'light' ? 'Qaranlıq rejimə keç' : 'İşıqlı rejimə keç'}
      className="w-9 h-9 flex items-center justify-center border border-line dark:border-line-dark hover:bg-offwhite dark:hover:bg-graphite transition-colors duration-200 ease-editorial text-ink dark:text-white"
    >
      {mode === 'light' ? <MoonOutlined /> : <SunOutlined />}
    </button>
  );
}
