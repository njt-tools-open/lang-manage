import { Component, createEffect, onCleanup, onMount } from 'solid-js';
import { Chart } from '@antv/g2';

interface PropsModel {
  name: string;
  percent: number;
}

const paint = (name: string, percent: number) => {
  const chart = new Chart({
    container: name,
    autoFit: true,
    // height: 200
  });
  chart.data([
    {
      type: name,
      value: Math.floor(percent * 100),
    },
  ]);
  chart.facet('rect', {
    fields: ['type'],
    padding: 20,
    showTitle: false,
    eachView: (view, facet) => {
      const data = facet?.data as any;
      const color = '#212936';
      // color = '#f0657d';
      data.push({ type: 'default', value: 100 - data[0].value });
      view.data(data);
      view.coordinate('theta', {
        radius: 0.8,
        innerRadius: 0.5,
      });
      view
        .interval()
        .adjust('stack')
        .position('value')
        .color('type', [color, '#eceef1'])
        .style({
          opacity: 1,
        });
      view.annotation().text({
        position: ['50%', '50%'],
        content: data[0].type,
        style: {
          fontSize: 12,
          fill: '#8c8c8c',
          fontWeight: 300,
          textBaseline: 'bottom',
          textAlign: 'center',
        },
        offsetY: -12,
      });

      view.annotation().text({
        position: ['50%', '50%'],
        content: data[0].value,
        style: {
          fontSize: 18,
          fill: '#000',
          fontWeight: 500,
          textAlign: 'center',
        },
        offsetY: 10,
      });

      view.interaction('element-active');
    },
  });
  chart.render();
};

const CmpChart: Component<PropsModel> = option => {
  let chart: Chart | undefined;
  const { name, percent } = option;
  createEffect(prev => {
    if (percent !== prev) {
      paint(name, percent);
    }
    return percent;
  }, percent);

  onMount(() => {
    paint(name, percent);
  });

  onCleanup(() => {
    chart?.destroy();
  });

  return <div id={name} class="wlc-w-1/3 wlc-h-56"></div>;
};

export default CmpChart;
