<template>
  <svg class="icon" @click="$emit('click',$event)">
    <use :xlink:href="'#'+iconName"/>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
// eslint-disable-next-line no-undef
const importAll = (requireContext: __WebpackModuleApi.RequireContext) => requireContext.keys().forEach(requireContext);
try {importAll(require.context('@/assets/icons', true, /\.svg$/));} catch (error) {console.log(error);}
@Component
export default class Icon extends Vue {
  @Prop(String) iconName!: string
}
</script>

<style lang="scss" scoped>
.icon {
  width: 1em; height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>