Copy the manufacturer design PNGs from the repository UI folder into this folder so the app can reference them at runtime.

PowerShell (from repository root `d:\DonouAPP`):

```powershell
# Create destination folder (if not already created by this README)
New-Item -ItemType Directory -Force -Path .\frontend\public\assets\manufacturer

# Copy all PNGs from the UI design folder to frontend public assets
Copy-Item -Path .\UI\manufacturer\*.png -Destination .\frontend\public\assets\manufacturer -Force

# Optional: verify files were copied
Get-ChildItem .\frontend\public\assets\manufacturer | Select-Object Name, Length
```

After copying, start the frontend dev server (from `frontend`):

```powershell
cd frontend
npm install
npm run dev
```