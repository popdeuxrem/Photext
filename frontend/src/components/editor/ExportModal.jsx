import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';

export default function ExportModal({ fabricCanvas, disabled }) {
    const [format, setFormat] = useState('png');
    const [multiplier, setMultiplier] = useState(2); // for resolution

    const handleExport = () => {
        if (!fabricCanvas) return;

        const dataUrl = fabricCanvas.toDataURL({
            format: format,
            quality: 0.9,
            multiplier: multiplier,
        });

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `photext-export-${Date.now()}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" disabled={disabled}>
                    <Download className="mr-2 h-4 w-4" /> Export
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Export Image</DialogTitle>
                    <DialogDescription>Choose your desired format and resolution.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <Label htmlFor="format">Format</Label>
                        <Select onValueChange={setFormat} defaultValue={format}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="png">PNG</SelectItem>
                                <SelectItem value="jpeg">JPEG</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label htmlFor="resolution">Resolution</Label>
                        <Select onValueChange={(v) => setMultiplier(parseInt(v))} defaultValue={String(multiplier)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Standard (1x)</SelectItem>
                                <SelectItem value="2">High (2x)</SelectItem>
                                <SelectItem value="4">Ultra High (4x)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleExport}>Download Image</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
