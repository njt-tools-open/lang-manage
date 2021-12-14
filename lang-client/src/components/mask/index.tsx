import { createSignal, JSXElement, onCleanup, onMount, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

interface PropsModel {
  children: JSXElement | null;
}

const PREFIX = 'mask-';

const byId = (id: string) => document.getElementById(id);

function Mask({ children }: PropsModel): JSXElement {
  const [getContainer, setContainer] = createSignal<string>('');
  onMount(() => {
    const container = document.createElement('div');
    const id = `${PREFIX}${Date.now()}`;
    container.setAttribute('id', id);
    document.body.appendChild(container);
    setContainer(id);
  });

  onCleanup(() => {
    document.body.removeChild(byId(getContainer()) as HTMLDivElement);
  });

  return (
    <Show when={getContainer()}>
      <Portal mount={byId(getContainer()) as HTMLDivElement}>
        <div class="wlc-fixed wlc-inset-0 wlc-z-50 wlc-overflow-y-auto wlc-bg-black wlc-bg-opacity-60">
          {children}
        </div>
      </Portal>
    </Show>
  );
}

export default Mask;
