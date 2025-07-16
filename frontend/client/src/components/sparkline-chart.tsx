import { LineChart, Line, ResponsiveContainer } from "recharts";

interface SparklineChartProps {
  data: number[];
}

export default function SparklineChart({ data }: SparklineChartProps) {
  const chartData = data.map((value, index) => ({
    index,
    value: value,
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][index] || `Day ${index + 1}`,
  }));

  const getBarColor = (value: number) => {
    if (value > 0) return "bg-success/60";
    if (value < 0) return "bg-danger/60";
    return "bg-warning/60";
  };

  const getBarHeight = (value: number) => {
    const maxVal = Math.max(...data.map(Math.abs));
    return Math.max(20, (Math.abs(value) / maxVal) * 80);
  };

  return (
    <div>
      <div className="h-20 bg-gray-50 rounded-lg flex items-end justify-center space-x-1 p-2">
        {data.map((value, index) => (
          <div
            key={index}
            className={`w-8 rounded-t ${getBarColor(value)}`}
            style={{ height: `${getBarHeight(value)}%` }}
            title={`${chartData[index].day}: ${value}%`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        {chartData.map((item, index) => (
          <span key={index}>{item.day}</span>
        ))}
      </div>
    </div>
  );
}
