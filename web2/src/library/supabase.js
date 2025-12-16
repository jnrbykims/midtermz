import {createClient} from '@supabase/supabase-js'
const supabase = createClient(
   "https://afcvwreakmuymrequfcx.supabase.co",
   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmY3Z3cmVha211eW1yZXF1ZmN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NzIxMDAsImV4cCI6MjA3OTM0ODEwMH0._vtUgkCC4zTzhyyuXBTLwakDZLHlSjoHfDkZb7J24uU"
)

export { supabase }
