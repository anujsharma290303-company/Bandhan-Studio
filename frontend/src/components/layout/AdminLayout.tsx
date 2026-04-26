import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const navLinks = [
  { to: '/admin',            label: 'Dashboard',   icon: '📊', exact: true },
  { to: '/admin/clients',    label: 'Clients',      icon: '👥' },
  { to: '/admin/quotations', label: 'Quotations',   icon: '📄' },
  { to: '/admin/bills',      label: 'Bills',        icon: '🧾' },
  { to: '/admin/outstanding',label: 'Outstanding',  icon: '⏳' },
  { to: '/admin/team',       label: 'Team',         icon: '🎯' },
  { to: '/admin/inventory',  label: 'Inventory',    icon: '📦' },
];

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav */}
      <nav className="bg-navy-600 text-white h-14 flex items-center px-6 gap-6 shadow-lg fixed top-0 left-0 right-0 z-40">
        <span className="font-black text-lg tracking-tight mr-4">
          Bandan<span className="text-blue-300">Studio</span>
        </span>
        <div className="flex items-center gap-1 flex-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {link.icon} {link.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/50">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="text-xs text-white/60 hover:text-white border border-white/20 px-3 py-1.5 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Page content */}
      <main className="pt-14">
        <Outlet />
      </main>
    </div>
  );
};
