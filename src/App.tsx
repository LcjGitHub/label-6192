import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CraftListPage from './pages/CraftListPage';
import CraftDetailPage from './pages/CraftDetailPage';

/**
 * 应用路由
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CraftListPage />} />
        <Route path="/craft/:id" element={<CraftDetailPage />} />
      </Route>
    </Routes>
  );
}
