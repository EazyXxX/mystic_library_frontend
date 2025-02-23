import React from "react";
import { Layout, Menu, Switch } from "antd";
import {
  BookOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useThemeStore } from "../store/themeStore";

const menuItems = [
  {
    key: "/",
    icon: <BookOutlined />,
    label: <Link to="/">Books</Link>,
  },
  {
    key: "/profile",
    icon: <UserOutlined />,
    label: <Link to="/profile">Profile</Link>,
  },
];

const MainHeader: React.FC = () => {
  const { theme: currentTheme, toggleTheme } = useThemeStore();
  const location = useLocation();

  return (
    <StyledHeader>
      <HeaderLeft>
        <HeaderTitle>Mystic Library 🔮</HeaderTitle>
        <Menu
          mode="horizontal"
          theme={currentTheme === "dark" ? "dark" : "light"}
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{
            background: "transparent",
            border: "none",
            marginLeft: 24,
          }}
        />
      </HeaderLeft>
      <HeaderRight>
        <ThemeSwitch
          checked={currentTheme === "dark"}
          onChange={toggleTheme}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
        />
      </HeaderRight>
    </StyledHeader>
  );
};

export default MainHeader;

const { Header } = Layout;

const StyledHeader = styled(Header)`
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderTitle = styled.h1`
  color: #ffffff;
  margin: 0;
  font-size: 20px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ThemeSwitch = styled(Switch)`
  &.ant-switch-checked {
    background: #4a9eff;
  }
`;
