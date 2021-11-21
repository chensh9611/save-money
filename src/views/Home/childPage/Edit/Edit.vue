<template>
  <div class="edit-wrapper">
      <div class="head">
        <TopNav name="back">
          <span slot="title">类别设置</span>
          <Types slot="title" :type.sync="category"/>
        </TopNav>
      </div>
    <section class="tags-list">
      <ul>
        <li v-for="tag in moldTags" :key="tag.id">
          <div class="tags">
            <Icon iconName="禁止" class="delete-icon" @click="remove(tag.id,category)"/>
            <div class="tags-icon">
              <Icon :iconName="tag.iconName"/>
            </div>
            <span>{{ tag.name }}</span>
          </div>
          <div>
            <router-link :to="`${$route.path}/${tag.id}`">
              <Icon iconName="编辑"/>
            </router-link>
          </div>
        </li>
      </ul>
    </section>
    <section class="add-tag">
      <router-link :to="`${$route.path}/addTag`" class="link">
        <Icon iconName="add"/>
        <span>添加类别</span>
      </router-link>
    </section>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Watch} from 'vue-property-decorator';
import TopNav from '@/components/common/TopNav.vue';
import Types from '@/components/common/Types.vue';
import Money from '@/views/Home/childPage/Money/Money.vue';
import { Dialog,Toast } from 'vant';
@Component({
  components: {Types, TopNav}
})
export default class Edit extends Money {
  category = this.$store.state.category
  moldTags: Tag[] = this.tags.filter(item => item.mold === this.category)
  timer = null

  get tags() {
    return this.$store.state.tagList as Tag[]
  }

  created() {
    this.moldTags = this.tags.filter(item => item.mold === this.category)
    this.$store.commit('fetchTagList');
    this.$store.commit('saveCategory')
  }

  @Watch('category')
  onCategoryChange() {
    this.moldTags = this.tags.filter(item => item.mold === this.category)
    this.$store.commit('getCategory', this.category)
  }

  remove(id: string, category: string) {
    Dialog.confirm({
      title: '删除类别',
      message: '删除类别同时会删除该类别下的所有记账',
    })
        .then(() => {
          this.$store.commit('removeTag', {id, category})
          this.$store.commit('removeRecord',{id})
          Toast('删除成功');
          this.$router.go(0)
        })
        .catch(() => {
          // on cancel
        });
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/style.scss";
.edit-wrapper {
  max-width: 520px;
  margin: 0 auto;
  background-color: #fff;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  display: flex;
  flex-direction: column;

  .head {
    position: fixed;
    width: 100%;
  }

  .tags-list {
    flex-grow: 1;
    overflow-y: auto;
    margin-top: 75px;
    margin-bottom: 53px;

    ul {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    li {
      border-bottom: 0.1px solid #dadbdd;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;

      > .tags {
        display: flex;
        align-items: center;
        .delete-icon {
          margin-right: 20px;
          color: #FF4848;
        }
        > span {
          padding-left: 8px;
          font-size: 14px;
        }

        .tags-icon {
          $h: 32px;
          width: $h;
          height: $h;
          -webkit-border-radius: $h/2;
          -moz-border-radius: $h/2;
          border-radius: $h/2;
          background-color: #F3F3F3;
          display: flex;
          justify-content: center;
          align-items: center;

          > svg {
            width: 21px;
            height: 21px;
            color: #333333;
          }
        }
      }

      .icon {
        width: 21px;
        height: 21px;
      }
    }
  }

  .add-tag {
    @extend %outerShadow;
    text-align: center;
    background-color: white;
    font-size: 15px;
    padding: 16px 0;
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    color: #333;
    font-family: 'Exo 2', sans-serif;
    .link {
      color: #333333;
    }
    > span{
      padding-right: 24px;
    }
  }
}
</style>