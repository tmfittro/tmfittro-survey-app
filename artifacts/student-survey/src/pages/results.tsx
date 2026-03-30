import { useNavigate, useLocation } from "react-router-dom";

interface SurveyResult {
  major: string;
  year: string;
  studyHours: string;
  activities: string[];
  stressLevel: string;
  improvement: string;
}

function getFeedback(state: SurveyResult): { title: string; body: string; accent: string }[] {
  const tips: { title: string; body: string; accent: string }[] = [];

  if (state.stressLevel === "High") {
    tips.push({
      title: "Managing a high stress load",
      body:
        "It's completely normal to feel overwhelmed, especially in college. Try breaking your workload into smaller daily goals, protect at least one hour of unscheduled time each day, and don't hesitate to visit your campus counseling center — that's what it's there for.",
      accent: "border-red-200 bg-red-50",
    });
  } else if (state.stressLevel === "Medium") {
    tips.push({
      title: "Keeping stress in check",
      body:
        "You're managing a moderate stress level — a good sign that you're keeping things mostly in balance. To stay there, try scheduling short breaks between study sessions and checking in with yourself weekly to catch burnout before it builds.",
      accent: "border-amber-200 bg-amber-50",
    });
  } else {
    tips.push({
      title: "Great stress balance",
      body:
        "Low stress is a real achievement in college. Keep doing whatever is working — whether that's a solid routine, good sleep, or staying connected socially. Share your approach with friends who might be struggling.",
      accent: "border-emerald-200 bg-emerald-50",
    });
  }

  const hours = state.studyHours;
  if (hours === "0–5") {
    tips.push({
      title: "Building stronger study habits",
      body:
        "Studying 5 hours or fewer per week can make it hard to keep up, especially as coursework intensifies. Even adding one focused 45-minute session per day can make a significant difference. Try the Pomodoro method: 25 minutes on, 5 minutes off.",
      accent: "border-indigo-200 bg-indigo-50",
    });
  } else if (hours === "6–10") {
    tips.push({
      title: "A healthy study rhythm",
      body:
        "6–10 hours per week is a solid baseline. To get more from your study time, focus on active recall — testing yourself rather than re-reading notes. Even small consistency improvements compound over a semester.",
      accent: "border-indigo-200 bg-indigo-50",
    });
  } else if (hours === "11–15") {
    tips.push({
      title: "Strong academic commitment",
      body:
        "You're investing real time in your studies. Make sure quality matches quantity — vary your study environments, space out review sessions, and take care of sleep so all that effort actually sticks.",
      accent: "border-indigo-200 bg-indigo-50",
    });
  } else {
    tips.push({
      title: "Watch for burnout",
      body:
        "Studying 16+ hours a week shows serious dedication, but it's easy to tip into diminishing returns. Schedule deliberate rest — your brain consolidates learning during downtime. One full day off per week can actually improve your overall output.",
      accent: "border-orange-200 bg-orange-50",
    });
  }

  const acts = state.activities;
  if (acts.includes("Exercise")) {
    tips.push({
      title: "Exercise is your secret weapon",
      body:
        "Physical activity is one of the most research-backed ways to improve focus, reduce anxiety, and boost mood. Keep it up — even 20 minutes of movement a day makes a measurable difference in academic performance.",
      accent: "border-sky-200 bg-sky-50",
    });
  } else {
    tips.push({
      title: "Consider adding some movement",
      body:
        "Even light physical activity — a 15-minute walk between classes, a campus rec session twice a week — has been shown to reduce stress and improve memory retention. It doesn't have to be intense to help.",
      accent: "border-sky-200 bg-sky-50",
    });
  }

  if (state.year === "Freshman") {
    tips.push({
      title: "Making the most of your first year",
      body:
        "Your first year sets the tone. Focus on building routines early, connecting with at least a few people in your major, and finding one or two clubs or activities that energize you. Academic habits formed now will carry you through.",
      accent: "border-violet-200 bg-violet-50",
    });
  } else if (state.year === "Senior") {
    tips.push({
      title: "The home stretch",
      body:
        "Senior year brings its own pressures — capstone projects, job searches, and the weight of what comes next. Be intentional about finishing strong while also celebrating how far you've come. You've built real skills.",
      accent: "border-violet-200 bg-violet-50",
    });
  }

  return tips;
}

const STRESS_STYLE: Record<string, string> = {
  Low: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  High: "bg-red-100 text-red-700 border-red-200",
};

export default function ResultsPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: SurveyResult | null };

  if (!state) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-800 mb-1">No results to show</h2>
          <p className="text-sm text-slate-500 mb-5">
            It looks like you navigated here directly. Please complete the survey first.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 transition"
          >
            Take the survey
          </button>
        </div>
      </div>
    );
  }

  const feedback = getFeedback(state);

  const summaryItems: { label: string; value: React.ReactNode }[] = [
    { label: "Major", value: state.major || <span className="italic text-slate-400">Not provided</span> },
    { label: "Year", value: state.year },
    { label: "Study hours / week", value: `${state.studyHours} hours` },
    {
      label: "Outside activities",
      value: (
        <div className="flex flex-wrap gap-1.5 mt-0.5">
          {state.activities.map((a) => (
            <span key={a} className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-medium rounded-full px-3 py-0.5">
              {a}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: "Stress level",
      value: (
        <span className={`inline-block border text-xs font-semibold rounded-full px-3 py-0.5 ${STRESS_STYLE[state.stressLevel] ?? "bg-slate-100 text-slate-700"}`}>
          {state.stressLevel}
        </span>
      ),
    },
    {
      label: "Improvement idea",
      value: state.improvement || <span className="italic text-slate-400">None provided</span>,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Thank-you header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
            Response saved
          </span>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Thank you, {state.year}!
          </h1>
          <p className="mt-3 text-slate-500 max-w-md mx-auto leading-relaxed">
            Your response has been recorded. Based on what you shared, here is a bit of personalized feedback to help you thrive this semester.
          </p>
        </div>

        {/* Feedback cards */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Personalized feedback</h2>
          {feedback.map((tip, i) => (
            <div key={i} className={`rounded-2xl border p-5 ${tip.accent}`}>
              <h3 className="text-sm font-semibold text-slate-800 mb-1">{tip.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{tip.body}</p>
            </div>
          ))}
        </div>

        {/* Response summary */}
        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Your responses</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100">
            {summaryItems.map(({ label, value }, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 px-6 py-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-44 shrink-0 pt-0.5">
                  {label}
                </span>
                <span className="text-sm text-slate-800">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer action */}
        <div className="text-center pb-4">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm px-5 py-2.5 transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Take the survey again
          </button>
        </div>
      </div>
    </div>
  );
}
