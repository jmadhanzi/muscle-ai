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
import WeightGoals from "./pages/onboarding/WeightGoals.tsx";
import MuscleConcern from "./pages/onboarding/MuscleConcern.tsx";
import FitnessLevel from "./pages/onboarding/FitnessLevel.tsx";
import ProteinIntake from "./pages/onboarding/ProteinIntake.tsx";
import PrimaryGoal from "./pages/onboarding/PrimaryGoal.tsx";
import OnboardingSummary from "./pages/onboarding/OnboardingSummary.tsx";
import BiggestFear from "./pages/onboarding/BiggestFear.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import SubscriptionPage from "./pages/SubscriptionPage.tsx";
import AICoachPage from "./pages/AICoachPage.tsx";
import WorkoutsPage from "./pages/WorkoutsPage.tsx";
import NutritionPage from "./pages/NutritionPage.tsx";
import ProgressPage from "./pages/ProgressPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
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
            <Route path="/onboarding/weight" element={<ProtectedRoute><WeightGoals /></ProtectedRoute>} />
            <Route path="/onboarding/muscle-concern" element={<ProtectedRoute><MuscleConcern /></ProtectedRoute>} />
            <Route path="/onboarding/fitness-level" element={<ProtectedRoute><FitnessLevel /></ProtectedRoute>} />
            <Route path="/onboarding/protein" element={<ProtectedRoute><ProteinIntake /></ProtectedRoute>} />
            <Route path="/onboarding/goals" element={<ProtectedRoute><PrimaryGoal /></ProtectedRoute>} />
            <Route path="/onboarding/fear" element={<ProtectedRoute><BiggestFear /></ProtectedRoute>} />
            <Route path="/onboarding/summary" element={<ProtectedRoute><OnboardingSummary /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/subscribe" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
            <Route path="/coach" element={<ProtectedRoute><AICoachPage /></ProtectedRoute>} />
            <Route path="/workouts" element={<ProtectedRoute><WorkoutsPage /></ProtectedRoute>} />
            <Route path="/nutrition" element={<ProtectedRoute><NutritionPage /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
