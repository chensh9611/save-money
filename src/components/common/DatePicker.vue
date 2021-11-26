<template>
  <div class="date-picker">
    <div class="year">
      <select v-model="year">
        <option v-for="year in years" :key="year" :value="year">{{year}}</option>
      </select>
      <span>年</span>
    </div>
    <div class="month">
      <select v-model="month">
        <option v-for="month in 12" :key="month" :value="month">{{ beautifyData(month) }}</option>
      </select>
      <span>月</span>
    </div>
    <div class="day">
      <select v-model="date">
        <option v-for="day in days" :key="day" :value="day">{{ beautifyData(day) }}</option>
      </select>
      <span>日</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Watch} from 'vue-property-decorator';
import dayjs from 'dayjs';

@Component
export default class DatePicker extends Vue {
  @Prop(String) initialDate?: string
  year = dayjs(this.initialDate).year()
  month = dayjs(this.initialDate).month()+1
  date = dayjs(this.initialDate).date()
  years = this.$store.getters.years

  get days(): number{
    const day = [31,28,31,30,31,30,31,31,30,31,30,31];
    //判断是否是闰年
    if ((this.year % 4 === 0 && this.year % 100 !== 0)
        ||(this.year % 100 === 0 && this.year % 400 ===0)){
      if (this.month === 2){
        return 29
      }else {
        return day[this.month - 1]
      }
    }else {
      return day[this.month - 1]
    }
  }
  beautifyData(month: number){
    return month <10 ? '0'+month.toString() : month.toString()
  }
  @Watch('year')
  onYearChange(newYear: number){
    this.$emit('update:year',newYear)
  }
  @Watch('month')
  onMonthChange(newMonth: number){
    this.$emit('update:month',newMonth)
  }
  @Watch('date')
  onDateChange(newDate: number){
    this.$emit('update:date',newDate)
  }
}

</script>

<style lang="scss" scoped>
.date-picker {
  display: flex;
  align-items: center;
  font-size: inherit;
  height: 40px;
  select {
    font-size: inherit;
    border: inherit;
    background-color: inherit;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }
}
</style>