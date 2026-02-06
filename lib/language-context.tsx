"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type Language, translations } from "./translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Default translation function for when context is not available
const defaultT = (keyPath: string): string => {
  const keys = keyPath.split(".")
  let value: any = translations["en"]

  for (const key of keys) {
    value = value?.[key]
  }

  return value || keyPath
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as Language) || "en"
    setLanguageState(savedLang)
    setMounted(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (keyPath: string): string => {
    const keys = keyPath.split(".")
    let value: any = translations[language]

    for (const key of keys) {
      value = value?.[key]
    }

    return value || keyPath
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    return {
      language: "en" as Language,
      setLanguage: () => {},
      t: defaultT,
    }
  }
  return context
}
