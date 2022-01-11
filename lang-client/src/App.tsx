import { createSignal, JSXElement, onMount, Show } from 'solid-js';
import { Router, Routes, Route } from 'solid-app-router';

import { createI18n, I18nProvider } from 'solid-i18n';
import classnames from 'classnames';
import PageIndex from './pages/index/index';
import PageClient from './pages/client';
import PageNotFound from './pages/not-found';
import styles from './App.module.css';
import SwitchTheme, { switchTheme } from './components/switch-theme';
import LangDefault from '../locales/default.json';
import LangZhCN from '../locales/zh-CN.json';
import LangZhHk from '../locales/zh-HK.json';
import LangEnUS from '../locales/en-US.json';
import LangJpJP from '../locales/jp-JP.json';
import notification from './utils/notification';
import { reqGetLang } from './apis';
import LangSelector from './pages/index/lang-select';

const App = (): JSXElement => {
  const [isInitialed, setIsInitialed] = createSignal<boolean>(false);
  const i18n = createI18n({
    language: 'default',
    locales: {
      default: LangDefault,
      'zh-CN': LangZhCN,
      'zh-HK': LangZhHk,
      'en-US': LangEnUS,
      'jp-JP': LangJpJP,
    },
  });

  async function initialize() {
    switchTheme();
    setIsInitialed(true);

    try {
      const res = await reqGetLang();
      if (res.code === 0) {
        i18n.setLanguage(res.data.lang);
      }
    } catch (error) {
      notification('初始化失败');
    }
  }
  onMount(() => {
    initialize();
  });
  return (
    <Show when={isInitialed()}>
      <I18nProvider i18n={i18n}>
        <div
          class={classnames(
            styles.App,
            'wlc-bg-gray-200',
            'dark:wlc-bg-gray-800'
          )}
        >
          <div
            class={classnames(
              'wlc-fixed',
              'wlc-z-50',
              'wlc-top-4',
              'wlc-right-4',
              'wlc-shadow-md'
            )}
          >
            <SwitchTheme />
          </div>
          <div
            class={classnames(
              'wlc-fixed',
              'wlc-z-50',
              'wlc-top-4',
              'wlc-right-24',
              'wlc-cursor-pointer'
            )}
          >
            <LangSelector />
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
      </I18nProvider>
    </Show>
  );
};

export default App;
