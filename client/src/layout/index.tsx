import { useState } from 'react';
import './index.scss';
import { Layout, theme } from 'antd';
import { Outlet } from 'react-router';
const { Sider, Content } = Layout;
import MenuComponent from './component/Menu';
import HeaderComponent from './component/Header';
import FooterComponent from './component/Footer';
const LayoutComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <MenuComponent />
      </Sider>
      <Layout>
        <HeaderComponent collapsed={collapsed} setCollapsed={setCollapsed} colorBgContainer={colorBgContainer} />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
        <FooterComponent />
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;