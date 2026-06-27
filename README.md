# 📊 Personal Finance Analytics App

## 🚀 Overview
A full-stack data-driven web application designed to track, analyze, and visualize personal expenses.

This project demonstrates end-to-end capabilities across the data lifecycle: data ingestion, storage, transformation, and visualization, using cloud-based tools and modern web technologies.

---

## 🎯 Business Problem
Individuals often lack visibility into their spending patterns, making it difficult to:
- Identify high-cost categories
- Monitor financial trends over time
- Make data-driven financial decisions

---

## 💡 Solution
A self-service analytics platform that allows users to:
- Track expenses in real-time
- Categorize transactions
- Filter and analyze data monthly
- Generate insights through interactive dashboards

---

## 🧱 Architecture

Frontend (GitHub Pages)
        ↓
Supabase (Backend-as-a-Service)
        ↓
PostgreSQL Database (Cloud)

---

## 🛠️ Tech Stack

### 🌐 Frontend
- HTML5
- CSS3
- JavaScript
- Chart.js (data visualization)

### 🧠 Backend / Data Layer
- Supabase
  - PostgreSQL Database
  - REST API (auto-generated)
  - Authentication (Supabase Auth)
  - Row Level Security (RLS)

### ☁️ Cloud & Deployment Platforms
- GitHub (version control)
- GitHub Pages (frontend hosting)
- Supabase Cloud (database + authentication)

---

## 🔐 Data Security
- Row Level Security (RLS) implemented in PostgreSQL
- Data access controlled using:
  auth.uid() = user_id
- Ensures each user can only access their own records

---

## 📊 Features

### ✅ Expense Management
- Add and store expenses
- Categorize transactions
- Real-time updates

### ✅ Monthly Filtering
- Filter data by selected month (YYYY-MM)
- Default selection: current month
- Dynamic update of all dashboard elements

### ✅ KPI Dashboard
- Total Expenses
- Number of Transactions
- Top Category

### ✅ Month-over-Month Analysis (MoM)
- Comparison vs previous month
- Percentage change indicators
- Visual interpretation:
  - Increase in spending → negative (red)
  - Decrease in spending → positive (green)

### ✅ Data Visualization
- Doughnut Chart
  - Shows percentage distribution by category
- Horizontal Bar Chart
  - Sorted ranking of categories (highest to lowest spending)

---

## 📈 Key Analytics Capabilities
- Aggregation by category
- Month-over-month comparison
- Percentage distribution analysis
- Ranking-based insights (Top-N categories)
- Time-based filtering

---

## 🧠 Data Model

Table: expenses

Fields:
- user_id (UUID)
- date (DATE)
- amount (NUMERIC)
- category (TEXT)
- description (TEXT)

---

## ⚙️ Setup Instructions

1. Clone repository
   git clone https://github.com/aandresc86-wq/expense-tracker.git

2. Configure Supabase
   - Create new project
   - Enable Authentication (Email provider)
   - Create 'expenses' table
   - Configure RLS policies

3. Configure environment
   Update in app.js:
   const supabaseUrl = "YOUR_PROJECT_URL";
   const supabaseKey = "YOUR_ANON_PUBLIC_KEY";

4. Deploy
   - Push to GitHub
   - Enable GitHub Pages

---

## 📌 ATS Keywords (for Data Analyst roles)

- Data Analysis
- Data Visualization
- Business Intelligence (BI)
- Dashboard Development
- KPI Metrics
- SQL / PostgreSQL
- Data Modeling
- Data Transformation
- ETL Concepts
- Time Series Analysis
- Cloud Data Platforms (Supabase)
- API Integration
- Analytical Applications

---

## 💼 Recruiter Perspective

This project demonstrates:

- End-to-end data pipeline thinking
- Integration between SQL databases and visualization layers
- Business-oriented dashboard design
- Cloud-based data architecture
- User-level data security (multi-tenant systems)

---

## 🚀 Future Improvements

- Normalized data model (category dimension table)
- Time-series trend visualization
- Export to CSV / Excel
- Budget vs Actual analysis
- Predictive analytics (forecasting)

---

## 👨‍💻 Author

Andrés Carballo  
Chemical Engineer | MBA | Data Analytics & AI Diploma  

---

## ⭐ Key Takeaway

This project showcases the ability to:
- Transform raw transactional data into actionable insights
- Design dashboards with business context
- Build scalable data-driven web applications
