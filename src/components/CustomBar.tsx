import type { RectangleProps } from "recharts";

interface ChartData {
  name: string;
  userId: string;
  duration: number;
}

interface CustomBarProps extends RectangleProps {
   payload?: ChartData;         // để optional
  selectedUserId?: string;   // user nào đang được chọn
}

const CustomBar: React.FC<CustomBarProps> = (props) => {
  const { x, y, width, height, payload, selectedUserId } = props;
  const isSelected = selectedUserId && payload?.userId === selectedUserId;

  return (
    <rect
      x={x ?? 0}
      y={y ?? 0}
      width={width ?? 0}
      height={height ?? 0}
      fill={isSelected ? "#ff7300" : "#8884d8"} // màu khác nếu là user đang chọn
    />
  );
};

export default CustomBar;
