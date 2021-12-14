import classnames from 'classnames';
import { createSignal, JSXElement, onMount } from 'solid-js';
import { disableDarkMode, enableDarkMode } from '../../utils';

enum THEMES {
  LIGHT = 'light',
  DARK = 'dark',
}
const readTheme = (): THEMES =>
  (localStorage.getItem('theme') as THEMES) || THEMES.LIGHT;

const writeTheme = (theme: THEMES) => localStorage.setItem('theme', theme);

export function switchTheme(): void {
  readTheme() === THEMES.DARK ? enableDarkMode() : disableDarkMode();
}

function SwitchTheme(): JSXElement {
  const [getTheme, setTheme] = createSignal<THEMES>(readTheme());

  function handleChangeTheme() {
    const theme = getTheme() === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;

    setTheme(theme);
    writeTheme(theme);
    switchTheme();
  }

  onMount(() => {
    switchTheme();
  });
  return (
    <div
      class={classnames(
        'wlc-box-content',
        'wlc-h-6',
        'wlc-w-16',
        'wlc-border-2',
        'wlc-border-gray-800',
        'dark:wlc-border-white',
        'wlc-bg-gray-800',
        'dark:wlc-bg-white',
        'wlc-rounded',
        'wlc-cursor-pointer'
      )}
      onClick={handleChangeTheme}
    >
      <div
        class={classnames(
          'wlc-bg-white',
          'dark:wlc-bg-gray-900',
          'wlc-h-6',
          'wlc-w-8',
          'wlc-rounded',
          'wlc-transition-all',
          'wlc-transform',
          getTheme() === THEMES.DARK ? 'wlc-translate-x-8' : ''
        )}
      ></div>
    </div>
  );
}

export default SwitchTheme;
