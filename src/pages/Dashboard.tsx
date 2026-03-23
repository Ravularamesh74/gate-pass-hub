import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import PassStatusBadge from "@/components/PassStatusBadge";
import PassTypeBadge from "@/components/PassTypeBadge";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();

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

  const recentPasses = passes.slice(0, 6);

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Monitor and manage all gate passes
            </p>
          </div>

          <Button onClick={() => navigate("/create")} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Pass
          </Button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Passes"
            value={stats.total}
            icon={ClipboardList}
            onClick={() => navigate("/passes")}
          />
          <StatCard
            label="Active"
            value={stats.active}
            icon={CheckCircle2}
            variant="success"
          />
          <StatCard
            label="Pending"
            value={stats.pending}
            icon={Clock}
            variant="warning"
          />
          <StatCard
            label="Expired"
            value={stats.expired}
            icon={XCircle}
            variant="danger"
          />
        </div>

        {/* RECENT TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">Recent Passes</h2>
            <Link
              to="/passes"
              className="text-sm text-primary hover:underline"
            >
              View all →
            </Link>
          </div>

          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-muted animate-pulse rounded"
                />
              ))}
            </div>
          ) : recentPasses.length === 0 ? (
            <div className="p-10 text-center">
              <ClipboardList className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No passes created yet</p>
              <Button
                onClick={() => navigate("/create")}
                className="mt-4"
              >
                Create Pass
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 text-muted-foreground text-xs uppercase">
                    <th className="px-4 py-3 text-left">Pass #</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Purpose</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Created</th>
                  </tr>
                </thead>

                <tbody>
                  {recentPasses.map((pass) => (
                    <tr
                      key={pass.id}
                      onClick={() => navigate(`/passes/${pass.id}`)}
                      className="border-b last:border-0 hover:bg-muted/40 cursor-pointer transition"
                    >
                      <td className="px-4 py-3 text-xs font-mono">
                        {pass.pass_number}
                      </td>

                      <td className="px-4 py-3">
                        <PassTypeBadge type={pass.pass_type} />
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {pass.person_name}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground truncate max-w-[200px]">
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}