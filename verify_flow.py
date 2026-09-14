"""
Automated verification script for Academia–Industry Skill Intelligence & Employability Platform.
Tests the complete end-to-end interconnected lifecycle.
"""

from data_store import db

def test_full_pipeline():
    print("--- [1] Testing Seed Data Integrity ---")
    db.reset_to_seed()
    
    assert db.state["institution"]["name"] == "ABC Institute of Technology"
    assert db.state["academician"]["name"] == "Dr. Rajesh Sharma"
    assert len(db.state["students"]) == 100, f"Expected 100 students, got {len(db.state['students'])}"
    assert len(db.state["companies"]) == 15, f"Expected 15 companies, got {len(db.state['companies'])}"
    assert any(c["name"] == "TechNova Technologies" and c["is_primary"] for c in db.state["companies"])
    print(" Seed counts verified: 100 students, 15 companies, 1 academician, 1 institution.")

    print("\n--- [2] Testing Student Profile & Skill Match ---")
    student = db.get_student("std-1")
    assert student is not None
    assert student["name"] == "Aarav Patel"
    print(f" Student 1: {student['name']}, Readiness: {student['readiness_index']}%, Verified: {student['verified_skills_count']}/13")

    job = db.get_job("job-technova-1")
    match_pct, gaps = db._calc_match(student, job)
    print(f" Initial match % for TechNova SDE-I: {match_pct}% (Gaps: {len(gaps)})")
    assert match_pct > 50

    print("\n--- [3] Testing Skill Assessment & Verification ---")
    # Verify React
    res = db.assess_skill("std-1", "React", 88, verify=True)
    assert res["success"] is True
    updated_student = db.get_student("std-1")
    assert updated_student["skills"]["React"]["verified"] is True
    assert updated_student["skills"]["React"]["score"] == 88
    print(f" React assessed & verified: score 88, verified={updated_student['skills']['React']['verified']}")

    print("\n--- [4] Testing Job Application ---")
    # Apply to TechNova Job 2 (Backend Systems Engineer)
    app_res = db.apply_to_job("std-1", "job-technova-2")
    assert app_res["success"] is True
    new_app = app_res["application"]
    app_id = new_app["id"]
    print(f" Application created: ID {app_id}, Status={new_app['status']}, Match={new_app['match_pct']}%")

    print("\n--- [5] Testing Industry Decision & Ripple Effects ---")
    initial_rejections = db.get_rejection_analytics()["total_rejected_applications"]
    
    # TechNova rejects with specific feedback
    dec_res = db.update_application_decision(
        app_id,
        status="Rejected",
        rejection_reasons=["Weak in System Design & Scalability", "DSA Optimization & Time Complexity below threshold"],
        feedback="Candidate demonstrated good syntax fundamentals, but struggled with distributed caching and query optimization in high-scale scenarios."
    )
    assert dec_res["success"] is True

    # 1. Check Student Roadmap updated
    st_updated = db.get_student("std-1")
    remed_items = st_updated.get("remediation_roadmap", [])
    assert len(remed_items) > 0
    assert any(r["reason"] == "Weak in System Design & Scalability" for r in remed_items)
    print(f" Student roadmap updated with {len(remed_items)} remediation actions!")

    # 2. Check Academician Rejection Analytics updated
    rej_analytics = db.get_rejection_analytics()
    assert rej_analytics["total_rejected_applications"] == initial_rejections + 1
    top_reason = rej_analytics["reasons_breakdown"][0]
    print(f" Academician Analytics: Total Rejections = {rej_analytics['total_rejected_applications']}, Top Reason = '{top_reason['reason']}' ({top_reason['count']})")

    # 3. Check Institution Commitment Tracker updated
    trackers = db.get_commitment_tracker()
    technova_tracker = [t for t in trackers if t["company_name"] == "TechNova Technologies"][0]
    print(f" Institution Tracker for TechNova: Target={technova_tracker['target_hires']}, Eligible={technova_tracker['eligible_students_count']}, Offers={technova_tracker['offers_extended']}, Progress={technova_tracker['progress_pct']}%")

    print("\n--- [6] Testing Academician Intervention Creation ---")
    intv_res = db.create_intervention(
        title="High-Scale Distributed Caching & System Design Clinic",
        target_skill="System Design",
        type_name="Clinic",
        instructor="Dr. Rajesh Sharma & TechNova Architects",
        target_cohort="Students with System Design score < 65",
        schedule="Every Saturday 10 AM - 1 PM",
        description="Focused clinic on Redis, Kafka, and sharding."
    )
    assert intv_res["success"] is True
    print(f" Intervention created: '{intv_res['intervention']['title']}'")

    print("\n--- [7] Testing Consent Toggle for Talent Pool ---")
    db.toggle_consent("std-1", False)
    assert db.get_student("std-1")["consent_talent_pool"] is False
    db.toggle_consent("std-1", True)
    assert db.get_student("std-1")["consent_talent_pool"] is True
    print(" Talent pool consent toggle verified.")

    print("\n ALL END-TO-END FLOW TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_full_pipeline()
