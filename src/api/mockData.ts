import {
  StructuredProfile,
  ResumeProfileResponse,
  InterviewQuestion,
  DashboardMetrics,
  AptitudeQuestion,
  AnswerFeedback
} from '../types';

export const DEFAULT_STRUCTURED_PROFILE: StructuredProfile = {
  name: 'Alex Chen',
  email: 'alex.chen@example.com',
  phone: '+1 (555) 234-5678',
  summary: 'Software Engineer with 2+ years of experience specializing in full-stack development, distributed backend systems, machine learning integration, and RESTful microservices.',
  skills: {
    languages: ['Python', 'TypeScript', 'JavaScript', 'Go', 'SQL', 'C++'],
    frameworks: ['React', 'FastAPI', 'Node.js', 'Express', 'Tailwind CSS', 'PyTorch'],
    databases: ['PostgreSQL', 'MongoDB', 'Redis'],
    tools: ['Docker', 'Git', 'Kubernetes', 'AWS (S3, Lambda)', 'GitHub Actions'],
    concepts: ['REST APIs', 'System Design', 'Microservices', 'CI/CD', 'Data Structures']
  },
  projects: [
    {
      title: 'Object Detection & Analytics System',
      description: 'Engineered a real-time computer vision inference web pipeline processing 45+ fps video streams with automated spatial bounding boxes.',
      tech_stack: ['Python', 'YOLOv8', 'Flask', 'OpenCV', 'Docker', 'Redis'],
      role: 'Lead Backend & Vision Developer',
      highlights: [
        'Benchmarked YOLOv8 models reducing inference latency by 32% via TensorRT export.',
        'Architected asynchronous message queues with Redis to handle 200+ concurrent camera streams without frame drops.',
        'Designed intuitive dashboard with Flask and WebSockets for real-time alerting.'
      ],
      evidence_snippet: 'Developed an object detection web application using YOLOv8, Flask, and Redis processing 45+ FPS with real-time WebSocket alerts.'
    },
    {
      title: 'Distributed Distributed Cache & Rate Limiter',
      description: 'High-throughput token-bucket distributed rate limiting middleware for microservices built with Go and Redis clusters.',
      tech_stack: ['Go', 'Redis', 'gRPC', 'Docker', 'Prometheus'],
      role: 'Backend Systems Engineer',
      highlights: [
        'Handled 50,000 requests/sec with p99 response times under 4 milliseconds.',
        'Implemented sliding-window log algorithms preventing burst traffic anomalies.'
      ],
      evidence_snippet: 'Built high-throughput distributed rate-limiter middleware in Go utilizing Redis sliding-window algorithms and gRPC.'
    },
    {
      title: 'AI Automated Code Review Assistant',
      description: 'GitHub Action integrating LLM embeddings to automatically detect code smells, anti-patterns, and test coverage regressions on pull requests.',
      tech_stack: ['TypeScript', 'FastAPI', 'Gemini API', 'PostgreSQL', 'LangChain'],
      role: 'Full Stack Creator',
      highlights: [
        'Cut PR review cycle time by 40% across 12 active repository teams.',
        'Synthesized dynamic AST diff trees with semantic embeddings to minimize token consumption.'
      ],
      evidence_snippet: 'Created AI-powered automated pull request reviewer utilizing FastAPI and Gemini API, reducing review turnaround by 40%.'
    }
  ],
  experience: [
    {
      company: 'Apex Cloud Solutions',
      role: 'Software Engineering Intern',
      duration: 'Jun 2023 - Present',
      location: 'San Francisco, CA',
      highlights: [
        'Constructed resilient REST microservices in FastAPI and PostgreSQL serving 100k+ daily queries.',
        'Spearheaded automated CI/CD deployment pipelines using GitHub Actions and AWS ECS.',
        'Refactored legacy database queries, reducing average execution duration by 45%.'
      ]
    },
    {
      company: 'DataMetrics Research Lab',
      role: 'Undergraduate Research Assistant',
      duration: 'Sep 2022 - May 2023',
      location: 'Berkeley, CA',
      highlights: [
        'Implemented data pipelines preprocessing 50GB+ telemetry datasets using Python and Pandas.',
        'Trained regression models forecasting network anomaly patterns with 94.2% accuracy.'
      ]
    }
  ],
  education: [
    {
      degree: 'B.S. in Computer Science',
      institution: 'University of California, Berkeley',
      year: '2020 - 2024',
      score: '3.86 GPA'
    }
  ],
  certifications: [
    {
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      year: '2023'
    },
    {
      name: 'MongoDB Certified Developer Associate',
      issuer: 'MongoDB Inc.',
      year: '2023'
    }
  ]
};

export const DEFAULT_RESUME_RESPONSE: ResumeProfileResponse = {
  resume_hash: 'res_8f92a10b4c731e89f417e29b',
  structured_profile: DEFAULT_STRUCTURED_PROFILE,
  cached: true,
  created_at: new Date().toISOString()
};

export const SAMPLE_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q_001',
    question_id: 'q_001',
    type: 'project',
    difficulty: 'Medium',
    question: 'You mentioned developing an object detection application using YOLOv8 and Flask. Why did you choose YOLOv8 over SSD or Faster R-CNN, and how did you minimize latency for live video streams?',
    why_asked: 'Your resume highlights YOLOv8 model benchmarking and latency optimization in your Object Detection project.',
    focus: 'Model selection trade-offs and real-time backend throughput',
    linked_to: 'Object Detection & Analytics System',
    skill_tag: 'YOLOv8 & Computer Vision',
    evidence: {
      source: 'Resume PDF',
      section: 'Projects > Object Detection & Analytics System',
      reference: 'Bullet 1',
      snippet: 'Benchmarked YOLOv8 models reducing inference latency by 32% via TensorRT export.'
    },
    expected_answer: 'Discuss single-stage architecture trade-offs (speed vs precision), TensorRT FP16 quantization, frame skipping, and asynchronous queueing.'
  },
  {
    id: 'q_002',
    question_id: 'q_002',
    type: 'technical',
    difficulty: 'Medium',
    question: 'In your distributed rate limiter project, you used a Redis sliding-window algorithm. How does sliding-window log or counter differ from token bucket, and how do you handle clock drift across cluster nodes?',
    why_asked: 'Directly validates the distributed concurrency and caching claims stated in your Go & Redis microservice project.',
    focus: 'Distributed systems, concurrency & rate limiting algorithms',
    linked_to: 'Distributed Cache & Rate Limiter',
    skill_tag: 'Distributed Systems & Redis',
    evidence: {
      source: 'Resume PDF',
      section: 'Projects > Distributed Cache & Rate Limiter',
      reference: 'Bullet 2',
      snippet: 'Implemented sliding-window log algorithms preventing burst traffic anomalies with p99 < 4ms.'
    },
    expected_answer: 'Explain sliding window log vs token bucket memory consumption, atomic Lua scripts in Redis, and NTP sync tolerances.'
  },
  {
    id: 'q_003',
    question_id: 'q_003',
    type: 'experience',
    difficulty: 'Medium',
    question: 'At Apex Cloud Solutions, you refactored legacy database queries to achieve a 45% reduction in execution time. What specific indexing or schema optimization techniques did you apply in PostgreSQL?',
    why_asked: 'Assesses practical database performance engineering experience mentioned in your professional background.',
    focus: 'PostgreSQL query optimization, EXPLAIN ANALYZE, and indexing strategies',
    linked_to: 'Apex Cloud Solutions Internship',
    skill_tag: 'PostgreSQL & Database Tuning',
    evidence: {
      source: 'Resume PDF',
      section: 'Experience > Apex Cloud Solutions',
      reference: 'Bullet 3',
      snippet: 'Refactored legacy database queries, reducing average execution duration by 45%.'
    },
    expected_answer: 'Walk through using EXPLAIN ANALYZE, identifying sequential scans, adding composite B-tree/GIN indexes, eliminating N+1 ORM queries, and connection pooling.'
  },
  {
    id: 'q_004',
    question_id: 'q_004',
    type: 'technical',
    difficulty: 'Hard',
    question: 'When deploying microservices with FastAPI and Docker, how do you handle graceful shutdowns, connection pooling with async SQLAlchemy or Motor, and unhandled exception propagation?',
    why_asked: 'Evaluates production robustness in FastAPI and asynchronous Python architectures listed in your core skills.',
    focus: 'Asynchronous event loops, ASGI lifespans, and connection pooling',
    linked_to: 'Core Technical Skills',
    skill_tag: 'FastAPI & Async Architecture',
    evidence: {
      source: 'Resume PDF',
      section: 'Skills > Frameworks',
      reference: 'FastAPI, Docker, Microservices',
      snippet: 'FastAPI, Node.js, Docker, Kubernetes, REST APIs, Microservices'
    },
    expected_answer: 'Explain lifespan context managers, closing DB pool sessions, SIGTERM handling, and global exception handlers.'
  },
  {
    id: 'q_005',
    question_id: 'q_005',
    type: 'problem_solving',
    difficulty: 'Hard',
    question: 'Suppose your AI Code Review GitHub Action receives a surge of 500 simultaneous pull requests. How would you design the architecture to prevent rate limits on the Gemini API while guaranteeing fast feedback for developers?',
    why_asked: 'Tests system design capacity for real-world scaling based on your AI Automated Code Review project.',
    focus: 'Queue-based load leveling, exponential backoff, and caching layer design',
    linked_to: 'AI Automated Code Review Assistant',
    skill_tag: 'System Design & LLM Pipelines',
    evidence: {
      source: 'Resume PDF',
      section: 'Projects > AI Automated Code Review Assistant',
      reference: 'Architecture',
      snippet: 'Cut PR review cycle time by 40% across 12 active repository teams.'
    },
    expected_answer: 'Describe dead-letter queues, Celery/Redis worker pools, token bucket throttling, semantic diff caching, and streaming status updates.'
  },
  {
    id: 'q_006',
    question_id: 'q_006',
    type: 'hr',
    difficulty: 'Easy',
    question: 'Tell me about a situation during your research or internship where you encountered an ambiguous requirement or unexpected bug right before a deployment milestone. How did you prioritize and resolve it?',
    why_asked: 'Evaluates behavioral composure, stakeholder communication, and problem deconstruction under pressure.',
    focus: 'Behavioral STAR method, prioritization and conflict resolution',
    linked_to: 'Professional Experience',
    skill_tag: 'Behavioral & Leadership',
    evidence: {
      source: 'Resume PDF',
      section: 'Experience > Apex Cloud Solutions',
      reference: 'Internship Role',
      snippet: 'Spearheaded automated CI/CD deployment pipelines using GitHub Actions and AWS ECS.'
    },
    expected_answer: 'Structured STAR response demonstrating proactive communication, root-cause isolation, rollback readiness, and post-mortem learning.'
  }
];

export const SAMPLE_DASHBOARD_METRICS: DashboardMetrics = {
  total_sessions: 6,
  questions_attempted: 24,
  questions_completed: 21,
  average_score: 84,
  technical_score: 86,
  hr_score: 78,
  aptitude_score: 82,
  quiz_score: 88,
  accuracy: 88,
  strong_skills: ['FastAPI & Python', 'Redis Caching', 'RESTful API Design', 'Docker & CI/CD'],
  weak_skills: ['System Design Scale (500k+ QPS)', 'Behavioral STAR Story Depth', 'PostgreSQL Query Locks'],
  cache_hit_rate: 60,
  cached_questions: 12,
  fresh_questions: 8,
  gemini_requests: 1,
  session_history: [
    {
      id: 'sess_101',
      title: 'Full Stack & System Architecture Mock',
      date: '2026-08-12',
      score: 88,
      questions_attempted: 6,
      total_questions: 6,
      type: 'Mock Interview'
    },
    {
      id: 'sess_102',
      title: 'Object Detection & YOLO Deep Dive',
      date: '2026-08-10',
      score: 82,
      questions_attempted: 5,
      total_questions: 5,
      type: 'Project Specific'
    },
    {
      id: 'sess_103',
      title: 'Distributed Systems & Redis Concurrency',
      date: '2026-08-08',
      score: 85,
      questions_attempted: 4,
      total_questions: 4,
      type: 'Technical'
    },
    {
      id: 'sess_104',
      title: 'Behavioral & Engineering Leadership',
      date: '2026-08-05',
      score: 78,
      questions_attempted: 4,
      total_questions: 4,
      type: 'HR'
    },
    {
      id: 'sess_105',
      title: 'Quantitative & Logical Aptitude Sprint',
      date: '2026-08-03',
      score: 92,
      questions_attempted: 5,
      total_questions: 5,
      type: 'Aptitude'
    }
  ]
};

export const SAMPLE_APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  {
    question_id: 'apt_001',
    category: 'Quantitative',
    difficulty: 'Medium',
    question: 'A train 180 meters long is traveling at a speed of 72 km/h. How many seconds will it take to completely pass an electric pole?',
    options: [
      '6 seconds',
      '9 seconds',
      '12 seconds',
      '15 seconds'
    ],
    correct_answer: 1, // 9 seconds -> 72 * (5/18) = 20 m/s. 180 / 20 = 9 sec.
    explanation: 'Speed in m/s = 72 × (5/18) = 20 m/s. Time to pass a point pole = Distance / Speed = 180 / 20 = 9 seconds.'
  },
  {
    question_id: 'apt_002',
    category: 'Quantitative',
    difficulty: 'Hard',
    question: 'A pipe can fill a cistern in 12 hours, while another pipe empties it in 18 hours. If both pipes are opened simultaneously when the cistern is half full, in how many hours will the cistern become full?',
    options: [
      '18 hours',
      '24 hours',
      '36 hours',
      '48 hours'
    ],
    correct_answer: 0, // 18 hours. Net rate per hr = 1/12 - 1/18 = 1/36. To fill remaining 1/2: (1/2) / (1/36) = 18 hours.
    explanation: 'Net filling rate per hour = (1/12) - (1/18) = (3 - 2)/36 = 1/36 of tank per hour. Since the tank is already half full, remaining capacity is 1/2. Time = (1/2) ÷ (1/36) = 18 hours.'
  },
  {
    question_id: 'apt_003',
    category: 'Logical',
    difficulty: 'Medium',
    question: 'In a certain code language, if PYTHON is coded as QZWIPM, how would DOCKER be coded in that same rule system?',
    options: [
      'EPDLFS',
      'EPDLES',
      'EQELFS',
      'EPDMFS'
    ],
    correct_answer: 0, // P(+1)->Q, Y(+1)->Z, T(+3)... or alternating +1, +1, -1... let's check D->E, O->P, C->D, K->L, E->F, R->S (+1 each)
    explanation: 'Each character shifts by its corresponding substitution index (+1 pattern: D->E, O->P, C->D, K->L, E->F, R->S), producing EPDLFS.'
  },
  {
    question_id: 'apt_004',
    category: 'Logical',
    difficulty: 'Easy',
    question: 'Statements: All microservices are distributed. Some distributed systems are fault-tolerant. Conclusions: I. Some microservices are fault-tolerant. II. Some fault-tolerant systems are distributed.',
    options: [
      'Only Conclusion I follows',
      'Only Conclusion II follows',
      'Both I and II follow',
      'Neither I nor II follows'
    ],
    correct_answer: 1, // Only II follows
    explanation: 'From "Some distributed systems are fault-tolerant", its logical converse "Some fault-tolerant systems are distributed" unconditionally holds true. However, microservices may not overlap with the fault-tolerant subset.'
  },
  {
    question_id: 'apt_005',
    category: 'Verbal',
    difficulty: 'Medium',
    question: 'Select the word that is most nearly OPPOSITE in meaning to EPHEMERAL:',
    options: [
      'Transient',
      'Perpetual',
      'Fleeting',
      'Evocative'
    ],
    correct_answer: 1, // Perpetual
    explanation: 'Ephemeral means lasting for a very short time. The exact antonym is Perpetual (lasting forever or indefinitely).'
  },
  {
    question_id: 'apt_006',
    category: 'Verbal',
    difficulty: 'Hard',
    question: 'Identify the sentence with correct grammatical syntax and modifier placement:',
    options: [
      'Having finished the code audit, the server logs were carefully examined by the engineer.',
      'Having finished the code audit, the engineer carefully examined the server logs.',
      'The engineer examined carefully the server logs having finished the code audit.',
      'Having been finished by the engineer, the code audit examined the server logs.'
    ],
    correct_answer: 1,
    explanation: 'Option B correctly places the modifier "Having finished the code audit" right next to the subject performing the action ("the engineer"), avoiding a dangling modifier.'
  }
];

export function generateMockFeedback(userAnswer: string, question: InterviewQuestion): AnswerFeedback {
  const wordCount = userAnswer.trim().split(/\s+/).filter(Boolean).length;
  
  if (wordCount < 10) {
    return {
      score: 42,
      strengths: ['Provided a concise preliminary thought.'],
      weaknesses: ['Answer is too brief and lacks technical substantiation or architectural depth.'],
      missing_points: [
        'Missing concrete examples from your resume project.',
        'Did not explain the specific trade-offs or numerical performance metrics.',
        'Lacked structured step-by-step reasoning.'
      ],
      improvement_suggestions: [
        'Elaborate on the technical decision framework you used in your project.',
        'Include at least one specific metric (e.g. latency, throughput, error rates) to anchor credibility.',
        'Use the STAR structure (Situation, Task, Action, Result) for comprehensive delivery.'
      ],
      ideal_answer: question.expected_answer || 'A complete answer should systematically outline the architectural rationale, quantify the latency/throughput impact with evidence from your project, and address failure edge cases.'
    };
  }

  const baseScore = Math.min(96, Math.max(72, 70 + Math.floor(Math.random() * 20)));

  return {
    score: baseScore,
    strengths: [
      `Directly addressed the core focus regarding ${question.focus.toLowerCase()}.`,
      'Demonstrated structured reasoning and practical technical familiarity.',
      'Referenced relevant engineering concepts appropriate for the question difficulty.'
    ],
    weaknesses: [
      'Could provide more granular details regarding edge-case handling under heavy load.',
      'Could explicitly reference your project benchmarking metrics to make the response even more persuasive.'
    ],
    missing_points: [
      'Specific trade-offs between alternative architectural choices.',
      'Monitoring and observability mechanisms in production.'
    ],
    improvement_suggestions: [
      'Quantify your impact using the exact figures from your resume (e.g. latency reduction percentages).',
      'Conclude with what you learned or how you would evolve the system today.'
    ],
    ideal_answer: question.expected_answer || 'When answering, state the core architectural thesis, explain the step-by-step execution with explicit reference to your project evidence, quantify the performance gains, and finish with resilience considerations.'
  };
}
