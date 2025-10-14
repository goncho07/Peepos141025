import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; role: 'director' | 'teacher' } | null;
  login: (dni: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (dni, password) => {
    if (dni === 'director' && password === 'password') {
      set({ isAuthenticated: true, user: { name: 'Ángel G. Morales', role: 'director' } });
      return true;
    }
    if (dni === 'docente' && password === 'password') {
      set({ isAuthenticated: true, user: { name: 'Docente Genérico', role: 'teacher' } });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false, user: null }),
}));