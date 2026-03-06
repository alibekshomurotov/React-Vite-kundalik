import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Bell } from 'lucide-react';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-brand">
        <div className="logo">📚</div>
        <h1>Kundalik.com</h1>
      </div>
      
      <div className="header-actions">
        <button className="icon-btn">
          <Bell size={20} />
        </button>
        
        <div className="user-menu">
          <div className="user-info">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">
                {user?.role === 'admin' ? 'Administrator' : 
                 user?.role === 'teacher' ? "O'qituvchi" : "O'quvchi"}
              </span>
            </div>
          </div>
          
          <button onClick={logout} className="logout-btn">
            <LogOut size={18} />
            <span>Chiqish</span>
          </button>
        </div>
      </div>
    </header>
  );
}