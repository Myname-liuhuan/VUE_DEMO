/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const mediaRouter = [
  {
    path: '/media',
    component: Layout,
    // redirect: '/media/music',
    name: 'media',
    meta: {
      title: '媒体',
      icon: 'School',
    },
    children: [
      //musicManager子页面
    ],
  },
  {
    path: '/media/music',
    hidden: true, //不在侧边菜单栏显示
    component: () => import('@/views/media/music/index.vue'),
    name: 'music',
    meta: { title: '音频播放', keepAlive: true, icon: 'MenuIcon' },
  },
]

export default mediaRouter
