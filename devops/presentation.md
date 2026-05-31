# BÀI THUYẾT TRÌNH MÔN DEVOPS — UIT BUDDY

## Thời lượng: 20 phút | ~35 slides | Ít chữ — nhiều hình ảnh

---

## SLIDE 1 — Trang bìa

**UIT BUDDY**
*Ứng dụng đồng hành cùng sinh viên UIT trong học tập*

- Môn: DevOps trong phát triển phần mềm - SE359.Q21
- Nhóm: UIT BUDDY
- GVHD: Võ Tuấn Kiệt

> 📷 Logo UIT góc trên bên trái

---

## SLIDE 2 — Giới thiệu thành viên

| STT | Họ và tên     | MSSV     | Vai trò          | Ảnh thành viên |
| --- | ---------------- | -------- | ----------------- | ----------------- |
| 1   | Phan Đình Minh | 23520949 | Frontend / DevOps | Place holder      |
| 2   | Võ Minh Tiến   | 24521789 | Backend / DevOps  | Place holder      |

---

## SLIDE 3 — Giới thiệu đề tài

**Vấn đề:** Sinh viên UIT phải vào nhiều nền tảng khác nhau (Moodle, DAA Portal, email...) mà không có nơi tập trung.

**Giải pháp — UIT Buddy:**
Ứng dụng di động (Android/iOS) tích hợp trong một nền tảng duy nhất:

- 📅 Lịch học & Deadline
- 📊 Điểm & tiến độ học tập
- 📰 Mạng xã hội nội bộ
- 💬 Chat & Video call
- 📁 Lưu trữ tài liệu
- 🔔 Push Notification

> 📷 2–3 screenshot giao diện app

---

## SLIDE 4 — Tổng quan kiến trúc hệ thống

*(Slide chứa sơ đồ lớn — ít chữ)*

**3 Repositories — 1 Tổ chức GitHub:**

| Repo                       | Vai trò                                 |
| -------------------------- | ---------------------------------------- |
| UIT-Buddy-Backend          | Spring Boot API + Terraform + Dockerfile |
| UIT-Buddy-Frontend-App     | Flutter App                              |
| UIT-Buddy-GitOps-Manifests | Cấu hình deploy production             |

> 📷 Github Repo

---

## SLIDE 5 — Công nghệ DevOps sử dụng

*(Slide overview — 1 hình tổng quan)*

| Hạng mục       | Công nghệ                                                         |
| ---------------- | ------------------------------------------------------------------- |
| Cloud            | **AWS** (EC2, RDS, S3, CloudFront, IAM, Secrets Manager, VPC) |
| Container        | **Docker** / Podman                                           |
| IaC              | **Terraform**                                                 |
| CI/CD            | **GitHub Actions**                                            |
| Registry         | **GHCR** (GitHub Container Registry)                          |
| App Distribution | **Firebase** App Distribution                                 |

---

## SLIDE 6 — AWS Architecture Overview

*(Slide chứa diagram — ít chữ)*

**Tất cả hạ tầng chạy trên AWS Region: `ap-southeast-2` (Sydney)**

> 📷 AWS Architecture Diagram

---

## SLIDE 7 — AWS VPC & Networking

*(Hình minh hoạ VPC)*

```
VPC  10.0.0.0/16
├── Public Subnet  10.0.1.0/24  (AZ-a)  → EC2 + Elastic IP
├── Private Subnet 10.0.10.0/24 (AZ-a)  → RDS PostgreSQL
└── Private Subnet 10.0.11.0/24 (AZ-b)  → Dự phòng Multi-AZ
```

- **Internet Gateway** → Route Table Public → EC2
- **RDS không có public endpoint** — chỉ EC2 mới kết nối được

> 📷VPC image

---

## SLIDE 8 — AWS EC2

**EC2 Instance:** `t3.small` — Ubuntu 24.04 LTS — 30GB gp3

**Vai trò của EC2:**

- 🏃 Chạy toàn bộ containers (Backend, Redis, AI, Neo4j, n8n)
- 🤖 **GitHub Actions Self-Hosted Runner** (CD deployment)
- 📌 **Elastic IP** → Static public IP, không đổi khi restart

**Truy cập:** AWS SSM Session Manager *(không mở SSH port 22)*

> 📷 AWS Console: EC2 instance + Elastic IP

---

## SLIDE 9 — AWS RDS

**AWS RDS PostgreSQL 17** — Fully Managed

| Thông số     | Giá trị                                |
| -------------- | ---------------------------------------- |
| Instance       | `db.t3.micro`                          |
| Storage        | 20 GB gp3                                |
| Subnet         | Private (không public)                  |
| Security Group | Chỉ cho phép EC2 kết nối (port 5432) |

- **Managed service**: AWS lo backup, patch, failover
- Backend kết nối qua JDBC endpoint nội bộ trong VPC

> 📷 AWS Console: RDS instance

---

## SLIDE 10 — AWS S3 + CloudFront CDN

**S3 Bucket** — Lưu trữ tài liệu, ảnh, video của sinh viên

- **Block All Public Access** — không ai truy cập trực tiếp
- Chỉ **CloudFront** mới có quyền đọc (qua OAC SigV4)

**CloudFront CDN** — Phân phối nội dung toàn cầu

```
Mobile App → CloudFront (HTTPS) → S3 (private)
```

- HTTPS enforced (redirect HTTP → HTTPS)
- Cache tối ưu với `CachingOptimized` policy

> 📷 AWS Console: S3 bucket + CloudFront distribution

---

## SLIDE 11 — AWS IAM — Least Privilege

**Nguyên tắc:** Mỗi thành phần chỉ có đúng quyền cần thiết

| Identity             | Quyền                                                     |
| -------------------- | ---------------------------------------------------------- |
| EC2 IAM Role         | SSM Session Manager + Secrets Manager Read + S3 Read/Write |
| S3 Client (IAM User) | S3 PutObject + DeleteObject only                           |
| CloudFront           | S3 GetObject (qua OAC)                                     |

- **Không dùng root account**
- **Không hardcode access key** trong EC2 → dùng IAM Role

> 📷 AWS Console: IAM Roles / Policies

---

## SLIDE 12 — AWS Secrets Manager

**Lưu trữ secrets an toàn — không hardcode trong code**

```
Terraform tạo secret:
  uitbuddy/backend/secrets-v2
    → POSTGRES_PASSWORD

EC2 đọc qua IAM Role (không cần access key)
```

**GitHub Secrets** (cho CI/CD):

- `BACKEND_ENV_FILE` — toàn bộ env production
- `FIREBASE_ADMINSDK_JSON` — Firebase credentials
- `KEYSTORE_BASE64` — Android signing key

> 📷 AWS Console: Secrets Manager + GitHub Secrets settings

---

## SLIDE 13 — Terraform as Infrastructure as Code

**Toàn bộ hạ tầng AWS được định nghĩa bằng Terraform**

```
infrastructure/terraform/
├── network.tf    → VPC, Subnets, IGW, Route Tables
├── ec2.tf        → EC2, Elastic IP
├── rds.tf        → RDS PostgreSQL 17
├── s3.tf         → S3 + CloudFront + OAC
├── iam.tf        → Roles, Policies, Instance Profile
├── security.tf   → Security Groups
└── secrets.tf    → AWS Secrets Manager
```

✅ **Reproducible** — tái tạo toàn bộ hạ tầng bằng 1 lệnh
✅ **Version controlled** — mọi thay đổi infra đều qua Git

> 📷 `Terraform icon`

---

## SLIDE 14 — Docker — Containerization

**Đóng gói Backend & AI thành Docker Image**

- **Dockerization:** Cả Backend (Spring Boot) và AI (Python) đều được đóng gói thành các docker image độc lập.
- **Multi-stage Build:** Sử dụng quy trình build nhiều giai đoạn để tối ưu hóa kích thước image và giữ môi trường runtime sạch sẽ.
- **Portability:** Đảm bảo ứng dụng chạy đồng bộ và nhất quán trên mọi môi trường (Local, Staging, Production).

**Lợi ích:**

- 🔽 Tối ưu kích thước image chạy Production (loại bỏ các dependency build dư thừa)
- ⚡ Triển khai nhanh chóng và đồng bộ trên mọi môi trường

> 📷 Quy trình đóng gói Docker Image của Backend và AI

---

## SLIDE 15 — Docker Compose — Local Development

**`docker-compose.yml`** — Môi trường local cho dev

```yaml
services:
  postgres:   # PostgreSQL 17 Alpine
  redis:      # Redis 8 Alpine
  backend:
    build: .  # Build từ Dockerfile local
    env_file: .env
    depends_on: [postgres, redis]
```

**Lệnh nhanh (Makefile):**

```bash
make dev    # Chạy infra + Spring Boot dev mode
make up     # Chạy tất cả containers
make down   # Dừng tất cả
make logs   # Xem logs real-time
```

> 📷 Terminal: `docker compose ps` local

---

## SLIDE 16 — Docker Compose — Production

**`docker-compose.backend.prod.yaml`** — Deploy lên EC2

```yaml
services:
  redis:
    image: redis:8-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]  ✅
  backend:
    image: ghcr.io/uit-buddy/backend:${IMAGE_TAG}  ✅
    restart: always                                 ✅
    depends_on:
      redis:
        condition: service_healthy                  ✅
  pgadmin:   # DB monitoring UI
```

**Dev vs Prod:**

- Dev → `build: .` (local) | Prod → pull từ GHCR
- Dev → Local PostgreSQL | Prod → AWS RDS

> 📷 Sơ đồ Dev vs Prod environment

---

## SLIDE 17 — Production: 6 Containers trên EC2

*(Slide hình — ít chữ)*

```
EC2 (t3.small)
├── 🟢 uit-buddy-backend  :8080   Spring Boot API
├── 🟢 buddy-redis        :6379   Cache / Session
├── 🟢 buddy-pgadmin      :5050   DB Monitoring
├── 🟢 uit-buddy-ai       :8000   AI Service (Python)
├── 🟢 buddy-neo4j        :7474   Graph Database
└── 🟢 buddy-n8n          :5678   Workflow Automation
```

Quản lý bằng 3 `docker-compose` file riêng biệt

---

## SLIDE 18 — GitOps: Tách biệt Code và Config

**Vì sao cần repo GitOps riêng?**

| Repo                           | Mục đích                    |
| ------------------------------ | ------------------------------ |
| `UIT-Buddy-Backend`          | Source code, CI pipeline       |
| `UIT-Buddy-GitOps-Manifests` | Docker Compose prod, env files |

**Lợi ích:**

- 🔒 Secrets/config production **không nằm trong code repo**
- 🔄 Thay đổi config prod **không trigger CI** (build lại)
- 📜 Audit trail riêng cho infra changes

**CD workflow checkout GitOps repo:**

```
branch: main-aws  → docker-compose.*.prod.yaml + backend.env
```

> 📷 GitHub: gitop repo

---

## SLIDE 19 — CI/CD Philosophy: Branch Protection

**Nguyên tắc: Không có code nào vào `main` mà chưa được kiểm tra**

```
Feature Branch
    │
    ├─ Pull Request → main
    │       │
    │       └─ GitHub Actions CI chạy tự động
    │               ✅ Format Check
    │               ✅ Unit Tests
    │               ✅ Build
    │
    │  (CI pass → Merge được phép)
    │
    └─ Merge vào main
            │
            └─ GitHub Actions CD tự động deploy
```

> 📷 GitHub: Branch protection rules settings

---

## SLIDE 20 — Backend CI Pipeline: Trigger

**Trigger:**

- `pull_request` → main: chạy CI (gate cho merge)
- `push` → main: chạy CI + build Docker image

```yaml
on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]
```

> 📷 GitHub Actions: danh sách workflow runs

---

## SLIDE 21 — Backend CI Pipeline: 3 Jobs

*(Slide diagram flow)*

```
[Job 1] Format & Import Check
   ↓ (needs: job1)
[Job 2] Build & Unit Tests
   ↓ mvnw test → Publish Test Results
   ↓ (needs: job2, only on push to main)
[Job 3] Build & Push Docker Image
   → Login GHCR
   → docker build & push
   → ghcr.io/uit-buddy/backend:{SHA} + :latest
```

- Job 1 fail → Job 2 không chạy
- PR không trigger Job 3 (chỉ push mới build image)

> 📷 GitHub Actions: CI workflow graph (3 jobs)

---

## SLIDE 22 — Backend CI: Format & Test (chi tiết)

**Job 1 — Format Check:**

```bash
./mvnw net.revelc.code.formatter:formatter-maven-plugin:validate
```

**Job 2 — Build & Test:**

```bash
./mvnw test -DfailIfNoTests=false
# → Publish kết quả test qua dorny/test-reporter
# → Kết quả hiển thị ngay trên Pull Request UI
```

✅ Code không đúng format → **CI fail → không merge được**
✅ Test fail → **CI fail → không merge được**

> 📷 GitHub PR: CI checks status + Test results comment

---

## SLIDE 23 — Backend CI: Build & Push Docker Image

**Job 3 — Build & Push (chỉ khi push vào main):**

```yaml
- name: Log in to GitHub Container Registry
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}   # Không cần PAT riêng

- name: Build and push
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: |
      ghcr.io/uit-buddy/backend:${{ github.sha }}
      ghcr.io/uit-buddy/backend:latest
```

**2 tags:** `{commit-SHA}` (pinned) + `latest`

> 📷 GitHub Packages: Image list với các tags

---

## SLIDE 24 — GitHub Container Registry (GHCR)

*(Slide hình — ít chữ)*

**`ghcr.io/uit-buddy/backend`**
**`ghcr.io/uit-buddy/ai`**

| Lợi ích GHCR                                                         |
| ---------------------------------------------------------------------- |
| ✅ Tích hợp sẵn với GitHub Organization                            |
| ✅ Xác thực bằng `GITHUB_TOKEN` — không cần credentials riêng |
| ✅ Gắn trực tiếp với repo — visibility đồng bộ                 |
| ✅ Miễn phí cho public packages                                      |

> 📷 GitHub Packages page: list images + tags + pull command

---

## SLIDE 25 — Backend CD Pipeline: Trigger

**CD được trigger SAU KHI CI thành công**

```yaml
on:
  workflow_run:
    workflows: ["UIT Buddy Backend CI flow"]
    types: [completed]
    branches: [main]

jobs:
  deploy:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: self-hosted   # ← Chạy trên EC2!
```

**Concurrency control:**

```yaml
concurrency:
  group: production-deployment
  cancel-in-progress: false  # Không cancel deploy đang chạy
```

> 📷 GitHub Actions: CD workflow triggered by CI

---

## SLIDE 26 — Self-Hosted Runner: Cơ chế hoạt động

*(Slide diagram — ít chữ)*

```
GitHub Actions (cloud)
        │
        │  Trigger CD job
        ▼
  Self-Hosted Runner
  (chạy ngay trên EC2)
        │
        ├─ Checkout GitOps Manifests repo
        ├─ Inject secrets (backend.env, Firebase JSON)
        └─ Chạy: IMAGE_TAG=$SHA make backend-up
                    │
                    └─ podman pull ghcr.io/uit-buddy/backend:{SHA}
                    └─ podman-compose up -d --force-recreate
```

**EC2 vừa là server chạy app vừa là CI/CD agent!**

> 📷 Diagram: GitHub Actions cloud → EC2 self-hosted runner

---

## SLIDE 27 — Self-Hosted Runner: Setup tự động

**EC2 User Data** — Tự động cài đặt khi khởi động lần đầu

```bash
#!/bin/bash
# 1. Cài Podman + podman-compose
apt-get install -y podman podman-compose

# 2. Tạo user riêng cho runner
useradd -m github-runner

# 3. Download & install GitHub Actions Runner
# 4. Đăng ký runner với repo (--unattended, không cần thao tác thủ công)
./config.sh --url https://github.com/UIT-Buddy/... \
            --token ${runner_token} --unattended

# 5. Chạy như systemd service (auto-start khi reboot)
./svc.sh install && ./svc.sh start
```

✅ **Zero manual setup** — EC2 bật lên là runner sẵn sàng

> 📷 GitHub: Settings → Actions → Runners → runner "Online"

---

## SLIDE 28 — CD Deploy Flow: Pull Image từ GHCR về EC2

*(Slide diagram chi tiết — ít chữ)*

```
GitHub Actions CI  (ubuntu-latest cloud)
  └─ Build Docker image
  └─ Push → ghcr.io/uit-buddy/backend:{SHA}
                        │
                        │ GHCR stores image
                        │
GitHub Actions CD  (self-hosted = EC2)
  └─ checkout GitOps Manifests
  └─ Inject: backend.env + Firebase credentials
  └─ IMAGE_TAG={SHA} make backend-up
        │
        ├─ podman pull ghcr.io/uit-buddy/backend:{SHA}
        │     (EC2 → GHCR: pull exact version)
        │
        └─ podman-compose up -d --force-recreate
              → uit-buddy-backend container running ✅
```

> 📷 Diagram hoặc screenshot CD job logs showing podman pull

---

## SLIDE 29 — CD Deploy: Secret Injection

**Secrets không lưu trong repo — tạo at runtime**

```yaml
# Bước 1: Tạo backend.env từ GitHub Secret
- name: Create backend.env from secret
  run: printf "%s" "$BACKEND_ENV_CONTENT" > gitops-manifests/backend.env

# Bước 2: Tạo Firebase JSON từ GitHub Secret
- name: Create Firebase Admin SDK JSON
  run: printf "%s" "$FIREBASE_JSON_CONTENT" > gitops-manifests/uit-buddy-...json

# Bước 3: Deploy
- name: Deploy
  run: IMAGE_TAG=${{ github.event.workflow_run.head_sha }} make backend-up
```

> 📷 GitHub Secrets: danh sách tên secrets (không hiện giá trị)

---

## SLIDE 30 — Frontend CI Pipeline

**Trigger:** `pull_request` → validate | `push` → build & deploy

**Job 1 — Validate (chỉ chạy khi PR):**

```
Setup Flutter 3.38.6
→ flutter pub get
→ dart run build_runner
→ dart format --set-exit-if-changed   ← Format check
→ flutter analyze --fatal-warnings    ← Lint check
→ flutter test                        ← Unit tests
```

✅ Tương tự Backend — **không qua CI thì không merge**

> 📷 GitHub Actions: Frontend CI workflow

---

## SLIDE 31 — Frontend CI: Build & Upload to Firebase

**Job 2 — Build & Deploy (chỉ chạy khi push vào main):**

```
Setup Flutter → pub get
→ Inject google-services.json (from secret)
→ Inject .env (from secret)
→ Decode keystore từ Base64 (from secret)
→ flutter build apk --release
    --build-name=v1.0.{RUN_NUMBER}-{DATE}
→ Upload APK → Firebase App Distribution
    (nhóm: tester)
```

**Version:** `v1.0.42-2026-05-25`

> 📷 Firebase App Distribution: list builds + tester group

---

## SLIDE 32 — Full CI/CD Overview (Backend)

*(Slide 1 diagram lớn duy nhất)*

```
Developer → Push code → Pull Request
                │
          [CI — ubuntu-latest]
          ✅ Format Check
          ✅ Unit Tests
          ✅ Build Docker Image
          ✅ Push → GHCR (ghcr.io/uit-buddy/backend:{SHA})
                │
          (CI success → CD trigger)
                │
          [CD — self-hosted runner on EC2]
          📥 Pull image từ GHCR
          🔐 Inject secrets
          🚀 podman-compose up --force-recreate
                │
          🟢 Production running on EC2
```

> 📷 GitHub Actions: full workflow view (CI + CD linked)

---

## SLIDE 33 — Full CI/CD Overview (Frontend)

*(Slide 1 diagram lớn)*

```
Developer → Pull Request
                │
          [CI — ubuntu-latest]
          ✅ Format, Lint, Unit Tests
                │
          Merge vào main
                │
          [CI — ubuntu-latest]
          📦 Build APK → Firebase App Distribution → Testers
```

> 📷 Sơ đồ hoặc GitHub Actions view

---

## SLIDE 34 — Tổng kết DevOps Practices

| Practice                     | Công cụ                                                            |
| ---------------------------- | -------------------------------------------------------------------- |
| **IaC**                | Terraform (AWS: VPC, EC2, RDS, S3, CloudFront, IAM, Secrets Manager) |
| **Containerization**   | Docker Multi-stage build + Docker Compose                            |
| **Container Registry** | GitHub Container Registry (GHCR)                                     |
| **CI Pipeline**        | GitHub Actions — Format, Test, Build, Push                          |
| **CD Pipeline**        | GitHub Actions — Self-hosted runner kéo image về EC2              |
| **GitOps**             | Tách repo GitOps Manifests riêng                                   |
| **Secret Management**  | GitHub Secrets + AWS Secrets Manager                                 |
| **App Distribution**   | Firebase App Distribution                                            |
| **Branch Protection**  | CI phải pass → mới merge được vào main                        |

---

## SLIDE 35 — Cảm ơn & Q&A

**Q&A** 🎤

*(Slide đơn giản, hình nền đẹp)*
