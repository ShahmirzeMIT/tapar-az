import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Input, Avatar, Dropdown } from 'antd';
import {
  SearchOutlined, HeartOutlined, PlusOutlined, UserOutlined,
  HomeOutlined, BulbOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from './ThemeToggle';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative text-sm font-medium tracking-tight transition-colors duration-200 ease-editorial ${
    isActive ? 'text-action after:absolute after:-bottom-5 after:left-0 after:right-0 after:h-0.5 after:bg-action' : 'text-muted hover:text-action'
  }`;

export default function Header() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    navigate(`/elanlar${searchValue ? `?q=${encodeURIComponent(searchValue)}` : ''}`);
  };

  const userMenuItems = [
    { key: 'profile', label: <Link to="/profil">Profil</Link> },
    { key: 'listings', label: <Link to="/profil/elanlarim">Mənim elanlarım</Link> },
    { key: 'favorites', label: <Link to="/favoriler">Sevimlilər</Link> },
    { type: 'divider' as const },
    { key: 'logout', label: 'Çıxış', onClick: () => logout() },
  ];

  return (
    <>
      {/* Desktop / tablet header */}
      <header className="hidden md:block sticky top-0 z-40 bg-paper/95 dark:bg-offwhite/95 backdrop-blur border-b border-line dark:border-line-dark">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">
          <Link to="/" className="font-display text-xl font-bold tracking-tightest text-ink dark:text-white shrink-0">
            <span className="text-ink dark:text-white">TAPAR</span><span className="text-action">.AZ</span>
          </Link>

          <nav className="flex items-center gap-6 shrink-0">
            <NavLink to="/" end className={navLinkClass}>Ana səhifə</NavLink>
            <NavLink to="/elanlar" className={navLinkClass}>Elanlar</NavLink>
            <NavLink to="/avtomobiller" className={navLinkClass}>Avtomobillər</NavLink>
            <NavLink to="/kateqoriyalar" className={navLinkClass}>Kateqoriyalar</NavLink>
            <NavLink to="/favoriler" className={navLinkClass}>Favorilər</NavLink>
            <NavLink to="/ai-elan" className={navLinkClass}>
              <span className="inline-flex items-center gap-1"><BulbOutlined /> AI Elan</span>
            </NavLink>
          </nav>

          <div className="flex-1 max-w-md">
            <Input
              placeholder="Axtar..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={handleSearch}
              suffix={<SearchOutlined className="cursor-pointer text-action" onClick={handleSearch} />}
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle />
            <Link
              to="/elan-yerlesdir"
              className="inline-flex items-center gap-1.5 bg-action text-white px-4 py-2 text-sm font-semibold tracking-tight hover:opacity-85 transition-opacity"
            >
              <PlusOutlined /> Elan yerləşdir
            </Link>

            {user ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Avatar src={profile?.photoURL} icon={<UserOutlined />} className="cursor-pointer bg-graphite" />
              </Dropdown>
            ) : (
              <Link to="/login" className="text-sm font-medium hover:opacity-70">Daxil ol</Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile top bar (logo + theme) */}
      <header className="md:hidden sticky top-0 z-40 bg-paper/95 dark:bg-offwhite/95 backdrop-blur border-b border-line dark:border-line-dark">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-display text-lg font-bold tracking-tightest text-ink dark:text-white">
            <span className="text-ink dark:text-white">TAPAR</span><span className="text-action">.AZ</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-paper dark:bg-offwhite border-t border-line dark:border-line-dark">
        <div className="grid grid-cols-5 h-16">
          <MobileNavItem to="/" icon={<HomeOutlined />} label="Ana" end />
          <MobileNavItem to="/elanlar" icon={<SearchOutlined />} label="Axtar" />
          <MobileNavItem to="/elan-yerlesdir" icon={<PlusOutlined />} label="Yerləşdir" prominent />
          <MobileNavItem to="/favoriler" icon={<HeartOutlined />} label="Sevimli" />
          <MobileNavItem to={user ? '/profil' : '/login'} icon={<UserOutlined />} label="Profil" />
        </div>
      </nav>
    </>
  );
}

function MobileNavItem({
  to, icon, label, end, prominent,
}: { to: string; icon: React.ReactNode; label: string; end?: boolean; prominent?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${
          isActive ? 'text-ink dark:text-white' : 'text-muted'
        }`
      }
    >
      <span
        className={
          prominent
            ? 'w-9 h-9 rounded-full bg-action text-white flex items-center justify-center text-base -mt-4 shadow-lg'
            : 'text-lg'
        }
      >
        {icon}
      </span>
      {label}
    </NavLink>
  );
}
