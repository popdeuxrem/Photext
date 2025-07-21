import React, { useState } from 'react';
// ... other imports
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react'; // <-- ADD ICONS
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; // <-- NEW SHADCN COMPONENT (run: npx shadcn-ui@latest add toggle-group)

// ... FONT_FAMILIES

export default function Toolbar({ fabricCanvas, activeObject, handleImageUpload }) {
    // ... hooks
    
    const updateProperty = (prop, value) => {
        if (activeObject) {
            activeObject.set(prop, value);
            fabricCanvas.renderAll();
        }
    };
    
    // NEW: Toggle style properties like bold/italic
    const toggleStyle = (styleName) => {
        if(activeObject) {
            const currentValue = activeObject.get(styleName);
            activeObject.set(styleName, !currentValue);
            fabricCanvas.renderAll();
        }
    }

    // NEW: Add a new text box
    const addText = () => {
        const text = new fabric.Textbox('New Text', {
            left: 50,
            top: 50,
            width: 150,
            fontSize: 24,
            fill: '#000000',
            fontFamily: 'Arial'
        });
        fabricCanvas.add(text);
        fabricCanvas.setActiveObject(text);
        fabricCanvas.renderAll();
    }

    // ... rest of the functions

    return (
        <aside className="w-72 bg-white p-4 space-y-6 overflow-y-auto shadow-lg flex flex-col">
            {/* ... Upload section ... */}

            <div className="border-t pt-4">
                 <Button onClick={addText} className="w-full" variant="outline">
                    <Type className="mr-2 h-4 w-4" /> Add Text Box
                </Button>
            </div>

            <div className="border-t pt-4 flex-grow">
                <h3 className="font-semibold mb-4">Selected Text Properties</h3>
                <div className="space-y-4 opacity-100 data-[disabled]:opacity-50" data-disabled={!activeObject}>
                    
                    {/* NEW: Styling Toggles */}
                    <div className="space-y-2">
                        <Label>Style</Label>
                        <ToggleGroup type="multiple" disabled={!activeObject} className="justify-start">
                             <ToggleGroupItem value="bold" aria-label="Toggle bold" onClick={() => toggleStyle('fontWeight')} data-state={activeObject?.fontWeight === 'bold' ? 'on' : 'off'}>
                                <Bold className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="italic" aria-label="Toggle italic" onClick={() => toggleStyle('fontStyle')} data-state={activeObject?.fontStyle === 'italic' ? 'on' : 'off'}>
                                <Italic className="h-4 w-4" />
                            </ToggleGroupItem>
                             <ToggleGroupItem value="underline" aria-label="Toggle underline" onClick={() => toggleStyle('underline')} data-state={activeObject?.underline ? 'on' : 'off'}>
                                <Underline className="h-4 w-4" />
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    {/* NEW: Alignment Toggles */}
                    <div className="space-y-2">
                        <Label>Alignment</Label>
                        <ToggleGroup type="single" value={activeObject?.textAlign || 'left'} onValueChange={(value) => value && updateProperty('textAlign', value)} disabled={!activeObject} className="justify-start">
                             <ToggleGroupItem value="left" aria-label="Align left">
                                <AlignLeft className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="center" aria-label="Align center">
                                <AlignCenter className="h-4 w-4" />
                            </ToggleGroupItem>
                             <ToggleGroupItem value="right" aria-label="Align right">
                                <AlignRight className="h-4 w-4" />
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    {/* ... Font Family, Size, and Color inputs ... */}
                </div>
            </div>

            {/* ... AI Tools and Delete sections ... */}
        </aside>
    );
}
