/**
 * Chart.js Visualization Helpers for Skill Intelligence Platform
 */

const ChartManager = {
  instances: {},

  destroy(id) {
    if (this.instances[id]) {
      this.instances[id].destroy();
      delete this.instances[id];
    }
  },

  // 1. Department Readiness Tier Distribution (Doughnut)
  renderTierDistribution(canvasId, tierData) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(tierData),
        datasets: [{
          data: Object.values(tierData),
          backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { family: 'Inter', size: 12 }, padding: 16 }
          }
        },
        cutout: '70%'
      }
    });
  },

  // 2. Department Skills vs Industry Benchmark (Radar)
  renderIndustryRadar(canvasId, deptAverages, industryBenchmark) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const labels = Object.keys(industryBenchmark);
    const deptScores = labels.map(k => deptAverages[k] || 0);
    const benchScores = labels.map(k => industryBenchmark[k] || 0);

    this.instances[canvasId] = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'CS Dept Average Score',
            data: deptScores,
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            borderColor: '#4f46e5',
            pointBackgroundColor: '#4f46e5',
            borderWidth: 2
          },
          {
            label: 'Industry Hiring Benchmark',
            data: benchScores,
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            borderColor: '#ef4444',
            pointBackgroundColor: '#ef4444',
            borderWidth: 2,
            borderDash: [4, 4]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 30,
            max: 100,
            ticks: { stepSize: 15, font: { size: 10 } },
            pointLabels: { font: { family: 'Inter', size: 11, weight: '500' } }
          }
        },
        plugins: {
          legend: { position: 'bottom', labels: { font: { family: 'Inter', size: 12 } } }
        }
      }
    });
  },

  // 3. Rejection Reasons Breakdown (Horizontal Bar)
  renderRejectionReasons(canvasId, breakdown) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // Top reasons
    const topReasons = breakdown.slice(0, 6);
    const labels = topReasons.map(r => r.reason);
    const counts = topReasons.map(r => r.count);

    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Rejections Recorded',
          data: counts,
          backgroundColor: '#ef4444',
          borderRadius: 6,
          maxBarThickness: 24
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            ticks: { precision: 0, font: { family: 'Inter' } },
            grid: { color: '#f1f5f9' }
          },
          y: {
            ticks: { font: { family: 'Inter', size: 11 } },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.parsed.x} students rejected due to this gap`
            }
          }
        }
      }
    });
  },

  // 4. Verified Skills Count across 100 students
  renderVerifiedSkills(canvasId, verifiedCounts) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const skills = Object.keys(verifiedCounts);
    const counts = Object.values(verifiedCounts);

    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: skills,
        datasets: [{
          label: 'Verified Students',
          data: counts,
          backgroundColor: '#10b981',
          borderRadius: 6,
          maxBarThickness: 20
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { font: { family: 'Inter' } },
            grid: { color: '#f1f5f9' }
          },
          x: {
            ticks: { font: { family: 'Inter', size: 10 } },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  },

  // 5. Institution Placement Outcomes (Doughnut)
  renderPlacementOutcomes(canvasId, outcomes) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Offers Accepted', 'Shortlisted', 'Rejected', 'Under Review'],
        datasets: [{
          data: [
            outcomes.accepted_offers || 0,
            outcomes.shortlisted || 0,
            outcomes.rejected || 0,
            outcomes.pending || 0
          ],
          backgroundColor: ['#10b981', '#3b82f6', '#ef4444', '#94a3b8'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { family: 'Inter', size: 12 }, padding: 12 } }
        },
        cutout: '65%'
      }
    });
  },

  // 6. Skill Deficit Divergence (Surplus vs Deficit against industry benchmark)
  renderSkillDeficits(canvasId, gaps) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const skills = Object.keys(gaps);
    const values = Object.values(gaps);
    const colors = values.map(v => v >= 0 ? '#10b981' : '#ef4444');

    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: skills,
        datasets: [{
          label: 'Gap vs Benchmark (Points)',
          data: values,
          backgroundColor: colors,
          borderRadius: 4,
          maxBarThickness: 18
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            ticks: { font: { family: 'Inter' } },
            grid: { color: '#f1f5f9' }
          },
          x: {
            ticks: { font: { family: 'Inter', size: 10 } },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  },

  // 7. Student Individual Skill Radar
  renderStudentRadar(canvasId, studentSkills, targetRole = 'Full Stack') {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const skills = Object.keys(studentSkills);
    const studentScores = skills.map(k => studentSkills[k].score);
    const targetIdeal = [85, 80, 65, 80, 85, 80, 75, 85, 75, 75, 70, 70, 75];

    this.instances[canvasId] = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: skills,
        datasets: [
          {
            label: 'Your Assessed Score',
            data: studentScores,
            backgroundColor: 'rgba(79, 70, 229, 0.25)',
            borderColor: '#4f46e5',
            pointBackgroundColor: '#4f46e5',
            borderWidth: 2
          },
          {
            label: `Target Role Profile (${targetRole})`,
            data: targetIdeal,
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: '#10b981',
            pointBackgroundColor: '#10b981',
            borderDash: [3, 3],
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 20,
            max: 100,
            ticks: { stepSize: 20, font: { size: 9 } },
            pointLabels: { font: { family: 'Inter', size: 10, weight: '500' } }
          }
        },
        plugins: {
          legend: { position: 'bottom', labels: { font: { family: 'Inter', size: 11 } } }
        }
      }
    });
  }
};
