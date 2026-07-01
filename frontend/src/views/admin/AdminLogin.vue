<template>
  <div class="login-page">
    <div class="login-bg" aria-hidden="true">
      <div class="login-bg__gradient"></div>
      <div
        v-for="i in 8"
        :key="i"
        class="login-bg__particle"
        :style="particleStyle(i)"
      ></div>
    </div>

    <div class="login-card">
      <div class="login-card__logo">
        <img src="/assets/logo.png" alt="Cabinet OEFIC" />
      </div>

      <div class="login-card__header">
        <h1>Espace Administration</h1>
        <p>Cabinet OEFIC — Backoffice</p>
      </div>

      <form class="login-card__form" @submit.prevent="handleLogin" novalidate>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <div class="password-wrapper">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="••••••••"
              autocomplete="current-password"
              required
              @keydown.enter.prevent="handleLogin"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Masquer' : 'Afficher'"
            >
              <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="error" class="login-error">{{ error }}</div>

        <button type="submit" class="btn btn-primary login-submit" :disabled="loading">
          <span v-if="loading">Connexion...</span>
          <span v-else>Se connecter</span>
        </button>
      </form>

      <a href="/" class="login-back">← Retour au site</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!password.value) return
  loading.value = true
  error.value = ''
  try {
    await auth.login(password.value)
    await router.push({ name: 'admin-dashboard' })
  } catch (e) {
    error.value = (e as Error).message || 'Mot de passe incorrect'
  } finally {
    loading.value = false
  }
}

function particleStyle(i: number) {
  return {
    width: `${30 + i * 15}px`,
    height: `${30 + i * 15}px`,
    left: `${(i * 15 + 5) % 90}%`,
    top: `${(i * 19 + 8) % 85}%`,
    animationDelay: `${i * 0.8}s`,
    animationDuration: `${8 + i * 1.5}s`,
    opacity: 0.05 + (i % 4) * 0.02
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1e1a34 0%, #2d2850 100%);
}

.login-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.login-bg__gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 50%, rgba(201, 168, 76, 0.08) 0%, transparent 60%),
              radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.03) 0%, transparent 60%);
}

.login-bg__particle {
  position: absolute;
  border-radius: 50%;
  background: var(--color-gold);
  animation: float linear infinite;
}

.login-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(201, 168, 76, 0.2);
  border-radius: 24px;
  padding: 2.5rem;
  margin: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-card__logo {
  text-align: center;
  margin-bottom: 1.5rem;
}

.login-card__logo img {
  height: 64px;
  width: auto;
  filter: brightness(0) invert(1);
  margin: 0 auto;
}

.login-card__header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-card__header h1 {
  font-size: 1.4rem;
  color: #fff;
  margin-bottom: 0.5rem;
}

.login-card__header p {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Form */
.login-card__form .form-group label {
  color: rgba(255, 255, 255, 0.8);
}

.form-control {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.form-control:focus {
  border-color: var(--color-gold);
  background: rgba(255, 255, 255, 0.12);
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.password-wrapper {
  position: relative;
}

.password-wrapper .form-control {
  padding-right: 3rem;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: var(--color-gold);
}

.password-toggle svg {
  width: 18px;
  height: 18px;
}

.login-error {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.login-submit {
  width: 100%;
  justify-content: center;
  margin-top: 1.5rem;
  padding: 1rem;
}

.login-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.login-back {
  display: block;
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.2s ease;
}

.login-back:hover {
  color: var(--color-gold);
}
</style>
