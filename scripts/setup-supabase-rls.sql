-- Enable RLS on feedback table
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon or authenticated) to SELECT all feedback
CREATE POLICY "Allow public select feedback" ON feedback
  FOR SELECT
  USING (true);

-- Allow anyone to INSERT feedback (no auth required)
CREATE POLICY "Allow public insert feedback" ON feedback
  FOR INSERT
  WITH CHECK (true);

-- Optional: Prevent UPDATE/DELETE for security
CREATE POLICY "No updates" ON feedback
  FOR UPDATE
  USING (false);

CREATE POLICY "No deletes" ON feedback
  FOR DELETE
  USING (false);
