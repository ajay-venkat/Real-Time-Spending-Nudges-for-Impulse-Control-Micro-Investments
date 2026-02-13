
"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Transaction } from "@/lib/mock-data";
import { db } from "@/lib/local-storage";

export default function HistoryPage() {
  const [mounted, setMounted] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    setMounted(true);
    
    const loadTransactions = () => {
      const storedTransactions = db.getCollection('transactions') as Transaction[];
      setTransactions(storedTransactions);
      setFilteredTransactions(storedTransactions);
    };

    loadTransactions();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes('nudgewealth_transactions')) {
        loadTransactions();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    let filtered = transactions;

    if (searchQuery) {
      filtered = filtered.filter((txn) =>
        txn.merchant.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((txn) => txn.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((txn) => txn.status === statusFilter);
    }

    setFilteredTransactions(filtered);
  }, [searchQuery, categoryFilter, statusFilter, mounted, transactions]);

  if (!mounted) {
    return (
      <AppLayout>
        <div className="text-sm text-muted-foreground">Loading transactions...</div>
      </AppLayout>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food_delivery: "bg-orange-100 text-orange-700 border-orange-200",
      shopping: "bg-blue-100 text-blue-700 border-blue-200",
      subscriptions: "bg-purple-100 text-purple-700 border-purple-200",
      entertainment: "bg-pink-100 text-pink-700 border-pink-200",
      transport: "bg-green-100 text-green-700 border-green-200",
      other: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return colors[category] || colors.other;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "redirected":
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case "blocked":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
    }
  };

  const totalAmount = filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  const totalRedirected = filteredTransactions.reduce(
    (sum, txn) => sum + (txn.redirectedAmount || 0),
    0
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {filteredTransactions.length}
                  </p>
                </div>
                <ArrowUpRight className="w-8 h-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Spent</p>
                  <p className="text-2xl font-bold text-red-600">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </p>
                </div>
                <ArrowUpRight className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Redirected to Savings</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    ₹{totalRedirected.toLocaleString("en-IN")}
                  </p>
                </div>
                <ArrowDownRight className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by merchant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="food_delivery">Food Delivery</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="subscriptions">Subscriptions</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="redirected">Redirected</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transaction List */}
            <div className="space-y-3">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No transactions found</p>
                </div>
              ) : (
                filteredTransactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg border border-slate-200">
                        {getStatusIcon(txn.status)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-slate-900">{txn.merchant}</p>
                          {txn.status === "pending" && (
                            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                              Impulse
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getCategoryColor(txn.category)}`}
                          >
                            {txn.category.replace(/_/g, " ")}
                          </Badge>
                          <span className="text-sm text-slate-500">
                            {new Date(txn.date).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <p className="font-semibold text-slate-900">
                        ₹{txn.amount.toLocaleString("en-IN")}
                      </p>
                      {txn.redirectedAmount && (
                        <p className="text-sm text-emerald-600 font-medium">
                          +₹{txn.redirectedAmount.toLocaleString("en-IN")} saved
                        </p>
                      )}
                      {txn.status === "blocked" && (
                        <p className="text-sm text-red-600 font-medium">Blocked</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
