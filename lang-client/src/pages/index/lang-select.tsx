import classnames from 'classnames';
import { useI18n } from 'solid-i18n';
import {
  createSignal,
  For,
  JSXElement,
  onCleanup,
  onMount,
  Show,
} from 'solid-js';
import { reqSetLang } from '../../apis';
import notification from '../../utils/notification';

const LANGS = [
  {
    lang: 'zh-CN',
    label: '中文',
  },
  {
    lang: 'zh-HK',
    label: '中文繁體',
  },
  {
    lang: 'en-US',
    label: 'English',
  },
  {
    lang: 'jp-JP',
    label: '日本語',
  },
];

function LangSelector(): JSXElement {
  const i18n = useI18n();
  const [getVisible, setVisible] = createSignal<boolean>(false);

  async function handleSelectLang(lang: string) {
    try {
      const res = await reqSetLang(lang);
      if (res.code === 0) {
        notification('修改成功');
        i18n.setLanguage(lang);
      } else {
        notification('修改失败');
      }
    } catch (error) {
      notification('修改失败');
    }
  }

  function handleClickBody() {
    setVisible(false);
  }

  onMount(() => {
    document.body.addEventListener('click', handleClickBody);
  });

  onCleanup(() => {
    document.body.removeEventListener('click', handleClickBody);
  });

  return (
    <div
      class={classnames(
        'wlc-relative',
        'wlc-box-content',
        'wlc-h-6',
        'wlc-px-4',
        'wlc-border-2',
        'wlc-border-transparent',
        'wlc-text-gray-800',
        'dark:wlc-text-white',
        'wlc-text-center',
        'wlc-rounded',
        'wlc-select-none'
      )}
      style={{
        'min-width': '60px',
      }}
    >
      <span
        class="wlc-cursor-pointer"
        onClick={e => {
          e.stopPropagation();
          const visible = !getVisible();
          setVisible(visible);
        }}
      >
        {() => LANGS.find(item => item.lang === i18n.language)?.label}
      </span>
      <Show when={getVisible()}>
        <div
          class={classnames(
            'wlc-absolute',
            'wlc-box-content',
            'wlc-w-full',
            'wlc-py-1',
            'wlc-px-2',
            'wlc-text-center',
            'wlc-bg-white',
            'wlc-text-gray-800',
            'wlc-rounded',
            'wlc-cursor-default',
            'wlc-shadow-md'
          )}
          style={{ top: '130%', right: '0' }}
        >
          <For each={LANGS}>
            {item => (
              <div class="wlc-py-1">
                <span
                  class={classnames(
                    'wlc-cursor-pointer',
                    'hover:wlc-text-gray-400',
                    'wlc-text-xs'
                  )}
                  onClick={e => {
                    e.stopPropagation();
                    handleSelectLang(item.lang);
                  }}
                >
                  {item.label}
                </span>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}

export default LangSelector;
