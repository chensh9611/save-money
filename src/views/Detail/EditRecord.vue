<template>
  <div class="edit-record">
    <header class="header">
      <TopNav name="back">
        <span slot="title">编辑记账</span>
      </TopNav>
    </header>
    <main class="main">
      <ul class="list">
        <li class="tag">
          <div class="icon">
            <span>
              <Icon :iconName="this.$store.getters.getItemIcon (record.tagIds[0])"/>
            </span>
          </div>

          <span class="name">
              {{ this.$store.getters.getTagName(record.tagIds[0]) }}
            </span>
        </li>
        <li>
          <label>
            <span class="name">类型：</span>
            <span class="category">{{ record.category === '-' ? '支出' : '收入' }}</span>
          </label>
        </li>
        <li>
          <label>
            <span class="name">金额：</span>
            <input class="amount" type="text" v-model="record.amount"/>
          </label>
        </li>
        <li>
          <label class="date">
            <span class="name">日期：</span>
            <DatePicker :initial-date="dayjs(record.createAt).toISOString()"
                        @update:year="updateYear"
                        @update:month="updateMonth"
                        @update:date="updateDate"
            />
          </label>
        </li>
        <li>
          <label>
            <span class="name">备注：</span>
            <input type="text" v-model="record.notes">
          </label>
        </li>
      </ul>
    </main>
    <footer class="footer">
      <button @click="save">保存</button>
      <button @click="remove">删除</button>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import TopNav from '@/components/common/TopNav.vue';
import clone from '@/lib/clone';
import DatePicker from '@/components/common/DatePicker.vue';
import dayjs from 'dayjs';
import { Notify,Toast  } from 'vant';

@Component({
  components: {DatePicker, TopNav}
})
export default class EditRecord extends Vue {
  record?: RecordItem;
  dayjs = dayjs;

  created() {
    this.$store.commit('findRecord', parseInt(this.$route.params.id));
    this.record = clone(this.$store.state.currentRecord);
    console.log(this.record);
  }

  updateYear(year: number) {
    if (this.record) {
      this.record.createAt = (dayjs(this.record.createAt).year(year).toDate()).toISOString();
    }
  }

  updateMonth(month: number) {
    if (this.record) {
      this.record.createAt = (dayjs(this.record.createAt).month(month - 1).toDate()).toISOString();
    }
  }

  updateDate(date: number) {
    if (this.record) {
      this.record.createAt = (dayjs(this.record.createAt).date(date).toDate()).toISOString();
    }
  }

  save() {
    if (this.record) {
      if (parseFloat(this.record.amount.toString())>0){
        this.record.amount = parseFloat(this.record.amount.toString());
        this.$store.commit('updateRecord', {id: this.record.id, record: this.record});
        Toast('保存成功')
        this.$router.go(-1)
      }else {
        Notify({ type: 'warning', message: '金额必须大于零！' });
      }
    }
  }

  remove() {
    if (this.record){
      this.$store.commit('removeRecord',this.record.id)
    }
    Toast('删除成功')
    this.$router.go(-1)
  }
}
</script>

<style lang="scss" scoped>
.edit-record{
  height: 100vh;
  position: relative;
  .header{
    position: fixed;
    width: 100%;
  }
  .main {
    padding-top: 40px;
    font-size: 16px;
    > ul {
      .tag{
        display: flex;
        justify-content: start;
        align-items: center;
        margin-left: 11px;

        .name {
          margin-left: 22px;
        }
        .icon{
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          width: 40px;
          border-radius: 50%;
          background-color: #9d81ea;
          svg {
            height: 24px;
            width: 24px;
          }
        }
      }
      > li{
        margin-left: 16px;
        padding: 12px 0 12px 16px;
        border-bottom: 0.2px solid #dadbdd;
        > label {
          display: flex;
          align-items: center;
          
          .name {
            color: #999;
            margin-right: 16px;
          }
          input {
            border: none;
            font-size: inherit;
            flex-grow: 1;
          }
        }
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #dddddd;
    padding: 0 16px;
    button {
      width: 50%;
      font-size: 16px;
      padding: 4px 0;
      margin: 12px 0;
      background-color: inherit;
      border: none ;
      &:first-child {
        border-right: 1px solid #ddd;
      }

      &:last-child {
        color: #ce3035;
      }
    }
  }
}
</style>