import { MenuOutlined } from "@ant-design/icons";
import styled from "styled-components";

const SortableTableRow = ({ children, ...props }: any) => {
  return (
    <RowContainer {...props}>
      <MenuOutlined />
      {children}
    </RowContainer>
  );
};

export default SortableTableRow;

const DragHandle = styled.div`
  position: absolute;
  left: -20px;
  top: 50%;
  transform: translateY(-50%);
  cursor: grab;
  opacity: 0;
  transition: opacity 0.2s;
  color: #1a365d;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 1;
  }
`;
const RowContainer = styled.tr<{ isDragging: boolean; isOver: boolean }>`
  position: relative;
  transition: all 0.2s ease-in-out;

  ${(props) =>
    props.isDragging &&
    `
    background: rgba(24, 144, 255, 0.1) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1;
  `}

  ${(props) =>
    props.isOver &&
    !props.isDragging &&
    `
    background: rgba(24, 144, 255, 0.05) !important;
    box-shadow: 0 -2px 0 #1890ff;
  `}

  &:hover ${DragHandle} {
    opacity: 1;
  }
`;
