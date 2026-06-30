# SplitFlow

A simple tool to track shared expenses and instantly calculate who owes what — without confusion or manual calculations.

---

## 🚀 Live Demo
👉 https://your-vercel-link.vercel.app

---

## 💡 Problem

Splitting expenses in a group often leads to confusion:
- Who paid more?
- Who owes what?
- How do we calculate it fairly?

Most people end up doing manual calculations or using notes, which is slow and error-prone.

---

## ✅ Solution

SplitFlow removes that friction by automatically calculating balances and giving clear insights into group expenses.

---

## ✨ Features

- Add, edit, and delete shared expenses
- Automatic balance calculation
- "Who pays who" settlement view with the minimal set of transactions needed to settle up
- Clear breakdown of who owes and who should receive
- Quick insight into top payer and biggest debtor
- Member avatars with auto-generated colors
- Light and dark mode, with your preference remembered across visits
- Clean, responsive UI built with Tailwind CSS

---

## 🧠 Key Concepts

This project demonstrates:

- State management with React
- Derived data (balances and settlements calculated from expenses)
- A debt-settlement algorithm that minimizes the number of payments
- Dynamic UI updates based on user input
- LocalStorage persistence
- Theming with Tailwind's class-based dark mode
- Clean component structure and reusable logic

---

## 🛠 Tech Stack

- React
- Vite
- Tailwind CSS
- LocalStorage

---

## 📸 Preview

| Light | Dark |
| --- | --- |
| (Add a light mode screenshot here) | (Add a dark mode screenshot here) |

---

## 📦 Installation

```bash
git clone https://github.com/your-username/splitflow.git
cd splitflow
npm install
npm run dev
