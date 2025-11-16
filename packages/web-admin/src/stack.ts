/**
 * Stack Auth Configuration
 * Stack Auth is optional - if not configured with a valid UUID, the admin portal will work without auth
 */

// Check if Stack Auth is properly configured (not placeholder values)
const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
const isValidProjectId = projectId &&
  projectId !== 'your_project_id' &&
  projectId !== 'your-stack-project-id' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);

export const hasStackAuth = Boolean(isValidProjectId);

// Export null instead of trying to initialize Stack Auth with invalid credentials
export const stackServerApp = null;
