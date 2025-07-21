# SOFIA Meta Service - Authentication Test Script

$baseUrl = "http://localhost:9000/api/v1"

Write-Host "🧪 Testing SOFIA Meta Service Authentication" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

# Test health endpoint (public)
Write-Host ""
Write-Host "🔍 Testing health endpoint..." -ForegroundColor Green
try {
    $healthResponse = Invoke-RestMethod -Uri "$baseUrl/auth/health" -Method GET
    Write-Host "✅ Health check passed" -ForegroundColor Green
    $healthResponse | ConvertTo-Json
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test applications endpoint (public)
Write-Host ""
Write-Host "🔍 Testing applications endpoint..." -ForegroundColor Green
try {
    $appsResponse = Invoke-RestMethod -Uri "$baseUrl/auth/applications" -Method GET
    Write-Host "✅ Applications endpoint passed" -ForegroundColor Green
    $appsResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Applications endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test login with admin user
Write-Host ""
Write-Host "🔐 Testing login with admin user..." -ForegroundColor Green

$loginData = @{
    username = "admin"
    password = "admin123"
    appCode = "META-SERVICE"
} | ConvertTo-Json

$headers = @{
    'Content-Type' = 'application/json'
}

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -Headers $headers
    Write-Host "✅ Login successful" -ForegroundColor Green
    
    $accessToken = $loginResponse.data.accessToken
    Write-Host "🎫 Access Token (first 50 chars): $($accessToken.Substring(0, [Math]::Min(50, $accessToken.Length)))..." -ForegroundColor Blue
    
    # Test profile endpoint with token
    Write-Host ""
    Write-Host "👤 Testing profile endpoint with token..." -ForegroundColor Green
    
    $authHeaders = @{
        'Authorization' = "Bearer $accessToken"
        'Content-Type' = 'application/json'
    }
    
    try {
        $profileResponse = Invoke-RestMethod -Uri "$baseUrl/auth/profile" -Method GET -Headers $authHeaders
        Write-Host "✅ Profile endpoint passed" -ForegroundColor Green
        $profileResponse | ConvertTo-Json -Depth 3
    } catch {
        Write-Host "❌ Profile endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Yellow
    }
}

# Test logout
if ($accessToken) {
    Write-Host ""
    Write-Host "🚪 Testing logout..." -ForegroundColor Green
    
    try {
        $logoutResponse = Invoke-RestMethod -Uri "$baseUrl/auth/logout" -Method POST -Headers $authHeaders
        Write-Host "✅ Logout successful" -ForegroundColor Green
        $logoutResponse | ConvertTo-Json
    } catch {
        Write-Host "❌ Logout failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 Authentication testing completed!" -ForegroundColor Cyan
