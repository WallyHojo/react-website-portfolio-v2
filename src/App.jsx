import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { useSA, useSARouteSync } from './hooks/useScrollAnimate/useScrollAnimate';
import { useMagnetic } from './hooks/useMagneticEffect/useMagneticEffect';
import useScrollToTop from "./hooks/useScrollToTop";
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { PageTransitionProvider } from './components/ui/PageTransition/PageTransition';
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import Home from './pages/Home/Home';

// Lazy load other pages for code splitting (Home loads immediately for animations)
const Skills = lazy(() => import('./pages/Skills/Skills'));
const Work = lazy(() => import('./pages/Work/Work'));
const About = lazy(() => import('./pages/About/About'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Resume = lazy(() => import('./pages/Resume/Resume'));

// Must be a child of <Router> so useLocation() works
function AppInner() {
  
  // Sync route changes with scroll animations
  const location = useLocation();
  useSARouteSync(location.pathname);

  // Scroll to top on route change
  useScrollToTop();

  // Custom cursor — must live inside Router for route-change resets
  useMagnetic();

  return (
    <>
      <PageTransitionProvider>
        <Navbar />
        <main>
          <Suspense fallback={null}>
            <Routes>
              <Route index element={<Home />} />
              <Route path="skills" element={<Skills />} />
              <Route path="work/*" element={<Work />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="resume" element={<Resume />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </PageTransitionProvider>
    </>
  );
}

function App() {
  // Critical: scroll animations
  useSA();
  
  // Deferred: smooth scroll (100ms delay to prioritize first paint)
  useSmoothScroll();

  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;