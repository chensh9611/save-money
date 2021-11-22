<template>
  <div class="tabs-wrapper">
    <ul class="tabs">
      <li v-for="item in dataSource" :key="item.value"
          @click="selected (item)"
          :class="{selected: item.value === value}">
        {{item.text}}
      </li>
    </ul>
  </div>

</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

type DataSourceItem = {
  text: string;
  value: string;
}
@Component
export default class Tabs extends Vue {
  @Prop({required: true,type: Array}) dataSource!: DataSourceItem[]
  @Prop(String) value!: string
  @Prop(String) classPrefix?: string

  selected(item: DataSourceItem){
    this.$emit('update:value',item.value)
  }
}
</script>

<style lang="scss" scoped>
.tabs-wrapper {
  background: #9d81ea;
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
}
.tabs {

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #333;
  border: 1px solid #333;
  border-radius: 4px;
  margin: 0 6px;

  > li {
    border-right: 1px solid #333;
    padding: 0 48px;
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;

    &.selected {
      background: #333;
      color: #9d81ea;
    }
  }
}
</style>