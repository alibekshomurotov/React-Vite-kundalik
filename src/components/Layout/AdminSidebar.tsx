import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  Settings,
  Shield,
  LogOut,
  BarChart3
} from 'lucide-react';
import './Sidebar.css';

export default function AdminSidebar() {
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/students', icon: Users, label: "O'quvchilar" },
    { path: '/admin/teachers', icon: GraduationCap, label: "O'qituvchilar" },
    { path: '/admin/classes', icon: School, label: 'Sinflar' },
    { path: '/admin/statistics', icon: BarChart3, label: 'Statistika' },
    { path: '/admin/settings', icon: Settings, label: 'Sozlamalar' },
  ];

  return (
    <aside className="sidebar admin-sidebar">
      <div className="sidebar-header admin-header">
        <div className="admin-badge">
          <Shield size={24} />
          <span>ADMIN</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="admin-info">
          <span>{user?.name}</span>
        </div>
        <button onClick={logout} className="logout-link">
          <LogOut size={18} />
          <span>Chiqish</span>
        </button>
      </div>
    </aside>
  );
}