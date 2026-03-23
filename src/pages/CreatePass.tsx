import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { Database } from "@/integrations/supabase/types";

type PassType = Database["public"]["Enums"]["pass_type"];

export default function CreatePass() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [passType, setPassType] = useState<PassType>("visitor");
  const [step, setStep] = useState(1);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const payload: any = {
        pass_type: passType,
        person_name: formData.get("person_name"),
        person_contact: formData.get("person_contact") || null,
        person_company: formData.get("person_company") || null,
        purpose: formData.get("purpose"),
        department: formData.get("department") || null,
        host_name: formData.get("host_name") || null,
        vehicle_number: formData.get("vehicle_number") || null,
        notes: formData.get("notes") || null,
      };

      if (passType === "material") {
        payload.material_description =
          formData.get("material_description") || null;
      }

      if (passType === "event") {
        payload.event_name = formData.get("event_name") || null;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) payload.created_by = user.id;

      const { error } = await supabase.from("gate_passes").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gate-passes"] });
      toast.success("Gate pass created successfully");
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
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Create Gate Pass</h1>
          <p className="text-muted-foreground text-sm">
            Fill details and issue a new pass
          </p>
        </div>

        {/* STEP INDICATOR */}
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full ${
                step >= s ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* STEP 1 */}
            {step === 1 && (
              <div className="bg-card border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold">Pass Type</h3>

                <Select
                  value={passType}
                  onValueChange={(v) => setPassType(v as PassType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visitor">Visitor</SelectItem>
                    <SelectItem value="material">Material</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={() => setStep(2)} type="button">
                  Next →
                </Button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="bg-card border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold">Person Details</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input name="person_name" placeholder="Full Name *" required />
                  <Input name="person_contact" placeholder="Contact" />
                  <Input name="person_company" placeholder="Company" />
                  <Input name="vehicle_number" placeholder="Vehicle Number" />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    ← Back
                  </Button>
                  <Button onClick={() => setStep(3)} type="button">
                    Next →
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="bg-card border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold">Visit Details</h3>

                <Input name="purpose" placeholder="Purpose *" required />
                <Input name="department" placeholder="Department" />
                <Input name="host_name" placeholder="Host Person" />

                {passType === "material" && (
                  <Textarea
                    name="material_description"
                    placeholder="Material Description"
                  />
                )}

                {passType === "event" && (
                  <Input name="event_name" placeholder="Event Name" />
                )}

                <Textarea name="notes" placeholder="Notes..." />

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    ← Back
                  </Button>

                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending
                      ? "Creating..."
                      : "Create Pass 🚀"}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </form>
      </div>
    </AppLayout>
  );
}