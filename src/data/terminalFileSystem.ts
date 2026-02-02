// Terminal File System Data
// Matches the existing portfolio data

export interface FileSystemEntry {
  type: 'directory' | 'file';
  name: string;
  content?: string;
  children?: FileSystemEntry[];
}

const aboutMeContent = `# About Me

I build intelligent solutions at the intersection of AI, data engineering, 
and software development.

## Expertise

My expertise lies in RAG-powered applications, machine learning pipelines, 
and designing scalable software architectures that solve real-world problems.

## Passion

I'm passionate about leveraging cutting-edge technology to create 
meaningful impact through clean, efficient, and maintainable code.

---

*Currently working as an AI Data Engineer at Glintt Global, Porto, Portugal.*
`;

const glinttContent = JSON.stringify({
  company: "Glintt Global",
  position: "AI Data Engineer",
  period: "January 2023 - Present",
  location: "Porto, Portugal",
  description: [
    "Developing RAG-powered applications for healthcare document processing",
    "Building and maintaining machine learning pipelines for data extraction",
    "Designing scalable architectures for AI-driven solutions",
    "Implementing LLM integrations with LangChain and custom frameworks"
  ],
  technologies: ["Python", "LangChain", "FastAPI", "Elasticsearch", "Docker", "Azure"]
}, null, 2);

const noniusContent = JSON.stringify({
  company: "Nonius",
  position: "Software Engineer",
  period: "March 2021 - December 2022",
  location: "Porto, Portugal",
  description: [
    "Developed backend services for hospitality technology solutions",
    "Implemented RESTful APIs using Django and FastAPI",
    "Worked with PostgreSQL databases and Redis caching",
    "Collaborated on CI/CD pipelines and deployment automation"
  ],
  technologies: ["Python", "Django", "PostgreSQL", "Redis", "Docker", "Git"]
}, null, 2);

const padraoContent = JSON.stringify({
  company: "Padrão Ortopédico",
  position: "Biomedical Engineer",
  period: "June 2019 - February 2021",
  location: "Porto, Portugal",
  description: [
    "Designed and developed custom orthopedic solutions using CAD software",
    "Implemented 3D printing workflows for prosthetics manufacturing",
    "Conducted quality assurance and testing procedures",
    "Collaborated with medical professionals on patient-specific solutions"
  ],
  technologies: ["Fusion360", "YOLO", "Python", "CAD/CAM"]
}, null, 2);

const mastersContent = JSON.stringify({
  degree: "Master's Degree in Biomedical Engineering",
  institution: "Universidade Católica Portuguesa",
  period: "September 2017 - July 2019",
  location: "Porto, Portugal",
  description: "Thesis focused on machine learning applications in medical imaging and diagnostics.",
  thesis: "Machine Learning Applications in Medical Imaging"
}, null, 2);

const bachelorsContent = JSON.stringify({
  degree: "Bachelor's Degree in Bioengineering",
  institution: "Universidade Católica Portuguesa",
  period: "September 2014 - July 2017",
  location: "Porto, Portugal",
  description: "Foundation in engineering principles applied to biological and medical systems."
}, null, 2);

const speedChampionContent = JSON.stringify({
  name: "Speed Champion",
  description: "A karting lap time tracking app that uses AI and OCR to parse race classifications.",
  longDescription: "Speed Champion is a karting lap time tracking application designed for competitive friend groups. The app leverages AI and OCR technology to automatically parse race classification sheets, eliminating manual data entry. Track your performance, compare times with friends, and settle debates about who's really the fastest on the track.",
  url: "karts.tiago-coutinho.com",
  status: "Live",
  features: [
    "AI-powered OCR for automatic lap time extraction",
    "Real-time leaderboards and performance tracking",
    "Head-to-head comparison between drivers",
    "Historical data analysis and performance trends",
    "Mobile-friendly interface for trackside use"
  ],
  technologies: ["React", "TypeScript", "FastAPI", "Python", "PostgreSQL", "OCR/AI", "Tailwind CSS", "Docker"]
}, null, 2);

export const fileSystem: FileSystemEntry = {
  type: 'directory',
  name: '~',
  children: [
    {
      type: 'directory',
      name: 'about',
      children: [
        {
          type: 'file',
          name: 'AboutMe.md',
          content: aboutMeContent
        }
      ]
    },
    {
      type: 'directory',
      name: 'work',
      children: [
        {
          type: 'file',
          name: 'Glintt_Jan2023_current.json',
          content: glinttContent
        },
        {
          type: 'file',
          name: 'Nonius_Mar2021_Dec2022.json',
          content: noniusContent
        },
        {
          type: 'file',
          name: 'PadraoOrtopedico_Jun2019_Feb2021.json',
          content: padraoContent
        }
      ]
    },
    {
      type: 'directory',
      name: 'education',
      children: [
        {
          type: 'file',
          name: 'Masters_BiomedicalEng_Sep2017_Jul2019.json',
          content: mastersContent
        },
        {
          type: 'file',
          name: 'Bachelors_Bioengineering_Sep2014_Jul2017.json',
          content: bachelorsContent
        }
      ]
    },
    {
      type: 'directory',
      name: 'skills',
      children: [
        { type: 'file', name: 'python.skill', content: '' },
        { type: 'file', name: 'django.skill', content: '' },
        { type: 'file', name: 'fastapi.skill', content: '' },
        { type: 'file', name: 'docker.skill', content: '' },
        { type: 'file', name: 'postgresql.skill', content: '' },
        { type: 'file', name: 'redis.skill', content: '' },
        { type: 'file', name: 'elasticsearch.skill', content: '' },
        { type: 'file', name: 'langchain.skill', content: '' },
        { type: 'file', name: 'azure.skill', content: '' },
        { type: 'file', name: 'git.skill', content: '' },
        { type: 'file', name: 'linux.skill', content: '' },
        { type: 'file', name: 'pandas.skill', content: '' },
        { type: 'file', name: 'yolo.skill', content: '' },
        { type: 'file', name: 'opensearch.skill', content: '' },
        { type: 'file', name: 'fusion360.skill', content: '' },
        { type: 'file', name: 'postman.skill', content: '' },
        { type: 'file', name: 'jupyter.skill', content: '' },
        { type: 'file', name: 'openai.skill', content: '' },
        { type: 'file', name: 'gitlab.skill', content: '' },
        { type: 'file', name: 'kafka.skill', content: '' },
        { type: 'file', name: 'nginx.skill', content: '' },
        { type: 'file', name: 'mysql.skill', content: '' },
        { type: 'file', name: 'mongodb.skill', content: '' },
      ]
    },
    {
      type: 'directory',
      name: 'projects',
      children: [
        {
          type: 'file',
          name: 'SpeedChampion.json',
          content: speedChampionContent
        }
      ]
    }
  ]
};

export const projectUrls: Record<string, string> = {
  'speedchampion': 'https://karts.tiago-coutinho.com'
};

export const socialLinks = {
  github: 'https://github.com/COU7INHO',
  linkedin: 'https://www.linkedin.com/in/tiagocoutinho/'
};
