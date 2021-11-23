<template>
  <layout>
    <header class="header">
      <van-dropdown-menu>
        <van-dropdown-item v-model="value" :options="option"/>
      </van-dropdown-menu>
      <Tabs :data-source="intervalList" :value.sync="interval"/>
    </header>
    <div class="chart">
      <div class="caption">
        <span v-if="interval === 'isoWeek'">本周</span>
        <span v-else-if="interval === 'moth'">本月</span>
        <span v-else>今年</span>
      </div>
      <div class="total">
        <span v-if="value === '-'">总支出：￥{{ total }}</span>
        <span v-else>总收入：￥{{ total }}</span>
      </div>
      <div class="average">平均值：￥{{ average }}</div>
      <div id="figure"></div>
      <div class="Rank">
        <div class="caption">
          <span>支出排行榜</span>
        </div>
        <!--        <ul class="tag-list" v-if="targetRecords.length>0">-->
        <!--          <li class="tag-item"-->
        <!--          v-for="(item, index) in this.groupByTag()"-->
        <!--          :key="index">-->
        <!--            <div class="tag-info">-->
        <!--              <div class="icon">-->
        <!--                <Icon :iconName="item.tag.name"/>-->
        <!--              </div>-->
        <!--              <span>{{item.tag.value}}</span>-->
        <!--              <span>{{item.percentage}}%</span>-->
        <!--            </div>-->
        <!--            <div>{{item.amount}}</div>-->
        <!--          </li>-->
        <!--        </ul>-->
        <!--        <div v-else class="reverse">-->

        <!--        </div>-->
      </div>
    </div>
  </layout>
</template>

<script lang="ts">
import Vue from 'vue';
import {DropdownMenu, DropdownItem} from 'vant';
import {Component, Prop} from 'vue-property-decorator';
import Tabs from '@/components/common/Tabs.vue';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek'
dayjs.extend(isoWeek)
import clone from '@/lib/clone';

Vue.use(DropdownMenu);
Vue.use(DropdownItem);
@Component({
  components: {Tabs}
})
export default class Statistics extends Vue {
  intervalList = [
    {text: '周', value: 'isoWeek'},
    {text: '月', value: 'moth'},
    {text: '年', value: 'year'},
  ];
  interval: 'isoWeek' | 'month' | 'year' = 'isoWeek';
  value: '-' | '+' = '-';

  option = [
    {text: '支出', value: '-'},
    {text: '收入', value: '+'},
  ];

  //get
  get total(){
    const amounts = [...this.groupByInterval().values()];
    console.log(amounts)
    let sum = 0;
    for (let i= 0; i< amounts.length; i++){
      sum += amounts[i]
    }
    return sum
  }

  get targetRecords(): RecordItem[] {
    const now = dayjs();
    return clone<RecordItem[]>(this.$store.state.recordList)
        .filter((item: { category: string }) => item.category === this.value)
        .filter((item: { createAt: string | number | Date | dayjs.Dayjs | null | undefined }) => dayjs(item.createAt).isSame(now, this.interval));
  }

  groupByWeek(records: RecordItem[]): Map<string, number> {
    const keys = [ '周一', '周二', '周三', '周四', '周五', '周六','周日'];
    const result = new Map<string,number>();
    let i: number;
    for (i = 1; i < keys.length+1; i++){
      result.set(keys[i],0);
    }
    let r: RecordItem;
    for (r of records) {
      const key = keys[dayjs(r.createAt).day()];
      const amount = result.get(key) as number;
      result.set(key,amount + r.amount)
    }
    return result
  }
  groupByInterval(): Map<string,number>{
    let result = new Map<string,number>();
    switch (this.interval){
      case "isoWeek":
        result = this.groupByWeek(this.targetRecords)
        break
    }
    return result
  }

}


</script>

<style lang="scss" scoped>

</style>