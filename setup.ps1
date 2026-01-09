# Quick Setup Script for Windows

Write-Host "🚀 Setting up Siksha AI..." -ForegroundColor Cyan

# Install frontend dependencies
Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Yellow
npm install

# Install backend dependencies
Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "`n📝 Creating backend .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Created .env file - IMPORTANT: Add your OpenAI API key!" -ForegroundColor Green
} else {
    Write-Host "`n✅ .env file already exists" -ForegroundColor Green
}

Set-Location ..

Write-Host "`n✨ Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Add your OpenAI API key to backend/.env"
Write-Host "2. Run: npm run backend (in one terminal)"
Write-Host "3. Run: npm start (in another terminal)"
Write-Host "`n🎓 Happy learning!" -ForegroundColor Cyan
