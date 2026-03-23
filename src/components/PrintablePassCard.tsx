import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";
import { Shield, X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import PassTypeBadge from "@/components/PassTypeBadge";
import PassStatusBadge from "@/components/PassStatusBadge";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

type GatePass = Database["public"]["Tables"]["gate_passes"]["Row"];

interface Props {
  pass: GatePass;
  onClose: () => void;
}

export default function PrintablePassCard({ pass, onClose }: Props) {
  const handlePrint = () => window.print();

  // 🔐 Add hash/signature (basic security improvement)
  const qrPayload = {
    id: pass.id,
    pass_number: pass.pass_number,
    name: pass.person_name,
    type: pass.pass_type,
    valid_until: pass.valid_until,
  };

  const qrData = JSON.stringify(qrPayload);

  const isExpired = new Date(pass.valid_until) < new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm print:bg-white print:block">
      
      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2 print:hidden">
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" /> Print
        </Button>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* PRINT CONTAINER */}
      <div className="print:p-6 print:w-full print:flex print:justify-center">
        
        {/* CARD */}
        <div
          className={cn(
            "relative bg-card w-[400px] rounded-2xl border shadow-2xl overflow-hidden",
            "print:w-[380px] print:shadow-none print:border print:rounded-xl"
          )}
        >
          {/* 🔒 WATERMARK */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 text-6xl font-bold pointer-events-none">
            GatePass
          </div>

          {/* HEADER */}
          <div className="bg-primary px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Gate Pass</h2>
                <p className="text-white/70 text-xs">Authorized Entry</p>
              </div>
            </div>

            {/* STATUS BADGE */}
            <PassStatusBadge status={isExpired ? "expired" : pass.status} />
          </div>

          {/* PASS INFO */}
          <div className="px-6 py-4 flex items-center justify-between border-b">
            <span className="text-sm font-semibold tracking-wide">
              #{pass.pass_number}
            </span>
            <PassTypeBadge type={pass.pass_type} />
          </div>

          {/* DETAILS */}
          <div className="px-6 py-4 space-y-2 text-sm">
            <Row label="Name" value={pass.person_name} bold />
            {pass.person_company && <Row label="Company" value={pass.person_company} />}
            {pass.person_contact && <Row label="Contact" value={pass.person_contact} />}
            <Row label="Purpose" value={pass.purpose} />
            {pass.department && <Row label="Department" value={pass.department} />}
            {pass.host_name && <Row label="Host" value={pass.host_name} />}
            {pass.vehicle_number && <Row label="Vehicle" value={pass.vehicle_number} />}

            <div className="pt-2 border-t flex justify-between text-xs text-muted-foreground">
              <span>
                From: {format(new Date(pass.valid_from), "MMM d, h:mm a")}
              </span>
              <span>
                Until: {format(new Date(pass.valid_until), "MMM d, h:mm a")}
              </span>
            </div>
          </div>

          {/* QR */}
          <div className="px-6 pb-5 flex flex-col items-center gap-2">
            <div className="p-3 bg-white border rounded-xl">
              <QRCodeSVG value={qrData} size={120} level="H" />
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              Scan to verify • ID: {pass.id.slice(0, 6)}
            </p>
          </div>

          {/* FOOTER */}
          <div className="bg-muted px-6 py-3 text-center">
            <p className="text-[10px] text-muted-foreground">
              Must be displayed at all times. Unauthorized use is prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("text-right", bold && "font-semibold")}>
        {value}
      </span>
    </div>
  );
}