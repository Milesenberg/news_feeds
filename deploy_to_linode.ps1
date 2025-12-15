$ErrorActionPreference = "Stop"
$ServerIP = "172.237.112.63"
$User = "root"
$RemoteDir = "/var/www/sovereign_web"

Write-Host "1. Compressing files..."
# Exclude venv, git, pycache, etc.
$excludes = "*.git*", "*.venv*", "*__pycache__*", "*.idea*", "*.vscode*", "deploy.ps1", "*_BACKUP_PRE_REFACTOR*"
if (Test-Path "site.zip") { Remove-Item "site.zip" -Force }
$sourceFiles = Get-ChildItem -Path . -Exclude $excludes
Compress-Archive -Path $sourceFiles.FullName -DestinationPath (Join-Path $PWD "site.zip") -Force

Write-Host "2. Uploading site.zip (You will be asked for password)..."
scp -o StrictHostKeyChecking=no site.zip "${User}@${ServerIP}:/tmp/site.zip"

Write-Host "3. Deploying on server (You will be asked for password again)..."
$cmds = "apt-get update && apt-get install -y unzip && mkdir -p $RemoteDir && unzip -o /tmp/site.zip -d $RemoteDir; chmod +x $RemoteDir/deploy/setup.sh && sed -i 's/\r$//' $RemoteDir/deploy/setup.sh && bash $RemoteDir/deploy/setup.sh"
ssh -o StrictHostKeyChecking=no "${User}@${ServerIP}" $cmds

Write-Host "4. Cleaning up..."
Remove-Item "site.zip"
Write-Host "Deployment Complete!"
