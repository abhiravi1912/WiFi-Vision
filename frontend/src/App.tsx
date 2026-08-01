import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Technology from './pages/Technology';
import Architecture from './pages/Architecture';
import Applications from './pages/Applications';
import Hardware from './pages/Hardware';
import Dashboard from './pages/Dashboard';
import Team from './pages/Team';
import Documentation from './pages/Documentation';

function Layout({ children, hideFooter }: { children: React.ReactNode; hideFooter?: boolean }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/technology" element={<Layout><Technology /></Layout>} />
          <Route path="/architecture" element={<Layout><Architecture /></Layout>} />
          <Route path="/applications" element={<Layout><Applications /></Layout>} />
          <Route path="/hardware" element={<Layout><Hardware /></Layout>} />
          <Route path="/dashboard" element={<Layout hideFooter><Dashboard /></Layout>} />
          <Route path="/team" element={<Layout><Team /></Layout>} />
          <Route path="/documentation" element={<Layout><Documentation /></Layout>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
