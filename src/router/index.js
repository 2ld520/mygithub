import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login/login.vue'
import home from '../components/page/home.vue'
// import show from '../components/page/server/show.vue'
import user from '../components/page/user/user.vue'
import usergoods from '../components/page/user/usergoods.vue'
import userorder from '../components/page/user/userorder.vue'
import payhome from '../components/page/server/pay/payhome.vue'
import check from '../components/page/server/check/check.vue'
import order from '../components/page/server/sell/order.vue'
import sell from '../components/page/server/sell/sell.vue'
// import addgoods from '../components/page/server/sell/addgoods.vue'
import sign from '../components/page/server/sign/sign.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      component: login
    },
    {
      path: '',
      redirect: '/login'
    },
    {
      path: '/payhome',
      component: payhome
    },
    {
      path: '/check',
      component: check
    },
    {
      path: '/sell',
      component: sell
    },
    {
      path: '/order/:id',
      component: order,
      name: order
    },
    {
      path: '/sign',
      component: sign
    },
    {
      path: '/user',
      component: user

    },
    {
      path: '/usergoods',
      component: usergoods
    },
    {
      path: '/userorder',
      component: userorder
    },
    {
      path: '/home',
      component: home

      // children: [
      //   {
      //     path: 'show',
      //     component: show
      //   }
      // {
      //   path: 'user',
      //   component: user
      // }
      // ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  let isLogin = sessionStorage.getItem('usernum')
  if (isLogin) {
    next()
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})
export default router
