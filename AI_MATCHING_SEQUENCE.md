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
