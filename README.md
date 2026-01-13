# 🚀 Ghost Finder

Ghost Finder is a full-stack web application designed to track, visualize, and analyze developer activity in a collaborative environment. It integrates authentication, real-time status indicators, and an activity dashboard to give users a clear view of engagement and progress.

🔗 Live Demo: https://ghost-finder1.vercel.app

🎯 Problem
1. Teams often struggle to:
2. Quickly understand user engagement
3. Identify inactive or “ghost” users
4. Use heavy tools (Jira, Trello) for simple tracking needs
These tools add overhead instead of insight.

# ✅ Solution
##  Ghost Finder provides a minimal, focused dashboard that:

1. Authenticates users securely
   
2. Displays real-time status indicators
   
3. Redirects users to an activity page for deeper insights
   
4. Is scalable for future GitHub and analytics integration

# ✨ Key Features

## 🔐 Authentication

* Secure login & session handling using Supabase

* OAuth-ready (GitHub integration planned)

## 📊 Status Dashboard

* Dynamic user status cards

* Visual indicators for activity state

* Click-through navigation to activity details

## 📈 Activity Page

* Centralized user activity view

* Architecture prepared for GitHub activity (Octokit)

## 🚀 Production Deployment

* Deployed on Vercel

* Environment-based configuration

* CI/CD via GitHub

# 🧱 Tech Stack
## Frontend

* React

* TypeScript

* Vite

* Tailwind CSS

* shadcn/ui

## Backend / Services

* Supabase (Auth, Database, Sessions)

* Deployment

* Vercel

`
ghost-finder/
│
├── supabase/              # Supabase client & configuration
│
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Dashboard & Activity pages
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Helper functions
│   └── main.tsx
│
├── public/
├── .env
├── README.md
└── package.json
`

# 🔐 Authentication Flow

1. User signs up or logs in

2. Supabase authenticates and creates a session

3. Session persists across reloads

4. Protected routes validate auth state

5. User is redirected to dashboard or activity page

# ⚙️ Environment Variables

Create a .env file:
` VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
`

# 🛠️ Local Setup
`
git clone https://github.com/your-username/ghost-finder.git
cd ghost-finder
npm install
npm run dev
`
## Runs on:
`
http://localhost:5173
`
# 👩‍💻 Author
## AASTHA
