/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const tableRouter = [
  {
    path: '/kettle',
    component: Layout,
    redirect: '/kettle/testScript',
    name: 'kettle',
    meta: {
      title: 'Kettle工具',
      icon: 'School',
      roles: ['admin', 'developer'],
    },
    children: [
      {
        path: '/kettle/testScript',
        component: () => import('@/views/table/ComprehensiveTable/index.vue'),
        name: 'comprehensive',
        meta: { title: '测试脚本生成', keepAlive: true, icon: 'MenuIcon' },
      },
    ],
  },
]

export default tableRouter
