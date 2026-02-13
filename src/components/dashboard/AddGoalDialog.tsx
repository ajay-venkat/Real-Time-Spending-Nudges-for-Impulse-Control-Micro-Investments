
"use client";

import { useState } from "react";
import { db } from "@/lib/local-storage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CATEGORIES = ["Food Delivery", "Shopping", "Entertainment", "Transport", "Bills", "Others"];

export function AddGoalDialog() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const category = formData.get("category") as string;
    const limit = parseFloat(formData.get("limit") as string);

    const goalData = {
      category,
      limit,
      current: 0,
      userId: "demo-user-001", 
      createdAt: new Date().toISOString(),
    };

    try {
      // Add to localStorage via our database abstraction
      db.addDoc("goals", goalData);

      // Close dialog and show success
      setOpen(false);
      toast({
        title: "Goal added",
        description: `Your ${category} goal has been created.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add goal. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Spending Goal</DialogTitle>
            <DialogDescription>
              Set a monthly limit for a category to get real-time nudges.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required defaultValue={CATEGORIES[0]}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="limit">Monthly Limit (₹)</Label>
              <Input
                id="limit"
                name="limit"
                type="number"
                placeholder="e.g. 2000"
                required
                min="1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
