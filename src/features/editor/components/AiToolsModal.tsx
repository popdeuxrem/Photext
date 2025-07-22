'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useAppStore } from '@/shared/store/useAppStore';
import { useToast } from '@/shared/components/ui/use-toast';
import { rewriteText, generateCaption } from '@/shared/lib/api';
import { fabric } from 'fabric';

type AiToolsModalProps = { isOpen: boolean; setIsOpen: (open: boolean) => void; };

export function AiToolsModal({ isOpen, setIsOpen }: AiToolsModalProps) {
  const { fabricCanvas, activeObject } = useAppStore();
  const { toast } = useToast();
  const [rewriteTone, setRewriteTone] = useState('professional');
  const [rewrittenText, setRewrittenText] = useState('');
  const [caption, setCaption] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRewrite = async () => {
    const textObject = activeObject as fabric.Textbox;
    if (!textObject || !textObject.text) return toast({ title: 'No text selected.', variant: 'destructive' });
    setIsProcessing(true);
    setRewrittenText('');
    try {
      setRewrittenText(await rewriteText(textObject.text, rewriteTone));
    } catch (error) { toast({ title: 'Rewrite Failed', variant: 'destructive' }) }
    finally { setIsProcessing(false) }
  };

  const applyRewrite = () => {
    if (activeObject && rewrittenText) {
      (activeObject as fabric.Textbox).set('text', rewrittenText);
      fabricCanvas?.renderAll();
      toast({ title: 'Text applied!' });
      setIsOpen(false);
    }
  };

  const handleCaption = async () => {
    const bgImage = fabricCanvas?.backgroundImage as fabric.Image;
    if (!bgImage?.getSrc()) return toast({ title: 'No image on canvas.', variant: 'destructive' });
    setIsProcessing(true);
    setCaption('');
    try {
      setCaption(await generateCaption(bgImage.getSrc()));
    } catch (error) { toast({ title: 'Caption Failed', variant: 'destructive' }) }
    finally { setIsProcessing(false) }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader><DialogTitle>AI Assistant</DialogTitle><DialogDescription>Enhance your content with AI.</DialogDescription></DialogHeader>
        <div className="grid md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
            <h3 className="font-semibold">AI Rewriter</h3>
            {/* FIXED: Replaced double quotes with single quotes to fix linting error */}
            <p className='text-sm truncate'>
              Original: '{activeObject && 'text' in activeObject ? (activeObject as fabric.Textbox).text : 'None'}'
            </p>
            <div className="flex gap-2">
              <Select onValueChange={setRewriteTone} defaultValue="professional">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleRewrite} disabled={!activeObject || isProcessing}>Rewrite</Button>
            </div>
            <Textarea value={rewrittenText} placeholder="Rewritten text..." />
            <Button onClick={applyRewrite} disabled={!rewrittenText}>Apply Text</Button>
          </div>
          <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
            <h3 className="font-semibold">AI Captioner</h3>
            <Button onClick={handleCaption} disabled={isProcessing} className="w-full">Generate Caption</Button>
            <Textarea value={caption} placeholder="Generated caption..." />
            <Button onClick={() => navigator.clipboard.writeText(caption)} disabled={!caption} variant="outline">Copy</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
