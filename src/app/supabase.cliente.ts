import {createClient, SupabaseClient} from '@supabase/supabase-js';
const supabaseUrl='';
const supabasePass='';
export const supabase=createClient(supabaseUrl, supabasePass)