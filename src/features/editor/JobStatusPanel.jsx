import React from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, Loader, AlertTriangle } from 'lucide-react';

export default function JobStatusPanel() {
    const jobs = useAppStore((state) => state.jobs);
    const removeJob = useAppStore((state) => state.removeJob);

    if (jobs.length === 0) return null;

    const getIcon = (status) => {
        switch (status) {
            case 'processing':
                return <Loader className="h-4 w-4 mr-2 animate-spin text-blue-500" />;
            case 'completed':
                return <CheckCircle className="h-4 w-4 mr-2 text-green-500" />;
            case 'failed':
                 return <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl z-50 p-4 border animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm">AI Background Tasks</h4>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {jobs.map(job => (
                    <div key={job.id} className="flex items-center text-sm p-2 bg-gray-50 rounded">
                        {getIcon(job.status)}
                        <span className="flex-grow text-gray-700">{job.text}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeJob(job.id)}>
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
