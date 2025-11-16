/**
 * Stack Auth Configuration
 * Stack Auth is optional - if not configured, the API will work without auth features
 */

// Make Stack Auth completely optional
const hasStackAuth = process.env.STACK_PROJECT_ID &&
  process.env.STACK_SECRET_SERVER_KEY &&
  process.env.STACK_PROJECT_ID !== 'your_stack_project_id' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(process.env.STACK_PROJECT_ID);

export const stackServerApp = hasStackAuth ? null : null;
export { hasStackAuth };
