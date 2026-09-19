import { BarChart3, Gamepad2, Moon, Search, Sun } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
export function Header() {
    const { theme, toggleTheme } = useTheme();
    return (<header className="site-header">
      <div className="header-inner">
        <NavLink className="brand" to="/" aria-label="Neon Deals — главная">
          <Gamepad2 size={24}/>
          <span>NEON DEALS</span>
        </NavLink>
        <nav className="main-nav" aria-label="Основная навигация">
          <NavLink to="/" end>
            <Search size={18}/>
            <span>Поиск</span>
          </NavLink>
          <NavLink to="/analytics">
            <BarChart3 size={18}/>
            <span>Аналитика</span>
          </NavLink>
        </nav>
        <button className="icon-button" type="button" onClick={toggleTheme} title="Переключить тему">
          {theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}
          <span className="sr-only">Переключить тему</span>
        </button>
      </div>
    </header>);
}
