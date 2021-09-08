

import { createClient } from '@supabase/supabase-js'


let url = process.env.REACT_APP_SUPABASE_URL;
let urlFormatada = url.replace("'", "")
let urlFormatada2 = urlFormatada.replace("';", "")

let key = process.env.REACT_APP_SUPABASE_KEY;
let keyFormatada = key.replace("'", "")
let keyFormatada2 = keyFormatada.replace("';", "")


const supabaseUrl = urlFormatada2;
const supabaseAnonKey = keyFormatada2;

export const supabase = createClient(supabaseUrl, supabaseAnonKey)