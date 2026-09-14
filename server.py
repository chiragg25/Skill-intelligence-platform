"""
Skill Intelligence & Employability Platform - FastAPI Server
Unified API backend serving Student, Academician, Institution, and Industry views.
"""

import os
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from data_store import db, CORE_SKILLS

app = FastAPI(
    title="Academia–Industry Skill Intelligence & Employability Platform",
    description="Cross-role skill intelligence, dynamic eligibility matching, and shared analytics engine.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ConsentRequest(BaseModel):
    consent: bool

class AssessmentRequest(BaseModel):
    skill_name: str
    score: int
    verify: bool = True

class ApplicationRequest(BaseModel):
    student_id: str
    job_id: str

class DecisionRequest(BaseModel):
    status: str
    rejection_reasons: List[str] = []
    feedback: str = ""

class InterventionRequest(BaseModel):
    title: str
    target_skill: str
    type_name: str
    instructor: str
    target_cohort: str
    schedule: str
    description: str

class ChallengeRequest(BaseModel):
    company_id: str
    title: str
    difficulty: str
    category: str
    reward: str
    skills: List[str]
    description: str

class ChallengeSubmitRequest(BaseModel):
    student_id: str
    repo_url: str = ""
    notes: str = ""

class JobRequest(BaseModel):
    company_id: str
    title: str
    role_category: str
    openings: int
    stipend_ctc: str
    location: str
    required_skills: Dict[str, int]
    preferred_skills: List[str] = []
    description: str


# --- Endpoints ---

@app.get("/")
def root():
    return RedirectResponse(url="/static/index.html")

@app.get("/api/state")
def get_full_state():
    """Return platform metadata, analytics, and lists."""
    dept_analytics = db.get_department_analytics()
    rejection_analytics = db.get_rejection_analytics()
    commitment_tracker = db.get_commitment_tracker()

    return {
        "institution": db.state["institution"],
        "academician": db.state["academician"],
        "companies": db.state["companies"],
        "jobs": db.state["jobs"],
        "challenges": db.state["challenges"],
        "interventions": db.state["interventions"],
        "applications": db.state["applications"],
        "department_analytics": dept_analytics,
        "rejection_analytics": rejection_analytics,
        "commitment_tracker": commitment_tracker,
        "core_skills": CORE_SKILLS
    }

@app.get("/api/students")
def get_students(tier: Optional[str] = None, consent: Optional[bool] = None, search: Optional[str] = None):
    """Retrieve all 100 students with optional filtering."""
    results = db.state["students"]
    if tier:
        results = [s for s in results if s["tier"].lower() == tier.lower()]
    if consent is not None:
        results = [s for s in results if s["consent_talent_pool"] == consent]
    if search:
        q = search.lower()
        results = [s for s in results if q in s["name"].lower() or q in s["roll_no"].lower() or any(q in r.lower() for r in s["target_roles"])]
    return results

@app.get("/api/students/{student_id}")
def get_student_profile(student_id: str):
    """Get full details for an individual student."""
    student = db.get_student(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Fetch their applications
    student_apps = [a for a in db.state["applications"] if a["student_id"] == student_id]

    # Calculate match % for all available jobs for this student
    jobs_with_match = []
    for job in db.state["jobs"]:
        match_pct, gaps = db._calc_match(student, job)
        applied = any(a["job_id"] == job["id"] for a in student_apps)
        jobs_with_match.append({
            **job,
            "match_pct": match_pct,
            "gaps": gaps,
            "already_applied": applied
        })

    # Sort jobs by match percentage descending
    jobs_with_match.sort(key=lambda x: x["match_pct"], reverse=True)

    return {
        "student": student,
        "applications": student_apps,
        "recommended_jobs": jobs_with_match,
        "interventions": db.state["interventions"]
    }

@app.post("/api/students/{student_id}/consent")
def update_consent(student_id: str, payload: ConsentRequest):
    success = db.toggle_consent(student_id, payload.consent)
    if not success:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"success": True, "consent_talent_pool": payload.consent}

@app.post("/api/students/{student_id}/assess")
def assess_skill(student_id: str, payload: AssessmentRequest):
    result = db.assess_skill(student_id, payload.skill_name, payload.score, payload.verify)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "Failed to assess skill"))
    return result

@app.post("/api/applications/apply")
def apply_to_job(payload: ApplicationRequest):
    result = db.apply_to_job(payload.student_id, payload.job_id)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "Application failed"))
    return result

@app.post("/api/applications/{app_id}/decision")
def record_application_decision(app_id: str, payload: DecisionRequest):
    """
    Industry user decisions (Shortlisted, Accepted, Rejected).
    Ripples to student feedback, academician analytics, and institution skill gap.
    """
    result = db.update_application_decision(
        app_id,
        payload.status,
        payload.rejection_reasons,
        payload.feedback
    )
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "Decision update failed"))
    return result

@app.post("/api/interventions")
def create_intervention(payload: InterventionRequest):
    result = db.create_intervention(
        payload.title,
        payload.target_skill,
        payload.type_name,
        payload.instructor,
        payload.target_cohort,
        payload.schedule,
        payload.description
    )
    return result

@app.post("/api/challenges")
def create_challenge(payload: ChallengeRequest):
    result = db.create_challenge(
        payload.company_id,
        payload.title,
        payload.difficulty,
        payload.category,
        payload.reward,
        payload.skills,
        payload.description
    )
    return result

@app.post("/api/challenges/{challenge_id}/submit")
def submit_challenge(challenge_id: str, payload: ChallengeSubmitRequest):
    result = db.submit_challenge(challenge_id, payload.student_id, payload.repo_url, payload.notes)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "Submission failed"))
    return result

@app.post("/api/jobs")
def create_job(payload: JobRequest):
    result = db.create_job(
        payload.company_id,
        payload.title,
        payload.role_category,
        payload.openings,
        payload.stipend_ctc,
        payload.location,
        payload.required_skills,
        payload.preferred_skills,
        payload.description
    )
    return result

@app.post("/api/data/reset")
def reset_demo_data():
    db.reset_to_seed()
    return {"success": True, "message": "Demo data reset to initial seeded state"}


# Static files mount
static_dir = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
