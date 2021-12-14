import classnames from 'classnames';
import { Component, For } from 'solid-js';
import CmpChart from './cmp-chart';

interface PropsModel {
  packages: PackageModel[];
}

const Completion: Component<PropsModel> = ({ packages }) => (
  <div
    class={classnames(
      'wlc-flex',
      'wlc-flex-wrap',
      'wlc-place-items-start',
      'wlc-px-6',
      'wlc-w-4/6',
      'wlc-max-w-6xl',
      'wlc-mx-auto',
      'wlc-rounded',
      'dark:wlc-bg-gray-400'
    )}
  >
    <For each={packages}>
      {({ name, percent }) => (
        <CmpChart name={name as string} percent={percent} />
      )}
    </For>
  </div>
);

export default Completion;
