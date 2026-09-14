"""
Skill Intelligence & Employability Platform - Data Store & Engine
Handles deterministic seeding of 100 students, 15 companies, jobs, challenges,
application workflows, live skill matching, and cross-role intelligence.
"""

import json
import os
import random
from typing import Dict, List, Any, Optional

DATA_FILE = os.path.join(os.path.dirname(__file__), "seed_data.json")

CORE_SKILLS = [
    "Web Development",
    "Full Stack",
    "AI/ML",
    "Python",
    "JavaScript",
    "React",
    "DSA",
    "Git/GitHub",
    "SQL",
    "DBMS",
    "OS",
    "Computer Networks",
    "System Design"
]

FIRST_NAMES = [
    "Aarav", "Priya", "Rohan", "Ananya", "Vikram", "Sneha", "Rahul", "Divya", "Arjun", "Pooja",
    "Aditya", "Neha", "Karan", "Kavya", "Siddharth", "Ishita", "Nikhil", "Meera", "Varun", "Riya",
    "Gaurav", "Tanvi", "Akash", "Swati", "Harsh", "Deepika", "Manish", "Shreya", "Abhishek", "Kriti",
    "Mohit", "Aastha", "Suresh", "Bhavna", "Vishal", "Shruti", "Ravi", "Anushka", "Pranav", "Nandini",
    "Sanjay", "Anjali", "Amit", "Simran", "Tarun", "Payal", "Kunal", "Preeti", "Alok", "Chhavi"
]

LAST_NAMES = [
    "Patel", "Sharma", "Gupta", "Iyer", "Aditya", "Kulkarni", "Verma", "Nair", "Mehta", "Reddy",
    "Bose", "Choudhury", "Menon", "Joshi", "Das", "Rao", "Pillai", "Bhat", "Deshmukh", "Singhania",
    "Kapoor", "Mishra", "Banerjee", "Pandey", "Saxena", "Chauhan", "Chatterjee", "Nambiar", "Thakur", "Gowda"
]

TARGET_ROLES = [
    "Full Stack Engineer",
    "Frontend Developer",
    "Backend Engineer",
    "Software Development Engineer (SDE)",
    "AI/ML Engineer",
    "Cloud & DevOps Engineer",
    "Data Engineer",
    "Systems Engineer"
]

COMPANIES_DEF = [
    {
        "id": "comp-technova",
        "name": "TechNova Technologies",
        "is_primary": True,
        "industry": "Enterprise Cloud & SaaS",
        "location": "Bangalore / Hybrid",
        "logo_text": "TechNova",
        "commitment_target": 15,
        "commitment_role": "Software Development Engineer - I",
        "description": "Global enterprise cloud software and developer productivity platform."
    },
    {
        "id": "comp-nexusai",
        "name": "NexusAI Labs",
        "is_primary": False,
        "industry": "Artificial Intelligence & LLMs",
        "location": "Bangalore / Remote",
        "logo_text": "NexusAI",
        "commitment_target": 6,
        "commitment_role": "AI/ML Solutions Engineer",
        "description": "Next-gen generative AI applications and autonomous agents."
    },
    {
        "id": "comp-cloudscale",
        "name": "CloudScale Systems",
        "is_primary": False,
        "industry": "Distributed Cloud Infrastructure",
        "location": "Hyderabad / Hybrid",
        "logo_text": "CloudScale",
        "commitment_target": 10,
        "commitment_role": "Cloud Platform Engineer",
        "description": "High-availability cloud orchestration and Kubernetes runtime systems."
    },
    {
        "id": "comp-datapulse",
        "name": "DataPulse Analytics",
        "is_primary": False,
        "industry": "Big Data & Real-Time Intelligence",
        "location": "Pune",
        "logo_text": "DataPulse",
        "commitment_target": 8,
        "commitment_role": "Data Systems Engineer",
        "description": "Streaming analytics and event-driven data architectures."
    },
    {
        "id": "comp-fintech",
        "name": "FinTech Solutions",
        "is_primary": False,
        "industry": "Financial Technology & Payments",
        "location": "Mumbai / Bangalore",
        "logo_text": "FinTech",
        "commitment_target": 8,
        "commitment_role": "FinTech Backend Engineer",
        "description": "Low-latency microservices powering multi-currency digital transactions."
    },
    {
        "id": "comp-cybershield",
        "name": "CyberShield Dynamics",
        "is_primary": False,
        "industry": "Cybersecurity & Cryptography",
        "location": "Bangalore",
        "logo_text": "CyberShield",
        "commitment_target": 5,
        "commitment_role": "Security Infrastructure Engineer",
        "description": "Zero-trust network architectures and cryptographic validation services."
    },
    {
        "id": "comp-bytewave",
        "name": "ByteWave Labs",
        "is_primary": False,
        "industry": "Consumer Web & Mobile",
        "location": "Bangalore",
        "logo_text": "ByteWave",
        "commitment_target": 7,
        "commitment_role": "Full Stack Web Developer",
        "description": "Consumer internet scale applications with rich interactive frontends."
    },
    {
        "id": "comp-infrastack",
        "name": "InfraStack Networks",
        "is_primary": False,
        "industry": "DevOps & SRE",
        "location": "Chennai",
        "logo_text": "InfraStack",
        "commitment_target": 5,
        "commitment_role": "Site Reliability Engineer",
        "description": "Automated observability and resilient edge networking solutions."
    },
    {
        "id": "comp-quantumlogic",
        "name": "QuantumLogic",
        "is_primary": False,
        "industry": "Algorithmic Computing",
        "location": "Hyderabad",
        "logo_text": "QuantumLogic",
        "commitment_target": 4,
        "commitment_role": "Algorithm Engineer",
        "description": "High-performance computational algorithms and optimization engines."
    },
    {
        "id": "comp-healthtech",
        "name": "HealthTech Labs",
        "is_primary": False,
        "industry": "Digital Health & Telemedicine",
        "location": "Bangalore",
        "logo_text": "HealthTech",
        "commitment_target": 5,
        "commitment_role": "Health Systems Developer",
        "description": "HIPAA-compliant distributed healthcare records and telemetry."
    },
    {
        "id": "comp-eduverse",
        "name": "EduVerse Platforms",
        "is_primary": False,
        "industry": "EdTech & Interactive Media",
        "location": "Gurgaon",
        "logo_text": "EduVerse",
        "commitment_target": 4,
        "commitment_role": "Interactive Frontend Engineer",
        "description": "Next-generation adaptive learning and virtual classroom platform."
    },
    {
        "id": "comp-greentech",
        "name": "GreenTech Innovations",
        "is_primary": False,
        "industry": "CleanTech & IoT",
        "location": "Pune",
        "logo_text": "GreenTech",
        "commitment_target": 4,
        "commitment_role": "IoT Systems Engineer",
        "description": "Smart grid telemetrics and carbon accounting intelligence."
    },
    {
        "id": "comp-hyperscale",
        "name": "HyperScale Cloud",
        "is_primary": False,
        "industry": "Storage & Edge Computing",
        "location": "Bangalore",
        "logo_text": "HyperScale",
        "commitment_target": 6,
        "commitment_role": "Distributed Systems Engineer",
        "description": "Petabyte-scale distributed object storage and caching network."
    },
    {
        "id": "comp-devopsiq",
        "name": "DevOpsIQ",
        "is_primary": False,
        "industry": "Developer Tooling",
        "location": "Noida",
        "logo_text": "DevOpsIQ",
        "commitment_target": 4,
        "commitment_role": "DevOps Platform Engineer",
        "description": "Continuous integration engines and container governance."
    },
    {
        "id": "comp-smartmobility",
        "name": "SmartMobility AI",
        "is_primary": False,
        "industry": "Connected Vehicles & Autonomous Tech",
        "location": "Bangalore",
        "logo_text": "SmartMobility",
        "commitment_target": 4,
        "commitment_role": "Embedded Software Engineer",
        "description": "Telemetry microservices for electric and autonomous mobility fleets."
    }
]

REJECTION_REASONS_CATALOG = [
    "Weak in System Design & Scalability",
    "DSA Optimization & Time Complexity below threshold",
    "Missing Production React & State Management Experience",
    "Lacks Relational Indexing & Query Tuning Depth",
    "Git / Collaboration Best Practices Gap",
    "Insufficient Practical Full Stack Project Depth",
    "Computer Networks / Socket Programming Foundations Missing",
    "OS Concurrency & Multithreading Gap"
]


class DataStore:
    def __init__(self):
        self.state = {}
        if os.path.exists(DATA_FILE):
            try:
                with open(DATA_FILE, "r", encoding="utf-8") as f:
                    self.state = json.load(f)
            except Exception:
                self.reset_to_seed()
        else:
            self.reset_to_seed()

    def save(self):
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(self.state, f, indent=2)

    def reset_to_seed(self):
        """Build deterministic realistic seed data."""
        random.seed(42)  # Deterministic seed for reproducible demo states

        # 1. Institution
        institution = {
            "id": "inst-abc",
            "name": "ABC Institute of Technology",
            "department": "Computer Science and Engineering",
            "code": "ABCT-CS",
            "batch": "2021–2025 (Final Year)",
            "location": "Bangalore, Karnataka",
            "nirf_rank": "#28 (Engineering)",
            "naac_grade": "NAAC A++",
            "total_students": 100
        }

        # 2. Academician
        academician = {
            "id": "acad-sharma",
            "name": "Dr. Rajesh Sharma",
            "designation": "Professor & Head of Training, Placement & Skill Development",
            "department": "Computer Science and Engineering",
            "email": "dr.rajesh.sharma@abctech.ac.in",
            "phone": "+91 98450 12345",
            "fdps_completed": [
                {"title": "Industry 4.0 Curriculum Alignment - Microsoft Research", "date": "Jan 2026", "credits": 40},
                {"title": "Cloud Native & Microservices Pedagogical Workshop - AWS", "date": "Nov 2025", "credits": 35},
                {"title": "Advanced Algorithmic Problem Solving - ACM Chapter", "date": "Aug 2025", "credits": 30}
            ]
        }

        # 3. Companies
        companies = COMPANIES_DEF

        # 4. Job Openings
        jobs = [
            {
                "id": "job-technova-1",
                "company_id": "comp-technova",
                "company_name": "TechNova Technologies",
                "title": "Software Development Engineer - I (Full Stack)",
                "role_category": "Full Stack Engineer",
                "openings": 15,
                "stipend_ctc": "₹14.5 – ₹18.0 LPA",
                "location": "Bangalore / Hybrid",
                "deadline": "2026-10-15",
                "min_cgpa": 7.0,
                "required_skills": {
                    "React": 75,
                    "JavaScript": 75,
                    "DSA": 70,
                    "SQL": 65,
                    "Git/GitHub": 70,
                    "System Design": 65
                },
                "preferred_skills": ["Python", "Full Stack", "DBMS"],
                "description": "Join TechNova's Core Cloud SaaS platform team to build scalable micro-frontends and resilient backend event pipelines."
            },
            {
                "id": "job-technova-2",
                "company_id": "comp-technova",
                "company_name": "TechNova Technologies",
                "title": "Backend Systems Engineer",
                "role_category": "Backend Engineer",
                "openings": 8,
                "stipend_ctc": "₹15.0 – ₹19.5 LPA",
                "location": "Bangalore",
                "deadline": "2026-10-20",
                "min_cgpa": 7.5,
                "required_skills": {
                    "Python": 75,
                    "DSA": 75,
                    "System Design": 70,
                    "SQL": 70,
                    "DBMS": 70,
                    "OS": 65
                },
                "preferred_skills": ["Computer Networks", "Git/GitHub"],
                "description": "Design high-concurrency microservices, caching layers, and database optimization engines."
            },
            {
                "id": "job-technova-3",
                "company_id": "comp-technova",
                "company_name": "TechNova Technologies",
                "title": "Frontend UI/UX Systems Engineer",
                "role_category": "Frontend Developer",
                "openings": 6,
                "stipend_ctc": "₹12.0 – ₹15.5 LPA",
                "location": "Bangalore / Hybrid",
                "deadline": "2026-10-25",
                "min_cgpa": 6.8,
                "required_skills": {
                    "React": 80,
                    "JavaScript": 80,
                    "Web Development": 75,
                    "Git/GitHub": 70
                },
                "preferred_skills": ["Full Stack", "System Design"],
                "description": "Craft lightning-fast web experiences, complex design system components, and WebGL charts."
            },
            {
                "id": "job-nexusai-1",
                "company_id": "comp-nexusai",
                "company_name": "NexusAI Labs",
                "title": "AI/ML Solutions Engineer",
                "role_category": "AI/ML Engineer",
                "openings": 6,
                "stipend_ctc": "₹16.0 – ₹22.0 LPA",
                "location": "Bangalore / Remote",
                "deadline": "2026-10-30",
                "min_cgpa": 7.8,
                "required_skills": {
                    "AI/ML": 75,
                    "Python": 80,
                    "DSA": 75,
                    "SQL": 65
                },
                "preferred_skills": ["Git/GitHub", "System Design"],
                "description": "Develop retrieval-augmented generation (RAG) agents, LLM tool pipelines, and embedding models."
            },
            {
                "id": "job-cloudscale-1",
                "company_id": "comp-cloudscale",
                "company_name": "CloudScale Systems",
                "title": "Cloud Platform & Distributed Systems Engineer",
                "role_category": "Cloud & DevOps Engineer",
                "openings": 10,
                "stipend_ctc": "₹13.5 – ₹17.0 LPA",
                "location": "Hyderabad / Hybrid",
                "deadline": "2026-11-05",
                "min_cgpa": 7.0,
                "required_skills": {
                    "System Design": 70,
                    "OS": 70,
                    "Computer Networks": 70,
                    "Python": 70,
                    "Git/GitHub": 65
                },
                "preferred_skills": ["DSA", "DBMS"],
                "description": "Build automated infrastructure pipelines, edge proxies, and resilient cloud storage fabrics."
            },
            {
                "id": "job-fintech-1",
                "company_id": "comp-fintech",
                "company_name": "FinTech Solutions",
                "title": "High-Throughput Payments Engineer",
                "role_category": "Backend Engineer",
                "openings": 8,
                "stipend_ctc": "₹16.5 – ₹21.0 LPA",
                "location": "Mumbai / Bangalore",
                "deadline": "2026-11-10",
                "min_cgpa": 7.5,
                "required_skills": {
                    "DSA": 80,
                    "SQL": 75,
                    "DBMS": 75,
                    "System Design": 70,
                    "Python": 70
                },
                "preferred_skills": ["OS", "Computer Networks"],
                "description": "Architect sub-millisecond payment rails with ACID guarantees and fault-tolerant ledgers."
            },
            {
                "id": "job-bytewave-1",
                "company_id": "comp-bytewave",
                "company_name": "ByteWave Labs",
                "title": "Full Stack Product Developer",
                "role_category": "Full Stack Engineer",
                "openings": 7,
                "stipend_ctc": "₹11.0 – ₹14.0 LPA",
                "location": "Bangalore",
                "deadline": "2026-11-12",
                "min_cgpa": 6.5,
                "required_skills": {
                    "Web Development": 75,
                    "JavaScript": 75,
                    "React": 70,
                    "Python": 70,
                    "Git/GitHub": 70
                },
                "preferred_skills": ["SQL", "Full Stack"],
                "description": "Ship feature-rich consumer web applications with fast release cadences."
            },
            {
                "id": "job-datapulse-1",
                "company_id": "comp-datapulse",
                "company_name": "DataPulse Analytics",
                "title": "Data Platform & Streaming Engineer",
                "role_category": "Data Engineer",
                "openings": 8,
                "stipend_ctc": "₹13.0 – ₹16.5 LPA",
                "location": "Pune",
                "deadline": "2026-11-15",
                "min_cgpa": 7.0,
                "required_skills": {
                    "Python": 75,
                    "SQL": 80,
                    "DBMS": 75,
                    "DSA": 70
                },
                "preferred_skills": ["System Design", "Git/GitHub"],
                "description": "Construct high-volume real-time event ingestion queues and OLAP data lakes."
            },
            {
                "id": "job-cybershield-1",
                "company_id": "comp-cybershield",
                "company_name": "CyberShield Dynamics",
                "title": "Security Infrastructure & SecOps Specialist",
                "role_category": "Systems Engineer",
                "openings": 5,
                "stipend_ctc": "₹15.0 – ₹19.0 LPA",
                "location": "Bangalore",
                "deadline": "2026-11-20",
                "min_cgpa": 7.2,
                "required_skills": {
                    "Computer Networks": 75,
                    "OS": 75,
                    "Python": 70,
                    "System Design": 65
                },
                "preferred_skills": ["Git/GitHub", "SQL"],
                "description": "Design zero-trust boundary controllers and automated vulnerability analysis engines."
            }
        ]

        # 5. Industry Challenges
        challenges = [
            {
                "id": "chal-tech-1",
                "company_id": "comp-technova",
                "company_name": "TechNova Technologies",
                "title": "High-Throughput Webhook Ingestion Engine",
                "difficulty": "Advanced",
                "category": "System Design & Backend",
                "reward": "Direct Interview Shortlist + ₹50,000 Tech Grant",
                "deadline": "2026-10-18",
                "skills": ["System Design", "Python", "SQL", "DBMS"],
                "submissions_count": 14,
                "description": "Architect and simulate an event webhook receiver supporting 25,000 req/sec with guaranteed idempotency and exponential backoff retry queues."
            },
            {
                "id": "chal-tech-2",
                "company_id": "comp-technova",
                "company_name": "TechNova Technologies",
                "title": "Virtualized Infinite Data Grid in React",
                "difficulty": "Intermediate",
                "category": "Frontend Architecture",
                "reward": "Priority Tech Screen + Swag Bundle",
                "deadline": "2026-10-22",
                "skills": ["React", "JavaScript", "Web Development"],
                "submissions_count": 22,
                "description": "Build a zero-dependency 60 FPS data table rendering 500,000 dynamic records with multi-column sorting, filter predicates, and cell virtualization."
            },
            {
                "id": "chal-nexus-1",
                "company_id": "comp-nexusai",
                "company_name": "NexusAI Labs",
                "title": "Agentic Tool-Calling RAG System",
                "difficulty": "Advanced",
                "category": "AI/ML Systems",
                "reward": "Direct R&D Internship Offer",
                "deadline": "2026-10-25",
                "skills": ["AI/ML", "Python", "DSA"],
                "submissions_count": 9,
                "description": "Develop a multi-turn document question-answering agent that dynamically selects vector search, SQL calculation, or web lookup tools."
            },
            {
                "id": "chal-fintech-1",
                "company_id": "comp-fintech",
                "company_name": "FinTech Solutions",
                "title": "Double-Entry Ledger Microservice with ACID Guarantees",
                "difficulty": "Advanced",
                "category": "Backend & Database",
                "reward": "Fast-track Interview + ₹35,000 Cash Prize",
                "deadline": "2026-11-01",
                "skills": ["SQL", "DBMS", "DSA", "System Design"],
                "submissions_count": 11,
                "description": "Implement a concurrent financial balance transaction processor that handles race conditions, deadlocks, and network partitions cleanly."
            },
            {
                "id": "chal-cloud-1",
                "company_id": "comp-cloudscale",
                "company_name": "CloudScale Systems",
                "title": "Zero-Downtime Blue/Green Service Router",
                "difficulty": "Intermediate",
                "category": "DevOps & Networks",
                "reward": "Summer Cloud Internship Interview",
                "deadline": "2026-11-05",
                "skills": ["Computer Networks", "OS", "Python"],
                "submissions_count": 8,
                "description": "Construct a dynamic reverse proxy simulating live traffic draining and health verification during Canary deployments."
            }
        ]

        # 6. Academician Interventions
        interventions = [
            {
                "id": "int-dsa-1",
                "title": "DSA Mastery & Complex Problem Solving Sprint",
                "target_skill": "DSA",
                "type": "Bootcamp",
                "status": "In Progress",
                "instructor": "Dr. Rajesh Sharma & Tech Alumni",
                "enrolled_count": 42,
                "target_cohort": "Students with DSA score < 72",
                "schedule": "Every Sat & Sun (4 Weeks)",
                "description": "Intensive practice on Trees, Dynamic Programming, Graph algorithms, and LeetCode Medium/Hard patterns."
            },
            {
                "id": "int-sys-1",
                "title": "Production System Design & Scalability Clinic",
                "target_skill": "System Design",
                "type": "Masterclass",
                "status": "Upcoming",
                "instructor": "Industry Guest Mentors (ex-TechNova & Google)",
                "enrolled_count": 35,
                "target_cohort": "Students rejected in TechNova/Cloud rounds",
                "schedule": "Starts Oct 10, 2026",
                "description": "Hands-on architectural modeling: Microservices, Caching, CAP theorem, Message brokers (Kafka/RabbitMQ), and database sharding."
            },
            {
                "id": "int-react-1",
                "title": "Enterprise React 19, Redux Toolkit & State Architecture",
                "target_skill": "React",
                "type": "Workshop",
                "status": "In Progress",
                "instructor": "Prof. S. Nambiar (CSE)",
                "enrolled_count": 38,
                "target_cohort": "Frontend & Full Stack aspirants",
                "schedule": "Wednesdays 4:00 PM - 6:30 PM",
                "description": "Component lifecycle optimization, custom hooks, SSR hydration, and unit testing with Vitest & React Testing Library."
            }
        ]

        # 7. Generate 100 Students with Realistic Variation
        students = []
        for i in range(100):
            roll_no = f"CS-2024-{i+1:03d}"
            fname = FIRST_NAMES[i % len(FIRST_NAMES)]
            lname = LAST_NAMES[(i * 3 + 7) % len(LAST_NAMES)]
            name = f"{fname} {lname}"

            # Student 0 is our canonical demo student: Aarav Patel
            if i == 0:
                name = "Aarav Patel"
                target_role = "Full Stack Engineer"
                cgpa = 8.4
                consent = True
                tier = "Tier 2"  # Well balanced, ready for live testing/actions in demo
            elif i < 25:
                tier = "Tier 1"
                cgpa = round(random.uniform(8.6, 9.8), 2)
                consent = random.random() > 0.1  # 90% consent
                target_role = random.choice(TARGET_ROLES[:4])
            elif i < 70:
                tier = "Tier 2"
                cgpa = round(random.uniform(7.1, 8.5), 2)
                consent = random.random() > 0.25 # 75% consent
                target_role = random.choice(TARGET_ROLES)
            else:
                tier = "Tier 3"
                cgpa = round(random.uniform(6.0, 7.2), 2)
                consent = random.random() > 0.45 # 55% consent
                target_role = random.choice(TARGET_ROLES[3:])

            # Generate skills
            skills = {}
            for skill in CORE_SKILLS:
                if i == 0:
                    # Aarav Patel's exact seeded profile
                    custom_scores = {
                        "Web Development": (84, True, True),
                        "Full Stack": (78, True, True),
                        "JavaScript": (86, True, True),
                        "React": (76, True, False), # Assessed but UNVERIFIED -> can verify in demo!
                        "Python": (74, True, True),
                        "DSA": (71, True, True),
                        "SQL": (77, True, True),
                        "DBMS": (80, True, True),
                        "Git/GitHub": (88, True, True),
                        "OS": (68, True, True),
                        "Computer Networks": (65, True, True),
                        "System Design": (48, True, False), # Known skill gap! < 65 cutoff
                        "AI/ML": (52, False, False) # Unassessed
                    }
                    score, assessed, verified = custom_scores.get(skill, (70, True, False))
                elif tier == "Tier 1":
                    score = int(random.gauss(84, 6))
                    score = max(70, min(98, score))
                    assessed = True
                    verified = random.random() > 0.15
                elif tier == "Tier 2":
                    score = int(random.gauss(68, 8))
                    score = max(52, min(82, score))
                    assessed = random.random() > 0.15
                    verified = assessed and (random.random() > 0.35)
                else:
                    score = int(random.gauss(48, 9))
                    score = max(30, min(65, score))
                    assessed = random.random() > 0.35
                    verified = assessed and (random.random() > 0.65)

                skills[skill] = {
                    "score": score,
                    "assessed": assessed,
                    "verified": verified,
                    "last_assessed_date": "2026-08-15" if assessed else None
                }

            # Projects
            if i == 0:
                projects = [
                    {"title": "Multi-Tenant E-Commerce Microservices", "tech": "React, Node.js, PostgreSQL, Docker", "stars": 18},
                    {"title": "Real-Time Collaborative Code Editor", "tech": "WebSockets, Operational Transformation, Redis", "stars": 24},
                    {"title": "Campus Placement Drive Portal", "tech": "FastAPI, Tailwind CSS, SQLite", "stars": 12}
                ]
            elif tier == "Tier 1":
                projects = [
                    {"title": "Distributed Key-Value Store with Raft", "tech": "Python, gRPC, Docker", "stars": 34},
                    {"title": "Neural Network Edge Inference Engine", "tech": "C++, WebAssembly, Python", "stars": 41},
                    {"title": "FinTech Algorithmic Arbitrage Bot", "tech": "Python, WebSockets, Pandas", "stars": 19}
                ]
            elif tier == "Tier 2":
                projects = [
                    {"title": "Full-Stack Task & Sprint Manager", "tech": "React, Express, MongoDB", "stars": 8},
                    {"title": "Weather Telemetry & Sensor Analytics", "tech": "Python, Flask, SQLite", "stars": 5}
                ]
            else:
                projects = [
                    {"title": "Online Book Library Catalog", "tech": "HTML/CSS, JavaScript, PHP", "stars": 2}
                ]

            avg_score = sum(s["score"] for s in skills.values()) / len(skills)
            verified_count = sum(1 for s in skills.values() if s["verified"])
            readiness_index = int(avg_score * 0.75 + (verified_count / len(skills) * 100) * 0.25)

            student = {
                "id": f"std-{i+1}",
                "roll_no": roll_no,
                "name": name,
                "email": f"{fname.lower()}.{lname.lower()}@abctech.edu",
                "phone": f"+91 {random.randint(91000, 99999)} {random.randint(10000, 99999)}",
                "cgpa": cgpa,
                "tier": tier,
                "consent_talent_pool": consent,
                "target_roles": [target_role, "Software Development Engineer (SDE)"],
                "skills": skills,
                "projects": projects,
                "readiness_index": readiness_index,
                "verified_skills_count": verified_count,
                "total_skills_count": len(skills),
                "remediation_roadmap": []
            }
            students.append(student)

        # 8. Seed Initial Applications
        applications = []
        app_id_counter = 1

        for st_idx in range(45):
            student = students[st_idx]
            if st_idx < 30:
                job = jobs[0]  # TechNova Full Stack SDE-I
                if st_idx < 10:
                    status = "Accepted"
                    rejection_reasons = []
                    feedback = "Outstanding problem solving and verified full-stack competence. Offer extended!"
                elif st_idx < 22:
                    status = "Shortlisted"
                    rejection_reasons = []
                    feedback = "Profile screened successfully. Scheduled for final technical panel interview."
                elif st_idx < 28:
                    status = "Rejected"
                    rejection_reasons = [
                        "Weak in System Design & Scalability",
                        "DSA Optimization & Time Complexity below threshold"
                    ]
                    feedback = "Candidate displayed good React fundamentals, but struggled with distributed caching and query optimization in high-scale scenarios."
                else:
                    status = "Applied"
                    rejection_reasons = []
                    feedback = "Application under review by TechNova Talent Acquisition."

                match_pct, gaps = self._calc_match(student, job)

                app = {
                    "id": f"app-{app_id_counter}",
                    "student_id": student["id"],
                    "student_name": student["name"],
                    "student_roll": student["roll_no"],
                    "student_tier": student["tier"],
                    "job_id": job["id"],
                    "job_title": job["title"],
                    "company_id": job["company_id"],
                    "company_name": job["company_name"],
                    "applied_date": "2026-08-28",
                    "status": status,
                    "match_pct": match_pct,
                    "gaps": gaps,
                    "rejection_reasons": rejection_reasons,
                    "feedback": feedback,
                    "updated_at": "2026-09-02"
                }
                applications.append(app)
                app_id_counter += 1

                if status == "Rejected":
                    for reason in rejection_reasons:
                        student["remediation_roadmap"].append({
                            "trigger_job": job["title"],
                            "company": job["company_name"],
                            "reason": reason,
                            "recommended_intervention": "Production System Design & Scalability Clinic" if "System Design" in reason else "DSA Mastery Sprint",
                            "action_item": f"Complete practice modules for {reason}",
                            "status": "Action Required"
                        })

            if 15 <= st_idx < 35:
                job = jobs[5] # FinTech Payments
                status = "Shortlisted" if st_idx % 2 == 0 else "Applied"
                match_pct, gaps = self._calc_match(student, job)
                applications.append({
                    "id": f"app-{app_id_counter}",
                    "student_id": student["id"],
                    "student_name": student["name"],
                    "student_roll": student["roll_no"],
                    "student_tier": student["tier"],
                    "job_id": job["id"],
                    "job_title": job["title"],
                    "company_id": job["company_id"],
                    "company_name": job["company_name"],
                    "applied_date": "2026-08-30",
                    "status": status,
                    "match_pct": match_pct,
                    "gaps": gaps,
                    "rejection_reasons": [],
                    "feedback": "Reviewing candidate algorithmic scores.",
                    "updated_at": "2026-09-03"
                })
                app_id_counter += 1

        self.state = {
            "institution": institution,
            "academician": academician,
            "companies": companies,
            "jobs": jobs,
            "challenges": challenges,
            "interventions": interventions,
            "students": students,
            "applications": applications
        }
        self.save()

    def _calc_match(self, student: Dict[str, Any], job: Dict[str, Any]):
        """Calculate dynamic skill match percentage and identify exact skill gaps."""
        required_skills = job.get("required_skills", {})
        if not required_skills:
            return 80, []

        total_weight = 0
        earned_score = 0
        gaps = []

        for req_skill, threshold in required_skills.items():
            total_weight += 100
            st_skill = student.get("skills", {}).get(req_skill)
            if not st_skill or not st_skill.get("assessed"):
                gaps.append({
                    "skill": req_skill,
                    "required": threshold,
                    "actual": 0,
                    "gap": threshold,
                    "status": "Not Assessed"
                })
            else:
                score = st_skill.get("score", 0)
                is_verified = st_skill.get("verified", False)
                effective_score = score
                if is_verified:
                    effective_score = min(100, int(score * 1.05))

                if score < threshold:
                    gaps.append({
                        "skill": req_skill,
                        "required": threshold,
                        "actual": score,
                        "gap": threshold - score,
                        "verified": is_verified,
                        "status": "Below Cutoff"
                    })
                earned_score += min(100, effective_score)

        preferred = job.get("preferred_skills", [])
        pref_bonus = 0
        for pref in preferred:
            p_skill = student.get("skills", {}).get(pref)
            if p_skill and p_skill.get("score", 0) >= 65:
                pref_bonus += 3

        match_pct = int((earned_score / total_weight) * 100) + pref_bonus
        match_pct = max(25, min(99, match_pct))
        return match_pct, gaps

    # --- Student Actions ---

    def get_student(self, student_id: str) -> Optional[Dict[str, Any]]:
        for s in self.state["students"]:
            if s["id"] == student_id:
                return s
        return None

    def toggle_consent(self, student_id: str, consent: bool) -> bool:
        student = self.get_student(student_id)
        if student:
            student["consent_talent_pool"] = consent
            self.save()
            return True
        return False

    def assess_skill(self, student_id: str, skill_name: str, score: int, verify: bool = True) -> Dict[str, Any]:
        student = self.get_student(student_id)
        if not student or skill_name not in CORE_SKILLS:
            return {"success": False, "error": "Student or skill not found"}

        student["skills"][skill_name] = {
            "score": score,
            "assessed": True,
            "verified": verify,
            "last_assessed_date": "2026-09-14"
        }

        avg_score = sum(s["score"] for s in student["skills"].values()) / len(student["skills"])
        verified_count = sum(1 for s in student["skills"].values() if s["verified"])
        student["readiness_index"] = int(avg_score * 0.75 + (verified_count / len(student["skills"]) * 100) * 0.25)
        student["verified_skills_count"] = verified_count

        for app in self.state["applications"]:
            if app["student_id"] == student_id:
                job = self.get_job(app["job_id"])
                if job:
                    m_pct, gaps = self._calc_match(student, job)
                    app["match_pct"] = m_pct
                    app["gaps"] = gaps

        self.save()
        return {"success": True, "skill": student["skills"][skill_name], "readiness_index": student["readiness_index"]}

    def apply_to_job(self, student_id: str, job_id: str) -> Dict[str, Any]:
        student = self.get_student(student_id)
        job = self.get_job(job_id)
        if not student or not job:
            return {"success": False, "error": "Invalid student or job"}

        for a in self.state["applications"]:
            if a["student_id"] == student_id and a["job_id"] == job_id:
                return {"success": False, "error": "Already applied to this opening"}

        match_pct, gaps = self._calc_match(student, job)
        new_app = {
            "id": f"app-{len(self.state['applications']) + 1}",
            "student_id": student["id"],
            "student_name": student["name"],
            "student_roll": student["roll_no"],
            "student_tier": student["tier"],
            "job_id": job["id"],
            "job_title": job["title"],
            "company_id": job["company_id"],
            "company_name": job["company_name"],
            "applied_date": "2026-09-14",
            "status": "Applied",
            "match_pct": match_pct,
            "gaps": gaps,
            "rejection_reasons": [],
            "feedback": "Application successfully submitted to company hiring pipeline.",
            "updated_at": "2026-09-14"
        }
        self.state["applications"].insert(0, new_app)
        self.save()
        return {"success": True, "application": new_app}

    def submit_challenge(self, challenge_id: str, student_id: str, repo_url: str, notes: str) -> Dict[str, Any]:
        ch = None
        for c in self.state["challenges"]:
            if c["id"] == challenge_id:
                ch = c
                break
        if not ch:
            return {"success": False, "error": "Challenge not found"}

        ch["submissions_count"] = ch.get("submissions_count", 0) + 1
        self.save()
        return {"success": True, "message": "Challenge solution submitted to company review panel!"}

    # --- Industry Actions ---

    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        for j in self.state["jobs"]:
            if j["id"] == job_id:
                return j
        return None

    def update_application_decision(self, app_id: str, status: str, rejection_reasons: List[str], feedback: str) -> Dict[str, Any]:
        target_app = None
        for a in self.state["applications"]:
            if a["id"] == app_id:
                target_app = a
                break

        if not target_app:
            return {"success": False, "error": "Application not found"}

        target_app["status"] = status
        target_app["rejection_reasons"] = rejection_reasons if status == "Rejected" else []
        target_app["feedback"] = feedback
        target_app["updated_at"] = "2026-09-14"

        if status == "Rejected":
            student = self.get_student(target_app["student_id"])
            if student:
                for reason in rejection_reasons:
                    intervention_rec = "Production System Design & Scalability Clinic"
                    if "DSA" in reason:
                        intervention_rec = "DSA Mastery & Complex Problem Solving Sprint"
                    elif "React" in reason:
                        intervention_rec = "Enterprise React 19 & State Architecture Workshop"
                    elif "Indexing" in reason or "DBMS" in reason:
                        intervention_rec = "Database Query Tuning & Sharding Masterclass"

                    exists = any(r["reason"] == reason and r["trigger_job"] == target_app["job_title"] for r in student.get("remediation_roadmap", []))
                    if not exists:
                        student.setdefault("remediation_roadmap", []).insert(0, {
                            "trigger_job": target_app["job_title"],
                            "company": target_app["company_name"],
                            "reason": reason,
                            "recommended_intervention": intervention_rec,
                            "action_item": f"Enroll in {intervention_rec} and practice assessments to resolve this industry gap.",
                            "status": "Action Required"
                        })

        self.save()
        return {"success": True, "application": target_app}

    def create_challenge(self, company_id: str, title: str, difficulty: str, category: str, reward: str, skills: List[str], description: str) -> Dict[str, Any]:
        comp = None
        for c in self.state["companies"]:
            if c["id"] == company_id:
                comp = c
                break
        company_name = comp["name"] if comp else "TechNova Technologies"

        new_chal = {
            "id": f"chal-user-{len(self.state['challenges']) + 1}",
            "company_id": company_id,
            "company_name": company_name,
            "title": title,
            "difficulty": difficulty,
            "category": category,
            "reward": reward,
            "deadline": "2026-11-30",
            "skills": skills,
            "submissions_count": 0,
            "description": description
        }
        self.state["challenges"].insert(0, new_chal)
        self.save()
        return {"success": True, "challenge": new_chal}

    def create_job(self, company_id: str, title: str, role_category: str, openings: int, stipend_ctc: str, location: str, required_skills: Dict[str, int], preferred_skills: List[str], description: str) -> Dict[str, Any]:
        comp = None
        for c in self.state["companies"]:
            if c["id"] == company_id:
                comp = c
                break
        company_name = comp["name"] if comp else "TechNova Technologies"

        new_job = {
            "id": f"job-user-{len(self.state['jobs']) + 1}",
            "company_id": company_id,
            "company_name": company_name,
            "title": title,
            "role_category": role_category,
            "openings": openings,
            "stipend_ctc": stipend_ctc,
            "location": location,
            "deadline": "2026-11-30",
            "min_cgpa": 6.8,
            "required_skills": required_skills,
            "preferred_skills": preferred_skills,
            "description": description
        }
        self.state["jobs"].insert(0, new_job)
        self.save()
        return {"success": True, "job": new_job}

    # --- Academician Actions ---

    def create_intervention(self, title: str, target_skill: str, type_name: str, instructor: str, target_cohort: str, schedule: str, description: str) -> Dict[str, Any]:
        new_int = {
            "id": f"int-user-{len(self.state['interventions']) + 1}",
            "title": title,
            "target_skill": target_skill,
            "type": type_name,
            "status": "Upcoming",
            "instructor": instructor,
            "enrolled_count": random.randint(15, 30),
            "target_cohort": target_cohort,
            "schedule": schedule,
            "description": description
        }
        self.state["interventions"].insert(0, new_int)
        self.save()
        return {"success": True, "intervention": new_int}

    # --- Aggregates & Analytics ---

    def get_rejection_analytics(self) -> Dict[str, Any]:
        counts = {}
        total_rejected = 0
        for app in self.state["applications"]:
            if app["status"] == "Rejected":
                total_rejected += 1
                for r in app.get("rejection_reasons", []):
                    counts[r] = counts.get(r, 0) + 1

        sorted_reasons = sorted(counts.items(), key=lambda x: x[1], reverse=True)
        return {
            "total_rejected_applications": total_rejected,
            "reasons_breakdown": [{"reason": k, "count": v} for k, v in sorted_reasons]
        }

    def get_commitment_tracker(self) -> List[Dict[str, Any]]:
        trackers = []
        for comp in self.state["companies"]:
            target_hires = comp.get("commitment_target", 10)
            target_role = comp.get("commitment_role", "Software Engineer")

            comp_jobs = [j for j in self.state["jobs"] if j["company_id"] == comp["id"]]
            primary_job = comp_jobs[0] if comp_jobs else None

            eligible_count = 0
            if primary_job:
                for st in self.state["students"]:
                    match_pct, _ = self._calc_match(st, primary_job)
                    if match_pct >= 65:
                        eligible_count += 1

            comp_apps = [a for a in self.state["applications"] if a["company_id"] == comp["id"]]
            shortlisted = sum(1 for a in comp_apps if a["status"] == "Shortlisted")
            accepted_offers = sum(1 for a in comp_apps if a["status"] == "Accepted")
            applied = sum(1 for a in comp_apps if a["status"] == "Applied")

            progress_pct = min(100, int((accepted_offers / target_hires) * 100)) if target_hires > 0 else 0

            trackers.append({
                "company_id": comp["id"],
                "company_name": comp["name"],
                "is_primary": comp.get("is_primary", False),
                "industry": comp.get("industry", ""),
                "target_role": target_role,
                "target_hires": target_hires,
                "eligible_students_count": eligible_count,
                "applied_count": applied,
                "shortlisted_count": shortlisted,
                "offers_extended": accepted_offers,
                "progress_pct": progress_pct,
                "status": "On Track" if progress_pct >= 60 else "Fulfilling" if progress_pct >= 30 else "Recruiting"
            })
        return trackers

    def get_department_analytics(self) -> Dict[str, Any]:
        students = self.state["students"]
        total = len(students)

        tier1 = sum(1 for s in students if s["tier"] == "Tier 1")
        tier2 = sum(1 for s in students if s["tier"] == "Tier 2")
        tier3 = sum(1 for s in students if s["tier"] == "Tier 3")

        avg_readiness = sum(s["readiness_index"] for s in students) / total

        skill_averages = {}
        skill_verified_counts = {}
        for sk in CORE_SKILLS:
            scores = [s["skills"][sk]["score"] for s in students if s["skills"][sk]["assessed"]]
            verified = sum(1 for s in students if s["skills"][sk]["verified"])
            avg = sum(scores) / len(scores) if scores else 0
            skill_averages[sk] = round(avg, 1)
            skill_verified_counts[sk] = verified

        apps = self.state["applications"]
        total_apps = len(apps)
        accepted = sum(1 for a in apps if a["status"] == "Accepted")
        shortlisted = sum(1 for a in apps if a["status"] == "Shortlisted")
        rejected = sum(1 for a in apps if a["status"] == "Rejected")
        applied_pending = sum(1 for a in apps if a["status"] == "Applied")

        industry_benchmark = {
            "React": 78,
            "JavaScript": 76,
            "DSA": 75,
            "SQL": 72,
            "Git/GitHub": 72,
            "System Design": 68,
            "Python": 74,
            "DBMS": 72,
            "OS": 68,
            "Computer Networks": 68,
            "Web Development": 75,
            "Full Stack": 72,
            "AI/ML": 70
        }

        gaps_vs_industry = {}
        for sk, bench in industry_benchmark.items():
            dept_avg = skill_averages.get(sk, 0)
            gaps_vs_industry[sk] = round(dept_avg - bench, 1)

        return {
            "total_students": total,
            "tier_distribution": {"Tier 1 (High Readiness)": tier1, "Tier 2 (Moderate)": tier2, "Tier 3 (Foundational)": tier3},
            "average_readiness_index": round(avg_readiness, 1),
            "consent_rate_pct": round((sum(1 for s in students if s["consent_talent_pool"]) / total) * 100, 1),
            "skill_averages": skill_averages,
            "skill_verified_counts": skill_verified_counts,
            "industry_benchmark": industry_benchmark,
            "gaps_vs_industry": gaps_vs_industry,
            "placement_outcomes": {
                "total_applications": total_apps,
                "accepted_offers": accepted,
                "shortlisted": shortlisted,
                "rejected": rejected,
                "pending": applied_pending
            }
        }


db = DataStore()
