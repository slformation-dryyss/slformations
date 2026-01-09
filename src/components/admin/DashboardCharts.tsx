"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
} from "recharts";

interface DashboardChartsProps {
  monthlyData: any[];
  sessionStats: {
    past: number;
    current: number;
    future: number;
  };
}

export default function DashboardCharts({ monthlyData, sessionStats }: DashboardChartsProps) {
  const sessionData = [
    { name: "Passées", value: sessionStats.past, color: "#94a3b8" },
    { name: "En cours", value: sessionStats.current, color: "#10b981" },
    { name: "À venir", value: sessionStats.future, color: "#f59e0b" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Session Distribution */}
      <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Distribution des Sessions</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {sessionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enrollment Trend */}
      <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Évolution des Inscriptions</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="inscriptions" 
                stroke="#d4af37" 
                strokeWidth={2}
                dot={{ r: 4, fill: "#d4af37" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

