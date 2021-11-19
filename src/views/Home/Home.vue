<template>
  <Layout>
    <div class="head">
      <TopNav>
        <span slot="title">妍妍记账</span>
      </TopNav>
    </div>
    <ShowMoney>
      <span slot="title_slot" class="title">今日支出</span>
      <span slot="pay_slot" class="pay">￥ 0 </span>
      <span slot="income_slot" class="income">本月收入 ￥ 0</span>
    </ShowMoney>
    <MoneyKey/>
  </Layout>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import ShowMoney from '@/components/common/ShowMoney.vue';
import TopNav from '@/components/common/TopNav.vue';
import Layout from '@/components/common/Layout.vue';
import MoneyKey from '@/components/common/MoneyKey.vue';
@Component({
  components: {MoneyKey, Layout, TopNav, ShowMoney}
})
export default class Home extends Vue {
  created(){
    this.$store.commit('fetchCategory')
  }
}
</script>

<style lang="scss" scoped>
</style>