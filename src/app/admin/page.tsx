"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/ace-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/ace-textarea";
import { Plus, Trash2, Edit2, Loader2, LogOut, Briefcase, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingTask, setAddingTask] = useState(false);
  const router = useRouter();

  const [newProject, setNewProject] = useState({
    title: "",
    category: "",
    content: "",
    src: "",
    live: "",
    github: "",
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

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "projects") {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
      } else {
        const res = await fetch("/api/experience");
        const data = await res.json();
        setExperiences(data);
      }
    } catch (err) {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingTask(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      if (res.ok) {
        fetchData();
        setNewProject({
          title: "",
          category: "",
          content: "",
          src: "",
          live: "",
          github: "",
          skills: { frontend: [], backend: [] },
        });
      }
    } catch (err) {
      console.error("Failed to add project");
    } finally {
      setAddingTask(false);
    }
  };

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingTask(true);
    try {
      // Convert newline description to array
      const data = {
        ...newExperience,
        description: newExperience.description.split("\n").filter(l => l.trim() !== ""),
      };
      const res = await fetch("/api/admin/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        fetchData();
        setNewExperience({
            title: "",
            company: "",
            startDate: "",
            endDate: "Present",
            description: "",
            skills: [],
            category: "work",
        });
      }
    } catch (err) {
      console.error("Failed to add experience");
    } finally {
      setAddingTask(false);
    }
  };

  const handleDelete = async (id: string, type: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const res = await fetch(`/api/admin/${type}?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(`Failed to delete ${type}`);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-white to-zinc-600 bg-clip-text text-transparent tracking-tighter">
              Admin Panel
            </h1>
            <div className="flex gap-1 mt-4">
              <button 
                onClick={() => setActiveTab("projects")}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "projects" ? "bg-white text-black" : "bg-zinc-900 text-zinc-500 hover:bg-zinc-800"}`}
              >
                Projects
              </button>
              <button 
                onClick={() => setActiveTab("experience")}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "experience" ? "bg-white text-black" : "bg-zinc-900 text-zinc-500 hover:bg-zinc-800"}`}
              >
                Experience
              </button>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-zinc-500 hover:text-red-500 hover:bg-red-950/20 mb-1">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Add Form */}
          <section className="lg:col-span-5">
            <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl sticky top-8">
                <h2 className="text-2xl font-bold mb-8 flex items-center">
                    {activeTab === "projects" ? <Rocket className="w-6 h-6 mr-3" /> : <Briefcase className="w-6 h-6 mr-3" />}
                    Add {activeTab === "projects" ? "Project" : "Experience"}
                </h2>
                
                {activeTab === "projects" ? (
                    <form onSubmit={handleAddProject} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} placeholder="Project Name" required className="bg-black border-zinc-800 focus:border-white transition-all"/>
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Input value={newProject.category} onChange={(e) => setNewProject({...newProject, category: e.target.value})} placeholder="Web App, AI, etc." required className="bg-black border-zinc-800"/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description (Markdown)</Label>
                            <Textarea value={newProject.content} onChange={(e) => setNewProject({...newProject, content: e.target.value})} placeholder="Write about your project..." required className="bg-black border-zinc-800 min-h-[150px]"/>
                        </div>
                        <div className="space-y-2">
                            <Label>Thumbnail URL</Label>
                            <Input value={newProject.src} onChange={(e) => setNewProject({...newProject, src: e.target.value})} placeholder="/assets/... or https://..." required className="bg-black border-zinc-800"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Live Link</Label>
                                <Input value={newProject.live} onChange={(e) => setNewProject({...newProject, live: e.target.value})} placeholder="Visit URL" className="bg-black border-zinc-800"/>
                            </div>
                            <div className="space-y-2">
                                <Label>GitHub Repo</Label>
                                <Input value={newProject.github} onChange={(e) => setNewProject({...newProject, github: e.target.value})} placeholder="Repo URL" className="bg-black border-zinc-800"/>
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-white text-black font-bold h-14 mt-4" disabled={addingTask}>
                            {addingTask ? <Loader2 className="animate-spin" /> : "Publish Project"}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleAddExperience} className="space-y-4">
                         <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label>Job Title / Degree</Label>
                                <Input value={newExperience.title} onChange={(e) => setNewExperience({...newExperience, title: e.target.value})} placeholder="Full Stack Developer" required className="bg-black border-zinc-800"/>
                            </div>
                            <div className="space-y-2">
                                <Label>Company / Institution</Label>
                                <Input value={newExperience.company} onChange={(e) => setNewExperience({...newExperience, company: e.target.value})} placeholder="Microsoft" required className="bg-black border-zinc-800"/>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input value={newExperience.startDate} onChange={(e) => setNewExperience({...newExperience, startDate: e.target.value})} placeholder="Jan 2024" required className="bg-black border-zinc-800"/>
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input value={newExperience.endDate} onChange={(e) => setNewExperience({...newExperience, endDate: e.target.value})} placeholder="Present / Dec 2024" className="bg-black border-zinc-800"/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description (One achievement per line)</Label>
                            <Textarea value={newExperience.description} onChange={(e) => setNewExperience({...newExperience, description: e.target.value})} placeholder="Developed X using Y..." required className="bg-black border-zinc-800 min-h-[150px]"/>
                        </div>
                        <Button type="submit" className="w-full bg-white text-black font-bold h-14 mt-4" disabled={addingTask}>
                            {addingTask ? <Loader2 className="animate-spin" /> : "Save Experience"}
                        </Button>
                    </form>
                )}
            </div>
          </section>

          {/* List Display */}
          <section className="lg:col-span-7">
            <h2 className="text-2xl font-bold mb-8 text-zinc-400">
                {activeTab === "projects" ? `Live Projects (${projects.length})` : `History (${experiences.length})`}
            </h2>
            
            {loading ? (
              <div className="flex justify-center p-20 border border-zinc-900 rounded-3xl bg-zinc-950/20">
                <Loader2 className="animate-spin w-10 h-10 text-zinc-700" />
              </div>
            ) : (
                <div className="space-y-4">
                    {activeTab === "projects" ? projects.map((p: any) => (
                        <div key={p._id} className="group flex items-center justify-between p-6 bg-zinc-900/20 border border-zinc-900 rounded-2xl hover:border-zinc-700 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700">
                                    <img src={p.src} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xl font-bold">{p.title}</h3>
                                    <p className="text-sm text-zinc-500 font-mono italic">{p.category}</p>
                                </div>
                            </div>
                            <Button onClick={() => handleDelete(p._id, "projects")} size="icon" variant="ghost" className="text-zinc-700 hover:text-red-500 hover:bg-red-950/20 transition-all">
                                <Trash2 className="w-5 h-5" />
                            </Button>
                        </div>
                    )) : experiences.map((ex: any) => (
                        <div key={ex._id} className="group flex items-center justify-between p-6 bg-zinc-900/20 border border-zinc-900 rounded-2xl hover:border-zinc-700 transition-all">
                            <div className="text-left">
                                <h3 className="text-xl font-bold">{ex.title}</h3>
                                <p className="text-sm text-zinc-400 font-mono">{ex.company} • {ex.startDate} - {ex.endDate}</p>
                                <p className="text-xs text-zinc-600 mt-2 line-clamp-1 italic">{ex.description[0]}</p>
                            </div>
                            <Button onClick={() => handleDelete(ex._id, "experience")} size="icon" variant="ghost" className="text-zinc-700 hover:text-red-500 hover:bg-red-950/20 transition-all">
                                <Trash2 className="w-5 h-5" />
                            </Button>
                        </div>
                    ))}
                    {(activeTab === "projects" ? projects : experiences).length === 0 && (
                        <div className="p-20 border-2 border-dashed border-zinc-900 rounded-3xl text-center text-zinc-700 font-mono">
                            The space is empty... Start building your legacy.
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
