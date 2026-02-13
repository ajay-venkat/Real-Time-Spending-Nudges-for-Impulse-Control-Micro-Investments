
"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Settings2, Trash2, Clock, TrendingUp, Bell } from "lucide-react";
import { SpendingRule, SpendingRuleWithId } from "@/lib/mock-data";
import { db } from "@/lib/local-storage";
import { calculateCategorySpending } from "@/lib/transaction-engine";
import { toast } from "sonner";

type SpendingRuleForm = SpendingRule;

export default function RulesPage() {
  const [rules, setRules] = useState<SpendingRuleWithId[]>([]);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [editingRule, setEditingRule] = useState<SpendingRuleWithId | null>(null);

  const [formData, setFormData] = useState({
    category: "",
    limit: "",
    current: "0",
    timeLockEnabled: false,
    timeLockRange: { start: 22, end: 6 },
  });

  // Load rules from localStorage on mount
  useEffect(() => {
    const loadRules = () => {
      const storedRules = db.getCollection('rules') as SpendingRuleWithId[];
      // Update current spending for each rule
      const updatedRules = storedRules.map(rule => ({
        ...rule,
        current: calculateCategorySpending(rule.category)
      }));
      setRules(updatedRules);
    };

    loadRules();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes('nudgewealth_rules') || e.key?.includes('nudgewealth_transactions')) {
        loadRules();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleToggleRule = (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (rule) {
      db.updateDoc('rules', id, { timeLockEnabled: !rule.timeLockEnabled });
      setRules(
        rules.map((r) =>
          r.id === id ? { ...r, timeLockEnabled: !r.timeLockEnabled } : r
        )
      );
      toast.success("Rule updated successfully");
    }
  };

  const handleDeleteRule = (id: string) => {
    db.deleteDoc('rules', id);
    setRules(rules.filter((rule) => rule.id !== id));
    toast.success("Rule deleted successfully");
  };

  const handleSaveRule = () => {
    if (!formData.category || !formData.limit) {
      toast.error("Please fill in all required fields");
      return;
    }

    const currentSpending = calculateCategorySpending(formData.category);
    const newRule = {
      category: formData.category,
      limit: parseFloat(formData.limit),
      current: currentSpending,
      timeLockEnabled: formData.timeLockEnabled,
      timeLockRange: [formData.timeLockRange.start, formData.timeLockRange.end] as [number, number],
    };

    if (editingRule) {
      db.updateDoc('rules', editingRule.id, newRule);
      setRules(rules.map((rule) => (rule.id === editingRule.id ? { ...newRule, id: editingRule.id } : rule)));
      toast.success("Rule updated successfully");
    } else {
      const docId = db.addDoc('rules', newRule);
      setRules([...rules, { ...newRule, id: docId }]);
      toast.success("Rule created successfully");
    }

    setIsAddingRule(false);
    setEditingRule(null);
    setFormData({
      category: "",
      limit: "",
      current: "0",
      timeLockEnabled: false,
      timeLockRange: { start: 22, end: 6 },
    });
  };

  const handleEditRule = (rule: SpendingRuleWithId) => {
    setEditingRule(rule);
    setFormData({
      category: rule.category,
      limit: rule.limit.toString(),
      current: rule.current.toString(),
      timeLockEnabled: rule.timeLockEnabled,
      timeLockRange: { start: rule.timeLockRange[0], end: rule.timeLockRange[1] },
    });
    setIsAddingRule(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Spending Rules & Limits</h2>
            <p className="text-slate-600 mt-1">
              Configure category-based limits and impulse control mechanisms
            </p>
          </div>
          <Dialog open={isAddingRule} onOpenChange={setIsAddingRule}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingRule ? "Edit Spending Rule" : "Create New Spending Rule"}
                </DialogTitle>
                <DialogDescription>
                  Set limits and controls for specific spending categories
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Food Delivery, Shopping"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="limit">Spending Limit (₹)</Label>
                  <Input
                    id="limit"
                    type="number"
                    placeholder="5000"
                    value={formData.limit}
                    onChange={(e) =>
                      setFormData({ ...formData, limit: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label>Enable Time Lock</Label>
                    <p className="text-xs text-slate-500">
                      Block transactions during late night hours (10 PM - 6 AM)
                    </p>
                  </div>
                  <Switch
                    checked={formData.timeLockEnabled}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, timeLockEnabled: checked })
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingRule(false);
                    setEditingRule(null);
                    setFormData({
                      category: "",
                      limit: "",
                      current: "0",
                      timeLockEnabled: false,
                      timeLockRange: { start: 22, end: 6 },
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleSaveRule}
                >
                  {editingRule ? "Update Rule" : "Create Rule"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Rule Cards */}
        <div className="grid grid-cols-1 gap-4">
          {rules.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Settings2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">
                  No spending rules configured yet. Add your first rule to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            rules.map((rule) => (
              <Card
                key={rule.category}
                className={rule.timeLockEnabled ? "border-emerald-200" : "border-slate-200"}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{rule.category}</CardTitle>
                        {rule.timeLockEnabled ? (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-600">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-sm">
                            <TrendingUp className="w-4 h-4" />
                            <span>
                              ₹{rule.current.toLocaleString("en-IN")} / ₹{rule.limit.toLocaleString("en-IN")}
                            </span>
                          </div>
                          {rule.timeLockEnabled && (
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="w-4 h-4" />
                              <span>
                                Time lock: {rule.timeLockRange.start}:00 - {rule.timeLockRange.end}:00
                              </span>
                            </div>
                          )}
                        </div>
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Switch
                        checked={rule.timeLockEnabled}
                        onCheckedChange={() => handleToggleRule(rule.id)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditRule(rule)}
                      >
                        <Settings2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRule(rule.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Impulse Control Windows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700">
                Set time locks to prevent late-night impulse purchases. This helps you pause and reconsider buying decisions during vulnerable hours.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Category Spending Limits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700">
                Track your spending against category-specific budgets. Get real-time alerts when approaching or exceeding your limits.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
