<template>
  <div>
    <div class="head">
      <TopNav name="back" @click="setCategory">
        <span slot="title">记一笔</span>
        <Types slot="title" :type.sync="selected.category"/>
      </TopNav>
    </div>
    <section class="tags">
      <TagsSection :tags.sync="tags" :tag-ids.sync="selected.tagIds" :type.sync="selected.category"/>
    </section>
    <div class="bottom">
      <KeyBoardSection
          class-prefix="money"
          :amount.sync="selected.amount"
          :note.sync="selected.notes"
          :createdAt.sync="selected.createAt"
          @onSubmit="saveRecord"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Watch} from 'vue-property-decorator';
import TopNav from '@/components/common/TopNav.vue';
import CategorySection from '@/views/Home/childPage/Money/CategorySection.vue';
import TypeSection from '@/components/common/TypeSection.vue';
import TagsSection from '@/views/Home/childPage/Money/TagsSection.vue';
import Types from '@/components/common/Types.vue';
import KeyBoardSection from '@/views/Home/childPage/Money/KeyBoardSection.vue';

@Component({
  components: {KeyBoardSection, Types, TagsSection, TypeSection, CategorySection, TopNav}
})
export default class Money extends Vue {
  get tags() {
    return this.$store.state.tagList;
  }

  //初始值
  selected: RecordItem = {
    tagIds: [],    //标签
    notes: '',    //备注
    category: this.$store.state.category,    //收入或支出类型
    createAt: new Date().toISOString(),    //日期
    amount: 0    //总和
  };

  @Watch('selected.category')
  onSelectedChange() {
    this.selected.tagIds = [];
    this.$store.commit('getCategory', this.selected.category);
  }

  created() {
    this.$store.commit('fetchRecordList');
    this.$store.commit('fetchTagList');

  }

  saveRecord() {
    this.$store.commit('createRecord', this.selected);
  }

  setCategory() {
    this.$store.state.category = '-';
    this.$store.commit('saveCategory');
  }
}
</script>

<style lang="scss" scoped>
.head {
  position: fixed;
  width: 100%;
}

.tags {
  padding-bottom: 45+48 * 4+12px;
  padding-top: 80px
}

.bottom {
  position: fixed;
  bottom: 2px;
  left: 0;
  width: 100vw;
}
</style>