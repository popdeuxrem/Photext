# PhoText Clone - AI-Powered Image Text Editor

This is a complete clone of a PhoText-style application, built entirely with a free-tier tech stack. It allows users to upload an image, automatically detects text using OCR, edit the text on a canvas, use AI to rewrite or grammar-check the text, and save their work.

## ✨ Features

* **Image Upload**: Upload any image to start.
* **Automatic OCR**: Text is automatically detected and overlaid on the image.
* **Canvas Editor**: Move, resize, edit, and delete text boxes.
* **Font Customization**: Choose from a list of fonts.
* **AI Rewrite**: Select text and get rewrite suggestions from an AI model.
* **Grammar Check**: Check your text for grammatical errors.
* **Save/Load Sessions**: Authenticated users can save their projects and continue later.
* **Export**: Export the final image as a PNG or JPG.
* **Guest Access**: Try the editor without creating an account.

## 🛠️ Tech Stack

* **Frontend**: React (Vite), Fabric.js, Tailwind CSS, shadcn/ui
* **Backend**: Supabase (Database, Auth, Storage, Edge Functions)
* **Deployment**: Vercel (Frontend), Supabase (Backend)
* **APIs**:
    * **OCR**: [ocr.space](https://ocr.space/ocrapi)
    * **Rewrite**: [OpenRouter.ai](https://openrouter.ai/)
    * **Grammar**: [LanguageTool.org](https://languagetool.org/http-api)

## 🚀 Getting Started

Follow these instructions to get the project running locally and deploy it.

### 1. Setup Supabase

1.  **Create a Project**: Go to [supabase.com](https://supabase.com), sign up, and create a new project.
2.  **Get API Keys**: In your Supabase project dashboard, go to **Project Settings** > **API**. Find your **Project URL** and `anon` **public key**.
3.  **Database Schema**: Go to the **SQL Editor** and run the following SQL to create the `projects` table:

    ```sql
    CREATE TABLE projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      name TEXT,
      canvas_data JSONB,
      original_image_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Enable Row Level Security
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

    -- Policy: Users can see their own projects
    CREATE POLICY "Allow users to view their own projects"
    ON projects FOR SELECT
    USING (auth.uid() = user_id);

    -- Policy: Users can create projects for themselves
    CREATE POLICY "Allow users to create their own projects"
    ON projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

    -- Policy: Users can update their own projects
    CREATE POLICY "Allow users to update their own projects"
    ON projects FOR UPDATE
    USING (auth.uid() = user_id);
    ```

4.  **Storage Bucket**: Go to **Storage**, create a new bucket named `project-images`, and make it **public**.

### 2. Setup External APIs

1.  **OpenRouter (Rewrite)**: Sign up at [OpenRouter.ai](https://openrouter.ai/) and get your API key.
2.  **ocr.space (OCR)**: Go to [https://ocr.space/ocrapi](https://ocr.space/ocrapi) and register for a free API key.

### 3. Local Frontend Setup

1.  Navigate to the `frontend` folder: `cd frontend`
2.  Create an environment file: `cp .env.example .env`
3.  Fill in your Supabase keys in the `.env` file.
4.  Install dependencies: `npm install`
5.  Run the development server: `npm run dev`

### 4. Backend Function Deployment (Supabase CLI)

1.  Install the Supabase CLI: `npm install -g supabase`
2.  Login: `supabase login`
3.  Link your project: `supabase link --project-ref YOUR_PROJECT_ID`
4.  Set API secrets:
    ```bash
    supabase secrets set OPENROUTER_API_KEY="YOUR_OPENROUTER_KEY"
    supabase secrets set OCR_SPACE_API_KEY="YOUR_OCR_SPACE_KEY"
    ```
5.  Deploy the functions: `supabase functions deploy`

### 5. Deployment to Vercel

1.  Push your code to a GitHub repository.
2.  Create a new Vercel project and import your repository.
3.  Configure the project:
    * Vercel should detect it's a Vite project. The settings in `vercel.json` will point to the `frontend` directory.
    * Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in Vercel.
4.  Deploy!
