import Vue from 'vue';
import Vuex from 'vuex';
import createId from '@/lib/createId';
import clone from '@/lib/clone';
import router from '@/router';
import { Dialog,Toast,Notify } from 'vant';
import dayjs from 'dayjs';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    recordList: [],
    tagList: [],
    category: JSON.parse(window.localStorage.getItem('category') || '"-"'),
  } as RootState,
  getters: {
    //Detail
    years(state){
      const endYear = dayjs().year();
      let year = 1970;
      const result: number[] = [];
      while (year <= endYear){
        result.push(year)
        year++
      }
      return result
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
    getTagName: (state) =>(id: string) =>{
      const tag = state.tagList.filter(tag =>tag.id === id)[0]
      return tag ? tag.name: ''
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
    removeRecord(state,id: string){
      let index = -1
      for (let i = 0; i<state.recordList.length; i++){
        if (state.recordList[i].tagIds[0] === id){
          index = i
          break
        }
      }
      state.recordList.splice(index,1)
      store.commit('saveRecordList')
    },
    saveRecordList(state) {
      window.localStorage.setItem('recordList', JSON.stringify(state.recordList));
    },
    fetchRecordList(state) {
      state.recordList = JSON.parse(window.localStorage.getItem('recordList') || '[]') as RecordItem[];
      store.commit('saveRecordList');
    },
    createRecord(state, record: RecordItem) {
      if (record.tagIds.length === 0) {
        Notify({ type: 'warning', message: '未选择类别！' });
        return;
      }
      if (record.amount <= 0) {
        Notify({ type: 'warning', message: '请输入金额！' });
        return;
      }
      const newRecord: RecordItem = clone(record);
      state.recordList.push(newRecord);
      store.commit('saveRecordList');
      Dialog.alert({
        message: '操作成功！',
      }).then(() => {
        router.go(-1);
      });
    },

    //Tag
    updateTag(state, payload: Payload) {
      const {id, name, iconName, mold} = payload;
      const names = state.tagList.map(item => item.name)
      if (names.indexOf(name)<0){
        console.log('csh')
        const newTags = state.tagList.map(tag => tag.id === id ? {id, name, iconName, mold} : tag);
        state.tagList = [...newTags];
        store.commit('saveTagList');
        Toast({
          message: '保存成功',
          icon: 'success',
        })
        router.go(-1)
      }else {
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
