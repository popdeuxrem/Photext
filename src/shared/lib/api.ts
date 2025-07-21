// This module provides client-side functions to interact with the Puter.js AI.
// It uses a global `Puter` object injected by the script in `layout.tsx`.
declare const Puter: any;

async function getPuterInstance() {
    if (typeof Puter === 'undefined') {
        // Wait up to 2 seconds for the script to load
        for (let i = 0; i < 20; i++) {
            await new Promise(resolve => setTimeout(resolve, 100));
            if (typeof Puter !== 'undefined') return new Puter();
        }
        throw new Error("Puter.js script could not be loaded.");
    }
    return new Puter();
}

/**
 * Rewrites the given text to match a specific tone.
 * @param text The original text to rewrite.
 * @param tone The desired tone (e.g., 'professional', 'casual').
 * @returns A promise that resolves to the rewritten text.
 */
export const rewriteText = async (text: string, tone: string): Promise<string> => {
    const puter = await getPuterInstance();
    const prompt = `Rewrite the following text to have a more ${tone} tone. Respond with ONLY the rewritten text itself, without any introductory phrases. Text: "${text}"`;
    return await puter.ai.chat(prompt);
};

/**
 * Generates a descriptive caption for an image using GPT-4o Vision.
 * @param imageUrl The URL of the image to analyze.
 * @returns A promise that resolves to the generated caption.
 */
export const generateCaption = async (imageUrl: string): Promise<string> => {
    const puter = await getPuterInstance();
    const prompt = "Generate a concise and descriptive caption for this image, suitable for social media or as alt-text.";
    return await puter.ai.chat(prompt, imageUrl);
};
