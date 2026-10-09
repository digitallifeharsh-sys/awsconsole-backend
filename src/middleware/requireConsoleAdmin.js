// Authentication is intentionally not enforced yet because the console login module
// has not been built. Add real session/JWT authorization when login is implemented.
const requireConsoleAdmin = (_req, _res, next) => next();
export default requireConsoleAdmin;
