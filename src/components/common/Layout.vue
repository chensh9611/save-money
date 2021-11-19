<template>
  <div class="layout-wrapper">
    <section class="main">
      <slot/>
    </section>
    <div class="bottom">
      <Nav/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import TopNav from '@/components/common/TopNav.vue';
import Nav from '@/components/common/Nav.vue';
@Component({
  components: {Nav, TopNav}
})
export default class Layout extends Vue {
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/style.scss";
.layout-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  .head {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
  }
  .bottom {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    background-color: white;
    font-family: 'Exo 2', sans-serif;
  }
  .main {

    flex: 1;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>