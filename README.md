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
```

### 2. Start and enable PostgreSQL
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 3. Allow remote connections
Edit `postgresql.conf`:
```bash
sudo nano /etc/postgresql/*/main/postgresql.conf
```
Change `#listen_addresses = 'localhost'` to:
```
listen_addresses = '*'
```

Edit `pg_hba.conf` to allow connections from the backend VM:
```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```
Add at the end (replace subnet with your backend VM’s IP range):
```
host    magichub    magicuser    192.168.29.0/24    md5
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### 4. Create database, user, and table
```bash
sudo -u postgres psql << EOF
CREATE DATABASE magichub;
CREATE USER magicuser WITH PASSWORD 'magicpass';
GRANT ALL PRIVILEGES ON DATABASE magichub TO magicuser;
EOF

sudo -u postgres psql -d magichub << EOF
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE
);

INSERT INTO todos (text, completed) VALUES
('🐳 Learn Docker with KartikeyaSoft Cloud Lab', false),
('⚡ Cast your first server spell: nginx', false),
('📦 Build a custom server image for your app', false),
('🌐 Expose server ports with -p magic', false),
('🔁 Use docker-compose to orchestrate multi-server spells', false);
EOF
```

### 5. Grant privileges to `magicuser`
```bash
sudo -u postgres psql -d magichub -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO magicuser;"
```

### 6. Open firewall on DB VM
```bash
sudo ufw allow from <backend-vm-ip> to any port 5432
sudo ufw enable
```

---

## ⚙️ 2. Backend VM (VM2) – Node.js API

### 1. Install Node.js 18.x
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Create backend directory
```bash
mkdir -p /home/ks/nodejs-3tier/backend
cd /home/ks/nodejs-3tier/backend
```

### 4. Install dependencies
```bash
npm install
```

### 6. Replace the DB IP placeholder
```bash
sed -i 's/DB_VM_IP_PLACEHOLDER/192.168.29.36/g' server.js   # use your actual DB VM IP
```

### 7. Test the backend manually
```bash
node server.js
```
Press `Ctrl+C` after confirming it works.

### 8. Create systemd service for auto‑start
```bash
sudo tee /etc/systemd/system/magic-hub-backend.service > /dev/null << EOF
[Unit]
Description=Server Magic Hub Backend
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/home/$USER/nodejs-3tier/backend
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl start magic-hub-backend
sudo systemctl enable magic-hub-backend
```

### 9. Open firewall on backend VM
```bash
sudo ufw allow from <frontend-vm-ip> to any port 5000
sudo ufw enable
```

### 10. Verify the backend API
```bash
curl http://localhost:5000/api/todos
```
Should return the 5 default spells as JSON.

---

## 🎨 3. Frontend VM (VM3) – React + Nginx

### 1. Install Nginx and Node.js 
```bash
sudo apt update
sudo apt install -y nginx curl
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```
### 2. Replace the backend placeholder IP
```bash
sed -i "s|BACKEND_IP_PLACEHOLDER|192.168.29.38|g" src/App.js
```
*(Change `192.168.29.38` to your actual backend IP)*

### 3. Build the React app
```bash
cd /path/to/nodejs-2tier/frontend
npm install
npm run build
```
This creates a `build/` directory with static files.

### 4. Copy the build to Nginx web root
```bash
sudo rm -rf /var/www/html/*
sudo cp -r build/* /var/www/html/
```

### 5. Configure Nginx as reverse proxy (point to backend VM)
Replace `<backend-vm-ip>` with the actual IP of VM2 (e.g., `192.168.29.101`).

```bash
sudo tee /etc/nginx/sites-available/magic-hub-frontend > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://<backend-vm-ip>:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
```

### 6. Enable the site and restart Nginx
```bash
sudo ln -sf /etc/nginx/sites-available/magic-hub-frontend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
```

### 7. Allow HTTP traffic on frontend VM
```bash
sudo ufw allow 80/tcp
sudo ufw enable
```

### 8. Access the application
Open a browser and go to `http://<frontend-vm-ip>`.  
You should see the **Server Magic Input Hub** UI with the 5 default spells loaded from the database.

---

## 🧪 Verification

- **Database VM**: `sudo systemctl status postgresql` – active.
- **Backend VM**: `curl http://localhost:5000/api/todos` – returns JSON.
- **Frontend VM**: Open browser → spells are displayed.

---

## 🧹 Cleanup (if needed)

```bash
# Stop and disable services on each VM
sudo systemctl stop magic-hub-backend
sudo systemctl disable magic-hub-backend
sudo systemctl stop nginx
sudo systemctl disable nginx
sudo systemctl stop postgresql
sudo systemctl disable postgresql
```

---

## 📄 License

MIT © [KartikeyaSoft](https://kartikeyasoft.com)

---

