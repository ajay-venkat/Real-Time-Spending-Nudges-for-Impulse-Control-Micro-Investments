
"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentTransactions() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="space-y-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="ml-4 space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <div className="ml-auto text-right space-y-1">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {MOCK_TRANSACTIONS.slice(0, 5).map((tx) => (
        <div key={tx.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary">
              {tx.merchant[0]}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{tx.merchant}</p>
            <p className="text-sm text-muted-foreground">
              {tx.category} • {format(new Date(tx.date), "MMM d, h:mm a")}
            </p>
          </div>
          <div className="ml-auto font-medium text-right">
            <div className={tx.status === 'blocked' ? 'text-destructive' : ''}>
              ₹{tx.amount.toFixed(2)}
            </div>
            <Badge variant={tx.status === 'completed' ? 'secondary' : 'outline'} className="text-[10px] h-4 mt-1">
              {tx.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
