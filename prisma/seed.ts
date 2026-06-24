import {
  ApplicationStatus,
  InterviewRoundStatus,
  PrismaClient,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const DEMO_PASSWORD = "demo123456";

type RoundSeed = {
  sortOrder: number;
  typeName: string;
  status: InterviewRoundStatus;
  scheduledAt: string;
  completedAt?: string;
  questions?: Array<{
    question: string;
    topic: string;
    difficulty: number;
  }>;
};

type ApplicationSeed = {
  company: string;
  position: string;
  sourceName: string;
  applicationDate: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  status: ApplicationStatus;
  rejectionReason?: string;
  notes?: string;
  rounds: RoundSeed[];
};

const demoApplications: ApplicationSeed[] = [
  {
    company: "Stripe",
    position: "Senior Backend Engineer",
    sourceName: "Referral",
    applicationDate: "2026-02-10",
    location: "Remote · EU",
    salaryMin: 120000,
    salaryMax: 160000,
    status: ApplicationStatus.OFFER,
    notes: "Strong team fit. Offer received after final round.",
    rounds: [
      {
        sortOrder: 1,
        typeName: "Phone Screen",
        status: InterviewRoundStatus.COMPLETED,
        scheduledAt: "2026-02-18T10:00:00Z",
        completedAt: "2026-02-18T10:30:00Z",
        questions: [
          {
            question:
              "Tell me about a challenging project you owned end-to-end.",
            topic: "Behavioral",
            difficulty: 2,
          },
        ],
      },
      {
        sortOrder: 2,
        typeName: "Take Home",
        status: InterviewRoundStatus.COMPLETED,
        scheduledAt: "2026-02-22T09:00:00Z",
        completedAt: "2026-02-25T18:00:00Z",
        questions: [
          {
            question: "Design a rate limiter API with Redis.",
            topic: "Backend",
            difficulty: 4,
          },
          {
            question: "How did you handle idempotency in your solution?",
            topic: "System Design",
            difficulty: 3,
          },
        ],
      },
      {
        sortOrder: 3,
        typeName: "Technical",
        status: InterviewRoundStatus.COMPLETED,
        scheduledAt: "2026-03-05T14:00:00Z",
        completedAt: "2026-03-05T15:30:00Z",
        questions: [
          {
            question: "Implement LRU cache with O(1) get and put.",
            topic: "Algorithms",
            difficulty: 4,
          },
          {
            question: "Explain ACID properties in distributed transactions.",
            topic: "Database",
            difficulty: 3,
          },
          {
            question: "How would you debug a slow API endpoint in production?",
            topic: "Backend",
            difficulty: 3,
          },
        ],
      },
      {
        sortOrder: 4,
        typeName: "System Design",
        status: InterviewRoundStatus.COMPLETED,
        scheduledAt: "2026-03-12T13:00:00Z",
        completedAt: "2026-03-12T14:15:00Z",
        questions: [
          {
            question: "Design a payment webhook processing system.",
            topic: "System Design",
            difficulty: 5,
          },
          {
            question: "How do you ensure exactly-once delivery?",
            topic: "System Design",
            difficulty: 4,
          },
        ],
      },
      {
        sortOrder: 5,
        typeName: "HR",
        status: InterviewRoundStatus.COMPLETED,
        scheduledAt: "2026-03-18T11:00:00Z",
        completedAt: "2026-03-18T11:45:00Z",
      },
    ],
  },
  {
    company: "Globex",
    position: "Full Stack Engineer",
    sourceName: "LinkedIn",
    applicationDate: "2026-04-02",
    location: "Beograd · hibridno",
    salaryMin: 70000,
    salaryMax: 95000,
    status: ApplicationStatus.INTERVIEWING,
    rounds: [
      {
        sortOrder: 1,
        typeName: "Phone Screen",
        status: InterviewRoundStatus.COMPLETED,
        scheduledAt: "2026-04-10T10:00:00Z",
        completedAt: "2026-04-10T10:30:00Z",
        questions: [
          {
            question: "Why are you interested in Globex?",
            topic: "Behavioral",
            difficulty: 1,
          },
        ],
      },
      {
        sortOrder: 2,
        typeName: "Technical",
        status: InterviewRoundStatus.COMPLETED,
        scheduledAt: "2026-04-18T13:00:00Z",
        completedAt: "2026-04-18T14:00:00Z",
        questions: [
          {
            question:
              "Explain the difference between == and === in JavaScript.",
            topic: "JavaScript",
            difficulty: 2,
          },
          {
            question:
              "What is the virtual DOM and when does reconciliation happen?",
            topic: "React",
            difficulty: 3,
          },
        ],
      },
      {
        sortOrder: 3,
        typeName: "System Design",
        status: InterviewRoundStatus.IN_PROGRESS,
        scheduledAt: "2026-06-10T15:00:00Z",
        questions: [
          {
            question: "Design a real-time notification system.",
            topic: "System Design",
            difficulty: 4,
          },
        ],
      },
      {
        sortOrder: 4,
        typeName: "Behavioral",
        status: InterviewRoundStatus.SCHEDULED,
        scheduledAt: "2026-06-17T09:00:00Z",
      },
      {
        sortOrder: 5,
        typeName: "HR",
        status: InterviewRoundStatus.SCHEDULED,
        scheduledAt: "2026-06-24T10:00:00Z",
      },
    ],
  },
  {
    company: "Acme Corp",
    position: "Senior Software Engineer",
    sourceName: "Referral",
    applicationDate: "2026-05-15",
    location: "Remote",
    salaryMin: 90000,
    salaryMax: 120000,
    status: ApplicationStatus.INTERVIEWING,
    notes: "Applied after a referral from a former colleague.",
    rounds: [
      {
        sortOrder: 1,
        typeName: "Phone Screen",
        status: InterviewRoundStatus.COMPLETED,
        scheduledAt: "2026-05-22T09:00:00Z",
        completedAt: "2026-05-22T09:25:00Z",
      },
      {
        sortOrder: 2,
        typeName: "Technical",
        status: InterviewRoundStatus.COMPLETED,
        scheduledAt: "2026-05-28T14:00:00Z",
        completedAt: "2026-05-28T15:00:00Z",
        questions: [
          {
            question: "Reverse a linked list in-place.",
            topic: "Algorithms",
            difficulty: 3,
          },
          {
            question: "Explain React Server Components.",
            topic: "React",
            difficulty: 3,
          },
        ],
      },
      {
        sortOrder: 3,
        typeName: "System Design",
        status: InterviewRoundStatus.SCHEDULED,
        scheduledAt: "2026-06-14T13:00:00Z",
      },
      {
        sortOrder: 4,
        typeName: "HR",
        status: InterviewRoundStatus.SCHEDULED,
        scheduledAt: "2026-06-21T11:00:00Z",
      },
    ],
  },
  {
    company: "Vercel",
    position: "Frontend Engineer",
    sourceName: "Company Website",
    applicationDate: "2026-05-28",
    location: "Remote",
    salaryMin: 100000,
    salaryMax: 130000,
    status: ApplicationStatus.SCREENING,
    rounds: [
      {
        sortOrder: 1,
        typeName: "Phone Screen",
        status: InterviewRoundStatus.COMPLETED,
        scheduledAt: "2026-06-03T16:00:00Z",
        completedAt: "2026-06-03T16:20:00Z",
        questions: [
          {
            question: "What excites you about the Next.js ecosystem?",
            topic: "Frontend",
            difficulty: 2,
          },
        ],
      },
      {
        sortOrder: 2,
        typeName: "Technical",
        status: InterviewRoundStatus.SCHEDULED,
        scheduledAt: "2026-06-12T14:00:00Z",
      },
    ],
  },
  {
    company: "Meta",
    position: "Software Engineer E4",
    sourceName: "Job Board",
    applicationDate: "2026-01-20",
    location: "London · hibridno",
    salaryMin: 110000,
    salaryMax: 145000,
    status: ApplicationStatus.REJECTED,
    rejectionReason: "Did not meet the bar on system design round.",
    rounds: [
      {
        sortOrder: 1,
        typeName: "Phone Screen",
        status: InterviewRoundStatus.COMPLETED,
        scheduledAt: "2026-01-28T10:00:00Z",
        completedAt: "2026-01-28T10:30:00Z",
      },
      {
        sortOrder: 2,
        typeName: "Technical",
        status: InterviewRoundStatus.COMPLETED,
        scheduledAt: "2026-02-05T14:00:00Z",
        completedAt: "2026-02-05T15:00:00Z",
        questions: [
          {
            question:
              "Find the longest substring without repeating characters.",
            topic: "Algorithms",
            difficulty: 3,
          },
          {
            question: "Serialize and deserialize a binary tree.",
            topic: "Algorithms",
            difficulty: 4,
          },
        ],
      },
      {
        sortOrder: 3,
        typeName: "System Design",
        status: InterviewRoundStatus.COMPLETED,
        scheduledAt: "2026-02-12T13:00:00Z",
        completedAt: "2026-02-12T14:00:00Z",
        questions: [
          {
            question: "Design Instagram feed.",
            topic: "System Design",
            difficulty: 5,
          },
        ],
      },
      {
        sortOrder: 4,
        typeName: "Behavioral",
        status: InterviewRoundStatus.CANCELLED,
        scheduledAt: "2026-02-20T11:00:00Z",
      },
    ],
  },
  {
    company: "Amazon",
    position: "SDE II",
    sourceName: "Recruiter",
    applicationDate: "2026-03-01",
    location: "Berlin · onsite",
    salaryMin: 85000,
    salaryMax: 110000,
    status: ApplicationStatus.INTERVIEWING,
    rounds: [
      {
        sortOrder: 1,
        typeName: "Phone Screen",
        status: InterviewRoundStatus.COMPLETED,
        scheduledAt: "2026-03-08T09:00:00Z",
        completedAt: "2026-03-08T09:30:00Z",
      },
      {
        sortOrder: 2,
        typeName: "Technical",
        status: InterviewRoundStatus.COMPLETED,
        scheduledAt: "2026-03-15T13:00:00Z",
        completedAt: "2026-03-15T14:00:00Z",
        questions: [
          {
            question: "Tell me about a time you disagreed with your manager.",
            topic: "Leadership",
            difficulty: 2,
          },
          {
            question: "Implement a thread-safe queue.",
            topic: "Backend",
            difficulty: 4,
          },
        ],
      },
      {
        sortOrder: 3,
        typeName: "Technical",
        status: InterviewRoundStatus.COMPLETED,
        scheduledAt: "2026-03-22T13:00:00Z",
        completedAt: "2026-03-22T14:00:00Z",
        questions: [
          {
            question: "Optimize search in a sorted rotated array.",
            topic: "Algorithms",
            difficulty: 4,
          },
        ],
      },
      {
        sortOrder: 4,
        typeName: "System Design",
        status: InterviewRoundStatus.SCHEDULED,
        scheduledAt: "2026-06-16T10:00:00Z",
      },
      {
        sortOrder: 5,
        typeName: "Behavioral",
        status: InterviewRoundStatus.SCHEDULED,
        scheduledAt: "2026-06-23T10:00:00Z",
      },
      {
        sortOrder: 6,
        typeName: "HR",
        status: InterviewRoundStatus.SCHEDULED,
        scheduledAt: "2026-06-30T09:00:00Z",
      },
    ],
  },
  {
    company: "Startup XYZ",
    position: "Frontend Developer",
    sourceName: "Recruiter",
    applicationDate: "2026-06-01",
    location: "Remote",
    status: ApplicationStatus.APPLIED,
    rounds: [],
  },
];

async function main() {
  const applicationSources = [
    "LinkedIn",
    "Referral",
    "Company Website",
    "Recruiter",
    "Job Board",
    "Other",
  ];

  for (const name of applicationSources) {
    await prisma.applicationSource.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const interviewTypes = [
    {
      name: "Phone Screen",
      description: "Initial recruiter or HR call.",
    },
    {
      name: "Technical",
      description: "Coding, algorithms, or live problem solving.",
    },
    {
      name: "System Design",
      description: "Architecture and scalability discussion.",
    },
    {
      name: "Behavioral",
      description: "Past experience, teamwork, and culture fit.",
    },
    {
      name: "HR",
      description: "Policy, benefits, and final alignment.",
    },
    {
      name: "Take Home",
      description: "Async assignment completed on your own time.",
    },
  ];

  for (const type of interviewTypes) {
    await prisma.interviewType.upsert({
      where: { name: type.name },
      update: { description: type.description },
      create: type,
    });
  }

  const skills = [
    { name: "JavaScript", category: "Language" },
    { name: "TypeScript", category: "Language" },
    { name: "React", category: "Frontend" },
    { name: "Next.js", category: "Frontend" },
    { name: "Node.js", category: "Backend" },
    { name: "SQL", category: "Database" },
    { name: "System Design", category: "Architecture" },
    { name: "Algorithms", category: "Fundamentals" },
    { name: "Communication", category: "Soft Skills" },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: { category: skill.category },
      create: skill,
    });
  }

  const [sources, types] = await Promise.all([
    prisma.applicationSource.findMany(),
    prisma.interviewType.findMany(),
  ]);

  const sourceByName = new Map(
    sources.map((source) => [source.name, source.id]),
  );
  const typeByName = new Map(types.map((type) => [type.name, type.id]));

  const demoPasswordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@interwjuer.app" },
    update: { name: "Demo User", passwordHash: demoPasswordHash },
    create: {
      email: "demo@interwjuer.app",
      name: "Demo User",
      passwordHash: demoPasswordHash,
    },
  });

  await prisma.jobApplication.deleteMany({
    where: { userId: demoUser.id },
  });

  await Promise.all(
    demoApplications.map((application) => {
      const sourceId = sourceByName.get(application.sourceName);
      if (!sourceId) {
        throw new Error(`Missing source: ${application.sourceName}`);
      }

      return prisma.jobApplication.create({
        data: {
          userId: demoUser.id,
          company: application.company,
          position: application.position,
          applicationSourceId: sourceId,
          applicationDate: new Date(application.applicationDate),
          location: application.location,
          salaryMin: application.salaryMin,
          salaryMax: application.salaryMax,
          applicationStatus: application.status,
          rejectionReason: application.rejectionReason,
          notes: application.notes,
          interviewRounds: {
            create: application.rounds.map((round) => {
              const interviewTypeId = typeByName.get(round.typeName);
              if (!interviewTypeId) {
                throw new Error(`Missing interview type: ${round.typeName}`);
              }

              return {
                interviewTypeId,
                sortOrder: round.sortOrder,
                status: round.status,
                scheduledAt: new Date(round.scheduledAt),
                completedAt: round.completedAt
                  ? new Date(round.completedAt)
                  : undefined,
                questions: round.questions
                  ? {
                      create: round.questions.map((question) => ({
                        question: question.question,
                        topic: question.topic,
                        difficulty: question.difficulty,
                      })),
                    }
                  : undefined,
              };
            }),
          },
        },
      });
    }),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
