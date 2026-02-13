
"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MOCK_RULES } from "@/lib/mock-data";
import { ShieldCheck, Clock, Save, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function RulesPage() {
  const [rules, setRules] = useState(MOCK_RULES);

  const toggleLock = (category: string) => {
    setRules(prev => prev.map(r => r.category === category ? { ...r, timeLockEnabled: !r.timeLockEnabled } : r));
    toast({
      title: "Time-lock updated",
      description: `Impulse control for ${category} has been changed.`
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 p-8 space-y-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Impulse Control Rules</h1>
            <p className="text-muted-foreground">Configure limits and time-windows to prevent impulsive spending.</p>
          </div>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
            Add New Rule
          </Button>
        </div>

        <div className="grid gap-6">
          {rules.map((rule) => (
            <Card key={rule.category} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r bg-muted/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="bg-background text-primary border-primary">{rule.category}</Badge>
                    {rule.current > rule.limit && <AlertTriangle className="h-4 w-4 text-destructive" />}
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Category Limit</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">₹</span>
                        <Input type="number" defaultValue={rule.limit} className="h-8" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Late Night Impulse Lock</p>
                        <p className="text-xs text-muted-foreground">Blocks transactions between 10 PM and 6 AM</p>
                      </div>
                    </div>
                    <Switch 
                      checked={rule.timeLockEnabled} 
                      onCheckedChange={() => toggleLock(rule.category)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                      <ShieldCheck className="h-4 w-4" />
                      Real-time Monitoring Active
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="h-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="h-8 bg-primary">
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
