import classnames from 'classnames';
import { Component, For, Show } from 'solid-js';

import styles from './index.module.css';

interface Option {
  key: string;
  icon: string;
}

interface PropsModel {
  options: Option[];
  hideKeys: () => string[];
  onSelect: (key: string) => void;
}

const Tooltip: Component<PropsModel> = ({ options, hideKeys, onSelect }) => (
  <div class={classnames(styles.tooltip, 'wlc-fixed', 'wlc-z-20')}>
    <For each={options}>
      {({ key, icon }) => (
        <Show when={!hideKeys().includes(key)}>
          <div
            class={classnames(
              styles['icon-wrapper'],
              'wlc-flex',
              'wlc-justify-center',
              'wlc-items-center',
              'wlc-shadow-md',
              'wlc-bg-gray-800',
              'dark:wlc-bg-white',
              'hover:wlc-bg-white',
              'dark:hover:wlc-bg-gray-900',
              'wlc-text-white',
              'dark:wlc-text-gray-800',
              'hover:wlc-text-gray-800',
              'dark:hover:wlc-text-white',
              'wlc-cursor-pointer',
              'wlc-transition-all'
            )}
            onClick={() => onSelect(key)}
          >
            <span
              class={classnames(
                styles.icon,
                'iconfont',
                `xvli-${icon}`,
                'wlc-transition-all'
              )}
            ></span>
          </div>
        </Show>
      )}
    </For>
  </div>
);

export default Tooltip;
