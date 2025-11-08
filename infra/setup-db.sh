#!/bin/bash

# AuthorStack Database Setup Script
# This script helps set up your Supabase database

set -e

echo "🚀 AuthorStack Database Setup"
echo "=============================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Install it with:"
    echo "   npm install -g supabase"
    exit 1
fi

echo "✓ Supabase CLI found"
echo ""

# Get project reference
read -p "Enter your Supabase project reference (from Settings > General): " PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Project reference is required"
    exit 1
fi

echo ""
echo "Linking to project: $PROJECT_REF"
supabase link --project-ref "$PROJECT_REF"

echo ""
echo "Running database migrations..."
supabase db execute < sql/create_tables.sql

echo ""
echo "✅ Database schema created successfully!"
echo ""
echo "Next steps:"
echo "1. Create a test user in Supabase Auth dashboard (test@authorstack.com)"
echo "2. Copy the user UUID"
echo "3. Replace 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' in sql/seed.sql with your UUID"
echo "4. Run: supabase db execute < sql/seed.sql"
echo ""
echo "Or manually run the SQL in the Supabase dashboard:"
echo "1. Go to SQL Editor"
echo "2. Create new query"
echo "3. Paste contents of sql/create_tables.sql"
echo "4. Click Run"
