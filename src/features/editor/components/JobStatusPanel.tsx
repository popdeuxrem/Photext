'use client';

import { useAppStore } from '@/shared/store/useAppStore';
import { Button } from '@/shared/components/ui/button';
import { X, CheckCircle, Loader, AlertTriangle } from 'lucide-react';

const statusIcons = {
    processing: <Loader className="h-4 w-4 mr-2 animate-spin" />,
    completed: <CheckCircle className="h-4 w-4 mr-2 text-green-500" />,
    failed: <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />,
};

export function JobStatusPanel() {
    const { jobs, removeJob } = useAppStore();
    if (jobs.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-2xl z-50 p-4 border animate-in slide-in-from-bottom">
            <h4 className="font-semibold text-sm mb-2">AI Background Tasks</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {jobs.map(job => (
                    <div key={job.id} className="flex items-center text-sm p-2 bg-slate-50 rounded-md">
                        {statusIcons[job.status]}
                        <span className="flex-grow">{job.text}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeJob(job.id)}><X className="h-4 w-4" /></Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
