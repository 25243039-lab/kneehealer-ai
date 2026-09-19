\# KneeHealer AI



\*\*AI-Assisted Knee Analysis \& Patient-Specific Implant Sizing\*\*



\## Problem

Knee osteoarthritis (OA) causes structural changes to the femur, tibia, and meniscus. Surgeons need consistent, quantitative knee assessment and patient-specific implant sizing for total knee arthroplasty (TKA).



\## Solution

KneeHealer AI is a full-stack healthcare platform that:

\- \*\*Analyzes knee X-rays\*\* using OpenCV (grayscale, edge detection, contour analysis)

\- \*\*Measures bone dimensions\*\* (femur \& tibia width in pixels)

\- \*\*Grades osteoarthritis severity\*\* using the Kellgren-Lawrence (KL) scale (0-4)

\- \*\*Recommends implant sizes\*\* (Small/Medium/Large) based on patient-specific measurements



\## Features

✅ \*\*Patient Portal\*\* — Upload scan, enter medical history, receive AI assessment  

✅ \*\*Doctor Dashboard\*\* — Review cases, verify measurements, plan implant sizing  

✅ \*\*3D Visualization\*\* — Interactive 3D knee model scaled to patient measurements  

✅ \*\*Medical-Grade Analysis\*\* — Real OpenCV image processing + heuristic OA grading  



\## Tech Stack

\- \*\*Frontend:\*\* React + Vite + TypeScript + Three.js

\- \*\*Backend:\*\* FastAPI + OpenCV + Python

\- \*\*Deployment:\*\* Ready for Vercel/Render



\## How to Run Locally



\### Backend

```bash

cd backend

python -m venv venv

source venv/bin/activate  # Windows: venv\\Scripts\\activate

pip install fastapi uvicorn opencv-python-headless numpy pillow python-multipart

uvicorn main:app --reload

```



\### Frontend

```bash

cd frontend

npm install

npm run dev

```



Visit `http://localhost:5173` → Choose "I'm a Patient" or "I'm a Doctor"



\## Use Case

A 58-year-old patient with knee pain uploads an X-ray. The AI detects KL-4 (severe) OA, recommends a Large implant (Size 6-8), and the surgeon reviews \& approves the plan within minutes.



\## Medical Disclaimer

For clinical use only. All recommendations must be reviewed by a qualified orthopedic surgeon.



\---



\*\*Team:\*\* Roll 25243039  

\*\*License:\*\* MIT

