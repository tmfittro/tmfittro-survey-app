import { Router, type IRouter, type Request, type Response } from "express";
import { createClient } from "@supabase/supabase-js";

const router: IRouter = Router();

function getSupabaseAdmin() {
  const url = process.env["VITE_SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) throw new Error("Supabase env vars not configured");
  return createClient(url, key, { auth: { persistSession: false } });
}

router.post("/survey", async (req: Request, res: Response) => {
  const { major, year, studyHours, activities, stressLevel, improvement } = req.body ?? {};

  if (!major || !year || !studyHours || !Array.isArray(activities) || !stressLevel) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    res.status(500).json({ error: "Server configuration error" });
    return;
  }

  const { error } = await supabase.from("survey_responses").insert({
    major,
    year,
    study_hours: studyHours,
    activities,
    stress: stressLevel,
    improvement: improvement ?? "",
  });

  if (error) {
    const isTableMissing =
      error.message.includes("relation") ||
      error.message.includes("does not exist") ||
      error.code === "42P01";
    if (isTableMissing) {
      res.status(503).json({ error: "table_missing" });
    } else {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  res.json({ success: true });
});

export default router;
