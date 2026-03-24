// Active route matching logic (shared across navigation components)
import { useLocation } from 'react-router-dom';

/**
 * Normalizes a path by:
 * - Lowercasing
 * - Stripping trailing slashes (except root "/")
 */
const normalize = (path) => {
  const lower = path.toLowerCase();
  return lower.length > 1 ? lower.replace(/\/+$/, '') : lower;
};

/**
 * useActiveRoute
 *
 * Returns an `isActive(to, options?)` function that checks
 * whether a given route matches the current pathname.
 *
 * @returns {(to: string, options?: boolean | { exact?: boolean }) => boolean}
 *
 * Usage:
 *   const isActive = useActiveRoute();
 *   isActive('/about')              // exact match (default)
 *   isActive('/work', false)        // partial match — /work/project ✓, /workshop ✗
 *   isActive('/work', { exact: false }) // same, object form
 */
export function useActiveRoute() {
  const { pathname } = useLocation();
  const current = normalize(pathname);

  return function isActive(to, options = true) {
    // Support both boolean and object: isActive(to, false) or isActive(to, { exact: false })
    const exact = typeof options === 'object' ? (options.exact ?? true) : options;
    const target = normalize(to);

    if (exact) {
      return current === target;
    }

    // Partial match with boundary check:
    // /work matches /work/project ✓
    // /work does NOT match /workshop ✗
    return (
      current === target ||
      current.startsWith(target + '/')
    );
  };
}