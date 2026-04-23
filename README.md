
### **1. Namespace**
```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: magic-hub
```

### **2. Database Secret**
```yaml
# db-secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
  namespace: magic-hub
type: Opaque
data:
  POSTGRES_USER: cG9zdGdyZXM=
  POSTGRES_PASSWORD: cG9zdGdyZXM=
  POSTGRES_DB: cG9zdGdyZXM=
  DB_USER: bWFnaWN1c2Vy
  DB_PASSWORD: bWFnaWNwYXNz
  DB_NAME: bWFnaWNodWI=
```

### **3. Database ConfigMap (Init Script)**
```yaml
# db-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: db-init-script
  namespace: magic-hub
data:
  init-db.sql: |
    CREATE DATABASE magichub;
    CREATE USER magicuser WITH PASSWORD 'magicpass';
    GRANT ALL PRIVILEGES ON DATABASE magichub TO magicuser;
    \c magichub;
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
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO magicuser;
    GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO magicuser;
```

### **4. Database PersistentVolume**
```yaml
# db-pv.yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: postgres-pv
  labels:
    type: local
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /mnt/data/postgresql
  persistentVolumeReclaimPolicy: Retain
```

### **5. Database PersistentVolumeClaim**
```yaml
# db-pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: magic-hub
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
```

### **6. Database Deployment**
```yaml
# db-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: magic-hub
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: POSTGRES_USER
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: POSTGRES_PASSWORD
        - name: POSTGRES_DB
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: POSTGRES_DB
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        - name: init-script
          mountPath: /docker-entrypoint-initdb.d
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
      - name: init-script
        configMap:
          name: db-init-script
```

### **7. Database Service**
```yaml
# db-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: db
  namespace: magic-hub
spec:
  selector:
    app: postgres
  ports:
    - port: 5432
      targetPort: 5432
  type: ClusterIP
```

### **8. Backend Deployment**
```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: magic-hub
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: kartikeyasoft/nodejs-backend:v1.1
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 5000
        env:
        - name: DB_HOST
          value: "db"
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: DB_USER
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: DB_PASSWORD
        - name: DB_NAME
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: DB_NAME
        - name: PORT
          value: "5000"
```

### **9. Backend Service**
```yaml
# backend-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: magic-hub
spec:
  selector:
    app: backend
  ports:
    - port: 5000
      targetPort: 5000
  type: ClusterIP
```

### **10. Frontend Deployment**
```yaml
# frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: magic-hub
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: kartikeyasoft/nodejs-frontend:v1.1
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 80
```

### **11. Frontend Service (NodePort)**
```yaml
# frontend-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend
  namespace: magic-hub
spec:
  selector:
    app: frontend
  ports:
    - port: 80
      targetPort: 80
  type: NodePort
```

