
"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Zap,
  ShoppingBag,
  Utensils,
  Tv,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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
import { Transaction, SpendingRuleWithId } from "@/lib/mock-data";
import { db } from "@/lib/local-storage";
import { calculateCategorySpending } from "@/lib/transaction-engine";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rules, setRules] = useState<SpendingRuleWithId[]>([]);

  useEffect(() => {
    setMounted(true);
    
    const loadData = () => {
      // Load transactions from localStorage
      const storedTransactions = db.getCollection('transactions') as Transaction[];
      setTransactions(storedTransactions);

      // Load rules from localStorage and update current spending
      const storedRules = db.getCollection('rules') as SpendingRuleWithId[];
      const updatedRules = storedRules.map(rule => ({
        ...rule,
        current: calculateCategorySpending(rule.category)
      }));
      setRules(updatedRules);
    };

    loadData();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes('nudgewealth_')) {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!mounted) {
    return (
      <AppLayout>
        <div className="text-sm text-muted-foreground">Loading dashboard...</div>
      </AppLayout>
    );
  }

  // Calculate spending by category
  const categorySpending = transactions.reduce((acc, txn) => {
    const category = txn.category.replace(/_/g, " ");
    acc[category] = (acc[category] || 0) + txn.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categorySpending).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Daily spending trend (last 14 days)
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    return date.toISOString().split("T")[0];
  });

  const dailySpending = last14Days.map((date) => {
    const dayTransactions = transactions.filter(
      (txn) => new Date(txn.date).toISOString().split("T")[0] === date
    );
    const spending = dayTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const saved = dayTransactions.reduce(
      (sum, txn) => sum + (txn.redirectedAmount || 0),
      0
    );
    return {
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      spending,
      saved,
    };
  });

  const totalSpending = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  const totalSaved = transactions.reduce(
    (sum, txn) => sum + (txn.redirectedAmount || 0),
    0
  );
  const impulsiveTransactions = transactions.filter((txn) => txn.status === "pending").length;
  const blockedAmount = transactions
    .filter((txn) => txn.status === "blocked")
    .reduce((sum, txn) => sum + txn.amount, 0);

  const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#6366f1"];

  const categoryIcons: Record<string, any> = {
    "Food Delivery": Utensils,
    "Shopping": ShoppingBag,
    "Subscriptions": Tv,
  };

  // Check for alerts
  const alerts = rules.map((rule) => {
    const percentage = (rule.current / rule.limit) * 100;
    if (percentage >= 90) {
      return {
        id: rule.category,
        type: "hard" as const,
        message: `${rule.category} limit exceeded!`,
        amount: rule.current,
        limitAmount: rule.limit,
      };
    } else if (percentage >= 75) {
      return {
        id: rule.category,
        type: "soft" as const,
        message: `${rule.category} approaching limit`,
        amount: rule.current,
        limitAmount: rule.limit,
      };
    }
    return null;
  }).filter(Boolean);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Alerts */}
        {alerts.map((alert) => alert && (
          <Alert
            key={alert.id}
            className={
              alert.type === "hard"
                ? "border-red-200 bg-red-50"
                : "border-amber-200 bg-amber-50"
            }
          >
            <AlertTriangle
              className={`h-4 w-4 ${
                alert.type === "hard" ? "text-red-600" : "text-amber-600"
              }`}
            />
            <AlertDescription className="ml-2">
              <span
                className={`font-medium ${
                  alert.type === "hard" ? "text-red-900" : "text-amber-900"
                }`}
              >
                {alert.message}
              </span>
              <span className="text-slate-600 ml-2">
                (₹{alert.amount.toLocaleString("en-IN")} / ₹
                {alert.limitAmount.toLocaleString("en-IN")})
              </span>
            </AlertDescription>
          </Alert>
        ))}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Spending (30d)
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                ₹{totalSpending.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {impulsiveTransactions} impulse purchases detected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Saved
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                ₹{totalSaved.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-slate-500 mt-1">Auto-redirected from excess spend</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Nudges Successful
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {transactions.length > 0 
                  ? Math.floor((transactions.filter((t) => t.status !== "completed").length /
                      transactions.length) *
                      100)
                  : 0}
                %
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {transactions.filter((t) => t.status !== "completed").length} transactions
                influenced
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Blocked Amount
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                ₹{blockedAmount.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-slate-500 mt-1">Prevented impulse spending</p>
            </CardContent>
          </Card>
        </div>

        {/* Spending Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending & Savings Trend (14 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailySpending}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" fontSize={12} stroke="#64748b" />
                  <YAxis fontSize={12} stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="spending"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#fca5a5"
                    name="Spending"
                  />
                  <Area
                    type="monotone"
                    dataKey="saved"
                    stackId="2"
                    stroke="#10b981"
                    fill="#86efac"
                    name="Saved"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
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
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Active Rules Status */}
        <Card>
          <CardHeader>
            <CardTitle>Active Spending Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rules.map((rule) => {
                const percentage = Math.min((rule.current / rule.limit) * 100, 100);
                const Icon = categoryIcons[rule.category] || Zap;

                return (
                  <div key={rule.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-slate-600" />
                        <span className="font-medium text-slate-900">
                          {rule.category}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          weekly
                        </Badge>
                      </div>
                      <span className="text-sm text-slate-600">
                        ₹{rule.current.toLocaleString("en-IN")} / ₹
                        {rule.limit.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      className={`h-2 ${
                        percentage >= 100
                          ? "[&>div]:bg-red-500"
                          : percentage >= 80
                          ? "[&>div]:bg-amber-500"
                          : "[&>div]:bg-emerald-500"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        txn.status === "blocked"
                          ? "bg-red-100"
                          : txn.status === "redirected"
                          ? "bg-amber-100"
                          : "bg-slate-100"
                      }`}
                    >
                      <ArrowUpRight
                        className={`w-5 h-5 ${
                          txn.status === "blocked"
                            ? "text-red-600"
                            : txn.status === "redirected"
                            ? "text-amber-600"
                            : "text-slate-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{txn.merchant}</p>
                      <p className="text-sm text-slate-500">
                        {txn.category.replace(/_/g, " ")} •{" "}
                        {new Date(txn.date).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">
                      ₹{txn.amount.toLocaleString("en-IN")}
                    </p>
                    {txn.redirectedAmount && (
                      <p className="text-sm text-emerald-600">
                        +₹{txn.redirectedAmount.toLocaleString("en-IN")} saved
                      </p>
                    )}
                    {txn.status === "blocked" && (
                      <Badge variant="destructive" className="text-xs">
                        Blocked
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
