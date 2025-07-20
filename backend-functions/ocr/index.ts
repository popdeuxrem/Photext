import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OCR_SPACE_API_KEY = Deno.env.get("OCR_SPACE_API_KEY");
const OCR_API_URL = "https://api.ocr.space/parse/image";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();
    if (!imageUrl) throw new Error("Image URL is required");

    const formData = new FormData();
    formData.append("url", imageUrl);
    formData.append("language", "eng");
    formData.append("isOverlayRequired", "true");

    const response = await fetch(OCR_API_URL, {
      method: "POST",
      headers: { "apikey": OCR_SPACE_API_KEY! },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OCR API failed: ${errorText}`);
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
