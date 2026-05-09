import { createRoute } from '@tanstack/react-router';

import { rootRoute } from '../root';

export const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'signup',
}).lazy(() =>
  import('src/features/Signup/signupLazyRoute').then((m) => m.signupLazyRoute)
);
