import { Header } from "antd/es/layout/layout";
import { Button } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

const HeaderComponent = ({ collapsed, setCollapsed, colorBgContainer }: { collapsed: boolean, setCollapsed: (collapsed: boolean) => void, colorBgContainer: string }) => {
  return (
    <>
      <Header style={{ padding: 0, background: colorBgContainer }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
        {/* 右侧内容面包屑 */}
      </Header>
    </>
  )
}
export default HeaderComponent;