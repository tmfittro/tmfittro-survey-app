import { useState } from "react";
import { useNavigate } from "react-router-dom";

const YEARS = ["Freshman", "Sophomore", "Junior", "Senior"];
const STUDY_HOURS = ["0–5", "6–10", "11–15", "16+"];
const ACTIVITIES = ["Exercise", "Friends", "TV", "Work", "Clubs"];
const STRESS_LEVELS = ["Low", "Medium", "High"];

const SETUP_SQL = `CREATE TABLE IF NOT EXISTS survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  major text,
  year text,
  study_hours text,
  activities text[],
  stress_level text,
  improvement text,
  created_at timestamptz DEFAULT now()
);`;

export default function SurveyPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [studyHours, setStudyHours] = useState("");
  const [activities, setActivities] = useState<string[]>([]);
  const [stressLevel, setStressLevel] = useState("");
  const [improvement, setImprovement] = useState("");

  function toggleActivity(activity: string) {
    setActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!major.trim()) return setError("Please enter your major.");
    if (!year) return setError("Please select your year.");
    if (!studyHours) return setError("Please select your weekly study hours.");
    if (activities.length === 0) return setError("Please select at least one activity.");
    if (!stressLevel) return setError("Please select your stress level.");

    setSubmitting(true);

    try {
      const apiBase = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
      const res = await fetch(`${apiBase}/api/survey`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          major: major.trim(),
          year,
          studyHours,
          activities,
          stressLevel,
          improvement: improvement.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error === "table_missing" ? "table_missing" : (data.error ?? "Submission failed."));
        setSubmitting(false);
        return;
      }

      navigate("/results", {
        state: {
          major: major.trim(),
          year,
          studyHours,
          activities,
          stressLevel,
          improvement: improvement.trim(),
        },
      });
    } catch {
      setError("Could not reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
            Student Survey
          </span>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Student Lifestyle Survey
          </h1>
          <p className="mt-2 text-slate-500">
            Help us understand how students balance academics and campus life.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              1. What is your major?
            </label>
            <p className="text-xs text-slate-400 mb-3">Enter your field of study</p>
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="e.g. Computer Science, Biology, English…"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              2. What year are you?
            </label>
            <p className="text-xs text-slate-400 mb-3">Select your current academic year</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {YEARS.map((y) => (
                <label
                  key={y}
                  className={`flex items-center justify-center gap-2 border rounded-lg px-4 py-2.5 cursor-pointer text-sm font-medium transition
                    ${year === y
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50"
                    }`}
                >
                  <input
                    type="radio"
                    name="year"
                    value={y}
                    checked={year === y}
                    onChange={() => setYear(y)}
                    className="sr-only"
                  />
                  {y}
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              3. How many hours do you study per week?
            </label>
            <p className="text-xs text-slate-400 mb-3">Choose the range that best fits you</p>
            <select
              value={studyHours}
              onChange={(e) => setStudyHours(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition appearance-none cursor-pointer"
            >
              <option value="" disabled>Select hours…</option>
              {STUDY_HOURS.map((h) => (
                <option key={h} value={h}>{h} hours</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              4. What activities do you do outside of school?
            </label>
            <p className="text-xs text-slate-400 mb-3">Select all that apply</p>
            <div className="flex flex-wrap gap-3">
              {ACTIVITIES.map((activity) => {
                const checked = activities.includes(activity);
                return (
                  <label
                    key={activity}
                    className={`flex items-center gap-2 border rounded-lg px-4 py-2.5 cursor-pointer text-sm font-medium transition
                      ${checked
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleActivity(activity)}
                      className="sr-only"
                    />
                    <span
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition
                        ${checked ? "border-indigo-500 bg-indigo-500" : "border-slate-300 bg-white"}`}
                    >
                      {checked && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                          <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    {activity}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              5. How would you rate your current stress level?
            </label>
            <p className="text-xs text-slate-400 mb-3">Select the level that feels most accurate</p>
            <div className="grid grid-cols-3 gap-3">
              {STRESS_LEVELS.map((level) => {
                const colors: Record<string, string> = {
                  Low: stressLevel === level
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/50",
                  Medium: stressLevel === level
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-amber-300 hover:bg-amber-50/50",
                  High: stressLevel === level
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-red-300 hover:bg-red-50/50",
                };
                return (
                  <label
                    key={level}
                    className={`flex items-center justify-center gap-2 border rounded-lg px-4 py-2.5 cursor-pointer text-sm font-medium transition ${colors[level]}`}
                  >
                    <input
                      type="radio"
                      name="stress"
                      value={level}
                      checked={stressLevel === level}
                      onChange={() => setStressLevel(level)}
                      className="sr-only"
                    />
                    {level}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              6. What would most improve your student experience?
            </label>
            <p className="text-xs text-slate-400 mb-3">Optional — share any thoughts or suggestions</p>
            <textarea
              value={improvement}
              onChange={(e) => setImprovement(e.target.value)}
              placeholder="e.g. More flexible class schedules, better mental health resources…"
              rows={3}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition resize-none"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-4 text-sm text-amber-800">
              {error === "table_missing" ? (
                <div>
                  <p className="font-semibold mb-1">One-time database setup required</p>
                  <p className="text-xs text-amber-700 mb-3">
                    Run this SQL once in your{" "}
                    <a
                      href="https://supabase.com/dashboard/project/nofmrpwafafklocdpkqm/sql/new"
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-medium"
                    >
                      Supabase SQL Editor
                    </a>
                    , then submit again.
                  </p>
                  <pre className="bg-amber-100 rounded p-3 text-xs font-mono overflow-x-auto whitespace-pre leading-5 text-amber-900">
                    {SETUP_SQL}
                  </pre>
                </div>
              ) : (
                <p>{error}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm py-3.5 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {submitting ? "Submitting…" : "Submit Survey"}
          </button>
        </form>
      </div>
    </div>
  );
}
