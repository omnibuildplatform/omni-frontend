import { EChartsOption } from 'echarts';

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
      itemStyle: {
        borderRadius: 5,
        borderColor: '#fff',
        borderWidth: 0.5,
      },
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
export const FailOption: EChartsOption = {
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
                  color: '#F3524D', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#E23833', // 100% 处的颜色
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
