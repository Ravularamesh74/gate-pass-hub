import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Plus,
  List,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/passes", label: "All Passes", icon: List },
  { to: "/create", label: "New Pass", icon: Plus },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch {
      toast.error("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* SIDEBAR */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        className="hidden md:flex flex-col bg-sidebar border-r border-sidebar-border transition-all"
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!collapsed && <span className="font-semibold text-lg">GatePass</span>}
          </div>

          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-white shadow"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="p-3 border-t">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full hover:bg-muted transition"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && (loading ? "Signing out..." : "Sign Out")}
          </button>
        </div>
      </motion.aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="flex items-center justify-between px-4 py-3 border-b bg-card sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X /> : <Menu />}
            </Button>

            <span className="font-semibold">Dashboard</span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground hidden sm:block">
              Welcome back 👋
            </div>
            <div className="w-9 h-9 rounded-full bg-muted" />
          </div>
        </header>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="md:hidden border-b bg-card px-4 py-2 space-y-1 overflow-hidden"
            >
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full hover:bg-muted"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </motion.nav>
          )}
        </AnimatePresence>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}