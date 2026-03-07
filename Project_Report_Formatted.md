# Project Report: InvestVision AI — Cloud-Native Portfolio Analyzer

<div align="center">
    <img src="file:///d:/sricharan-A/amrita/sem%206/Cloud/Project_CLoud_Final/amrita_logo_new.png" width="180">
    <br>
    <h3>Department of Computer Science and Engineering</h3>
    <h3>Amrita School of Computing, Coimbatore</h3>
    <br>
    <p><b>23CSE363 – CLOUD COMPUTING</b></p>
    <p>Academic Year 2025-2026-Even</p>
    <br>
    <h2>Case Study Report</h2>
    <h1>InvestVision AI Portfolio Analyzer</h1>
    <br>
    <table border="1">
        <tr>
            <th>NAME</th>
            <th>ROLL NO</th>
        </tr>
        <tr>
            <td>Sricharan A</td>
            <td>CB.SC.U4CSE23764</td>
        </tr>
        <tr>
            <td>Vishal Karthikeyan SS</td>
            <td>CB.SC.U4CSE23756</td>
        </tr>
    </table>
</div>

---

## **PROBLEM STATEMENT**
Manual tracking of investment portfolios from various brokerage screenshots is tedious and prone to error. Investors often have multiple screenshots from different apps but no central way to analyze their total value or get quick financial insights.

### **Project Objectives**
1. **Automated Extraction**: Use Azure AI Vision to read text from portfolio screenshots accurately.
2. **Financial Analysis**: Automatically calculate P/E (Price-to-Earnings) and P/B (Price-to-Book) ratios.
3. **Smart Advisory**: Provide Buy/Hold/Avoid suggestions based on valuation metrics.
4. **Cloud-Native Hosting**: Ensure high availability and scalability using serverless architecture.
5. **Secure Storage**: Store analysis history permanently in a globally distributed database.

---

## **Project Structure**
The project is organized to separate frontend, backend, and infrastructure management:

- `frontend/`: React-based application providing the modern glassmorphism dashboard.
- `function_app.py`: Core serverless backend containing the API endpoints for upload and retrieval.
- `setup_azure.ps1`: Automated PowerShell script for provisioning the entire Azure infrastructure.
- `Project_Report_Formatted.md`: Academic report documentation.
- `sample_portfolio.png`: Reference image for testing OCR capabilities.

---

## **System Architecture**
The system follows a modern microservices-inspired serverless architecture, ensuring high availability, scalability, and cost-efficiency.

![InvestVision AI - Serverless Architecture Diagram](file:///d:/sricharan-A/amrita/sem%206/Cloud/Project_CLoud_Final/architecture_diagram_final.png)
*InvestVision AI - Serverless Architecture Diagram*

---

## **Cloud Services Used**

| Service | Service Model | Purpose |
| :--- | :--- | :--- |
| **Azure AI Vision** | SaaS (AI Service) | Performs high-precision OCR to extract tickers, quantities, and prices from screenshots. |
| **Azure Functions** | FaaS (Serverless) | Python backend that orchestrates the flow, applies financial logic, and interacts with Cosmos DB. |
| **Azure Cosmos DB** | PaaS (DBaaS) | NoSQL database used to store historical analysis data with low latency. |
| **Azure Blob Storage** | PaaS (Storage) | Hosts the static website frontend and stores raw image uploads. |
| **Azure Key Vault** | PaaS (Security) | Securely manages API keys and connection strings to ensure zero-trust security. |
| **App Insights** | PaaS (Monitoring) | Real-time monitoring of function executions and error tracking. |

---

## **Project Execution & User Steps**

### **Implementation Steps (Our Work)**
1. **Infrastructure as Code**: Developed `setup_azure.ps1` to automate resource group creation and service provisioning.
2. **Backend Development**: Implemented `function_app.py` using Azure Functions to handle image processing and financial ratio calculations.
3. **AI Integration**: Configured Azure AI Vision for text extraction from unstructured financial documents.
4. **Frontend Design**: Built a premium dashboard with custom CSS for a glassmorphism aesthetic.
5. **Database Schema**: Designed a NoSQL structure in Cosmos DB for efficient portfolio history retrieval.

### **Steps for the User**
1. **Access Dashboard**: Open the provided static website URL in any browser.
2. **Upload Portfolio**: Click the "📷 Upload Screenshot" button and select an investment portfolio screenshot.
3. **Wait for Analysis**: The AI processes the image and calculates Sharpe, Beta, and Alpha ratios.
4. **Review Suggestions**: View the "Analysis History" table where each asset is color-coded with Buy, Hold, or Avoid suggestions.
5. **Knowledge Hub**: Use the "Knowledge Hub" to understand the financial metrics used in the analysis.

---

## **Screenshots & Results**

### **1. Cloud Dashboard (Home)**
![Dashboard](file:///d:/sricharan-A/amrita/sem%206/Cloud/Project_CLoud_Final/screenshot_dashboard.png)
*The landing page featuring the high-end glassmorphism design and the upload interface.*

### **2. Analysis History & Financial Intelligence**
![Analysis History](file:///d:/sricharan-A/amrita/sem%206/Cloud/Project_CLoud_Final/screenshot_history.png)
*Detailed view of extracted stock tickers, their ratios, and the AI Suggestion badges like "Healthy Buy" or "Strong Buy".*

### **3. Knowledge Hub (Financial Metrics)**
![Knowledge Hub Top](file:///d:/sricharan-A/amrita/sem%206/Cloud/Project_CLoud_Final/screenshot_hub_top.png)
*The Knowledge Hub section explaining the steps for portfolio analysis and key performance ratios.*

### **4. Analysis Pros & Cons**
![Knowledge Hub Bottom](file:///d:/sricharan-A/amrita/sem%206/Cloud/Project_CLoud_Final/screenshot_hub_bottom.png)
*Educational section outlining the positives and negatives of the analysis methodology.*

### **5. Azure Cloud Infrastructure**
![Azure Resources](file:///d:/sricharan-A/amrita/sem%206/Cloud/Project_CLoud_Final/screenshot_azure_resources.png)
*Overview of the Azure resources deployed, including Functions, Cosmos DB, and AI Vision services in the Azure Portal.*

### **6. Sample Portfolio (Reference)**
![Sample Portfolio](file:///d:/sricharan-A/amrita/sem%206/Cloud/Project_CLoud_Final/sample_portfolio.png)
*Sample Portfolio Screenshot Title: High-precision OCR testing reference.*

---

## **Github Link**
Everything related to the project is available at:
[https://github.com/SricharanAsr/Cloud-Investment-Analyzer](https://github.com/SricharanAsr/Cloud-Investment-Analyzer)
