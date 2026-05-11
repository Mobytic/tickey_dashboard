import i18n from './locales'

export const dateLocales: Record<string, () => Promise<any>> = {
    en: () => import('dayjs/locale/en'),
    fr: () => import('dayjs/locale/fr'),
}
export default i18n
