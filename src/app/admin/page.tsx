"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/ace-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/ace-textarea";
import { Plus, Trash2, Loader2, LogOut, Briefcase, Rocket, FileText, CheckCircle, Circle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingTask, setAddingTask] = useState(false);
  const router = useRouter();

  // --- States for Creating ---
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
      setItems(data);
    } catch (err) {
      console.error(`Failed to fetch ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

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
        // Reset states
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
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-white to-zinc-600 bg-clip-text text-transparent tracking-tighter">
              YUVA <span className="text-zinc-700">OS</span>
            </h1>
            <div className="flex gap-1 mt-6 border border-zinc-900 rounded-full p-1 bg-zinc-950/20">
              {["projects", "experience", "blogs"].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-white text-black" : "bg-black text-zinc-500 hover:text-zinc-200"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-zinc-500 hover:text-red-500 hover:bg-zinc-900 mb-1">
            <LogOut className="w-4 h-4 mr-2" /> EXIT
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Create Section */}
          <section className="lg:col-span-5">
            <div className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[2rem] sticky top-8 shadow-2xl">
                <h2 className="text-2xl font-black mb-8 flex items-center tracking-tight text-white uppercase italic">
                    {activeTab === "projects" ? <Rocket className="w-6 h-6 mr-3" /> : (activeTab === "experience" ? <Briefcase className="w-6 h-6 mr-3" /> : <FileText className="w-6 h-6 mr-3" />)}
                    ADD {activeTab}
                </h2>
                
                <form onSubmit={handleCreate} className="space-y-4">
                    {activeTab === "projects" && (
                        <>
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-500">Project Title</Label>
                                <Input value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} placeholder="THALA-CREDIT" required className="bg-black border-zinc-800 text-white"/>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-500">Category</Label>
                                <Input value={newProject.category} onChange={(e) => setNewProject({...newProject, category: e.target.value})} placeholder="Web3 / AI / FinTech" required className="bg-black border-zinc-800 text-white"/>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-500">Markdown Content</Label>
                                <Textarea value={newProject.content} onChange={(e) => setNewProject({...newProject, content: e.target.value})} placeholder="Describe your vision..." required className="bg-black border-zinc-800 min-h-[120px]"/>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-500">Thumbnail Path</Label>
                                <Input value={newProject.src} onChange={(e) => setNewProject({...newProject, src: e.target.value})} placeholder="/assets/..." required className="bg-black border-zinc-800"/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input value={newProject.live} onChange={(e) => setNewProject({...newProject, live: e.target.value})} placeholder="LIVE URL" className="bg-black border-zinc-800"/>
                                <Input value={newProject.github} onChange={(e) => setNewProject({...newProject, github: e.target.value})} placeholder="GH REPO" className="bg-black border-zinc-800"/>
                            </div>
                        </>
                    )}

                    {activeTab === "experience" && (
                        <>
                            <div className="space-y-2">
                                <Label>Title / Position</Label>
                                <Input value={newExperience.title} onChange={(e) => setNewExperience({...newExperience, title: e.target.value})} placeholder="MERN Stack Developer" required className="bg-black border-zinc-800"/>
                            </div>
                            <Input value={newExperience.company} onChange={(e) => setNewExperience({...newExperience, company: e.target.value})} placeholder="Company Name" required className="bg-black border-zinc-800"/>
                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-500">START</Label>
                                    <Input value={newExperience.startDate} onChange={(e) => setNewExperience({...newExperience, startDate: e.target.value})} placeholder="Jan 2024" required className="bg-black border-zinc-800"/>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-500">END</Label>
                                    <Input value={newExperience.endDate} onChange={(e) => setNewExperience({...newExperience, endDate: e.target.value})} placeholder="Present" className="bg-black border-zinc-800"/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Achievements (Line by line)</Label>
                                <Textarea value={newExperience.description} onChange={(e) => setNewExperience({...newExperience, description: e.target.value})} placeholder="Did some magic with JS..." required className="bg-black border-zinc-800 min-h-[150px]"/>
                            </div>
                        </>
                    )}

                    {activeTab === "blogs" && (
                        <>
                            <div className="space-y-2">
                                <Label>Blog Post Title</Label>
                                <Input value={newBlog.title} onChange={(e) => setNewBlog({...newBlog, title: e.target.value})} placeholder="How I built a dynamic MERN portfolio" required className="bg-black border-zinc-800"/>
                            </div>
                            <div className="space-y-2">
                                <Label>Markdown Article</Label>
                                <Textarea value={newBlog.content} onChange={(e) => setNewBlog({...newBlog, content: e.target.value})} placeholder="# Header\nYour story begins here..." required className="bg-black border-zinc-800 min-h-[250px]"/>
                            </div>
                            <div className="space-y-2">
                                <Label>Cover Image Path</Label>
                                <Input value={newBlog.coverImage} onChange={(e) => setNewBlog({...newBlog, coverImage: e.target.value})} placeholder="/assets/blogs/banner.png" className="bg-black border-zinc-800"/>
                            </div>
                            <div className="space-y-2">
                                <Label>Tags (Comma separated)</Label>
                                <Input value={newBlog.tags} onChange={(e) => setNewBlog({...newBlog, tags: e.target.value})} placeholder="react, nextjs, mongodb" className="bg-black border-zinc-800"/>
                            </div>
                        </>
                    )}

                    <Button type="submit" className="w-full bg-white text-black font-black h-16 mt-6 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all" disabled={addingTask}>
                        {addingTask ? <Loader2 className="animate-spin" /> : `SAVE ${activeTab.toUpperCase()}`}
                    </Button>
                </form>
            </div>
          </section>

          {/* List Section */}
          <section className="lg:col-span-7">
            <h2 className="text-xl font-black mb-8 text-zinc-600 uppercase tracking-tighter">
                ACTIVE_{activeTab} ({items.length})
            </h2>
            
            {loading ? (
              <div className="flex justify-center p-20 bg-zinc-950/20 border border-zinc-900 rounded-[2rem]">
                <Loader2 className="animate-spin w-12 h-12 text-zinc-800" />
              </div>
            ) : (
                <div className="space-y-3">
                    {items.map((item: any) => (
                        <div key={item._id} className="group flex items-center justify-between p-6 bg-zinc-950/40 border border-zinc-900 rounded-3xl hover:border-zinc-500 transition-all shadow-lg">
                            <div className="flex items-center gap-6">
                                {activeTab !== "experience" && (
                                    <div className="w-20 h-20 bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
                                        <img src={item.src || item.coverImage || "/assets/me.jpg"} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                )}
                                <div className="text-left">
                                    <h3 className="text-xl font-black tracking-tight">{item.title}</h3>
                                    <p className="text-xs text-zinc-500 font-mono flex items-center gap-2">
                                        {activeTab === "blogs" && (item.isPublished ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Circle className="w-3 h-3 text-zinc-700" />)}
                                        {item.company || item.category || (item.tags?.join(", "))} • {item.startDate ? `${item.startDate}` : (new Date(item.publishedAt).toLocaleDateString())}
                                    </p>
                                </div>
                            </div>
                            <Button onClick={() => handleDelete(item._id)} size="icon" variant="ghost" className="text-zinc-800 hover:text-red-500 hover:bg-red-950/20">
                                <Trash2 className="w-6 h-6 outline-none" />
                            </Button>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="p-40 border-2 border-dashed border-zinc-900 rounded-[3rem] text-center">
                            <p className="text-zinc-800 font-black text-3xl uppercase tracking-tighter opacity-30">DATABASE_EMPTY</p>
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
