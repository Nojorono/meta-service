# SOFIA Meta Service - WSL PostgreSQL Connection Script

Write-Host "🐧 SOFIA Meta Service - WSL PostgreSQL Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Function to get WSL IP address
function Get-WSLHostIP {
    try {
        # Try to get WSL host IP from Windows
        $wslInfo = wsl hostname -I 2>$null
        if ($wslInfo) {
            $wslIP = $wslInfo.Split(' ')[0].Trim()
            return $wslIP
        }
        
        # Alternative method - check network adapter
        $vEthernet = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -like "*WSL*" -or $_.InterfaceAlias -like "*vEthernet*" }
        if ($vEthernet) {
            return $vEthernet[0].IPAddress
        }
        
        return $null
    } catch {
        return $null
    }
}

# Function to test WSL connectivity
function Test-WSLConnection {
    Write-Host "🔍 Detecting WSL environment..." -ForegroundColor Green
    
    # Check if WSL is available
    $wslCheck = Get-Command wsl -ErrorAction SilentlyContinue
    if (-not $wslCheck) {
        Write-Host "❌ WSL command not found. Please install WSL first." -ForegroundColor Red
        return $false
    }
    
    # Get WSL distributions
    try {
        $wslDistros = wsl -l -q 2>$null
        if ($wslDistros) {
            Write-Host "✅ WSL distributions found:" -ForegroundColor Green
            $wslDistros | ForEach-Object { Write-Host "   - $_" -ForegroundColor Gray }
        } else {
            Write-Host "❌ No WSL distributions found" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Error checking WSL distributions" -ForegroundColor Red
        return $false
    }
    
    # Get WSL IP
    $wslIP = Get-WSLHostIP
    if ($wslIP) {
        Write-Host "🌐 WSL Host IP detected: $wslIP" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Could not auto-detect WSL IP. Using common addresses..." -ForegroundColor Yellow
        $wslIP = @("172.30.80.1", "172.31.80.1", "192.168.1.1")
    }
    
    return $wslIP
}

# Function to test PostgreSQL in WSL
function Test-PostgreSQLInWSL {
    param($hostIP)
    
    Write-Host "🗃️  Testing PostgreSQL connection to WSL..." -ForegroundColor Green
    
    if ($hostIP -is [array]) {
        foreach ($ip in $hostIP) {
            Write-Host "🔗 Trying IP: $ip" -ForegroundColor Blue
            $result = Test-NetConnection -ComputerName $ip -Port 5432 -WarningAction SilentlyContinue
            if ($result.TcpTestSucceeded) {
                Write-Host "✅ PostgreSQL is accessible on $ip:5432" -ForegroundColor Green
                return $ip
            } else {
                Write-Host "❌ Cannot connect to $ip:5432" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "🔗 Testing connection to: $hostIP:5432" -ForegroundColor Blue
        $result = Test-NetConnection -ComputerName $hostIP -Port 5432 -WarningAction SilentlyContinue
        if ($result.TcpTestSucceeded) {
            Write-Host "✅ PostgreSQL is accessible on $hostIP:5432" -ForegroundColor Green
            return $hostIP
        } else {
            Write-Host "❌ Cannot connect to $hostIP:5432" -ForegroundColor Red
        }
    }
    
    return $null
}

# Function to update .env.local
function Update-EnvConfig {
    param($hostIP)
    
    Write-Host "📝 Updating .env.local configuration..." -ForegroundColor Green
    
    $envFile = ".env.local"
    if (Test-Path $envFile) {
        $content = Get-Content $envFile
        $updated = $false
        
        for ($i = 0; $i -lt $content.Length; $i++) {
            if ($content[$i] -match '^PSQL_HOST=') {
                $content[$i] = "PSQL_HOST=`"$hostIP`""
                $updated = $true
                Write-Host "✅ Updated PSQL_HOST to $hostIP" -ForegroundColor Green
                break
            }
        }
        
        if ($updated) {
            $content | Set-Content $envFile
            Write-Host "💾 Configuration saved to .env.local" -ForegroundColor Green
        } else {
            Write-Host "⚠️  PSQL_HOST not found in .env.local" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ .env.local file not found" -ForegroundColor Red
    }
}

# Main execution
Write-Host ""
$wslIP = Test-WSLConnection

if ($wslIP) {
    $connectedIP = Test-PostgreSQLInWSL -hostIP $wslIP
    
    if ($connectedIP) {
        Update-EnvConfig -hostIP $connectedIP
        
        Write-Host ""
        Write-Host "🧪 Running connection test..." -ForegroundColor Green
        if (Test-Path "scripts\test-postgresql.js") {
            node scripts\test-postgresql.js
        }
        
        Write-Host ""
        Write-Host "🎉 WSL PostgreSQL setup completed!" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📋 WSL PostgreSQL Commands (run in WSL Ubuntu):" -ForegroundColor White
        Write-Host "sudo service postgresql start" -ForegroundColor Gray
        Write-Host "sudo service postgresql status" -ForegroundColor Gray
        Write-Host "sudo -u postgres psql" -ForegroundColor Gray
        
    } else {
        Write-Host ""
        Write-Host "❌ PostgreSQL not accessible from Windows" -ForegroundColor Red
        Write-Host ""
        Write-Host "🔧 WSL PostgreSQL Setup Instructions:" -ForegroundColor Yellow
        Write-Host "1. Start WSL Ubuntu: wsl" -ForegroundColor Gray
        Write-Host "2. Install PostgreSQL: sudo apt update && sudo apt install postgresql postgresql-contrib" -ForegroundColor Gray
        Write-Host "3. Start service: sudo service postgresql start" -ForegroundColor Gray
        Write-Host "4. Setup user and database:" -ForegroundColor Gray
        Write-Host "   sudo -u postgres psql" -ForegroundColor Gray
        Write-Host "   CREATE DATABASE api_mgmt;" -ForegroundColor Gray
        Write-Host "   CREATE USER api_mgmt WITH PASSWORD '@p1-mGmNt';" -ForegroundColor Gray
        Write-Host "   GRANT ALL PRIVILEGES ON DATABASE api_mgmt TO api_mgmt;" -ForegroundColor Gray
        Write-Host "   \q" -ForegroundColor Gray
        Write-Host "5. Configure PostgreSQL for Windows access:" -ForegroundColor Gray
        Write-Host "   sudo nano /etc/postgresql/*/main/postgresql.conf" -ForegroundColor Gray
        Write-Host "   Set: listen_addresses = '*'" -ForegroundColor Gray
        Write-Host "   sudo nano /etc/postgresql/*/main/pg_hba.conf" -ForegroundColor Gray
        Write-Host "   Add: host all all 0.0.0.0/0 md5" -ForegroundColor Gray
        Write-Host "6. Restart PostgreSQL: sudo service postgresql restart" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ WSL not properly configured" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔧 Manual IP Configuration:" -ForegroundColor White
Write-Host "If auto-detection fails, manually update .env.local:" -ForegroundColor Gray
Write-Host 'PSQL_HOST="YOUR_WSL_IP_HERE"' -ForegroundColor Gray
