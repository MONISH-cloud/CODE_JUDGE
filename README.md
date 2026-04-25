# 🚀 Code-Judge: Automated Code Evaluation Platform

**Code-Judge** is a high-performance, web-based platform designed to automate programming evaluation for academic labs and coding competitions.  

It uses a **microservices architecture** combined with **Docker-based sandboxing** to ensure secure, consistent, and real-time code execution—eliminating the classic *“it works on my machine”* problem.

---

## ✨ Key Features

- ⚡ **Automated Assessment**  
  Instant grading by comparing outputs against hidden test cases.

- 🔒 **Secure Sandboxing**  
  Executes untrusted code in isolated Docker containers with strict CPU, memory, and network limits.

- 🌐 **Multi-Language Support**  
  Supports:
  - C (GCC)
  - Python 3

- 📊 **Real-Time Analytics**  
  Live leaderboards and detailed submission tracking.

- 🧑‍💻 **Integrated Code Editor**  
  Browser-based IDE (Monaco) with syntax highlighting and shortcuts.

- 🔁 **CI/CD Integration**  
  Automated deployment using GitHub Actions.

---

## 🏗️ System Architecture

The platform follows a **distributed microservices architecture** connected via an **API Gateway**.

### Core Services:

- 🔐 **Auth Service**
  - Handles authentication using JWT (JSON Web Tokens)

- 📚 **Problem Service**
  - Stores coding problems, descriptions, and hidden test cases

- ⚙️ **Execution Engine**
  - Runs code securely inside Docker containers
  - Manages container lifecycle dynamically

- 🏆 **Leaderboard Service**
  - Maintains rankings based on performance and difficulty

---

## 💻 Tech Stack

| Layer | Technology |
|------|-----------|
| **Frontend** | React / Vue |
| **Backend** | Node.js (Express) or Go (Golang) |
| **Database** | PostgreSQL, MongoDB |
| **Containerization** | Docker, Kubernetes |
| **Communication** | REST APIs, gRPC, RabbitMQ |
| **CI/CD** | GitHub Actions |

---

## 🛠️ Prerequisites

### 🖥️ Server Requirements
- OS: Linux (Ubuntu 20.04 LTS recommended)
- Docker Engine: v20.10+
- RAM:
  - Minimum: 4GB
  - Recommended: 8GB+

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/MONISH-cloud/CODE_JUDGE.git
cd CODE_JUDGE
