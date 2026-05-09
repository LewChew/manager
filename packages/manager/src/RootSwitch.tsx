import { Navigate, useLocation, useParams } from '@tanstack/react-router';
import * as React from 'react';

import { isSignupComplete } from 'src/features/Signup/signupStorage';

import { FramelessRoot } from './FramelessRoot';
import { Root } from './Root';

export const RootSwitch = () => {
  const location = useLocation();
  const params = useParams({
    strict: false,
  });

  const isSignupPath = location.pathname.startsWith('/signup');

  // POC mode: gate all dashboard routes behind the mock signup flow.
  if (!isSignupComplete() && !isSignupPath) {
    return <Navigate to="/signup" />;
  }

  if (isSignupPath) {
    return <FramelessRoot />;
  }

  if (location.pathname.includes('/lish/') && params.linodeId && params.type) {
    return <FramelessRoot />;
  }

  return <Root />;
};
