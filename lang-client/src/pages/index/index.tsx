import { Link } from 'solid-app-router';
import { createSignal, onMount } from 'solid-js';
import classnames from 'classnames';
import { useI18n } from 'solid-i18n';
import { reqGetAllProjects } from '../../apis';
import LayoutScroll, {
  LayoutHeaderCenter,
} from '../../components/layout-scroll';

import styles from './index.module.css';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function PageIndex() {
  const i18n = useI18n();
  const [getClients, setClients] = createSignal<ProjectModel[]>([]);
  async function getAllProjects() {
    const { code, data } = await reqGetAllProjects();

    if (code === 0) {
      setClients(data.clients);
    }
  }
  onMount(() => {
    getAllProjects();
  });
  return (
    <LayoutScroll
      renderHeader={() => (
        <LayoutHeaderCenter
          render={() => (
            <>
              <h1
                class={classnames(
                  styles.title,
                  'wlc-text-gray-800',
                  'dark:wlc-text-white'
                )}
              >
                {i18n.t('HOME.ALL_PROJECTS')}
              </h1>
            </>
          )}
        />
      )}
      renderBody={() => (
        <section class={styles.section}>
          <div
            class={classnames(
              'wlc-grid wlc-grid-cols-2 wlc-gap-4',
              'wlc-mx-auto',
              'wlc-px-20',
              'md:wlc-container'
            )}
          >
            {getClients().map(item => (
              <Link
                class={classnames(
                  'wlc-py-4',
                  'wlc-px-4',
                  'wlc-rounded',
                  'wlc-bg-white',
                  'wlc-transition-all',
                  'wlc-shadow-md',
                  'hover:wlc-shadow-lg',
                  'wlc-transform',
                  'hover:wlc--translate-y-1'
                )}
                href={`/client/${item.id}`}
                title={item.dir}
              >
                <div
                  class={classnames('wlc-h-6', 'wlc-text-base', 'wlc-truncate')}
                >
                  name: {item.name}
                </div>
                <div
                  class={classnames('wlc-h-6', 'wlc-text-base', 'wlc-truncate')}
                >
                  id: {item.id}
                </div>
                <div
                  class={classnames('wlc-h-6', 'wlc-text-base', 'wlc-truncate')}
                  title={item.dir}
                >
                  dir: {item.dir}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    ></LayoutScroll>
  );
}

export default PageIndex;
