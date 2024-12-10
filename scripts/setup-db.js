import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = join(__dirname, '..', '.env');
const env = readFileSync(envPath, 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) acc[key.trim()] = value.trim();
    return acc;
  }, {});

const supabaseUrl = env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Load schema SQL
const schemaPath = join(__dirname, '..', 'src', 'lib', 'db', 'schema.sql');
const schemaSql = readFileSync(schemaPath, 'utf8');

async function setupDatabase() {
  try {
    // Execute schema SQL directly
    const { data, error } = await supabase
      .from('clubs')
      .select()
      .limit(1);

    if (error) {
      // Run schema SQL in Supabase SQL editor
      console.error('Please run the schema.sql file in your Supabase SQL editor');
      console.error('Schema file location:', schemaPath);
      process.exit(1);
    }

    console.log('Database schema verified successfully');

    // Check for KDA club
    const { data: kda, error: kdaError } = await supabase
      .from('clubs')
      .select()
      .eq('id', 1)
      .single();

    if (kdaError && kdaError.code !== 'PGRST116') {
      throw kdaError;
    }

    // Insert KDA club if it doesn't exist
    if (!kda) {
      const { error: insertError } = await supabase
        .from('clubs')
        .insert({
          id: 1,
          name: 'KDA Sporting Club',
          logo: '/kda.jpg',
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goals_for: 0,
          goals_against: 0,
          points: 0
        });

      if (insertError) throw insertError;
      console.log('KDA club created successfully');
    } else {
      console.log('KDA club already exists');
    }

  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();