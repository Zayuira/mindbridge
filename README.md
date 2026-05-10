# Mind Bridge — Ухаалаг Фриланс Платформ
## Системийн Бүрэн Техникийн Баримт Бичиг

---

## 1. ТӨСЛИЙН ТОЙМ

**Mind Bridge** нь Монголын зах зээлд зориулсан AI-д суурилсан ухаалаг фрилансерийн платформ юм. Энэ систем нь **Клиент** (ажил захиалагч) болон **Фрилансер** (чөлөөт ажилтан) хоёрыг холбож, ажлын зар нийтлэх, санал (proposal) илгээх, гэрээ байгуулах, төлбөр төлөх, мессеж бичих, үнэлгээ өгөх зэрэг бүх үйл явцыг нэг платформ дээр автоматжуулдаг. Онцлог нь **AI Matching** систем ашиглан фрилансер ба ажлыг ухаалгаар тааруулдаг.

---

## 1.1 ФУНКЦИОНАЛЬ ШААРДЛАГУУД (Functional Requirements)

### FR-01: Хэрэглэгчийн бүртгэл ба нэвтрэлт (Authentication)
- **FR-01.1**: Хэрэглэгч email, утас, нууц үг, бүтэн нэр, role (CLIENT/FREELANCER) оруулан бүртгүүлэх боломжтой байна.
- **FR-01.2**: Бүртгэлийн үед email болон утасны дугаар давхцалыг шалгана. Давхардсан email/phone-тэй хэрэглэгч бүртгэхийг хориглоно.
- **FR-01.3**: Нууц үгийг bcrypt (salt rounds: 10) ашиглан hash хэлбэрээр хадгална.
- **FR-01.4**: Бүртгэлийн үед role-д тохируулан автоматаар ClientProfile (CLIENT) эсвэл FreelancerProfile (FREELANCER) үүсгэнэ.
- **FR-01.5**: Хэрэглэгч email + нууц үгээр системд нэвтрэх боломжтой байна.
- **FR-01.6**: Нэвтрэх үед JWT token (id, role, is_verified агуулсан) үүсгэж, session-д хадгална.
- **FR-01.7**: Нэвтэрсэн хэрэглэгч login/register хуудас руу орвол автомат нүүр хуудас руу чиглүүлнэ.
- **FR-01.8**: **Баталгаажуулалт**: Шинэ хэрэглэгч системд нэвтрэхийн өмнө И-мэйл болон Утасны дугаараа 6 оронтой OTP кодоор баталгаажуулах заавал шаардлагатай. Баталгаажаагүй хэрэглэгч бусад хуудас руу хандах боломжгүй.


### FR-02: Хэрэглэгчийн профайл удирдлага (Profile Management)
- **FR-02.1**: Фрилансер өөрийн title, bio, hourly_rate, location, skills засварлах боломжтой.
- **FR-02.2**: Клиент өөрийн company_name, industry, bio, location засварлах боломжтой.
- **FR-02.3**: Бусад хэрэглэгчийн профайлыг userId параметрээр харах боломжтой.
- **FR-02.4**: Профайл хуудаст дундаж үнэлгээ (averageRating), үнэлгээний тоо (reviewCount) автоматаар тооцоологдоно.
- **FR-02.5**: Фрилансерийн профайлд proposals болон contracts жагсаалт харагдана.
- **FR-02.6**: Клиентийн профайлд нийтэлсэн ажлууд болон contracts жагсаалт харагдана.

### FR-03: Ажлын зар нийтлэх (Job Posting)
- **FR-03.1**: Зөвхөн CLIENT role-тэй хэрэглэгч ажлын зар нийтлэх эрхтэй.
- **FR-03.2**: Ажлын зарт title, description, deadline заавал бөглөнө. budget_min, budget_max нь сонголттой.
- **FR-03.3**: Шинэ ажлын зар автоматаар OPEN статустай үүснэ.
- **FR-03.4**: Ажлын зарыг засварлах (PUT) болон устгах (DELETE) боломжтой.
- **FR-03.5**: Ажлын зарт шаардлагатай ур чадвар (skills) холбох боломжтой.

### FR-04: Ажлын зар хайх ба жагсаах (Job Search & Listing)
- **FR-04.1**: Нээлттэй (OPEN) статустай ажлын зарууд жагсаагдана.
- **FR-04.2**: Гарчиг болон тайлбараар текст хайлт хийх боломжтой (search параметр).
- **FR-04.3**: Ур чадвараар шүүх боломжтой (skill параметр).
- **FR-04.4**: Pagination дэмжинэ (page, limit параметр). Default: page=1, limit=10.
- **FR-04.5**: Ажлын зар бүрд клиентийн мэдээлэл (company_name, нэр) болон шаардлагатай skills харагдана.

### FR-05: Санал илгээх (Proposal Submission)
- **FR-05.1**: Зөвхөн FREELANCER role-тэй хэрэглэгч санал илгээх эрхтэй.
- **FR-05.2**: Нэг фрилансер нэг ажилд зөвхөн нэг санал илгээх боломжтой. Давхар санал илгээхийг хориглоно.
- **FR-05.3**: Зөвхөн OPEN статустай ажилд санал илгээх боломжтой.
- **FR-05.4**: Санал нь cover_letter, bid_amount агуулна. Статус автоматаар PENDING болно.
- **FR-05.5**: Клиент өөрийн ажлын санал жагсаалтыг харах боломжтой. Фрилансер өөрийн илгээсэн саналуудыг харна.

### FR-06: Санал зөвшөөрөх / Татгалзах (Proposal Acceptance)
- **FR-06.1**: Зөвхөн CLIENT (ажлын эзэмшигч) эсвэл ADMIN саналыг зөвшөөрөх/татгалзах эрхтэй.
- **FR-06.2**: Санал зөвшөөрөгдөхөд (ACCEPTED) автоматаар:
  - Contract (гэрээ) ACTIVE статустай үүснэ.
  - Job статус IN_PROGRESS болно.
  - Тухайн ажлын бусад бүх санал автомат REJECTED болно.
- **FR-06.3**: Эдгээр бүх өөрчлөлт нэг database transaction дотор хийгдэнэ (атомик үйлдэл).

### FR-07: Гэрээний удирдлага (Contract Management)
- **FR-07.1**: Клиент өөрийн гэрээнүүдийг, фрилансер өөрийн гэрээнүүдийг жагсааж харах боломжтой.
- **FR-07.2**: Гэрээний статусыг ACTIVE → COMPLETED эсвэл CANCELLED болгож шинэчлэх боломжтой.
- **FR-07.3**: Гэрээ COMPLETED болоход Job статус автоматаар CLOSED болно (transaction).
- **FR-07.4**: Гэрээний дэлгэрэнгүйд ажлын мэдээлэл, клиент, фрилансерийн мэдээлэл харагдана.

### FR-08: Төлбөрийн систем (Payment Processing)
- **FR-08.1**: Stripe Checkout Session ашиглан төлбөр хийх боломжтой.
- **FR-08.2**: Төлбөрийн валют MNT (Монгол Төгрөг) байна.
- **FR-08.3**: Амжилттай төлбөрийн дараа contracts хуудас руу redirect хийнэ.
- **FR-08.4**: Төлбөрийн metadata-д jobId, contractId, userId хадгалагдана.

### FR-09: Мессеж / Чат систем (Messaging)
- **FR-09.1**: Нэвтэрсэн хэрэглэгч бусад хэрэглэгчид мессеж илгээх боломжтой.
- **FR-09.2**: Мессеж нь тодорхой ажилтай (jobId) холбоотой байна.
- **FR-09.3**: Өөртөө мессеж илгээхийг хориглоно.
- **FR-09.4**: Хүлээн авагч хэрэглэгч байгаа эсэхийг шалгана.
- **FR-09.5**: Мессежийг уншихад уншаагүй (is_read: false) мессежүүдийг автомат уншигдсан (true) болгоно.
- **FR-09.6**: Бүх харилцааг (conversations) жагсааж давхардалгүйгээр харуулна.

### FR-10: Үнэлгээний систем (Review System)
- **FR-10.1**: Зөвхөн COMPLETED статустай гэрээнд үнэлгээ өгөх боломжтой.
- **FR-10.2**: Зөвхөн гэрээний оролцогч (клиент эсвэл фрилансер) үнэлгээ өгөх эрхтэй.
- **FR-10.3**: Үнэлгээ нь rating (1-5 оноо) болон comment (тайлбар) агуулна.
- **FR-10.4**: Дундаж үнэлгээ (averageRating) автоматаар тооцоологдоно.

### FR-11: AI Matching систем (AI-Based Freelancer Matching)
- **FR-11.1**: Клиент тодорхой ажилд тохирох фрилансеруудыг AI-аар хайх боломжтой.
- **FR-11.2**: AI matching нь дараах 5 хүчин зүйлийг жинлэн тооцоолно:
  - **Ур чадварын семантик ижил байдал (35%)** — SentenceTransformer (`all-MiniLM-L6-v2`) embedding + cosine similarity.
  - **Explicit Skill Match (15%)** — Ур чадваруудын яг таг давхцал. Утга ижил боловч өөрөөр бичигдсэн ур чадваруудыг (жишээ нь: ReactJS, React.js) **Synonym Normalization** ашиглан нэгтгэж тооцно.
  - **Цалингийн тохирол (25%)** — Ажлын төсөв болон фрилансерийн цагийн хөлсний харьцаа (`hourly_rate` vs `budget_max`).
  - **Үнэлгээний оноо (15%)** — Фрилансерийн дундаж үнэлгээ (`avg_rating` / 5.0).
  - **Идэвхийн оноо (10%)** — Хийж гүйцэтгэсэн ажлын тоо (`completed_jobs` / 20).
- **FR-11.3**: Хамгийн тохирох Top 10 фрилансерийг нийт оноогоор (score) эрэмбэлж буцаана.
- **FR-11.4**: spaCy NLP ашиглан текстээс ур чадвар автоматаар ялгана (skill extraction).
- **FR-11.5**: Мэдээллийг хурдан дамжуулах үүднээс NumPy batch processing ашиглан similarity-г нэг зэрэг тооцоолно.

### FR-12: Фрилансер урих (Freelancer Invitation)
- **FR-12.1**: Клиент фрилансерийг тодорхой ажилд урих (invite) боломжтой.
- **FR-12.2**: Урилга PENDING статустай proposal хэлбэрээр үүснэ (ai_relevance_score: 100).
- **FR-12.3**: Урилга илгээхэд фрилансер руу автомат мессеж илгээгдэнэ.
- **FR-12.4**: Нэг фрилансерийг нэг ажилд дахин урихыг хориглоно.

### FR-13: Админ самбар (Admin Dashboard)
- **FR-13.1**: Админ нийт хэрэглэгч, нийт орлого, идэвхтэй ажил, фрилансерийн тоог харах боломжтой.
- **FR-13.2**: Баталгаажаагүй хэрэглэгчдийн тоог харах боломжтой.
- **FR-13.3**: Сүүлийн 5 төлбөрийн жагсаалтыг харах боломжтой.
- **FR-13.4**: Бүх хэрэглэгчдийг нэр, email, role, бүртгэлийн огноо, KYC статусаар жагсаах боломжтой.

---

## 1.2 ФУНКЦИОНАЛЬ БУС ШААРДЛАГУУД (Non-Functional Requirements)

### NFR-01: Гүйцэтгэл (Performance)
- **NFR-01.1**: API хариу өгөх хугацаа ≤ 500ms байх ёстой (Redis cache идэвхтэй үед).
- **NFR-01.2**: Redis Cache-Aside pattern ашиглан давтагдсан query-г 60-180 секунд cache-лэнэ.
- **NFR-01.3**: Зэрэг ажиллуулах боломжтой query-г Promise.all ашиглан параллел гүйцэтгэнэ.
- **NFR-01.4**: Бүх жагсаалтын endpoint-д pagination (skip/take) хэрэгжүүлсэн. Нэг хуудасны хамгийн их хэмжээ 100 бичлэг.
- **NFR-01.5**: Prisma Singleton pattern ашиглан dev горимд олон database connection үүсэхээс хамгаална.
- **NFR-01.6**: Redis доголдсон үед систем DB руу шууд fallback хийж ажиллагаа зогсохгүй (graceful degradation).

### NFR-02: Аюулгүй байдал (Security)
- **NFR-02.1**: Нууц үгийг хэзээ ч cleartext хадгалахгүй. bcrypt (salt rounds: 10) ашиглан hash-лана.
- **NFR-02.2**: Session удирдлагыг JWT стратегиар хийнэ (NextAuth). Token HttpOnly cookie-д хадгалагдана.
- **NFR-02.3**: Role-Based Access Control (RBAC) middleware ашиглан хамгаалагдсан route-уудыг хувь хүний role-оор хязгаарлана.
- **NFR-02.4**: Prisma ORM ашиглан parameterized query хийж SQL Injection-оос хамгаална.
- **NFR-02.5**: AWS S3 файлд хандахдаа presigned URL (хугацаатай — 1 цаг) ашиглана.
- **NFR-02.6**: Environment variable-ууд (.env) source code-д хадгалагдахгүй (.gitignore-д бүртгэлтэй).
- **NFR-02.7**: Multi-Factor Verification: И-мэйл (Nodemailer/SMTP) болон Гар утас (Simulated/SMS) баталгаажуулалтыг OTP кодоор гүйцэтгэнэ.


### NFR-03: Найдвартай байдал (Reliability)
- **NFR-03.1**: Критик үйлдлүүд (proposal accept → contract create → job status update) Prisma $transaction ашиглан атомик байдлаар хийгдэнэ. Нэг алхам амжилтгүй бол бүгд rollback хийнэ.
- **NFR-03.2**: API бүрт try-catch error handling хэрэгжүүлсэн. Алдаа гарсан ч сервер унахгүй.
- **NFR-03.3**: Input validation — шаардлагатай талбаруудыг шалгаж, буруу формат (NaN, invalid date) татгалзана.

### NFR-04: Өргөтгөх чадвар (Scalability)
- **NFR-04.1**: Frontend Vercel дээр serverless горимд ажиллана — авто масштаблаж чадна.
- **NFR-04.2**: AI Matching сервис тусдаа microservice (FastAPI) байгаа тул бие даан масштаблах боломжтой.
- **NFR-04.3**: Redis (AWS ElastiCache) ашиглан database ачааллыг бууруулна.
- **NFR-04.4**: Elasticsearch ашиглан full-text хайлтыг PostgreSQL-ээс тусгаарлана.

### NFR-05: Хүртээмж (Availability)
- **NFR-05.1**: Vercel-ийн Global CDN ашиглан frontend дэлхийн хаанаас ч хурдан ачаалагдана.
- **NFR-05.2**: AWS RDS automatic backup + Multi-AZ deployment дэмжинэ.
- **NFR-05.3**: Redis cache доголдсон үед систем database руу шууд шилжиж (fallback) ажиллана.

### NFR-06: Засвар үйлчилгээний чадвар (Maintainability)
- **NFR-06.1**: TypeScript ашиглан бүх код type-safe. Compile-time алдаа илрүүлнэ.
- **NFR-06.2**: Prisma ORM ашиглан database schema-г code-first аргаар удирдана. Migration бүр version control-д хянагдана.
- **NFR-06.3**: ESLint ашиглан кодын чанар, стандартыг хянана.
- **NFR-06.4**: Модуль бүтэц — lib/, components/, app/api/ гэх мэт тусгай хавтаст зохион байгуулагдсан.

### NFR-07: Хэрэглэгчийн туршлага (Usability / UX)
- **NFR-07.1**: Монгол хэл дээрх UI/UX. Бүх алдааны мэдэгдэл, label монгол хэл дээр.
- **NFR-07.2**: Responsive design — Tailwind CSS ашиглан бүх дэлгэцийн хэмжээнд тохирно.
- **NFR-07.3**: Dark mode дэмжлэг (dark: prefix).
- **NFR-07.4**: Loading state, error state бүх хуудаст хэрэгжүүлсэн.

### NFR-08: Нийцтэй байдал (Compatibility)
- **NFR-08.1**: Орчин үеийн бүх вэб хөтчүүдийг дэмжинэ (Chrome, Firefox, Safari, Edge).
- **NFR-08.2**: Next.js App Router (v16) — React 19 Server Components дэмжлэг.
- **NFR-08.3**: REST API стандарт — бүх endpoint JSON format хариу буцаана.

### NFR-09: Мэдээллийн бүрэн бүтэн байдал (Data Integrity)
- **NFR-09.1**: Prisma schema-д @unique, @id constraint-ууд тодорхойлогдсон. Email давхардахгүй.
- **NFR-09.2**: Foreign key relationship-ууд schema түвшинд тодорхойлогдсон (referential integrity).
- **NFR-09.3**: Enum type-ууд ашиглан status, role зэрэг талбаруудын утгыг хязгаарласан (Role, JobStatus, ProposalStatus, ContractStatus гэх мэт).
- **NFR-09.4**: Мессеж илгээхдээ өөртөө мессеж илгээх, давхар proposal илгээх зэрэг бизнес дүрмүүдийг API түвшинд хянана.

### NFR-10: Cache удирдлага (Caching Strategy)
- **NFR-10.1**: Cache-Aside (Lazy Loading) pattern ашиглана — эхлээд cache шалгаж, байхгүй бол DB-с авч cache-д хадгална.
- **NFR-10.2**: Өгөгдөл шинэчлэгдэхэд холбогдох cache key-г invalidate (устгах) хийнэ.
- **NFR-10.3**: TTL (Time-To-Live) утга endpoint бүрт тусгайлан тохируулагдсан (30-180 секунд).
- **NFR-10.4**: Cache key нь query параметрүүдийг агуулсан (search, skill, page, limit) — ялгаатай хайлтанд ялгаатай cache.
- **NFR-10.5**: Production-д AWS ElastiCache (Redis 7.x) ашиглана. In-transit + At-rest encryption идэвхтэй.



## 2. АШИГЛАСАН ТЕХНОЛОГИУД

### 2.1 Frontend (Клиент тал)
| Технологи | Хувилбар | Зориулалт |
|---|---|---|
| **Next.js** | 16.2.0 | React-д суурилсан Full-stack framework, App Router ашиглана |
| **React** | 19.2.4 | UI компонент сан |
| **TypeScript** | 5.9.3 | Статик төрөлтэй JavaScript |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **Lucide React** | 0.577.0 | Icon сан |
| **NextAuth.js** | 4.24.13 | Authentication/Session удирдлага |
| **clsx + tailwind-merge** | — | CSS class-ууд нэгтгэх utility |

### 2.2 Backend (Сервер тал)
| Технологи | Хувилбар | Зориулалт |
|---|---|---|
| **Next.js API Routes** | 16.2.0 | REST API endpoint-ууд (App Router дотор) |
| **Prisma ORM** | 5.22.0 | Өгөгдлийн сангийн ORM, migration, type-safe query |
| **bcryptjs** | 3.0.3 | Нууц үг hash-лах |
| **jsonwebtoken** | 9.0.3 | JWT token үүсгэх (custom login endpoint) |
| **Stripe** | 22.0.2 | Төлбөрийн систем (Checkout Session) |

### 2.3 Өгөгдлийн сан (Database)
| Технологи | Зориулалт |
|---|---|
| **PostgreSQL** | Үндсэн relational database |
| **Prisma Migrate** | Schema migration удирдлага |

### 2.4 AI / Machine Learning сервис
| Технологи | Зориулалт |
|---|---|
| **FastAPI** (Python) | AI matching микросервис |
| **SentenceTransformers** (`all-MiniLM-L6-v2`) | Текстийн embedding, semantic similarity |
| **spaCy** (`en_core_web_sm`) | NLP — skill extraction |
| **NumPy** | Cosine similarity тооцоолол |

### 2.5 Дэд бүтцийн сервисүүд
| Технологи | Зориулалт |
|---|---|
| **Redis** (ioredis 5.10.1) | Cache систем — давтагдсан query хурдасгах |
| **AWS S3** (@aws-sdk/client-s3) | Файл хадгалах (portfolio, avatar зэрэг) |
| **Elasticsearch** (@elastic/elasticsearch 9.3.4) | Full-text хайлт (ажлын зар хайх) |

---

## 3. СИСТЕМИЙН АРХИТЕКТУР

### 3.1 Ерөнхий бүтэц (High-Level Architecture)

```
┌─────────────────────────────────────────────────────────────────┐
│                        КЛИЕНТ (Browser)                         │
│                  Next.js Frontend (React 19)                    │
│           Tailwind CSS + Lucide Icons + NextAuth                │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend Hosting)                     │
│              Next.js App — SSR + API Routes                     │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │  Pages/UI   │  │  API Routes  │  │  Middleware (RBAC)     │ │
│  │  (React)    │  │  (/api/*)    │  │  next-auth + JWT       │ │
│  └─────────────┘  └──────┬───────┘  └────────────────────────┘ │
└──────────────────────────┼──────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────────┐
          ▼                ▼                    ▼
┌──────────────┐  ┌──────────────┐     ┌──────────────────┐
│  PostgreSQL  │  │    Redis     │     │   AWS S3 Bucket  │
│  (AWS RDS)   │  │ (ElastiCache)│     │  (Файл хадгалах) │
│              │  │  Cache Layer │     │                  │
└──────────────┘  └──────────────┘     └──────────────────┘
          ▲                                     
          │                                     
┌──────────────────┐    ┌───────────────────────┐
│  Elasticsearch   │    │  AI Matching Service  │
│  (Full-text      │    │  (FastAPI + Python)   │
│   хайлт)         │    │  AWS EC2 / Lambda     │
└──────────────────┘    └───────────────────────┘
```

### 3.2 Давхаргуудын тайлбар

**1. Presentation Layer (Frontend)**
- Next.js App Router (`src/app/`) — SSR + Client Components
- Navbar, Footer, AdminSidebar зэрэг layout компонентууд
- SessionProvider-ээр бүх app-г ороосон (client-side session)

**2. API Layer (Backend)**  
- Next.js API Routes (`src/app/api/`) — 13 endpoint бүлэг
- `getServerSession()` ашиглан серверийн талд session шалгана
- Middleware (`src/middleware.ts`) — Role-Based Access Control (RBAC)

**3. Data Access Layer**
- Prisma ORM — type-safe database query
- Singleton pattern (`src/lib/prisma.ts`) — hot reload үед олон connection үүсэхээс хамгаална

**4. External Services**
- Redis — Cache давхарга
- AWS S3 — Файл хадгалалт
- Elasticsearch — Хайлтын индекс
- AI Service (FastAPI) — Ухаалаг matching

---

## 4. ӨГӨГДЛИЙН САНГИЙН БҮТЭЦ (Database Schema)

### 4.1 Entity Relationship Diagram

```
User (1) ──── (0..1) ClientProfile ──── (*) Job ──── (*) Proposal
  │                      │                  │            │
  │                      │                  │            │
  │                 (*) Contract ◄──────────┘            │
  │                      │                               │
  │                 (*) Milestone                        │
  │                      │                               │
  │                 (*) Payment                          │
  │                                                      │
  └──── (0..1) FreelancerProfile ◄───────────────────────┘
                    │
               (*) FreelancerSkill ──── Skill
```

### 4.2 Хүснэгтүүдийн тайлбар

| Хүснэгт | Тайлбар | Гол талбарууд |
|---|---|---|
| **User** | Бүх хэрэглэгчдийн мастер хүснэгт | id, email, full_name, role (CLIENT/FREELANCER), passwordHash, is_verified |
| **ClientProfile** | Клиентийн нэмэлт мэдээлэл | company_name, industry, total_jobs_posted, bio, location |
| **FreelancerProfile** | Фрилансерийн мэдээлэл | title, hourly_rate, ai_score, availability (AVAILABLE/BUSY/OFFLINE), bio |
| **Skill** | Ур чадварын жагсаалт | name, category |
| **FreelancerSkill** | Фрилансер ↔ Skill холбоос (M:N) | freelancer_id, skill_id, proficiency_level (BEGINNER/INTERMEDIATE/EXPERT) |
| **Job** | Ажлын зарууд | title, description, budget_min, budget_max, status (OPEN/IN_PROGRESS/CLOSED), deadline |
| **Proposal** | Фрилансерийн санал | job_id, freelancer_id, bid_amount, cover_letter, status (PENDING/ACCEPTED/REJECTED), ai_relevance_score |
| **Contract** | Гэрээ | job_id, freelancer_id, client_id, agreed_amount, status (ACTIVE/COMPLETED/CANCELLED), start_date |
| **Milestone** | Гэрээний шат | contract_id, title, amount, status (PENDING/COMPLETED), due_date |
| **Payment** | Төлбөр | contract_id, milestone_id, amount, status (PENDING/PAID), paid_at |
| **Review** | Үнэлгээ | contract_id, reviewer_id, rating (1-5), comment |
| **Message** | Мессеж/чат | sender_id, receiver_id, job_id, content, is_read |
| **AIRecommendation** | AI санал | job_id, freelancer_id, match_score, reasoning |

---

## 5. БИЗНЕС ЛОГИК — АЖИЛЛАХ УРСГАЛ

### 5.1 Хэрэглэгч бүртгэл & Нэвтрэх

```
Бүртгэл (/api/auth/register):
  1. Email, password, full_name, role (CLIENT/FREELANCER) хүлээн авна
  2. Email давхцал шалгана (findUnique)
  3. Нууц үг bcrypt.hash(password, 10)-ээр hash-лана
  4. User үүсгэнэ
  5. Role-д тохируулан автоматаар ClientProfile эсвэл FreelancerProfile үүсгэнэ
  
Нэвтрэх (NextAuth CredentialsProvider):
  1. Email-ээр хэрэглэгч хайна
  2. bcrypt.compare()-ээр нууц үг шалгана
  3. JWT token үүсгэнэ (id, role агуулна)
  4. Session-д user.id, user.role хадгална
```

### 5.2 Ажлын зар нийтлэх (Job Posting)

```
POST /api/jobs:
  1. Session шалгана → Зөвхөн CLIENT role
  2. ClientProfile-аар client_id авна
  3. Validation: title, description, deadline заавал
  4. Job үүсгэнэ (status: OPEN)
  
GET /api/jobs:
  1. Нээлттэй ажлуудыг жагсаана (status: OPEN)
  2. search, skill параметрээр шүүнэ
  3. Prisma pagination (page, limit)
  4. Client + Skills мэдээллийг include хийнэ
```

### 5.3 Proposal (Санал илгээх)

```
POST /api/proposals:
  1. Session → Зөвхөн FREELANCER
  2. FreelancerProfile олно
  3. Job нээлттэй эсэх шалгана (status: OPEN)
  4. Давхар proposal шалгана (findFirst)
  5. Proposal үүсгэнэ (status: PENDING, ai_relevance_score: 0.0)

PUT /api/proposals/[id] — Санал зөвшөөрөх/татгалзах:
  1. Session → CLIENT эсвэл ADMIN
  2. Job эзэмшигч мөн эсэх шалгана
  3. $transaction ашиглана:
     a. Proposal status → ACCEPTED/REJECTED
     b. Хэрэв ACCEPTED:
        - Contract үүсгэнэ (status: ACTIVE)
        - Job status → IN_PROGRESS
        - Бусад proposal-ууд → REJECTED
```

### 5.4 Гэрээний удирдлага (Contract Management)

```
GET /api/contracts:
  - Role-аас хамаарч client_id эсвэл freelancer_id-аар шүүнэ
  
PATCH /api/contracts/[id]:
  - $transaction ашиглана:
    1. Contract status шинэчлэнэ
    2. Хэрэв COMPLETED → Job status → CLOSED болгоно
```

### 5.5 Төлбөрийн систем (Payments)

```
POST /api/payments:
  1. Session шалгана
  2. Stripe Checkout Session үүсгэнэ
  3. Валют: MNT (Монгол Төгрөг)
  4. success_url → /contracts/[id]?payment=success
  5. metadata-д jobId, contractId, userId хадгална
```

### 5.6 Мессежийн систем (Messaging)

```
GET /api/messages:
  - partnerId + jobId байвал → тухайн харилцааны мессежүүд
  - Уншаагүй мессежийг автомат уншигдсан болгоно
  - Хэрэв параметргүй → бүх харилцааны жагсаалт (conversations)
  - Давхардлыг Set ашиглан арилгана

POST /api/messages:
  - receiverId, jobId, content шаардана
  - Өөртөө мессеж илгээхийг хориглоно
  - Receiver байгаа эсэхийг шалгана
```

### 5.7 Үнэлгээний систем (Reviews)

```
POST /api/reviews:
  1. Contract COMPLETED байх ёстой
  2. Reviewer нь гэрээний оролцогч мөн эсэхийг шалгана
  3. Rating (1-5) + Comment хадгална
  
GET /api/reviews:
  - Дундаж rating тооцоолно (averageRating)
```

### 5.8 AI Matching систем

```
Урсгал:
  1. Client → POST /api/ai/match { jobId }
  2. Next.js API → Job + бүх Freelancer мэдээлэл DB-с авна
  3. Freelancer бүрийн avg_rating, completed_jobs тооцоолно
  4. Python AI сервис рүү (POST /match) илгээнэ
  5. AI сервис дотор:
     a. Skill Normalization: SYNONYMS толь ашиглан ур чадваруудыг стандарт хэлбэрт шилжүүлнэ.
     b. Embedding: Job текст + Freelancer текст → SentenceTransformer embedding
     c. Similarity: NumPy ашиглан Cosine similarity-г batch байдлаар тооцоолно.
     d. Жинлэлтийн томьёо:
        score = 0.35 × semantic_similarity
              + 0.15 × explicit_skill_match
              + 0.25 × rate_fit
              + 0.15 × rating_score
              + 0.10 × activity_score
     e. Sorting: Оноогоор эрэмбэлж Top 10-ыг буцаана.
  6. Next.js API → Freelancer мэдээллийг нэгтгэж frontend-д буцаана.
```

### 5.9 Middleware — RBAC (Role-Based Access Control)

```
Хамгаалагдсан замууд:
  /client/*       → CLIENT эсвэл ADMIN
  /freelancer/*   → FREELANCER эсвэл ADMIN
  /api/jobs/*     → Authenticated хэрэглэгч
  /api/proposals/*→ Authenticated хэрэглэгч
  /api/contracts/*→ Authenticated хэрэглэгч
  
Зөрчвөл → /unauthorized руу redirect
```

---

## 6. REDIS CACHE СИСТЕМ

### 6.1 Тохиргоо (`src/lib/redis.ts`)

```typescript
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});
// Эсвэл REDIS_URL environment variable ашиглана
```

### 6.2 Cache-лах стратеги

Redis-ийг дараах зорилгоор ашиглана:

| Cache зорилго | TTL | Түлхүүрийн загвар | Тайлбар |
|---|---|---|---|
| **Ажлын жагсаалт** | 60-120 сек | `jobs:list:page:{n}` | Нүүр хуудасны ажлын зарууд |
| **Фрилансер жагсаалт** | 60-120 сек | `freelancers:list:page:{n}` | Фрилансер хайлтын хуудас |
| **Профайл мэдээлэл** | 300 сек | `profile:{userId}` | Хэрэглэгчийн профайл |
| **AI matching үр дүн** | 600 сек | `ai:match:{jobId}` | Давтагдсан matching query |
| **Admin dashboard stats** | 30-60 сек | `admin:dashboard:stats` | Dashboard статистик |
| **Notification тоо** | 30 сек | `notifications:count:{userId}` | Уншаагүй мэдэгдлийн тоо |

### 6.3 Cache pattern — Read-Through / Cache-Aside

```
Хүсэлт ирэхэд:
  1. Redis-с cache шалгана (GET key)
  2. Cache байвал → шууд буцаана (HIT)
  3. Cache байхгүй бол → PostgreSQL-с query хийнэ (MISS)
  4. Үр дүнг Redis-д хадгална (SET key value EX ttl)
  5. Клиентэд буцаана

Өгөгдөл шинэчлэгдэхэд:
  - Холбогдох cache key-г устгана (DEL key)
  - Жишээ: Шинэ ажил нийтлэхэд → DEL jobs:list:*
```

### 6.4 Production-д AWS ElastiCache

```
AWS ElastiCache (Redis):
  - Engine: Redis 7.x
  - Node type: cache.t3.micro (эхний шатанд)
  - Cluster mode: Disabled (нэг node)
  - Encryption: In-transit + At-rest
  - REDIS_URL=redis://username:password@elasticache-endpoint:6379
```

---

## 7. DEPLOYMENT АРХИТЕКТУР

### 7.1 Frontend — Vercel

```
Vercel дээр deploy хийх:
  1. GitHub repo-г Vercel-д холбоно
  2. Framework: Next.js (автомат таних)
  3. Build Command: next build
  4. Output Directory: .next
  
Environment Variables (Vercel Dashboard):
  DATABASE_URL=postgresql://user:pass@aws-rds-endpoint:5432/freelance_db
  NEXTAUTH_SECRET=<production-secret>
  NEXTAUTH_URL=https://mindbridge.vercel.app
  JWT_SECRET=<production-jwt-secret>
  AI_SERVICE_URL=https://ai.mindbridge.example.com
  REDIS_URL=redis://...elasticache-endpoint:6379
  STRIPE_SECRET_KEY=sk_live_...
  AWS_ACCESS_KEY_ID=...
  AWS_SECRET_ACCESS_KEY=...
  AWS_REGION=ap-northeast-1
  AWS_S3_BUCKET_NAME=mindbridge-files
  ELASTICSEARCH_URL=https://...

Vercel-ийн давуу тал:
  - Автомат SSL certificate
  - Edge Functions дэмжлэг
  - Preview deployments (PR бүрт)
  - Serverless API Routes
  - Global CDN
```

### 7.2 Backend / Infrastructure — AWS

```
┌─────────────────── AWS Cloud ───────────────────────┐
│                                                      │
│  ┌──────────────┐  ┌──────────────┐                 │
│  │  RDS         │  │ ElastiCache  │                 │
│  │ PostgreSQL   │  │ Redis        │                 │
│  │ db.t3.micro  │  │ cache.t3.micro│                │
│  └──────────────┘  └──────────────┘                 │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐                 │
│  │  S3 Bucket   │  │ EC2 / ECS    │                 │
│  │ Файлууд     │  │ AI Service   │                 │
│  │              │  │ (FastAPI)    │                 │
│  └──────────────┘  └──────────────┘                 │
│                                                      │
│  ┌──────────────────────────────────┐               │
│  │  OpenSearch (Elasticsearch)      │               │
│  │  Ажлын зар full-text хайлт      │               │
│  └──────────────────────────────────┘               │
└──────────────────────────────────────────────────────┘

AWS Сервисүүд:
  1. RDS (PostgreSQL) — Үндсэн database
  2. ElastiCache (Redis) — Cache систем
  3. S3 — Файл хадгалалт (portfolio, avatar)
  4. EC2 / ECS Fargate — AI matching сервис (FastAPI)
  5. OpenSearch — Full-text хайлт
  6. VPC — Бүх сервисийг нэг хувийн сүлжээнд
  7. IAM — Хандалтын удирдлага
```

### 7.3 Deploy процесс

```
1. Git push → GitHub
2. Vercel автомат build + deploy (Frontend + API Routes)
3. AWS RDS → Prisma migrate deploy (CI/CD pipeline-д)
4. AI сервис → Docker build → ECR → ECS deploy
5. Redis → ElastiCache (тохиргоо нэг удаа)
```

---

## 8. API ENDPOINT ЖАГСААЛТ

| Method | Endpoint | Зориулалт | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Бүртгэл | Үгүй |
| POST | `/api/auth/login` | JWT нэвтрэх | Үгүй |
| POST/GET | `/api/auth/[...nextauth]` | NextAuth session | Үгүй |
| GET | `/api/jobs` | Ажлын жагсаалт (хайлт, шүүлтүүр, pagination) | Үгүй |
| POST | `/api/jobs` | Шинэ ажил нийтлэх | CLIENT |
| GET | `/api/jobs/[id]` | Ажлын дэлгэрэнгүй | Үгүй |
| PUT | `/api/jobs/[id]` | Ажил засварлах | Тийм |
| DELETE | `/api/jobs/[id]` | Ажил устгах | Тийм |
| GET | `/api/proposals` | Санал жагсаалт | Тийм |
| POST | `/api/proposals` | Санал илгээх | FREELANCER |
| GET | `/api/proposals/[id]` | Саналын дэлгэрэнгүй | Тийм |
| PUT | `/api/proposals/[id]` | Санал зөвшөөрөх/татгалзах | CLIENT |
| POST | `/api/proposals/invite` | Фрилансер урих | CLIENT |
| GET | `/api/contracts` | Гэрээний жагсаалт | Тийм |
| GET | `/api/contracts/[id]` | Гэрээний дэлгэрэнгүй | Тийм |
| PATCH | `/api/contracts/[id]` | Гэрээний төлөв шинэчлэх | Тийм |
| GET | `/api/freelancers` | Фрилансер жагсаалт | Үгүй |
| GET | `/api/freelancers/[id]` | Фрилансерийн дэлгэрэнгүй | Үгүй |
| GET | `/api/profiles` | Профайл авах | Тийм |
| PUT | `/api/profiles` | Профайл засварлах | Тийм |
| GET | `/api/messages` | Мессеж/харилцаа | Тийм |
| POST | `/api/messages` | Мессеж илгээх | Тийм |
| GET | `/api/reviews` | Үнэлгээ жагсаалт | Тийм |
| POST | `/api/reviews` | Үнэлгээ өгөх | Тийм |
| POST | `/api/payments` | Stripe төлбөр эхлүүлэх | Тийм |
| GET | `/api/notifications` | Мэдэгдэл авах | Тийм |
| POST | `/api/notifications` | Мэдэгдэл илгээх | Тийм |
| GET | `/api/admin/dashboard` | Admin статистик | ADMIN |
| GET | `/api/admin/users` | Хэрэглэгчдийн удирдлага | ADMIN |
| POST | `/api/ai/match` | AI фрилансер matching | CLIENT |

---

## 9. FRONTEND ХУУДАСНЫ БҮТЭЦ

```
src/app/
├── page.tsx                    — Нүүр хуудас (Landing Page)
├── layout.tsx                  — Root layout (Navbar + Footer + Providers)
├── providers.tsx                — SessionProvider wrapper
├── globals.css                  — Global CSS
├── (auth)/
│   ├── login/page.tsx           — Нэвтрэх хуудас
│   ├── register/page.tsx        — Бүртгэлийн хуудас
│   └── forgot-password/page.tsx — Нууц үг сэргээх
├── jobs/
│   ├── page.tsx                 — Ажлын жагсаалт
│   ├── create/page.tsx          — Шинэ ажил нийтлэх
│   └── [id]/page.tsx            — Ажлын дэлгэрэнгүй
├── freelancers/
│   ├── page.tsx                 — Фрилансер хайх
│   └── [id]/page.tsx            — Фрилансерийн профайл
├── contracts/
│   ├── page.tsx                 — Гэрээний жагсаалт
│   └── [id]/page.tsx            — Гэрээний дэлгэрэнгүй
├── messages/page.tsx            — Мессеж/чат хуудас
├── payments/page.tsx            — Төлбөрийн хуудас
├── profile/
│   ├── page.tsx                 — Профайл харах
│   └── edit/page.tsx            — Профайл засварлах
├── admin/
│   ├── layout.tsx               — Admin sidebar layout
│   ├── page.tsx                 — Admin Dashboard
│   ├── users/page.tsx           — Хэрэглэгчдийн удирдлага
│   ├── reports/page.tsx         — Тайлан
│   └── system/page.tsx          — Системийн мэдээлэл
├── how-to-hire/page.tsx         — Хэрхэн ажилтан хайх заавар
└── how-to-work/page.tsx         — Хэрхэн ажил хийх заавар
```

---

## 10. АЮУЛГҮЙ БАЙДАЛ (Security)

| Хамгаалалт | Хэрэгжүүлсэн байдал |
|---|---|
| **Нууц үг hash** | bcrypt (salt rounds: 10) |
| **Session** | JWT стратеги (NextAuth), HttpOnly cookie |
| **RBAC** | Middleware — role шалгах, API бүрт session шалгалт |
| **Input validation** | API бүрт required field шалгалт |
| **SQL Injection** | Prisma ORM — parameterized queries |
| **Self-message prevention** | Өөртөө мессеж илгээхийг хориглосон |
| **Duplicate proposal check** | Давхар санал илгээхийг хориглосон |
| **File upload security** | S3 presigned URL (хугацаатай — 1 цаг) |

---

## 11. ГҮЙЦЭТГЭЛИЙН ОНОВЧЛОЛ (Performance)

| Арга | Тайлбар |
|---|---|
| **Redis Cache** | Давтагдсан query-г cache-лэн хурдасгана |
| **Prisma Singleton** | Dev горимд олон PrismaClient үүсэхээс хамгаална |
| **Promise.all** | Зэрэг ажиллуулах боломжтой query-г параллел ажиллуулна |
| **Pagination** | Бүх жагсаалтад skip/take pagination |
| **force-dynamic** | API route-уудад static cache-аас зайлсхийнэ |
| **Elasticsearch** | Full-text хайлтыг тусдаа индекс дээр хурдан гүйцэтгэнэ |
| **Database indexing** | Prisma @unique, @id → автомат index |

---

## 12. ENVIRONMENT VARIABLES

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/freelance_db

# NextAuth
NEXTAUTH_SECRET=<random-secret-min-32-chars>
NEXTAUTH_URL=https://mindbridge.vercel.app

# JWT (Custom login endpoint-д)
JWT_SECRET=<random-secret>

# AI Service
AI_SERVICE_URL=http://ai-service-host:8000

# Redis Cache
REDIS_URL=redis://username:password@redis-host:6379
REDIS_HOST=redis-host
REDIS_PORT=6379
REDIS_PASSWORD=<redis-password>

# AWS S3
AWS_ACCESS_KEY_ID=<aws-key>
AWS_SECRET_ACCESS_KEY=<aws-secret>
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET_NAME=mindbridge-files

# Elasticsearch
ELASTICSEARCH_URL=https://elasticsearch-host:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=<es-password>

# Stripe
STRIPE_SECRET_KEY=sk_live_...
```

---

## 13. ДҮГНЭЛТ

**Mind Bridge** нь орчин үеийн microservice-д ойрхон full-stack архитектуртай, AI-д суурилсан ухаалаг фрилансерийн платформ юм. Next.js 16 (App Router) дээр бүтээгдсэн, Vercel + AWS хослолоор deploy хийгдэх бөгөөд Redis cache, Elasticsearch хайлт, Stripe төлбөр, AWS S3 файл хадгалалт, FastAPI AI matching зэрэг олон сервисийг нэгтгэсэн цогц систем юм. Монгол хэл дээрх UI/UX нь дотоодын зах зээлд зориулагдсан бөгөөд role-based хандалтын удирдлага, real-time мессеж, автомат гэрээний удирдлага зэрэг мэргэжлийн түвшний функцуудыг агуулна.





API Route	Cache төрөл	TTL	Тайлбар
GET /api/jobs	getOrSetCache	60 сек	Ажлын жагсаалт
POST /api/jobs	invalidateCache	—	Шинэ ажил → jobs:* cache устгана
GET /api/jobs/[id]	getOrSetCache	120 сек	Ажлын дэлгэрэнгүй
PUT /api/jobs/[id]	invalidateCache	—	Засварласан → тухайн job + list cache устгана
DELETE /api/jobs/[id]	invalidateCache	—	Устгасан → cache устгана
GET /api/freelancers	getOrSetCache	90 сек	Фрилансер жагсаалт
GET /api/freelancers/[id]	getOrSetCache	120 сек	Фрилансер дэлгэрэнгүй
GET /api/profiles	getOrSetCache	180 сек	Профайл мэдээлэл
PUT /api/profiles	invalidateCache	—	Профайл засвар → profile + freelancer cache
GET /api/admin/dashboard	getOrSetCache	30 сек	Admin stats (6+ query)
PUT /api/proposals/[id]	invalidateCache	—	Proposal зөвшөөрөх → jobs + admin cache
PATCH /api/contracts/[id]	invalidateCache	—	Гэрээ дуусах → jobs + admin + profile cache

# AI Matching Engine - Simulation Report

This report demonstrates how the AI Matching Engine evaluates freelancers against a specific job post.

## Test Case: Senior React Developer (Next.js)

**Job Details:**
- **Title:** Senior React Developer (Next.js)
- **Description:** Build a modern dashboard using React, Next.js, and TypeScript. Experience with Tailwind CSS and AWS is required.
- **Max Budget:** $50/hr
- **Required Skills:** `React`, `Next.js`, `TypeScript`, `Tailwind CSS`, `AWS`

---

## Simulated Results

| Freelancer | Total Score | Semantic Match | Explicit Match | Rate | Rating |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Fullstack React Expert** | **94.2%** | 92.5% | 100% | $45/hr | 4.9⭐ |
| **AWS Cloud Architect** | **78.5%** | 85.0% | 40% | $65/hr | 5.0⭐ |
| **Frontend Developer** | **62.1%** | 68.0% | 20% | $35/hr | 4.5⭐ |
| **Junior Web Developer** | **45.3%** | 42.0% | 40% | $20/hr | 3.5⭐ |

---

## Scoring Logic Breakdown

1.  **Semantic Match (35%)**: Calculates how similar the job description and the freelancer's bio/title are using vector embeddings (`all-MiniLM-L6-v2`).
2.  **Explicit Match (15%)**: Checks for exact skill keyword matches (after normalization).
3.  **Rate Fit (25%)**: Penalizes profiles that are over the max budget.
4.  **Rating (15%)**: Higher ratings boost the score.
5.  **Activity (10%)**: Number of completed jobs adds a trust score.

### Example: "AWS Cloud Architect"
- **High Semantic Similarity**: They know AWS and React, so the AI sees them as relevant.
- **Low Explicit Match**: They only list 2 out of 5 required skills.
- **Budget Penalty**: Being at $65/hr (over $50/hr) lowers their final rank compared to the React Expert.

---

## How to run this test yourself?

1. Start the AI Service:
   ```bash
   cd src/app/api/ai-service
   uvicorn main:app --reload
   ```

2. Run the test script:
   ```bash
   python3 src/app/api/ai-service/test_matching.py
   ```


# AI Matching Sequence Diagram

Энэхүү Sequence Diagram нь таны код дахь `src/app/api/ai/match/route.ts` API болон `SmartMatch.tsx` дээр үндэслэн яг одоогийн бодит системийн ажиллагааг (Architecture) харуулж байна. Эх зурагтай ижил бүтцээр таны кодонд тохируулан зурлаа.

```mermaid
sequenceDiagram
    autonumber
    actor Client as Клиент
    participant Frontend as Frontend (SmartMatch)
    participant API as API Gateway (Next.js)
    participant AIEngine as AI Engine (FastAPI)
    participant DB as Database (PostgreSQL)

    %% Санал болон Тохироо шалгах хэсэг
    rect rgb(240, 248, 255)
    Note over Client, DB: AI Smart Matching процесс
    Client->>Frontend: "Find best freelancers" дарах
    Frontend->>API: POST /api/ai/match { jobId }
    
    API->>DB: 1. Тухайн ажлын мэдээллийг авах (Job + Skills)
    DB-->>API: Ажлын мэдээлэл
    
    API->>DB: 2. Бүх фрилансерүүдийн мэдээллийг авах (Profile, Skills, Reviews)
    DB-->>API: Фрилансерүүдийн жагсаалт
    
    Note over API: Өгөгдлийг AI Engine-д<br/>зориулан форматлах (Payload)
    
    API->>AIEngine: POST /match (Payload: Jobs & Freelancers)
    
    Note right of AIEngine: - Ур чадварын давхцал тооцоолох<br/>- Үнэлгээ & Төсвийн нийцэл шалгах<br/>- Эцсийн Score бодох
    
    AIEngine-->>API: Matching үр дүн (freelancer_id, score, skill_similarity)
    
    Note over API: Үр дүнг фрилансерийн<br/>нэр, мэдээлэлтэй нэгтгэх
    
    API-->>Frontend: 200 OK: { matches: [...] }
    Frontend-->>Client: Тохирсон фрилансерүүдийн жагсаалт %-тай харагдана
    end

    %% Heuristic Fast Match хэсэг (Жагсаалт харах үед)
    rect rgb(245, 245, 245)
    Note over Client, DB: Fast Heuristic Match (Жагсаалт харах үед)
    Client->>Frontend: Фрилансерүүдийн жагсаалт руу орох
    Frontend->>DB: Server Component: GET Freelancers & Client's open job
    DB-->>Frontend: Фрилансерүүд болон Ажлын мэдээлэл
    Note over Frontend: calculateMatchScore() ашиглан<br/>шууд Тохироо % бодох (No AI request)
    Frontend-->>Client: Жагсаалт (Тохирооны Баджтай харуулах)
    end
```

### Ялгаатай буюу Таны кодонд зориулсан хувилбарын онцлог:
1. **Өгөгдөл татах урсгал (Data fetching)**: AI Engine шууд Database-тэй харьцдаггүй бөгөөд Next.js API нь Database-ээс өгөгдлийг бэлтгэн AI Engine руу Payload байдлаар (JSON) дамжуулдаг байна.
2. **Real-time response**: AI Engine нь үр дүнг Database рүү хадгалалгүйгээр API руу шууд буцааж, Client талд response байдлаар очдог.
3. **Хоёр төрлийн matching**: 
   - Гүнзгий (Deep Match): AI Engine руу явуулах процесс.
   - Хурдан (Fast Heuristic): `clientJob` болон `calculateMatchScore` ашиглан жагсаалт дээр шууд харуулах хэсгийг нэмж орууллаа.


# Mind Bridge - Системийн Техникийн Онцлог ба Кодын Жишээнүүд

Энэхүү баримт бичигт "Mind Bridge" платформын бусад энгийн вэбүүдээс ялгарах гол техникийн шийдлүүдийг тайлбарлаж, кодын хэсгүүдийг хавсаргав.

## 1. AI Smart Matching (Ухаалаг тохироо)
Энэхүү сервис нь Python (FastAPI) болон NLP (Natural Language Processing) ашиглан фрилансер болон ажлын зарыг хооронд нь холбодог.

### Гол логик:
- **Semantic Similarity (40%):** Sentence-Transformers ашиглан гарчиг, тайлбар болон ур чадварыг вектор болгон хөрвүүлж, утга санааны хувьд хэр ойр байгааг тооцоолно (Cosine Similarity).
- **Hourly Rate Fit (30%):** Фрилансерын ажлын хөлс захиалагчийн төсөвтэй хэр нийцэж байгааг шалгана.
- **Rating Score (20%):** Хэрэглэгчийн өмнөх үнэлгээ.
- **Activity Score (10%):** Өмнө нь гүйцэтгэсэн ажлын тоо.

```python
# ai-service/main.py хэсгээс
@app.post("/match")
async def match_freelancers(req: MatchRequest):
    # ... (embedding logic)
    # Нийт оноо — жинлэлтийн томьёо
    total_score = (
        0.40 * skill_sim +   # Утга санааны нийцэл
        0.30 * rate_fit +    # Төсвийн нийцэл
        0.20 * rating_score + # Хэрэглэгчийн үнэлгээ
        0.10 * activity      # Идэвхийн оноо (гүйцэтгэсэн ажлын тоо)
    )
    return total_score
```

## 2. Redis Caching Service (Хурд нэмэгдүүлэх)
Системийн ачааллыг бууруулах, хэрэглэгчид мэдээллийг хурдан хүргэхийн тулд Redis кэш системийг ашигладаг.

### Онцлог:
- Ажлын зарын жагсаалт өөрчлөгдөөгүй тохиолдолд өгөгдлийн сан (DB) руу хандахгүйгээр кэшээс шууд уншина.
- Шинэ зар нэмэгдэхэд кэшийг автоматаар шинэчилнэ (Cache Invalidation).

```typescript
// src/lib/redis.ts хэсгээс
export async function getCachedData(key: string) {
  const cachedData = await redis.get(key);
  if (cachedData) {
    console.log(`Cache Hit for: ${key}`);
    return JSON.parse(cachedData);
  }
  return null;
}

export async function setCachedData(key: string, data: any, ttl = 3600) {
  await redis.set(key, JSON.stringify(data), 'EX', ttl);
}
```

## 3. Two-Factor Verification System (Аюулгүй байдал)
Бусад платформуудаас ялгаатай нь Mind Bridge нь хэрэглэгчийн и-мэйл болон **гар утасны дугаарыг** хоёуланг нь OTP (One-Time Password) кодоор баталгаажуулдаг.

### Техник:
- **Nodemailer:** И-мэйл илгээхэд ашигласан.
- **Simulated SMS:** Гар утас руу SMS илгээнэ. Хөгжүүлэлтийн шатанд кодыг терминал дээр хэвлэж "үнэгүй" бөгөөд "хурдан" шийдлийг гаргасан.

```typescript
// src/lib/otp.ts хэсгээс
export async function createVerificationCode(userId: string, type: 'EMAIL' | 'PHONE') {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 мин хүчинтэй

  return await prisma.verificationCode.create({
    data: {
      user_id: userId,
      code,
      type,
      expiresAt,
    },
  });
}
```

## 4. Системийн Архитектур (Unique Aspect)
Mind Bridge нь **Next.js (Web Layer)** болон **Python (AI Layer)** хосолсон микро-сервис архитектурыг ашиглаж байна.

- **Next.js:** Бүх бизнес логик болон UI удирдана.
- **Python FastAPI:** Зөвхөн хүнд тооцоолол буюу AI/ML хэсгийг хариуцна.
- **Postgres + Prisma:** Найдвартай өгөгдлийн сан.
- **Redis:** Утасгүй холболтын кэш.


