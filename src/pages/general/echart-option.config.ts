import { AnyObj, JobStatus } from '@/shared/interface/interface';
import { EChartsOption } from 'echarts';
import { cloneDeep } from 'lodash';

export const SuccessRateOption: EChartsOption = {
  title: {
    text: '0',
    left: 'center',
    top: 'center',
    textStyle: {
      fontSize: '32px',
    },
  },
  legend: {
    show: false,
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['75%', '95%'],
      emphasis: {
        label: {
          show: false,
        },
      },
      label: {
        show: false,
        position: 'center',
      },
      labelLine: {
        show: false,
      },
      data: [
        {
          value: 0,
          name: 'success',
          itemStyle: {
            color: {
              type: 'linear',
              x: 1,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#002FA7', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#3AF0FF', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
            shadowBlur: 200,
            shadowColor: 'rgba(0, 74, 140, 0.44)',
          },
        },
        {
          value: 1,
          name: 'failed',
          itemStyle: {
            color: 'rgba(85, 85, 85, 0.16)',
            shadowBlur: 700,
            shadowOffsetY: 8,
            shadowColor: 'rgba(85, 85, 85, 0.16)',
          },
        },
      ],
    },
  ],
};
export const SuccessOption: EChartsOption = {
  title: {
    text: '0',
    left: 'center',
    top: 'center',
    textStyle: {
      fontSize: '32px',
      color: '#ffffff',
    },
  },
  legend: {
    show: false,
  },
  series: [
    {
      name: 'outer',
      type: 'pie',
      radius: ['55%', '95%'],
      emphasis: {
        label: {
          show: false,
        },
      },
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      data: [
        {
          value: 20,
          name: 'failed',
          itemStyle: {
            color: 'rgba(85, 85, 85, 0.1)',
            shadowBlur: 700,
            shadowOffsetY: 8,
            shadowColor: 'rgba(85, 85, 85, 0.16)',
          },
        },
      ],
    },
    {
      name: 'inner',
      type: 'pie',
      radius: ['0%', '55%'],
      emphasis: {
        label: {
          show: false,
        },
      },
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      data: [
        {
          value: 80,
          name: 'success',
          itemStyle: {
            color: {
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                {
                  offset: 0,
                  color: '#46B100', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#6DC335', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
            shadowBlur: 200,
            shadowColor: 'rgba(131, 131, 131, 0.44)',
          },
        },
      ],
    },
  ],
};

export function getPieEchartConfig(type: JobStatus): EChartsOption {
  const config: AnyObj = cloneDeep(SuccessOption);
  const colorConfig: AnyObj = {
    succeed: {
      offsetStart: '#46B100',
      offsetEnd: '#6DC335',
    },
    failed: {
      offsetStart: '#F3524D',
      offsetEnd: '#E23833',
    },
    stopped: {
      offsetStart: '#FF9A2E',
      offsetEnd: '#FF7D00',
    },
  };
  if (colorConfig[type]) {
    config.series[1].data[0].itemStyle.color.colorStops[0].color = colorConfig[type].offsetStart;
    config.series[1].data[0].itemStyle.color.colorStops[1].color = colorConfig[type].offsetEnd;
  }
  return config;
}
