import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', affix: true}
    }]
  },
  // {
  //   path: '/info',
  //   component: Layout,
  //   redirect: '/info/customer',
  //   name: 'infoManage',
  //   meta: { title: '客户管理', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'customer',
  //       name: 'customer',
  //       component: () => import('@/views/info/customer'),
  //       meta: { title: '客户', icon: 'customer' }
  //     }
  //   ]
  // },
  // {
  //   path: '/loan',
  //   component: Layout,
  //   redirect: '/loan/',
  //   name: 'loanManage',
  //   meta: { title: '信贷业务', icon: 'loan' },
  //   children: [
  //     {
  //       path: 'loanApply',
  //       name: 'loanApply',
  //       component: () => import('@/views/loan/loanApply'),
  //       meta: { title: '贷款申请', icon: 'loanApply' }
  //     },
  //     {
  //       path: 'loanAudit',
  //       name: 'loanAudit',
  //       component: () => import('@/views/loan/loanAudit'),
  //       meta: { title: '贷款审核', icon: 'loanAudit' }
  //     },
  //     {
  //       path: 'loanGrant',
  //       name: 'loanGrant',
  //       component: () => import('@/views/loan/loanGrant'),
  //       meta: { title: '贷款发放', icon: 'loanGrant' }
  //     },
  //     {
  //       path: 'loanRecover',
  //       name: 'loanRecover',
  //       component: () => import('@/views/loan/loanRecover'),
  //       meta: { title: '贷款收回', icon: 'loanRecover' }
  //     }
  //   ]
  // },
  // {
  //   path: '/report',
  //   component: Layout,
  //   redirect: '/report/',
  //   name: 'reportManage',
  //   meta: { title: '报表', icon: 'report' },
  //   children: [
  //     {
  //       path: 'financialSummary',
  //       name: 'financialSummary',
  //       component: () => import('@/views/report/financialSummary'),
  //       meta: { title: '财务汇总', icon: 'financialSummary' }
  //     },
  //     {
  //       path: 'repayRecords',
  //       name: 'repayRecords',
  //       component: () => import('@/views/report/repayRecords'),
  //       meta: { title: '还款记录', icon: 'repayRecords' }
  //     },
  //     {
  //       path: 'delayRecords',
  //       name: 'delayRecords',
  //       component: () => import('@/views/report/delayRecords'),
  //       meta: { title: '展期记录', icon: 'delayRecords' }
  //     },
  //     {
  //       path: 'overdueRecords',
  //       name: 'overdueRecords',
  //       component: () => import('@/views/report/overdueRecords'),
  //       meta: { title: '逾期记录', icon: 'overdueRecords' }
  //     }
  //   ]
  // },
  // {
  //   path: '/risk',
  //   component: Layout,
  //   redirect: '/risk/',
  //   name: 'riskManage',
  //   meta: { title: '风险管理', icon: 'risk' },
  //   children: [
  //     {
  //       path: 'customerLoanLimit',
  //       name: 'customerLoanLimit',
  //       component: () => import('@/views/risk/customerLoanLimit'),
  //       meta: { title: '资产评估', icon: 'customerLoanLimit' }
  //     },
  //     {
  //       path: 'customerCredit',
  //       name: 'customerCredit',
  //       component: () => import('@/views/risk/customerCredit'),
  //       meta: { title: '信用等级', icon: 'customerCredit' }
  //     },
  //     {
  //       path: 'creditScoreRecords',
  //       name: 'creditScoreRecords',
  //       component: () => import('@/views/risk/creditScoreRecords'),
  //       meta: { title: '信用分变更', icon: 'creditScoreRecords' }
  //     }
  //   ]
  // },
  // {
  //   path: '/setting',
  //   component: Layout,
  //   redirect: '/setting/employee',
  //   name: 'settingManage',
  //   meta: { title: '系统设置', icon: 'setting' },
  //   children: [
  //     {
  //       path: 'employee',
  //       name: 'employee',
  //       component: () => import('@/views/setting/employee'),
  //       meta: { title: '员工', icon: 'employee' }
  //     },
  //     {
  //       path: 'role',
  //       name: 'role',
  //       component: () => import('@/views/setting/role'),
  //       meta: { title: '权限管理', icon: 'role' }
  //     }
  //   ]
  // },
  // {
  //   path: '/about',
  //   component: Layout,
  //   redirect: '/about/index',
  //   name: 'about',
  //   meta: { title: '关于我们', icon: 'about' },
  //   children: [
  //     {
  //       path: 'about',
  //       name: 'about',
  //       component: () => import('@/views/about/index'),
  //       meta: { title: '关于我们', icon: 'about' }
  //     }
  //   ]
  // },

  // // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
