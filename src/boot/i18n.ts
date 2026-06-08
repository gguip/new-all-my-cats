import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

export type MessageLanguages = keyof typeof messages
export type MessageSchema = (typeof messages)['en']

/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema {}
  export interface DefineDateTimeFormat {}
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type */

const STORAGE_KEY = 'catastrophe.locale'

function initialLocale(): MessageLanguages {
  const fallback: MessageLanguages = 'pt-BR'
  if (typeof window === 'undefined') return fallback
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved && Object.keys(messages).includes(saved)) {
    return saved as MessageLanguages
  }
  return fallback
}

export default defineBoot(({ app }) => {
  const i18n = createI18n<{ message: MessageSchema }, MessageLanguages>({
    locale: initialLocale(),
    fallbackLocale: 'en',
    legacy: false,
    globalInjection: true,
    messages,
  })
  app.use(i18n)
})
