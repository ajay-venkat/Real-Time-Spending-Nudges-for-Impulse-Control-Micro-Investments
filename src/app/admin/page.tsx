"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Legend
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Users, PiggyBank, Target, TrendingUp, ShieldCheck } from "lucide-react";

const CLUSTER_DATA = [
  { name: 'Students', effectiveness: 78, savings: 4500, users: 1200, behavior: 'Impulsive Food' },
  { name: 'Working Professionals', effectiveness: 62, savings: 12000, users: 850, behavior: 'Subscription Fatigue' },
  { name: 'Freelancers', effectiveness: 45, savings: 3200, users: 400, behavior: 'Irregular Large Spends' },
];

const RULE_EFFECTIVENESS = [
  { name: 'Food Limit', effectiveness: 85, impact: 'High' },
  { name: 'Late Night Lock', effectiveness: 92, impact: 'Critical' },
  { name: 'Subscription Cap', effectiveness: 40, impact: 'Low' },
  { name: 'Daily Budget', effectiveness: 75, impact: 'Medium' },
];

const TREND_DATA = [
  { month: 'Jan', active: 1800, blocked: 450 },
  { month: 'Feb', active: 2100, blocked: 620 },
  { month: 'Mar', active: 2450, blocked: 890 },
];

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 p-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-6 w-6" />
            <h1 className="text-3xl font-bold tracking-tight">Admin Intelligence</h1>
          </div>
          <p className="text-muted-foreground">Anonymized behavioral clustering and nudge performance orchestration.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Active Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,450</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-primary" />
                +12% from last week
              </p>
            </CardContent>
          </Card>
          <Card className="border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nudge Conversion</CardTitle>
              <Activity className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68.4%</div>
              <p className="text-xs text-muted-foreground">Blocked/Redirected ratio</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wealth Created</CardTitle>
              <PiggyBank className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹24,50,000</div>
              <p className="text-xs text-muted-foreground">Aggregate micro-investments</p>
            </CardContent>
          </Card>
          <Card className="border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
              <Target className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94/100</div>
              <p className="text-xs text-muted-foreground">System-wide health</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Nudge Effectiveness</CardTitle>
              <CardDescription>Impact by intervention type (Last 30 days)</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={RULE_EFFECTIVENESS}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                    <YAxis axisLine={false} tickLine={false} fontSize={12} />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }} 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Bar dataKey="effectiveness" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">Loading charts...</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Growth Trends</CardTitle>
              <CardDescription>Active vs Blocked spending volume</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={TREND_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                    <YAxis axisLine={false} tickLine={false} fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" />
                    <Line type="monotone" dataKey="active" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
                    <Line type="monotone" dataKey="blocked" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ fill: 'hsl(var(--accent))' }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">Loading trends...</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Cluster Deep-Dive</CardTitle>
            <CardDescription>Behavioral metrics segmented by demographic cohorts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cluster</TableHead>
                  <TableHead>Dominant Behavior</TableHead>
                  <TableHead>User Count</TableHead>
                  <TableHead>Nudge Efficacy</TableHead>
                  <TableHead className="text-right">Avg Savings (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CLUSTER_DATA.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="font-bold text-primary">{row.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{row.behavior}</Badge>
                    </TableCell>
                    <TableCell>{row.users.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${row.effectiveness}%` }} 
                          />
                        </div>
                        <span className="text-xs font-medium">{row.effectiveness}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">₹{row.savings.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
