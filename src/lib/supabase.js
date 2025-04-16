import { createClient } from '@supabase/supabase-js'

// Define the proper Supabase URL and anon key directly
const supabaseUrl = 'https://yvjegbcywaqisazeodza.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2amVnYmN5d2FxaXNhemVvZHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMTAwODgsImV4cCI6MjA1OTg4NjA4OH0.TvubISDwBZ0GZvuNHTwitcP6cynwz789-iBMQMXF7jU'

export const supabase = createClient(supabaseUrl, supabaseKey)