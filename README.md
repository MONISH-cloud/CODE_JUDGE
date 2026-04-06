# Code-Judge: Automated Code Evaluation Platform

[cite_start]**Code-Judge** is a high-performance, web-based platform designed to automate programming evaluation for academic labs and coding competitions[cite: 340, 342]. [cite_start]By leveraging a **microservices architecture** and **Docker-based sandboxing**, it eliminates "it works on my machine" inconsistencies and ensures secure, real-time code execution[cite: 341, 345, 346].

---

## 🚀 Key Features

* [cite_start]**Automated Assessment:** Instant grading by comparing user output against hidden test cases[cite: 344, 393].
* [cite_start]**Secure Sandboxing:** Executes untrusted code in isolated Docker containers with restricted CPU, memory, and network access[cite: 346, 396, 461, 533].
* [cite_start]**Multi-Language Support:** Initial support for **C (GCC)** and **Python 3**[cite: 403, 511].
* [cite_start]**Real-Time Analytics:** Live global leaderboards and detailed submission history for every user[cite: 466, 467, 556].
* [cite_start]**Integrated Code Editor:** A browser-based IDE (Monaco) with syntax highlighting and keyboard shortcuts[cite: 458, 529, 575].
* [cite_start]**Enterprise-Grade DevOps:** Fully automated CI/CD pipeline via **GitHub Actions** for seamless deployment[cite: 347, 469, 557].

---

## 🏗 System Architecture

[cite_start]The platform is built as a distributed system of independent microservices communicating via a central **API Gateway**[cite: 416, 419, 630]:

* [cite_start]**Auth Service:** Manages secure, stateless sessions using **JWT (JSON Web Tokens)**[cite: 450, 603].
* [cite_start]**Problem Service:** Repositories for coding challenges, descriptions, and hidden test cases[cite: 446, 605].
* [cite_start]**Execution Engine:** The core "Sandbox" that interfaces with the **Docker Daemon** to lifecycle-manage ephemeral containers[cite: 429, 431, 550].
* [cite_start]**Leaderboard Service:** Tracks user points and ranks based on problem difficulty[cite: 466, 606].

---

## 💻 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | [cite_start]React / Vue [cite: 423] |
| **Backend** | [cite_start]Node.js (Express) or Go (Golang) [cite: 499] |
| **Databases** | [cite_start]PostgreSQL (Relational), MongoDB (Logs/Source Code) [cite: 437, 500, 501] |
| **Containerization** | [cite_start]Docker Engine (v20.10+), Kubernetes [cite: 492, 593] |
| **Communication** | [cite_start]REST (HTTP/JSON), gRPC, RabbitMQ [cite: 502, 503] |
| **CI/CD** | [cite_start]GitHub Actions [cite: 439, 522] |

---

## 🛠 Prerequisites & Installation

### Server Requirements
* [cite_start]**OS:** Linux (Ubuntu 20.04 LTS preferred) or Alpine Linux[cite: 491, 591].
* [cite_start]**Runtime:** Docker Engine v20.10+ must be active and accessible via Unix Socket[cite: 492, 520, 593].
* [cite_start]**Hardware:** Minimum 4GB RAM (8GB+ recommended for production)[cite: 488, 490].

### Local Development
1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/MONISH-cloud/CODE_JUDGE.git
    cd code-judge
    ```
2.  **Infrastructure Setup:**
    * [cite_start]Ensure **Minikube** or **Docker Desktop** is running[cite: 442, 488].
    * [cite_start]Configure environment variables for JWT and Database strings[cite: 450, 437].
3.  **Deployment:**
    * [cite_start]The CI/CD pipeline will automatically build and deploy the services upon pushing to the `main` branch[cite: 469, 470, 557].

---

## 👥 User Roles

* [cite_start]**Developers:** Browse problems, submit solutions, and track rankings[cite: 475, 479, 480].
* [cite_start]**Admins:** Manage problem sets, upload hidden test cases, and view system-wide analytics[cite: 453, 525, 526].
* [cite_start]**DevOps (PRE):** Responsible for system uptime, Kubernetes scaling, and security compliance[cite: 482, 485].

---

## 🛡 Security Constraints

To maintain host integrity, the system enforces the following:
* [cite_start]**No Root Access:** User code runs under a low-privilege UID (>1000)[cite: 505, 560].
* [cite_start]**Network Isolation:** Execution containers have no internet access[cite: 559].
* [cite_start]**Resource Limits:** Strict enforcement of memory (e.g., 256MB) and execution time (e.g., 2.0s)[cite: 463, 553, 626, 627].
* [cite_start]**Ephemeral Filesystems:** Submission containers use read-only filesystems that are destroyed immediately after execution[cite: 506, 585, 586].

---

## 📝 Roadmap & Known Issues

* [cite_start][ ] **ISS-02:** Plagiarism Detection integration (MOSS vs Custom service)[cite: 636].
* [cite_start][ ] **ISS-04:** Finalizing standardized C compiler flags (e.g., `-O2`, `-Wall`)[cite: 638].
* [cite_start][ ] **ISS-05:** University SSO integration[cite: 639].

---

[cite_start]**Prepared by:** TEAM DEVGRU (RV University) [cite: 326, 328]
[cite_start]**Version:** 1.0 [cite: 325]
