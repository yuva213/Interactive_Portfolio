"use client";
import React, { useState, useEffect } from "react";
import { EXPERIENCE, SkillNames, SKILLS } from "@/data/constants";
import { SectionHeader } from "./section-header";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import SectionWrapper from "../ui/section-wrapper";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const ExperienceSection = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExp = async () => {
      try {
        const res = await fetch("/api/experience");
        const json = await res.json();
        if (Array.isArray(json) && json.length > 0) {
          setData(json);
        } else {
          setData(EXPERIENCE);
        }
      } catch {
        setData(EXPERIENCE);
      } finally {
        setLoading(false);
      }
    };
    fetchExp();
  }, []);

  return (
    <SectionWrapper
      className="flex flex-col items-center justify-center min-h-[120vh] py-20 z-10"
    >
      <div className="w-full max-w-4xl px-4 md:px-8 mx-auto">
        <SectionHeader
          id="experience"
          title="Experience"
          desc="My professional journey."
          className="mb-12 md:mb-20 mt-0"
        />

        <div className="flex flex-col gap-8 md:gap-12 relative">
          <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-px bg-zinc-800 hidden md:block -translate-x-1/2" />

          {loading ? (
             <div className="flex justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-800" />
            </div>
          ) : (
            data.map((exp, index) => (
                <div key={exp._id || exp.id} className="relative">
                  <ExperienceCard experience={exp} index={index} />
                </div>
            ))
          )}
        </div>
      </div>
    </SectionWrapper>
  );
};

const ExperienceCard = ({
  experience,
  index,
}: {
  experience: any;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <Card
        className={cn(
          "bg-zinc-950/20 text-card-foreground border-zinc-900 border-2",
          "hover:border-purple-500/20 transition-all duration-500",
          "shadow-sm hover:shadow-2xl rounded-3xl overflow-hidden"
        )}
      >
        <CardHeader className="pb-3 border-b border-zinc-900/50 bg-zinc-900/10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black tracking-tighter">
                {experience.title}
              </CardTitle>
              <div className="text-sm font-black uppercase text-zinc-600 tracking-widest font-mono">
                {experience.company}
              </div>
            </div>
            <Badge variant="secondary" className="w-fit font-mono text-[10px] uppercase font-black bg-zinc-900 text-zinc-500 px-3 py-1 rounded-full border border-zinc-800">
              {experience.startDate} - {experience.endDate}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          <ul className="list-none space-y-3 text-sm text-zinc-500 font-mono italic leading-relaxed">
            {experience.description.map((point: string, i: number) => (
              <li key={i} className="flex gap-2">
                <span className="text-purple-600 font-black">»</span>
                {point}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2 pt-4">
            {experience.skills?.map((skillName: string) => {
              const skill = SKILLS[skillName as SkillNames];
              return (
                <Badge
                  key={skillName}
                  variant="outline"
                  className="gap-2 text-[10px] font-black uppercase bg-zinc-950 border-zinc-900 px-3 py-1 text-zinc-500 hover:text-white transition-all rounded-lg"
                >
                  {skill && (
                    <img
                        src={skill.icon}
                        alt={skill.label}
                        className="w-3 h-3 object-contain opacity-60 group-hover:opacity-100"
                    />
                  )}
                  {skill ? skill.label : skillName}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ExperienceSection;
