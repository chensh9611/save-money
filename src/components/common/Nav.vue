<template>
  <nav>
    <router-link to="/home" class="item" active-class="selected">
      <Icon iconName="money"/>
      记账
    </router-link>
    <router-link to="/detail" class="item" active-class="selected">
      <Icon iconName='details'/>
      明细
    </router-link>
    <router-link to="statistics" class="item" active-class="selected">
      <Icon iconName="statistics"/>
      统计
    </router-link>
    <router-link to="other" class="item" active-class="selected">
      <Icon iconName="other"/>
      其他
    </router-link>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

@Component
export default class Nav extends Vue {
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/style.scss";

nav {

  display: flex;
  flex-direction: row;
  font-size: 12px;
  padding: 2px 0;
  @extend %outerShadow;

  > .item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 33.33333%;
  }
  .icon {
    height: 32px;
    width: 32px;

  }

  .item.selected {
    color: $selected-color;
  }
}
</style>