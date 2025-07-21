'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Label } from '@/shared/components/ui/label';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '@/shared/store/useAppStore';
import { useToast } from '@/shared/components/ui/use-toast';

type ExportFormat = 'png' | 'svg' | 'json';

export function ExportModal() {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [isOpen, setIsOpen] = useState(false);
  const { fabricCanvas } = useAppStore();
  const { toast } = useToast();

  const handleExport = () => {
    if (!fabricCanvas) return toast({ title: 'Canvas not ready.', variant: 'destructive' });
    let data, mimeType, fileExtension;
    switch (format) {
      case 'svg':
        data = fabricCanvas.toSVG();
        mimeType = 'image/svg+xml';
        fileExtension = 'svg';
        break;
      case 'json':
        data = JSON.stringify(fabricCanvas.toJSON(), null, 2);
        mimeType = 'application/json';
        fileExtension = 'json';
        break;
      default:
        data = fabricCanvas.toDataURL({ format: 'png', multiplier: 2 });
    }
    const link = document.createElement('a');
    link.href = format === 'png' ? data : URL.createObjectURL(new Blob([data], { type: mimeType }));
    link.download = `photext-export-${Date.now()}.${fileExtension || format}`;
    link.click();
    if (format !== 'png') URL.revokeObjectURL(link.href);
    toast({ title: 'Export Successful!' });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild><Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Export Project</DialogTitle><DialogDescription>Choose a format to export your project.</DialogDescription></DialogHeader>
        <div className="py-4"><Label htmlFor="format">Format</Label><Select onValueChange={(v: ExportFormat) => setFormat(v)} defaultValue={format}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="png">PNG (Image)</SelectItem><SelectItem value="svg">SVG (Vector)</SelectItem><SelectItem value="json">JSON (Editable)</SelectItem></SelectContent></Select></div>
        <DialogFooter><Button onClick={handleExport}>Download</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
