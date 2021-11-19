<template>
  <div>
    <router-link to="/home/money">
      <div class="money-link">
        <span style="color:#333;">记一笔</span>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

@Component
export default class MoneyKey extends Vue {

}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/style.scss";
.money-link {
  margin: 28px auto 0;
  background-color: $selected-color;
  font-size: 18px;
  font-weight: 700;
  border-radius: 10px;
  padding: 11px;
  max-width: 141px;
  text-align: center;
  ::v-deep a {
    color: #333;
  }
}
</style>