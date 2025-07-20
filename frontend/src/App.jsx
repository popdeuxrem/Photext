import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import EditorPage from './pages/EditorPage';
import DashboardPage from './pages/DashboardPage';
import { Toaster } from './components/ui/toaster';
import JobStatusPanel from './components/editor/JobStatusPanel'; // <-- IMPORT

export const AuthContext = createContext();

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ session }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/editor/:projectId" element={<EditorPage />} />
        </Routes>
        <Toaster />
        <JobStatusPanel /> {/* <-- RENDER THE PANEL */}
    </AuthContext.Provider>
  );
}

export default App;
