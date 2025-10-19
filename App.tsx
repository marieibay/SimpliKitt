
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ToolPage from './pages/ToolPage';
import AllToolsPage from './pages/AllToolsPage';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/tool/:toolSlug" element={<ToolPage />} />
          <Route path="/tools" element={<AllToolsPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
