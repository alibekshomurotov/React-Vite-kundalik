import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard,
  GraduationCap,
  BookOpen, 
  Image,
  UserCircle,
  Settings,
  LogOut
} from 'lucide-react';
import './Sidebar.css';

export default function TeacherSidebar() {
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/my-classes', icon: GraduationCap, label: 'Mening Sinflarim' },
    { path: '/homework', icon: BookOpen, label: 'Vazifalar' },
    { path: '/grading', icon: LayoutDashboard, label: 'Baholash' },
    { path: '/album', icon: Image, label: 'Sinf Albomi' },
    { path: '/profile', icon: UserCircle, label: 'Profil' },
  ];

  return (
    <aside className="sidebar teacher-sidebar">
      <div className="sidebar-header">
        <div className="teacher-info">
          <div className="teacher-avatar">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h4>{user?.name}</h4>
            <span className="subject-badge">{user?.subject}</span>
          </div>
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
        <button onClick={logout} className="logout-link">
          <LogOut size={18} />
          <span>Chiqish</span>
        </button>
      </div>
    </aside>
  );
}