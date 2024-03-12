import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
	'https://bevngzdbybykcvnllodu.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJldm5nemRieWJ5a2N2bmxsb2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg0NTA4MzEsImV4cCI6MjAyNDAyNjgzMX0.mF2f5ORQC4HCBxyn0xPv3SStoN4FenEYmvhlDJbjJ7I'
)
