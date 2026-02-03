import { routes } from './routes.tsx';
import { Routes, Route } from 'react-router';
import { Suspense } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

type RouteItem = {
  path: string;
  name?: string;
  component: LazyExoticComponent<ComponentType<any>>;
  children?: RouteItem[];
};

// 递归渲染路由
const renderRoutes = (routeList: RouteItem[]) => {
  return routeList.map((route) => {
    if (route.children && route.children.length > 0) {
      // 如果有子路由，渲染父路由并递归渲染子路由
      return (
        <Route key={route.path} path={route.path} Component={route.component}>
          {renderRoutes(route.children)}
        </Route>
      );
    } else {
      // 没有子路由，直接渲染
      return (
        <Route key={route.path} path={route.path} Component={route.component} />
      );
    }
  });
};

export default function Router() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {renderRoutes(routes)}
      </Routes>
    </Suspense>
  )
}