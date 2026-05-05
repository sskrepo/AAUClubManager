/**
 * /me page — Auth smoke test (TASK-010)
 *
 * Calls useMe() which hits GET /api/v1/me on the backend.
 * Displays the backend's AuthUser response to prove end-to-end auth works.
 *
 * Manual smoke test:
 *   1. Start server (npm run dev:server from root)
 *   2. Start web (npm run dev:web from root)
 *   3. Sign in at localhost:3000
 *   4. Navigate to localhost:3000/me
 *   5. You should see your Clerk user data from the backend
 */
import { MePageClient } from "./me-client";

export default function MePage() {
  return <MePageClient />;
}
