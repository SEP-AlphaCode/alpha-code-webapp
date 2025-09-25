import type { Locale } from './config'

// Common dictionaries
const commonDictionaries = {
    // en: () => import('./dictionaries/common/common.en.json').then((module) => module.default),
    vi: () => import('./dictionaries/common/common.vi.json').then((module) => module.default),
}

// Page-specific dictionaries
const pageDictionaries = {
    homepage: {
        // en: () => import('./dictionaries/home_page/homepage.en.json').then((module) => module.default),
        vi: () => import('./dictionaries/home_page/homepage.vi.json').then((module) => module.default),
    },
    login: {
        // en: () => import('./dictionaries/login/login.en.json').then((module) => module.default),
        vi: () => import('./dictionaries/login/login.vi.json').then((module) => module.default),
    },
    'reset-password': {
        // en: () => import('./dictionaries/reset-password/reset-password.en.json').then((module) => module.default),
        vi: () => import('./dictionaries/reset-password/reset-password.vi.json').then((module) => module.default),
    },
    admin: {
        // en: () => import('./dictionaries/admin/admin.en.json').then((module) => module.default),
        vi: () => import('./dictionaries/admin/admin.vi.json').then((module) => module.default),
    },
    teacher: {
        // en: () => import('./dictionaries/teacher/teacher.en.json').then((module) => module.default),
        vi: () => import('./dictionaries/teacher/teacher.vi.json').then((module) => module.default),
    }
    // Add more page dictionaries here as needed
}

// Get common translations (navigation, buttons, etc.)
export const getCommonDictionary = async (_locale: Locale) =>
    // commonDictionaries[locale]?.() ?? commonDictionaries.vi()
    commonDictionaries.vi()

// Get page-specific translations
export const getPageDictionary = async (page: string, _locale: Locale) => {
    const pageDictionary = pageDictionaries[page as keyof typeof pageDictionaries]
    if (!pageDictionary) {
        throw new Error(`Dictionary for page "${page}" not found`)
    }
    // return pageDictionary[locale]?.() ?? pageDictionary.vi()
    return pageDictionary.vi()
}

// Get combined dictionary (common + page-specific)
export const getDictionary = async (locale: Locale, page?: string) => {
    const common = await getCommonDictionary(locale)

    if (page) {
        const pageDict = await getPageDictionary(page, locale)
        return { common, [page]: pageDict }
    }

    return { common }
}

// For backward compatibility - Return common dictionary as fallback
export const getLegacyDictionary = async (locale: Locale) => {
    // Since we removed the old dictionary files, just return common dictionary
    return await getCommonDictionary(locale)
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
