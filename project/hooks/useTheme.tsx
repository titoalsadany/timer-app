import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Appearance } from 'react-native'

interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = Appearance.getColorScheme()
  const [theme, setTheme] = useState<'light' | 'dark'>(colorScheme === 'dark' ? 'dark' : 'light')

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === 'dark' ? 'dark' : 'light')
    })
    return () => listener.remove()
  }, [])

  function toggleTheme() {
    setTheme(t => (t === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
} 