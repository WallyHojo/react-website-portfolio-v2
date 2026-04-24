import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useMagnetic } from './hooks/useMagneticEffect/useMagneticEffect';
import { useSA, useSARouteSync } from './hooks/useScrollAnimate/useScrollAnimate';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Skills from './pages/Skills/Skills';
import Work from './pages/Work/Work';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Resume from './pages/Resume/Resume';

// Must be a child of <Router> so useLocation() works
function AppInner() {
  const location = useLocation();
  useSARouteSync(location.pathname);

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route index element={<Home />} />
          <Route path="skills" element={<Skills />} />
          <Route path="work/*" element={<Work />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="resume" element={<Resume />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  useSA();
  useSmoothScroll();
  useMagnetic();

  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;