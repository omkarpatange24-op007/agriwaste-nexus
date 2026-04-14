import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('agri_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  function register({ name, email, mobile, password, role, village, district, cropType, landArea }) {
    const users = JSON.parse(localStorage.getItem('agri_users') || '[]');
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered. Please login.' };
    }
    const newUser = {
      id: `U${Date.now()}`,
      name, email, mobile, password, role,
      village: village || '',
      district: district || '',
      cropType: cropType || '',
      landArea: landArea || '',
      createdAt: new Date().toISOString(),
      listings: [],
      calculations: [],
      carbonCredits: 0,
    };
    users.push(newUser);
    localStorage.setItem('agri_users', JSON.stringify(users));
    localStorage.setItem('agri_user', JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  }

  function login({ email, password }) {
    const users = JSON.parse(localStorage.getItem('agri_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) {
      return { success: false, error: 'Invalid email or password.' };
    }
    localStorage.setItem('agri_user', JSON.stringify(found));
    setUser(found);
    return { success: true };
  }

  function logout() {
    localStorage.removeItem('agri_user');
    setUser(null);
  }

  function updateProfile(updates) {
    const updatedUser = { ...user, ...updates };
    const users = JSON.parse(localStorage.getItem('agri_users') || '[]');
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) users[idx] = updatedUser;
    localStorage.setItem('agri_users', JSON.stringify(users));
    localStorage.setItem('agri_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return { success: true };
  }

  function saveCalculation(result, inputs) {
    if (!user) return;
    const calc = {
      id: `C${Date.now()}`,
      inputs,
      result,
      date: new Date().toISOString()
    };
    const updatedUser = {
      ...user,
      calculations: [calc, ...(user.calculations || [])].slice(0, 20),
      carbonCredits: (user.carbonCredits || 0) + (result.credits?.carbonCredits || 0)
    };
    const users = JSON.parse(localStorage.getItem('agri_users') || '[]');
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) users[idx] = updatedUser;
    localStorage.setItem('agri_users', JSON.stringify(users));
    localStorage.setItem('agri_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return calc;
  }

  function resetPassword({ mobile, newPassword }) {
    const users = JSON.parse(localStorage.getItem('agri_users') || '[]');
    const idx = users.findIndex(u => u.mobile === mobile);
    if (idx === -1) return { success: false, error: 'Mobile number not registered.' };
    users[idx].password = newPassword;
    localStorage.setItem('agri_users', JSON.stringify(users));
    return { success: true };
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile, saveCalculation, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}