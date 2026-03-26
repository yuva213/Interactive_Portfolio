const config = {
  title: "Yuvaraj S | MERN Stack Developer",
  description: {
    long: "Explore the portfolio of Yuvaraj S, a passionate software developer and MERN stack specialist. Obsessed with crafting code that solves real problems, creating web apps, and diving deep into Web3 and AI. Discover my latest work including THALA-CREDIT, Portfolio, and various creative projects. Let's build something amazing together!",
    short:
      "Discover the portfolio of Yuvaraj S, a MERN stack developer creating interactive web experiences and innovative projects.",
  },
  keywords: [
    "Yuvaraj",
    "portfolio",
    "MERN stack developer",
    "software developer",
    "freelancer",
    "web development",
    "JavaScript",
    "Python",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "MongoDB",
    "Web3",
    "AI",
    "THALA-CREDIT",
    "open source contributor",
  ],
  author: "Yuvaraj S",
  email: "yuvarajpro213@gmail.com",
  site: "https://my-portfoloi-seven.vercel.app",

  // for github stars button
  githubUsername: "yuva213",
  githubRepo: "3d-portfolio",

  get ogImg() {
    return this.site + "/assets/seo/og-image.png";
  },
  social: {
    twitter: "https://x.com/yuvarajpro213",
    linkedin: "https://www.linkedin.com/in/yuva-raj-s-005419299/",
    instagram: "https://www.instagram.com/_yuva_rajj_/",
    facebook: "",
    github: "https://github.com/yuva213",
  },
};
export { config };
