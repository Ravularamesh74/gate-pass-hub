import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import PassStatusBadge from "@/components/PassStatusBadge";
import PassTypeBadge from "@/components/PassTypeBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Search, CheckCircle2, XCircle, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type PassStatus = Database["public"]["Enums"]["pass_status"];
type GatePass = Database["public"]["Tables"]["gate_passes"]["Row"];

export default function PassList() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: passes = [], isLoading } = useQuery({
    queryKey: ["gate-passes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gate_passes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<GatePass> }) => {
      const { error } = await supabase.from("gate_passes").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gate-passes"] });
      toast.success("Pass updated!");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const filtered = passes.filter((p) => {
    const matchSearch = p.person_name.toLowerCase().includes(search.toLowerCase()) ||
      p.pass_number.toLowerCase().includes(search.toLowerCase()) ||
      p.purpose.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchType = typeFilter === "all" || p.pass_type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const handleAction = (pass: GatePass, action: "approve" | "reject" | "checkin" | "checkout") => {
    const updates: Partial<GatePass> = {};
    switch (action) {
      case "approve": updates.status = "active" as PassStatus; break;
      case "reject": updates.status = "rejected" as PassStatus; break;
      case "checkin": updates.checked_in_at = new Date().toISOString(); break;
      case "checkout": updates.checked_out_at = new Date().toISOString(); updates.status = "expired" as PassStatus; break;
    }
    updateMutation.mutate({ id: pass.id, updates });
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">All Gate Passes</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, pass number, or purpose..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="visitor">Visitor</SelectItem>
              <SelectItem value="material">Material</SelectItem>
              <SelectItem value="employee">Employee</SelectItem>
              <SelectItem value="event">Event</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-card rounded-xl border animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card rounded-xl border p-12 text-center">
            <p className="text-muted-foreground">No passes found</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-secondary/50">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Pass #</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Purpose</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Created</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((pass) => (
                    <tr key={pass.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 pass-number text-xs">{pass.pass_number}</td>
                      <td className="px-4 py-3"><PassTypeBadge type={pass.pass_type} /></td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-medium">{pass.person_name}</span>
                          {pass.person_company && (
                            <span className="text-muted-foreground text-xs block">{pass.person_company}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground truncate max-w-[200px]">{pass.purpose}</td>
                      <td className="px-4 py-3"><PassStatusBadge status={pass.status} /></td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{format(new Date(pass.created_at), "MMM d, h:mm a")}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {pass.status === "pending" && (
                            <>
                              <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs text-success" onClick={() => handleAction(pass, "approve")}>
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs text-destructive" onClick={() => handleAction(pass, "reject")}>
                                <XCircle className="w-3.5 h-3.5" /> Reject
                              </Button>
                            </>
                          )}
                          {pass.status === "active" && !pass.checked_in_at && (
                            <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={() => handleAction(pass, "checkin")}>
                              <LogIn className="w-3.5 h-3.5" /> Check In
                            </Button>
                          )}
                          {pass.status === "active" && pass.checked_in_at && !pass.checked_out_at && (
                            <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={() => handleAction(pass, "checkout")}>
                              <LogOut className="w-3.5 h-3.5" /> Check Out
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
