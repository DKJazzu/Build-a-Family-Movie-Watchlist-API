export function authorizeModification(req, res, next) {
  const { user } = req;
  const targetUserId = parseInt(req.params.userId, 10);

  // grant parent roles access to modify any user account
  if (user.role === "parent") {
    return next();
  }

  // restrict child roles to modifying only their own account
  if (user.role === "child" && parseInt(user.id, 10) === targetUserId) {
    return next();
  }

  return res.status(403).json({ error: "Access denied" });
}
