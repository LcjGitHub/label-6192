import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CraftListPage from './pages/CraftListPage';
import CraftDetailPage from './pages/CraftDetailPage';
import CraftComparePage from './pages/CraftComparePage';
import TermDictionaryPage from './pages/TermDictionaryPage';

/**
 * 应用路由
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CraftListPage />} />
        <Route path="/craft/:id" element={<CraftDetailPage />} />
        <Route path="/compare" element={<CraftComparePage />} />
        <Route path="/dictionary" element={<TermDictionaryPage />} />
      </Route>
    </Routes>
  );
}
