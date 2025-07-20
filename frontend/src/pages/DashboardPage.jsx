import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { AuthContext } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function DashboardPage() {
    const { session } = useContext(AuthContext);
    const navigate = useNavigate();
    const { toast } = useToast();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session) {
            navigate('/auth');
        } else {
            fetchProjects();
        }
    }, [session, navigate]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('id, name, original_image_url, updated_at')
                .eq('user_id', session.user.id)
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setProjects(data);
        } catch (error) {
            toast({ title: "Error", description: "Could not fetch your projects.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const deleteProject = async (projectId) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        
        try {
            const { error } = await supabase.from('projects').delete().eq('id', projectId);
            if (error) throw error;
            toast({ title: "Success", description: "Project deleted." });
            fetchProjects(); // Refresh the list
        } catch (error) {
            toast({ title: "Error", description: "Could not delete the project.", variant: "destructive" });
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading your projects...</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Projects</h1>
                <Button asChild>
                    <Link to="/editor">Create New Project</Link>
                </Button>
            </div>
            {projects.length === 0 ? (
                <p>You haven't created any projects yet. Get started by creating a new one!</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {projects.map(project => (
                        <Card key={project.id}>
                            <CardHeader>
                                <img src={project.original_image_url} alt={project.name} className="rounded-t-lg aspect-video object-cover"/>
                                <CardTitle className="pt-4">{project.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500">
                                    Last updated: {new Date(project.updated_at).toLocaleDateString()}
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button asChild variant="outline">
                                    <Link to={`/editor/${project.id}`}><Edit className="h-4 w-4 mr-2" />Open</Link>
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => deleteProject(project.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
