import { createLazyRoute } from '@tanstack/react-router';

import { Signup } from './Signup';

export const signupLazyRoute = createLazyRoute('/signup')({
  component: Signup,
});
