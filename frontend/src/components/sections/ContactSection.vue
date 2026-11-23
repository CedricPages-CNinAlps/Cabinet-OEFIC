<template>
  <section v-milk class="contact section" :style="sectionBg">
    <div class="container">
      <div v-reveal class="section-header">
        <span v-if="contact?.eyebrow" class="eyebrow">{{ contact.eyebrow }}</span>
        <h2>{{ contact?.title }}</h2>
        <div class="divider-gold"></div>
        <p>{{ contact?.subtitle }}</p>
      </div>

      <div class="contact__grid">
        <!-- Formulaire -->
        <div class="contact__form-wrapper">
          <form class="contact__form" @submit.prevent="sendEmail" novalidate>
            <div class="form-row">
              <div class="form-group">
                <label for="from_name">{{ t.nameLabel }} *</label>
                <input
                  id="from_name"
                  v-model="form.from_name"
                  type="text"
                  class="form-control"
                  :placeholder="t.namePlaceholder"
                  required
                />
              </div>
              <div class="form-group">
                <label for="reply_to">{{ t.emailLabel }} *</label>
                <input
                  id="reply_to"
                  v-model="form.reply_to"
                  type="email"
                  class="form-control"
                  :placeholder="t.emailPlaceholder"
                  required
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="phone">{{ t.phoneLabel }}</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="form-control"
                  :placeholder="t.phonePlaceholder"
                />
              </div>
              <div class="form-group">
                <label for="subject">{{ t.subjectLabel }} *</label>
                <select id="subject" v-model="form.subject" class="form-control" required>
                  <option value="">{{ t.subjectPlaceholder }}</option>
                  <option v-for="title in subjects" :key="title">{{ title }}</option>
                  <option v-if="t.otherSubject">{{ t.otherSubject }}</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="message">{{ t.messageLabel }} *</label>
              <textarea
                id="message"
                v-model="form.message"
                class="form-control"
                :placeholder="t.messagePlaceholder"
                rows="5"
                required
              ></textarea>
            </div>

            <div v-if="feedback.message" class="contact__feedback" :class="`contact__feedback--${feedback.type}`">
              {{ feedback.message }}
            </div>

            <button type="submit" class="btn btn-primary contact__submit" :disabled="sending">
              <svg v-if="!sending" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              <span v-if="sending">{{ t.sendingText }}</span>
              <span v-else>{{ t.submitText }}</span>
            </button>
          </form>
        </div>

        <!-- Infos contact -->
        <div class="contact__info">
          <div class="contact__card">
            <h3 v-if="contact?.cardTitle">{{ contact.cardTitle }}</h3>
            <div class="contact__detail" v-if="phone">
              <div class="contact__detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.9a19.79 19.79 0 01-3-8.57A2 2 0 012.18 1H5.2a2 2 0 012 1.72c.127.96.36 1.903.7 2.81a2 2 0 01-.45 2.11L6.3 8.77a16 16 0 006.6 6.6l1.14-1.14a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <div>
                <strong>{{ t.phoneLabel }}</strong>
                <a :href="telHref(phone)">{{ phone }}</a>
              </div>
            </div>
            <div class="contact__detail" v-if="email">
              <div class="contact__detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <strong>{{ t.emailLabel }}</strong>
                <a :href="`mailto:${email}`">{{ email }}</a>
              </div>
            </div>
            <div class="contact__detail" v-if="address">
              <div class="contact__detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <strong>{{ contact?.addressLabel }}</strong>
                <span>{{ address }}</span>
              </div>
            </div>

            <div v-if="hoursLines.length" class="contact__hours">
              <h4 v-if="contact?.hoursTitle">{{ contact.hoursTitle }}</h4>
              <p v-for="(line, i) in hoursLines" :key="i">{{ line }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import emailjs from '@emailjs/browser'
import { useSiteConfigStore } from '@/stores/siteConfig'
import { telHref } from '@/utils/contact'

const { displayContent: content, displayConfig: config } = storeToRefs(useSiteConfigStore())
const contact = computed(() => content.value?.contact)
const t = computed(() => contact.value?.form ?? ({} as NonNullable<typeof contact.value>['form']))

// Coordonnées : source unique = onglet Configuration
const legal = computed(() => config.value?.legalInfo)
const phone = computed(() => legal.value?.phone || '')
const email = computed(() => legal.value?.email || '')
const address = computed(() =>
  [legal.value?.address, legal.value?.city].filter(Boolean).join(', ')
)
const hoursLines = computed(() =>
  (contact.value?.hours || '').split('\n').map(l => l.trim()).filter(Boolean)
)

// Sujets du formulaire = expertises visibles (gérées depuis le backoffice)
const subjects = computed(() =>
  (content.value?.services ?? [])
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order)
    .map(s => s.title)
)

const sectionBg = computed(() => {
  const bg = contact.value?.bgColor
  return bg ? { backgroundColor: bg } : {}
})

const form = reactive({
  from_name: '',
  reply_to: '',
  phone: '',
  subject: '',
  message: ''
})

const sending = ref(false)
const feedback = reactive({ message: '', type: 'success' as 'success' | 'error' })

async function sendEmail() {
  if (!form.from_name || !form.reply_to || !form.subject || !form.message) {
    feedback.message = t.value.requiredMessage
    feedback.type = 'error'
    return
  }

  const ejs = contact.value?.emailjs
  if (!ejs?.serviceId || !ejs?.templateId || !ejs?.publicKey) {
    feedback.message = t.value.notConfiguredMessage
    feedback.type = 'error'
    return
  }

  sending.value = true
  feedback.message = ''

  try {
    await emailjs.send(ejs.serviceId, ejs.templateId, { ...form }, ejs.publicKey)
    feedback.message = t.value.successMessage
    feedback.type = 'success'
    Object.assign(form, { from_name: '', reply_to: '', phone: '', subject: '', message: '' })
  } catch {
    feedback.message = t.value.errorMessage
    feedback.type = 'error'
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.contact {
  background: var(--color-bg);
}

.contact__grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 4rem;
  align-items: start;
}

/* Form */
.contact__form-wrapper {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 2.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

select.form-control {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%231e1a34' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 18px;
  padding-right: 2.5rem;
}

.contact__feedback {
  padding: 1rem 1.25rem;
  border-radius: 10px;
  margin: 1.25rem 0;
  font-size: 0.9rem;
  font-weight: 500;
}

.contact__feedback--success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #15803d;
}

.contact__feedback--error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #dc2626;
}

.contact__submit {
  width: 100%;
  justify-content: center;
  margin-top: 1.5rem;
  padding: 1rem 2rem;
}

.contact__submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Info card */
.contact__card {
  background: var(--color-text);
  border-radius: 20px;
  padding: 2.5rem;
  color: rgba(255, 255, 255, 0.85);
  position: sticky;
  top: 100px;
}

.contact__card h3 {
  color: #fff;
  margin-bottom: 2rem;
  font-size: 1.3rem;
}

.contact__detail {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: flex-start;
}

.contact__detail-icon {
  width: 40px;
  height: 40px;
  background: rgba(201, 168, 76, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-gold);
}

.contact__detail-icon svg {
  width: 18px;
  height: 18px;
}

.contact__detail strong {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-gold);
  margin-bottom: 0.25rem;
}

.contact__detail a,
.contact__detail span {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.2s ease;
}

.contact__detail a:hover {
  color: var(--color-gold);
}

.contact__hours {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.contact__hours h4 {
  font-family: var(--font-body, 'Inter', sans-serif);
  color: var(--color-gold);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
}

.contact__hours p {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.25rem;
}

@media (max-width: 1000px) {
  .contact__grid {
    grid-template-columns: 1fr;
  }

  .contact__card {
    position: static;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .contact__form-wrapper {
    padding: 1.5rem;
  }

  .contact__card {
    padding: 1.5rem;
  }
}
</style>
