import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  Layout,
  Menu,
  ConfigProvider,
  Switch,
  theme,
  App as AntApp,
} from "antd";
import styled from "styled-components";
import BookList from "./components/BookList";
import { useThemeStore } from "./store/themeStore";
import { lightTheme, darkTheme } from "./styles/themes";
import { BookOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { defaultAlgorithm, darkAlgorithm } = theme;

function App() {
  const { theme: currentTheme, toggleTheme } = useThemeStore();

  const menuItems = [
    {
      key: "/",
      icon: <BookOutlined />,
      label: <Link to="/">Books</Link>,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        ...(currentTheme === "dark" ? darkTheme : lightTheme),
        algorithm: currentTheme === "dark" ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <AntApp>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <StyledLayout>
                  <StyledHeader>
                    <HeaderLeft>
                      <HeaderTitle>Mystic Library 🔮</HeaderTitle>
                      <Menu
                        mode="horizontal"
                        theme={currentTheme === "dark" ? "dark" : "light"}
                        selectedKeys={[window.location.pathname]}
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
                  <StyledContent>
                    <ContentWrapper theme={{ theme: currentTheme }}>
                      <Routes>
                        <Route path="/" element={<BookList />} />
                      </Routes>
                    </ContentWrapper>
                  </StyledContent>
                </StyledLayout>
              }
            />
          </Routes>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.h1`
  color: #ffffff;
  margin: 0;
  font-size: 20px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
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

const StyledContent = styled(Content)`
  padding: 24px;
`;

const ContentWrapper = styled.div`
  background: ${(props) =>
    props.theme.theme === "dark" ? "#1f1f1f" : "#ffffff"};
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;
