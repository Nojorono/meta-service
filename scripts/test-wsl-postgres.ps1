Write-Host "🐧 Testing WSL PostgreSQL Connection" -ForegroundColor Cyan

# Common WSL IP addresses to test
$testIPs = @("172.30.80.1", "172.31.80.1", "172.20.0.1", "172.25.0.1", "192.168.1.1")

Write-Host "🔍 Testing common WSL IP addresses..." -ForegroundColor Green

$workingIP = $null
foreach ($ip in $testIPs) {
    Write-Host "Testing $ip..." -ForegroundColor Yellow
    $result = Test-NetConnection -ComputerName $ip -Port 5432 -WarningAction SilentlyContinue
    if ($result.TcpTestSucceeded) {
        Write-Host "✅ PostgreSQL accessible on $ip" -ForegroundColor Green
        $workingIP = $ip
        break
    } else {
        Write-Host "❌ No connection to $ip" -ForegroundColor Red
    }
}

if ($workingIP) {
    Write-Host ""
    Write-Host "🎉 Found working PostgreSQL at: $workingIP" -ForegroundColor Green
    
    # Update .env.local
    $envFile = ".env.local"
    if (Test-Path $envFile) {
        $content = Get-Content $envFile
        for ($i = 0; $i -lt $content.Length; $i++) {
            if ($content[$i] -match '^PSQL_HOST=') {
                $content[$i] = "PSQL_HOST=`"$workingIP`""
                Write-Host "✅ Updated .env.local with IP: $workingIP" -ForegroundColor Green
                break
            }
        }
        $content | Set-Content $envFile
    }
    
    # Test with Node.js script
    Write-Host "🧪 Testing database connection..." -ForegroundColor Blue
    if (Test-Path "scripts\test-postgresql.js") {
        node scripts\test-postgresql.js
    }
    
} else {
    Write-Host ""
    Write-Host "❌ No PostgreSQL found on common WSL IPs" -ForegroundColor Red
    Write-Host "🔧 Please ensure:" -ForegroundColor Yellow
    Write-Host "1. PostgreSQL is running in WSL: sudo service postgresql start" -ForegroundColor Gray
    Write-Host "2. PostgreSQL is configured to accept connections from Windows" -ForegroundColor Gray
    Write-Host "3. Check WSL IP manually: wsl hostname -I" -ForegroundColor Gray
}
