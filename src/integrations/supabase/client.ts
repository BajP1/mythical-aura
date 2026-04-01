import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://czjrlnpckeeejakcumkb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_33_eOfn-vj0VuWisiaWE1A_wGRlUMqK";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
