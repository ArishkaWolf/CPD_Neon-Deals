import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const ThemeContext = createContext(null);
function getInitialTheme() {
    const saved = localStorage.getItem('cheapshark-theme');
    if (saved === 'dark' || saved === 'light')
        return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme);
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('cheapshark-theme', theme);
    }, [theme]);
    const value = useMemo(() => ({ theme, toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')) }), [theme]);
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context)
        throw new Error('useTheme должен использоваться внутри ThemeProvider');
    return context;
}
