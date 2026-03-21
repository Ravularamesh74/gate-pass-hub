import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";
import { Shield, X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import PassTypeBadge from "@/components/PassTypeBadge";
import type { Database } from "@/integrations/supabase/types";

type GatePass = Database["public"]["Tables"]["gate_passes"]["Row"];

interface Props {
  pass: GatePass;
  onClose: () => void;
}

export default function PrintablePassCard({ pass, onClose }: Props) {
  const handlePrint = () => window.print();

  const qrData = JSON.stringify({
    id: pass.id,
    pass_number: pass.pass_number,
    name: pass.person_name,
    type: pass.pass_type,
    valid_until: pass.valid_until,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm print:bg-transparent print:backdrop-blur-none">
      {/* Screen-only controls */}
      <div className="absolute top-4 right-4 flex gap-2 print:hidden">
        <Button variant="outline" className="gap-2 bg-card" onClick={handlePrint}>
          <Printer className="w-4 h-4" /> Print
        </Button>
        <Button variant="ghost" size="icon" className="bg-card" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Pass Card */}
      <div className="bg-card w-[400px] rounded-2xl border shadow-2xl overflow-hidden print:shadow-none print:border print:rounded-xl print:w-[380px] print:mx-auto">
        {/* Header band */}
        <div className="bg-primary px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary-foreground leading-tight">Gate Pass</h2>
            <p className="text-primary-foreground/70 text-xs">Facility Access Authorization</p>
          </div>
        </div>

        {/* Pass number + type */}
        <div className="px-6 py-4 flex items-center justify-between border-b">
          <span className="pass-number text-sm font-semibold">{pass.pass_number}</span>
          <PassTypeBadge type={pass.pass_type} />
        </div>

        {/* Details */}
        <div className="px-6 py-4 space-y-3 text-sm">
          <Row label="Name" value={pass.person_name} bold />
          {pass.person_company && <Row label="Company" value={pass.person_company} />}
          {pass.person_contact && <Row label="Contact" value={pass.person_contact} />}
          <Row label="Purpose" value={pass.purpose} />
          {pass.department && <Row label="Department" value={pass.department} />}
          {pass.host_name && <Row label="Host" value={pass.host_name} />}
          {pass.vehicle_number && <Row label="Vehicle" value={pass.vehicle_number} />}
          {pass.event_name && <Row label="Event" value={pass.event_name} />}
          {pass.material_description && <Row label="Material" value={pass.material_description} />}

          <div className="pt-2 border-t flex justify-between text-xs text-muted-foreground">
            <span>From: {format(new Date(pass.valid_from), "MMM d, h:mm a")}</span>
            <span>Until: {format(new Date(pass.valid_until), "MMM d, h:mm a")}</span>
          </div>
        </div>

        {/* QR Code */}
        <div className="px-6 pb-6 flex flex-col items-center gap-2">
          <div className="p-3 bg-card border rounded-xl">
            <QRCodeSVG value={qrData} size={120} level="M" />
          </div>
          <p className="text-[10px] text-muted-foreground">Scan to verify pass authenticity</p>
        </div>

        {/* Footer */}
        <div className="bg-secondary/50 px-6 py-3 text-center">
          <p className="text-[10px] text-muted-foreground">
            This pass must be displayed at all times while on premises. Valid only for the date and time shown above.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={`text-right ${bold ? "font-semibold" : ""}`}>{value}</span>
    </div>
  );
}
