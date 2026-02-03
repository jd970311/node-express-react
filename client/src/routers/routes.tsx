import { lazy } from 'react';
import { UserOutlined, HomeOutlined } from '@ant-design/icons';

export const routes = [
  {
    path: '/login',
    name: 'login',
    isNotShow: true,//是否显示在菜单中
    component: lazy(() => import('@/pages/login/index')),
    icon: <UserOutlined />,
  },
  {
    component: lazy(() => import('@/layout/index')),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: lazy(() => import('@/pages/dashboard/index')),
        icon: <HomeOutlined />,
      },
    ],
  },
  {
    path: '/',
    name: 'layout',
    component: lazy(() => import('@/layout/index')),
    children: [
      {
        path: 'home',
        name: 'home',
        component: lazy(() => import('@/pages/home/index')),
        icon: <HomeOutlined />,
      },
      {
        path: 'article',
        name: 'article',
        component: lazy(() => import('@/pages/article/index')),
        icon: <UserOutlined />,
      },
    ],
  },

]