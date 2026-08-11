import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router';

/**
 * The window is the scroll container, so SPA navigations keep the previous
 * page's scroll offset — opening a scorecard from a scrolled results list
 * landed mid-page. Reset on push/replace navigations; leave POP (back and
 * forward) to the browser's native scroll restoration.
 */
export function ScrollToTop() {
  const { key } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== 'POP') window.scrollTo(0, 0);
  }, [key, navigationType]);

  return null;
}
