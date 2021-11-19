<template>
  <div class="top">
    <div v-if="name" class="back-icon" @click="backOne">
      <Icon :iconName="name" @click="$emit('click',$event)"/>
    </div>
    <div class="title">
      <slot name="title"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

@Component
export default class TopNav extends Vue {
  @Prop(String) name?: string;

  backOne() {
    this.$router.go(-1);
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/style.scss";
.top {
  position: relative;
  text-align: center;
  padding: 10px 0;
  background-color: $selected-color;

  .back-icon {
    position: absolute;
    left: 10px;
    padding: 0 15px 0 5px;

    .icon {
      width: 20px;
      height: 20px;
    }
  }

  .title {
    font-size: 16px;
    font-weight: 700;
  }
}
</style>