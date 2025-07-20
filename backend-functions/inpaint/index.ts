import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const REPLICATE_API_TOKEN = Deno.env.get("REPLICATE_API_TOKEN");
const INPAINT_MODEL = "stability-ai/stable-diffusion-2-inpainting:42a922d057116a4147de4d9494a72d4242637996594d76a524add860a6316694";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { imageUrl, maskUrl } = await req.json();

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: INPAINT_MODEL,
        input: {
          image: imageUrl,
          mask: maskUrl,
          prompt: "A clean background with no text.", // A prompt to guide the inpainting
        },
      }),
    });

    const prediction = await response.json();

    // The prediction runs asynchronously, so we need to poll for the result.
    // For simplicity in this example, we will just return the prediction object.
    // A production app would poll the prediction.urls.get endpoint until status is "succeeded".
    return new Response(JSON.stringify(prediction), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
