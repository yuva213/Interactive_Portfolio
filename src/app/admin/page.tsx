"use client";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/ace-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/ace-textarea";
import { Badge } from "@/components/ui/badge";
import { 
    Plus, Trash2, Loader2, LogOut, Briefcase, Rocket, 
    FileText, CheckCircle, Upload, Link as LinkIcon, 
    ChevronRight, Globe, Github
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SKILLS, SkillNames } from "@/data/constants";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingTask, setAddingTask] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const [newProject, setNewProject] = useState({
    title: "",
    category: "",
    content: "",
    src: "",
    live: "",
    github: "",
    screenshots: [],
    skills: { frontend: [], backend: [] },
  });

  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "Present",
    description: "",
    skills: [],
    category: "work",
  });

  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    coverImage: "",
    tags: "",
    isPublished: true,
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "blogs" ? "/api/admin/blogs" : (activeTab === "projects" ? "/api/projects" : "/api/experience");
      const res = await fetch(endpoint);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(`Failed to fetch ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const handleFileUpload = async (file: File, type: "projects" | "blogs") => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        if (type === "projects") {
          setNewProject((prev) => ({ ...prev, src: data.url }));
        } else {
          setNewBlog((prev) => ({ ...prev, coverImage: data.url }));
        }
      }
    } catch (err) {
      console.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingTask(true);
    try {
      let data = {};
      let endpoint = `/api/admin/${activeTab}`;
      
      if (activeTab === "projects") {
        data = newProject;
      } else if (activeTab === "experience") {
        data = { ...newExperience, description: newExperience.description.split("\n").filter(l => l.trim() !== "") };
      } else if (activeTab === "blogs") {
        data = { ...newBlog, tags: newBlog.tags.split(",").map(t => t.trim()) };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        fetchItems();
        if (activeTab === "projects") setNewProject({ title: "", category: "", content: "", src: "", live: "", github: "", skills: { frontend: [], backend: [] } });
        else if (activeTab === "experience") setNewExperience({ title: "", company: "", startDate: "", endDate: "Present", description: "", skills: [], category: "work" });
        else if (activeTab === "blogs") setNewBlog({ title: "", content: "", coverImage: "", tags: "", isPublished: true });
      }
    } catch (err) {
      console.error("Failed to create entry");
    } finally {
      setAddingTask(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${activeTab}?`)) return;
    try {
      const res = await fetch(`/api/admin/${activeTab}?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchItems();
    } catch (err) {
      console.error("Failed to delete entry");
    }
  };

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const CATEGORIES = ["Web App", "Frontend", "Backend", "Fullstack", "AI / ML", "Mobile", "Web3", "Other"];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans selection:bg-purple-500/30">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500" />
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                    Control_Center <span className="text-zinc-800">v2</span>
                </h1>
            </div>
            <p className="text-zinc-600 font-mono text-xs uppercase tracking-[0.2em] font-black">Authorized_Access_Only</p>
            
            <div className="flex gap-1 mt-8 p-1 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl w-fit">
              {["projects", "experience", "blogs"].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 md:px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "text-zinc-500 hover:text-white"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-zinc-700 hover:text-red-500 hover:bg-red-500/10 transition-all font-black uppercase tracking-widest text-[10px]">
            <LogOut className="w-4 h-4 mr-2" /> TERMINATE_SESSION
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <section className="lg:col-span-6">
            <div className="bg-zinc-950/50 border border-zinc-900 p-8 md:p-12 rounded-[3.5rem] sticky top-8 shadow-2xl backdrop-blur-xl">
                <h2 className="text-2xl font-black mb-10 flex items-center tracking-tighter text-white uppercase italic decoration-purple-500 decoration-4 underline-offset-8 underline">
                    {activeTab === "projects" ? <Rocket className="w-6 h-6 mr-4 text-purple-500" /> : (activeTab === "experience" ? <Briefcase className="w-6 h-6 mr-4 text-purple-500" /> : <FileText className="w-6 h-6 mr-4 text-purple-500" />)}
                    CREATE_NEW_{activeTab.slice(0, -1)}
                </h2>
                
                <form onSubmit={handleCreate} className="space-y-8">
                    {activeTab === "projects" && (
                        <ProjectForm 
                            newProject={newProject} 
                            setNewProject={setNewProject} 
                            uploading={uploading} 
                            handleFileUpload={handleFileUpload} 
                            CATEGORIES={CATEGORIES}
                        />
                    )}

                    {activeTab === "experience" && (
                        <ExperienceForm 
                            newExperience={newExperience} 
                            setNewExperience={setNewExperience} 
                        />
                    )}

                    {activeTab === "blogs" && (
                        <BlogForm 
                            newBlog={newBlog} 
                            setNewBlog={setNewBlog} 
                            uploading={uploading} 
                            handleFileUpload={handleFileUpload} 
                        />
                    )}

                    <Button type="submit" className="w-full bg-white text-black font-black h-20 mt-12 rounded-[1.5rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)] text-base uppercase italic tracking-tighter" disabled={addingTask}>
                        {addingTask ? <Loader2 className="animate-spin" /> : (
                            <div className="flex items-center gap-3">
                                <span>PUSH_TO_DATABASE</span>
                                <Plus className="w-5 h-5" />
                            </div>
                        )}
                    </Button>
                </form>
            </div>
          </section>

          <section className="lg:col-span-6">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-xs font-black text-zinc-700 uppercase tracking-[0.3em] italic">
                    LIVE_REPOSITORY ({items.length})
                </h2>
                <div className="h-px bg-zinc-900 flex-1 ml-6" />
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center p-32 border border-zinc-900 rounded-[3.5rem] bg-zinc-950/20">
                <Loader2 className="animate-spin w-10 h-10 text-zinc-800 mb-6" />
                <p className="text-[10px] uppercase font-black tracking-widest text-zinc-800 italic">Synchronizing_Data...</p>
              </div>
            ) : (
                <div className="space-y-4">
                    {items.map((item: any) => (
                        <ListItem 
                            key={item._id} 
                            item={item} 
                            activeTab={activeTab} 
                            handleDelete={handleDelete} 
                        />
                    ))}
                    {items.length === 0 && (
                        <div className="p-40 border-2 border-dashed border-zinc-900 rounded-[3.5rem] text-center flex flex-col items-center justify-center opacity-20">
                            <Plus className="w-12 h-12 mb-6" />
                            <p className="text-zinc-600 font-black text-3xl uppercase tracking-tighter italic">NO_RECORDS_FOUND</p>
                        </div>
                    )}
                </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

const ImageUpload = ({ label, value, onChange, onUpload, uploading }: any) => {
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">{label}</Label>
            
            <div 
                className={`relative group h-48 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 overflow-hidden ${dragActive ? "border-purple-500 bg-purple-500/10" : "border-zinc-900 hover:border-zinc-700 bg-zinc-950"}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {value ? (
                    <>
                        <img src={value} className="absolute inset-0 w-full h-full object-cover opacity-20" />
                        <div className="flex flex-col items-center z-10 p-4 text-center">
                            <CheckCircle className="w-8 h-8 text-purple-500 mb-2" />
                            <p className="text-[10px] font-mono text-zinc-500 truncate max-w-xs">{value}</p>
                            <button type="button" onClick={() => onChange("")} className="mt-4 text-[10px] font-black text-red-500 hover:underline uppercase tracking-tighter">Remove_Media</button>
                        </div>
                    </>
                ) : (
                    <>
                        {uploading ? (
                             <Loader2 className="w-10 h-10 animate-spin text-zinc-800" />
                        ) : (
                            <>
                                <Upload className="w-10 h-10 text-zinc-800 group-hover:text-purple-500 transition-colors" />
                                <div className="text-center">
                                    <p className="text-xs font-black uppercase text-zinc-600 tracking-tighter">Drag_&_Drop_Media</p>
                                    <p className="text-[10px] text-zinc-800 font-mono italic">OR_CLICK_TO_BROWSE</p>
                                </div>
                            </>
                        )}
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            disabled={uploading}
                        />
                    </>
                )}
            </div>

            <div className="flex items-center gap-4 px-2">
                <div className="h-px bg-zinc-900 flex-1" />
                <span className="text-[10px] font-black text-zinc-800 uppercase italic">Alternative_Source_URL</span>
                <div className="h-px bg-zinc-900 flex-1" />
            </div>

            <div className="relative group">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-purple-500 transition-colors" />
                <Input 
                    value={value} 
                    onChange={(e) => onChange(e.target.value)} 
                    placeholder="https://images.unsplash.com/..." 
                    className="bg-zinc-950 border-zinc-900 h-14 pl-12 rounded-2xl text-xs font-mono italic"
                />
            </div>
        </div>
    );
};

const TechPicker = ({ label, selected, onToggle, category }: any) => {
    return (
        <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">{label}</Label>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 gap-3 p-6 bg-zinc-950 border border-zinc-900 rounded-3xl">
                {Object.values(SKILLS).map((skill: any) => {
                    const isSelected = selected.includes(skill.name);
                    return (
                        <button
                            key={skill.name}
                            type="button"
                            onClick={() => onToggle(skill.name, category)}
                            className={`group relative w-full aspect-square flex items-center justify-center rounded-2xl transition-all border-2 ${isSelected ? "bg-white border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "bg-black border-zinc-900 grayscale hover:grayscale-0 hover:border-zinc-700"}`}
                            title={skill.label}
                        >
                            <img 
                                src={skill.icon} 
                                alt={skill.label} 
                                className={`w-3/5 h-3/5 object-contain transition-all ${isSelected ? "" : "opacity-40"}`} 
                            />
                            {isSelected && (
                                <div className="absolute -top-1 -right-1 bg-purple-500 rounded-full p-1 border-2 border-white">
                                    <CheckCircle className="w-2 h-2 text-white" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const ProjectForm = ({ newProject, setNewProject, uploading, handleFileUpload, CATEGORIES }: any) => {
    const [githubUsername, setGithubUsername] = useState("yuva213");
    const [fetchingRepos, setFetchingRepos] = useState(false);
    const [repos, setRepos] = useState([]);

    const toggleSkill = (skillName: string, category: "frontend" | "backend") => {
        setNewProject((prev: any) => {
            const current = prev.skills[category] || [];
            const updated = current.includes(skillName) 
                ? current.filter((s: string) => s !== skillName)
                : [...current, skillName];
            return { ...prev, skills: { ...prev.skills, [category]: updated } };
        });
    };

    const fetchGithubRepos = async () => {
        if (!githubUsername) return;
        setFetchingRepos(true);
        try {
            const res = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setRepos(data.map((r: any) => r.html_url));
            }
        } catch {
            console.error("Failed to fetch repos");
        } finally {
            setFetchingRepos(false);
        }
    };

    const addScreenshot = (url: string) => {
        if (!url) return;
        setNewProject((prev: any) => ({ ...prev, screenshots: [...(prev.screenshots || []), url] }));
    };

    const removeScreenshot = (index: number) => {
        setNewProject((prev: any) => ({
            ...prev,
            screenshots: prev.screenshots.filter((_: any, i: number) => i !== index)
        }));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">TITLE</Label>
                <Input value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} placeholder="Project_X" required className="bg-zinc-950 border-zinc-900 h-14 rounded-2xl font-black italic"/>
            </div>

            <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">CATEGORY</Label>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat: string) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setNewProject({...newProject, category: cat})}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${newProject.category === cat ? "bg-purple-500 text-white" : "bg-zinc-950 border border-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-white"}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">MARKDOWN_STORY</Label>
                <Textarea value={newProject.content} onChange={(e) => setNewProject({...newProject, content: e.target.value})} placeholder="Describe the mission details..." required className="bg-zinc-950 border-zinc-900 min-h-[120px] rounded-[1.5rem] font-mono text-xs italic p-6"/>
            </div>

            <ImageUpload 
                label="MAIN_THUMBNAIL" 
                value={newProject.src} 
                onChange={(val: string) => setNewProject({...newProject, src: val})} 
                onUpload={async (file: File) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                    const data = await res.json();
                    if (data.url) setNewProject((prev: any) => ({ ...prev, src: data.url }));
                }}
                uploading={false} // Will handle local loading inside ImageUpload potentially, but okay for now.
            />

            <div className="space-y-4 bg-zinc-950 p-6 rounded-[2rem] border border-zinc-900">
                <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">GALLERY (EXTRA_IMAGES)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {newProject.screenshots?.map((url: string, idx: number) => (
                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden group">
                            <img src={url} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeScreenshot(idx)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    <div className="aspect-video relative rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-zinc-900 transition-colors cursor-pointer">
                        <Upload className="w-6 h-6 text-zinc-600" />
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                    const formData = new FormData();
                                    formData.append("file", e.target.files[0]);
                                    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                                    const data = await res.json();
                                    if (data.url) addScreenshot(data.url);
                                }
                            }} 
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block"><Globe className="w-3 h-3 inline mr-1" /> LIVE_URL</Label>
                    <Input value={newProject.live} onChange={(e) => setNewProject({...newProject, live: e.target.value})} placeholder="https://..." className="bg-zinc-950 border-zinc-900 h-14 rounded-2xl text-xs font-mono"/>
                </div>
                
                <div className="space-y-4 p-6 border border-zinc-900 rounded-[2rem] bg-zinc-950/50">
                    <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block"><Github className="w-3 h-3 inline mr-1" /> GITHUB REPOSITORY</Label>
                    
                    <div className="flex gap-2">
                        <Input value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} placeholder="GitHub Username" className="bg-zinc-950 border-zinc-800 text-xs font-mono max-w-[150px]"/>
                        <Button type="button" onClick={fetchGithubRepos} variant="outline" className="border-zinc-800 text-xs h-10" disabled={fetchingRepos}>
                            {fetchingRepos ? <Loader2 className="w-4 h-4 animate-spin" /> : "FETCH"}
                        </Button>
                    </div>

                    {repos.length > 0 && (
                        <div className="max-h-40 overflow-y-auto border border-zinc-800 rounded-xl bg-black scrollbar-hide">
                            {repos.map((repoUrl: string) => (
                                <div 
                                    key={repoUrl}
                                    onClick={() => setNewProject({...newProject, github: repoUrl})}
                                    className={`p-3 text-xs font-mono cursor-pointer transition-colors ${newProject.github === repoUrl ? "bg-purple-500/20 text-purple-400" : "hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300"}`}
                                >
                                    {repoUrl.replace("https://github.com/", "")}
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="relative group">
                        <Input value={newProject.github} onChange={(e) => setNewProject({...newProject, github: e.target.value})} placeholder="Or paste full https://github.com/... url" className="bg-black border-zinc-800 h-14 rounded-2xl text-xs font-mono"/>
                    </div>
                </div>
            </div>

            <TechPicker 
                label="FRONTEND_STACK" 
                category="frontend" 
                selected={newProject.skills.frontend || []} 
                onToggle={toggleSkill} 
            />
            
            <TechPicker 
                label="BACKEND_STACK" 
                category="backend" 
                selected={newProject.skills.backend || []} 
                onToggle={toggleSkill} 
            />
        </div>
    );
};

const ExperienceForm = ({ newExperience, setNewExperience }: any) => {
    const toggleSkill = (skillName: string) => {
        setNewExperience((prev: any) => {
            const current = prev.skills;
            const updated = current.includes(skillName) 
                ? current.filter((s: string) => s !== skillName)
                : [...current, skillName];
            return { ...prev, skills: updated };
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">POSITION_TITLE</Label>
                <Input value={newExperience.title} onChange={(e) => setNewExperience({...newExperience, title: e.target.value})} placeholder="Senior Architect" required className="bg-zinc-950 border-zinc-900 h-14 rounded-2xl font-black italic"/>
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">COMPANY_ENTITY</Label>
                <Input value={newExperience.company} onChange={(e) => setNewExperience({...newExperience, company: e.target.value})} placeholder="GLOBAL_TECH_INC" required className="bg-zinc-950 border-zinc-900 h-14 rounded-2xl font-black italic"/>
            </div>

            <div className="grid grid-cols-2 gap-6 text-left">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">START_MISSION</Label>
                    <Input value={newExperience.startDate} onChange={(e) => setNewExperience({...newExperience, startDate: e.target.value})} placeholder="MAR 2024" required className="bg-zinc-950 border-zinc-900 h-14 rounded-2xl font-mono text-xs"/>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">END_MISSION</Label>
                    <Input value={newExperience.endDate} onChange={(e) => setNewExperience({...newExperience, endDate: e.target.value})} placeholder="Present" className="bg-zinc-950 border-zinc-900 h-14 rounded-2xl font-mono text-xs"/>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">ACHIEVEMENTS (LINE_BY_LINE)</Label>
                <Textarea value={newExperience.description} onChange={(e) => setNewExperience({...newExperience, description: e.target.value})} placeholder="» Optimized core algorithms...\n» Led a team of 10..." required className="bg-zinc-950 border-zinc-900 min-h-[150px] rounded-[1.5rem] font-mono text-xs italic p-6"/>
            </div>

            <TechPicker 
                label="UTILIZED_TECHNOLOGIES" 
                selected={newExperience.skills} 
                onToggle={toggleSkill} 
            />
        </div>
    );
};

const BlogForm = ({ newBlog, setNewBlog, uploading, handleFileUpload }: any) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">ARTICLE_HEADING</Label>
                <Input value={newBlog.title} onChange={(e) => setNewBlog({...newBlog, title: e.target.value})} placeholder="THE_FUTURE_OF_ML" required className="bg-zinc-950 border-zinc-900 h-14 rounded-2xl font-black italic"/>
            </div>
            
            <ImageUpload 
                label="COVER_IMAGE" 
                value={newBlog.coverImage} 
                onChange={(val: string) => setNewBlog({...newBlog, coverImage: val})} 
                onUpload={(file: File) => handleFileUpload(file, "blogs")}
                uploading={uploading}
            />

            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">MARKDOWN_BODY</Label>
                <Textarea value={newBlog.content} onChange={(e) => setNewBlog({...newBlog, content: e.target.value})} placeholder="# Header\nYour log entry..." required className="bg-zinc-950 border-zinc-900 min-h-[300px] rounded-[1.5rem] font-mono text-xs italic p-8"/>
            </div>
            
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">TAGS (COMMA_SEPARATED)</Label>
                <Input value={newBlog.tags} onChange={(e) => setNewBlog({...newBlog, tags: e.target.value})} placeholder="ml, react, cloud" className="bg-zinc-950 border-zinc-900 h-14 rounded-2xl font-mono text-xs italic"/>
            </div>
        </div>
    );
};

const ListItem = ({ item, activeTab, handleDelete }: any) => {
    return (
        <div className="group flex items-center justify-between p-4 md:p-6 bg-zinc-950/40 border border-zinc-900 rounded-[2rem] hover:border-purple-500/30 transition-all hover:bg-zinc-900/10 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Button onClick={() => handleDelete(item._id)} size="icon" variant="ghost" className="text-zinc-800 hover:text-red-500 transition-all">
                    <Trash2 className="w-5 h-5" />
                </Button>
            </div>
            
            <div className="flex items-center gap-6">
                {activeTab !== "experience" && (
                    <div className="w-24 h-24 bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-inner group-hover:scale-105 transition-transform duration-500">
                        <img 
                            src={item.src || item.coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"} 
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300" 
                        />
                    </div>
                )}
                <div className="text-left flex-1 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg md:text-xl font-black tracking-tighter uppercase italic text-zinc-300 group-hover:text-white transition-colors">{item.title}</h3>
                        {activeTab === "blogs" && (
                            item.isPublished ? <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[6px] tracking-tighter">LIVE</Badge> : <Badge variant="outline" className="text-[6px] text-zinc-700 tracking-tighter">DRAFT</Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.15em] text-zinc-600">
                        <span className="flex items-center gap-1.5">
                            {item.category === "work" ? <Briefcase className="w-2.5 h-2.5" /> : (item.category ? item.category : (item.tags ? "TAGGED" : "OFFLINE"))}
                        </span>
                        <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                        <span>{item.startDate ? `${item.startDate}_TO_${item.endDate}` : (new Date(item.publishedAt || item.createdAt).toLocaleDateString())}</span>
                    </div>

                    <div className="flex gap-1 mt-3 opacity-30 group-hover:opacity-100 transition-opacity scrollbar-hide overflow-x-auto max-w-[200px] md:max-w-md">
                        {item.skills?.frontend?.map((s: string) => (
                           <div key={s} className="w-6 h-6 p-1.5 bg-zinc-900 rounded-lg flex-shrink-0">
                               <img src={SKILLS[s as SkillNames]?.icon} className="w-full h-full object-contain" />
                           </div>
                        ))}
                        {item.skills?.backend?.map((s: string) => (
                           <div key={s} className="w-6 h-6 p-1.5 bg-zinc-900 rounded-lg flex-shrink-0">
                               <img src={SKILLS[s as SkillNames]?.icon} className="w-full h-full object-contain" />
                           </div>
                        ))}
                        {item.skills && !item.skills.frontend && item.skills.map((s: string) => (
                            <div key={s} className="w-6 h-6 p-1.5 bg-zinc-900 rounded-lg flex-shrink-0">
                                <img src={SKILLS[s as SkillNames]?.icon} className="w-full h-full object-contain" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col gap-2 invisible group-hover:visible translate-x-12 group-hover:translate-x-0 transition-all duration-300">
                <ChevronRight className="w-4 h-4 text-purple-500" />
            </div>
        </div>
    );
};
