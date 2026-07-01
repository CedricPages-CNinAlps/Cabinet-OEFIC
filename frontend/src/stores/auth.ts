import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('oefic_admin_token'))

  const isAuthenticated = computed(() => !!token.value)

  async function login(password: string): Promise<void> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    if (!res.ok) {
      const err = await res.json() as { error: string }
      throw new Error(err.error || 'Connexion échouée')
    }
    const data = await res.json() as { token: string }
    token.value = data.token
    localStorage.setItem('oefic_admin_token', data.token)
  }

  function logout(): void {
    token.value = null
    localStorage.removeItem('oefic_admin_token')
  }

  async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    })
    if (!res.ok) {
      const err = await res.json() as { error: string }
      throw new Error(err.error || 'Changement de mot de passe échoué')
    }
  }

  return { token, isAuthenticated, login, logout, changePassword }
})
