<template>
  <div class="tag-wrapper">
    <ol class="tags">
      <li v-for="tag in moldTags" :key="tag.id"
          @click="toggleTag(tag.id)"
          class="tags-item"
      >
        <div class="tags-item-icon" :class="{selected: selectedTagIds.indexOf(tag.id)>=0 && tagIds.length>0}">
          <Icon :iconName="tag.iconName"/>
        </div>

        <span>{{ tag.name }}</span>
      </li>
        <li class="tags-item">
          <router-link to="/home/money/edit">
          <div class="tags-item-icon">
            <Icon iconName="设置"/>
          </div>
          </router-link>
          <span>设置</span>
      </li>

    </ol>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

@Component
export default class TagsSection extends Vue {
  selectedTagIds: string[] = [];
  @Prop(Array) readonly tags: Tag[] | undefined;
  @Prop(Array) readonly tagIds!: number[];
  @Prop(String) readonly type!: string;

  get moldTags() {
    if (this.tags !== undefined) {
      return this.tags.filter(tag => tag.mold === this.type);
    }
    return null;
  }

  toggleTag(tagId: string) {
      this.selectedTagIds = [tagId];
      this.$emit('update:tagIds', this.selectedTagIds);
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/style.scss";

.tag-wrapper {
  .tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    font-size: 14px;
    padding: 14px 1px;
    align-content: flex-start;
    overflow: auto;

    &-item {
      width: 25%;
      padding: 6px 0;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;

      &-icon {
        $h: 52px;
        width: $h;
        height: $h;
        -webkit-border-radius: $h/2;
        -moz-border-radius: $h/2;
        border-radius: $h/2;
        background: #F3F3F3;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #666666;
        svg:hover {
          animation: svg 800ms ease-in-out;
        }
        @keyframes svg { /* 抖动 */
          10%, 100% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(+1px, 0, 0); }
          //30%, 70% { transform: translate3d(-1px, 0, 0); }
          //40%, 60% { transform: translate3d(+1px, 0, 0); }
          50% { transform: translate3d(-2px, 0, 0); }
        }

        svg {
          width: 32px;
          height: 32px;
        }

        &.selected {
          background: $selected-color;
          color: #333;
        }
      }
    }
  }
}


</style>