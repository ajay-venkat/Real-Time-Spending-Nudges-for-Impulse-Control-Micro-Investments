
"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  PiggyBank,
  TrendingUp,
  ArrowUpRight,
  Wallet,
  Target,
  Plus,
  Sparkles,
  Loader2,
  ArrowRightCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MOCK_TRANSACTIONS, MOCK_INVESTMENT_OPTIONS } from "@/lib/mock-data";
import { intelligentMicroInvestmentRedirect, IntelligentMicroInvestmentRedirectOutput } from "@/ai/flows/intelligent-micro-investment-redirect-flow";

interface SavingsData {
  id: string;
  type: "micro_investment" | "savings_pot";
  name: string;
  balance: number;
  totalRedirected: number;
  transactions: number;
}

export default function InvestmentsPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<IntelligentMicroInvestmentRedirectOutput | null>(null);
  const [savings, setSavings] = useState<SavingsData[]>([]);

  useEffect(() => {
    setMounted(true);
    // Generate mock savings data
    setSavings([
      {
        id: "1",
        type: "micro_investment",
        name: "Index Fund Portfolio",
        balance: 15250,
        totalRedirected: 12000,
        transactions: 45,
      },
      {
        id: "2",
        type: "savings_pot",
        name: "Emergency Fund",
        balance: 8920,
        totalRedirected: 8000,
        transactions: 32,
      },
      {
        id: "3",
        type: "micro_investment",
        name: "Digital Gold",
        balance: 5630,
        totalRedirected: 5000,
        transactions: 28,
      },
    ]);
  }, []);

  if (!mounted) {
    return (
      <AppLayout>
        <div className="text-sm text-muted-foreground">Loading investments...</div>
      </AppLayout>
    );
  }

  const totalBalance = savings.reduce((sum, s) => sum + s.balance, 0);
  const totalRedirected = savings.reduce((sum, s) => sum + s.totalRedirected, 0);
  const totalTransactions = savings.reduce((sum, s) => sum + s.transactions, 0);

  // Generate monthly savings growth data
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (5 - i));
    const monthName = month.toLocaleDateString("en-US", { month: "short" });

    return {
      month: monthName,
      saved: Math.floor(Math.random() * 3000) + 1000,
      invested: Math.floor(Math.random() * 2000) + 500,
    };
  });

  // Redirected transactions over last 7 days
  const redirectedTransactions = MOCK_TRANSACTIONS.filter((t) => t.redirectedAmount);
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

    const dayTxns = redirectedTransactions.filter(
      (t) => new Date(t.date).toDateString() === date.toDateString()
    );

    return {
      day: dayName,
      redirected: dayTxns.reduce((sum, t) => sum + (t.redirectedAmount || 0), 0),
    };
  });

  const handleGetRecommendation = async () => {
    setLoading(true);
    try {
      const res = await intelligentMicroInvestmentRedirect({
        excessAmount: 1500,
        userFinancialGoals: "Build a safety net and start long-term equity exposure.",
        currentMarketConditions: "Stable growth in domestic indices, slightly high inflation, interest rates peaking.",
        availableInvestmentOptions: MOCK_INVESTMENT_OPTIONS
      });
      setRecommendation(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Savings & Micro-Investments
            </h2>
            <p className="text-slate-600 mt-1">
              Track your redirected savings and investment growth
            </p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Savings Goal
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    ₹{totalBalance.toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm opacity-90 mt-1">
                    From {totalTransactions} redirections
                  </p>
                </div>
                <PiggyBank className="w-12 h-12 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-900">₹4,250</p>
                  <div className="flex items-center gap-1 text-emerald-600 text-sm mt-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>+23% vs last month</span>
                  </div>
                </div>
                <Wallet className="w-12 h-12 text-slate-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Avg per Redirect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-900">
                    ₹{Math.floor(totalRedirected / totalTransactions).toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Per impulse transaction
                  </p>
                </div>
                <Target className="w-12 h-12 text-slate-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Investment Advisor */}
        <Card className="border-accent/20 bg-accent/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                AI Investment Advisor
              </CardTitle>
              <Badge variant="outline" className="border-accent text-accent-foreground bg-accent/10">Active Advice</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!recommendation ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="p-4 bg-background rounded-full border border-dashed border-muted-foreground/30">
                  <TrendingUp className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <div className="max-w-xs">
                  <h3 className="font-semibold text-lg">Ready to grow?</h3>
                  <p className="text-sm text-muted-foreground">Generate a personalized redirection recommendation for your surplus.</p>
                </div>
                <Button onClick={handleGetRecommendation} disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Get Recommendation
                </Button>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
                <div className="p-4 bg-background rounded-lg border-2 border-primary/20 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xl text-primary">{recommendation.recommendedAction}</h4>
                      <p className="text-sm text-muted-foreground">Redirecting: <span className="font-bold text-foreground">₹{recommendation.redirectAmount}</span></p>
                    </div>
                    <Badge className="bg-primary">{recommendation.investmentOption.riskLevel} Risk</Badge>
                  </div>
                  <div className="text-sm bg-muted/50 p-3 rounded italic text-muted-foreground">
                    "{recommendation.recommendationRationale}"
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase text-muted-foreground">Expected Return</p>
                      <p className="font-bold text-primary">{recommendation.investmentOption.expectedReturn}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase text-muted-foreground">Category</p>
                      <p className="font-bold text-primary">{recommendation.investmentOption.type}</p>
                    </div>
                  </div>
                  <Button className="w-full bg-primary mt-2">
                    Approve Redirection
                    <ArrowRightCircle className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" onClick={() => setRecommendation(null)} className="text-xs text-muted-foreground underline">Reset simulator</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Savings Accounts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {savings.map((saving) => (
            <Card
              key={saving.id}
              className={
                saving.type === "micro_investment"
                  ? "border-blue-200 bg-blue-50"
                  : "border-emerald-200 bg-emerald-50"
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{saving.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={`mt-2 text-xs ${
                        saving.type === "micro_investment"
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : "bg-emerald-100 text-emerald-700 border-emerald-300"
                      }`}
                    >
                      {saving.type.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  {saving.type === "micro_investment" ? (
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  ) : (
                    <PiggyBank className="w-8 h-8 text-emerald-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      ₹{saving.balance.toLocaleString("en-IN")}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      {saving.transactions} contributions
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Progress to ₹20,000</span>
                      <span className="font-medium text-slate-900">
                        {Math.floor((saving.balance / 20000) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(saving.balance / 20000) * 100}
                      className="h-2 [&>div]:bg-emerald-500"
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Growth Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" fontSize={12} stroke="#64748b" />
                  <YAxis fontSize={12} stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="saved"
                    fill="#10b981"
                    name="Saved"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="invested"
                    fill="#3b82f6"
                    name="Invested"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Redirect Activity (7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" fontSize={12} stroke="#64748b" />
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
                    dataKey="redirected"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Redirected"
                    dot={{ fill: "#10b981", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Impact Summary */}
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Your Savings Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-slate-600 mb-1">Impulses Redirected</p>
                <p className="text-3xl font-bold text-slate-900">{totalTransactions}</p>
                <p className="text-sm text-emerald-600 mt-1">
                  Average ₹{Math.floor(totalRedirected / totalTransactions)} per impulse
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Money Redirected</p>
                <p className="text-3xl font-bold text-slate-900">
                  ₹{totalRedirected.toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-emerald-600 mt-1">
                  Potential 8-12% annual returns
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Projected 1-Year Value</p>
                <p className="text-3xl font-bold text-emerald-600">
                  ₹{Math.floor(totalBalance * 1.1).toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-slate-600 mt-1">With 10% average returns</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
