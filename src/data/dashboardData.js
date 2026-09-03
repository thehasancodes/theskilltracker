const dashboard = {
  user: { name: 'MEHEDI HASAN', role: 'Student' },
  tracks: [
    {
      id: 'dsa-practice',
      label: 'DSA PRACTICE',
      title: 'LeetCode 300',
      description: 'Master fundamental data structures & algorithms through 300 curated industry-standard challenges.',
      solved: 0,
      total: 300,
      tone: 'purple',
    },
    {
      id: 'curriculum-core',
      label: 'CURRICULUM CORE',
      title: 'Lab Assignments',
      description: 'Internal assessments, MCQs, and programming labs for your current semester coursework.',
      solved: 2,
      total: 2,
      tone: 'teal',
    },
  ],
};

export function fetchDashboard() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(dashboard), 450);
  });
}
