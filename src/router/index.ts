import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import Home from '@/views/Home/Home.vue';
import NotFound from '@/views/NotFound/NotFound.vue';
import Money from '@/views/Home/childPage/Money/Money.vue';
import EditTag from '@/views/Home/childPage/Edit/EditTag.vue';
import Edit from '@/views/Home/childPage/Edit/Edit.vue';
import Detail from '@/views/Detail.vue';
import Statistics from '@/views/Statistics/Statistics.vue';


Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/home/money',
    component: Money
  },
  {
    path: '/home/money/edit',
    component: Edit
  },
  {
    path: '/home/money/edit/:id',
    component: EditTag,
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics
  },
  {
    path: '*',
    component: NotFound
  }
];

const router = new VueRouter({
  routes,
  mode: 'hash'
});

export default router;
