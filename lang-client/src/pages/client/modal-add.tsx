import classnames from 'classnames';
import { JSXElement } from 'solid-js';
import Mask from '../../components/mask';

function ModalAdd({ children }: { children: JSXElement }): JSXElement {
  return (
    <Mask>
      <div
        class={classnames(
          'wlc-w-full',
          'wlc-h-full',
          'wlc-flex',
          'wlc-justify-center',
          'wlc-items-center'
        )}
      >
        <div class="wlc-py-10">
          <div
            class="wlc-bg-white wlc-rounded wlc-overflow-y-auto"
            style={{
              width: '600px',
              'max-height': '620px',
              'padding-bottom': '20px',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </Mask>
  );
}

export default ModalAdd;
