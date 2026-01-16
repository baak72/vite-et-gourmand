import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    // Si Lenis est actif, on l'utilise pour remonter
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      // Sinon (fallback), on utilise le navigateur standard
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]); // Se déclenche à chaque changement d'URL

  return null;
}