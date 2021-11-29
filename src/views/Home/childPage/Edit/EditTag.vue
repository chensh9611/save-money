<template>
  <div class="editTag-wrapper">
    <div class="head">
      <TopNav name="back">
        <span slot="title">{{ id === 'addTag' ? '添加' + type + '类别' : '编辑类别' }}</span>
      </TopNav>
      <span class="finish" v-if="id === 'addTag'" @click="addNewTag">完成</span>
      <span class="finish" v-else @click="updateTag"> 保存</span>
      <div>
        <section class="input-tag">
          <div class="icon" v-if="id !== 'addTag'">
            <Icon :iconName="iconName === 'addTag' ? tag.iconName : iconName"/>
            <label>
              <input type="text"
                     placeholder="请输入类别名称(不超过四个汉字)"
                     v-model="value"/>
            </label>
          </div>

          <div v-if="id === 'addTag'" class="icon">
            <Icon :iconName="iconName"/>
            <label>
              <input type="text"
                     placeholder="请输入类别名称(不超过四个汉字)"
                     v-model="value"/>
            </label>
          </div>

        </section>
      </div>
    </div>

    <section class="icon-list">
      <ul class="tags">
        <li v-for="icon in defaultIcon" :key="icon.id" @click="getIconName(icon.iconName)" class="tags-item">
          <div class="tags-item-icon" :class="{selected: icon.iconName === iconName}">
            <Icon :iconName="icon.iconName"/>
          </div>
        </li>
      </ul>
    </section>

  </div>
</template>
z
<script lang="ts">
import {Component, Prop} from 'vue-property-decorator';
import TopNav from '@/components/common/TopNav.vue';
import Edit from '@/views/Home/childPage/Edit/Edit.vue';
import {defaultIcon} from '@/lib/iconsLib';
import { Dialog,Toast } from 'vant';

@Component({
  components: {TopNav}
})
export default class EditTag extends Edit {
  type = this.$store.getters.type;
  id = this.$route.params.id;
  iconName = 'addTag';
  tag = this.$store.getters.findTag(this.id);
  value = this.tag && this.tag.name || '';
  defaultIcon = defaultIcon;

  getIconName(iconName: string) {
    this.iconName = iconName;
  }

  created() {
    //这里不在created获取的话 tag会报undefined
    this.tag = this.$store.getters.findTag(this.id);
    this.value = this.tag && this.tag.name || '';
    this.$store.commit('fetchTagList');
  }

  updateTag() {
    if (this.tag && this.value && this.value.trim().length <= 4 && this.value.length > 0) {
      const newIconName = this.iconName !== 'addTag' ? this.iconName : this.tag.iconName;
      const id = this.tag.id, name = this.value, iconName = newIconName, mold = this.category;
      this.$store.commit('updateTag', {id, name, iconName, mold});
    }else {
      Dialog.alert({
        title: '编辑类别',
        message: '不能输入空的标签以及输入的汉字不能超过四个',
      })
    }
  }

  addNewTag() {
    if (this.value !== '' && this.value.trim().length <= 4) {
      const name = this.value, iconName = this.iconName, mold = this.$store.state.category;
      for (let i = 0; i < this.tags.length; i++) {
        if (name === this.tags[i].name) {
          window.alert('类别不能重复添加');
          return;
        }
      }
      this.$store.commit('createTag', {name, iconName, mold});
      Toast.success('添加成功');
      this.$router.go(-1);
    } else {
      Dialog.alert({
        title: '添加类别',
        message: '不能输入空的标签以及输入的汉字不能超过四个',
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.editTag-wrapper {
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
    left: 0;
    top: 0;
    @media (min-width: 600px) {
      max-width: 520px;
      margin: 0 auto;
      left: 694px;
    }
    @media (width: 768px) {
      max-width: 520px;
      margin: 0 auto;
      left: 124px;
    }
    ::v-deep {
      .top {
        .title {
          padding-bottom: -5px;
        }
      }

      padding-top: 15px;
      background-color: #9d81ea;
    }

    .finish {
      position: absolute;
      top: 24px;
      right: 20px;
      font-weight: 400;
      font-size: 16px;
    }
  }

  .input-tag {
    background-color: white;
    border-bottom: 0.2px solid #dadbdd;
    //padding-left: 14px;
    padding: 6px 14px;
    position: relative;

    .icon {
      $h: 46px;
      width: $h;
      height: $h;
      -webkit-border-radius: $h/2;
      -moz-border-radius: $h/2;
      border-radius: $h/2;
      background: #9d81ea;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #333;

      svg {
        width: 32px;
        height: 32px;
      }
    }

    input {
      position: fixed;
      margin-left: 16px;
      margin-top: -7.5px;
      flex: 1;
      outline: none;
      border: none;
      min-width: 260px;
      font-size: 14px;
    }

  }

  .icon-list {
    flex-grow: 1;
    overflow-y: auto;
    margin-top: 120px;
    margin-bottom: 10px;

    .tags {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      font-size: 14px;
      padding: 14px 2px;
      align-content: flex-start;
      overflow: auto;

      &-item {
        width: 20%;
        padding: 6px 0;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;

        &-icon {
          $h: 46px;
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

          &.selected {
            background: #9d81ea;
            color: #333;
          }

          svg {
            width: 32px;
            height: 32px;
          }

        }
      }
    }
  }
}
</style>