import { createClient } from "@supabase/supabase-js";

import { Database } from '../types/database.types';

// See: https://vitejs.dev/guide/env-and-mode.html#env-variables

const SupabaseProjectUrl: string = import.meta.env.VITE_SUPABASE_API_URL;
const SupabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY;

const client = createClient<Database>(
  SupabaseProjectUrl,
  SupabaseAnonKey
)

export default client
