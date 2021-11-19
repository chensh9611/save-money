<template>
  <div class="type-wrapper">
    <div class="type">
          <span class="span-item"
                :class="{[classPrefix+'-span-item']: classPrefix, selected: type === '-'}"
                @click="selectType('-')">支出</span>
      <span class="span-item"
            :class="{[classPrefix+'-span-item']:classPrefix, selected: type === '+'}"
            @click="selectType('+')">收入</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

@Component
export default class Types extends Vue {
  @Prop(String) readonly classPrefix!: string;
  @Prop(String) readonly type!: string;

  selectType(type: string) {
    if (type !== '-' && type !== '+') {
      throw new Error('Type is unknown');
    }
    this.$emit('update:type', type);
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/style.scss";
.type-wrapper {
  padding-top: 10px;
  display: flex;
  justify-content: center;
  background: #9d81ea;
  .type {
    font-size: 18px;
    border: 1px solid #333;
    border-radius: 4px;
    height: 24px;
    display: flex;
    align-items: flex-start;

    .span-item {
      padding: 0 60px;
      font-size: 14px;
    }

    .selected {
      background-color: #333;
      border: 1px solid #333;
      color: #9d81ea;
    }
  }
}
</style>