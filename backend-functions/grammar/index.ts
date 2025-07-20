import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LANGUAGETOOL_API_URL = "https://api.languagetool.org/v2/check";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    if (!text) throw new Error("Text is required");

    const params = new URLSearchParams({
      language: "en-US",
      text: text,
    });

    const response = await fetch(`${LANGUAGETOOL_API_URL}?${params.toString()}`, {
      method: "POST",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LanguageTool API failed: ${errorText}`);
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
