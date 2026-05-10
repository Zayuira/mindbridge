import requests
import json
from tabulate import tabulate  # Try to use tabulate for nice output, fallback to simple print

# AI Service URL
BASE_URL = "http://localhost:8000"

def test_matching():
    print("\n" + "="*60)
    print("🚀 AI MATCHING ENGINE - TEST BENCH")
    print("="*60)

    # 1. Mock Job Data
    job = {
        "job_title": "Senior React Developer (Next.js)",
        "job_description": "We are looking for a senior developer to build a modern dashboard using React, Next.js, and TypeScript. Experience with Tailwind CSS and AWS is required.",
        "job_budget_max": 50.0,
        "required_skills": ["React", "Next.js", "TypeScript", "Tailwind CSS", "AWS"]
    }

    # 2. Mock Freelancers Data
    freelancers = [
        {
            "id": "fl_1",
            "title": "Fullstack React Expert",
            "bio": "I have 5 years of experience with React, Next.js, and AWS. I love building scalable dashboards.",
            "hourly_rate": 45.0,
            "avg_rating": 4.9,
            "completed_jobs": 25,
            "skills": ["React", "NextJS", "TS", "AWS", "Tailwind"]
        },
        {
            "id": "fl_2",
            "title": "Frontend Developer",
            "bio": "Frontend specialist focused on Vue and Angular. Learning React.",
            "hourly_rate": 35.0,
            "avg_rating": 4.5,
            "completed_jobs": 10,
            "skills": ["Vue", "Angular", "JavaScript", "HTML", "CSS"]
        },
        {
            "id": "fl_3",
            "title": "AWS Cloud Architect",
            "bio": "Expert in AWS, Infrastructure as Code, and Backend systems. Some React experience.",
            "hourly_rate": 65.0,
            "avg_rating": 5.0,
            "completed_jobs": 40,
            "skills": ["AWS", "Terraform", "Python", "Node.js", "React"]
        },
        {
            "id": "fl_4",
            "title": "Junior Web Developer",
            "bio": "I know HTML, CSS, and some React. Ready to work!",
            "hourly_rate": 20.0,
            "avg_rating": 3.5,
            "completed_jobs": 2,
            "skills": ["HTML", "CSS", "JS", "React"]
        }
    ]

    payload = {**job, "freelancers": freelancers}

    try:
        print(f"\n📡 Sending request to {BASE_URL}/match ...")
        response = requests.post(f"{BASE_URL}/match", json=payload)
        
        if response.status_code == 200:
            results = response.json()["matches"]
            
            print("\n✅ MATCHING RESULTS:")
            
            # Map for display
            fl_map = {f["id"]: f for f in freelancers}
            
            table_data = []
            for m in results:
                fl = fl_map[m["freelancer_id"]]
                table_data.append([
                    fl["title"],
                    f"{m['score']*100:.1f}%",
                    f"{m['skill_similarity']*100:.1f}%",
                    f"{m['explicit_skill_match']*100:.1f}%",
                    f"${fl['hourly_rate']}/hr",
                    f"{fl['avg_rating']}⭐"
                ])
            
            headers = ["Freelancer", "Total Score", "Semantic Match", "Explicit Match", "Rate", "Rating"]
            try:
                print(tabulate(table_data, headers=headers, tablefmt="fancy_grid"))
            except ImportError:
                # Fallback to simple print if tabulate is not installed
                print("-" * 100)
                print(f"{'Freelancer':<30} | {'Score':<10} | {'Semantic':<10} | {'Explicit':<10} | {'Rate':<10}")
                print("-" * 100)
                for row in table_data:
                    print(f"{row[0]:<30} | {row[1]:<10} | {row[2]:<10} | {row[3]:<10} | {row[4]:<10}")
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Error: Could not connect to AI service at {BASE_URL}.")
        print("💡 Make sure you have started the service with: ")
        print("   cd src/app/api/ai-service && uvicorn main:app --reload")

if __name__ == "__main__":
    test_matching()
