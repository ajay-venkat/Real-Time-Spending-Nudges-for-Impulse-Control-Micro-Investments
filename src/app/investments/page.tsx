
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { intelligentMicroInvestmentRedirect, IntelligentMicroInvestmentRedirectOutput } from "@/ai/flows/intelligent-micro-investment-redirect-flow";
import { MOCK_INVESTMENT_OPTIONS } from "@/lib/mock-data";
import { TrendingUp, Sparkles, Loader2, ArrowRightCircle, Info } from "lucide-react";

export default function InvestmentsPage() {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<IntelligentMicroInvestmentRedirectOutput | null>(null);

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
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Micro-Investments</h1>
          <p className="text-muted-foreground">Redirected funds at work for your future.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Redirected</p>
            <p className="text-2xl font-bold text-primary">₹8,920.50</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-accent/20 bg-accent/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                AI Investment Advisor
              </CardTitle>
              <Badge variant="outline" className="border-accent text-accent-foreground bg-accent/10">Active Advice</Badge>
            </div>
            <CardDescription>
              NudgeWealth analyzes your goals and market conditions to redirect excess funds intelligently.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!recommendation ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="p-4 bg-background rounded-full border border-dashed border-muted-foreground/30">
                  <TrendingUp className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <div className="max-w-xs">
                  <h3 className="font-semibold text-lg">Ready to grow?</h3>
                  <p className="text-sm text-muted-foreground">Generate a personalized redirection recommendation for your ₹1,500 surplus.</p>
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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Portfolio Allocation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Index Funds</span>
                  <span className="font-bold">65%</span>
                </div>
                <Progress value={65} className="h-1.5" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Digital Gold</span>
                  <span className="font-bold">20%</span>
                </div>
                <Progress value={20} className="h-1.5 bg-accent/20" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Savings Pots</span>
                  <span className="font-bold">15%</span>
                </div>
                <Progress value={15} className="h-1.5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground overflow-hidden relative">
            <Info className="absolute -right-4 -top-4 h-24 w-24 opacity-10 rotate-12" />
            <CardHeader>
              <CardTitle className="text-lg">Pro-Tip</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              Redirecting just ₹50 from every 'Food Delivery' purchase can build a corpus of ₹15,000 in a year at 12% returns!
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
