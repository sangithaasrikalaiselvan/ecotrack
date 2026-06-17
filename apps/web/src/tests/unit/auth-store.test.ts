import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '@/stores/auth-store'

describe('auth-store', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    })
  })

  it('login sets user and isAuthenticated', async () => {
    await useAuthStore.getState().login('test@example.com', 'password')
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    expect(useAuthStore.getState().user?.email).toBe('test@example.com')
  })

  it('login saves user to localStorage', async () => {
    await useAuthStore.getState().login('test@example.com', 'password')
    const stored = localStorage.getItem('ecotrack_user')
    expect(stored).not.toBeNull()
  })

  it('logout clears user and localStorage', async () => {
    await useAuthStore.getState().login('test@example.com', 'password')
    useAuthStore.getState().logout()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().user).toBeNull()
    expect(localStorage.getItem('ecotrack_user')).toBeNull()
  })

  it('hydrate restores session from localStorage', () => {
    const mockUser = { id: '1', name: 'Test', email: 'test@example.com', country_code: 'IN' }
    localStorage.setItem('ecotrack_user', JSON.stringify(mockUser))
    useAuthStore.getState().hydrate()
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    expect(useAuthStore.getState().user?.name).toBe('Test')
  })

  it('hydrate does nothing if localStorage empty', () => {
    useAuthStore.getState().hydrate()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })
})
