import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { rewriteText } from '@/api/ai';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export default function RewriteModal({ isOpen, setIsOpen, originalText, onRewrite }) {
    const [suggestion, setSuggestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tone, setTone] = useState('professional');

    const handleGenerate = async () => {
        setIsLoading(true);
        setSuggestion('');
        try {
            const result = await rewriteText(originalText, tone);
            setSuggestion(result.suggestion);
        } catch (error) {
            console.error("Rewrite error:", error);
            setSuggestion("Failed to get suggestion.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccept = () => {
        onRewrite(suggestion);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>AI Rewrite</DialogTitle>
                    <DialogDescription>Get suggestions to improve your text. Select a tone and click generate.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <p className="font-medium text-sm mb-1">Original Text:</p>
                        <p className="p-2 bg-gray-100 rounded-md text-sm max-h-24 overflow-y-auto">{originalText}</p>
                    </div>
                    <div className="flex items-center gap-4">
                         <Select onValueChange={setTone} defaultValue={tone}>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select Tone" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="casual">Casual</SelectItem>
                                <SelectItem value="friendly">Friendly</SelectItem>
                                <SelectItem value="confident">Confident</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleGenerate} disabled={isLoading}>
                            {isLoading ? 'Generating...' : 'Generate'}
                        </Button>
                    </div>
                    <div>
                        <p className="font-medium text-sm mb-1">Suggestion:</p>
                        <Textarea value={suggestion} onChange={e => setSuggestion(e.target.value)} placeholder="AI suggestion will appear here..." />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleAccept} disabled={!suggestion || isLoading}>Accept Suggestion</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
