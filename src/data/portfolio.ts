import heroImg from '../assets/hero.png';
import labflowImg from '../assets/labflow.jpeg';
import fbrImg from '../assets/fbr-integrated-invoicing-system.jpeg';
import fundoraImg from '../assets/fundoraglobal.jpg';
import examcraftImg from '../assets/examcraft-pro.jpeg';
import neuroscanImg from '../assets/neuroscan-ai.jpeg';
import edgenexusImg from '../assets/edgenexus-it.jpeg';
import dsImg from '../assets/ds-visualizer.jpeg';
import achievementImg from '../assets/achievement-codexcellence.jpeg';

export interface ProjectItem {
  id: string;
  name: string;
  cat: string;
  year?: string;
  outcome: string;
  blurb: string;
  stack: string;
  link: string;
  image: string | null;
  initials: string;
}

export interface ExperienceItem {
  num: string;
  title: string;
  desc: string;
}

export interface PrincipleItem {
  num: string;
  title: string;
  desc: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface SocialLink {
  name: string;
  url: string;
}

export interface PortfolioData {
  personal: {
    name: string;
    firstName: string;
    lastName: string;
    initials: string;
    role: string;
    heroDesc: string;
    heroImage: string;
    heroImageAlt: string;
    email: string;
    location: string;
    tagline: string;
    copyright: string;
  };
  flowExplorer: {
    badge: string;
    eyebrow: string;
    title: string;
    description: string;
    tagline: string;
    moneyNote: string;
    ctaText: string;
    steps: {
      step: number;
      title: string;
      desc: string;
      stack: string[];
    }[];
  };
  story: {
    eyebrow: string;
    heading: string[];
    lead: string;
    principles: PrincipleItem[];
  };
  projects: ProjectItem[];
  achievements: {
    eyebrow: string;
    heading: string;
    title: string;
    caption: string;
    image: string;
    imageAlt: string;
  };
  impact: {
    eyebrow: string;
    heading: string[];
    stats: StatItem[];
  };
  experience: {
    eyebrow: string;
    heading: string;
    entries: ExperienceItem[];
  };
  skills: {
    eyebrow: string;
    sectionHeading: string;
    skillsList: string[];
    learningHeading: string;
    learningList: string[];
  };
  contact: {
    eyebrow: string;
    heading: string[];
    lead: string;
    email: string;
    socials: SocialLink[];
  };
  navLinks: {
    label: string;
    href: string;
  }[];
}

export const portfolioData: PortfolioData = {
  personal: {
    name: 'Muhammad Kamran',
    firstName: 'Muhammad',
    lastName: 'Kamran',
    initials: 'MK',
    role: 'Web & Software Developer',
    heroDesc:
      'I build real software, not demos — FBR-integrated invoicing (Laravel), LabFlow multi-tenant SaaS (Django + React). Open to paid remote internships.',
    heroImage: heroImg,
    heroImageAlt: 'Muhammad Kamran, hero portrait',
    email: 'kamran.debug@gmail.com',
    location: 'Lahore, Pakistan',
    tagline: 'Full-stack developer · Lahore, Pakistan.',
    copyright: '© 2026 Muhammad Kamran. All rights reserved.',
  },
  flowExplorer: {
    badge: 'Interactive System Design Walkthrough',
    eyebrow: 'System Architecture · LabFlow',
    title: 'How I architect production SaaS.',
    description:
      'Patient to report, end to end: Step through the 5-stage production pipeline below to see how LabFlow handles accessioning, validation, pathologist approval, and Celery background report dispatch in real life.',
    tagline: 'Multi-tenant SaaS · Schema-per-tenant',
    moneyNote:
      'Money: payment on a partner invoice creates a PENDING revenue-share ledger row. Monthly settlements are drafted on the 1st at 01:00 Asia/Karachi, with statement PDFs emailed to partners. No partner login in v1.',
    ctaText: 'See LabFlow in Projects',
    steps: [
      {
        step: 1,
        title: 'Patient Registration',
        desc: 'Patient registration, invoice and payment.',
        stack: ['Django', 'DRF', 'React + TypeScript', 'PostgreSQL'],
      },
      {
        step: 2,
        title: 'Sample Collection',
        desc: 'Samples with accession IDs and client-side Code128 barcode labels.',
        stack: ['React + TypeScript', 'PostgreSQL'],
      },
      {
        step: 3,
        title: 'Result Entry',
        desc: 'Technician enters results validated against reference ranges.',
        stack: ['Django', 'DRF', 'React', 'PostgreSQL'],
      },
      {
        step: 4,
        title: 'Pathologist Approval',
        desc: 'Pathologist approves the result before it can be reported.',
        stack: ['Django', 'DRF', 'React'],
      },
      {
        step: 5,
        title: 'PDF Report',
        desc: 'Celery renders a WeasyPrint PDF into object storage. Patient gets a signed report link valid for 7 days, plus a WhatsApp click-to-send URL for staff.',
        stack: ['Celery', 'WeasyPrint', 'Redis'],
      },
    ],
  },
  story: {
    eyebrow: 'About Me',
    heading: ['Building real', 'software, not', 'just demos.'],
    lead:
      "I'm a full-stack developer in Lahore, Pakistan. ADP Computer Science at Riphah International University (GPA 3.61 / 4.00), currently a BSCS 5th Semester Student at NCBA&E University. I'm building LabFlow — a multi-tenant SaaS for diagnostic labs — as my showcase project.",
    principles: [
      {
        num: '01',
        title: 'Build real software',
        desc: 'I like building things that actually ship — LabFlow is my showcase project, not just a tutorial build.',
      },
      {
        num: '02',
        title: 'Use the stack that fits the job',
        desc: 'Laravel and PHP for live work, Django and React for LabFlow, with PostgreSQL, Redis, Docker and CI for the real infrastructure.',
      },
      {
        num: '03',
        title: 'Own the whole flow',
        desc: 'From database and API to UI and deployment, I work end to end and keep CI green.',
      },
      {
        num: '04',
        title: 'Ship, then improve',
        desc: 'LabFlow went from scaffold to tenant models one LAB at a time — I keep CI green, fix what breaks, and improve in small steps.',
      },
    ],
  },
  projects: [
    {
      id: 'labflow',
      name: 'LabFlow',
      cat: 'Featured · Showcase Project · Concept visual',
      year: 'Django · React',
      outcome: 'Showcase Project',
      blurb:
        'Multi-tenant SaaS for diagnostic labs in Pakistan. Patient registration and invoicing, samples with accession IDs, result entry validated against reference ranges, pathologist approval, PDF reports, and partner revenue-share.',
      stack:
        'Django 5 · DRF · React 18 + TypeScript · PostgreSQL 16 · Redis · Celery · Docker · Caddy · GitHub Actions',
      link: 'https://github.com/kamrandebugging/LabFlow',
      image: labflowImg,
      initials: 'LF',
    },
    {
      id: 'fbr-invoicing',
      name: 'FBR-Integrated Invoicing System',
      cat: 'Live Work · Laravel · Dashboard mockup',
      year: 'Live since 2025',
      outcome: 'In production',
      blurb:
        'Full-stack development on a live digital invoicing system integrated with FBR, in production use since 2025.',
      stack: 'Laravel · PHP · MySQL',
      link: '',
      image: fbrImg,
      initials: 'FBR',
    },
    {
      id: 'fundora-global',
      name: 'FundoraGlobal',
      cat: 'Web · Next.js / NestJS',
      year: 'Trading platform',
      outcome: 'Trading Platform',
      blurb:
        'A trading platform covering onboarding, trading adapter, payments and admin dashboard.',
      stack: 'Next.js · NestJS · TypeScript · PostgreSQL · Redis · Socket.IO',
      link: '',
      image: fundoraImg,
      initials: 'FG',
    },
    {
      id: 'examcraft-pro',
      name: 'ExamCraft Pro',
      cat: 'Web · Laravel / Vue',
      year: 'Exam authoring',
      outcome: 'Manual + Auto paper generator',
      blurb:
        'Professional exam paper authoring tool for educators. Manual canvas editor with MCQ, section, text, image, table and divider blocks, plus a 3-step Auto Paper Generator from a question bank to Cambridge-style A4 papers, ready to print or export as PDF.',
      stack: 'Laravel 12 · Vue 3 · MySQL · Pinia · Vite · Bootstrap',
      link: '',
      image: examcraftImg,
      initials: 'EC',
    },
    {
      id: 'neuroscan-ai',
      name: 'NeuroScan AI',
      cat: 'AI · 1st Place',
      year: 'CodeExcellence',
      outcome: '1st Place',
      blurb:
        'Brain-tumour MRI classification, around 94% accuracy. Final-year project, 1st place at CodeExcellence.',
      stack: 'Python · Machine Learning',
      link: '',
      image: neuroscanImg,
      initials: 'NS',
    },
    {
      id: 'edgenexus-it',
      name: 'EdgeNexus IT',
      cat: 'Web · GSAP / Three.js',
      year: 'Enterprise website',
      outcome: 'Animated front-end',
      blurb: 'Enterprise website with animated, interactive front-end work.',
      stack: 'JavaScript · GSAP · Three.js',
      link: '',
      image: edgenexusImg,
      initials: 'EN',
    },
    {
      id: 'ds-visualizer',
      name: 'DS Visualizer',
      cat: 'Data Vis · 1st Place',
      year: 'CodeExcellence',
      outcome: '1st Place',
      blurb: 'Data structures visualizer. 1st place at CodeExcellence.',
      stack: 'JavaScript · Data Structures',
      link: '',
      image: dsImg,
      initials: 'DS',
    },
  ],
  achievements: {
    eyebrow: 'Recognition',
    heading: 'Achievements',
    title: 'CodeXcellence — 1st Position',
    caption:
      'Riphah International College, Harbanspura Campus — Certificate of Achievement presented to Muhammad Kamran, for dedicated efforts and achievement. Date: 17-07-2025. CodeXcellence 1st Position trophy.',
    image: achievementImg,
    imageAlt: 'Riphah CodeXcellence 1st Position certificates and trophy',
  },
  impact: {
    eyebrow: 'By The Numbers',
    heading: ['Measured,', 'not invented.'],
    stats: [
      { value: '1+', label: 'Years production backend experience' },
      { value: '7', label: 'Real projects shipped' },
      { value: '2', label: 'CodeExcellence 1st places' },
      { value: '3.61', label: 'ADP Computer Science GPA / 4.00' },
    ],
  },
  experience: {
    eyebrow: 'Experience',
    heading: "What I've done.",
    entries: [
      {
        num: '01',
        title: 'BSCS Student — NCBA&E — 5th Semester · Present',
        desc: 'Currently studying BSCS (5th semester) at NCBA&E University, Lahore, while building real software.',
      },
      {
        num: '02',
        title: 'Backend Developer — Digital Invoicing Project — 1 year · Remote',
        desc: 'Backend development on a digital invoicing project, worked remotely on ticket-based work.',
      },
      {
        num: '03',
        title: 'Intern — Signal Over Noise (signalovernoise.io) — 3 months · Onsite, Lahore',
        desc: 'Onsite internship at Signal Over Noise (signalovernoise.io), a foreign company, in Lahore, Pakistan.',
      },
    ],
  },
  skills: {
    eyebrow: 'Capabilities',
    sectionHeading: 'Technical Skills and Tools',
    skillsList: [
      'Laravel',
      'PHP',
      'MySQL',
      'HTML',
      'CSS',
      'JavaScript',
      'Git & GitHub',
      'WordPress',
      'Claude Code',
      'Antigravity',
      'Tailwind CSS',
      'React',
      'TypeScript',
      'Django',
      'DRF',
      'PostgreSQL',
      'Redis',
      'Celery',
      'Docker',
      'Caddy',
      'GitHub Actions',
      'Vue 3',
      'Pinia',
      'Vite',
      'Bootstrap',
      'Python',
      'Machine Learning',
      'Data Structures',
      'GSAP',
      'Three.js',
      'Node.js',
      'NestJS',
      'Next.js',
      'Socket.IO',
    ],
    learningHeading: 'Learning next',
    learningList: ['Express.js', 'MongoDB'],
  },
  contact: {
    eyebrow: "Let's Work Together",
    heading: ['Have a paid', 'remote internship', 'in mind?'],
    lead: "That's what I'm looking for next. Email is best — I read every message I'm sent.",
    email: 'kamran.debug@gmail.com',
    socials: [
      { name: 'LinkedIn', url: 'https://linkedin.com/in/kamran-debug' },
      { name: 'GitHub', url: 'https://github.com/kamrandebugging' },
      { name: 'LabFlow Repo', url: 'https://github.com/kamrandebugging/LabFlow' },
    ],
  },
  navLinks: [
    { label: 'Story', href: '#story' },
    { label: 'Projects', href: '#projects' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Impact', href: '#impact' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ],
};
