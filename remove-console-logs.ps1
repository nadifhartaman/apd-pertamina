$files = @(
  'c:\Users\Nadifdzaikra\Documents\SCCIC\pertamina-detection\frontend\src\hooks\useAPD.js',
  'c:\Users\Nadifdzaikra\Documents\SCCIC\pertamina-detection\frontend\src\hooks\useCameraAPD.js',
  'c:\Users\Nadifdzaikra\Documents\SCCIC\pertamina-detection\frontend\src\components\ui\modalForm.js',
  'c:\Users\Nadifdzaikra\Documents\SCCIC\pertamina-detection\frontend\src\components\testingSocket.js',
  'c:\Users\Nadifdzaikra\Documents\SCCIC\pertamina-detection\frontend\src\app\camera\page.js',
  'c:\Users\Nadifdzaikra\Documents\SCCIC\pertamina-detection\frontend\src\components\manager\wsPreview.js',
  'c:\Users\Nadifdzaikra\Documents\SCCIC\pertamina-detection\frontend\src\app\camera\manager\page.js',
  'c:\Users\Nadifdzaikra\Documents\SCCIC\pertamina-detection\frontend\src\app\auth\login\page.js',
  'c:\Users\Nadifdzaikra\Documents\SCCIC\pertamina-detection\frontend\src\app\auth\register\page.js',
  'c:\Users\Nadifdzaikra\Documents\SCCIC\pertamina-detection\frontend\src\components\layout\layoutMain.js',
  'c:\Users\Nadifdzaikra\Documents\SCCIC\pertamina-detection\frontend\src\components\dashboard\cctvRecap.js',
  'c:\Users\Nadifdzaikra\Documents\SCCIC\pertamina-detection\frontend\src\components\dashboard\timeSeries.js',
  'c:\Users\Nadifdzaikra\Documents\SCCIC\pertamina-detection\frontend\src\components\dashboard\listPreview.js'
)

foreach ($file in $files) {
  if (Test-Path $file) {
    $content = Get-Content $file -Raw
    
    # Remove active console.log statements (not commented)
    # Pattern: lines that start with optional whitespace + console.log, but not //
    $pattern = '^\s*console\.log\([^)]*\);?\s*$'
    
    $lines = $content -split "`n"
    $newLines = @()
    $skipNext = $false
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
      $line = $lines[$i]
      
      # Check if this line is a console.log (not commented)
      if ($line -match '^\s*console\.log\(' -and $line -notmatch '^\s*//' -and $line -notmatch '^\s*//.*console\.log') {
        # Skip this line (remove it)
        continue
      }
      
      # Also handle multi-line console.log (rare but possible)
      if ($line -match 'console\.log\(' -and $line -notmatch '^\s*//' -and $line -notmatch '\);') {
        # This might be multi-line, skip it and next lines until we find );
        if ($line -match '^\s*console\.log') {
          continue
        }
      }
      
      $newLines += $line
    }
    
    $newContent = $newLines -join "`n"
    Set-Content $file $newContent
    Write-Host "✅ Processed: $file"
  }
}

Write-Host "`n✨ Done! All console.log statements removed."
