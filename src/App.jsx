import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { LoadingState } from './components/LoadingState';
import { SearchPage } from './pages/SearchPage';
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then((module) => ({ default: module.AnalyticsPage })));
const DealPage = lazy(() => import('./pages/DealPage').then((module) => ({ default: module.DealPage })));
export default function App() {
    return (<div className="app-shell">
      <Header />
      <main className="page-shell">
        <Suspense fallback={<LoadingState label="Открываем страницу..." />}>
          <Routes>
            <Route path="/" element={<SearchPage />}/>
            <Route path="/analytics" element={<AnalyticsPage />}/>
            <Route path="/deal/:dealId" element={<DealPage />}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
          </Routes>
        </Suspense>
      </main>
    </div>);
}
