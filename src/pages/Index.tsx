import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Auth from "./Auth";
import { motion } from "framer-motion";

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const handleSession = (session: any) => {
      if (!isMounted) return;

      if (session) {
        const redirectTo =
          (location.state as any)?.from || "/dashboard";
        navigate(redirectTo, { replace: true });
      }

      setLoading(false);
      setChecked(true);
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.state]);

  // 🔥 Premium Loader
  if (loading || !checked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
        />
        <p className="text-sm text-muted-foreground mt-4">
          Checking authentication...
        </p>
      </div>
    );
  }

  return <Auth />;
}