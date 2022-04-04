import classnames from 'classnames';
import { For, JSXElement, Show } from 'solid-js';
import styles from './index.module.css';

interface PropsModel {
  deleting: () => boolean;
  state: {
    deleteSelectedKeys: string[];
  };
  packages: PackageModel[];
  translation: {
    name: string;
    data: Record<string, any>;
  };
  onUpdate: (value: DatasourceModel) => void;
  onSelect: (key: string) => void;
}

function ModifyItem({
  deleting,
  state,
  packages,
  translation,
  onUpdate,
  onSelect,
}: PropsModel): JSXElement {
  const handleChange = (key: string, value: string) => {
    onUpdate({
      name: translation.name,
      data: {
        ...translation.data,
        [key]: value,
      },
    });
  };

  return (
    <div
      class={classnames(
        styles['modify-item'],
        'wlc-relative',
        'wlc-mb-3',
        'wlc-bg-white',
        'wlc-border-2',
        'dark:wlc-border-white',
        'wlc-rounded'
      )}
    >
      <h4
        class={classnames(
          'wlc-h-10',
          'wlc-px-3',
          'wlc-rounded-t',
          'wlc-bg-gray-800',
          'wlc-leading-10',
          'wlc-text-xl',
          'wlc-font-bold',
          'wlc-text-white'
        )}
      >
        {translation.name}
      </h4>
      <div class="wlc-px-2 wlc-py-3">
        <For each={packages}>
          {({ name }) => (
            <div class={styles['update-item']}>
              <span
                title={name}
                class={classnames('wlc-truncate', 'wlc-h-full')}
              >
                {name}
              </span>
              <div>
                <input
                  type="text"
                  class={classnames(
                    styles['update-item-input'],
                    'wlc-border',
                    'wlc-rounded',
                    'focus:wlc-border-blue-500',
                    !translation.data[name]
                      ? 'wlc-border-red-300'
                      : 'wlc-border-gray-200'
                  )}
                  value={translation.data[name]}
                  onInput={e => handleChange(name, e.target.value)}
                />
              </div>
            </div>
          )}
        </For>
      </div>
      <Show when={deleting()}>
        <div
          class={classnames(
            'wlc-absolute',
            'wlc-z-10',
            'wlc-bg-gray-800',
            'wlc-bg-opacity-50',
            'wlc-inset-0',
            'wlc-rounded',
            'wlc-cursor-pointer'
          )}
          onClick={() => onSelect(translation.name)}
        >
          <div
            class={classnames(
              styles['delete-wrapper'],
              'wlc-w-6',
              'wlc-h-6',
              'wlc-border',
              'wlc-border-width'
            )}
          >
            <Show when={state.deleteSelectedKeys.includes(translation.name)}>
              <div
                class={classnames(styles['delete-inset'], 'wlc-bg-white')}
              ></div>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default ModifyItem;
