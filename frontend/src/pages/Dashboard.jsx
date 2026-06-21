import { useState, useEffect } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetch("https://ai-analytics-dashboard-lajd.onrender.com/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        console.log("FULL DATA:", data);
        setDashboardData(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    await fetch("https://ai-analytics-dashboard-lajd.onrender.com/upload", {
      method: "POST",
      body: formData,
    });

    const response = await fetch("https://ai-analytics-dashboard-lajd.onrender.com/api/dashboard"
    );

    const data = await response.json();
    setDashboardData(data);
  };

  if (!dashboardData) {
    return <h2>Loading Dashboard...</h2>;
  }

  return (
    <div className="dashboard-container">
      <h1>AI Analytics Dashboard</h1>

      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleUpload}
      />

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ background: "#2b6cb0" }}>
          <h3>Rows</h3>
          <p>{dashboardData.kpis.rows}</p>
        </div>

        <div className="kpi-card" style={{ background: "#2f855a" }}>
          <h3>Columns</h3>
          <p>{dashboardData.kpis.columns}</p>
        </div>

        <div className="kpi-card" style={{ background: "#dd6b20" }}>
          <h3>Numeric Columns</h3>
          <p>{dashboardData.kpis.numericColumns}</p>
        </div>

        <div className="kpi-card" style={{ background: "#b7791f" }}>
          <h3>Missing Values</h3>
          <p>{dashboardData.kpis.missingValues}</p>
        </div>
      </div>

      {/* Bar & Pie */}
      <div className="chart-grid">

        <div className="chart-card">
          <h2>Bar Chart</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.barChart}>
              <XAxis
                dataKey={
                  dashboardData.barChart?.length > 0
                    ? Object.keys(dashboardData.barChart[0])[0]
                    : ""
                }
              />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey={
                  dashboardData.barChart?.length > 0
                    ? Object.keys(dashboardData.barChart[0])[1]
                    : ""
                }
                fill="#4F46E5"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Pie Chart</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.pieChart}
                dataKey={
                  dashboardData.pieChart?.length > 0
                    ? Object.keys(dashboardData.pieChart[0])[1]
                    : ""
                }
                nameKey={
                  dashboardData.pieChart?.length > 0
                    ? Object.keys(dashboardData.pieChart[0])[0]
                    : ""
                }
                outerRadius={100}
                label
              >
                {dashboardData.pieChart?.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Line Chart */}
      <div className="chart-card">
        <h2>Line Chart</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dashboardData.lineChart || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={
                dashboardData.lineChart?.length > 0
                  ? Object.keys(dashboardData.lineChart[0])[0]
                  : ""
              }
            />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey={
                dashboardData.lineChart?.length > 0
                  ? Object.keys(dashboardData.lineChart[0])[1]
                  : ""
              }
              stroke="#82ca9d"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insights */}
      <div className="chart-card">
        <h2>AI Insights</h2>

        <ul>
          {dashboardData.insights?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

    </div>
  );
}