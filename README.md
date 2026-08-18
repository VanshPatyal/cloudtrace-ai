# CloudTrace AI — Real-Time Observability & Inspector for AI Agents

> **Built for Acdyon Technologies Frontend Challenge (Track 2 — The Premium Home Page)**  
> **Tech Stack**: Vanilla HTML5, CSS3, ES6 JavaScript (Zero Dependencies, <45KB Footprint)  
> **Deployment**: Deployed live on **Azure Static Web Apps**  
> [![Live Demo](https://img.shields.io/badge/Live%20Demo-Azure-blue?style=for-the-badge)](https://witty-sky-08cbca800.7.azurestaticapps.net/)  
> **Live Demo**: https://witty-sky-08cbca800.7.azurestaticapps.net/

---

## ⚡ Quick Start (Local Testing)

Since CloudTrace AI is built with zero framework dependencies, you don't even need `npm install` to view it locally!

### Option 1: Double-Click
Simply open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server (Recommended)
```bash
# Using npx serve
npx serve .

# Or using Python built-in server
python -m http.server 8000
```
Then navigate to `http://localhost:8000`.

---

## ☁️ Azure Static Web Apps Deployment Guide

To deploy this project to your **Azure Student Account** ($9,000 credits):

### Step 1: Create a GitHub Repository
1. Push this folder (`cloudtrace-ai`) to your GitHub account:
```bash
git init
git add .
git commit -m "Initial commit of CloudTrace AI landing page"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cloudtrace-ai.git
git push -u origin main
```

### Step 2: Deploy on Azure Portal
1. Log in to [Azure Portal](https://portal.azure.com).
2. Click **Create a Resource** $\rightarrow$ Search for **Static Web App** $\rightarrow$ Click **Create**.
3. Select your Azure Subscription (Student Tier) and create a Resource Group (e.g., `cloudtrace-rg`).
4. Enter Name: `cloudtrace-ai`.
5. Under **Deployment Details**, select **GitHub** and sign in.
6. Select your Repository (`cloudtrace-ai`) and Branch (`main`).
7. Under **Build Details**:
   - **Build Preset**: Custom
   - **App location**: `/`
   - **Api location**: *(Leave empty)*
   - **Output location**: `/`
8. Click **Review + Create** $\rightarrow$ **Create**.

Azure will automatically create a GitHub Actions workflow `.github/workflows/azure-static-web-apps-....yml` and deploy your app globally in <60 seconds! Your live URL will be: `https://<your-app-name>.azurestaticapps.net`.

---

