import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Calendar, HardDrive } from 'lucide-react';

const links = [
  { to: '/', label: '今日', icon: Home },
  { to: '/records', label: '记录', icon: BookOpen },
  { to: '/calendar', label: '日历', icon: Calendar },
  { to: '/backup', label: '备份', icon: HardDrive },
];

export default function Nav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8E4DE] bg-[#F8F6F2]/95 backdrop-blur-sm md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="mx-auto flex max-w-3xl items-center justify-around px-4 py-2 md:justify-between md:px-8">
        <div className="hidden font-serif text-lg font-bold text-[#1B4332] md:block">
          艾宾浩斯学习系统
        </div>
        <div className="flex items-center gap-1 md:gap-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center rounded-xl px-4 py-2 text-xs font-medium transition-all md:flex-row md:gap-2 md:text-sm ${
                  isActive
                    ? 'bg-[#1B4332] text-[#F8F6F2] shadow-md'
                    : 'text-[#4A4A4A] hover:bg-[#E8E4DE]'
                }`
              }
            >
              <link.icon className="h-5 w-5 md:h-4 md:w-4" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
