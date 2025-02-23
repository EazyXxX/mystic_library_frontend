import React, { useEffect } from "react";
import { Form, Input, InputNumber, Button, Space, Select, Rate } from "antd";
import styled from "styled-components";
import { Book, NewBook, NewBookSchema } from "../../types/book";

const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    font-weight: 500;
  }
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

interface BookFormProps {
  initialValues?: Book | null;
  onSave: (book: NewBook) => void;
  onCancel: () => void;
}

const BookForm: React.FC<BookFormProps> = ({
  initialValues,
  onSave,
  onCancel,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async (values: any) => {
    try {
      const validatedBook = NewBookSchema.parse(values);
      onSave(validatedBook);
      form.resetFields();
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  return (
    <StyledForm form={form} layout="vertical" onFinish={handleSubmit}>
      <TwoColumnLayout>
        <div>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter the book title" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="author"
            label="Author"
            rules={[
              { required: true, message: "Please enter the author name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="year"
            label="Year"
            rules={[
              { required: true, message: "Please enter the publication year" },
              {
                type: "number",
                min: 1000,
                max: new Date().getFullYear(),
                message: "Please enter a valid year",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="genre"
            label="Genre"
            rules={[{ required: true, message: "Please enter the genre" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="isbn" label="ISBN">
            <Input />
          </Form.Item>
        </div>

        <div>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter the description" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="pages"
            label="Number of Pages"
            rules={[
              { required: true, message: "Please enter the number of pages" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item
            name="language"
            label="Language"
            rules={[{ required: true, message: "Please select the language" }]}
          >
            <Select>
              <Select.Option value="English">English</Select.Option>
              <Select.Option value="Spanish">Spanish</Select.Option>
              <Select.Option value="French">French</Select.Option>
              <Select.Option value="German">German</Select.Option>
              <Select.Option value="Russian">Russian</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select the status" }]}
          >
            <Select>
              <Select.Option value="available">Available</Select.Option>
              <Select.Option value="borrowed">Borrowed</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="rating" label="Rating">
            <Rate allowHalf />
          </Form.Item>

          <Form.Item name="coverUrl" label="Cover URL">
            <Input />
          </Form.Item>
        </div>
      </TwoColumnLayout>

      <Form.Item>
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            {initialValues ? "Update" : "Add"} Book
          </Button>
        </Space>
      </Form.Item>
    </StyledForm>
  );
};

export default BookForm;
