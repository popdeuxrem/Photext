'use client';

import { useAppStore } from "@/shared/store/useAppStore";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

export function TextProperties() {
    const { fabricCanvas, activeObject, saveState } = useAppStore();
    const isText = activeObject && activeObject.type === 'textbox';

    const updateStyle = (prop: string, value: any) => {
        if (isText && activeObject) {
            (activeObject as fabric.Textbox).set(prop as keyof fabric.Textbox, value);
            fabricCanvas?.renderAll();
            saveState('style-update');
        }
    };

    return (
        <div className="border-t pt-4 space-y-4 flex-grow opacity-100 data-[disabled]:opacity-50" data-disabled={!isText}>
            <h3 className="font-semibold mb-2 text-sm">Text Properties</h3>
            <div className="space-y-2">
                <Label>Style</Label>
                <ToggleGroup type="multiple" disabled={!isText}>
                    <ToggleGroupItem value="bold" onClick={() => updateStyle('fontWeight', (activeObject as fabric.Textbox)?.fontWeight === 'bold' ? 'normal' : 'bold')}><Bold className="h-4 w-4" /></ToggleGroupItem>
                    <ToggleGroupItem value="italic" onClick={() => updateStyle('fontStyle', (activeObject as fabric.Textbox)?.fontStyle === 'italic' ? 'normal' : 'italic')}><Italic className="h-4 w-4" /></ToggleGroupItem>
                    <ToggleGroupItem value="underline" onClick={() => updateStyle('underline', !(activeObject as fabric.Textbox)?.underline)}><Underline className="h-4 w-4" /></ToggleGroupItem>
                </ToggleGroup>
            </div>
            <div className="space-y-2">
                <Label>Alignment</Label>
                <ToggleGroup type="single" value={(activeObject as fabric.Textbox)?.textAlign} onValueChange={(v) => v && updateStyle('textAlign', v)} disabled={!isText}>
                    <ToggleGroupItem value="left"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
                    <ToggleGroupItem value="center"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
                    <ToggleGroupItem value="right"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
                </ToggleGroup>
            </div>
            <div className="space-y-2">
                <Label>Font Size</Label>
                <Input type="number" value={Math.round((activeObject as fabric.Textbox)?.fontSize || 0)} onChange={(e) => updateStyle('fontSize', parseInt(e.target.value, 10))} disabled={!isText} />
            </div>
        </div>
    );
}
