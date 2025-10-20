
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ToolPage from './pages/ToolPage';
import AllToolsPage from './pages/AllToolsPage';
import Layout from './components/Layout';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TosPage from './pages/TosPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/tool/:toolSlug" element={<ToolPage />} />
          <Route path="/tools" element={<AllToolsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/tos" element={<TosPage />} />
        </Routes>
      </Layout>
      <Analytics />
    </HashRouter>
  );
};

export default App;