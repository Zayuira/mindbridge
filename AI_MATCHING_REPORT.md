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
