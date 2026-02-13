
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { personalizedSpendingNudges, PersonalizedSpendingNudgesOutput } from "@/ai/flows/personalized-spending-nudges";
import { AlertCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { MOCK_RULES, MOCK_INVESTMENT_OPTIONS } from "@/lib/mock-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SpendingNudgeWidget() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food Delivery");
  const [loading, setLoading] = useState(false);
  const [nudge, setNudge] = useState<PersonalizedSpendingNudgesOutput | null>(null);

  const handleSimulate = async () => {
    if (!amount) return;
    setLoading(true);
    try {
      const rule = MOCK_RULES.find(r => r.category === category);
      const res = await personalizedSpendingNudges({
        currentSpending: rule?.current || 0,
        spendingLimit: rule?.limit || 2000,
        transactionAmount: parseFloat(amount),
        transactionCategory: category,
        userFinancialGoals: ["Save for higher studies", "Buy a laptop"],
        investmentOpportunities: MOCK_INVESTMENT_OPTIONS
      });
      setNudge(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-accent/20 bg-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          Nudge Engine Simulator
        </CardTitle>
        <CardDescription>
          Simulate a transaction to see how NudgeWealth reacts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_RULES.map(r => (
                  <SelectItem key={r.category} value={r.category}>{r.category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input 
              id="amount" 
              type="number" 
              placeholder="e.g. 500" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        
        {nudge && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2">
            <Alert variant={nudge.isOverLimit ? "destructive" : "default"} className={!nudge.isOverLimit ? "border-primary bg-primary/5" : ""}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{nudge.isOverLimit ? "Hard Alert: Spending Over Limit" : "Nudge: Smart Suggestion"}</AlertTitle>
              <AlertDescription className="mt-2 space-y-3">
                <p>{nudge.nudgeMessage}</p>
                {nudge.suggestedAction && (
                  <div className="rounded bg-background/50 p-2 text-xs font-medium border border-border flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-primary" />
                    {nudge.suggestedAction}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-primary hover:bg-primary/90" 
          disabled={loading || !amount}
          onClick={handleSimulate}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {loading ? "Analyzing..." : "Check Impact"}
        </Button>
      </CardFooter>
    </Card>
  );
}
