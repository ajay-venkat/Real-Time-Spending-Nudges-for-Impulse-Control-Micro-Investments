
"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SpendingNudgeWidget } from "@/components/dashboard/SpendingNudgeWidget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MOCK_RULES } from "@/lib/mock-data";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 p-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Overview</h1>
            <p className="text-muted-foreground">Welcome back, Aditya. Here's your financial pulse.</p>
          </div>
        </div>

        <OverviewCards />

        <div className="grid gap-6 md:grid-cols-7">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>You had 12 transactions this week.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTransactions />
            </CardContent>
          </Card>
          
          <div className="md:col-span-3 space-y-6">
            <SpendingNudgeWidget />
            
            <Card>
              <CardHeader>
                <CardTitle>Spending Goals</CardTitle>
                <CardDescription>How you're doing against your limits.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!mounted ? (
                  <div className="text-sm text-muted-foreground">Loading goals...</div>
                ) : (
                  MOCK_RULES.map((goal) => {
                    const percentage = Math.min((goal.current / goal.limit) * 100, 100);
                    const isHigh = percentage > 80;
                    return (
                      <div key={goal.category} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{goal.category}</span>
                          <span>₹{goal.current} / ₹{goal.limit}</span>
                        </div>
                        <Progress 
                          value={percentage} 
                          className={`h-2 w-full ${isHigh ? 'bg-destructive/20' : ''}`}
                        />
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
