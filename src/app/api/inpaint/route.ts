import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { imageUrl, maskUrl } = await request.json();
  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
  
  if (!REPLICATE_API_TOKEN) {
    return NextResponse.json({ error: 'Replicate API token not configured.' }, { status: 500 });
  }

  try {
    let response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "stability-ai/stable-diffusion-2-inpainting:42a922d057116a4147de4d9494a72d4242637996594d76a524add860a6316694",
        input: { image: imageUrl, mask: maskUrl, prompt: "A clean background with no text." },
      }),
    });
    
    let prediction = await response.json();
    
    while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const pollResponse = await fetch(prediction.urls.get, {
          headers: { "Authorization": `Token ${REPLICATE_API_TOKEN}` }
      });
      prediction = await pollResponse.json();
    }
    
    if (prediction.status === 'failed') {
      return NextResponse.json({ error: prediction.error }, { status: 500 });
    }

    return NextResponse.json({ inpaintedImageUrl: prediction.output[0] });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
