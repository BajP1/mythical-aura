import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://czjrlnpckeeejakcumkb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6anJsbnBja2VlZWpha2N1bWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTU3NzIsImV4cCI6MjA5MDYzMTc3Mn0.Crm8AMmEfCi-McOiX6PNwTU1qAmZ8TLYXRATZzHQmuA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
