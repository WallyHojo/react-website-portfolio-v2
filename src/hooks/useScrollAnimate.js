import { useEffect } from 'react';

export function useScrollAnimate() {
  useEffect(() => {
    const SEL       = '[sa]';
    const VISIBLE   = 'sa-visible';
    const PREPARE   = 'sa-prepare';
    const THRESHOLD = 0.1;
    const MARGIN    = '0px 0px -50px 0px';

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(SEL).forEach(el => el.classList.add(VISIBLE));
      return;
    }

    const cache = new WeakMap();
    function getMods(el) {
      if (!cache.has(el)) cache.set(el, el.getAttribute('sa') || '');
      return cache.get(el);
    }

    let lastY     = window.scrollY;
    let scrollDir = 'down';

    const onScroll = () => {
      scrollDir = window.scrollY >= lastY ? 'down' : 'up';
      lastY     = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el       = entry.target;
        const mods     = getMods(el);
        const isMirror = mods.includes('mirror');
        const isRepeat = mods.includes('repeat') || isMirror;
        const downOnly = mods.includes('down-only');
        const upOnly   = mods.includes('up-only');

        el.classList.remove('sa-enter-down', 'sa-enter-up', 'sa-exit-down', 'sa-exit-up');

        if (entry.isIntersecting) {
          if (downOnly && scrollDir !== 'down') return;
          if (upOnly   && scrollDir !== 'up')   return;

          el.classList.add(PREPARE);
          el.classList.add(VISIBLE, `sa-enter-${scrollDir}`);

          if (!isRepeat) observer.unobserve(el);
        } else {
          el.classList.add(`sa-exit-${scrollDir}`);
          if (isRepeat) el.classList.remove(VISIBLE);
        }
      });
    }, { threshold: THRESHOLD, rootMargin: MARGIN });

    const onTransitionEnd = (e) => {
      const el = e.target;
      if (el.hasAttribute('sa')) el.classList.remove(PREPARE);
    };
    document.addEventListener('transitionend', onTransitionEnd, { passive: true });

    document.querySelectorAll(SEL).forEach(el => observer.observe(el));

    // Cleanup on unmount
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('transitionend', onTransitionEnd);
      observer.disconnect();
    };
  }, []);
}