'use client';

import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Zap, 
  RefreshCw, 
  Search, 
  MapPin, 
  Briefcase, 
  Bell, 
  ChevronDown, 
  ChevronRight, 
  Bookmark, 
  Copy, 
  Check, 
  ArrowRight, 
  Quote, 
  Sparkles, 
  X, 
  FileUp, 
  Layers, 
  SlidersHorizontal,
  Info
} from 'lucide-react';

// ==========================================
// TYPES
// ==========================================

type ResumeEvidence = {
  id: string;
  text: string;
  source: "resume" | "portfolio";
  matchedKeywords: string[];
};

type JobMatch = {
  id: string;
  title: string;
  company: string;
  location: string;
  experienceLevel: string;
  matchScore: number;
  skills: string[];
  metrics: {
    skills: number;
    experience: number;
    projects: number;
    keywords: number;
    ats: number;
  };
  strengths: string[];
  matchedSkills: string[];
  missingSkills: string[];
  evidence: ResumeEvidence[];
  verdict: string;
  tailoredResumeBullets: string[];
};

// ==========================================
// MOCK DATA
// ==========================================

const MOCK_JOBS: JobMatch[] = [
  {
    id: "job-1",
    title: "Full Stack Developer",
    company: "Nova Labs",
    location: "Remote",
    experienceLevel: "Fresher",
    matchScore: 87,
    skills: ["React", "Node.js", "MongoDB"],
    metrics: {
      skills: 92,
      experience: 78,
      projects: 89,
      keywords: 74,
      ats: 91
    },
    strengths: [
      "Strong MERN stack experience",
      "Built production-grade full-stack applications",
      "Experience with Redis and BullMQ",
      "AWS EC2 deployment experience",
      "REST API design and JWT authentication",
      "Docker and microservices exposure"
    ],
    matchedSkills: ["React", "Node.js", "Express.js", "MongoDB", "Redis", "Docker", "AWS"],
    missingSkills: ["Python", "Kubernetes", "CI/CD Monitoring"],
    evidence: [
      {
        id: "ev-1-1",
        text: "Built a microservices-based AI Trip Planner using Next.js, Node.js, PostgreSQL, Redis, and BullMQ.",
        source: "resume",
        matchedKeywords: ["Redis", "BullMQ", "microservices"]
      },
      {
        id: "ev-1-2",
        text: "Implemented Redis caching with PostgreSQL fallback to optimize LLM API costs.",
        source: "resume",
        matchedKeywords: ["Redis"]
      },
      {
        id: "ev-1-3",
        text: "Deployed containerized services on AWS EC2 with Nginx.",
        source: "resume",
        matchedKeywords: ["AWS EC2"]
      }
    ],
    verdict: "Strong match for this role based on MERN stack experience and production-grade projects. The largest gaps are Python and cloud monitoring experience.",
    tailoredResumeBullets: [
      "Architected and deployed a containerized microservices trip planner utilizing Docker, Node.js, and Redis, boosting API response latency by 40%.",
      "Configured robust Redis caching mechanisms with PostgreSQL fallback, cutting third-party LLM API transaction costs by 28%.",
      "Orchestrated continuous deployment of core microservices onto AWS EC2 instances, achieving 99.9% uptime for testing environments."
    ]
  },
  {
    id: "job-2",
    title: "Backend Developer",
    company: "TechFlow",
    location: "Noida",
    experienceLevel: "0–1 Years",
    matchScore: 79,
    skills: ["Node.js", "Redis", "REST API"],
    metrics: {
      skills: 85,
      experience: 70,
      projects: 82,
      keywords: 68,
      ats: 80
    },
    strengths: [
      "Deep understanding of server-side runtimes",
      "REST API caching strategies using Redis",
      "Database scaling and schema modeling",
      "Familiar with message queue processing"
    ],
    matchedSkills: ["Node.js", "Express.js", "Redis", "MongoDB", "PostgreSQL"],
    missingSkills: ["Kubernetes", "Go", "GraphQL"],
    evidence: [
      {
        id: "ev-2-1",
        text: "Engineered scalable REST APIs with Node.js and Express, supporting 5k+ concurrent users.",
        source: "resume",
        matchedKeywords: ["Node.js", "Express", "REST APIs"]
      },
      {
        id: "ev-2-2",
        text: "Utilized Redis for memory caching to decrease database loading times by 65%.",
        source: "resume",
        matchedKeywords: ["Redis"]
      }
    ],
    verdict: "Solid backend capabilities particularly in Node.js and Redis. Would benefit from adding GraphQL or microservice orchestration experience.",
    tailoredResumeBullets: [
      "Engineered backend REST APIs serving 5,000+ daily active users, using Node.js/Express to reduce server response overhead by 35%.",
      "Leveraged Redis memory caches to store frequently requested lookup datasets, improving average latency values from 240ms down to 80ms."
    ]
  },
  {
    id: "job-3",
    title: "MERN Stack Developer",
    company: "DevCore",
    location: "Gurugram",
    experienceLevel: "Junior",
    matchScore: 72,
    skills: ["MERN", "TypeScript", "Docker"],
    metrics: {
      skills: 80,
      experience: 65,
      projects: 78,
      keywords: 62,
      ats: 75
    },
    strengths: [
      "Solid foundation in Mongo, Express, React, and Node",
      "Transitioned components to strict TypeScript types",
      "Familiar with standard containerization"
    ],
    matchedSkills: ["React", "Node.js", "MongoDB", "Express.js", "TypeScript", "Docker"],
    missingSkills: ["AWS CloudFormation", "Kubernetes", "Next.js SSR"],
    evidence: [
      {
        id: "ev-3-1",
        text: "Refactored React codebases to TypeScript, eliminating 95% of runtime type assertion errors.",
        source: "resume",
        matchedKeywords: ["TypeScript", "React"]
      },
      {
        id: "ev-3-2",
        text: "Containerized development stack using Docker Compose for unified engineer onboarding.",
        source: "resume",
        matchedKeywords: ["Docker"]
      }
    ],
    verdict: "Matches well on TypeScript and standard MERN skills. Lacks deep cloud deployment architecture experience or server-side rendering protocols.",
    tailoredResumeBullets: [
      "Refactored legacy React architectures into strongly typed TypeScript components, decreasing production exception rates by 22%.",
      "Authored standardized Docker files for local dev containerization, cutting new developer onboarding times from 2 days to 15 minutes."
    ]
  },
  {
    id: "job-4",
    title: "Software Engineer",
    company: "CloudNova",
    location: "Bengaluru",
    experienceLevel: "Entry Level",
    matchScore: 61,
    skills: ["JavaScript", "AWS", "System Design"],
    metrics: {
      skills: 68,
      experience: 55,
      projects: 64,
      keywords: 58,
      ats: 62
    },
    strengths: [
      "Strong JavaScript base logic and ES6 standards",
      "Deployment exposure on AWS cloud infrastructure",
      "Basic system architecture knowledge"
    ],
    matchedSkills: ["JavaScript", "AWS EC2", "Docker", "Node.js"],
    missingSkills: ["System Monitoring", "Microservices Design", "NoSQL Scaling"],
    evidence: [
      {
        id: "ev-4-1",
        text: "Successfully deployed project assets onto AWS cloud resources with basic monitoring alerts.",
        source: "resume",
        matchedKeywords: ["AWS"]
      }
    ],
    verdict: "Possesses core engineering fundamentals but lacks high-availability design, advanced AWS resources (RDS, S3), or large-scale database optimization.",
    tailoredResumeBullets: [
      "Implemented auto-scaling groups on AWS EC2 configurations, ensuring consistent 100% service uptime during traffic bursts.",
      "Designed clean modular system patterns in JavaScript following solid object-oriented standards, maximizing library reusability."
    ]
  },
  {
    id: "job-5",
    title: "AI Engineer Intern",
    company: "NeuralStack",
    location: "Remote",
    experienceLevel: "Internship",
    matchScore: 43,
    skills: ["Python", "LLM", "LangChain"],
    metrics: {
      skills: 50,
      experience: 35,
      projects: 40,
      keywords: 30,
      ats: 45
    },
    strengths: [
      "Familiar with basic LLM API orchestration patterns",
      "Strong Python scripting foundation"
    ],
    matchedSkills: ["Redis", "Node.js", "PostgreSQL"],
    missingSkills: ["Python", "LangChain", "HuggingFace", "PyTorch"],
    evidence: [
      {
        id: "ev-5-1",
        text: "Built a microservices AI planner with Redis and PostgreSQL integration to optimize costs.",
        source: "resume",
        matchedKeywords: ["Redis", "PostgreSQL"]
      }
    ],
    verdict: "Significant capability gaps for an AI specialist role. Lacks deep model tuning, LangChain pipeline design, and python machine learning frameworks.",
    tailoredResumeBullets: [
      "Designed logic pathways interfacing Next.js services with Gemini models, formatting system instructions for deterministic JSON responses.",
      "Integrated Redis datastores to archive LLM inference runs, mitigating repetitive processing expenses by 15%."
    ]
  }
];

// ==========================================
// SUB-COMPONENTS
// ==========================================

const ScoreRing = ({ score, size = 120, strokeWidth = 10, label = "Total score" }: { score: number, size?: number, strokeWidth?: number, label?: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  let color = "stroke-red-500";
  if (score >= 80) color = "stroke-[#5B4FF5]";
  else if (score >= 60) color = "stroke-blue-500";
  else if (score >= 40) color = "stroke-amber-500";

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-[#E9E9F0] fill-none"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`${color} fill-none transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-[#18181B] font-mono">{score}</span>
          <span className="text-[9px] text-[#71717A] uppercase font-black tracking-wider text-center">{label}</span>
        </div>
      </div>
    </div>
  );
};

const CompactScoreRing = ({ score, size = 44, strokeWidth = 4 }: { score: number, size?: number, strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  let color = "stroke-red-500";
  let textClass = "text-red-600";
  let bgClass = "bg-red-50";
  if (score >= 80) {
    color = "stroke-[#5B4FF5]";
    textClass = "text-[#5B4FF5]";
    bgClass = "bg-indigo-50";
  } else if (score >= 60) {
    color = "stroke-blue-500";
    textClass = "text-blue-600";
    bgClass = "bg-blue-50";
  } else if (score >= 40) {
    color = "stroke-amber-500";
    textClass = "text-amber-600";
    bgClass = "bg-amber-50";
  }

  return (
    <div className={`relative flex items-center justify-center rounded-full ${bgClass}`} style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-[#E9E9F0] fill-none"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`${color} fill-none`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className={`text-xs font-black font-mono z-10 ${textClass}`}>{score}</span>
    </div>
  );
};

const MetricRow = ({ name, score }: { name: string; score: number }) => {
  let activeColor = "bg-red-500";
  if (score >= 80) activeColor = "bg-[#5B4FF5]";
  else if (score >= 60) activeColor = "bg-blue-500";
  else if (score >= 40) activeColor = "bg-amber-500";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-semibold text-[#71717A]">{name}</span>
        <span className="font-extrabold text-[#18181B] font-mono">{score}</span>
      </div>
      <div className="h-1.5 w-full bg-[#E9E9F0] rounded-full overflow-hidden">
        <div 
          className={`h-full ${activeColor} rounded-full transition-all duration-1000 ease-out`} 
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

// ==========================================
// MAIN DASHBOARD COMPONENT
// ==========================================

export default function DashboardHome() {
  // State for jobs database
  const [jobs, setJobs] = useState<JobMatch[]>(MOCK_JOBS);
  const [selectedJob, setSelectedJob] = useState<JobMatch>(MOCK_JOBS[0]!);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<{
    location: string | null;
    seniority: string | null;
    industry: string | null;
  }>({
    location: null,
    seniority: null,
    industry: null
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [autoMatch, setAutoMatch] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  // Active Action Sheets & Modals state
  const [activeSheet, setActiveSheet] = useState<{
    type: 'summary' | 'bullets' | 'keywords' | 'ats' | 'cover' | null;
    loading: boolean;
  }>({ type: null, loading: false });
  const [modalOpen, setModalOpen] = useState(false);
  
  // Real-time analysis form state
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  
  // Toast notifications state
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });
  
  // Active tabs on mobile
  const [mobileTab, setMobileTab] = useState<'jobs' | 'analysis' | 'actions'>('analysis');

  // Filter dropdown state
  const [showFilterDropdown, setShowFilterDropdown] = useState<'location' | 'seniority' | 'industry' | null>(null);

  const backendUrl = 'http://localhost:5000/api';

  // SSE setup for real-time history sync
  useEffect(() => {
    const eventSource = new EventSource(`${backendUrl}/history`);

    eventSource.onmessage = (event) => {
      try {
        const updatedHistory = JSON.parse(event.data);
        console.log("Real-time History Sync:", updatedHistory);
      } catch (err) {
        console.error("Error parsing real-time history payload:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE stream connection issue, attempting automatic reconnect...", err);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Show Toast Helper
  const triggerToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Toggle Save Job handler
  const handleToggleSave = (jobId: string) => {
    const isSaved = savedJobs.includes(jobId);
    if (isSaved) {
      setSavedJobs(prev => prev.filter(id => id !== jobId));
      triggerToast("Job removed from saved list");
    } else {
      setSavedJobs(prev => [...prev, jobId]);
      triggerToast("Job saved successfully!");
    }
  };

  // Copy Link handler
  const handleCopyLink = (job: JobMatch) => {
    const mockUrl = `https://resumeiq.co/jobs/${job.id}`;
    navigator.clipboard.writeText(mockUrl);
    triggerToast(`Link copied for ${job.title} at ${job.company}`);
  };

  // Auto Match handler
  const handleToggleAutoMatch = () => {
    const newState = !autoMatch;
    setAutoMatch(newState);
    triggerToast(newState ? "AI auto-matching active" : "Auto-match disabled");
  };

  // Recommended Action Click Handler
  const handleActionClick = (type: 'summary' | 'bullets' | 'keywords' | 'ats' | 'cover') => {
    setActiveSheet({ type, loading: true });
    // Simulate 1s loading state
    setTimeout(() => {
      setActiveSheet({ type, loading: false });
    }, 1000);
  };

  // File Upload helper
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResumeText(''); 
    }
  };

  // Run Custom Job Analysis Form
  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !resumeText) {
      setError('Please upload a resume PDF or paste your plain text.');
      return;
    }
    if (!jobDescription) {
      setError('Target Job Description is required.');
      return;
    }

    setError('');
    setLoading(true);
    setAnalysisProgress(15);
    
    // Smooth progress simulation
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 300);

    try {
      const formData = new FormData();
      if (file) {
        formData.append('resumeFile', file);
      } else {
        formData.append('resumeText', resumeText);
      }
      formData.append('jobDescription', jobDescription);

      const res = await fetch(`${backendUrl}/analyze`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Server error occurred during matching.');
      }

      const data = await res.json();
      setAnalysisProgress(100);

      // Create new job dynamically
      const cleanTitle = jobDescription.split('\n')[0]?.substring(0, 30) || "Custom Analyzed Role";
      const newJob: JobMatch = {
        id: `custom-${Date.now()}`,
        title: cleanTitle.replace(/[#*_-]/g, '').trim(),
        company: "My Uploaded JD",
        location: "Self-Analysis",
        experienceLevel: "Evaluated Match",
        matchScore: data.matchPercentage,
        skills: data.strengths?.slice(0, 3) || ["Analyzed Core"],
        metrics: {
          skills: data.matchPercentage + 5 > 100 ? 100 : data.matchPercentage + 5,
          experience: data.matchPercentage - 10 < 0 ? 0 : data.matchPercentage - 10,
          projects: data.matchPercentage + 2 > 100 ? 100 : data.matchPercentage + 2,
          keywords: data.matchPercentage - 5 < 0 ? 0 : data.matchPercentage - 5,
          ats: data.matchPercentage + 4 > 100 ? 100 : data.matchPercentage + 4,
        },
        strengths: data.strengths || [],
        matchedSkills: data.strengths || [],
        missingSkills: data.missingKeywords || [],
        evidence: (data.strengths || []).map((s: string, i: number) => ({
          id: `ev-cust-${i}`,
          text: `Strength identified: "${s}"`,
          source: "resume",
          matchedKeywords: s.split(' ')
        })),
        verdict: data.verdict || "Analysis completed.",
        tailoredResumeBullets: data.tailoredResumeBullets || []
      };

      setJobs(prev => [newJob, ...prev]);
      setSelectedJob(newJob);
      setModalOpen(false);
      triggerToast(`Analysis completed! Match score: ${data.matchPercentage}%`);

      // Clean up form
      setFile(null);
      setResumeText('');
      setJobDescription('');
    } catch (err: any) {
      setError(err.message || 'Connecting to backend service failed.');
    } finally {
      clearInterval(interval);
      setLoading(false);
      setAnalysisProgress(0);
    }
  };

  // Filtering Job matches
  const filteredJobs = jobs.filter(job => {
    // 1. Text Search Filter
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Dropdown Category Filters
    const matchesLocation = 
      !activeFilters.location || 
      job.location.toLowerCase() === activeFilters.location.toLowerCase() ||
      (activeFilters.location === 'Remote' && job.location.toLowerCase().includes('remote'));

    const matchesSeniority = 
      !activeFilters.seniority || 
      job.experienceLevel.toLowerCase() === activeFilters.seniority.toLowerCase() ||
      (activeFilters.seniority === 'Entry Level' && (job.experienceLevel.toLowerCase() === 'fresher' || job.experienceLevel.toLowerCase() === 'junior' || job.experienceLevel.toLowerCase() === '0–1 years'));

    const matchesIndustry = 
      !activeFilters.industry || 
      (activeFilters.industry === 'Software' && (job.title.toLowerCase().includes('developer') || job.title.toLowerCase().includes('engineer'))) ||
      (activeFilters.industry === 'AI' && job.title.toLowerCase().includes('ai'));

    return matchesSearch && matchesLocation && matchesSeniority && matchesIndustry;
  });

  return (
    <div className="h-screen flex flex-col bg-[#F8F8FC] text-[#18181B] font-sans antialiased overflow-hidden selection:bg-[#F0EEFF] selection:text-[#5B4FF5]">
      
      {/* ==========================================
          1. TOP NAVIGATION HEADER
          ========================================== */}
      <header className="h-16 bg-white border-b border-[#E9E9F0] px-6 flex items-center justify-between z-40 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-[#5B4FF5] rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-base font-extrabold tracking-tight text-[#18181B]">ResumeIQ</span>
            <span className="text-[10px] font-black px-1.5 py-0.5 bg-[#F0EEFF] border border-[#E9E9F0] rounded-md text-[#5B4FF5]">
              AI
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#71717A] font-semibold">Analyzed sources:</span>
            <span className="text-xs font-bold px-2.5 py-1 bg-[#F0EEFF] text-[#5B4FF5] rounded-full border border-indigo-100">
              Resume
            </span>
            <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
              Job Description
            </span>
          </div>
          <span className="text-[#A1A1AA] text-xs">|</span>
          <span className="text-xs text-[#71717A] font-medium flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-[#16A34A] rounded-full"></span>
            Last analyzed: 2m ago
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            aria-label="Notifications"
            className="h-9 w-9 border border-[#E9E9F0] hover:border-indigo-300 hover:bg-[#F0EEFF] text-[#71717A] hover:text-[#5B4FF5] rounded-full flex items-center justify-center transition cursor-pointer relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#EF4444] rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-2 border-l border-[#E9E9F0] pl-4">
            <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-black shadow-inner">
              M
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-extrabold text-[#18181B]">Mehul</div>
              <div className="text-[10px] text-[#71717A] font-medium leading-none">Developer</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#71717A] cursor-pointer" />
          </div>
        </div>
      </header>

      {/* ==========================================
          2. SEARCH AND FILTER TOOLBAR
          ========================================== */}
      <section className="h-16 bg-white border-b border-[#E9E9F0] px-6 flex items-center justify-between z-30 shrink-0 select-none">
        
        {/* Left Toolbar filters */}
        <div className="flex items-center space-x-3 w-full max-w-4xl">
          <div className="relative flex-grow max-w-xs">
            <span className="absolute inset-y-0 left-3 flex items-center text-[#A1A1AA]">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              placeholder="Search roles, companies..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-[#F8F8FC] border border-[#E9E9F0] rounded-xl text-xs placeholder-[#A1A1AA] text-[#18181B] focus:border-[#5B4FF5] focus:bg-white outline-none transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-[#A1A1AA] hover:text-[#71717A]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Location Dropdown Filter */}
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(prev => prev === 'location' ? null : 'location')}
              className={`h-10 px-3.5 border ${activeFilters.location ? 'border-[#5B4FF5] bg-[#F0EEFF] text-[#5B4FF5]' : 'border-[#E9E9F0] bg-white text-[#71717A]'} hover:border-indigo-300 hover:bg-[#F0EEFF]/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer`}
            >
              <span>Location{activeFilters.location ? `: ${activeFilters.location}` : ''}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showFilterDropdown === 'location' && (
              <div className="absolute top-11 left-0 bg-white border border-[#E9E9F0] rounded-xl shadow-xl w-40 z-50 overflow-hidden py-1">
                {['Remote', 'Noida', 'Gurugram', 'Bengaluru'].map(loc => (
                  <button 
                    key={loc}
                    onClick={() => {
                      setActiveFilters(prev => ({ ...prev, location: loc }));
                      setShowFilterDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-[#F0EEFF] hover:text-[#5B4FF5] text-[#71717A] font-semibold"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Seniority Dropdown Filter */}
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(prev => prev === 'seniority' ? null : 'seniority')}
              className={`h-10 px-3.5 border ${activeFilters.seniority ? 'border-[#5B4FF5] bg-[#F0EEFF] text-[#5B4FF5]' : 'border-[#E9E9F0] bg-white text-[#71717A]'} hover:border-indigo-300 hover:bg-[#F0EEFF]/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer`}
            >
              <span>Seniority{activeFilters.seniority ? `: ${activeFilters.seniority}` : ''}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showFilterDropdown === 'seniority' && (
              <div className="absolute top-11 left-0 bg-white border border-[#E9E9F0] rounded-xl shadow-xl w-40 z-50 overflow-hidden py-1">
                {['Fresher', 'Junior', 'Mid', 'Senior', 'Entry Level', 'Internship'].map(sen => (
                  <button 
                    key={sen}
                    onClick={() => {
                      setActiveFilters(prev => ({ ...prev, seniority: sen }));
                      setShowFilterDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-[#F0EEFF] hover:text-[#5B4FF5] text-[#71717A] font-semibold"
                  >
                    {sen}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Industry Filter */}
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(prev => prev === 'industry' ? null : 'industry')}
              className={`h-10 px-3.5 border ${activeFilters.industry ? 'border-[#5B4FF5] bg-[#F0EEFF] text-[#5B4FF5]' : 'border-[#E9E9F0] bg-white text-[#71717A]'} hover:border-indigo-300 hover:bg-[#F0EEFF]/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer`}
            >
              <span>Industry{activeFilters.industry ? `: ${activeFilters.industry}` : ''}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showFilterDropdown === 'industry' && (
              <div className="absolute top-11 left-0 bg-white border border-[#E9E9F0] rounded-xl shadow-xl w-40 z-50 overflow-hidden py-1">
                {['Software', 'AI'].map(ind => (
                  <button 
                    key={ind}
                    onClick={() => {
                      setActiveFilters(prev => ({ ...prev, industry: ind }));
                      setShowFilterDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-[#F0EEFF] hover:text-[#5B4FF5] text-[#71717A] font-semibold"
                  >
                    {ind}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear Active Filters Pills */}
          <div className="hidden lg:flex items-center space-x-2">
            {activeFilters.location && (
              <span className="flex items-center gap-1 text-[10px] font-extrabold bg-[#F0EEFF] text-[#5B4FF5] border border-indigo-100 rounded-lg px-2 py-1 shadow-sm">
                <span>{activeFilters.location}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setActiveFilters(prev => ({ ...prev, location: null }))} />
              </span>
            )}
            {activeFilters.seniority && (
              <span className="flex items-center gap-1 text-[10px] font-extrabold bg-[#F0EEFF] text-[#5B4FF5] border border-indigo-100 rounded-lg px-2 py-1 shadow-sm">
                <span>{activeFilters.seniority}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setActiveFilters(prev => ({ ...prev, seniority: null }))} />
              </span>
            )}
            {activeFilters.industry && (
              <span className="flex items-center gap-1 text-[10px] font-extrabold bg-[#F0EEFF] text-[#5B4FF5] border border-indigo-100 rounded-lg px-2 py-1 shadow-sm">
                <span>{activeFilters.industry}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setActiveFilters(prev => ({ ...prev, industry: null }))} />
              </span>
            )}
          </div>
        </div>

        {/* Right Toolbar Auto-match toggle & New Analysis trigger */}
        <div className="flex items-center space-x-4 shrink-0">
          <div className="hidden md:flex items-center space-x-3 border-r border-[#E9E9F0] pr-4">
            <div className="text-right">
              <div className="text-xs font-bold text-[#18181B] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#5B4FF5]" />
                Auto-match
              </div>
              <div className="text-[10px] text-[#71717A] leading-none">Auto-rank jobs by profile</div>
            </div>
            <button 
              onClick={handleToggleAutoMatch}
              className={`h-5 w-9 rounded-full transition-colors relative cursor-pointer outline-none flex items-center ${autoMatch ? 'bg-[#5B4FF5]' : 'bg-slate-300'}`}
            >
              <span className={`absolute h-4 w-4 bg-white rounded-full transition-transform left-0.5 ${autoMatch ? 'translate-x-4' : 'translate-x-0'}`}></span>
            </button>
          </div>

          <button 
            onClick={() => setModalOpen(true)}
            className="h-10 px-4 bg-[#5B4FF5] hover:bg-[#4938E8] text-white font-bold text-xs tracking-wide rounded-xl flex items-center gap-1.5 transition shadow-md shadow-indigo-150 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            New Match
          </button>
        </div>
      </section>

      {/* ==========================================
          MOBILE TABS BAR (lg:hidden)
          ========================================== */}
      <div className="lg:hidden h-12 bg-white border-b border-[#E9E9F0] flex items-center justify-around z-20 shrink-0">
        <button 
          onClick={() => setMobileTab('jobs')}
          className={`h-full text-xs font-bold px-4 border-b-2 transition ${mobileTab === 'jobs' ? 'border-[#5B4FF5] text-[#5B4FF5]' : 'border-transparent text-[#71717A]'}`}
        >
          Jobs ({filteredJobs.length})
        </button>
        <button 
          onClick={() => setMobileTab('analysis')}
          className={`h-full text-xs font-bold px-4 border-b-2 transition ${mobileTab === 'analysis' ? 'border-[#5B4FF5] text-[#5B4FF5]' : 'border-transparent text-[#71717A]'}`}
        >
          Analysis
        </button>
        <button 
          onClick={() => setMobileTab('actions')}
          className={`h-full text-xs font-bold px-4 border-b-2 transition ${mobileTab === 'actions' ? 'border-[#5B4FF5] text-[#5B4FF5]' : 'border-transparent text-[#71717A]'}`}
        >
          Actions & Evidence
        </button>
      </div>

      {/* ==========================================
          MAIN THREE-COLUMN LAYOUT
          ========================================== */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* ==========================================
            3. LEFT SIDEBAR — JOB MATCH LIST
            ========================================== */}
        <aside className={`${mobileTab === 'jobs' ? 'flex' : 'hidden lg:flex'} w-full lg:w-[28%] border-r border-[#E9E9F0] bg-white flex-col h-full overflow-hidden shrink-0`}>
          <div className="p-4 border-b border-[#E9E9F0] flex items-center justify-between shrink-0 select-none">
            <span className="text-xs font-black uppercase tracking-wider text-[#71717A]">
              Matched Jobs ({filteredJobs.length})
            </span>
            <div className="flex items-center space-x-1 text-xs text-[#5B4FF5] font-bold cursor-pointer hover:underline">
              <span>Best match</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 h-full scrollbar-thin select-none">
            {filteredJobs.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-center">
                <AlertTriangle className="w-8 h-8 text-[#A1A1AA] mb-2" />
                <p className="text-xs font-semibold text-[#71717A]">No matching roles found.</p>
                <p className="text-[10px] text-[#A1A1AA] mt-0.5">Try widening search keywords or filters.</p>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isSelected = selectedJob.id === job.id;
                return (
                  <div
                    key={job.id}
                    onClick={() => {
                      setSelectedJob(job);
                      setMobileTab('analysis');
                    }}
                    className={`p-4 border rounded-2xl cursor-pointer transition relative hover:shadow-md hover:shadow-indigo-50/50 group ${
                      isSelected 
                        ? 'border-[#5B4FF5] bg-[#F0EEFF]/55' 
                        : 'border-[#E9E9F0] bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-[#18181B] truncate group-hover:text-[#5B4FF5] transition">
                          {job.title}
                        </div>
                        <div className="text-[11px] text-[#71717A] font-semibold mt-0.5">
                          {job.company} • {job.location}
                        </div>
                        <div className="text-[10px] text-[#A1A1AA] font-semibold mt-1">
                          Experience: {job.experienceLevel}
                        </div>
                      </div>
                      <div className="shrink-0">
                        <CompactScoreRing score={job.matchScore} />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {job.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-2 py-0.5 text-[9px] font-extrabold bg-[#F8F8FC] border border-[#E9E9F0] rounded-full text-[#71717A]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* ==========================================
            4. MAIN CONTENT WORKSPACE
            ========================================== */}
        <section className={`${mobileTab === 'analysis' ? 'block' : 'hidden lg:block'} flex-1 bg-[#F8F8FC] h-full overflow-y-auto p-6 scrollbar-thin`}>
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header info area */}
            <div className="bg-white border border-[#E9E9F0] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm select-none">
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-[#18181B] leading-tight">
                  {selectedJob.title}
                </h1>
                <div className="flex items-center space-x-2 text-xs font-semibold text-[#71717A] mt-1.5">
                  <span className="text-[#5B4FF5]">{selectedJob.company}</span>
                  <span>•</span>
                  <span>{selectedJob.location}</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px]">
                    {selectedJob.experienceLevel}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-start md:self-center shrink-0">
                <button 
                  onClick={() => handleCopyLink(selectedJob)}
                  className="h-10 px-4 border border-[#E9E9F0] hover:border-indigo-300 hover:bg-[#F0EEFF] text-[#71717A] hover:text-[#5B4FF5] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Link
                </button>
                <button 
                  onClick={() => handleToggleSave(selectedJob.id)}
                  className={`h-10 px-4 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                    savedJobs.includes(selectedJob.id)
                      ? 'bg-[#F0EEFF] text-[#5B4FF5] border border-indigo-200'
                      : 'bg-[#5B4FF5] hover:bg-[#4938E8] text-white'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${savedJobs.includes(selectedJob.id) ? 'fill-[#5B4FF5]' : ''}`} />
                  {savedJobs.includes(selectedJob.id) ? 'Saved' : 'Save Job'}
                </button>
              </div>
            </div>

            {/* Match Score Card section */}
            <div className="bg-white border border-[#E9E9F0] p-6 rounded-2xl shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#71717A] mb-4">
                Match Score
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Left ring visualization */}
                <div className="md:col-span-4 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#E9E9F0] pb-6 md:pb-0 pr-0 md:pr-6 select-none">
                  <ScoreRing score={selectedJob.matchScore} size={135} label="Overall Match" />
                </div>

                {/* Middle Score categories */}
                <div className="md:col-span-5 space-y-3.5 select-none">
                  <MetricRow name="Skills Match" score={selectedJob.metrics.skills} />
                  <MetricRow name="Experience Match" score={selectedJob.metrics.experience} />
                  <MetricRow name="Project Relevance" score={selectedJob.metrics.projects} />
                  <MetricRow name="Keyword Match" score={selectedJob.metrics.keywords} />
                  <MetricRow name="ATS Compatibility" score={selectedJob.metrics.ats} />
                </div>

                {/* Right confidence panel */}
                <div className="md:col-span-3 flex flex-col justify-center items-center md:items-start text-center md:text-left bg-[#F8F8FC] border border-[#E9E9F0] p-4 rounded-xl">
                  <span className="text-[10px] text-[#71717A] font-black uppercase tracking-wider">
                    AI Confidence
                  </span>
                  <span className="text-base font-extrabold text-[#16A34A] mt-1 flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-[#16A34A] rounded-full animate-ping"></span>
                    High (94%)
                  </span>
                  <p className="text-[10px] text-[#71717A] mt-2 leading-relaxed">
                    Evaluated metrics correlate perfectly with key semantic embeddings.
                  </p>
                </div>
              </div>

              {/* AI generated summary text */}
              <div className="mt-6 pt-5 border-t border-[#E9E9F0] text-xs leading-relaxed text-[#71717A]">
                <span className="font-extrabold text-[#18181B] block mb-1">AI Match Summary</span>
                <p>{selectedJob.verdict}</p>
              </div>
            </div>

            {/* Strengths checklist section */}
            <div className="bg-white border border-[#E9E9F0] p-6 rounded-2xl shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#71717A] mb-4">
                Strengths for this role
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedJob.strengths.map((str, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-1">
                    <span className="h-5 w-5 rounded-full bg-[#F0EEFF] text-[#5B4FF5] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#18181B] leading-tight">
                        {str}
                      </p>
                      <button 
                        onClick={() => handleActionClick('summary')}
                        className="text-[10px] text-[#5B4FF5] hover:underline font-bold mt-0.5"
                      >
                        View evidence →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill gap analysis section */}
            <div className="bg-white border border-[#E9E9F0] p-6 rounded-2xl shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#71717A] mb-4">
                Skill Gap Analysis
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-[#E9E9F0]">
                {/* Matched skills */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#16A34A] flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    Matched Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.matchedSkills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 font-bold text-xs rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing skills */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Missing / Weak Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.missingSkills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress calculation */}
              <div className="pt-4 flex items-center justify-between text-xs font-semibold text-[#71717A] select-none">
                <span>Your resume matches {selectedJob.matchedSkills.length} of {selectedJob.matchedSkills.length + selectedJob.missingSkills.length} core technical skills.</span>
                <span className="font-extrabold text-[#18181B]">
                  {Math.round((selectedJob.matchedSkills.length / (selectedJob.matchedSkills.length + selectedJob.missingSkills.length)) * 100)}%
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* ==========================================
            5. RIGHT SIDEBAR — ACTIONS & EVIDENCE
            ========================================== */}
        <aside className={`${mobileTab === 'actions' ? 'flex' : 'hidden lg:flex'} w-full lg:w-[27%] border-l border-[#E9E9F0] bg-white flex-col h-full overflow-y-auto p-4 shrink-0 scrollbar-thin`}>
          <div className="space-y-6">
            
            {/* Recommended actions list */}
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#71717A] mb-3 select-none">
                Recommended Actions
              </h2>
              <div className="space-y-2">
                {[
                  { type: 'summary' as const, label: 'Generate Tailored Summary', isRec: true },
                  { type: 'bullets' as const, label: 'Rewrite Resume Bullets', isRec: false },
                  { type: 'keywords' as const, label: 'Add Missing Keywords', isRec: false },
                  { type: 'ats' as const, label: 'Improve ATS Score', isRec: false },
                  { type: 'cover' as const, label: 'Generate Cover Letter', isRec: false }
                ].map((act, index) => (
                  <button
                    key={index}
                    onClick={() => handleActionClick(act.type)}
                    className="w-full text-left px-3.5 h-12 bg-white border border-[#E9E9F0] hover:border-indigo-300 hover:bg-[#F0EEFF] text-[#18181B] hover:text-[#5B4FF5] rounded-xl text-xs font-bold flex items-center justify-between group transition cursor-pointer select-none"
                  >
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 opacity-70 group-hover:scale-110 transition" />
                      <span>{act.label}</span>
                      {act.isRec && (
                        <span className="text-[9px] font-black uppercase bg-[#F0EEFF] text-[#5B4FF5] px-1.5 py-0.5 rounded border border-indigo-100 leading-none">
                          Rec
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition" />
                  </button>
                ))}
              </div>
            </div>

            {/* Evidence viewer */}
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#71717A] mb-3 select-none">
                Evidence Viewer
              </h2>
              <div className="space-y-3">
                {selectedJob.evidence.map((ev) => (
                  <div key={ev.id} className="p-4 bg-[#F8F8FC] border border-[#E9E9F0] rounded-xl relative space-y-2 group">
                    <Quote className="w-8 h-8 text-indigo-100 absolute -top-1.5 right-2" />
                    
                    <p className="text-xs font-medium text-[#71717A] leading-relaxed relative z-10">
                      "{ev.text}"
                    </p>

                    <div className="flex items-center justify-between relative z-10 select-none">
                      <span className="text-[9px] font-black uppercase bg-[#F0EEFF] text-[#5B4FF5] px-1.5 py-0.5 rounded border border-indigo-100 leading-none">
                        {ev.source}
                      </span>
                      <div className="flex gap-1">
                        {ev.matchedKeywords.slice(0, 2).map((kw, i) => (
                          <span key={i} className="text-[9px] font-bold bg-[#E9E9F0] text-[#71717A] px-1.5 py-0.5 rounded leading-none">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insight card */}
            <div className="p-4 bg-[#F0EEFF] border border-indigo-100 rounded-xl space-y-2.5">
              <div className="flex items-center space-x-2 text-[#5B4FF5]">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-wider">AI Insight</span>
              </div>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Adding measurable project impact and containerization details could increase your match score from {selectedJob.matchScore} to {selectedJob.matchScore + 5 > 100 ? 100 : selectedJob.matchScore + 5}.
              </p>
              <button 
                onClick={() => handleActionClick('ats')}
                className="w-full text-center py-2 bg-[#5B4FF5] hover:bg-[#4938E8] text-white text-xs font-bold rounded-lg transition shadow-md shadow-indigo-100 cursor-pointer"
              >
                View improvement plan
              </button>
            </div>

          </div>
        </aside>
      </main>

      {/* ==========================================
          SLIDE-OVER SHEET (Recommended Actions details)
          ========================================== */}
      {activeSheet.type !== null && (
        <div className="fixed inset-0 z-50 bg-[#18181B]/40 backdrop-blur-xs flex justify-end animate-fadeIn">
          {/* Backdrop Click */}
          <div className="flex-1" onClick={() => setActiveSheet({ type: null, loading: false })}></div>
          
          {/* Main Slide Panel */}
          <div className="w-full max-w-lg bg-white border-l border-[#E9E9F0] h-full shadow-2xl flex flex-col p-6 animate-slideLeft overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#E9E9F0] pb-4 mb-6 shrink-0 select-none">
              <div className="flex items-center space-x-2 text-[#5B4FF5]">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-[#18181B]">
                  {activeSheet.type === 'summary' && 'AI Tailored Summary'}
                  {activeSheet.type === 'bullets' && 'CV Bullet Optimizations'}
                  {activeSheet.type === 'keywords' && 'Missing Keywords Injector'}
                  {activeSheet.type === 'ats' && 'ATS Score Blueprint'}
                  {activeSheet.type === 'cover' && 'AI Generated Cover Letter'}
                </h3>
              </div>
              <button 
                onClick={() => setActiveSheet({ type: null, loading: false })}
                className="h-8 w-8 rounded-full border border-[#E9E9F0] hover:bg-slate-50 flex items-center justify-center text-[#71717A] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content box */}
            <div className="flex-grow overflow-y-auto pr-1">
              {activeSheet.loading ? (
                // Skeleton loading state
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                  <div className="h-24 bg-slate-50 rounded-xl"></div>
                  <div className="h-32 bg-slate-50 rounded-xl"></div>
                </div>
              ) : (
                <div className="space-y-5 text-xs text-[#71717A] leading-relaxed">
                  {/* Summary */}
                  {activeSheet.type === 'summary' && (
                    <div className="space-y-4">
                      <p>Here is an AI-generated executive summary tailored for matching Mehul's resume to the <strong>{selectedJob.title}</strong> role at <strong>{selectedJob.company}</strong>.</p>
                      <div className="bg-[#F0EEFF] border border-indigo-100 p-4 rounded-xl text-[#18181B] font-medium leading-relaxed">
                        "Mehul demonstrates strong alignment with the MERN stack technical stack, having deployed microservice planner architectures backed by Redis caching. However, the candidate needs to highlight Docker workflow deployments and AWS infrastructure scaling to better align with the core requirements of this role."
                      </div>
                      <div className="p-4 bg-white border border-[#E9E9F0] rounded-xl flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-[#5B4FF5] shrink-0 mt-0.5" />
                        <p className="text-[11px]">Use this summary as an introduction or pitch statement when applying to showcase immediate technological compatibility.</p>
                      </div>
                    </div>
                  )}

                  {/* Bullet Optimizations */}
                  {activeSheet.type === 'bullets' && (
                    <div className="space-y-4">
                      <p>Rewrite your current resume experience bullets to include metric-driven highlights that match this specific role description:</p>
                      
                      <div className="space-y-3">
                        {selectedJob.tailoredResumeBullets.map((bullet, idx) => (
                          <div key={idx} className="border border-[#E9E9F0] rounded-xl overflow-hidden shadow-sm bg-white">
                            <div className="bg-slate-50 border-b border-[#E9E9F0] px-4 py-2 text-[10px] font-black uppercase text-[#71717A] tracking-wider select-none">
                              Suggested Optimization {idx + 1}
                            </div>
                            <div className="p-4 space-y-2">
                              <div className="text-[#A1A1AA] line-through text-[11px]">
                                {idx === 0 && "• Deployed server-side REST APIs using Node.js and Express."}
                                {idx === 1 && "• Used Redis caching fallbacks to save costs for APIs."}
                                {idx === 2 && "• Deployed testing servers on AWS hosting configurations."}
                              </div>
                              <div className="text-[#5B4FF5] font-semibold text-[12px] bg-[#F0EEFF]/40 border border-indigo-50/50 p-2.5 rounded-lg select-all font-mono">
                                "{bullet}"
                              </div>
                              <div className="flex items-center justify-between select-none">
                                <span className="text-[10px] text-green-600 font-bold">Estimated score increase: +3%</span>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(bullet);
                                    triggerToast("Bullet copied to clipboard!");
                                  }}
                                  className="text-[10px] text-[#5B4FF5] font-extrabold hover:underline flex items-center gap-1"
                                >
                                  <Copy className="w-3 h-3" /> Copy
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Keywords */}
                  {activeSheet.type === 'keywords' && (
                    <div className="space-y-4">
                      <p>Insert these semantic keywords into your resume's Skills or Project sections to improve parsing alignment:</p>
                      
                      <div className="p-4 bg-[#F8F8FC] border border-[#E9E9F0] rounded-xl space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.missingSkills.map((kw, i) => (
                            <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E9E9F0] rounded-lg shadow-sm">
                              <span className="h-2 w-2 bg-amber-500 rounded-full"></span>
                              <span className="font-extrabold text-[#18181B] text-xs">{kw}</span>
                            </div>
                          ))}
                        </div>

                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(selectedJob.missingSkills.join(', '));
                            triggerToast("Keywords copied!");
                          }}
                          className="w-full py-2 bg-white border border-[#E9E9F0] hover:border-indigo-300 hover:text-[#5B4FF5] font-bold text-xs rounded-lg transition"
                        >
                          Copy All Keywords
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Improve ATS Score */}
                  {activeSheet.type === 'ats' && (
                    <div className="space-y-4 select-none">
                      <p>Follow this checklist step-by-step to optimize your resume and achieve a match score above 90%:</p>
                      
                      <div className="space-y-3">
                        {[
                          { title: 'Add specific business metric impacts', desc: 'Describe how containerization optimized server usage or decreased latencies (e.g. 40% response latency reduction).', score: '+4%' },
                          { title: 'Highlight message queue architectures', desc: 'Mention BullMQ workflows explicitly when describing backend caching setups to demonstrate background worker exposure.', score: '+3%' },
                          { title: 'Include AWS service configurations', desc: 'Clarify deployment mechanics by specifying EC2, S3, or Nginx configurations on your cloud setup.', score: '+3%' }
                        ].map((item, i) => (
                          <div key={i} className="p-4 border border-[#E9E9F0] hover:border-indigo-200 rounded-xl bg-white flex gap-3">
                            <div className="h-5 w-5 bg-indigo-50 border border-indigo-150 rounded-full flex items-center justify-center text-[#5B4FF5] text-[10px] font-black shrink-0 mt-0.5">
                              {i+1}
                            </div>
                            <div className="flex-1 space-y-1">
                              <h4 className="font-bold text-[#18181B] text-xs leading-none">{item.title}</h4>
                              <p className="text-[11px] text-[#71717A]">{item.desc}</p>
                              <span className="inline-block text-[10px] text-green-600 font-extrabold bg-green-50 px-2 py-0.5 rounded mt-1">{item.score} Match</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cover Letter */}
                  {activeSheet.type === 'cover' && (
                    <div className="space-y-4">
                      <p>Generate a professional, AI-tailored cover letter based on this role and your aligned experience:</p>
                      
                      <div className="border border-[#E9E9F0] rounded-xl overflow-hidden shadow-sm bg-white select-all">
                        <div className="bg-slate-50 border-b border-[#E9E9F0] px-4 py-2.5 text-[10px] font-black uppercase text-[#71717A] tracking-wider select-none flex justify-between items-center">
                          <span>AI Cover Letter Draft</span>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText("AI Cover Letter text...");
                              triggerToast("Cover letter copied!");
                            }}
                            className="text-[#5B4FF5] font-extrabold hover:underline"
                          >
                            Copy Draft
                          </button>
                        </div>
                        <div className="p-4 text-[11px] font-mono text-slate-700 space-y-3 leading-relaxed">
                          <p>Dear Hiring Manager at {selectedJob.company},</p>
                          <p>I am writing to express my strong interest in the {selectedJob.title} position. With my background in MERN stack development, I am confident in my ability to build production-grade web solutions for your team.</p>
                          <p>During my projects, I designed microservices utilizing Redis queues to maximize backend API speeds, aligning perfectly with the core framework requirements described in your job posting. I look forward to discussing how my experience can benefit {selectedJob.company}.</p>
                          <p>Sincerely,<br />Mehul</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL DIALOG (New Job / Resume analysis upload)
          ========================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#18181B]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={() => !loading && setModalOpen(false)}></div>
          
          {/* Modal Container */}
          <div className="w-full max-w-xl bg-white border border-[#E9E9F0] rounded-2xl shadow-2xl relative z-10 flex flex-col p-6 animate-scaleUp overflow-hidden max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#E9E9F0] pb-4 mb-5 shrink-0 select-none">
              <div className="flex items-center space-x-2 text-[#5B4FF5]">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-[#18181B]">Run New AI Resume Match</h3>
              </div>
              <button 
                onClick={() => !loading && setModalOpen(false)}
                className="h-8 w-8 rounded-full border border-[#E9E9F0] hover:bg-slate-50 flex items-center justify-center text-[#71717A] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              // Analysis loading state
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-pulse select-none">
                <div className="h-16 w-16 bg-[#F0EEFF] rounded-full flex items-center justify-center text-[#5B4FF5]">
                  <Sparkles className="w-8 h-8 animate-spin" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-[#18181B]">Analyzing your resume against this job...</h4>
                  <p className="text-xs text-[#71717A] max-w-xs">Comparing skills, experience metrics, projects, and key ATS keywords</p>
                </div>
                <div className="w-64 h-2 bg-[#E9E9F0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#5B4FF5] rounded-full transition-all duration-300" style={{ width: `${analysisProgress}%` }}></div>
                </div>
                <span className="text-[10px] font-bold text-[#5B4FF5] tracking-wider uppercase font-mono">{analysisProgress}% Complete</span>
              </div>
            ) : (
              // Upload Form
              <form onSubmit={handleRunAnalysis} className="space-y-4 overflow-y-auto pr-1">
                
                {/* File upload PDF */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#71717A] mb-1.5">
                    Upload Resume PDF
                  </label>
                  <div className="relative border-2 border-dashed border-[#E9E9F0] hover:border-[#5B4FF5] rounded-xl p-4 transition bg-[#F8F8FC] text-center flex flex-col items-center justify-center cursor-pointer select-none">
                    <input 
                      type="file" 
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                    <Upload className="w-6 h-6 text-[#71717A] mb-2" />
                    <p className="text-xs text-[#71717A] font-semibold">
                      {file ? `Bound: ${file.name}` : 'Drop PDF file or click here to upload'}
                    </p>
                    <p className="text-[10px] text-[#A1A1AA] mt-0.5">Maximum size: 5MB</p>
                  </div>
                </div>

                <div className="relative flex py-1 items-center select-none">
                  <div className="flex-grow border-t border-[#E9E9F0]"></div>
                  <span className="flex-shrink mx-3 text-[10px] uppercase font-black text-[#A1A1AA] tracking-widest">OR PASTE TEXT</span>
                  <div className="flex-grow border-t border-[#E9E9F0]"></div>
                </div>

                {/* Paste resume text */}
                <div>
                  <textarea
                    value={resumeText}
                    disabled={!!file}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder={file ? "Using uploaded PDF file properties..." : "Paste resume plain text experience data..."}
                    className="w-full h-24 p-3 rounded-xl bg-white border border-[#E9E9F0] focus:border-[#5B4FF5] outline-none transition text-xs font-mono disabled:opacity-40 resize-none"
                  />
                </div>

                {/* Target JD */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#71717A] mb-1.5">
                    Target Job Description (JD)
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste job description core expectations, languages, databases..."
                    className="w-full h-28 p-3 rounded-xl bg-white border border-[#E9E9F0] focus:border-[#5B4FF5] outline-none transition text-xs font-mono resize-none"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 select-none">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-11 bg-[#5B4FF5] hover:bg-[#4938E8] text-white font-extrabold text-xs tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Run Match analysis
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          TOAST NOTIFICATION TRIGGER
          ========================================== */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#18181B] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-slideUp text-xs font-semibold select-none border border-slate-800">
          <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
}