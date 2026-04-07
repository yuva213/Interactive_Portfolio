"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/ace-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/ace-textarea";
import { Plus, Trash2, Edit2, Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingTask, setAddingTask] = useState(false);
  const router = useRouter();

  const [newProject, setNewProject] = useState({
    title: "",
    category: "",
    description: "",
    src: "",
    live: "",
    github: "",
    skills: { frontend: [], backend: [] },
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects");
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
        fetchProjects();
        setNewProject({
          title: "",
          category: "",
          description: "",
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

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchProjects();
    } catch (err) {
      console.error("Failed to delete project");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              Portfolio Admin
            </h1>
            <p className="text-zinc-500 font-mono text-sm mt-2">Manage your projects and content</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 border-2">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Add Project Form */}
          <section className="lg:col-span-1 space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <Plus className="w-5 h-5 mr-3 text-white" /> Add New Project
                </h2>
                <form onSubmit={handleAddProject} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                    id="title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="e.g. THALA-CREDIT"
                    required
                     className="bg-black border-zinc-800"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                    id="category"
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    placeholder="e.g. Credit Management"
                    required
                     className="bg-black border-zinc-800"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Brief overview of the project"
                    required
                     className="bg-black border-zinc-800 h-32"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="src">Image URL (Thumbnail)</Label>
                    <Input
                    id="src"
                    value={newProject.src}
                    onChange={(e) => setNewProject({ ...newProject, src: e.target.value })}
                    placeholder="https://... | /assets/..."
                    required
                     className="bg-black border-zinc-800"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="live">Live URL</Label>
                        <Input
                        id="live"
                        value={newProject.live}
                        onChange={(e) => setNewProject({ ...newProject, live: e.target.value })}
                        placeholder="https://..."
                         className="bg-black border-zinc-800"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="github">Repo URL</Label>
                        <Input
                        id="github"
                        value={newProject.github}
                        onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                        placeholder="https://github.com/..."
                         className="bg-black border-zinc-800"
                        />
                    </div>
                </div>
                <Button type="submit" className="w-full bg-white text-black font-bold h-12 mt-6 outline-none border-none ring-0 focus-visible:ring-0" disabled={addingTask}>
                    {addingTask ? <Loader2 className="animate-spin" /> : "Save Project"}
                </Button>
                </form>
            </div>
          </section>

          {/* Project List */}
          <section className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              Your Projects ({projects.length})
            </h2>
            {loading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="animate-spin w-8 h-8 text-zinc-500" />
              </div>
            ) : (
                <div className="space-y-4">
                    {projects.map((p: any) => (
                    <div key={p._id} className="group bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/50 transition-all p-6 rounded-2xl flex justify-between items-center">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-lg bg-zinc-800 overflow-hidden">
                                {p.src && <img src={p.src} alt={p.title} className="w-full h-full object-cover opacity-80" />}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold hover:text-white transition-colors">{p.title}</h3>
                                <p className="text-sm text-zinc-500 font-mono mt-1">{p.category}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="text-zinc-600 hover:text-white hover:bg-zinc-800">
                                <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => handleDeleteProject(p._id)} size="icon" variant="ghost" className="text-zinc-600 hover:text-red-500 hover:bg-red-950/20">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    ))}
                    {projects.length === 0 && (
                    <div className="text-center p-20 border-2 border-dashed border-zinc-900 rounded-3xl">
                        <p className="text-zinc-600 font-mono">No projects found. Add one on the left!</p>
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
