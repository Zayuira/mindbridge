# 🧠 Mind Bridge — Ухаалаг Фриланс Платформ

AI технологиор баяжуулсан Монголын анхны фрилансеруудын ухаалаг платформ.

---

## 📋 Шаардлагатай програм хангамж

Системийг ажиллуулахын өмнө дараах програмуудыг суулгасан байх шаардлагатай:

| Програм | Хувилбар | Шалгах команд |
|---|---|---|
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |
| PostgreSQL | 14+ | `psql --version` |
| Redis | 7+ | `redis-cli --version` |
| Python | 3.10+ | `python3 --version` |
| Git | 2+ | `git --version` |

---

## 🚀 Анх удаа ажиллуулах (Setup)

### 1. Dependency суулгах

```bash
# Node.js packages суулгах
npm install
```

### 2. Environment Variables тохируулах

```bash
# .env файл үүсгэж доорх утгуудыг оруулна
cp .env.example .env
```

`.env` файлын агуулга:
```env
DATABASE_URL="postgresql://postgres:таны_нууц_үг@localhost:5432/freelance_db"
NEXTAUTH_SECRET="тохиргооны_нууц_түлхүүр"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="jwt_нууц_түлхүүр"
AI_SERVICE_URL=http://localhost:8000
```

### 3. PostgreSQL Database үүсгэх

```bash
# PostgreSQL руу нэвтрэх
psql -U postgres

# Database үүсгэх (psql дотор)
CREATE DATABASE freelance_db;

# Гарах
\q
```

### 4. Prisma Migration ажиллуулах (Хүснэгтүүд үүсгэх)

```bash
# Schema-г database руу migrate хийх
npx prisma migrate dev --name init

# Prisma Client дахин generate хийх
npx prisma generate
```

### 5. Seed Data оруулах (Туршилтын өгөгдөл)

```bash
# Жишээ хэрэглэгчид, ажлын зар, ур чадвар оруулах
npx prisma db seed
```

### 6. Redis сервер эхлүүлэх

```bash
# Redis сервер ажиллуулах
redis-server

# Тусдаа terminal дээр Redis ажиллаж байгаа эсэхийг шалгах
redis-cli ping
# Хариу: PONG
```

### 7. Хөгжүүлэлтийн сервер ажиллуулах

```bash
# Next.js dev server эхлүүлэх
npm run dev
```

Хөтчөөр [http://localhost:3000](http://localhost:3000) руу орно.

---

## 🗄️ Өгөгдлийн сангийн командууд

### Prisma Studio (Визуал DB browser)

```bash
# Хүснэгтүүдийг вэб интерфэйсээр харах (http://localhost:5555)
npx prisma studio
```

### Хүснэгтүүдийг terminal-аас шууд харах

```bash
# Бүх хүснэгтийн жагсаалт харах
psql -U postgres -d freelance_db -c "\dt"

# Тодорхой хүснэгтийн бүтэц (талбарууд) харах
psql -U postgres -d freelance_db -c "\d \"User\""
psql -U postgres -d freelance_db -c "\d \"Job\""
psql -U postgres -d freelance_db -c "\d \"Proposal\""
psql -U postgres -d freelance_db -c "\d \"Contract\""
psql -U postgres -d freelance_db -c "\d \"FreelancerProfile\""
psql -U postgres -d freelance_db -c "\d \"ClientProfile\""
psql -U postgres -d freelance_db -c "\d \"Payment\""
psql -U postgres -d freelance_db -c "\d \"Review\""
psql -U postgres -d freelance_db -c "\d \"Message\""
psql -U postgres -d freelance_db -c "\d \"Skill\""
psql -U postgres -d freelance_db -c "\d \"Milestone\""
psql -U postgres -d freelance_db -c "\d \"AIRecommendation\""
psql -U postgres -d freelance_db -c "\d \"FreelancerSkill\""
```

### Хүснэгтийн өгөгдөл харах (SELECT)

```bash
# Бүх хэрэглэгчдийг харах
psql -U postgres -d freelance_db -c "SELECT id, email, full_name, role FROM \"User\";"

# Бүх ажлын зарыг харах
psql -U postgres -d freelance_db -c "SELECT id, title, status, budget_min, budget_max FROM \"Job\";"

# Клиент профайлуудыг харах
psql -U postgres -d freelance_db -c "SELECT id, company_name, industry, location FROM \"ClientProfile\";"

# Фрилансер профайлуудыг харах
psql -U postgres -d freelance_db -c "SELECT id, title, hourly_rate, availability FROM \"FreelancerProfile\";"

# Proposal-уудыг харах
psql -U postgres -d freelance_db -c "SELECT id, job_id, status, bid_amount FROM \"Proposal\";"

# Гэрээнүүдийг харах
psql -U postgres -d freelance_db -c "SELECT id, job_id, status, agreed_amount FROM \"Contract\";"

# Үнэлгээнүүдийг харах
psql -U postgres -d freelance_db -c "SELECT id, rating, comment FROM \"Review\";"

# Мессежүүдийг харах
psql -U postgres -d freelance_db -c "SELECT id, sender_id, content, is_read FROM \"Message\" LIMIT 20;"

# Ур чадваруудыг харах
psql -U postgres -d freelance_db -c "SELECT id, name, category FROM \"Skill\";"

# Төлбөрүүдийг харах
psql -U postgres -d freelance_db -c "SELECT id, amount, status, paid_at FROM \"Payment\";"

# Нийт бичлэгийн тоо хүснэгт бүрээр
psql -U postgres -d freelance_db -c "
  SELECT 'User' as table_name, COUNT(*) FROM \"User\"
  UNION ALL SELECT 'Job', COUNT(*) FROM \"Job\"
  UNION ALL SELECT 'Proposal', COUNT(*) FROM \"Proposal\"
  UNION ALL SELECT 'Contract', COUNT(*) FROM \"Contract\"
  UNION ALL SELECT 'FreelancerProfile', COUNT(*) FROM \"FreelancerProfile\"
  UNION ALL SELECT 'ClientProfile', COUNT(*) FROM \"ClientProfile\"
  UNION ALL SELECT 'Review', COUNT(*) FROM \"Review\"
  UNION ALL SELECT 'Message', COUNT(*) FROM \"Message\"
  UNION ALL SELECT 'Payment', COUNT(*) FROM \"Payment\"
  UNION ALL SELECT 'Skill', COUNT(*) FROM \"Skill\";
"
```

### Prisma-ээр хүснэгт удирдах

```bash
# Schema өөрчилсний дараа migration үүсгэх
npx prisma migrate dev --name тайлбар_энд

# Production-д migration ажиллуулах
npx prisma migrate deploy

# Database бүрэн reset хийх (бүх өгөгдөл устана!)
npx prisma migrate reset

# Prisma Client дахин generate
npx prisma generate

# Одоогийн schema-г шууд DB руу push хийх (migration-гүй)
npx prisma db push
```

---

## 🤖 AI Matching сервис (Python FastAPI)

### AI сервис суулгах

```bash
# Python virtual environment үүсгэх
python3 -m venv .venv

# Virtual environment идэвхжүүлэх
source .venv/bin/activate        # macOS/Linux

# Шаардлагатай сангууд суулгах
pip install fastapi uvicorn sentence-transformers spacy numpy

# spaCy-ийн NLP model татах
python3 -m spacy download en_core_web_sm
```

### AI сервис ажиллуулах

```bash
# Virtual environment идэвхжүүлэх
source .venv/bin/activate

# FastAPI сервер эхлүүлэх (port 8000)
uvicorn src.app.api.ai-service.main:app --reload --port 8000
```

### AI сервис шалгах

```bash
# Health check — AI сервис ажиллаж байгаа эсэх
curl http://localhost:8000/health

# Хүлээгдэж буй хариу:
# {"status":"healthy","service":"ai-matching","vectors":"simulated"}

# AI Matching туршилт (тохирох фрилансер хайх)
curl -X POST http://localhost:8000/match \
  -H "Content-Type: application/json" \
  -d '{
    "job_title": "E-Commerce Website",
    "job_description": "Next.js ашиглан e-commerce сайт хийх",
    "job_budget_max": 5000000,
    "required_skills": ["Next.js", "React", "TypeScript"],
    "freelancers": [
      {
        "id": "fl1",
        "title": "Full-Stack Developer",
        "bio": "React, Node.js мэргэжилтэй",
        "hourly_rate": 45000,
        "skills": ["React", "Node.js", "TypeScript"],
        "avg_rating": 4.8,
        "completed_jobs": 15
      }
    ]
  }'

# Semantic Search туршилт
curl -X POST "http://localhost:8000/semantic-search?query=react%20developer"
```

---

## 🔴 Redis Cache шалгах

```bash
# Redis сервер ажиллаж байгаа эсэх шалгах
redis-cli ping
# Хариу: PONG

# Бүх cache key-г жагсаах
redis-cli KEYS "*"

# Тодорхой key-ийн утга харах
redis-cli GET "jobs:list:::1:10"
redis-cli GET "admin:dashboard:stats"

# Key-ийн хүчинтэй хугацаа (TTL) харах
redis-cli TTL "jobs:list:::1:10"

# Бүх cache цэвэрлэх
redis-cli FLUSHALL

# Redis-ийн мэдээлэл харах (server info)
redis-cli INFO stats

# Cache-ийн ажиллагааг real-time хянах
redis-cli MONITOR
```

---

## 🌐 API Endpoint туршилт (curl)

### Бүртгэл

```bash
# Шинэ клиент бүртгэх
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Тест Хэрэглэгч",
    "role": "CLIENT"
  }'

# Шинэ фрилансер бүртгэх
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "freelancer@example.com",
    "password": "password123",
    "full_name": "Тест Фрилансер",
    "role": "FREELANCER"
  }'
```

### Ажлын зар

```bash
# Бүх нээлттэй ажлын зарыг авах
curl http://localhost:3000/api/jobs

# Хайлтаар шүүх
curl "http://localhost:3000/api/jobs?search=website&skill=React&page=1&limit=5"
```

### Фрилансер

```bash
# Бүх фрилансерийг жагсаах
curl http://localhost:3000/api/freelancers

# Ур чадвараар шүүх
curl "http://localhost:3000/api/freelancers?skill=React"
```

---

## 📦 Build & Production

```bash
# Production build хийх
npm run build

# Production сервер ажиллуулах
npm run start

# TypeScript алдаа шалгах
npx tsc --noEmit

# Lint шалгах
npm run lint
```

---

## 📁 Төслийн бүтэц

```
diploma/
├── prisma/
│   ├── schema.prisma          # Өгөгдлийн сангийн schema
│   ├── seed.ts                # Туршилтын өгөгдөл оруулах
│   └── migrations/            # Database migration-ууд
├── src/
│   ├── app/
│   │   ├── api/               # Backend API Routes (13 бүлэг)
│   │   ├── (auth)/            # Нэвтрэх/Бүртгэл хуудсууд
│   │   ├── admin/             # Admin dashboard
│   │   ├── jobs/              # Ажлын зар хуудсууд
│   │   ├── freelancers/       # Фрилансер хуудсууд
│   │   ├── contracts/         # Гэрээний хуудсууд
│   │   ├── messages/          # Мессеж/чат
│   │   ├── profile/           # Профайл хуудсууд
│   │   └── payments/          # Төлбөрийн хуудас
│   ├── components/            # UI компонентууд
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── redis.ts           # Redis cache client + helpers
│   │   ├── s3.ts              # AWS S3 файл удирдлага
│   │   ├── elasticsearch.ts   # Full-text хайлт
│   │   └── utils.ts           # Utility функцууд
│   └── middleware.ts          # RBAC middleware
├── types/
│   └── next-auth.d.ts         # NextAuth type augmentation
├── SYSTEM_DOCUMENTATION.md    # Системийн бүрэн баримт бичиг
├── package.json
├── tsconfig.json
└── .env                       # Environment variables
```

---

## 🔗 Холбоосууд

- **Хөтчөөр нээх**: [http://localhost:3000](http://localhost:3000)
- **Prisma Studio**: [http://localhost:5555](http://localhost:5555) (`npx prisma studio`)
- **AI Service**: [http://localhost:8000](http://localhost:8000) (FastAPI)
- **AI Docs**: [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)
