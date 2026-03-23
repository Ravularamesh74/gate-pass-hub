import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-md w-full space-y-6">
        
        {/* Animated 404 */}
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl font-extrabold tracking-tight"
        >
          404
        </motion.h1>

        {/* Message */}
        <div>
          <p className="text-lg font-medium">Page not found</p>
          <p className="text-sm text-muted-foreground mt-1">
            The page you’re looking for doesn’t exist or was moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>

          <Button
            onClick={() => navigate("/dashboard")}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Button>
        </div>

        {/* Optional search hint */}
        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          <Search className="w-3 h-3" />
          Try checking the URL or go back to safety
        </div>

        {/* Route info (debug-friendly) */}
        <p className="text-[10px] text-muted-foreground">
          Path: {location.pathname}
        </p>
      </div>
    </div>
  );
}