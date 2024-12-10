# KDA Sporting Club Website

## Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `src/lib/db/schema.sql`
4. Paste and run the SQL in the editor
5. Create a `.env` file with your Supabase credentials:

```env
PUBLIC_SUPABASE_URL=your-project-url
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Development

```bash
npm install
npm run dev
```

The site will be available at http://localhost:4321