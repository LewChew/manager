const SIGNUP_FLAG_KEY = 'poc-signup-complete';

export const isSignupComplete = (): boolean => {
  try {
    return localStorage.getItem(SIGNUP_FLAG_KEY) === 'true';
  } catch {
    return false;
  }
};

export const markSignupComplete = (): void => {
  try {
    localStorage.setItem(SIGNUP_FLAG_KEY, 'true');
  } catch {
    // localStorage unavailable — let the user re-flow through signup next visit.
  }
};

export const resetSignup = (): void => {
  try {
    localStorage.removeItem(SIGNUP_FLAG_KEY);
  } catch {
    // ignore
  }
};
