import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Summaries from "./pages/Summaries";
import Videos from "./pages/Videos";
import Questions from "./pages/Questions";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import AppLayout from "@/layouts/AppLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
      <BrowserRouter>
  <Routes>

    {/* 🌐 PUBLIC ROUTES (NO NAVBAR) */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />

    {/* 🌐 APP LAYOUT (NAVBAR ONCE) */}
    <Route element={<AppLayout />}>

      {/* PUBLIC PAGE WITH NAVBAR */}
      <Route index element={<Index />} />

      {/* 🔒 PROTECTED PAGES */}
      <Route element={<ProtectedRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="videos" element={<Videos />} />
        <Route path="questions" element={<Questions />} />
        <Route path="summaries" element={<Summaries />} />
        <Route path="profile" element={<Profile />} />
      </Route>

    </Route>

    <Route path="*" element={<NotFound />} />

  </Routes>
</BrowserRouter>


      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
