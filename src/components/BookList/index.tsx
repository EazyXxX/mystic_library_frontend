import React, { useState } from "react";
import { Table, Button, Space, Modal, message, Tag, Rate, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import styled from "styled-components";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimation,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Book, NewBook } from "../../types/book";
import BookForm from "../BookForm";
import { books as mockBooks } from "../../mocks/books";
import SortableTableRow from "./SortableTableRow";
import { reorderBooks } from "../../api/books";

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #1a365d;
    color: white;
  }

  .dragging {
    background: rgba(24, 144, 255, 0.1);
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

const DragOverlayContent = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0.9;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  pointer-events: none;

  img {
    width: 40px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
  }

  .book-info {
    flex: 1;

    h4 {
      margin: 0;
      font-size: 16px;
      color: #1a365d;
    }

    p {
      margin: 4px 0 0;
      color: #666;
      font-size: 14px;
    }
  }
`;

const BookList: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    {
      title: "Pages",
      dataIndex: "pages",
      sorter: (a, b) => a.pages - b.pages,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      render: (rating) => <Rate disabled defaultValue={rating} allowHalf />,
      sorter: (a, b) => (a.rating || 0) - (b.rating || 0),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "available" ? "green" : "red"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
      filters: [
        { text: "Available", value: "available" },
        { text: "Borrowed", value: "borrowed" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingBook(null);
    setIsModalVisible(true);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this book?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
        message.success("Book deleted successfully");
      },
    });
  };

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

  const handleSave = (bookData: NewBook) => {
    if (editingBook) {
      const updatedBook = { ...bookData, id: editingBook.id };
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === editingBook.id ? updatedBook : book
        )
      );
      message.success("Book updated successfully");
    } else {
      const newBook = { ...bookData, id: Date.now().toString() };
      setBooks((prevBooks) => [...prevBooks, newBook]);
      message.success("Book added successfully");
    }
    setIsModalVisible(false);
    setEditingBook(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      setBooks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        // Call API to update order
        reorderBooks(newItems.map((item) => item.id)).catch(() => {
          message.error("Failed to update book order");
          return items; // Revert on error
        });

        return newItems;
      });
    }
  };

  const activeBook = activeId
    ? books.find((book) => book.id === activeId)
    : null;

  return (
    <div>
      <ActionsContainer>
        <Button type="primary" onClick={handleAdd}>
          Add Book
        </Button>
        {selectedRowKeys.length > 0 && (
          <Button danger onClick={handleBulkDelete}>
            Delete Selected ({selectedRowKeys.length})
          </Button>
        )}
      </ActionsContainer>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={books.map((book) => book.id)}
          strategy={verticalListSortingStrategy}
        >
          <StyledTable
            components={{
              body: {
                row: SortableTableRow,
              },
            }}
            columns={columns}
            dataSource={books}
            rowKey="id"
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            expandable={{
              expandedRowRender: (record) => (
                <p style={{ margin: 0 }}>
                  <strong>ISBN:</strong> {record.isbn}
                  <br />
                  <strong>Description:</strong> {record.description}
                </p>
              ),
            }}
          />
        </SortableContext>

        <DragOverlay dropAnimation={defaultDropAnimation}>
          {activeBook ? (
            <DragOverlayContent>
              {activeBook.coverUrl && (
                <img src={activeBook.coverUrl} alt={activeBook.title} />
              )}
              <div className="book-info">
                <h4>{activeBook.title}</h4>
                <p>
                  {activeBook.author} ({activeBook.year})
                </p>
              </div>
            </DragOverlayContent>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Modal
        title={editingBook ? "Edit Book" : "Add Book"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingBook(null);
        }}
        footer={null}
        width={800}
      >
        <BookForm
          initialValues={editingBook}
          onSave={handleSave}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingBook(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default BookList;
