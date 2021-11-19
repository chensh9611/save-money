<template>
  <div class="category-wrapper">
    <span class="span-item"
          :class="{selected: type === '-'}"
          @click="selectType('-')">支出</span>
    <span class="span-item"
          :class="{selected: type === '+'}"
          @click="selectType('+')">收入</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

@Component
export default class TypeSection extends Vue {
  @Prop(String) type!: string;
  @Prop(String) classPrefix?: string

  selectType(type: string) {
    if (type !== '-' && type !== '+'){
      throw new Error('type 错误！')
    }
    this.$emit('update:type',type)
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/style.scss";
.category-wrapper {
  color: #333;
  border: 1px solid #333;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  align-items: flex-start;
  .span-item {
    padding: 0 50px;
  }
  .selected {
    background-color: #333;
    color: #9d81ea;
    border: 1px solid #333;
  }
}
</style>