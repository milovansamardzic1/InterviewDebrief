import type {
  ApplicationListItem,
  DashboardStats,
  LearningPlanItem,
  LearningTask,
  RejectionInsightsResponse,
} from "@interwjuer/contracts";

export type DashboardDemoId = "onboarding" | "getting-started" | "analytics";
export type LearningDemoId = "empty" | "recommendations" | "tasks" | "filled";

export const EMPTY_DASHBOARD_STATS: DashboardStats = {
  jobApplications: 0,
  interviewRounds: 0,
  questions: 0,
  skillEvaluations: 0,
  skills: 0,
  weakSkills: [],
  questionsByTopic: [],
  statusBreakdown: [],
  progressOverTime: [],
  activeApplications: [],
  upcomingRound: null,
};

export const GETTING_STARTED_DASHBOARD_STATS: DashboardStats = {
  jobApplications: 1,
  interviewRounds: 1,
  questions: 3,
  skillEvaluations: 1,
  skills: 1,
  weakSkills: [
    {
      skillId: "preview-skill-1",
      skillName: "System Design",
      skillCategory: "Architecture",
      averageScore: 2.0,
      evaluationCount: 1,
    },
  ],
  questionsByTopic: [
    { topic: "Algorithms", count: 2 },
    { topic: "Behavioral", count: 1 },
  ],
  statusBreakdown: [{ status: "INTERVIEWING", count: 1 }],
  progressOverTime: [],
  activeApplications: [
    {
      id: "preview-app-1",
      company: "Acme Corp",
      position: "Software Engineer",
      applicationStatus: "INTERVIEWING",
    },
  ],
  upcomingRound: {
    id: "preview-round-1",
    roundType: "Technical",
    scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    company: "Acme Corp",
    position: "Software Engineer",
    applicationId: "preview-app-1",
  },
};

export const GETTING_STARTED_LEARNING_PLAN: LearningPlanItem[] = [
  {
    skillId: "preview-skill-1",
    skillName: "System Design",
    skillCategory: "Architecture",
    averageScore: 2,
    evaluationCount: 1,
    lastEvaluatedAt: new Date().toISOString(),
    focusHint: "Vežbaj CAP theorem i trade-offe skaliranja.",
    relatedQuestions: [],
  },
];

export const ANALYTICS_DASHBOARD_STATS: DashboardStats = {
  jobApplications: 4,
  interviewRounds: 6,
  questions: 14,
  skillEvaluations: 5,
  skills: 4,
  weakSkills: [
    {
      skillId: "preview-skill-1",
      skillName: "System Design",
      skillCategory: "Architecture",
      averageScore: 2.2,
      evaluationCount: 3,
    },
    {
      skillId: "preview-skill-2",
      skillName: "Concurrency",
      skillCategory: "Backend",
      averageScore: 2.8,
      evaluationCount: 2,
    },
  ],
  questionsByTopic: [
    { topic: "Algorithms", count: 5 },
    { topic: "System Design", count: 4 },
    { topic: "Behavioral", count: 3 },
    { topic: "SQL", count: 2 },
  ],
  statusBreakdown: [
    { status: "APPLIED", count: 1 },
    { status: "INTERVIEWING", count: 2 },
    { status: "REJECTED", count: 1 },
  ],
  progressOverTime: [],
  activeApplications: [
    {
      id: "preview-app-1",
      company: "Acme Corp",
      position: "Software Engineer",
      applicationStatus: "INTERVIEWING",
    },
    {
      id: "preview-app-2",
      company: "Globex",
      position: "Backend Engineer",
      applicationStatus: "SCREENING",
    },
  ],
  upcomingRound: {
    id: "preview-round-1",
    roundType: "Technical",
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    company: "Acme Corp",
    position: "Software Engineer",
    applicationId: "preview-app-1",
  },
};

export const ANALYTICS_LEARNING_PLAN: LearningPlanItem[] = [
  {
    skillId: "preview-skill-1",
    skillName: "System Design",
    skillCategory: "Architecture",
    averageScore: 2.2,
    evaluationCount: 3,
    lastEvaluatedAt: new Date().toISOString(),
    focusHint: "Vežbaj CAP theorem i trade-offe skaliranja.",
    relatedQuestions: [
      {
        id: "preview-q-1",
        questionText: "How would you design a URL shortener?",
        topic: "System Design",
        applicationId: "preview-app-1",
        roundId: "preview-round-1",
        company: "Acme Corp",
      },
    ],
  },
  {
    skillId: "preview-skill-2",
    skillName: "Concurrency",
    skillCategory: "Backend",
    averageScore: 2.8,
    evaluationCount: 2,
    lastEvaluatedAt: new Date().toISOString(),
    focusHint: "Ponovi locks, races i async pattern-e.",
    relatedQuestions: [],
  },
  {
    skillId: "preview-skill-3",
    skillName: "SQL",
    skillCategory: "Data",
    averageScore: 3,
    evaluationCount: 2,
    lastEvaluatedAt: new Date().toISOString(),
    focusHint: "Indeksi i query plan objašnjenja.",
    relatedQuestions: [],
  },
];

export const ANALYTICS_LEARNING_TASKS: LearningTask[] = [
  {
    id: "preview-task-1",
    skillId: "preview-skill-1",
    skillName: "System Design",
    skillCategory: "Architecture",
    title: "Vežbaj dizajn URL shortener-a",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Fokus na izbor baze, cache i skaliranje.",
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "preview-task-2",
    skillId: "preview-skill-2",
    skillName: "Concurrency",
    skillCategory: "Backend",
    title: "Ponovi race conditions i locking",
    status: "PLANNED",
    priority: "MEDIUM",
    dueDate: null,
    notes: null,
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "preview-task-3",
    skillId: "preview-skill-3",
    skillName: "SQL",
    skillCategory: "Data",
    title: "Analiziraj tri query plana",
    status: "COMPLETED",
    priority: "LOW",
    dueDate: null,
    notes: null,
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const EMPTY_REJECTION_INSIGHTS: RejectionInsightsResponse = {
  rejectedCount: 0,
  categorizedCount: 0,
  categoryBreakdown: [],
  recentRejections: [],
  generatedAt: new Date().toISOString(),
};

export const FILLED_REJECTION_INSIGHTS: RejectionInsightsResponse = {
  rejectedCount: 5,
  categorizedCount: 4,
  categoryBreakdown: [
    { category: "SYSTEM_DESIGN", count: 2 },
    { category: "TECHNICAL_SKILLS", count: 1 },
    { category: "COMMUNICATION", count: 1 },
    { category: null, count: 1 },
  ],
  recentRejections: [
    {
      applicationId: "preview-app-3",
      company: "Initech",
      position: "Full-stack Developer",
      category: "SYSTEM_DESIGN",
      reason: "Nisu bili jasni trade-offi skaliranja i keširanja.",
      applicationDate: new Date("2026-07-18").toISOString(),
    },
    {
      applicationId: "preview-app-4",
      company: "Umbrella",
      position: "Backend Engineer",
      category: "TECHNICAL_SKILLS",
      reason: "Nedovoljno iskustva sa distributed systems.",
      applicationDate: new Date("2026-06-25").toISOString(),
    },
  ],
  generatedAt: new Date().toISOString(),
};

export const DEMO_APPLICATIONS_FILLED: ApplicationListItem[] = [
  {
    id: "preview-app-1",
    company: "Acme Corp",
    position: "Software Engineer",
    location: "Remote",
    applicationStatus: "INTERVIEWING",
    applicationDate: new Date("2026-07-01"),
    salaryMin: 60000,
    salaryMax: 80000,
    sourceName: "LinkedIn",
    roundCount: 2,
    totalQuestions: 5,
    rounds: [
      {
        id: "preview-round-1",
        sortOrder: 1,
        status: "COMPLETED",
        scheduledAt: new Date("2026-07-10"),
        interviewTypeName: "HR",
        questionCount: 2,
      },
      {
        id: "preview-round-2",
        sortOrder: 2,
        status: "SCHEDULED",
        scheduledAt: new Date("2026-08-08"),
        interviewTypeName: "Technical",
        questionCount: 3,
      },
    ],
  },
  {
    id: "preview-app-2",
    company: "Globex",
    position: "Backend Engineer",
    location: "Beograd",
    applicationStatus: "SCREENING",
    applicationDate: new Date("2026-07-15"),
    salaryMin: null,
    salaryMax: null,
    sourceName: "Referral",
    roundCount: 1,
    totalQuestions: 0,
    rounds: [
      {
        id: "preview-round-3",
        sortOrder: 1,
        status: "SCHEDULED",
        scheduledAt: new Date("2026-08-12"),
        interviewTypeName: "Phone screen",
        questionCount: 0,
      },
    ],
  },
  {
    id: "preview-app-3",
    company: "Initech",
    position: "Full-stack Developer",
    location: "Novi Sad",
    applicationStatus: "REJECTED",
    applicationDate: new Date("2026-06-01"),
    salaryMin: 50000,
    salaryMax: 65000,
    sourceName: "Company site",
    roundCount: 2,
    totalQuestions: 8,
    rounds: [
      {
        id: "preview-round-4",
        sortOrder: 1,
        status: "COMPLETED",
        scheduledAt: new Date("2026-06-10"),
        interviewTypeName: "Technical",
        questionCount: 5,
      },
      {
        id: "preview-round-5",
        sortOrder: 2,
        status: "COMPLETED",
        scheduledAt: new Date("2026-06-20"),
        interviewTypeName: "System Design",
        questionCount: 3,
      },
    ],
  },
];

export type DemoPage = {
  href: string;
  title: string;
  description: string;
  group: "Dashboard" | "Prijave" | "Učenje" | "Uvidi";
};

export const DEMO_PAGES: DemoPage[] = [
  {
    group: "Dashboard",
    href: "/preview/dashboard/onboarding",
    title: "Onboarding",
    description: "Novi nalog — 0 prijava, CTA za prvu prijavu.",
  },
  {
    group: "Dashboard",
    href: "/preview/dashboard/getting-started",
    title: "Getting started",
    description: "Jedna prijava — checklist i progress do analitike.",
  },
  {
    group: "Dashboard",
    href: "/preview/dashboard/analytics",
    title: "Analytics",
    description: "Pun dashboard — status, teme, slabosti, plan.",
  },
  {
    group: "Prijave",
    href: "/preview/applications/empty",
    title: "Prazna lista",
    description: "Empty state kada nema nijedne prijave.",
  },
  {
    group: "Prijave",
    href: "/preview/applications/filled",
    title: "Popunjena lista",
    description: "Kartice prijava sa rundama i statusima.",
  },
  {
    group: "Učenje",
    href: "/preview/learning/empty",
    title: "Učenje · Prazno",
    description: "Nema zadataka ni preporučenih fokusa.",
  },
  {
    group: "Učenje",
    href: "/preview/learning/recommendations",
    title: "Učenje · Samo preporuke",
    description: "Slabe oblasti postoje, ali zadaci još nisu napravljeni.",
  },
  {
    group: "Učenje",
    href: "/preview/learning/tasks",
    title: "Učenje · Samo zadaci",
    description: "Zadaci postoje, ali trenutno nema preporučenih fokusa.",
  },
  {
    group: "Učenje",
    href: "/preview/learning/filled",
    title: "Učenje · Popunjeno",
    description: "Aktivni i završeni zadaci uz preporučene fokuse.",
  },
  {
    group: "Uvidi",
    href: "/preview/insights/rejections/empty",
    title: "Uvidi bez odbijanja",
    description: "Empty state kada nema odbijenih prijava.",
  },
  {
    group: "Uvidi",
    href: "/preview/insights/rejections/filled",
    title: "Rejection insights",
    description: "Kategorije i poslednji razlozi odbijanja.",
  },
];

export function getDashboardDemo(mode: DashboardDemoId): {
  stats: DashboardStats;
  learningPlanItems: LearningPlanItem[];
  learningTasks: LearningTask[];
  title: string;
  description: string;
} {
  if (mode === "onboarding") {
    return {
      stats: EMPTY_DASHBOARD_STATS,
      learningPlanItems: [],
      learningTasks: [],
      title: "Dashboard · Onboarding",
      description: "Testni podaci: 0 prijava.",
    };
  }

  if (mode === "getting-started") {
    return {
      stats: GETTING_STARTED_DASHBOARD_STATS,
      learningPlanItems: GETTING_STARTED_LEARNING_PLAN,
      learningTasks: [],
      title: "Dashboard · Getting started",
      description: "Testni podaci: 1 prijava, malo pitanja/evaluacija.",
    };
  }

  return {
    stats: ANALYTICS_DASHBOARD_STATS,
    learningPlanItems: ANALYTICS_LEARNING_PLAN,
    learningTasks: ANALYTICS_LEARNING_TASKS,
    title: "Dashboard · Analytics",
    description: "Testni podaci: dovoljno signala za punu analitiku.",
  };
}

export function getLearningDemo(mode: LearningDemoId): {
  planItems: LearningPlanItem[];
  tasks: LearningTask[];
  title: string;
  description: string;
} {
  if (mode === "empty") {
    return {
      planItems: [],
      tasks: [],
      title: "Učenje · Prazno",
      description: "Testni podaci: nema zadataka ni preporučenih fokusa.",
    };
  }

  if (mode === "recommendations") {
    return {
      planItems: ANALYTICS_LEARNING_PLAN,
      tasks: [],
      title: "Učenje · Samo preporuke",
      description: "Testni podaci: preporuke postoje, zadaci još nisu dodati.",
    };
  }

  if (mode === "tasks") {
    return {
      planItems: [],
      tasks: ANALYTICS_LEARNING_TASKS,
      title: "Učenje · Samo zadaci",
      description: "Testni podaci: zadaci postoje, nema slabih oblasti.",
    };
  }

  return {
    planItems: ANALYTICS_LEARNING_PLAN,
    tasks: ANALYTICS_LEARNING_TASKS,
    title: "Učenje · Popunjeno",
    description: "Testni podaci: zadaci i preporučeni fokusi su popunjeni.",
  };
}
