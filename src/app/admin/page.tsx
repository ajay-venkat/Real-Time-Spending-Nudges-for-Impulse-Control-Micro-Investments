"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  TrendingUp,
  Target,
  Zap,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BehaviorCluster {
  name: string;
  userCount: number;
  avgSpending: number;
  impulsivityScore: number;
  topCategories: string[];
  savingsRate: number;
}

interface NudgeEffectiveness {
  nudgeType: string;
  impressions: number;
  conversions: number;
  conversionRate: number;
  avgRedirected: number;
}

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <AppLayout>
        <div className="text-sm text-muted-foreground">Loading admin dashboard...</div>
      </AppLayout>
    );
  }

  // Mock data for behavior clusters
  const clusters: BehaviorCluster[] = [
    {
      name: "High Impulsivity",
      userCount: 450,
      avgSpending: 12500,
      impulsivityScore: 78,
      topCategories: ["Food Delivery", "Shopping", "Entertainment"],
      savingsRate: 3.2,
    },
    {
      name: "Moderate Control",
      userCount: 820,
      avgSpending: 8900,
      impulsivityScore: 45,
      topCategories: ["Shopping", "Subscriptions", "Transport"],
      savingsRate: 8.5,
    },
    {
      name: "Disciplined Savers",
      userCount: 630,
      avgSpending: 6200,
      impulsivityScore: 18,
      topCategories: ["Subscriptions", "Transport", "Other"],
      savingsRate: 15.7,
    },
    {
      name: "Budget Conscious",
      userCount: 550,
      avgSpending: 5100,
      impulsivityScore: 22,
      topCategories: ["Food Delivery", "Transport", "Other"],
      savingsRate: 12.3,
    },
  ];

  // Mock data for nudge effectiveness
  const nudgeData: NudgeEffectiveness[] = [
    { nudgeType: "Soft Warning", impressions: 2450, conversions: 1823, conversionRate: 74.4, avgRedirected: 450 },
    { nudgeType: "Hard Block", impressions: 980, conversions: 892, conversionRate: 91.0, avgRedirected: 850 },
    { nudgeType: "Time Lock", impressions: 1560, conversions: 1387, conversionRate: 88.9, avgRedirected: 620 },
    { nudgeType: "Budget Alert", impressions: 3200, conversions: 2144, conversionRate: 67.0, avgRedirected: 380 },
  ];

  const totalUsers = clusters.reduce((sum, c) => sum + c.userCount, 0);
  const avgSavingsRate =
    clusters.reduce((sum, c) => sum + c.savingsRate * c.userCount, 0) / totalUsers;

  // Cluster distribution data
  const clusterPieData = clusters.map((c) => ({
    name: c.name,
    value: c.userCount,
  }));

  // Impulsivity vs Savings correlation
  const correlationData = clusters.map((c) => ({
    cluster: c.name,
    impulsivity: c.impulsivityScore,
    savingsRate: c.savingsRate,
    spending: c.avgSpending / 1000,
  }));

  // Nudge effectiveness over time (simulated)
  const timeSeriesData = Array.from({ length: 8 }, (_, i) => ({
    week: `Week ${i + 1}`,
    softNudges: Math.floor(Math.random() * 200) + 300,
    hardNudges: Math.floor(Math.random() * 100) + 150,
    conversions: Math.floor(Math.random() * 150) + 250,
  }));

  const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admin Analytics Dashboard</h2>
          <p className="text-slate-600 mt-1">
            Behavior clustering, nudge effectiveness, and platform metrics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">
                {totalUsers.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">Active on platform</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Avg Savings Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-600">
                {avgSavingsRate.toFixed(1)}%
              </p>
              <p className="text-xs text-slate-500 mt-1">Across all users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Nudge Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {(
                  (nudgeData.reduce((sum, n) => sum + n.conversions, 0) /
                    nudgeData.reduce((sum, n) => sum + n.impressions, 0)) *
                  100
                ).toFixed(1)}
                %
              </p>
              <p className="text-xs text-slate-500 mt-1">Overall conversion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Avg Redirected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">
                ₹
                {Math.floor(
                  nudgeData.reduce((sum, n) => sum + n.avgRedirected, 0) /
                    nudgeData.length
                ).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-slate-500 mt-1">Per successful nudge</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="clusters" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="clusters">Behavior Clusters</TabsTrigger>
            <TabsTrigger value="nudges">Nudge Effectiveness</TabsTrigger>
            <TabsTrigger value="trends">Trends Over Time</TabsTrigger>
          </TabsList>

          <TabsContent value="clusters" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Distribution by Cluster</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={clusterPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {clusterPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impulsivity vs Savings Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={correlationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="cluster" fontSize={11} stroke="#64748b" />
                      <YAxis fontSize={12} stroke="#64748b" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="impulsivity" fill="#ef4444" name="Impulsivity Score" />
                      <Bar dataKey="savingsRate" fill="#10b981" name="Savings Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Cluster Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clusters.map((cluster, index) => (
                    <div
                      key={cluster.name}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: colors[index % colors.length] }}
                          />
                          <h4 className="font-medium text-slate-900">{cluster.name}</h4>
                          <Badge variant="outline">{cluster.userCount} users</Badge>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-600">Avg Spending:</span>
                            <span className="ml-1 font-medium">
                              ₹{cluster.avgSpending.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600">Impulsivity:</span>
                            <span className="ml-1 font-medium">{cluster.impulsivityScore}/100</span>
                          </div>
                          <div>
                            <span className="text-slate-600">Savings Rate:</span>
                            <span className="ml-1 font-medium text-emerald-600">
                              {cluster.savingsRate}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nudges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nudge Type Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nudgeData.map((nudge) => (
                    <div key={nudge.nudgeType} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-slate-900">{nudge.nudgeType}</span>
                          <div className="text-sm text-slate-600 mt-1">
                            {nudge.impressions.toLocaleString()} impressions •{" "}
                            {nudge.conversions.toLocaleString()} conversions
                          </div>
                        </div>
                        <Badge
                          className={
                            nudge.conversionRate >= 80
                              ? "bg-emerald-100 text-emerald-700"
                              : nudge.conversionRate >= 70
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                          }
                        >
                          {nudge.conversionRate.toFixed(1)}% conversion
                        </Badge>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                          style={{ width: `${nudge.conversionRate}%` }}
                        />
                      </div>
                      <div className="text-sm text-slate-600">
                        Avg redirect: ₹{nudge.avgRedirected.toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nudge Activity Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="week" fontSize={12} stroke="#64748b" />
                    <YAxis fontSize={12} stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="softNudges"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Soft Nudges"
                      dot={{ fill: "#3b82f6", r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="hardNudges"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Hard Blocks"
                      dot={{ fill: "#ef4444", r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="conversions"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Conversions"
                      dot={{ fill: "#10b981", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
