/**
 * Main Application Logic for Academia–Industry Skill Intelligence Platform
 */

const App = {
  currentRole: 'student', // 'student', 'academician', 'institution', 'industry'
  activeSubtabs: {
    student: 'home',
    academician: 'home',
    institution: 'dashboard',
    industry: 'dashboard'
  },
  currentStudentId: 'std-1',
  platformData: null,
  studentProfile: null,
  allStudents: [],

  async init() {
    this.setupEventListeners();
    await this.refreshData();
    this.switchRole('student');
  },

  showToast(message, type = 'primary') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let borderColor = '#4f46e5';
    let icon = 'info';
    if (type === 'success') { borderColor = '#10b981'; icon = 'check-circle'; }
    if (type === 'danger') { borderColor = '#ef4444'; icon = 'alert-triangle'; }
    if (type === 'warning') { borderColor = '#f59e0b'; icon = 'alert-circle'; }

    toast.style.borderLeftColor = borderColor;
    toast.innerHTML = `
      <div class="flex-1">
        <p class="text-sm font-medium text-slate-800">${message}</p>
      </div>
      <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-slate-600">
        &times;
      </button>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 4500);
  },

  async refreshData() {
    try {
      const [stateRes, studentsRes, profileRes] = await Promise.all([
        fetch('/api/state').then(r => r.json()),
        fetch('/api/students').then(r => r.json()),
        fetch(`/api/students/${this.currentStudentId}`).then(r => r.json())
      ]);

      this.platformData = stateRes;
      this.allStudents = studentsRes;
      this.studentProfile = profileRes;

      this.renderPersonaSelector();
      this.renderCurrentView();
    } catch (err) {
      console.error('Error fetching platform data:', err);
      this.showToast('Failed to sync platform state', 'danger');
    }
  },

  setupEventListeners() {
    // Role switcher pills
    document.querySelectorAll('[data-role-switch]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const role = e.currentTarget.getAttribute('data-role-switch');
        this.switchRole(role);
      });
    });

    // Subnav buttons
    document.addEventListener('click', (e) => {
      const subnavBtn = e.target.closest('[data-subnav]');
      if (subnavBtn) {
        const role = subnavBtn.getAttribute('data-role');
        const tab = subnavBtn.getAttribute('data-subnav');
        this.switchSubtab(role, tab);
      }
    });

    // Persona switcher change
    const personaSelect = document.getElementById('persona-select');
    if (personaSelect) {
      personaSelect.addEventListener('change', async (e) => {
        this.currentStudentId = e.target.value;
        this.showToast(`Switched active student to ${e.target.options[e.target.selectedIndex].text}`, 'primary');
        await this.refreshData();
      });
    }

    // Reset button
    const resetBtn = document.getElementById('reset-demo-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        if (confirm('Reset all demo data back to default seeded state?')) {
          await fetch('/api/data/reset', { method: 'POST' });
          this.showToast('Demo data reset to clean initial seed!', 'success');
          await this.refreshData();
        }
      });
    }
  },

  switchRole(role) {
    this.currentRole = role;

    // Update switcher pill buttons
    document.querySelectorAll('[data-role-switch]').forEach(btn => {
      if (btn.getAttribute('data-role-switch') === role) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Toggle view containers
    document.querySelectorAll('.role-view').forEach(view => {
      if (view.id === `view-${role}`) {
        view.classList.remove('hidden');
      } else {
        view.classList.add('hidden');
      }
    });

    // Render active tab for this role
    this.switchSubtab(role, this.activeSubtabs[role]);
  },

  switchSubtab(role, tab) {
    this.activeSubtabs[role] = tab;

    // Update tab pills inside role
    const container = document.getElementById(`view-${role}`);
    if (!container) return;

    container.querySelectorAll('[data-subnav]').forEach(btn => {
      if (btn.getAttribute('data-subnav') === tab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    container.querySelectorAll('.tab-content').forEach(tc => {
      if (tc.id === `${role}-tab-${tab}`) {
        tc.classList.remove('hidden');
      } else {
        tc.classList.add('hidden');
      }
    });

    this.renderCurrentView();
  },

  renderPersonaSelector() {
    const select = document.getElementById('persona-select');
    if (!select || !this.allStudents.length) return;

    select.innerHTML = '';
    this.allStudents.forEach(st => {
      const opt = document.createElement('option');
      opt.value = st.id;
      opt.textContent = `${st.name} (${st.roll_no}) - ${st.tier} [Readiness: ${st.readiness_index}%]`;
      if (st.id === this.currentStudentId) opt.selected = true;
      select.appendChild(opt);
    });
  },

  renderCurrentView() {
    if (!this.platformData) return;

    if (this.currentRole === 'student') {
      this.renderStudentView();
    } else if (this.currentRole === 'academician') {
      this.renderAcademicianView();
    } else if (this.currentRole === 'institution') {
      this.renderInstitutionView();
    } else if (this.currentRole === 'industry') {
      this.renderIndustryView();
    }
  },

  // ==========================================
  // 1. STUDENT VIEW RENDERING & ACTIONS
  // ==========================================
  renderStudentView() {
    if (!this.studentProfile) return;
    const st = this.studentProfile.student;
    const activeTab = this.activeSubtabs.student;

    // Header info
    document.getElementById('st-profile-name').textContent = st.name;
    document.getElementById('st-profile-roll').textContent = `${st.roll_no} • ${st.target_roles[0]}`;
    document.getElementById('st-profile-cgpa').textContent = `CGPA: ${st.cgpa}`;
    document.getElementById('st-profile-tier').textContent = st.tier;

    if (activeTab === 'home') {
      this.renderStudentHome();
    } else if (activeTab === 'skills') {
      this.renderStudentSkills();
    } else if (activeTab === 'assessments') {
      this.renderStudentAssessments();
    } else if (activeTab === 'challenges') {
      this.renderStudentChallenges();
    } else if (activeTab === 'opportunities') {
      this.renderStudentOpportunities();
    } else if (activeTab === 'applications') {
      this.renderStudentApplications();
    } else if (activeTab === 'talent-pool') {
      this.renderStudentTalentPool();
    }
  },

  renderStudentHome() {
    const st = this.studentProfile.student;
    const apps = this.studentProfile.applications;
    const jobs = this.studentProfile.recommended_jobs;

    // Metrics
    document.getElementById('st-kpi-readiness').textContent = `${st.readiness_index}%`;
    document.getElementById('st-kpi-verified').textContent = `${st.verified_skills_count} / ${st.total_skills_count}`;
    document.getElementById('st-kpi-apps').textContent = apps.length;
    document.getElementById('st-kpi-consent').innerHTML = st.consent_talent_pool 
      ? '<span class="text-emerald-600 font-semibold flex items-center gap-1">Active (Shared)</span>' 
      : '<span class="text-amber-600 font-semibold flex items-center gap-1">Opted Out</span>';

    // Top recommended opportunities
    const recContainer = document.getElementById('st-home-recommended-jobs');
    recContainer.innerHTML = '';
    jobs.slice(0, 3).forEach(job => {
      const card = document.createElement('div');
      card.className = 'p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow flex flex-col justify-between';
      card.innerHTML = `
        <div>
          <div class="flex items-start justify-between">
            <span class="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">${job.company_name}</span>
            <span class="text-xs font-bold px-2 py-0.5 rounded ${job.match_pct >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
              ${job.match_pct}% Match
            </span>
          </div>
          <h4 class="font-bold text-slate-900 mt-2">${job.title}</h4>
          <p class="text-xs text-slate-500 mt-1">${job.stipend_ctc} • ${job.location}</p>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs text-slate-400">${job.openings} openings</span>
          ${job.already_applied 
            ? '<span class="text-xs font-medium text-slate-500">Applied</span>' 
            : `<button onclick="App.applyToJob('${job.id}')" class="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700">Apply</button>`
          }
        </div>
      `;
      recContainer.appendChild(card);
    });

    // Upcoming interventions / workshops
    const workshopContainer = document.getElementById('st-home-workshops');
    workshopContainer.innerHTML = '';
    (this.platformData.interventions || []).slice(0, 3).forEach(w => {
      const item = document.createElement('div');
      item.className = 'p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between';
      item.innerHTML = `
        <div>
          <div class="text-xs font-semibold text-indigo-600">${w.type} • ${w.target_skill}</div>
          <div class="font-semibold text-sm text-slate-800">${w.title}</div>
          <div class="text-xs text-slate-500">${w.instructor} • ${w.schedule}</div>
        </div>
        <span class="badge badge-primary text-xs">${w.status}</span>
      `;
      workshopContainer.appendChild(item);
    });

    // Action alerts / feedback banner if any
    const alertBanner = document.getElementById('st-home-alerts');
    const rejectedWithFeedback = apps.filter(a => a.status === 'Rejected' && a.rejection_reasons?.length);
    if (rejectedWithFeedback.length > 0) {
      alertBanner.classList.remove('hidden');
      const latest = rejectedWithFeedback[0];
      alertBanner.innerHTML = `
        <div class="p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl flex items-start gap-3">
          <div class="text-rose-600 text-xl font-bold">⚠️</div>
          <div class="flex-1">
            <h4 class="text-sm font-bold text-rose-900">Industry Rejection Feedback Received (${latest.company_name})</h4>
            <p class="text-xs text-rose-700 mt-1">${latest.feedback}</p>
            <div class="mt-2 flex flex-wrap gap-1">
              ${latest.rejection_reasons.map(r => `<span class="badge badge-danger text-xs">${r}</span>`).join('')}
            </div>
            <button onclick="App.switchSubtab('student', 'skills')" class="mt-2 text-xs font-semibold text-rose-800 underline hover:text-rose-950">
              View Personalized Remediation Roadmap &rarr;
            </button>
          </div>
        </div>
      `;
    } else {
      alertBanner.classList.add('hidden');
    }
  },

  renderStudentSkills() {
    const st = this.studentProfile.student;
    const skillsList = document.getElementById('st-skills-grid');
    skillsList.innerHTML = '';

    Object.entries(st.skills).forEach(([skillName, sInfo]) => {
      const card = document.createElement('div');
      card.className = 'p-4 bg-white border border-slate-200 rounded-xl flex flex-col justify-between';
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between">
            <span class="font-bold text-sm text-slate-800">${skillName}</span>
            <span class="text-xs font-bold ${sInfo.score >= 75 ? 'text-emerald-600' : sInfo.score >= 60 ? 'text-blue-600' : 'text-amber-600'}">
              ${sInfo.score}/100
            </span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2 mt-2">
            <div class="h-2 rounded-full ${sInfo.score >= 75 ? 'bg-emerald-500' : sInfo.score >= 60 ? 'bg-blue-500' : 'bg-amber-500'}" style="width: ${sInfo.score}%"></div>
          </div>
          <div class="flex items-center gap-2 mt-3 text-xs">
            <span class="badge ${sInfo.assessed ? 'badge-primary' : 'badge-gray'}">
              ${sInfo.assessed ? 'Assessed' : 'Not Assessed'}
            </span>
            <span class="badge ${sInfo.verified ? 'badge-success' : 'badge-warning'}">
              ${sInfo.verified ? '✓ Verified' : 'Unverified'}
            </span>
          </div>
        </div>
        <div class="mt-3 pt-2 border-t border-slate-100 flex justify-end">
          <button onclick="App.openAssessmentModal('${skillName}', ${sInfo.score})" class="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
            ${sInfo.verified ? 'Retake Test' : 'Verify Skill &rarr;'}
          </button>
        </div>
      `;
      skillsList.appendChild(card);
    });

    // Render Student Skill Radar Chart
    ChartManager.renderStudentRadar('st-skill-radar-chart', st.skills, st.target_roles[0]);

    // Render Remediation Roadmap
    const roadmapContainer = document.getElementById('st-roadmap-items');
    roadmapContainer.innerHTML = '';
    const roadmapItems = st.remediation_roadmap || [];

    if (roadmapItems.length === 0) {
      roadmapContainer.innerHTML = `
        <div class="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500 text-sm">
          No critical remediation alerts. Target System Design and DSA to stay competitive!
        </div>
      `;
    } else {
      roadmapItems.forEach((rm, idx) => {
        const item = document.createElement('div');
        item.className = 'p-4 bg-white border border-rose-200 rounded-xl flex items-start justify-between gap-4';
        item.innerHTML = `
          <div>
            <div class="flex items-center gap-2">
              <span class="badge badge-danger text-xs font-semibold">Remediation #${idx+1}</span>
              <span class="text-xs text-slate-500">Triggered by ${rm.company} (${rm.trigger_job})</span>
            </div>
            <h4 class="font-bold text-slate-900 mt-1">${rm.reason}</h4>
            <p class="text-xs text-slate-600 mt-1">Recommended Measure: <strong class="text-indigo-600">${rm.recommended_intervention}</strong></p>
            <p class="text-xs text-slate-500 mt-1">${rm.action_item}</p>
          </div>
          <button onclick="App.openAssessmentModal('${rm.reason.includes('System Design') ? 'System Design' : rm.reason.includes('DSA') ? 'DSA' : 'React'}', 75)" class="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 whitespace-nowrap">
            Verify Fix
          </button>
        `;
        roadmapContainer.appendChild(item);
      });
    }
  },

  renderStudentAssessments() {
    const st = this.studentProfile.student;
    const grid = document.getElementById('st-assessments-grid');
    grid.innerHTML = '';

    Object.entries(st.skills).forEach(([skill, data]) => {
      const card = document.createElement('div');
      card.className = 'p-5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between';
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-slate-900">${skill}</h4>
            <span class="badge ${data.verified ? 'badge-success' : 'badge-warning'}">
              ${data.verified ? '✓ Verified Credential' : 'Pending Verification'}
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-2">Latest Score: <strong class="text-slate-800">${data.score}/100</strong></p>
          <p class="text-xs text-slate-400">Assessed: ${data.last_assessed_date || 'Never'}</p>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs text-slate-500">15 min Proctored Test</span>
          <button onclick="App.openAssessmentModal('${skill}', ${data.score})" class="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700">
            ${data.verified ? 'Retake Assessment' : 'Take Test to Verify'}
          </button>
        </div>
      `;
      grid.appendChild(card);
    });
  },

  renderStudentChallenges() {
    const challenges = this.platformData.challenges || [];
    const container = document.getElementById('st-challenges-list');
    container.innerHTML = '';

    challenges.forEach(ch => {
      const card = document.createElement('div');
      card.className = 'p-5 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow';
      card.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider">${ch.company_name}</span>
              <span class="badge badge-primary text-xs">${ch.category}</span>
              <span class="badge ${ch.difficulty === 'Advanced' ? 'badge-danger' : 'badge-warning'} text-xs">${ch.difficulty}</span>
            </div>
            <h3 class="text-base font-bold text-slate-900 mt-1">${ch.title}</h3>
            <p class="text-xs text-slate-600 mt-1 max-w-2xl">${ch.description}</p>
          </div>
          <div class="text-right flex flex-col items-start md:items-end justify-between">
            <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">${ch.reward}</span>
            <span class="text-xs text-slate-400 mt-1">${ch.submissions_count} submissions</span>
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div class="flex flex-wrap gap-1">
            ${ch.skills.map(s => `<span class="badge badge-gray text-xs">${s}</span>`).join('')}
          </div>
          <button onclick="App.openChallengeModal('${ch.id}', '${ch.title}')" class="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800">
            Submit Solution &rarr;
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  },

  renderStudentOpportunities() {
    const jobs = this.studentProfile.recommended_jobs || [];
    const container = document.getElementById('st-opportunities-list');
    container.innerHTML = '';

    jobs.forEach(job => {
      const card = document.createElement('div');
      card.className = 'p-5 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow';
      
      const reqList = Object.entries(job.required_skills).map(([sk, min]) => {
        const studentSkill = this.studentProfile.student.skills[sk];
        const studentScore = studentSkill ? studentSkill.score : 0;
        const meets = studentScore >= min;
        return `
          <span class="text-xs px-2 py-0.5 rounded ${meets ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}">
            ${sk}: ${studentScore}/${min} ${meets ? '✓' : '✗'}
          </span>
        `;
      }).join(' ');

      card.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm text-indigo-600">${job.company_name}</span>
              <span class="text-xs text-slate-400">• ${job.location}</span>
              <span class="text-xs font-semibold text-slate-700">• ${job.stipend_ctc}</span>
            </div>
            <h3 class="text-base font-bold text-slate-900 mt-1">${job.title}</h3>
            <p class="text-xs text-slate-500 mt-1">${job.description}</p>
          </div>
          <div class="text-left md:text-right">
            <div class="inline-block text-center px-3 py-1.5 rounded-xl ${job.match_pct >= 75 ? 'bg-emerald-100 text-emerald-800' : job.match_pct >= 60 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}">
              <div class="text-lg font-black">${job.match_pct}%</div>
              <div class="text-[10px] font-semibold uppercase">Skill Match</div>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-xs font-semibold text-slate-500 mr-1">Eligibility Criteria:</span>
            ${reqList}
          </div>
          <div>
            ${job.already_applied 
              ? '<button disabled class="px-4 py-2 bg-slate-100 text-slate-400 text-xs font-semibold rounded-lg cursor-not-allowed">Applied</button>'
              : `<button onclick="App.applyToJob('${job.id}')" class="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 shadow-sm">Apply Now</button>`
            }
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  },

  renderStudentApplications() {
    const apps = this.studentProfile.applications || [];
    const container = document.getElementById('st-applications-list');
    container.innerHTML = '';

    if (apps.length === 0) {
      container.innerHTML = `<div class="p-8 text-center text-slate-500 text-sm">You haven't submitted any job applications yet. Visit Opportunities to apply!</div>`;
      return;
    }

    apps.forEach(app => {
      let statusBadge = '';
      if (app.status === 'Accepted') statusBadge = '<span class="badge badge-success text-xs font-bold">Offer Extended</span>';
      else if (app.status === 'Shortlisted') statusBadge = '<span class="badge badge-primary text-xs font-bold">Shortlisted</span>';
      else if (app.status === 'Rejected') statusBadge = '<span class="badge badge-danger text-xs font-bold">Rejected</span>';
      else statusBadge = '<span class="badge badge-gray text-xs font-bold">Under Review</span>';

      const card = document.createElement('div');
      card.className = `p-5 bg-white border ${app.status === 'Rejected' ? 'border-rose-200' : 'border-slate-200'} rounded-xl`;
      card.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold text-indigo-600">${app.company_name}</span>
              <span class="text-xs text-slate-400">Applied: ${app.applied_date}</span>
            </div>
            <h3 class="text-base font-bold text-slate-900 mt-1">${app.job_title}</h3>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-slate-600">Match: ${app.match_pct}%</span>
            ${statusBadge}
          </div>
        </div>

        ${app.status === 'Rejected' ? `
          <div class="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg">
            <div class="text-xs font-bold text-rose-800">Recruiter Feedback & Identified Gaps:</div>
            <p class="text-xs text-rose-700 mt-1">${app.feedback || 'No specific feedback provided.'}</p>
            ${app.rejection_reasons?.length ? `
              <div class="mt-2 flex flex-wrap gap-1">
                ${app.rejection_reasons.map(r => `<span class="badge badge-danger text-xs">${r}</span>`).join('')}
              </div>
            ` : ''}
            <div class="mt-2 text-xs text-rose-900 font-semibold">
              💡 Action item: This deficit has been added to your Roadmap tab with recommended workshops.
            </div>
          </div>
        ` : `
          <div class="mt-3 text-xs text-slate-500">
            <strong>Recruiter Note:</strong> ${app.feedback || 'In active review.'}
          </div>
        `}
      `;
      container.appendChild(card);
    });
  },

  renderStudentTalentPool() {
    const st = this.studentProfile.student;
    const consentToggle = document.getElementById('st-talent-consent-toggle');
    const consentStatus = document.getElementById('st-talent-consent-status');

    if (consentToggle) {
      consentToggle.checked = st.consent_talent_pool;
      consentStatus.textContent = st.consent_talent_pool 
        ? 'Active (Your verified skill profile is discoverable by TechNova and 14 hiring partners)'
        : 'Inactive (Your profile is hidden from institutional talent searches)';
      
      consentToggle.onchange = async (e) => {
        const val = e.target.checked;
        await fetch(`/api/students/${st.id}/consent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ consent: val })
        });
        this.showToast(val ? 'Profile shared with Institutional Talent Pool' : 'Opted out of Talent Pool', 'success');
        await this.refreshData();
      };
    }
  },

  async applyToJob(jobId) {
    try {
      const res = await fetch('/api/applications/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: this.currentStudentId,
          job_id: jobId
        })
      });
      const data = await res.json();
      if (data.success) {
        this.showToast('Application successfully submitted! Visible to recruiter.', 'success');
        await this.refreshData();
        this.switchSubtab('student', 'applications');
      } else {
        this.showToast(data.error || 'Failed to apply', 'warning');
      }
    } catch (e) {
      this.showToast('Network error while applying', 'danger');
    }
  },

  openAssessmentModal(skillName, currentScore) {
    const modal = document.getElementById('assessment-modal');
    modal.classList.remove('hidden');
    document.getElementById('modal-skill-name').textContent = skillName;
    document.getElementById('modal-skill-score').value = Math.min(95, currentScore + 10);
    
    document.getElementById('modal-assessment-submit').onclick = async () => {
      const newScore = parseInt(document.getElementById('modal-skill-score').value, 10);
      const res = await fetch(`/api/students/${this.currentStudentId}/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill_name: skillName,
          score: newScore,
          verify: true
        })
      });
      const data = await res.json();
      if (data.success) {
        this.showToast(`Verified ${skillName} with score ${newScore}/100!`, 'success');
        modal.classList.add('hidden');
        await this.refreshData();
      }
    };
  },

  openChallengeModal(challengeId, title) {
    const modal = document.getElementById('challenge-submit-modal');
    modal.classList.remove('hidden');
    document.getElementById('modal-ch-title').textContent = title;
    
    document.getElementById('modal-ch-submit').onclick = async () => {
      const repo = document.getElementById('modal-ch-repo').value;
      const notes = document.getElementById('modal-ch-notes').value;
      const res = await fetch(`/api/challenges/${challengeId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: this.currentStudentId,
          repo_url: repo,
          notes: notes
        })
      });
      const data = await res.json();
      if (data.success) {
        this.showToast('Challenge solution submitted to review panel!', 'success');
        modal.classList.add('hidden');
        await this.refreshData();
      }
    };
  },

  // ==========================================
  // 2. ACADEMICIAN VIEW RENDERING & ACTIONS
  // ==========================================
  renderAcademicianView() {
    const activeTab = this.activeSubtabs.academician;
    const dept = this.platformData.department_analytics;

    // Academician profile headers
    document.getElementById('acad-name').textContent = this.platformData.academician.name;
    document.getElementById('acad-dept').textContent = this.platformData.academician.department;

    if (activeTab === 'home') {
      this.renderAcademicianHome();
    } else if (activeTab === 'students') {
      this.renderAcademicianStudents();
    } else if (activeTab === 'dept-analytics') {
      this.renderAcademicianDeptAnalytics();
    } else if (activeTab === 'interventions') {
      this.renderAcademicianInterventions();
    } else if (activeTab === 'placement-analytics') {
      this.renderAcademicianPlacementAnalytics();
    } else if (activeTab === 'industry-alignment') {
      this.renderAcademicianIndustryAlignment();
    }
  },

  renderAcademicianHome() {
    const dept = this.platformData.department_analytics;
    const rejections = this.platformData.rejection_analytics;

    document.getElementById('acad-kpi-total').textContent = dept.total_students;
    document.getElementById('acad-kpi-readiness').textContent = `${dept.average_readiness_index}%`;
    document.getElementById('acad-kpi-consent').textContent = `${dept.consent_rate_pct}%`;
    document.getElementById('acad-kpi-rejections').textContent = rejections.total_rejected_applications;

    // Dr. Sharma FDPs
    const fdpsContainer = document.getElementById('acad-fdps-list');
    fdpsContainer.innerHTML = '';
    this.platformData.academician.fdps_completed.forEach(f => {
      const li = document.createElement('div');
      li.className = 'p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs';
      li.innerHTML = `
        <div>
          <strong class="text-slate-800">${f.title}</strong>
          <div class="text-slate-500">${f.date}</div>
        </div>
        <span class="badge badge-primary">${f.credits} Credits</span>
      `;
      fdpsContainer.appendChild(li);
    });

    // Immediate Alert: Top deficit skills
    const alertList = document.getElementById('acad-critical-alerts');
    alertList.innerHTML = '';
    const gaps = dept.gaps_vs_industry;
    const deficits = Object.entries(gaps).filter(([_, gap]) => gap < -5).sort((a, b) => a[1] - b[1]);

    deficits.slice(0, 3).forEach(([sk, gap]) => {
      const alert = document.createElement('div');
      alert.className = 'p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg text-xs';
      alert.innerHTML = `
        <div class="font-bold text-amber-900">${sk} Deficit: ${gap} Points below Industry Demand</div>
        <div class="text-amber-700 mt-0.5">Students failing technical interviews at TechNova and FinTech in this area.</div>
      `;
      alertList.appendChild(alert);
    });
  },

  renderAcademicianStudents() {
    const tbody = document.getElementById('acad-students-table-body');
    tbody.innerHTML = '';

    const searchInput = document.getElementById('acad-student-search')?.value.toLowerCase() || '';
    const tierFilter = document.getElementById('acad-student-tier-filter')?.value || '';

    let filtered = this.allStudents.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchInput) || s.roll_no.toLowerCase().includes(searchInput);
      const matchesTier = !tierFilter || s.tier === tierFilter;
      return matchesSearch && matchesTier;
    });

    filtered.forEach(s => {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-slate-100 hover:bg-slate-50 transition-colors text-xs';
      tr.innerHTML = `
        <td class="p-3 font-semibold text-slate-800">${s.name}</td>
        <td class="p-3 text-slate-500">${s.roll_no}</td>
        <td class="p-3 font-semibold text-slate-700">${s.cgpa}</td>
        <td class="p-3"><span class="badge ${s.tier === 'Tier 1' ? 'badge-success' : s.tier === 'Tier 2' ? 'badge-primary' : 'badge-warning'}">${s.tier}</span></td>
        <td class="p-3">
          <div class="flex items-center gap-1.5">
            <span class="font-bold text-slate-800">${s.readiness_index}%</span>
            <div class="w-16 bg-slate-200 rounded-full h-1.5">
              <div class="h-1.5 rounded-full ${s.readiness_index >= 75 ? 'bg-emerald-500' : 'bg-blue-500'}" style="width: ${s.readiness_index}%"></div>
            </div>
          </div>
        </td>
        <td class="p-3">${s.verified_skills_count} / ${s.total_skills_count}</td>
        <td class="p-3">${s.consent_talent_pool ? '<span class="text-emerald-600 font-bold">Yes</span>' : '<span class="text-slate-400">No</span>'}</td>
        <td class="p-3 text-right">
          <button onclick="App.openStudentDrawer('${s.id}')" class="px-2.5 py-1 bg-indigo-50 text-indigo-600 font-semibold rounded hover:bg-indigo-100">
            Inspect Profile
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  renderAcademicianDeptAnalytics() {
    const dept = this.platformData.department_analytics;
    ChartManager.renderTierDistribution('acad-tier-chart', dept.tier_distribution);
    ChartManager.renderIndustryRadar('acad-dept-radar-chart', dept.skill_averages, dept.industry_benchmark);
    ChartManager.renderVerifiedSkills('acad-verified-skills-chart', dept.skill_verified_counts);
  },

  renderAcademicianInterventions() {
    const list = document.getElementById('acad-interventions-list');
    list.innerHTML = '';

    (this.platformData.interventions || []).forEach(intv => {
      const card = document.createElement('div');
      card.className = 'p-5 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow';
      card.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <span class="badge badge-primary text-xs font-semibold">${intv.type}</span>
              <span class="text-xs font-bold text-indigo-600">Target: ${intv.target_skill}</span>
              <span class="badge ${intv.status === 'In Progress' ? 'badge-success' : 'badge-warning'} text-xs">${intv.status}</span>
            </div>
            <h3 class="text-base font-bold text-slate-900 mt-1">${intv.title}</h3>
            <p class="text-xs text-slate-600 mt-1">${intv.description}</p>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-500 font-medium">Enrolled: <strong>${intv.enrolled_count} students</strong></span>
            <div class="text-xs text-slate-400 mt-1">${intv.schedule}</div>
          </div>
        </div>
        <div class="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <strong>Instructor:</strong> ${intv.instructor} • <strong>Cohort:</strong> ${intv.target_cohort}
        </div>
      `;
      list.appendChild(card);
    });
  },

  renderAcademicianPlacementAnalytics() {
    const dept = this.platformData.department_analytics;
    const rejections = this.platformData.rejection_analytics;

    ChartManager.renderPlacementOutcomes('acad-placement-chart', dept.placement_outcomes);
    ChartManager.renderRejectionReasons('acad-rejections-chart', rejections.reasons_breakdown);

    // List out top rejection reasons with action links
    const reasonsContainer = document.getElementById('acad-reasons-drilldown');
    reasonsContainer.innerHTML = '';
    rejections.reasons_breakdown.forEach(r => {
      const div = document.createElement('div');
      div.className = 'p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs';
      div.innerHTML = `
        <div>
          <span class="font-bold text-slate-800">${r.reason}</span>
          <span class="text-slate-500 ml-2">(${r.count} students rejected)</span>
        </div>
        <button onclick="App.openInterventionModalForReason('${r.reason}')" class="px-2.5 py-1 bg-indigo-50 text-indigo-600 font-semibold rounded hover:bg-indigo-100">
          + Launch Targeted Intervention
        </button>
      `;
      reasonsContainer.appendChild(div);
    });
  },

  renderAcademicianIndustryAlignment() {
    const dept = this.platformData.department_analytics;
    const tbody = document.getElementById('acad-alignment-tbody');
    tbody.innerHTML = '';

    Object.keys(dept.industry_benchmark).forEach(sk => {
      const avg = dept.skill_averages[sk] || 0;
      const bench = dept.industry_benchmark[sk];
      const gap = dept.gaps_vs_industry[sk];

      const tr = document.createElement('tr');
      tr.className = 'border-b border-slate-100 text-xs';
      tr.innerHTML = `
        <td class="p-3 font-semibold text-slate-800">${sk}</td>
        <td class="p-3 text-slate-600 font-medium">${avg}/100</td>
        <td class="p-3 text-slate-600 font-medium">${bench}/100</td>
        <td class="p-3 font-bold ${gap >= 0 ? 'text-emerald-600' : 'text-rose-600'}">
          ${gap >= 0 ? `+${gap}` : gap}
        </td>
        <td class="p-3">
          <span class="badge ${gap >= 0 ? 'badge-success' : gap > -5 ? 'badge-warning' : 'badge-danger'}">
            ${gap >= 0 ? 'Exceeds Demand' : gap > -5 ? 'Minor Gap' : 'Critical Deficit'}
          </span>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  openStudentDrawer(studentId) {
    const student = this.allStudents.find(s => s.id === studentId);
    if (!student) return;

    const drawer = document.getElementById('student-detail-drawer');
    drawer.classList.remove('hidden');

    document.getElementById('drawer-name').textContent = student.name;
    document.getElementById('drawer-meta').textContent = `${student.roll_no} • ${student.tier} • CGPA ${student.cgpa}`;
    document.getElementById('drawer-readiness').textContent = `${student.readiness_index}%`;

    const skillsContainer = document.getElementById('drawer-skills');
    skillsContainer.innerHTML = '';
    Object.entries(student.skills).forEach(([sk, info]) => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between text-xs py-1 border-b border-slate-100';
      row.innerHTML = `
        <span class="font-medium text-slate-700">${sk}</span>
        <div class="flex items-center gap-2">
          <span class="font-bold text-slate-900">${info.score}</span>
          <span class="badge ${info.verified ? 'badge-success' : 'badge-gray'} text-[10px]">
            ${info.verified ? 'Verified' : 'Unverified'}
          </span>
        </div>
      `;
      skillsContainer.appendChild(row);
    });

    const apps = (this.platformData.applications || []).filter(a => a.student_id === studentId);
    const appsContainer = document.getElementById('drawer-apps');
    appsContainer.innerHTML = '';
    if (apps.length === 0) {
      appsContainer.innerHTML = '<div class="text-xs text-slate-400 py-2">No applications submitted yet.</div>';
    } else {
      apps.forEach(a => {
        const item = document.createElement('div');
        item.className = 'p-2 bg-slate-50 rounded text-xs mt-1 border border-slate-200';
        item.innerHTML = `
          <div class="font-semibold text-slate-800">${a.company_name} - ${a.job_title}</div>
          <div class="flex items-center justify-between mt-1 text-slate-500">
            <span>Status: <strong class="${a.status === 'Accepted' ? 'text-emerald-600' : a.status === 'Rejected' ? 'text-rose-600' : 'text-blue-600'}">${a.status}</strong></span>
            <span>Match: ${a.match_pct}%</span>
          </div>
          ${a.feedback ? `<div class="mt-1 text-[11px] text-slate-600"><em>"${a.feedback}"</em></div>` : ''}
        `;
        appsContainer.appendChild(item);
      });
    }
  },

  openInterventionModalForReason(reason) {
    const modal = document.getElementById('intervention-modal');
    modal.classList.remove('hidden');

    let defaultSkill = 'System Design';
    if (reason.includes('DSA')) defaultSkill = 'DSA';
    if (reason.includes('React')) defaultSkill = 'React';

    document.getElementById('intv-skill').value = defaultSkill;
    document.getElementById('intv-title').value = `Intervention Clinic: Overcoming ${reason}`;
    document.getElementById('intv-cohort').value = 'Students rejected in company technical panels';
  },

  async submitIntervention() {
    const title = document.getElementById('intv-title').value;
    const targetSkill = document.getElementById('intv-skill').value;
    const typeName = document.getElementById('intv-type').value;
    const instructor = document.getElementById('intv-instructor').value;
    const cohort = document.getElementById('intv-cohort').value;
    const schedule = document.getElementById('intv-schedule').value;
    const desc = document.getElementById('intv-desc').value;

    const res = await fetch('/api/interventions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        target_skill: targetSkill,
        type_name: typeName,
        instructor,
        target_cohort: cohort,
        schedule,
        description: desc
      })
    });
    const data = await res.json();
    if (data.success) {
      this.showToast('Improvement measure launched and added to student roadmaps!', 'success');
      document.getElementById('intervention-modal').classList.add('hidden');
      await this.refreshData();
    }
  },

  // ==========================================
  // 3. INSTITUTION VIEW RENDERING & ACTIONS
  // ==========================================
  renderInstitutionView() {
    const activeTab = this.activeSubtabs.institution;
    const dept = this.platformData.department_analytics;
    const trackers = this.platformData.commitment_tracker;

    // Header metrics
    document.getElementById('inst-name').textContent = this.platformData.institution.name;
    document.getElementById('inst-code').textContent = `${this.platformData.institution.department} • ${this.platformData.institution.naac_grade}`;

    if (activeTab === 'dashboard') {
      this.renderInstitutionDashboard();
    } else if (activeTab === 'skill-gaps') {
      this.renderInstitutionSkillGaps();
    } else if (activeTab === 'rejections') {
      this.renderInstitutionRejections();
    } else if (activeTab === 'commitment-tracker') {
      this.renderInstitutionCommitmentTracker();
    } else if (activeTab === 'talent-pool') {
      this.renderInstitutionTalentPool();
    }
  },

  renderInstitutionDashboard() {
    const dept = this.platformData.department_analytics;
    const rejections = this.platformData.rejection_analytics;

    document.getElementById('inst-kpi-readiness').textContent = `${dept.average_readiness_index}%`;
    document.getElementById('inst-kpi-placement').textContent = `${dept.placement_outcomes.accepted_offers} Offers`;
    document.getElementById('inst-kpi-partners').textContent = `${this.platformData.companies.length} Corporates`;
    document.getElementById('inst-kpi-consent').textContent = `${dept.consent_rate_pct}%`;

    // Render summary charts
    ChartManager.renderTierDistribution('inst-tier-chart', dept.tier_distribution);
    ChartManager.renderPlacementOutcomes('inst-outcomes-chart', dept.placement_outcomes);
  },

  renderInstitutionSkillGaps() {
    const dept = this.platformData.department_analytics;
    ChartManager.renderSkillDeficits('inst-skill-gaps-chart', dept.gaps_vs_industry);
  },

  renderInstitutionRejections() {
    const rejections = this.platformData.rejection_analytics;
    ChartManager.renderRejectionReasons('inst-rejection-chart', rejections.reasons_breakdown);
  },

  renderInstitutionCommitmentTracker() {
    const trackers = this.platformData.commitment_tracker || [];
    const tbody = document.getElementById('inst-commitment-tbody');
    tbody.innerHTML = '';

    trackers.forEach(t => {
      const tr = document.createElement('tr');
      tr.className = `border-b border-slate-100 text-xs ${t.is_primary ? 'bg-indigo-50/40 font-semibold' : ''}`;
      tr.innerHTML = `
        <td class="p-3.5">
          <div class="font-bold text-slate-900">${t.company_name}</div>
          <div class="text-[11px] text-slate-500">${t.target_role}</div>
        </td>
        <td class="p-3.5 text-center font-bold text-slate-800">${t.target_hires}</td>
        <td class="p-3.5 text-center">
          <span class="badge badge-primary">${t.eligible_students_count} matched</span>
        </td>
        <td class="p-3.5 text-center font-medium text-slate-700">${t.shortlisted_count}</td>
        <td class="p-3.5 text-center font-bold text-emerald-600">${t.offers_extended}</td>
        <td class="p-3.5">
          <div class="flex items-center gap-2">
            <div class="flex-1 bg-slate-200 rounded-full h-2">
              <div class="h-2 rounded-full ${t.progress_pct >= 60 ? 'bg-emerald-500' : 'bg-indigo-600'}" style="width: ${t.progress_pct}%"></div>
            </div>
            <span class="text-xs font-bold text-slate-700">${t.progress_pct}%</span>
          </div>
        </td>
        <td class="p-3.5 text-right">
          <span class="badge ${t.status === 'On Track' ? 'badge-success' : 'badge-warning'}">${t.status}</span>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  renderInstitutionTalentPool() {
    const tbody = document.getElementById('inst-talent-tbody');
    tbody.innerHTML = '';

    const filterRole = document.getElementById('inst-talent-role-filter')?.value || '';
    const consentedOnly = document.getElementById('inst-talent-consent-filter')?.checked ?? true;

    let filtered = this.allStudents.filter(s => {
      const matchRole = !filterRole || s.target_roles.some(r => r.includes(filterRole));
      const matchConsent = !consentedOnly || s.consent_talent_pool;
      return matchRole && matchConsent;
    });

    filtered.slice(0, 30).forEach(s => {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-slate-100 text-xs hover:bg-slate-50';
      tr.innerHTML = `
        <td class="p-3 font-bold text-slate-800">${s.name}</td>
        <td class="p-3 text-slate-500">${s.roll_no}</td>
        <td class="p-3">${s.target_roles[0]}</td>
        <td class="p-3 font-semibold text-slate-700">${s.cgpa}</td>
        <td class="p-3 font-bold text-indigo-600">${s.readiness_index}%</td>
        <td class="p-3">${s.verified_skills_count} verified</td>
        <td class="p-3">
          <span class="badge ${s.consent_talent_pool ? 'badge-success' : 'badge-gray'}">
            ${s.consent_talent_pool ? 'Consented' : 'Opted Out'}
          </span>
        </td>
        <td class="p-3 text-right">
          <button onclick="App.openStudentDrawer('${s.id}')" class="text-xs text-indigo-600 font-semibold hover:underline">
            View Details
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  // ==========================================
  // 4. INDUSTRY VIEW RENDERING & ACTIONS
  // ==========================================
  renderIndustryView() {
    const activeTab = this.activeSubtabs.industry;
    const company = this.platformData.companies.find(c => c.is_primary) || this.platformData.companies[0];

    document.getElementById('ind-company-name').textContent = company.name;
    document.getElementById('ind-company-target').textContent = `Target: ${company.commitment_target} ${company.commitment_role}s`;

    if (activeTab === 'dashboard') {
      this.renderIndustryDashboard();
    } else if (activeTab === 'jobs') {
      this.renderIndustryJobs();
    } else if (activeTab === 'talent-pool') {
      this.renderIndustryTalentPool();
    } else if (activeTab === 'challenges') {
      this.renderIndustryChallenges();
    } else if (activeTab === 'applications') {
      this.renderIndustryApplications();
    }
  },

  renderIndustryDashboard() {
    const comp = this.platformData.companies.find(c => c.is_primary) || this.platformData.companies[0];
    const trackers = this.platformData.commitment_tracker || [];
    const tracker = trackers.find(t => t.company_id === comp.id) || trackers[0];

    document.getElementById('ind-kpi-target').textContent = tracker.target_hires;
    document.getElementById('ind-kpi-eligible').textContent = tracker.eligible_students_count;
    document.getElementById('ind-kpi-shortlisted').textContent = tracker.shortlisted_count;
    document.getElementById('ind-kpi-offers').textContent = tracker.offers_extended;
    document.getElementById('ind-kpi-progress').textContent = `${tracker.progress_pct}%`;

    // Render applications for TechNova
    const apps = (this.platformData.applications || []).filter(a => a.company_id === comp.id);
    const recentAppsContainer = document.getElementById('ind-recent-apps-preview');
    recentAppsContainer.innerHTML = '';
    apps.slice(0, 5).forEach(a => {
      const item = document.createElement('div');
      item.className = 'p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs';
      item.innerHTML = `
        <div>
          <div class="font-bold text-slate-900">${a.student_name} (${a.student_roll})</div>
          <div class="text-slate-500">${a.job_title} • Match: <strong class="text-indigo-600">${a.match_pct}%</strong></div>
        </div>
        <span class="badge ${a.status === 'Accepted' ? 'badge-success' : a.status === 'Rejected' ? 'badge-danger' : a.status === 'Shortlisted' ? 'badge-primary' : 'badge-gray'} font-bold">
          ${a.status}
        </span>
      `;
      recentAppsContainer.appendChild(item);
    });
  },

  renderIndustryJobs() {
    const comp = this.platformData.companies.find(c => c.is_primary) || this.platformData.companies[0];
    const jobs = (this.platformData.jobs || []).filter(j => j.company_id === comp.id);
    const container = document.getElementById('ind-jobs-list');
    container.innerHTML = '';

    jobs.forEach(j => {
      const card = document.createElement('div');
      card.className = 'p-5 bg-white border border-slate-200 rounded-xl';
      
      const skillsHtml = Object.entries(j.required_skills).map(([sk, min]) => `
        <span class="badge badge-primary text-xs">${sk} &ge; ${min}%</span>
      `).join(' ');

      card.innerHTML = `
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-900">${j.title}</h3>
            <p class="text-xs text-slate-500 mt-0.5">${j.role_category} • ${j.location} • ${j.stipend_ctc}</p>
          </div>
          <span class="badge badge-success">${j.openings} Openings</span>
        </div>
        <div class="mt-3">
          <div class="text-xs font-semibold text-slate-700">Required Skills & Minimum Score Cutoffs:</div>
          <div class="flex flex-wrap gap-1.5 mt-1">${skillsHtml}</div>
        </div>
        <div class="mt-3 text-xs text-slate-600">${j.description}</div>
      `;
      container.appendChild(card);
    });
  },

  renderIndustryTalentPool() {
    const comp = this.platformData.companies.find(c => c.is_primary) || this.platformData.companies[0];
    const primaryJob = (this.platformData.jobs || []).find(j => j.company_id === comp.id);

    const tbody = document.getElementById('ind-talent-tbody');
    tbody.innerHTML = '';

    // Show only consented students
    const consentedStudents = this.allStudents.filter(s => s.consent_talent_pool);

    consentedStudents.slice(0, 25).forEach(s => {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-slate-100 text-xs hover:bg-slate-50';
      tr.innerHTML = `
        <td class="p-3 font-bold text-slate-800">${s.name}</td>
        <td class="p-3 text-slate-500">${s.roll_no}</td>
        <td class="p-3 font-semibold text-slate-700">${s.tier}</td>
        <td class="p-3 font-bold text-indigo-600">${s.readiness_index}%</td>
        <td class="p-3">${s.skills['React']?.score || 0}% ${s.skills['React']?.verified ? '✓' : ''}</td>
        <td class="p-3">${s.skills['DSA']?.score || 0}% ${s.skills['DSA']?.verified ? '✓' : ''}</td>
        <td class="p-3">${s.skills['System Design']?.score || 0}% ${s.skills['System Design']?.verified ? '✓' : ''}</td>
        <td class="p-3 text-right">
          <button onclick="App.openStudentDrawer('${s.id}')" class="px-2.5 py-1 bg-indigo-50 text-indigo-600 font-semibold rounded hover:bg-indigo-100">
            View Assessment
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  renderIndustryChallenges() {
    const comp = this.platformData.companies.find(c => c.is_primary) || this.platformData.companies[0];
    const challenges = (this.platformData.challenges || []).filter(ch => ch.company_id === comp.id);
    const container = document.getElementById('ind-challenges-list');
    container.innerHTML = '';

    challenges.forEach(ch => {
      const card = document.createElement('div');
      card.className = 'p-5 bg-white border border-slate-200 rounded-xl';
      card.innerHTML = `
        <div class="flex items-start justify-between">
          <div>
            <span class="badge badge-primary text-xs">${ch.category}</span>
            <h3 class="text-base font-bold text-slate-900 mt-1">${ch.title}</h3>
            <p class="text-xs text-slate-600 mt-1">${ch.description}</p>
          </div>
          <span class="badge badge-warning text-xs">${ch.difficulty}</span>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span class="text-emerald-600 font-bold">${ch.reward}</span>
          <span class="text-slate-500 font-semibold">${ch.submissions_count} student submissions</span>
        </div>
      `;
      container.appendChild(card);
    });
  },

  renderIndustryApplications() {
    const comp = this.platformData.companies.find(c => c.is_primary) || this.platformData.companies[0];
    const apps = (this.platformData.applications || []).filter(a => a.company_id === comp.id);
    const tbody = document.getElementById('ind-applications-tbody');
    tbody.innerHTML = '';

    apps.forEach(app => {
      const tr = document.createElement('tr');
      tr.className = `border-b border-slate-100 text-xs ${app.status === 'Rejected' ? 'bg-rose-50/30' : ''}`;
      
      let statusBadge = `<span class="badge badge-gray">${app.status}</span>`;
      if (app.status === 'Accepted') statusBadge = `<span class="badge badge-success font-bold">Accepted</span>`;
      if (app.status === 'Shortlisted') statusBadge = `<span class="badge badge-primary font-bold">Shortlisted</span>`;
      if (app.status === 'Rejected') statusBadge = `<span class="badge badge-danger font-bold">Rejected</span>`;

      tr.innerHTML = `
        <td class="p-3">
          <div class="font-bold text-slate-900">${app.student_name}</div>
          <div class="text-[11px] text-slate-500">${app.student_roll} • ${app.student_tier}</div>
        </td>
        <td class="p-3 text-slate-700">${app.job_title}</td>
        <td class="p-3 text-center">
          <span class="font-bold ${app.match_pct >= 75 ? 'text-emerald-600' : 'text-amber-600'}">${app.match_pct}%</span>
        </td>
        <td class="p-3 text-center">${statusBadge}</td>
        <td class="p-3 max-w-xs truncate text-slate-500">${app.feedback || '-'}</td>
        <td class="p-3 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button onclick="App.openDecisionModal('${app.id}', '${app.student_name}', 'Shortlisted')" class="px-2 py-1 bg-blue-50 text-blue-700 font-semibold rounded hover:bg-blue-100">
              Shortlist
            </button>
            <button onclick="App.openDecisionModal('${app.id}', '${app.student_name}', 'Accepted')" class="px-2 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded hover:bg-emerald-100">
              Accept
            </button>
            <button onclick="App.openDecisionModal('${app.id}', '${app.student_name}', 'Rejected')" class="px-2 py-1 bg-rose-50 text-rose-700 font-semibold rounded hover:bg-rose-100">
              Reject
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  openDecisionModal(appId, studentName, status) {
    const modal = document.getElementById('decision-modal');
    modal.classList.remove('hidden');

    document.getElementById('decision-student-name').textContent = studentName;
    document.getElementById('decision-status-title').textContent = status;

    const rejectionSection = document.getElementById('decision-rejection-section');
    if (status === 'Rejected') {
      rejectionSection.classList.remove('hidden');
    } else {
      rejectionSection.classList.add('hidden');
    }

    const defaultFeedbacks = {
      Accepted: "Exceptional mastery of core competencies and verified portfolio. Welcome to TechNova!",
      Shortlisted: "Strong foundation demonstrated. Moving forward to technical panel review.",
      Rejected: "Candidate demonstrated good frontend basics, but struggled on distributed caching and System Design scale tradeoffs."
    };
    document.getElementById('decision-feedback').value = defaultFeedbacks[status] || '';

    // Handle Confirm
    document.getElementById('decision-confirm-btn').onclick = async () => {
      let selectedReasons = [];
      if (status === 'Rejected') {
        document.querySelectorAll('input[name="rejection-reason"]:checked').forEach(cb => {
          selectedReasons.push(cb.value);
        });
      }
      const feedback = document.getElementById('decision-feedback').value;

      const res = await fetch(`/api/applications/${appId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: status,
          rejection_reasons: selectedReasons,
          feedback: feedback
        })
      });
      const data = await res.json();
      if (data.success) {
        this.showToast(
          status === 'Rejected' 
            ? `Decision saved: Rejection reasons and feedback propagated to student roadmap and institutional analytics!`
            : `Candidate marked as ${status}!`,
          status === 'Rejected' ? 'warning' : 'success'
        );
        modal.classList.add('hidden');
        await this.refreshData();
      }
    };
  }
};

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
