
import { AnalyticsData } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

interface AnalyticsPanelProps {
  data: AnalyticsData;
}

const AnalyticsPanel = ({ data }: AnalyticsPanelProps) => {
  const delayData = [
    { name: "Embossing", value: data.delayBreakdown.embossing, color: "#3b82f6" },
    { name: "Quality Check", value: data.delayBreakdown.qualityCheck, color: "#10b981" },
    { name: "Dispatch", value: data.delayBreakdown.dispatch, color: "#f59e0b" },
    { name: "Transit", value: data.delayBreakdown.transit, color: "#8b5cf6" },
    { name: "Delivery", value: data.delayBreakdown.delivery, color: "#ef4444" }
  ];

  const statusData = [
    { name: "In Transit", value: data.cardsInTransit, color: "#f59e0b" },
    { name: "Delivered", value: data.cardsDelivered, color: "#10b981" },
    { name: "Issues", value: data.cardsWithIssues, color: "#ef4444" }
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-6">Card Delivery Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600">Total Cards</p>
          <p className="text-3xl font-bold text-blue-700">{data.totalCards}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600">Average Delivery Time</p>
          <p className="text-3xl font-bold text-green-700">{data.averageTimeToDelivery} days</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <p className="text-sm text-amber-600">Cards with Issues</p>
          <p className="text-3xl font-bold text-amber-700">{data.cardsWithIssues}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-3">Delay Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={delayData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [`${value}%`, 'Delay Percentage']} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {delayData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            <span className="font-medium">AI Insight:</span> 35% of delays occur during embossing phase
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Card Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => [value, 'Cards']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            <span className="font-medium">AI Insight:</span> 10% of cards face delivery issues
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
