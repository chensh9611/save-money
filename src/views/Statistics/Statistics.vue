<template>
  <layout>
    <div class="statistics">
      <header class="header">
        <van-dropdown-menu>
          <van-dropdown-item v-model="value" :options="option"/>
        </van-dropdown-menu>
        <Tabs :data-source="intervalList" :value.sync="interval"/>
        <div class="caption">
          <span v-if="interval === 'isoWeek'">本周</span>
          <span v-else-if="interval === 'month'">本月</span>
          <span v-else>今年</span>
        </div>
      </header>
      <div class="chart">
        <div class="total">
          <span v-if="value === '-'">总支出：￥{{ total }}</span>
          <span v-else>总收入：￥{{ total }}</span>
        </div>
        <div class="average">平均值：￥{{ average }}</div>
        <Chart :options="options"/>
        <div class="Rank">
          <div class="caption">
            <span>支出排行榜</span>
          </div>
          <ul class="tag-list" v-if="targetRecords.length>0">
            <li class="tag-item"
                v-for="(item, index) in this.groupByTag()"
                :key="index">
              <div class="tag-info">
                <div class="icon">
                  <Icon :iconName="item.iconName"/>
                </div>
                <div class="name">
                  <span class="tag-name">{{ item.tag }}</span>
                  <span>{{ item.percentage }}%</span>
                  <span class="schedule">
                    <van-progress
                        :percentage="item.percentage"
                        :pivot-text="'￥'+item.amount"
                        pivot-color="#9d81ea"
                        stroke-width="8px"
                        :show-pivot="true"
                        track-color="none"
                        color="#9d81ea"
                    />
                  </span>
                </div>
                <div>
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="reverse">

          </div>
        </div>
      </div>
    </div>

  </layout>
</template>

<script lang="ts">
import Vue from 'vue';
import {DropdownMenu, DropdownItem, Progress} from 'vant';
import {Component, Watch} from 'vue-property-decorator';
import Tabs from '@/components/common/Tabs.vue';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import clone from '@/lib/clone';
import Chart from '@/components/common/Chart.vue';

dayjs.extend(isoWeek);

type Group = {
  iconName: string;
  tag: string;
  amount: number;
  percentage: number;
}

Vue.use(DropdownMenu);
Vue.use(DropdownItem);
@Component({
  components: {Chart, Tabs,}
})
export default class Statistics extends Vue {
  intervalList = [
    {text: '周', value: 'isoWeek'},
    {text: '月', value: 'month'},
    {text: '年', value: 'year'},
  ];
  interval: 'isoWeek' | 'month' | 'year' = 'isoWeek';
  value: '-' | '+' = '-';

  option = [
    {text: '支出', value: '-'},
    {text: '收入', value: '+'},
  ];

  //get
  get days() {
    const [year, month] = [dayjs().year(), dayjs().month()];
    const day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if ((year % 4 === 0 && year % 100 !== 0) || (year % 100 === 0 && year % 400 === 0)) {
      if (month === 1) {
        return 29;
      } else {
        return day[month];
      }
    } else {
      return day[month];
    }
  }

  get average() {
    switch (this.interval) {
      case 'isoWeek':
        return (this.total / [...this.groupByInterval().values()].length).toFixed(2);
      case 'month':
        return (this.total / this.days).toFixed(2);
      case 'year':
        return (this.total / 12).toFixed(2);
      default:
        return 0;

    }
  }

  get total() {
    const amounts = [...this.groupByInterval().values()];
    let sum = 0;
    for (let i = 0; i < amounts.length; i++) {
      sum += amounts[i];
    }
    return sum;
  }

  get targetRecords(): RecordItem[] {
    const now = dayjs();
    return clone<RecordItem[]>(this.$store.state.recordList)
        .filter((item: { category: string }) => item.category === this.value)
        .filter((item: { createAt: string | number | Date | dayjs.Dayjs | null | undefined }) => dayjs(item.createAt).isSame(now, this.interval));
  }

  get options() {
    return this.draw(this.groupByInterval());
  }

  @Watch('interval')
  onIntervalChange() {
    this.draw(this.groupByInterval());
  }

  @Watch('value')
  onValueChange() {
    this.draw(this.groupByInterval());
  }

  groupByTag() {
    const tags: string[] = [];
    let result: Group[] = [];
    let record: RecordItem;
    for (record of this.targetRecords) {
      const index = tags.indexOf(this.$store.getters.getTagName(record.tagIds[0]));
      if (index < 0) {
        tags.push(this.$store.getters.getTagName(record.tagIds[0]));
        result.push({iconName: this.$store.getters.getItemIcon(record.tagIds[0]),tag: this.$store.getters.getTagName(record.tagIds[0]), amount: record.amount, percentage: 0});
      } else {
        result[index].amount += record.amount;
      }
    }
    for (let i = 0; i < result.length; i++) {
      result[i].percentage = parseFloat(((result[i].amount * 100) / this.total).toFixed(2));
    }
    result = result.sort((b, a) => a.percentage - b.percentage);
    return result;
  }

  draw(data: Map<string, number>) {
    // 提取变量
    const keys = [...data.keys()];
    const y = [...data.values()];

    return {
      grid: {
        top: '3%',
        left: '3%',
        right: '4%',
        bottom: '12%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: keys,
        axisTick: {
          interval: 0,
          lineStyle: {
            opacity: 0,
          },
        },
        axisLabel: {
          interval: 0,
          fontSize: 8,
          color: '#999999',
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            opacity: 0,
          },
        },
        splitLine: {
          lineStyle: {
            opacity: 0,
          },
        },
        axisLabel: undefined,
        axisTick: undefined,
      },
      series: [
        {
          type: 'line',
          data: y,
          lineStyle: {
            width: 1,
            color: '#666'
          },
          itemStyle: {
            color: '#9d81ea',
            borderWidth: 2
          },
          symbol: 'circle',
          symbolSize: 13,
        },
        {
          name: '平均线',
          type: 'line',
          data: this.toArray(this.average as number, keys.length),
          symbol: 'none',
          lineStyle: {
            type: 'dashed',
            color: '#999999',
            width: 1,
            opacity: 0.5,
          },
        },
        {
          name: '最大值',
          type: 'line',
          data: this.toArray(Math.max(...y), keys.length),
          symbol: 'none',
          lineStyle: {
            color: '#999999',
            width: 1,
            opacity: 0.5,
          },
        },
      ],
      tooltip: {
        show: true, triggerOn: 'click',
        position: 'top',
        formatter: '{c}'
      }
    };
  }

  toArray(value: number, length: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < length; i++) {
      result.push(value);
    }
    return result;
  }

  groupByYear(records: RecordItem[]): Map<string, number> {
    const keys = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    const result = new Map<string, number>();
    let i: number;
    for (i = 0; i < keys.length; i++) {
      result.set(keys[i], 0);
    }
    let record: RecordItem;
    for (record of records) {
      const key = keys[dayjs(record.createAt).month()];
      const amount = result.get(key) as number;
      result.set(key, amount + record.amount);
    }
    return result;
  }

  groupByMonth(records: RecordItem[]): Map<string, number> {
    const keys: string[] = [];
    const result = new Map<string, number>();
    let i: number;
    for (i = 1; i <= this.days; i++) {
      keys.push(i.toString());
    }
    for (i = 0; i < keys.length; i++) {
      result.set(keys[i], 0);
    }
    let record: RecordItem;
    for (record of records) {
      const key = dayjs(record.createAt).date().toString();
      const amount = result.get(key) as number;
      result.set(key, amount + record.amount);
    }
    return result;
  }

  groupByWeek(records: RecordItem[]): Map<string, number> {
    const keys = ['周日', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const result = new Map<string, number>();
    let i: number;
    for (i = 1; i < keys.length; i++) {
      result.set(keys[i], 0);
    }
    let r: RecordItem;
    for (r of records) {
      const key = keys[dayjs(r.createAt).day()];
      const amount = result.get(key) as number;
      result.set(key, amount + r.amount);
    }
    return result;
  }

  groupByInterval(): Map<string, number> {
    let result = new Map<string, number>();
    switch (this.interval) {
      case 'isoWeek':
        result = this.groupByWeek(this.targetRecords);
        break;
      case 'month':
        result = this.groupByMonth(this.targetRecords);
        break;
      case 'year':
        result = this.groupByYear(this.targetRecords);
    }
    return result;
  }
}
</script>

<style lang="scss" scoped>
.statistics {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;

  .header {
    z-index: 999;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    background-color: white;
    font-family: 'Exo 2', sans-serif;

    .caption {
      border-bottom: 0.2px solid #AAAAAA;
      padding: 4px 8px;
      color: #333;
      background-color: #ffffff;
      font-size: 14px;
      font-weight: 650;
    }
  }

  .chart {
    margin-top: 110px;

    .total {
      color: #666;
      font-size: 14px;
    }

    .average {
      color: #666;
      font-size: 12px;
    }

    .Rank {
      .caption {
        color: #333;
        font-size: 16px;
        font-weight: 650;
        border-top: 0.2px solid #AAAAAA;
        padding: 3px 8px;
      }

      .tag-list {
        margin-bottom: 56px;

        .tag-item {
          .tag-info {
            padding: 8px 8px;
            box-shadow: inset 0 -0.5px 0.5px -0.5px rgba(0, 0, 0, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            align-content: flex-start;


            .name {
              min-width: 290px;

              .tag-name {
                padding-right: 8px;
              }

              span {
                font-size: 13px;
              }

            }

            .amount {
              font-size: 13px;
              max-width: 60px;
              //margin-left: 120px;
            }

            .icon {
              display: flex;
              justify-content: center;
              align-items: center;
              background: #dddddd;
              min-width: 32px;
              min-height: 32px;
              border-radius: 50%;
              color: #9d81ea;

              svg {
                min-width: 24px;
                min-height: 24px;
              }
            }
          }
        }
      }
    }
  }
}

</style>