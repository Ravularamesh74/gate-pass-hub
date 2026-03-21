
CREATE TYPE public.pass_type AS ENUM ('visitor', 'material', 'employee', 'event');
CREATE TYPE public.pass_status AS ENUM ('pending', 'active', 'expired', 'rejected');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE SEQUENCE public.pass_number_seq START 1001;

CREATE TABLE public.gate_passes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pass_number TEXT NOT NULL DEFAULT 'GP-' || nextval('public.pass_number_seq')::text,
  pass_type pass_type NOT NULL,
  status pass_status NOT NULL DEFAULT 'pending',
  person_name TEXT NOT NULL,
  person_contact TEXT,
  person_company TEXT,
  person_id_type TEXT,
  person_id_number TEXT,
  purpose TEXT NOT NULL,
  department TEXT,
  host_name TEXT,
  material_description TEXT,
  vehicle_number TEXT,
  event_name TEXT,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '8 hours'),
  checked_in_at TIMESTAMP WITH TIME ZONE,
  checked_out_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gate_passes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all passes"
  ON public.gate_passes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create passes"
  ON public.gate_passes FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update passes"
  ON public.gate_passes FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete passes"
  ON public.gate_passes FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_gate_passes_updated_at
  BEFORE UPDATE ON public.gate_passes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_gate_passes_status ON public.gate_passes(status);
CREATE INDEX idx_gate_passes_type ON public.gate_passes(pass_type);
CREATE INDEX idx_gate_passes_created_at ON public.gate_passes(created_at DESC);
