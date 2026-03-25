import AceTernityLogo from "@/components/logos/aceternity";
import SlideShow from "@/components/slide-show";
import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { RiNextjsFill, RiNodejsFill, RiReactjsFill } from "react-icons/ri";
import {
  SiBootstrap,
  SiJavascript,
  SiMongodb,
  SiTailwindcss,
  SiVite,
} from "react-icons/si";
import { FaHtml5, FaCss3Alt } from "react-icons/fa";

const BASE_PATH = "/assets/projects-screenshots";

const ProjectsLinks = ({ live, repo }: { live: string; repo?: string }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
      <Link
        className="font-mono underline flex gap-2"
        rel="noopener"
        target="_new"
        href={live}
      >
        <Button variant={"default"} size={"sm"}>
          Visit Website
          <ArrowUpRight className="ml-3 w-5 h-5" />
        </Button>
      </Link>
      {repo && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={repo}
        >
          <Button variant={"default"} size={"sm"}>
            Github
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export type Skill = {
  title: string;
  bg: string;
  fg: string;
  icon: ReactNode;
};

const PROJECT_SKILLS = {
  next: {
    title: "Next.js",
    bg: "black",
    fg: "white",
    icon: <RiNextjsFill />,
  },
  node: {
    title: "Node.js",
    bg: "black",
    fg: "white",
    icon: <RiNodejsFill />,
  },
  mongo: {
    title: "MongoDB",
    bg: "black",
    fg: "white",
    icon: <SiMongodb />,
  },
  js: {
    title: "JavaScript",
    bg: "black",
    fg: "white",
    icon: <SiJavascript />,
  },
  react: {
    title: "React.js",
    bg: "black",
    fg: "white",
    icon: <RiReactjsFill />,
  },
  tailwind: {
    title: "Tailwind",
    bg: "black",
    fg: "white",
    icon: <SiTailwindcss />,
  },
  vite: {
    title: "Vite",
    bg: "black",
    fg: "white",
    icon: <SiVite />,
  },
  bootstrap: {
    title: "Bootstrap",
    bg: "black",
    fg: "white",
    icon: <SiBootstrap />,
  },
  html: {
    title: "HTML",
    bg: "black",
    fg: "white",
    icon: <FaHtml5 />,
  },
  css: {
    title: "CSS",
    bg: "black",
    fg: "white",
    icon: <FaCss3Alt />,
  },
};

export type Project = {
  id: string;
  category: string;
  title: string;
  src: string;
  screenshots: string[];
  skills: { frontend: Skill[]; backend: Skill[] };
  content: React.ReactNode | any;
  github?: string;
  live: string;
};

const projects: Project[] = [
  {
    id: "thala-credit",
    category: "Credit Management",
    title: "THALA-CREDIT",
    src: "/assets/projects-screenshots/portfolio/landing.png",
    screenshots: ["landing.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.vite,
      ],
      backend: [PROJECT_SKILLS.mongo],
    },
    live: "https://Akuttyprince.github.io/THALA-CREDIT",
    github: "https://github.com/Akuttyprince/THALA-CREDIT",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            A credit management app for shopkeepers and small businesses
          </TypographyP>
          <TypographyP className="font-mono">
            THALA-CREDIT is a non-profit, open-source tool designed to simplify
            financial tracking. Built with React 19, TailwindCSS, and Vite for
            lightning-fast performance and a seamless user experience.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Features</TypographyH3>
          <ul className="list-disc ml-6 font-mono mb-4">
            <li>LocalStorage for primary data storage</li>
            <li>MongoDB for scheduled backups (daily/weekly/monthly)</li>
            <li>Telegram/WhatsApp notifications</li>
            <li>Razorpay integration for donations</li>
            <li>CSV import/export functionality</li>
            <li>Built-in floating calculator</li>
          </ul>
          <SlideShow images={[`${BASE_PATH}/portfolio/landing.png`]} />
          <TypographyH3 className="my-4 mt-8">Purpose</TypographyH3>
          <p className="font-mono mb-2">
            Designed as a community tool to help small businesses track credits and
            payments efficiently. The open-source nature allows for continuous
            improvements and community contributions.
          </p>
        </div>
      );
    },
  },
  {
    id: "thala-credit-frontend",
    category: "Credit Management",
    title: "THALA-CREDIT Frontend",
    src: "/assets/projects-screenshots/portfolio/projects.png",
    screenshots: ["projects.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.vite,
      ],
      backend: [],
    },
    live: "https://Akuttyprince.github.io/THALA-CREDIT",
    github: "https://github.com/Akuttyprince/THALA-CREDIT-FRONTEND",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            The frontend for THALA-CREDIT, crafted with React and TailwindCSS
            for a seamless, responsive user experience.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Interface</TypographyH3>
          <p className="font-mono mb-2">
            Provides an intuitive interface for managing credits, viewing transaction
            histories, and configuring notifications. Optimized for performance
            with Vite, it ensures fast load times and smooth interactions.
          </p>
          <SlideShow images={[`${BASE_PATH}/portfolio/projects.png`]} />
        </div>
      );
    },
  },
  {
    id: "portfolio-old",
    category: "Portfolio",
    title: "My Old Portfolio",
    src: "/assets/projects-screenshots/portfolio/project.png",
    screenshots: ["project.png"],
    live: "https://Akuttyprince.github.io/Portfolio",
    github: "https://github.com/Akuttyprince/Portfolio",
    skills: {
      frontend: [
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.bootstrap,
      ],
      backend: [],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            My personal portfolio website, built with React and Bootstrap,
            showcasing my projects, skills, and passion for coding.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Features</TypographyH3>
          <p className="font-mono mb-2">
            Customized from an open-source template, it features dynamic project
            management via an admin panel, responsive design, and smooth
            animations to highlight my journey as a developer.
          </p>
          <SlideShow images={[`${BASE_PATH}/portfolio/project.png`]} />
        </div>
      );
    },
  },
  {
    id: "swetha-login",
    category: "Authentication",
    title: "Swetha Login",
    src: "/assets/projects-screenshots/portfolio/navbar.png",
    screenshots: ["navbar.png"],
    github: "https://github.com/Akuttyprince/SWETHA-LOGIN.git",
    live: "https://github.com/Akuttyprince/SWETHA-LOGIN.git",
    skills: {
      frontend: [
        PROJECT_SKILLS.html,
        PROJECT_SKILLS.css,
        PROJECT_SKILLS.js,
      ],
      backend: [],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            A sleek login system built with HTML, CSS, and JavaScript,
            designed for secure and user-friendly authentication.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Use Case</TypographyH3>
          <p className="font-mono mb-2">
            Perfect for web apps needing a simple yet effective user access
            solution. Features a clean design with form validation and
            responsive layout.
          </p>
          <SlideShow images={[`${BASE_PATH}/portfolio/navbar.png`]} />
        </div>
      );
    },
  },
  {
    id: "manoj-windows",
    category: "Simulation",
    title: "Manoj Windows",
    src: "/assets/projects-screenshots/portfolio/landing.png",
    screenshots: ["landing.png"],
    github: "https://github.com/Akuttyprince/manoj_windows.git",
    live: "https://github.com/Akuttyprince/manoj_windows.git",
    skills: {
      frontend: [
        PROJECT_SKILLS.html,
        PROJECT_SKILLS.css,
        PROJECT_SKILLS.js,
      ],
      backend: [],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            A creative web-based simulation of a Windows-like interface,
            crafted with HTML, CSS, and JavaScript.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Experience</TypographyH3>
          <p className="font-mono mb-2">
            Mimics desktop functionality for a nostalgic and interactive user
            experience. Features draggable windows, a taskbar, and classic
            desktop elements.
          </p>
          <SlideShow images={[`${BASE_PATH}/portfolio/landing.png`]} />
        </div>
      );
    },
  },
  {
    id: "simple-game",
    category: "Gaming",
    title: "Simple Game",
    src: "/assets/projects-screenshots/portfolio/projects.png",
    screenshots: ["projects.png"],
    github: "https://github.com/Akuttyprince/simple_game.git",
    live: "https://github.com/Akuttyprince/simple_game.git",
    skills: {
      frontend: [
        PROJECT_SKILLS.js,
        PROJECT_SKILLS.html,
        PROJECT_SKILLS.css,
      ],
      backend: [],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            A fun, lightweight browser-based game built with JavaScript and
            HTML5 Canvas.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Gameplay</TypographyH3>
          <p className="font-mono mb-2">
            Designed for quick play sessions with engaging mechanics and smooth
            performance. Perfect for casual gaming with responsive controls.
          </p>
          <SlideShow images={[`${BASE_PATH}/portfolio/projects.png`]} />
        </div>
      );
    },
  },
  {
    id: "chat-bot-bro",
    category: "AI/Chatbot",
    title: "Chat Bot Bro 2.0",
    src: "/assets/projects-screenshots/portfolio/project.png",
    screenshots: ["project.png"],
    github: "https://github.com/Akuttyprince/chat_bot_bro_2.0.git",
    live: "https://github.com/Akuttyprince/chat_bot_bro_2.0.git",
    skills: {
      frontend: [PROJECT_SKILLS.js],
      backend: [PROJECT_SKILLS.node],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            An AI-powered chatbot built with JavaScript and Node.js,
            designed for interactive conversations.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Features</TypographyH3>
          <p className="font-mono mb-2">
            Supports basic NLP for answering queries and engaging users.
            Perfect for customer support, FAQ automation, or just for fun
            interactions.
          </p>
          <SlideShow images={[`${BASE_PATH}/portfolio/project.png`]} />
        </div>
      );
    },
  },
  {
    id: "attend-us",
    category: "Productivity",
    title: "Attend Us",
    src: "/assets/projects-screenshots/portfolio/navbar.png",
    screenshots: ["navbar.png"],
    github: "https://github.com/Akuttyprince/Attend-us.git",
    live: "https://github.com/Akuttyprince/Attend-us.git",
    skills: {
      frontend: [
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.js,
      ],
      backend: [],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            An advanced attendance management web app using React and JavaScript.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Features</TypographyH3>
          <ul className="list-disc ml-6 font-mono mb-4">
            <li>User authentication</li>
            <li>Real-time tracking</li>
            <li>Exportable reports for institutions</li>
            <li>Responsive dashboard interface</li>
          </ul>
          <SlideShow images={[`${BASE_PATH}/portfolio/navbar.png`]} />
        </div>
      );
    },
  },
  {
    id: "shop-tracking",
    category: "Productivity",
    title: "Shop Tracking",
    src: "/assets/projects-screenshots/portfolio/skills.png",
    screenshots: ["skills.png"],
    github: "https://github.com/Akuttyprince/shop-tracking.git",
    live: "https://github.com/Akuttyprince/shop-tracking.git",
    skills: {
      frontend: [
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.js,
      ],
      backend: [],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            A shop management system built with React and JavaScript,
            enabling inventory tracking and sales monitoring.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Dashboard</TypographyH3>
          <p className="font-mono mb-2">
            Includes a user-friendly dashboard for small businesses to manage
            inventory, track sales, and monitor stock levels efficiently.
          </p>
          <SlideShow images={[`${BASE_PATH}/portfolio/skills.png`]} />
        </div>
      );
    },
  },
];

export default projects;
