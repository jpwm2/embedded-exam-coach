import { handleAuth, requireAuth } from "./auth";
import { handleSettings } from "./routes/settings";
import { handleProblems } from "./routes/problems";
import { handleAttempts } from "./routes/attempts";
import { handleCards } from "./routes/cards";
import { handlePastExams } from "./routes/pastexams";
import { handleWeakMap } from "./routes/weakmap";
import { handleStudyLog } from "./routes/studylog";
import { handleDashboard } from "./routes/dashboard";
import { handleSeed } from "./routes/seed";

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };

function notFound() {
  return new Response(JSON.stringify({ error: "not_found" }), { status: 404, headers: JSON_HEADERS });
}

function methodNotAllowed() {
  return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers: JSON_HEADERS });
}

export function jsonResponse(body: unknown, status = 200, extraHeaders: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...JSON_HEADERS, ...(extraHeaders as Record<string, string>) } });
}

export function errorResponse(message: string, status = 400, code?: string): Response {
  return jsonResponse({ error: code ?? message, message }, status);
}

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path === "/api/health") {
      return jsonResponse({ ok: true, ts: Date.now() });
    }

    if (path.startsWith("/api/auth/")) {
      return handleAuth(req, env, path.slice("/api/auth/".length));
    }

    if (path.startsWith("/api/")) {
      const user = await requireAuth(req, env);
      if (!user) return errorResponse("unauthorized", 401, "unauthorized");

      const sub = path.slice("/api/".length);

      if (sub === "settings" || sub.startsWith("settings/")) {
        return handleSettings(req, env, user, sub);
      }
      if (sub === "problems" || sub.startsWith("problems/")) {
        return handleProblems(req, env, user, sub);
      }
      if (sub === "attempts" || sub.startsWith("attempts/")) {
        return handleAttempts(req, env, user, sub);
      }
      if (sub === "cards" || sub.startsWith("cards/")) {
        return handleCards(req, env, user, sub);
      }
      if (sub === "past-exams" || sub.startsWith("past-exams/")) {
        return handlePastExams(req, env, user, sub);
      }
      if (sub === "weak-map" || sub.startsWith("weak-map/")) {
        return handleWeakMap(req, env, user, sub);
      }
      if (sub === "study-log" || sub.startsWith("study-log/")) {
        return handleStudyLog(req, env, user, sub);
      }
      if (sub === "dashboard" || sub.startsWith("dashboard/")) {
        return handleDashboard(req, env, user, sub);
      }
      if (sub === "seed" || sub.startsWith("seed/")) {
        return handleSeed(req, env, user, sub);
      }

      return notFound();
    }

    return env.ASSETS.fetch(req);
  },
};
