-- Short-lived export drafts shared across serverless instances (PDF + browser print).

CREATE TABLE IF NOT EXISTS public.export_drafts (
  token uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('cv', 'cover-letter')),
  payload jsonb NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS export_drafts_expires_at_idx ON public.export_drafts (expires_at);
CREATE INDEX IF NOT EXISTS export_drafts_user_id_idx ON public.export_drafts (user_id);

ALTER TABLE public.export_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY export_drafts_select_own ON public.export_drafts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY export_drafts_insert_own ON public.export_drafts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY export_drafts_delete_own ON public.export_drafts
  FOR DELETE USING (auth.uid() = user_id);
