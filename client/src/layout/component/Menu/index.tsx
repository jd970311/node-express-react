import { Menu } from 'antd';
import logo from '@/assets/react.svg';
import { UserOutlined } from '@ant-design/icons';
import { routes } from '@/routers/routes.tsx'
import { useNavigate } from 'react-router';
import type { MenuProps } from 'antd';
import type { ComponentType, LazyExoticComponent, ReactNode } from 'react';
import { useState, useEffect } from 'react';
// 定义路由类型
type RouteItem = {
  path: string;
  name?: string;
  component: LazyExoticComponent<ComponentType<any>>;
  icon?: ReactNode;
  children?: RouteItem[];
  isNotShow?: boolean;
};

type MenuItem = Required<MenuProps>['items'][number] & {
  children?: MenuItem[];
};

const MenuComponent = () => {
  const navigate = useNavigate();
  const [defaultKeys, setDefaultKeys] = useState<string[]>(['dashboard']);
  // 递归生成多层级菜单项
  const generateMenuItems = (routeList: RouteItem[]): MenuItem[] => {
    return routeList
      .filter((route) => !route.isNotShow) // isNotShow 为 true 时隐藏；false 或 undefined 默认显示
      .flatMap((route) => {
        // 父级仅作为布局容器（没有 name），不在菜单中展示，直接“提升”它的 children
        if (!route.name) {
          return route.children ? generateMenuItems(route.children) : [];
        }

        const menuItem: MenuItem = {
          key: route.path,
          icon: route.icon || <UserOutlined />,
          label: route.name,
        };

        if (route.children && route.children.length > 0) {
          menuItem.children = generateMenuItems(route.children);
        }

        return [menuItem];
      });
  };

  const menuItems = generateMenuItems(routes as RouteItem[]);
  console.log(menuItems, 'menuItems');
  // 根据menuItems设置默认选中key
  // 点击菜单回调
  const handleMenuClick: MenuProps['onClick'] = (info) => {
    const { key, keyPath, domEvent } = info;
    console.log(key, keyPath, domEvent);
    // 使用 navigate 进行路由跳转
    navigate(key);
    setDefaultKeys(keyPath);
  }

  useEffect(() => {

    const key = findKey(menuItems);
    setDefaultKeys([key || '']);
  }, []);

  const findKey = (menuItems: MenuItem[]): string | undefined => {
    for (const item of menuItems) {
      // 当前层匹配
      if (item.key === window.location.pathname.split('/')[1]) {
        return item.key as string;
      }
      // 子层递归匹配
      if (item.children && item.children.length > 0) {
        const childKey = findKey(item.children);
        if (childKey) return childKey;
      }
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px' }}>
        <img src={logo} alt="logo" style={{ width: '32px', height: '32px' }} />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={defaultKeys}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </>
  )
}
export default MenuComponent;