import Vue from 'vue';
import Vuex from 'vuex';
import createId from '@/lib/createId';
import clone from '@/lib/clone';
import router from '@/router';
import {Dialog, Toast, Notify} from 'vant';
import dayjs from 'dayjs';
import day from 'dayjs';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    recordList: [],
    tagList: [],
    category: JSON.parse(window.localStorage.getItem('category') || '"-"'),
    currentRecord: undefined,
  } as RootState,
  getters: {
    //Home
    //获取支出的类别
    expenses: (state) => {
      return state.recordList.filter(item => item.category === '-');
    },
    //获取收的类别
    income(state) {
      return state.recordList.filter(item => item.category === '+');
    },
    expensesMoney: () => (today: string) => {
      const mouthExpenses = (store.getters.expenses as RecordItem[])
        .filter(item => day(item.createAt).format('DD') === today);
      return mouthExpenses.map(item => item.amount);
    },
    incomeMoney: () => (month: string) => {
      const mouthIncome = (store.getters.income as RecordItem[])
        .filter(item => day(item.createAt).format('MM') === month);
      return mouthIncome.map(item => item.amount);
    },
    //Detail

    years(state) {
      const endYear = dayjs().year();
      let year = 1970;
      const result: number[] = [];
      while (year <= endYear) {
        result.push(year);
        year++;
      }
      return result;
    },
    Category(state) {
      return state.category;
    },
    type(state) {
      if (state.category === '-') {
        return '支出';
      } else if (state.category === '+') {
        return '收入';
      }
    },
    //tags
    findTag: (state) => (id: string) => {
      return state.tagList.filter(t => t.id === id)[0];
    },
    getItemIcon: (state) => (id: string) => {
      const tag = state.tagList.filter(tag => tag.id === id)[0];
      return tag ? tag.iconName : 'addTag';
    },
    getTagName: (state) => (id: string) => {
      const tag = state.tagList.filter(tag => tag.id === id)[0];
      return tag ? tag.name : '';
    },
  },
  mutations: {
    //Detail


    //Category
    fetchCategory(state) {
      state.category = JSON.parse(window.localStorage.getItem('category') || '"-"');
      store.commit('saveCategory');
    },
    getCategory(state, value: string) {
      state.category = value;
      store.commit('saveCategory');
    },
    saveCategory(state) {
      window.localStorage.setItem('category', JSON.stringify(state.category));
    },
    //Record
    updateRecord(state, payload: {id: string; record: RecordItem}){
      const {id,record} = payload;
      let i = 0;
      for (i = 0; i< state.recordList.length; i++){
        if (state.recordList[i].id === id){
          state.recordList[i] = record
          break
        }
      }
      store.commit('saveRecordList')
    },
    removeRecord(state,id: string){
      for (let i = 0; i<state.recordList.length; i++){
        if (state.recordList[i].id === id){
          state.recordList.splice(i,1)
          store.commit('saveRecordList')
        }
      }
    },
    removeRecords(state, id: string) {
      for (let i = 0; i <= state.recordList.length; i++) {
        if (state.recordList[i].tagIds[0] === id) {
          state.recordList.splice(i,1)
          //当recordList里面只有两条相同的tagId时，需要判断下recordList的长度再强制删除
          if (state.recordList.length===1){
            state.recordList.splice(i,1)
          }
          store.commit('saveRecordList');
        }else {
          console.log('i:'+i)
        }
      }
    },
    saveRecordList(state) {
      window.localStorage.setItem('recordList', JSON.stringify(state.recordList));
    },
    fetchRecordList(state) {
      state.recordList = JSON.parse(window.localStorage.getItem('recordList') || '[]') as RecordItem[];
      store.commit('saveRecordList');
    },
    findRecord(state,id: number){
      state.currentRecord = undefined
      const record = state.recordList.filter(item => parseInt(item.id)   === id)[0];
      if (record){
        state.currentRecord = record
      }
    },
    createRecord(state, record: RecordItem) {
      if (record.tagIds.length === 0) {
        Notify({type: 'warning', message: '未选择类别！'});
        return;
      }
      if (record.amount <= 0) {
        Notify({type: 'warning', message: '请输入金额！'});
        return;
      }
      const newRecord: RecordItem = clone(record);
      state.recordList.push(newRecord);
      store.commit('saveRecordList');
      Dialog.confirm({
        message: '操作成功！是否继续记账？',
      }).then(() => {
        router.go(0);
      })
        .catch(() =>{
          router.go(-1)
        })
    },

    //Tag
    updateTag(state, payload: Payload) {
      const {id, name, iconName, mold} = payload;
      const names = state.tagList.map(item => item.name);
      if (names.indexOf(name) < 0) {
        console.log('csh');
        const newTags = state.tagList.map(tag => tag.id === id ? {id, name, iconName, mold} : tag);
        state.tagList = [...newTags];
        store.commit('saveTagList');
        Toast({
          message: '保存成功',
          icon: 'success',
        });
        router.go(-1);
      } else {
        Dialog.alert({
          title: '编辑类别',
          message: '类别不能重复添加',
        }).then(() => {
          // on close
        });
      }
    },
    removeTag(state, payload: Payload) {
      const id = payload.id;
      const category = payload.category;
      let index = -1;
      for (let i = 0; i < state.tagList.length; i++) {
        if (state.tagList[i].id === id) {
          index = i;
          break;
        }
      }
      state.tagList.splice(index, 1);
      store.commit('saveTagList');
      state.category = category;
      store.commit('saveCategory');
      store.commit('fetchRecordList');
      store.commit('fetchTagList');
      // router.go(0)
    },
    createTag(state, payload: Payload) {
      const {name, iconName, mold} = payload;
      state.tagList.push({id: createId().toString(), name, iconName, mold});
      store.commit('saveTagList');
    },
    saveTagList(state) {
      window.localStorage.setItem('tagList', JSON.stringify(state.tagList));
    },
    fetchTagList(state) {
      let localTagList = JSON.parse(window.localStorage.getItem('tagList') || '[]') as Tag[];
      if (localTagList.length === 0) {
        localTagList = [
          {id: createId().toString(), name: '餐饮', iconName: '餐饮', mold: '-'},
          {id: createId().toString(), name: '日用', iconName: '日用', mold: '-'},
          {id: createId().toString(), name: '交通', iconName: '交通', mold: '-'},
          {id: createId().toString(), name: '购物', iconName: '购物', mold: '-'},
          {id: createId().toString(), name: '蔬菜', iconName: '蔬菜', mold: '-'},
          {id: createId().toString(), name: '水果', iconName: '水果', mold: '-'},
          {id: createId().toString(), name: '零食', iconName: '零食', mold: '-'},
          {id: createId().toString(), name: '娱乐', iconName: '娱乐', mold: '-'},
          {id: createId().toString(), name: '通讯', iconName: '通讯', mold: '-'},
          {id: createId().toString(), name: '服饰', iconName: '服饰', mold: '-'},
          {id: createId().toString(), name: '美容', iconName: '美容', mold: '-'},
          {id: createId().toString(), name: '住房', iconName: '住房', mold: '-'},
          {id: createId().toString(), name: '居家', iconName: '居家', mold: '-'},
          {id: createId().toString(), name: '孩子', iconName: '孩子', mold: '-'},
          {id: createId().toString(), name: '社交', iconName: '社交', mold: '-'},
          {id: createId().toString(), name: '旅行', iconName: '旅行', mold: '-'},
          {id: createId().toString(), name: '烟酒', iconName: '烟酒', mold: '-'},
          {id: createId().toString(), name: '医疗', iconName: '医疗', mold: '-'},
          {id: createId().toString(), name: '书籍', iconName: '书籍', mold: '-'},
          {id: createId().toString(), name: '养生', iconName: '养生', mold: '-'},
          {id: createId().toString(), name: '礼金', iconName: '礼金', mold: '-'},
          {id: createId().toString(), name: '工资', iconName: '工资', mold: '+'},
          {id: createId().toString(), name: '兼职', iconName: '兼职', mold: '+'},
          {id: createId().toString(), name: '理财', iconName: '理财', mold: '+'},
          {id: createId().toString(), name: '礼金', iconName: '礼金', mold: '+'},
          {id: createId().toString(), name: '其他', iconName: '其他', mold: '+'},

        ] as Tag[];
        state.tagList = [...localTagList];
        store.commit('saveTagList');
      } else {
        state.tagList = JSON.parse(window.localStorage.getItem('tagList') || '[]') as Tag[];
        store.commit('saveTagList');
      }
    },
  },
  actions: {},
  modules: {}
});

export default store;
