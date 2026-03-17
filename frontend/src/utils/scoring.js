/**
 * scoreRepo(repo, profile) → { score, reasons[] }
 *
 * Scoring rubric:
 *   +3  repo language matches one of the user's language IDs
 *   +2  a repo topic matches one of the user's tool/database IDs
 *   +1  per additional matching topic (after the first)
 *   +2  experience-level alignment (mid-size projects default)
 *   +1  repo was updated within the last 90 days (active)
 *   +1  repo has "hacktoberfest" or "good-first-issue" topic
 *
 * profile shape from MongoDB:
 *   { languages: ["javascript","python"], tools: ["react","nodejs"], databases: ["mongodb"] }
 */

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

// Map GitHub language names → profile IDs
const LANGUAGE_ALIASES = {
  javascript: "javascript",
  python: "python",
  java: "java",
  typescript: "typescript",
  c: "c",
  "c++": "cpp",
  html: "html5",
  css: "css3",
};

export function scoreRepo(repo, profile) {
  let score = 0;
  const reasons = [];

  const repoLang = (repo.language || "").toLowerCase();
  const profileLangs = profile.languages || [];
  const profileTools = profile.tools || [];
  const profileDatabases = profile.databases || [];

  // All profile tech IDs combined for topic matching
  const allProfileTech = [...profileLangs, ...profileTools, ...profileDatabases];

  // --- Language match (+3) ---
  const langId = LANGUAGE_ALIASES[repoLang] || repoLang;
  if (langId && profileLangs.includes(langId)) {
    score += 3;
    reasons.push(`Language: ${repo.language}`);
  }

  // --- Topic matches (+2 first, +1 each additional) ---
  const repoTopics = (repo.topics || []).map((t) => t.toLowerCase());
  const matchedTopics = repoTopics.filter((t) => allProfileTech.includes(t));

  if (matchedTopics.length > 0) {
    score += 2 + (matchedTopics.length - 1);
    reasons.push(`Topics: ${matchedTopics.join(", ")}`);
  }

  // --- Experience-level alignment (+2) ---
  const stars = repo.stars || 0;
  if (stars >= 500 && stars <= 10000) {
    score += 2;
    reasons.push("Mid-size project");
  }

  // --- Recently updated (+1) ---
  const updatedAt = new Date(repo.updatedAt);
  if (Date.now() - updatedAt.getTime() < NINETY_DAYS_MS) {
    score += 1;
    reasons.push("Recently active");
  }

  // --- Contributor-friendly topic (+1) ---
  if (
    repoTopics.includes("hacktoberfest") ||
    repoTopics.includes("good-first-issue")
  ) {
    score += 1;
    reasons.push("Contributor-friendly");
  }

  return { score, reasons };
}

/**
 * rankRepos(repos, profile, limit?)
 * Score every repo, sort descending, return top `limit` results.
 */
export function rankRepos(repos, profile, limit = 20) {
  return repos
    .map((repo) => ({ ...repo, ...scoreRepo(repo, profile) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}