import React, { useState } from "react";
import { Table, Button, Modal, message, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import styled from "styled-components";
import { Book } from "../../types/book";
import { books as mockBooks } from "../../mocks/books";

const BookList: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [books, setBooks] = useState<Book[]>(mockBooks);

  const columns: ColumnsType<Book> = [
    {
      title: "Cover",
      dataIndex: "coverUrl",
      width: 100,
      render: (coverUrl) =>
        coverUrl ? (
          <CoverImage
            src={coverUrl}
            alt="Book cover"
            width={60}
            height={80}
            preview={false}
          />
        ) : null,
    },
    {
      title: "Title",
      dataIndex: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Author",
      dataIndex: "author",
      sorter: (a, b) => a.author.localeCompare(b.author),
    },
    {
      title: "Year",
      dataIndex: "year",
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: "Genre",
      dataIndex: "genre",
      filters: Array.from(new Set(books.map((book) => book.genre))).map(
        (genre) => ({
          text: genre,
          value: genre,
        })
      ),
      onFilter: (value, record) => record.genre === value,
    },
    {
      title: "Language",
      dataIndex: "language",
      filters: Array.from(new Set(books.map((book) => book.language))).map(
        (language) => ({
          text: language,
          value: language,
        })
      ),
      onFilter: (value, record) => record.language === value,
    },
  ];

  const handleBulkDelete = () => {
    Modal.confirm({
      title: "Are you sure you want to delete these books?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setBooks((prevBooks) =>
          prevBooks.filter((book) => !selectedRowKeys.includes(book.id))
        );
        setSelectedRowKeys([]);
        message.success("Books deleted successfully");
      },
    });
  };

  return (
    <div>
      <ActionsContainer>
        {selectedRowKeys.length > 0 && (
          <Button danger onClick={handleBulkDelete}>
            Delete Selected ({selectedRowKeys.length})
          </Button>
        )}
      </ActionsContainer>

      <StyledTable
        columns={columns}
        dataSource={books}
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        expandable={{
          expandedRowRender: () => (
            <p style={{ margin: 0 }}>
              <strong>ISBN:</strong>
              <br />
              <strong>Description:</strong>
            </p>
          ),
        }}
      />
    </div>
  );
};

export default BookList;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #1a365d;
    color: white;
  }
`;

const ActionsContainer = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CoverImage = styled(Image)`
  border-radius: 4px;
  object-fit: cover;
`;
