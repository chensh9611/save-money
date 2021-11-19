<template>
  <div>
    <div class="notFound">
      <img src="../../assets/image/404error.png" alt="" style="width: 244px; height: 208px;">
      <h4>当前页面不存在，请检查网址是否正确！</h4>
      <router-link to="/home" class="link">返回首页</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

@Component
export default class NotFound extends Vue {

}
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  outline: none;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

.notFound {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .link {
    color: #A4EBF3;
  }
}
</style>