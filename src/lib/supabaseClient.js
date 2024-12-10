// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_DATABASE_URL = "https://awadpdwwqabknvxoqgwa.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3YWRwZHd3cWFia252eG9xZ3dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4MjM4MDMsImV4cCI6MjA0OTM5OTgwM30.rMp0lZeHGL-7g_vv3UusNo_0SCscddJPtoxhiFC3pKU";

// Créez et exportez l'instance du client Supabase
export const supabase = createClient(SUPABASE_DATABASE_URL, SUPABASE_ANON_KEY);
