# 🧙 Server Magic Input Hub – 3‑Tier Full‑Stack Application

A modern, stylish **task manager** with a **magic spell‑casting theme** – built as a **three‑tier** web application.  
The **frontend (React)** communicates with a **backend (Node.js + Express)** that stores tasks in a **PostgreSQL database**.  
Designed for deployment on three separate VMs (or a single VM for testing) with Nginx reverse proxy, systemd, and persistent storage.

---

## 🏗️ Architecture

![3-Tier Architecture](https://via.placeholder.com/800x300?text=Frontend+VM+→+Backend+VM+→+PostgreSQL+VM)

- **Frontend VM (VM3)**: React application served by Nginx. Proxies API calls to the backend VM.
- **Backend VM (VM2)**: Node.js + Express REST API. Connects to the PostgreSQL database.
- **Database VM (VM1)**: PostgreSQL server. Stores spells (tasks) persistently.
- **Communication**: HTTP over private network. CORS enabled.

---

## 🚀 Features

- ✨ **Modern glassmorphism UI** – soft gradients, rounded cards, smooth animations.
- ⚡ **Real‑time task status** – mark tasks as `PENDING` / `EXECUTED` (completed).
- 🧙 **Magic spell theme** – tasks are called “spells”, adding a playful console vibe.
- 🔁 **RESTful API** – full CRUD operations (Create, Read, Update, Delete).
- 💾 **Persistent storage** – PostgreSQL database (data survives restarts).
- 🐳 **Docker‑ready** – each tier can be containerised (optional).
- 🔒 **Systemd integration** – auto‑start and restart on VM boot.

---

## 🛠️ Technologies Used

| Component       | Technology                                 |
|----------------|--------------------------------------------|
| Frontend       | React, Axios, Styled‑Components, FontAwesome, Nginx |
| Backend        | Node.js, Express, CORS, `pg` (PostgreSQL client) |
| Database       | PostgreSQL 15+                             |
| Process Manager| systemd                                    |
| Firewall       | UFW                                        |
| OS             | Ubuntu 22.04 / 24.04 (or any Linux)        |

---

## 📦 Deployment Guide (Three Separate VMs)

### Prerequisites
- Three Linux VMs (or machines) with **Ubuntu 22.04+**.
- **VM1 (Database)** IP – e.g., `192.168.29.100`
- **VM2 (Backend)** IP – e.g., `192.168.29.101`
- **VM3 (Frontend)** IP – e.g., `192.168.29.102` (public access point)
- All VMs have internet access to install packages.

---

## 🗄️ 1. Database VM (VM1) – PostgreSQL Setup

### 1. Install PostgreSQL
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y postgresql postgresql-contrib
