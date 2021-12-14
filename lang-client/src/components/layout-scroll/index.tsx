import { Component, JSXElement } from 'solid-js';

interface PropsModel {
  renderHeader: () => JSXElement;
  renderBody: () => JSXElement;
  ref?: HTMLDivElement;
}

const LayoutScroll: Component<PropsModel> = props => (
  <div
    class="wlc-h-screen wlc-overflow-y-auto"
    style={{ behavior: 'smooth' }}
    ref={props.ref}
  >
    <div class="wlc-fixed wlc-top-0 wlc-inset-x-0 wlc-z-20 wlc-h-24">
      {props.renderHeader()}
    </div>
    <div class="wlc-pt-24">{props.renderBody()}</div>
  </div>
);

export const LayoutHeaderCenter: Component<{
  render: () => JSXElement;
}> = props => (
  <div class="wlc-flex wlc-items-center wlc-justify-center wlc-h-24">
    {props.render()}
  </div>
);

export default LayoutScroll;
