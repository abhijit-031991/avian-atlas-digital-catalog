-- Create a function to dynamically create device tracking tables
CREATE OR REPLACE FUNCTION create_device_table(device_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create table if it doesn't exist
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS public.device_%s (
      id SERIAL PRIMARY KEY,
      timestamp BIGINT NOT NULL,
      locktime INTEGER NOT NULL,
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL,
      hdop FLOAT NOT NULL,
      count BIGINT NOT NULL,
      satellites INTEGER NOT NULL,
      speed INTEGER NOT NULL,
      activity BOOLEAN NOT NULL,
      ax FLOAT NOT NULL,
      ay FLOAT NOT NULL,
      az FLOAT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    )', device_id);
  
  -- Enable RLS on the table
  EXECUTE format('ALTER TABLE public.device_%s ENABLE ROW LEVEL SECURITY', device_id);
  
  -- Create policy for authenticated users to insert data
  EXECUTE format('
    CREATE POLICY IF NOT EXISTS "Allow authenticated users to insert" 
    ON public.device_%s 
    FOR INSERT 
    WITH CHECK (auth.role() = ''authenticated'')
  ', device_id);
  
  -- Create policy for authenticated users to select data
  EXECUTE format('
    CREATE POLICY IF NOT EXISTS "Allow authenticated users to select" 
    ON public.device_%s 
    FOR SELECT 
    USING (auth.role() = ''authenticated'')
  ', device_id);
  
  -- Create index on timestamp for better query performance
  EXECUTE format('
    CREATE INDEX IF NOT EXISTS idx_device_%s_timestamp 
    ON public.device_%s (timestamp)
  ', device_id, device_id);
  
  -- Create index on created_at for better query performance
  EXECUTE format('
    CREATE INDEX IF NOT EXISTS idx_device_%s_created_at 
    ON public.device_%s (created_at)
  ', device_id, device_id);
END;
$$;