import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout, ConfigProvider, theme, App as AntApp } from "antd";
import styled, { ThemeProvider } from "styled-components";
import BookList from "./components/BookList";
import { useThemeStore } from "./store/themeStore";
import { lightTheme, darkTheme } from "./styles/themes";
import Profile from "./pages/Profile";
import MainHeader from "./components/StyledHeader";

const { Content } = Layout;
const { defaultAlgorithm, darkAlgorithm } = theme;

function App() {
  const { theme: currentTheme } = useThemeStore();

  return (
    <ThemeProvider theme={currentTheme === "dark" ? darkTheme : lightTheme}>
      <ConfigProvider
        theme={{
          ...(currentTheme === "dark" ? darkTheme : lightTheme),
          algorithm: currentTheme === "dark" ? darkAlgorithm : defaultAlgorithm,
        }}
      >
        <AntApp>
          <Router>
            <StyledLayout>
              <MainHeader />
              <Routes>
                <Route path="/profile" element={<Profile />} />
                <Route
                  path="/"
                  element={
                    <StyledContent>
                      <ContentWrapper theme={{ theme: currentTheme }}>
                        <Routes>
                          <Route path="/login" element={<Profile />} />
                          <Route path="/" element={<BookList />} />
                        </Routes>
                      </ContentWrapper>
                    </StyledContent>
                  }
                />
              </Routes>
            </StyledLayout>
          </Router>
        </AntApp>
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
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
