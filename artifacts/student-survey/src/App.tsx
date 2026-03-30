import { BrowserRouter, Routes, Route } from "react-router-dom";
import SurveyPage from "@/pages/survey";
import ResultsPage from "@/pages/results";
import NotFound from "@/pages/not-found";

function App() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

  return (
    <BrowserRouter basename={base}>
      <Routes>
        <Route path="/" element={<SurveyPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
