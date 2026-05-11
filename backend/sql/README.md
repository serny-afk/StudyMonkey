# SQL Schema

`001_init.sql` is the first manual schema file for StudyMonkey.

## What It Creates

- `users`
- `characters`
- `quest_sessions`
- an `updated_at` trigger function used by all three tables

The `users` table stores:

- `email` for authentication/login
- `username` for frontend display

## Why `last_resumed_at` Exists

The MVP supports pause and resume. To calculate actual study time on the backend without a separate pause-history table, `quest_sessions` stores:

- `started_at` for the first time a quest starts
- `last_resumed_at` for the beginning of the current active segment
- `actual_duration_seconds` for accumulated completed study time so far

That keeps the schema simple while still supporting:

- start
- pause
- resume
- complete
- end early / cancel

## How To Apply It

For now, use the Supabase SQL Editor:

1. Open the SQL Editor in your Supabase project
2. Paste the contents of `001_init.sql`
3. Run the query
4. Confirm the tables appear in the public schema

If you are resetting your dev database, drop the existing tables first and then rerun `001_init.sql`.
