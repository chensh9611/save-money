<template>
  <div class="notes-wrapper">
    <label class="goNote" @click="toNote">
      <Icon iconName="note"/>
      <span>备注：</span>
      <span>{{note || '点击输入备注...'}}</span>
    </label>
    <label class="create_date">
      <span></span>
      <Icon iconName="日历"/>
      <input type="date"
             class="dateIpt"
             v-model="dateValue"
      />
    </label>
    <MaskDiv :style="styleInput" @closeMask="closeMask" @sureText="sureText"/>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {Component, Prop, Watch} from 'vue-property-decorator';
import day from 'dayjs';
import MaskDiv from '@/views/Home/childPage/Money/MaskDiv.vue';

interface StyleInput {
  display: string;
}

@Component({
  components: {MaskDiv}
})
export default class NotesSection extends Vue {
  @Prop(String) readonly note!: string;
  @Prop(String) readonly createdAt!: string;

  dateValue = day(this.createdAt).format('YYYY-MM-DD');

  @Watch('dateValue')
  onDateValueChange(newValue: string) {
    const date = new Date(newValue).toISOString().trim();
    this.$emit('update:dateValue', date);
  }

  styleInput: StyleInput = {display: 'none'};


  toNote() {
    this.styleInput = {display: 'block'};
  }

  closeMask(obj: StyleInput) {
    this.styleInput = obj;
  }

  sureText(note: string) {
    this.styleInput = {display: 'none'};
    this.$emit('update:noteValue', note);
  }
}

</script>

<style lang="scss" scoped>
.notes-wrapper {
  //padding: 10px 10px;

  > label {
    position: relative;
    display: flex;
    align-items: center;
    //margin-top: 10px;

    > input {
      width: 100%;
      //padding: 12px 48px;
      //background-color: #fff;
      border: none;
      //border-radius: 10px;

      &.dateIpt {
        border: none;
        background-color: #F3F3F3;
        padding: 4px 8px 4px 48px;
        outline: none;
        font-size: 18px;
      }
    }

    .icon {
      color: #9d81ea;
      position: absolute;
      left: 5px;
      width: 24px;
      height: 24px;
    }
  }

  .goNote {
    width: 100%;
    padding: 4px 48px;
    //background-color: #fff;
    border-bottom: 0.2px solid #dadbdd;

    span {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 14px;
    }
  }

  .create_date {
    > input {
      width: 100%;
      //background-color: #fff;
      border: none;
    }
  }

}
</style>