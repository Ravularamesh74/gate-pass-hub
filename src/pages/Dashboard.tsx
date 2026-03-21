import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ClipboardList, Clock, CheckCircle2, XCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import PassStatusBadge from "@/components/PassStatusBadge";
import PassTypeBadge from "@/components/PassTypeBadge";
import { format } from "date-fns";

export default function Dashboard() {
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

  const stats = {
    total: passes.length,
    active: passes.filter((p) => p.status === "active").length,
    pending: passes.filter((p) => p.status === "pending").length,
    expired: passes.filter((p) => p.status === "expired").length,
  };

  const recentPasses = passes.slice(0, 8);

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Overview of all gate passes</p>
          </div>
          <Link to="/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Pass
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Passes" value={stats.total} icon={ClipboardList} />
          <StatCard label="Active" value={stats.active} icon={CheckCircle2} />
          <StatCard label="Pending" value={stats.pending} icon={Clock} />
          <StatCard label="Expired" value={stats.expired} icon={XCircle} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Passes</h2>
            <Link to="/passes" className="text-sm text-primary font-medium hover:underline">
              View all →
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-card rounded-xl border animate-pulse" />
              ))}
            </div>
          ) : recentPasses.length === 0 ? (
            <div className="bg-card rounded-xl border p-12 text-center">
              <ClipboardList className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No passes yet</p>
              <Link to="/create">
                <Button variant="outline" className="mt-4 gap-2">
                  <Plus className="w-4 h-4" />
                  Create your first pass
                </Button>
              </Link>
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
                    </tr>
                  </thead>
                  <tbody>
                    {recentPasses.map((pass) => (
                      <tr key={pass.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 pass-number text-xs">{pass.pass_number}</td>
                        <td className="px-4 py-3"><PassTypeBadge type={pass.pass_type} /></td>
                        <td className="px-4 py-3 font-medium">{pass.person_name}</td>
                        <td className="px-4 py-3 text-muted-foreground truncate max-w-[200px]">{pass.purpose}</td>
                        <td className="px-4 py-3"><PassStatusBadge status={pass.status} /></td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{format(new Date(pass.created_at), "MMM d, h:mm a")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
