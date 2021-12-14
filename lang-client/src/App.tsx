import { createSignal, JSXElement, onMount, Show } from 'solid-js';
import cx from 'classnames';
import { Router, Routes, Route } from 'solid-app-router';

import PageIndex from './pages/index';
import PageClient from './pages/client';
import PageNotFound from './pages/not-found';
import styles from './App.module.css';
import SwitchTheme, { switchTheme } from './components/switch-theme';

const App = (): JSXElement => {
  const [isInitialed, setIsInitialed] = createSignal<boolean>(false);
  onMount(() => {
    switchTheme();
    setIsInitialed(true);
  });
  return (
    <Show when={isInitialed()}>
      <div class={cx(styles.App, 'wlc-bg-gray-200', 'dark:wlc-bg-gray-800')}>
        <div class="wlc-fixed wlc-z-50 wlc-top-4 wlc-right-4 wlc-shadow-md">
          <SwitchTheme />
        </div>
        <Router>
          <Routes>
            <Route path="/client/:id" element={<PageClient />}>
              <Route path="/" element={<PageClient />} />
              <Route path="/*all" element={<PageNotFound />} />
            </Route>
            <Route path="/" element={<PageIndex />} />
            <Route path="/*all" element={<PageNotFound />} />
          </Routes>
        </Router>
      </div>
    </Show>
  );
};

export default App;
