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
  period: "July 2025 - Present",
  location: "Porto, Portugal",
  description: [
    "Develop AI-powered solutions using RAG (Retrieval-Augmented Generation) architectures",
    "Design and orchestrate AI-based workflows and pipelines",
    "Implement complex data flows involving machine learning models for classification, OCR, and Named Entity Recognition"
  ],
  technologies: ["Python", "Docker", "OpenSearch", "Azure", "YOLO", "Kafka", "Django", "Django REST Framework", "PostgreSQL", "Pandas"]
}, null, 2);

const noniusContent = JSON.stringify({
  company: "Nonius",
  position: "Software Engineer",
  period: "February 2024 - June 2025",
  location: "Porto, Portugal",
  description: [
    "Develop and maintain high-performance APIs using Django and Django REST Framework to support casting services (e.g., Chromecast, AirPlay), handling thousands of daily requests",
    "Optimize real-time communication and event propagation using Socket.IO, improving the system's capacity to handle 4x more simultaneous WebSocket connections",
    "Lead a project responsible for preparing and deploying devices for in-loco use in hotels, hospitals, and healthcare facilities",
    "Work across the full data pipeline: from ingesting raw data from customer devices into Elasticsearch, to processing and delivering it efficiently to the end user — applying practical ETL principles",
    "Lead performance improvements by optimizing Elasticsearch queries and database operations, achieving up to 80% faster responses on critical endpoints"
  ],
  technologies: ["Python", "Django", "Django REST Framework", "MySQL", "Elasticsearch", "Socket.IO", "Pandas"]
}, null, 2);

const padraoDevContent = JSON.stringify({
  company: "Padrão Ortopédico",
  position: "Software Developer",
  period: "November 2022 - February 2024",
  location: "Porto, Portugal",
  description: [
    "Developed a Python application to support gait analysis in lower limb amputees, capturing raw data in real time using a YOLO-based computer vision model",
    "Built a custom ETL pipeline: from data collection via computer vision, to data processing using Pandas and signal filtering techniques, and finally delivering structured gait assessment results",
    "Designed and implemented a custom GUI to present the processed data and improve usability for healthcare professionals"
  ],
  technologies: ["Python", "Pandas", "YOLO", "Cloud Computing"]
}, null, 2);

const padraoInternContent = JSON.stringify({
  company: "Padrão Ortopédico",
  position: "Biomedical Engineer (Internship)",
  period: "February 2022 - July 2022",
  location: "Porto, Portugal",
  description: [
    "Built a Python web app to process gait data and generate assessments of lower limb amputees using input from a third-party tool"
  ],
  technologies: ["Python", "Pandas"]
}, null, 2);

const mastersContent = JSON.stringify({
  degree: "Master's Degree in Biomedical Engineering",
  institution: "Universidade Católica Portuguesa",
  period: "2020 - 2022",
  location: "Porto, Portugal",
  description: "Advanced studies in biology, computational methods, and data processing applied to healthcare, with a thesis focused on developing a software solution for gait analysis in lower limb amputees using computer vision and signal processing"
}, null, 2);

const bachelorsContent = JSON.stringify({
  degree: "Bachelor's Degree in Bioengineering",
  institution: "Universidade Católica Portuguesa",
  period: "2017 - 2020",
  location: "Porto, Portugal",
  description: "Foundations in biology, biomedical sciences, signal processing, and programming, building a multidisciplinary profile that bridges life sciences with technology and software development"
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
          name: 'Glintt_Jul2025_current.json',
          content: glinttContent
        },
        {
          type: 'file',
          name: 'Nonius_Feb2024_Jun2025.json',
          content: noniusContent
        },
        {
          type: 'file',
          name: 'PadraoOrtopedico_Nov2022_Feb2024.json',
          content: padraoDevContent
        },
        {
          type: 'file',
          name: 'PadraoOrtopedico_Feb2022_Jul2022.json',
          content: padraoInternContent
        }
      ]
    },
    {
      type: 'directory',
      name: 'education',
      children: [
        {
          type: 'file',
          name: 'Masters_BiomedicalEng_2020_2022.json',
          content: mastersContent
        },
        {
          type: 'file',
          name: 'Bachelors_Bioengineering_2017_2020.json',
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
