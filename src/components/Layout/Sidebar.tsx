import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  TrendingUp, 
  Image, 
  BookOpen, 
  Users,
  UserCircle,
  GraduationCap
} from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  const { user } = useAuth();

  const menuItems = [
    { path: '/', icon: Calendar, label: 'Dars Jadvali' },
    { path: '/rating', icon: TrendingUp, label: 'Reyting' },
    { path: '/homework', icon: BookOpen, label: 'Vazifalar' },
    { path: '/album', icon: Image, label: 'Sinf Albomi' },
    { path: '/teachers', icon: GraduationCap, label: "O'qituvchilar" },
    { path: '/profile', icon: UserCircle, label: 'Mening Profilim' },
  ];

  // Faqat admin uchun admin panel
  if (user?.role === 'admin') {
    menuItems.push(
      { path: '/admin', icon: Users, label: 'Admin Panel' }
    );
  }

  return (
    <aside className="sidebar">
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
        <div className="version">v3.0.0</div>
      </div>
    </aside>
  );
}