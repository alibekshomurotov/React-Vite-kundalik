import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  classId?: string;
  subject?: string;
  teacherClasses?: string[];
  phone?: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt'> & { password: string; adminCode?: string }) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Maxfiy admin kodi
const ADMIN_SECRET_CODE = 'ADMIN2024KUNDALIK';

// LocalStorage dan foydalanuvchilarni olish (parol bilan)
const getStoredUsers = (): (User & { password: string })[] => {
  const users = localStorage.getItem('kundalik_users');
  if (!users) return [];
  try {
    return JSON.parse(users);
  } catch {
    return [];
  }
};

// LocalStorage ga saqlash (parol bilan)
const saveUsers = (users: (User & { password: string })[]) => {
  localStorage.setItem('kundalik_users', JSON.stringify(users));
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('kundalik_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    
    const users = getStoredUsers();
    console.log('Barcha foydalanuvchilar:', users); // Debug uchun
    
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('kundalik_current_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    setError("Email yoki parol noto'g'ri! Avval ro'yxatdan o'ting.");
    return false;
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string; adminCode?: string }): Promise<boolean> => {
    setError(null);
    
    // Admin kodini tekshirish
    if (userData.role === 'admin' && userData.adminCode !== ADMIN_SECRET_CODE) {
      setError("Admin maxfiy kodi noto'g'ri! To'g'ri kod: ADMIN2024KUNDALIK");
      return false;
    }
    
    const users = getStoredUsers();
    
    // Email band emasligini tekshirish
    if (users.some(u => u.email === userData.email)) {
      setError("Bu email allaqachon ro'yxatdan o'tgan!");
      return false;
    }
    
    // Yangi foydalanuvchi yaratish - PAROLNI SAQLASH MUHIM!
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    console.log('Yangi foydalanuvchi:', newUser); // Debug uchun
    
    users.push(newUser);
    saveUsers(users);
    
    // Parolni olib tashlab, faqat kerakli ma'lumotlarni saqlash
    const { password: _, adminCode: __, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword as User);
    localStorage.setItem('kundalik_current_user', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex === -1) return false;
    
    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;
    saveUsers(users);
    
    const { password: _, ...userWithoutPassword } = updatedUser;
    setUser(userWithoutPassword);
    localStorage.setItem('kundalik_current_user', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kundalik_current_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};