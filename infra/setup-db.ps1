# AuthorStack Database Setup Script (PowerShell)
# This script helps set up your Supabase database on Windows

Write-Host "🚀 AuthorStack Database Setup" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""

# Check if Supabase CLI is installed
$supabaseCmd = Get-Command supabase -ErrorAction SilentlyContinue

if (-not $supabaseCmd) {
    Write-Host "❌ Supabase CLI not found. Install it with:" -ForegroundColor Red
    Write-Host "   npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Supabase CLI found" -ForegroundColor Green
Write-Host ""

# Get project reference
$projectRef = Read-Host "Enter your Supabase project reference (from Settings > General)"

if ([string]::IsNullOrWhiteSpace($projectRef)) {
    Write-Host "❌ Project reference is required" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Linking to project: $projectRef" -ForegroundColor Cyan
supabase link --project-ref $projectRef

Write-Host ""
Write-Host "Running database migrations..." -ForegroundColor Cyan

# Run the SQL file
$sqlPath = Join-Path $PSScriptRoot "sql\create_tables.sql"
$sqlContent = Get-Content $sqlPath -Raw

# Execute via supabase CLI
supabase db execute $sqlContent

Write-Host ""
Write-Host "✅ Database schema created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create a test user in Supabase Auth dashboard (test@authorstack.com)"
Write-Host "2. Copy the user UUID"
Write-Host "3. Replace 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' in sql\seed.sql with your UUID"
Write-Host "4. Run: supabase db execute < sql\seed.sql"
Write-Host ""
Write-Host "Or manually run the SQL in the Supabase dashboard:" -ForegroundColor Cyan
Write-Host "1. Go to SQL Editor"
Write-Host "2. Create new query"
Write-Host "3. Paste contents of sql\create_tables.sql"
Write-Host "4. Click Run"
