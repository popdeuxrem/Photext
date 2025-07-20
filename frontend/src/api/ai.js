import { supabase } from '../lib/supabaseClient';

import { supabase } from '../lib/supabaseClient';

const puter = new Puter();

async function getCroppedImageDataUrl(imageUrl, box) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "Anonymous";
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = box.width;
            canvas.height = box.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, box.left, box.top, box.width, box.height, 0, 0, box.width, box.height);
            resolve(canvas.toDataURL());
        };
        image.onerror = reject;
        image.src = imageUrl;
    });
}

export const detectTextStyle = async (imageUrl, boundingBox) => {
    const croppedImageUrl = await getCroppedImageDataUrl(imageUrl, boundingBox);
    const prompt = `Analyze this image of a text block. Respond with ONLY a valid JSON object with these keys: "fontFamily" (closest matching Google Font), "fontSize" (integer in pixels), "fontWeight" ("normal" or "bold"), "fontStyle" ("normal" or "italic"), "color" (hex code), "text" (the text content).`;
    try {
        const stream = await puter.ai.chat(prompt, croppedImageUrl);
        const reader = stream.getReader();
        let result = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result += value;
        }
        const jsonString = result.substring(result.indexOf('{'), result.lastIndexOf('}') + 1);
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Style Detection error:", error);
        throw new Error("Failed to analyze text style.");
    }
};

// Other AI functions (rewriteText, generateCaption, etc.) are unchanged from previous responses.
// Make sure they are included here as well.


export const processImageWithOCR = async (imageUrl) => {
    const { data, error } = await supabase.functions.invoke('ocr', {
        body: { imageUrl },
    });
    if (error) throw new Error(error.message);
    return data;
};

export const rewriteText = async (text, tone) => {
    const { data, error } = await supabase.functions.invoke('rewrite', {
        body: { text, tone },
    });
    if (error) throw new Error(error.message);
    return data;
};

export const checkGrammar = async (text) => {
    const { data, error } = await supabase.functions.invoke('grammar', {
        body: { text },
    });
    if (error) throw new Error(error.message);
    return data;
};
