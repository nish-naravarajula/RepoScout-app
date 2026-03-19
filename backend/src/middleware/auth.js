/**
 * Middleware that requires the user to be authenticated.
 * Returns 401 if not logged in.
 */
export function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Not authenticated" });
}