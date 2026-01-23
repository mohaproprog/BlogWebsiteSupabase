import { createClient } from "@supabase/supabase-js"

const supabaseUrl ="https://yewqfzhppexetheyjctm.supabase.co"
const  supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlld3FmemhwcGV4ZXRoZXlqY3RtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTg5NTU5NCwiZXhwIjoyMDgxNDcxNTk0fQ.MYg_Iupe-uM47sHq-TORgh8tHPKpXxopyVOf55gLt3U"
export const supabase = createClient(supabaseUrl, supabaseKey)