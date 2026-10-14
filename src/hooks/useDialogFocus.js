import { useEffect } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, video[controls], [tabindex]:not([tabindex="-1"])';

/**
 * Modal focus handling for overlays (Navbar menu, GalleryLightbox):
 * moves focus into `ref` when `isOpen` turns true, keeps Tab cycling inside it,
 * and returns focus to whatever opened it when `isOpen` turns false / unmounts.
 */
export function useDialogFocus(ref, isOpen) {
  useEffect(() => {
    const container = ref.current;
    if (!isOpen || !container) return undefined;

    const opener = document.activeElement;
    container.querySelector(FOCUSABLE)?.focus({ preventScroll: true });

    const onKeyDown = (event) => {
      if (event.key !== "Tab") return;
      const items = [...container.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (!container.contains(active) || (event.shiftKey ? active === first : active === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus?.({ preventScroll: true });
    };
  }, [ref, isOpen]);
}
