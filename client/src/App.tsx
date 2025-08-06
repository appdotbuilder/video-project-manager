
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import { Edit, Trash2, Plus, Calendar, FileText } from 'lucide-react';
import type { VideoProject, CreateVideoProjectInput, UpdateVideoProjectInput } from '../../server/src/schema';

function App() {
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProject, setEditingProject] = useState<VideoProject | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Form state for creating projects
  const [createFormData, setCreateFormData] = useState<CreateVideoProjectInput>({
    name: '',
    description: null
  });

  // Form state for editing projects
  const [editFormData, setEditFormData] = useState<UpdateVideoProjectInput>({
    id: 0,
    name: '',
    description: null
  });

  // Load all projects
  const loadProjects = useCallback(async () => {
    try {
      const result = await trpc.getVideoProjects.query();
      setProjects(result);
    } catch (error) {
      console.error('Failed to load video projects:', error);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Create project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await trpc.createVideoProject.mutate(createFormData);
      setProjects((prev: VideoProject[]) => [...prev, response]);
      setCreateFormData({ name: '', description: null });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update project
  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    
    setIsLoading(true);
    try {
      const response = await trpc.updateVideoProject.mutate(editFormData);
      setProjects((prev: VideoProject[]) =>
        prev.map((project: VideoProject) => 
          project.id === response.id ? response : project
        )
      );
      setIsEditDialogOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Failed to update project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete project
  const handleDeleteProject = async (projectId: number) => {
    try {
      await trpc.deleteVideoProject.mutate({ id: projectId });
      setProjects((prev: VideoProject[]) =>
        prev.filter((project: VideoProject) => project.id !== projectId)
      );
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  // Open edit dialog
  const openEditDialog = (project: VideoProject) => {
    setEditingProject(project);
    setEditFormData({
      id: project.id,
      name: project.name,
      description: project.description
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎬 Video Project Manager
          </h1>
          <p className="text-lg text-gray-600">
            Create, manage, and organize your video projects
          </p>
        </div>

        {/* Create Project Button */}
        <div className="flex justify-center mb-8">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg">
                <Plus className="mr-2 h-5 w-5" />
                Create New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Video Project</DialogTitle>
                <DialogDescription>
                  Create a new video project to get started.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <Input
                  placeholder="Project name"
                  value={createFormData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCreateFormData((prev: CreateVideoProjectInput) => ({ 
                      ...prev, 
                      name: e.target.value 
                    }))
                  }
                  required
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={createFormData.description || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setCreateFormData((prev: CreateVideoProjectInput) => ({
                      ...prev,
                      description: e.target.value || null
                    }))
                  }
                  rows={3}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Project'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📹</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No projects yet
            </h2>
            <p className="text-gray-500 mb-6">
              Create your first video project to get started!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: VideoProject) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow duration-200 bg-white/80 backdrop-blur">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold text-gray-900 mb-1">
                        {project.name}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="mr-1 h-4 w-4" />
                        {project.created_at.toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      Video
                    </Badge>
                  </div>
                </CardHeader>
                
                {project.description && (
                  <CardContent>
                    <div className="flex items-start">
                      <FileText className="mr-2 h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </CardContent>
                )}
                
                <CardFooter className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(project)}
                    className="flex-1 mr-2"
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="flex-1 ml-2">
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{project.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteProject(project.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Project Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Update your video project details.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateProject} className="space-y-4">
              <Input
                placeholder="Project name"
                value={editFormData.name || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditFormData((prev: UpdateVideoProjectInput) => ({ 
                    ...prev, 
                    name: e.target.value 
                  }))
                }
                required
              />
              <Textarea
                placeholder="Description (optional)"
                value={editFormData.description || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setEditFormData((prev: UpdateVideoProjectInput) => ({
                    ...prev,
                    description: e.target.value || null
                  }))
                }
                rows={3}
              />
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Project'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default App;
