# 📊 Personal Finance Analytics App

## 🚀 Overview
A full-stack **data-driven web application** designed to track, analyze, and visualize personal expenses.

This project demonstrates end-to-end capabilities from **data ingestion, storage, transformation, and visualization**, using modern cloud-based tools and databases.

The application enables users to:
- Track expenses in real-time
- Analyze monthly spending behavior
- Visualize financial patterns through interactive dashboards
- Compare performance month-over-month (MoM)

---

## 🎯 Business Problem
Individuals often lack visibility into their spending patterns, making it difficult to:
- Identify overspending categories
- Monitor financial trends
- Make data-driven financial decisions

---

## 💡 Solution
This solution provides a **self-service analytics platform** where users can:
- Store transactional data (expenses)
- Categorize spending
- Filter and analyze data at a monthly level
- Gain insights using visual dashboards

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
- HTML5, CSS3, JavaScript
- Chart.js (data visualization)
- Deployed via **GitHub Pages**

### 🧠 Backend / Data Layer
- **Supabase**
  - PostgreSQL database
  - REST API auto-generated
  - Authentication (Supabase Auth)
  - Row Level Security (RLS)

### ☁️ Cloud & Deployment
- GitHub (source control)
- GitHub Pages (hosting)
- Supabase Cloud (database + auth)

---

## 🔐 Data Security
- Implemented **Row Level Security (RLS)** in PostgreSQL
- Data access restricted using:

auth.uid() = user_id
- Ensures users can only access their own data

---

## 📊 Features

### ✅ Expense Management
- Create and store transactions
- Categorization of expenses
- Real-time updates

### ✅ Dynamic Category Handling
- Controlled categories via dropdown (data quality improvement)
- Standardized inputs for accurate analytics

### ✅ Monthly Filtering
- Interactive filter by month (YYYY-MM)
- Default selection = current month
- All dashboard components update dynamically

### ✅ KPI Dashboard
- Total Expenses
- Number of Transactions
- Top Category

### ✅ Month-over-Month Analysis (MoM)
- Comparison vs previous month
- % growth / decline
- Visual indicators:
- 🔴 increase in spending
- 🟢 reduction in spending

### ✅ Data Visualization
- **Doughnut Chart**
- % distribution by category
- **Horizontal Bar Chart**
- Ranked categories (highest → lowest spending)

---

## 📈 Key Analytics Capabilities

- Data aggregation by category
- Monthly trend analysis
- Relative distribution (%)
- Ranking analysis (Top-N categories)
- Time-based filtering

---

## 📷 Dashboard Example

Key insights available:
- Spending distribution across categories
- Identification of major cost drivers
- Month-over-month financial trend

---

## 🧠 Data Modeling

### Main Table: `expenses`

| Field       | Type        |
|------------|------------|
| user_id     | UUID       |
| date        | DATE       |
| amount      | NUMERIC    |
| category    | TEXT       |
| description | TEXT       |

---

## ⚙️ Setup Instructions

### 1. Clone repository
```bash
git clone https://github.com/aandresc86-wq/expense-tracker.git

2. Configure Supabase

Create project
Enable Auth (Email provider)
Create expenses table
Configure RLS policies

3. Configure environment
Edit app.js:

const supabaseUrl = "YOUR_PROJECT_URL";
const supabaseKey = "YOUR_ANON_PUBLIC_KEY";

4. Deploy

Push to GitHub
Enable GitHub Pages

📌 ATS Keywords (for Data Roles)

Data Analysis
Data Visualization
Dashboard Development
KPI Metrics
Business Intelligence (BI)
SQL / PostgreSQL
Data Modeling
ETL Concepts
Data Filtering & Transformation
Time Series Analysis
Cloud Data Platforms (Supabase)
API Integration
Frontend Analytics Apps


💼 Use Case for Recruiters
This project demonstrates:
✅ End-to-end data lifecycle
✅ Cloud-based analytics architecture
✅ SQL + front-end integration
✅ Business-oriented dashboards
✅ Data-driven decision support

🚀 Future Improvements

Category dimension table (normalized model)
Time-series visualizations (trend line)
Export to CSV / Excel
Budget vs actual analysis
Predictive analytics (forecasting)


👨‍💻 Author
Andrés Carballo
Chemical Engineer | MBA | Data Analytics & AI Diploma
Transitioning into Data Analytics / Data Science roles

⭐ Key Takeaway
This project showcases the ability to:

Transform raw transactional data into insights
Build analytical dashboards from scratch
Design scalable, cloud-based data applications
