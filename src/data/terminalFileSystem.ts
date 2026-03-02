// Terminal File System Data
// Matches the existing portfolio data

export interface FileSystemEntry {
  type: 'directory' | 'file';
  name: string;
  content?: string;
  children?: FileSystemEntry[];
}

const aboutMeContent = `# About Me

I'm an AI Data Engineer focused on building production-grade AI systems.
I design RAG pipelines over enterprise knowledge bases, document intelligence
solutions combining OCR and NER, and multi-agent orchestration frameworks
that automate complex, multi-step workflows.

I work across the full stack of modern AI engineering: large language models,
vector databases, event-driven pipelines, and cloud-native infrastructure,
putting the pieces together into systems that run reliably at scale.

I come from a Biomedical Engineering background, which is where I first got
hooked on turning messy real-world data into something useful. That same
instinct drives everything I build today.
`;

const glinttContent = JSON.stringify({
  company: "Glintt Global",
  position: "AI Data Engineer",
  period: "July 2025 - Present",
  location: "Porto, Portugal",
  description: [
    "Led the architecture design and development of an AI-powered address recognition pipeline, orchestrating OCR, NER, YOLO-based models, and classification models to extract and validate unstructured address data from physical documents, with Kafka and Redis handling thousands of data events per minute and OpenSearch powering fuzzy search across millions of records",
    "Design and develop end-to-end RAG pipelines, from automated document ingestion and OCR-based text extraction, through chunking strategies using LangChain, to vector database population with Weaviate, enabling intelligent document retrieval and Q&A over enterprise knowledge bases",
    "Design and implement multi-agent orchestration systems that process real-time voice input to progressively build and structure technical requirements specifications, coordinating specialised agents across transcription, interpretation, and document generation stages using LangGraph and Azure Agent Framework",
    "Develop causal inference and counterfactual ML models to optimise marketing campaign strategies, enabling data-driven personalisation",
    "Deploy and manage AI solutions in cloud-native environments (Azure, Docker), ensuring reliability, observability, and scalability"
  ],
  technologies: ["Python", "Docker", "OpenSearch", "Azure", "YOLO", "Kafka", "Redis", "LangChain", "LangGraph", "Weaviate", "Django", "Django REST Framework", "PostgreSQL", "Pandas", "Scikit-learn"]
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
    "Developed a real-time biomechanical analysis system for lower limb amputees, applying a YOLO-based computer vision model to capture and interpret gait data from live video input",
    "Engineered a full ML data pipeline, from raw computer vision output through signal processing and filtering techniques, transforming noisy data into clinically structured gait assessments",
    "Designed and implemented a clinical-grade GUI to visualise processed biomechanical data, built for usability by healthcare professionals in a medical setting"
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
  longDescription: "Speed Champion is a karting lap time tracking app built for competitive friend groups. It uses AI-powered OCR (Mistral OCR) to automatically read and parse race classification sheets, eliminating the need for manual data entry. Track your performance, compare lap times with friends, and settle the debate about who's really the fastest on the track.",
  url: "karts.tiago-coutinho.com",
  status: "Live",
  features: [
    "AI-powered OCR (Mistral) for automatic lap time extraction from race sheets",
    "Head-to-head comparison between drivers",
    "Historical data analysis and performance trends",
    "Mobile-friendly interface for trackside use",
    "Self-hosted on a Raspberry Pi 5"
  ],
  technologies: ["React", "TypeScript", "Django", "Django REST Framework", "Python", "PostgreSQL", "Mistral OCR", "Tailwind CSS", "Nginx", "Raspberry Pi", "Docker"],
  github: {
    backend: "https://github.com/COU7INHO/karst-app-backend",
    frontend: "https://github.com/COU7INHO/speedway-stats"
  }
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
        { type: 'file', name: 'langgraph.skill', content: '' },
        { type: 'file', name: 'weaviate.skill', content: '' },
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
