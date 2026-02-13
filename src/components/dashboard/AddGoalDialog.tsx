
"use client";

import { useState } from "react";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
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
  const firestore = useFirestore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) return;

    const formData = new FormData(e.currentTarget);
    const category = formData.get("category") as string;
    const limit = parseFloat(formData.get("limit") as string);

    const goalData = {
      category,
      limit,
      current: 0,
      userId: "aditya_kumar_mock", 
      createdAt: serverTimestamp(),
    };

    const goalsRef = collection(firestore, "goals");

    // Optimistically close the dialog and show success
    setOpen(false);
    toast({
      title: "Goal added",
      description: `Your ${category} goal has been created.`,
    });

    // Initiate the write without awaiting it
    addDoc(goalsRef, goalData).catch(async (error) => {
      const permissionError = new FirestorePermissionError({
        path: goalsRef.path,
        operation: "create",
        requestResourceData: goalData,
      });
      errorEmitter.emit("permission-error", permissionError);
    });
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
