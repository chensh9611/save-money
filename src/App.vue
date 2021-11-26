<template>
  <div id="app">
    <router-view v-slot="{Component}">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
@Component
export default class App extends Vue{

}
</script>

<style lang="scss">
@import "~@/assets/styles/reset.scss";

#app {
  max-width: 520px;
  margin: 0 auto;
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
