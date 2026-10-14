import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { useSA, useSARouteSync } from './hooks/useScrollAnimate/useScrollAnimate';
import { useMagnetic } from './hooks/useMagneticEffect/useMagneticEffect';
import useScrollToTop from "./hooks/useScrollToTop";
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useScrollDirection } from './hooks/useScrollDirection';
import { PageTransitionProvider } from './components/ui/PageTransition/PageTransition';
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import Btn from './components/ui/Buttons';
import Home from './pages/Home/Home';

// Lazy load other pages for code splitting (Home loads immediately for animations)
const Skills = lazy(() => import('./pages/Skills/Skills'));
const Work = lazy(() => import('./pages/Work/Work'));
const About = lazy(() => import('./pages/About/About'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Resume = lazy(() => import('./pages/Resume/Resume'));

// Catch-all for unknown URLs (previously rendered an empty <main>)
function NotFound() {
  return (
    <section className="section section-padding h-viewport-small flex-all flex-direction-column flex-horz-center gap-1" aria-labelledby="not-found-title">
      <h1 id="not-found-title" className="h2">Page not found</h1>
      <p className="text-muted">The page you're looking for doesn't exist or has moved.</p>
      <Btn to="/" secondary className="btn--no-target">Back to home</Btn>
    </section>
  );
}

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
        <a className="skip-link" href="#main">Skip to content</a>
        <Navbar />
        <main id="main" tabIndex={-1}>
          <Suspense fallback={null}>
            <Routes>
              <Route index element={<Home />} />
              <Route path="skills" element={<Skills />} />
              <Route path="work/*" element={<Work />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="resume" element={<Resume />} />
              <Route path="*" element={<NotFound />} />
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

  // Global scroll-direction state — sets html.scrolling-up / html.scrolling-down
  // for any component in the app to react to via CSS (see Navbar.css)
  useScrollDirection();

  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;