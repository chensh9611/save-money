<template>
  <Layout>
    <header class="header">
      <div class="logo">
        <TopNav>
          <span slot="title">妍妍记账</span>
        </TopNav>
      </div>
      <div class="info">
        <div class="calendar">
          <select v-model="year" class="year">
            <option v-for="y in years" :key="y" :value="y">{{ y }}年</option>
          </select>
          <div class="month">
            <select v-model="month">
              <option v-for="m in 12" :key="m" :value="m">{{
                  beautifyMonth(m)
                }}</option>
            </select>
            <span>月</span>
            <Icon name="triangle" class="icon" />
          </div>
        </div>
        <div class="total">
          <div>
            <div class="label">收入</div>
            <div class="value">
              <span>{{ this.totalIncome.toString().split(".")[0] || 0 }}</span>
              .{{ this.totalIncome.toString().split(".")[1] || "00" }}
            </div>
          </div>
          <div>
            <div class="label">支出</div>
            <div class="value">
              <span>{{ this.totalExpense.toString().split(".")[0] || 0 }}</span>
              .{{ this.totalExpense.toString().split(".")[1] || "00" }}
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </header>
    <ul v-if="groupList.length > 0" class="record">
      <li v-for="(group, index) in groupList" :key="index">
        <div class="title">
          <span>{{ getTitle(group) }}</span>
          <span>{{ getTotal(group) }}</span>
        </div>
        <div class="items">
          <router-link
              class="item"
              v-for="(item, index) in group.items"
              :key="index"
              :to="`/detail/record-edit/${item.id}`"
          >
            <div class="tag">
              <span>
                <Icon :icon-name="$store.getters.getItemIcon(item.tagIds[0])" class="icon" />
              </span>
              <span v-if="item.notes.length<=0">{{$store.getters.getTagName(item.tagIds[0])}}</span>
              <span v-else>{{item.notes}}</span>
            </div>
            <span>{{ getAmount(item) }}</span>
          </router-link>
        </div>
      </li>
    </ul>
    <div v-else class="reverse">
    </div>
  </Layout>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import dayjs from "dayjs";
import clone from "@/lib/clone";
import Layout from '@/components/common/Layout.vue';
import Icon from '@/components/common/Icon.vue';
import TopNav from '@/components/common/TopNav.vue';

type Group = {
  name: string;
  items: RecordItem[];
};

@Component({
  components: {TopNav, Icon, Layout },
})
export default class Detail extends Vue {
  year =
      window.sessionStorage.getItem("year") ||
      dayjs()
          .year()
          .toString();
  month =
      window.sessionStorage.getItem("month") || (dayjs().month() + 1).toString();

  created(){
    this.$store.commit('fetchTagList')
    this.$store.commit('fetchRecordList')
  }
  get years() {
    const endYear = dayjs().year();
    let year = 1970;
    const result: number[] = [];
    while (year <= endYear) {
      result.push(year);
      year++;
    }
    return result;
  }

  get recordList(): RecordItem[] {
    return this.$store.state.recordList;
  }

  get groupList() {
    const result: Group[] = [];
    const names: string[] = [];
    // 对记录排序
    const sortedRecordList = clone<RecordItem[]>(this.recordList)
        .filter(
            (item: { createAt: string | number | Date | dayjs.Dayjs | null | undefined }) =>
                dayjs(item.createAt).year() === parseInt(this.year) &&
                dayjs(item.createAt).month() + 1 === parseInt(this.month)
        )
        .sort((b: { createAt: string | number | Date | dayjs.Dayjs | null | undefined }, a: { createAt: string | number | Date | dayjs.Dayjs | null | undefined }) => {
          return dayjs(a.createAt).valueOf() - dayjs(b.createAt).valueOf();
        });
    let record: RecordItem;
    for (record of sortedRecordList) {
      let date: string;
      if (
          this.year ===
          dayjs()
              .year()
              .toString()
      ) {
        // 今年的数据按天分组
        date = dayjs(record.createAt)
            .toISOString()
            .split("T")[0];
      } else {
        // 以前的数据按月分组
        date = dayjs(record.createAt).format("YYYY-MM");
      }

      const index = names.indexOf(date);
      if (index < 0) {
        names.push(date);
        result.push({ name: date, items: [record] });
      } else {
        result[index].items.push(record);
      }
    }
    return result;
  }

  get totalIncome() {
    let total = 0;
    let group: Group;
    for (group of this.groupList) {
      let record: RecordItem;
      for (record of group.items) {
        if (record.category === "+") {
          total += record.amount;
        }
      }
    }
    return total;
  }

  get totalExpense() {
    let total = 0;
    let group: Group;
    for (group of this.groupList) {
      let record: RecordItem;
      for (record of group.items) {
        if (record.category === "-") {
          total += record.amount;
        }
      }
    }
    return total;
  }

  beautifyMonth(m: number) {
    return m < 10 ? "0" + m.toString() : m.toString();
  }

  toWeekday(value: number) {
    if (value >= 0 && value <= 6) {
      return [
        "星期天",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ][value];
    }
  }

  getTitle(group: Group) {
    const day = dayjs(group.name);
    const now = dayjs();
    if (day.isSame(now, "day")) {
      return `今天 ${this.toWeekday(day.day())}`;
    } else if (day.isSame(now.subtract(1, "day"), "day")) {
      return `昨天 ${this.toWeekday(day.day())}`;
    } else if (day.isSame(now.subtract(2, "day"), "day")) {
      return `前天 ${this.toWeekday(day.day())}`;
    } else if (day.isSame(now, "year")) {
      return `${day.format("M月D日")} ${this.toWeekday(day.day())}`;
    } else {
      return `${day.format("YYYY年M月")}`;
    }
  }

  getTotal(group: Group) {
    let total = 0;
    let item: RecordItem;
    for (item of group.items) {
      if (item.category === "-") {
        total -= item.amount;
      } else if (item.category === "+") {
        total += item.amount;
      }
    }
    if (total <= 0) {
      return `支出: ¥${Math.abs(total)}`;
    } else {
      return `收入: ¥${Math.abs(total)}`;
    }
  }

  getAmount(record: RecordItem) {
    if (record.category === "+") {
      return record.amount;
    } else {
      return -record.amount;
    }
  }

  @Watch("year")
  saveYear(year: string) {
    window.sessionStorage.setItem("year", year);
  }
  @Watch("month")
  saveMonth(month: string) {
    window.sessionStorage.setItem("month", month);
  }
}
</script>

<style lang="scss" scoped>
  .header {
    background: #9d81ea;
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    @media (min-width: 600px) {
      max-width: 520px;
      margin: 0 auto;
      left: 694px;
    }
    @media (width: 768px) {
      max-width: 520px;
      margin: 0 auto;
      left: 124px;
    }

  .info {
    display: flex;
    align-items: center;

    .label {
      font-size: 14px;
      margin-bottom: 6px;
      color: #333;
    }

    .value {
      span {
        font-size: 20px;
      }

      font-size: 12px;
      margin-top: 6px;
    }

    .calendar {
      position: relative;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .year {
        font-size: 14px;
        //padding: 0 3px;
        background-color: #9d81ea;
        color: #333;
          //清除select的边框样式
          border: none;
          //清除select聚焦时候的边框颜色
          outline: none;
          //将select的宽高等于div的宽高
          width: 100%;
          height: 20px;
          line-height: 20px;
          //隐藏select的下拉图标
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;

      }

      .month {
        font-size: 14px;
        padding: 0 3px;
        display: flex;
        align-items: center;
        background-color: #9d81ea;

        select {
          background-color: #9d81ea;
          font-size: 24px;
          //清除select的边框样式
          border: none;
          //清除select聚焦时候的边框颜色
          outline: none;
          //将select的宽高等于div的宽高
          width: 100%;
          height: 40px;
          line-height: 40px;
          //隐藏select的下拉图标
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
        }
        .icon {
          font-size: 18px;
          margin-left: 3px;
        }
      }

      &::after {
        content: "";
        display: block;
        width: 1px;
        height: 24px;
        background: #333333;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
    }

    .total {
      flex-grow: 1;
      display: flex;
      justify-content: space-between;
      padding: 4px 16px;
    }
  }
}

.record {
  margin-top: 121px;
  margin-bottom: 48px;
  > li {
    .title {
      font-size: 12px;
      color: #999999;
      display: flex;
      justify-content: space-between;
      padding: 8px 16px;
      border-bottom: 0.3px solid #dddddd;
      background: #ffffff;
      width: 100%;
    }

    .items {
      display: flex;
      flex-direction: column;
      padding: 2px 16px 8px;

      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        box-shadow: inset 0 -0.5px 0.5px -0.5px rgba(0, 0, 0, 0.2);
        color: #333333;

        .tag {
          display: flex;
          align-items: center;

          .icon {
            background: #dadbdd;
            width: 32px;
            height: 32px;
            padding: 4px;
            border-radius: 50%;
            margin-right: 16px;
            color: #9d81ea;
          }
        }
      }
    }
  }
}

.reverse {
  margin-top: 20vh;
}
</style>
