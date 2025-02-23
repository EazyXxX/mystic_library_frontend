import React from "react";
import styled from "styled-components";
import { Avatar, Card, Typography } from "antd";
import { useAuthStore } from "../store/authStore";
import BookStatistics from "../components/BookList";
import { books as mockBooks } from "../mocks/books";
import { UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Profile: React.FC = () => {
  const username = useAuthStore((state) => state.username);
  // const pic = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=256&h=256";
  const pic = null;

  return (
    <ProfileContainer>
      <ProfileHeader>
        <StyledAvatar src={pic} alt="Profile picture">
          {!pic && <UserOutlined style={{ fontSize: "48px" }} />}
        </StyledAvatar>
        <ProfileInfo>
          <Title level={2} style={{ margin: 0 }}>
            {username || "Admin"}
          </Title>
          <Typography.Text type="secondary">Book Enthusiast</Typography.Text>
          <Typography.Paragraph>
            Welcome to your profile! Here you can see your reading statistics
            and manage your book collection.
          </Typography.Paragraph>
        </ProfileInfo>
      </ProfileHeader>

      <Title level={3}>Your Reading Statistics</Title>
      <BookStatistics books={mockBooks} />
    </ProfileContainer>
  );
};

export default Profile;

const ProfileContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProfileHeader = styled(Card)`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 24px;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledAvatar = styled(Avatar)`
  width: 128px;
  height: 128px;
`;
