import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useMagnetic } from './hooks/useMagneticEffect/useMagneticEffect';
import { useSA } from './hooks/useScrollAnimate';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Skills from './pages/Skills/Skills';
import Work from './pages/Work/Work';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Resume from './pages/Resume/Resume';
import './styles/global.css';

function App() {
  useSA();
  useSmoothScroll();
  useMagnetic();

  return (
    <Router>
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
    </Router>
  );
}

export default App;