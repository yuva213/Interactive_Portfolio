"use client";
import Image from "next/image";
import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "../ui/animated-modal";
import { FloatingDock } from "../ui/floating-dock";
import Link from "next/link";

import SmoothScroll from "../smooth-scroll";
import projects, { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";
import SectionWrapper from "../ui/section-wrapper";
import { Loader2 } from "lucide-react";

const ProjectsSection = () => {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/projects");
        const json = await res.json();
        if (Array.isArray(json) && json.length > 0) {
          setData(json);
        } else {
          setData(projects);
        }
      } catch {
        setData(projects);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <SectionWrapper id="projects" className="max-w-7xl mx-auto md:min-h-[130vh]">
      <SectionHeader id="projects" title="Projects" />
      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="w-10 h-10 animate-spin text-zinc-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8">
          {data.map((project, index) => (
            <Modall key={project._id || project.id} project={project} />
          ))}
        </div>
      )}
    </SectionWrapper>
  );
};

const Modall = ({ project }: { project: any }) => {
  return (
    <div className="flex items-center justify-center">
      <Modal>
        <ModalTrigger className="bg-transparent flex justify-center group/modal-btn">
          <div
            className="relative w-[340px] md:w-[400px] h-auto rounded-lg overflow-hidden border border-zinc-900 group-hover/modal-btn:border-zinc-700 transition-all"
            style={{ aspectRatio: "3/2" }}
          >
            <Image
              className="absolute w-full h-full top-0 left-0 hover:scale-[1.05] transition-all object-cover opacity-80 group-hover/modal-btn:opacity-100"
              src={project.src}
              alt={project.title}
              width={400}
              height={400}
            />
            <div className="absolute w-full h-1/2 bottom-0 left-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
              <div className="flex flex-col h-full items-start justify-end p-6">
                <div className="text-lg text-left font-bold">{project.title}</div>
                <div className="text-xs bg-white text-black rounded-full w-fit px-3 py-0.5 mt-1">
                  {project.category}
                </div>
              </div>
            </div>
          </div>
        </ModalTrigger>
        <ModalBody className="md:max-w-4xl md:max-h-[80%] overflow-auto bg-black border border-zinc-800">
          <SmoothScroll isInsideModal={true}>
            <ModalContent>
              <ProjectContents project={project} />
            </ModalContent>
          </SmoothScroll>
          <ModalFooter className="gap-4 bg-zinc-950/50 border-t border-zinc-900">
            <button className="px-4 py-2 text-zinc-500 hover:text-white transition-colors text-sm">
              Close
            </button>
            <Link href={project.live} target="_blank">
              <button className="bg-white text-black text-sm px-6 py-2 rounded-md font-bold hover:bg-zinc-200 transition-colors">
                Visit Website
              </button>
            </Link>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
};
export default ProjectsSection;

const ProjectContents = ({ project }: { project: any }) => {
  return (
    <div className="p-6 md:p-10">
      <h4 className="text-2xl md:text-4xl text-neutral-100 font-bold text-center mb-10">
        {project.title}
      </h4>
      {/* Skill Rendering Logic - Adapted for DB/Static data */}
      <div className="flex flex-col md:flex-row md:justify-evenly max-w-screen overflow-hidden md:overflow-visible gap-10 mb-12 border-y border-zinc-900 py-8">
        <div className="flex flex-col items-center gap-4">
           <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">FRONTEND</p>
          {project.skills?.frontend?.length > 0 && (
            <FloatingDock items={project.skills.frontend.map((s: any) => typeof s === 'string' ? { title: s, icon: <span>{s}</span> } : s)} />
          )}
        </div>
        {project.skills?.backend?.length > 0 && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">BACKEND</p>
            <FloatingDock items={project.skills.backend.map((s: any) => typeof s === 'string' ? { title: s, icon: <span>{s}</span> } : s)} />
          </div>
        )}
      </div>

      <div className="prose prose-invert max-w-none">
        {/* Support both JSX (static) and Text (database) */}
        {typeof project.content === "string" ? (
          <div className="font-mono text-zinc-400 leading-relaxed whitespace-pre-wrap">{project.content}</div>
        ) : (
          project.content
        )}
      </div>
    </div>
  );
};
