# Milesenberg Digital

## 🚀 Hosting
This site is self-hosted on a **Linode VPS** (Ubuntu 24.04).
*   **IP**: `172.237.112.63`
*   **Domain**: [milesenberg.com](https://milesenberg.com)

## 🛠️ Deployment
Deployment is handled by the local PowerShell script:
```powershell
./deploy_to_linode.ps1
```
This script zips the project, uploads it via SCP, and runs the server-side setup.

## 🏗️ Architecture
*   **Web Server**: Nginx (Reverse Proxy, SSL termination)
*   **App Server**: Gunicorn (Python WSGI)
*   **Security**: UFW Firewall, Fail2Ban, Let's Encrypt (Certbot)

## 📜 History
*   **2025-12-15**: Migrated from Render to Linode for data sovereignty.
*   **Legacy**: `Procfile.render_legacy` contains the old Render configuration.
