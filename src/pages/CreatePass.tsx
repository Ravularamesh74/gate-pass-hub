import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type PassType = Database["public"]["Enums"]["pass_type"];

export default function CreatePass() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [passType, setPassType] = useState<PassType>("visitor");

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const payload: any = {
        pass_type: passType,
        person_name: formData.get("person_name") as string,
        person_contact: formData.get("person_contact") as string || null,
        person_company: formData.get("person_company") as string || null,
        purpose: formData.get("purpose") as string,
        department: formData.get("department") as string || null,
        host_name: formData.get("host_name") as string || null,
        vehicle_number: formData.get("vehicle_number") as string || null,
        notes: formData.get("notes") as string || null,
      };

      if (passType === "material") {
        payload.material_description = formData.get("material_description") as string || null;
      }
      if (passType === "event") {
        payload.event_name = formData.get("event_name") as string || null;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) payload.created_by = user.id;

      const { error } = await supabase.from("gate_passes").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gate-passes"] });
      toast.success("Gate pass created successfully!");
      navigate("/passes");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(new FormData(e.currentTarget));
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Create Gate Pass</h1>
        <p className="text-muted-foreground text-sm mb-6">Fill in the details to issue a new gate pass</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-xl border p-6 space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Pass Type</h3>
            <Select value={passType} onValueChange={(v) => setPassType(v as PassType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="visitor">Visitor</SelectItem>
                <SelectItem value="material">Material</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-card rounded-xl border p-6 space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Person Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="person_name">Full Name *</Label>
                <Input id="person_name" name="person_name" required placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="person_contact">Contact Number</Label>
                <Input id="person_contact" name="person_contact" placeholder="Phone number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="person_company">Company / Organization</Label>
                <Input id="person_company" name="person_company" placeholder="Company name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle_number">Vehicle Number</Label>
                <Input id="vehicle_number" name="vehicle_number" placeholder="e.g. MH-12-AB-1234" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border p-6 space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Visit Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="purpose">Purpose of Visit *</Label>
                <Input id="purpose" name="purpose" required placeholder="State the purpose" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" name="department" placeholder="Department to visit" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="host_name">Host / Contact Person</Label>
                <Input id="host_name" name="host_name" placeholder="Person to meet" />
              </div>
            </div>

            {passType === "material" && (
              <div className="space-y-2">
                <Label htmlFor="material_description">Material Description</Label>
                <Textarea id="material_description" name="material_description" placeholder="Describe the materials being transported" />
              </div>
            )}

            {passType === "event" && (
              <div className="space-y-2">
                <Label htmlFor="event_name">Event Name</Label>
                <Input id="event_name" name="event_name" placeholder="Name of the event" />
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl border p-6 space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Additional Notes</h3>
            <Textarea name="notes" placeholder="Any special instructions or remarks..." />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create Pass"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
