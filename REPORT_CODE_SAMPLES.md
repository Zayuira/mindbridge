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
