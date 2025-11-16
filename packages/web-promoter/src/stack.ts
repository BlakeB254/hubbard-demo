import { StackServerApp } from '@stackframe/stack';

// Check if Stack Auth is properly configured (not placeholder values)
const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
const isValidProjectId = projectId &&
  projectId !== 'your_project_id' &&
  projectId !== 'your-stack-project-id' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);

export const hasStackAuth = Boolean(isValidProjectId);

export const stackServerApp = hasStackAuth
  ? new StackServerApp({
      tokenStore: 'nextjs-cookie',
      urls: {
        signIn: '/auth/signin',
        afterSignIn: '/',
        afterSignUp: '/',
        afterSignOut: '/',
      },
    })
  : null;
