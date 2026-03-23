import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import PassStatusBadge from "@/components/PassStatusBadge";
import PassTypeBadge from "@/components/PassTypeBadge";
import PrintablePassCard from "@/components/PrintablePassCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Search,
  CheckCircle2,
  XCircle,
  LogIn,
  LogOut,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { Database } from "@/integrations/supabase/types";

type PassStatus = Database["public"]["Enums"]["pass_status"];
type GatePass = Database["public"]["Tables"]["gate_passes"]["Row"];

export default function PassList() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [printPass, setPrintPass] = useState<GatePass | null>(null);

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

  // 🔥 Optimized Filtering
  const filtered = useMemo(() => {
    return passes.filter((p) => {
      const s = search.toLowerCase();
      const matchSearch =
        p.person_name.toLowerCase().includes(s) ||
        p.pass_number.toLowerCase().includes(s) ||
        p.purpose.toLowerCase().includes(s);

      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchType = typeFilter === "all" || p.pass_type === typeFilter;

      return matchSearch && matchStatus && matchType;
    });
  }, [passes, search, statusFilter, typeFilter]);

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<GatePass>;
    }) => {
      const { error } = await supabase
        .from("gate_passes")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gate-passes"] });
      toast.success("Updated successfully");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleAction = (pass: GatePass, action: string) => {
    const updates: Partial<GatePass> = {};

    if (action === "approve") updates.status = "active";
    if (action === "reject") updates.status = "rejected";
    if (action === "checkin")
      updates.checked_in_at = new Date().toISOString();
    if (action === "checkout") {
      updates.checked_out_at = new Date().toISOString();
      updates.status = "expired";
    }

    updateMutation.mutate({ id: pass.id, updates });
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6 print:hidden">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Gate Pass Management</h1>
          <p className="text-sm text-muted-foreground">
            Search, filter, and manage all passes
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search passes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="visitor">Visitor</SelectItem>
              <SelectItem value="material">Material</SelectItem>
              <SelectItem value="employee">Employee</SelectItem>
              <SelectItem value="event">Event</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border rounded-xl overflow-hidden"
        >
          {isLoading ? (
            <div className="p-4 space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-14 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              No results found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/60 backdrop-blur">
                  <tr>
                    <th className="px-4 py-3 text-left">Pass #</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Purpose</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Created</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((pass) => (
                    <tr
                      key={pass.id}
                      className="border-b hover:bg-muted/40 transition"
                    >
                      <td className="px-4 py-3 text-xs font-mono">
                        {pass.pass_number}
                      </td>

                      <td className="px-4 py-3">
                        <PassTypeBadge type={pass.pass_type} />
                      </td>

                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">
                            {pass.person_name}
                          </p>
                          {pass.person_company && (
                            <p className="text-xs text-muted-foreground">
                              {pass.person_company}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-muted-foreground truncate max-w-[220px]">
                        {pass.purpose}
                      </td>

                      <td className="px-4 py-3">
                        <PassStatusBadge status={pass.status} />
                      </td>

                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {format(
                          new Date(pass.created_at),
                          "MMM d, h:mm a"
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPrintPass(pass)}
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </Button>

                          {pass.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleAction(pass, "approve")
                                }
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleAction(pass, "reject")
                                }
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}

                          {pass.status === "active" &&
                            !pass.checked_in_at && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleAction(pass, "checkin")
                                }
                              >
                                <LogIn className="w-3.5 h-3.5" />
                              </Button>
                            )}

                          {pass.status === "active" &&
                            pass.checked_in_at &&
                            !pass.checked_out_at && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleAction(pass, "checkout")
                                }
                              >
                                <LogOut className="w-3.5 h-3.5" />
                              </Button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {printPass && (
        <PrintablePassCard
          pass={printPass}
          onClose={() => setPrintPass(null)}
        />
      )}
    </AppLayout>
  );
}