// thoda zada ts ho gya idhar
export enum SkillNames {
  CPP = "cpp",
  JS = "js",
  TS = "ts",
  HTML = "html",
  CSS = "css",
  REACT = "react",
  NEXTJS = "nextjs",
  TAILWIND = "tailwind",
  NODEJS = "nodejs",
  MONGODB = "mongodb",
  GIT = "git",
  GITHUB = "github",
  PYTHON = "python",
  JAVA = "java",
  FLASK = "flask",
  EXPRESS = "express",
  RENDER = "render",
  GROQ = "groq",
  VITE = "vite",
  BOOTSTRAP = "bootstrap",
}
export type Skill = {
  id: number;
  name: string;
  label: string;
  shortDescription: string;
  color: string;
  icon: string;
};
export const SKILLS: Record<SkillNames, Skill> = {
  [SkillNames.CPP]: {
    id: 1,
    name: "cpp",
    label: "C++",
    shortDescription: "Building foundations, one object at a time! 🔧💻",
    color: "#00599C",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  },
  [SkillNames.JS]: {
    id: 2,
    name: "js",
    label: "JavaScript",
    shortDescription: "Making the web come alive since '95! 💯🚀",
    color: "#f0db4f",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  [SkillNames.TS]: {
    id: 3,
    name: "ts",
    label: "TypeScript",
    shortDescription: "Type-safe and proud of it! 💯🔒",
    color: "#007acc",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  [SkillNames.HTML]: {
    id: 4,
    name: "html",
    label: "HTML",
    shortDescription: "The structure of the web! 🌐📄",
    color: "#e34c26",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  [SkillNames.CSS]: {
    id: 5,
    name: "css",
    label: "CSS",
    shortDescription: "Styling with flair! 💁‍♂️🎨",
    color: "#563d7c",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },
  [SkillNames.REACT]: {
    id: 6,
    name: "react",
    label: "React",
    shortDescription: "Building components that matter! ⚛️🔥",
    color: "#61dafb",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  [SkillNames.NEXTJS]: {
    id: 7,
    name: "nextjs",
    label: "Next.js",
    shortDescription: "React, but better! 🚀📜",
    color: "#fff",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  },
  [SkillNames.TAILWIND]: {
    id: 8,
    name: "tailwind",
    label: "Tailwind",
    shortDescription: "Utility-first CSS that hits different! 🌪️🔥",
    color: "#38bdf8",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
  },
  [SkillNames.NODEJS]: {
    id: 9,
    name: "nodejs",
    label: "Node.js",
    shortDescription: "JavaScript everywhere! 🔙🔚",
    color: "#6cc24a",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  [SkillNames.EXPRESS]: {
    id: 10,
    name: "express",
    label: "Express",
    shortDescription: "Minimal and fast backend! 🚂💨",
    color: "#fff",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  },
  [SkillNames.MONGODB]: {
    id: 11,
    name: "mongodb",
    label: "MongoDB",
    shortDescription: "NoSQL that scales! 💪🍃",
    color: "#336791",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  [SkillNames.GIT]: {
    id: 12,
    name: "git",
    label: "Git",
    shortDescription: "Version control done right! 🕵️‍♂️🔄",
    color: "#f1502f",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  [SkillNames.GITHUB]: {
    id: 13,
    name: "github",
    label: "GitHub",
    shortDescription: "Where code lives! 🐙",
    color: "#000000",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  },
  [SkillNames.PYTHON]: {
    id: 14,
    name: "python",
    label: "Python",
    shortDescription: "Simple, readable, powerful! 🐍💚",
    color: "#3776AB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  [SkillNames.JAVA]: {
    id: 15,
    name: "java",
    label: "Java",
    shortDescription: "Write once, run everywhere! ☕🖥️",
    color: "#007396",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  },
  [SkillNames.FLASK]: {
    id: 16,
    name: "flask",
    label: "Flask",
    shortDescription: "Lightweight and Pythonic! 🌿🐍",
    color: "#fff",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
  },
  [SkillNames.RENDER]: {
    id: 17,
    name: "render",
    label: "Render",
    shortDescription: "Cloud hosting made easy! ☁️🚀",
    color: "#46e3b7",
    icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/render.svg",
  },
  [SkillNames.GROQ]: {
    id: 18,
    name: "groq",
    label: "Groq",
    shortDescription: "Fast AI inference! 🤖⚡",
    color: "#FF4A4D",
    icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/groq.svg",
  },
  [SkillNames.VITE]: {
    id: 19,
    name: "vite",
    label: "Vite",
    shortDescription: "Lightning-fast build tool! ⚡🔥",
    color: "#646CFF",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg",
  },
  [SkillNames.BOOTSTRAP]: {
    id: 20,
    name: "bootstrap",
    label: "Bootstrap",
    shortDescription: "Styling made simple! 💜🎨",
    color: "#7952B3",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
  },
};

export type Experience = {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  company: string;
  description: string[];
  skills: SkillNames[];
};

export const EXPERIENCE: Experience[] = [
  {
    id: 1,
    startDate: "2024",
    endDate: "Present",
    title: "Software Developer",
    company: "Freelance",
    description: [
      "Building MERN stack applications and web solutions.",
      "Creating innovative projects like THALA-CREDIT and Portfolio.",
      "Focusing on clean code and responsive design.",
    ],
    skills: [
      SkillNames.REACT,
      SkillNames.NODEJS,
      SkillNames.MONGODB,
      SkillNames.TAILWIND,
      SkillNames.NEXTJS,
    ],
  },
  {
    id: 2,
    startDate: "2023",
    endDate: "Present",
    title: "Open Source Contributor",
    company: "GitHub",
    description: [
      "Contributing to open-source projects.",
      "Building tools for the community.",
      "Learning and sharing knowledge with developers worldwide.",
    ],
    skills: [
      SkillNames.JS,
      SkillNames.REACT,
      SkillNames.GIT,
      SkillNames.GITHUB,
    ],
  },
];

export const themeDisclaimers = {
  light: [
    "Warning: Light mode emits a gazillion lumens of pure radiance!",
    "Caution: Light mode ahead! Please don't try this at home.",
    "Only trained professionals can handle this much brightness. Proceed with sunglasses!",
    "Brace yourself! Light mode is about to make everything shine brighter than your future.",
    "Flipping the switch to light mode... Are you sure your eyes are ready for this?",
  ],
  dark: [
    "Light mode? I thought you went insane... but welcome back to the dark side!",
    "Switching to dark mode... How was life on the bright side?",
    "Dark mode activated! Thanks you from the bottom of my heart, and my eyes too.",
    "Welcome back to the shadows. How was life out there in the light?",
    "Dark mode on! Finally, someone who understands true sophistication.",
  ],
};

