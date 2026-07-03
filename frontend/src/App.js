import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "@/screens/Onboarding";
import MissionChat from "@/screens/MissionChat";
import HabitatDashboard from "@/screens/HabitatDashboard";
import DMs from "@/screens/DMs";
import Reflection from "@/screens/Reflection";
import FinalSummary from "@/screens/FinalSummary";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/mission" element={<MissionChat />} />
        <Route path="/dashboard" element={<HabitatDashboard />} />
        <Route path="/dms" element={<DMs />} />
        <Route path="/reflection" element={<Reflection />} />
        <Route path="/final" element={<FinalSummary />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
