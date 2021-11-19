<template>
  <div class="typeSection-wrapper">
    <CategorySection :type.sync="category"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Watch} from 'vue-property-decorator';
import CategorySection from '@/views/Home/childPage/Money/CategorySection.vue';

@Component({
  components: {CategorySection}
})
export default class TypeSection extends Vue {
  category = '-';

  @Watch('category')
  onCategoryChanged(newCategory: string) {
    this.$emit('getCategory',newCategory)
  }
}
</script>

<style lang="scss" scoped>
.typeSection-wrapper {
  display: flex;
  justify-content: center;
  background-color: #9d81ea;
  padding-bottom: 10px;
}
</style>