# PlagPro – Plagiarism & Flag Detection Tool

PlagPro is a document-based plagiarism (flag) detection web application that analyzes similarity between two documents using classical string matching algorithms.  
The project focuses on accuracy, algorithmic clarity, and smooth user experience.

---

## 🚀 Key Features

### 📂 Document Upload
- Upload **two documents**:
  - **Source document**
  - **Target document**
- Supports multiple file formats:
  - `.pdf`
  - `.docx`
  - `.txt`
- Drag-and-drop file upload for ease of use

---

### 🧠 Plagiarism Detection Algorithms
The system analyzes documents using three well-known string matching algorithms:

1. **Knuth–Morris–Pratt (KMP) Algorithm**
2. **Boyer–Moore Algorithm**
3. **Rabin–Karp Algorithm**

These algorithms are used to detect matching patterns between the source and target documents efficiently.

---

### 📊 Analysis & Results
- Click the **Analyze** button to start comparison
- Displays:
  - **Plagiarism / flag percentage**
  - Clear and smooth result rendering
- Provides quick feedback without page reloads
- Optimized for performance and responsiveness

---

### 🌗 Light & Dark Mode
- Toggle between **light mode** and **dark mode**
- Improves accessibility and user comfort
- Theme preference adapts to user choice

---

## 🛠️ Tech Stack

- **React** – frontend UI development
- **TypeScript** – type-safe codebase
- **Vite** – fast development and build tooling
- **Tailwind CSS** – utility-first styling
- **shadcn/ui** – reusable and accessible UI components
- **Classical DSA Algorithms** – KMP, Boyer–Moore, Rabin–Karp

---

## 📦 Installation & Setup

### Prerequisites
- Node.js
- npm

### Run the project locally

```bash
# Clone the repository
git clone <YOUR_REPOSITORY_URL>

# Navigate to project directory
cd PlagPro

# Install dependencies
npm install

# Start development server
npm run dev
