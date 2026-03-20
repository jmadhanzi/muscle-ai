import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import PersonalIdentity from "./pages/PersonalIdentity.tsx";
import MedicationProfile from "./pages/MedicationProfile.tsx";
import BodyMetrics from "./pages/onboarding/BodyMetrics.tsx";
import ActivityLevel from "./pages/onboarding/ActivityLevel.tsx";
import FitnessGoals from "./pages/onboarding/FitnessGoals.tsx";
import BodyConcerns from "./pages/onboarding/BodyConcerns.tsx";
import OnboardingSummary from "./pages/onboarding/OnboardingSummary.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import SubscriptionPage from "./pages/SubscriptionPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/personal-identity" element={<ProtectedRoute><PersonalIdentity /></ProtectedRoute>} />
            <Route path="/medication-profile" element={<ProtectedRoute><MedicationProfile /></ProtectedRoute>} />
            <Route path="/onboarding/body-metrics" element={<ProtectedRoute><BodyMetrics /></ProtectedRoute>} />
            <Route path="/onboarding/activity" element={<ProtectedRoute><ActivityLevel /></ProtectedRoute>} />
            <Route path="/onboarding/goals" element={<ProtectedRoute><FitnessGoals /></ProtectedRoute>} />
            <Route path="/onboarding/concerns" element={<ProtectedRoute><BodyConcerns /></ProtectedRoute>} />
            <Route path="/onboarding/summary" element={<ProtectedRoute><OnboardingSummary /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
