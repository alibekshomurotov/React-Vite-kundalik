import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, login, error } = useAuth();

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Email va parolni kiriting!");
      return;
    }
    
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    
    if (!success) {
      console.log('Login xatosi:', error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">📚</div>
          <h2>Xush kelibsiz!</h2>
          <p>Akkauntingizga kiring</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Parol</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Parolingiz"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? 'Kirish...' : 'Kirish'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Akkauntingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link></p>
          
          <div className="test-accounts">
            <p><strong>Admin uchun:</strong></p>
            <code>admin@test.com</code>
            <small>Parol: admin123</small>
            <br />
            <small>Admin kod: ADMIN2024KUNDALIK</small>
          </div>
        </div>
      </div>
    </div>
  );
}