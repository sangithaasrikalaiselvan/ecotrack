import { create } from 'zustand'
import { User } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // starts true until hydration finishes

  login: async (email, password) => {
    void password;
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    const user: User = {
      id: "mock-user-1",
      name: email.split('@')[0] || "User",
      email,
      country_code: "IN"
    }
    localStorage.setItem('ecotrack_user', JSON.stringify(user))
    set({ user, isAuthenticated: true })
  },

  register: async (name, email, password) => {
    void password;
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    const user: User = {
      id: "mock-user-1",
      name,
      email,
      country_code: "IN"
    }
    localStorage.setItem('ecotrack_user', JSON.stringify(user))
    set({ user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('ecotrack_user')
    set({ user: null, isAuthenticated: false })
  },

  hydrate: () => {
    try {
      const stored = localStorage.getItem('ecotrack_user')
      if (stored) {
        const user = JSON.parse(stored)
        set({ user, isAuthenticated: true, isLoading: false })
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false })
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  }
}))
