import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { RenderChartProps } from "../lib/definitions";

const renderChart = ({
  chartData,
  hasStageData,
  hasDownstreamData,
}: RenderChartProps) => (
  <div className="h-[400px] lg:h-[500px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          label={{
            value: "Time",
            position: "insideBottomRight",
            offset: -10,
          }}
        />
        <YAxis
          label={{
            value: "Water Level (m)",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip />
        <Legend />
        {hasStageData && (
          <Line
            type="monotone"
            dataKey="stage"
            name="Stage Level"
            stroke="#2563eb"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        )}
        {hasDownstreamData && (
          <Line
            type="monotone"
            dataKey="downstream"
            name="Downstream Level"
            stroke="#16a34a"
            strokeWidth={2}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default renderChart;
