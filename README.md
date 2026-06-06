# 📚 Trojan Project Sankalp

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/)
[![Expo](https://img.shields.io/badge/Expo-Community-orange.svg)](https://expo.dev/)

## ✨ Overview

**Trojan Project Sankalp** is a comprehensive health‑screening platform built as a **monorepo** using **npm workspaces**. It combines a mobile field app, several backend services, and a machine‑learning risk analysis engine.

| Component | Stack | Purpose |
|---|---|---|
| `apps/mobile` | React Native (Expo) + TypeScript | Field workers collect patient data via a mobile app. |
| `apps/backend-core` | Node.js Express + PostgreSQL | API for the mobile app – authentication, patient records, surveys. |
| `apps/admin-frontend` | React & Vite | Dashboard for doctors/admins to view analytics. |
| `apps/admin-backend` | NestJS + Prisma | Secure admin API with RBAC and JWT auth. |
| `apps/risk-engine` | Python FastAPI + Scikit‑Learn | ML service that predicts health‑risk scores. |
| `apps/risk-frontend` | React & Vite | Visualize model predictions and data insights. |

## 🚀 Quick Start

### Prerequisites
- **Node ≥20**
- **Python ≥3.9** (with `venv`)
- **Docker** (optional, for the PostgreSQL database)

### 1. Clone & Install
```bash
git clone https://github.com/your-repo/trojan_project_sankalp.git
cd trojan_project_sankalp
npm install   # installs all workspace packages
```

### 2. Set up Environment Variables
Each app ships with a `.env.example`. Copy it to `.env` and fill in your local values:
```bash
# Example for the mobile app
cp apps/mobile/.env.example apps/mobile/.env
# Edit the file – replace YOUR_LOCAL_IP with your machine's IP address
```
All `.env` files are listed in `.gitignore` so they never get committed.

### 3. Run Services (in separate terminals)
```bash
npm run dev:mobile          # Expo development server
npm run dev:backend-core    # Mobile API
npm run dev:admin-frontend  # Admin UI
npm run dev:admin-backend   # Admin API
npm run dev:risk-frontend    # Risk UI
```
#### Run the ML Service
```bash
cd apps/risk-engine
python -m venv .venv
. .venv/Scripts/activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload   # FastAPI server
```

## 🔐 Security Posture
- **All secrets** (`DB_PASSWORD`, `JWT_SECRET`, API keys, etc.) live in `.env` files that are **git‑ignored**.
- **`.env.example`** files provide a template for new developers without exposing credentials.
- Run `npm audit` and `pip audit` regularly to keep dependencies safe.

## 📄 License
This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---
