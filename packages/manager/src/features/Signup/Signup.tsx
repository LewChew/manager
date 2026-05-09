import {
  Box,
  Button,
  CircleProgress,
  Divider,
  Notice,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@linode/ui';
import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';

import Logo from 'src/assets/logo/akamai-logo.svg';

import { markSignupComplete } from './signupStorage';

type Step =
  | 'welcome'
  | 'email'
  | 'verify-email'
  | 'phone'
  | 'verify-phone'
  | 'billing'
  | 'completing';

interface SignupData {
  email: string;
  name: string;
  password: string;
  phone: string;
  billing: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

const EMPTY_SIGNUP: SignupData = {
  email: '',
  name: '',
  password: '',
  phone: '',
  billing: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  },
};

const STEP_ORDER: Step[] = [
  'email',
  'verify-email',
  'phone',
  'verify-phone',
  'billing',
];

export const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState<Step>('welcome');
  const [data, setData] = React.useState<SignupData>(EMPTY_SIGNUP);
  const [ssoProvider, setSsoProvider] = React.useState<'google' | 'github' | null>(
    null
  );

  const completeSignup = React.useCallback(() => {
    setStep('completing');
    window.setTimeout(() => {
      markSignupComplete();
      navigate({ to: '/linodes' });
    }, 1500);
  }, [navigate]);

  const handleSso = (provider: 'google' | 'github') => {
    setSsoProvider(provider);
    window.setTimeout(completeSignup, 1200);
  };

  const stepIndex = STEP_ORDER.indexOf(step);
  const showProgress = stepIndex >= 0;

  return (
    <Box
      alignItems="center"
      display="flex"
      justifyContent="center"
      minHeight="100vh"
      sx={(theme) => ({
        backgroundColor: theme.bg.app,
        padding: theme.spacing(3),
      })}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: 480,
          padding: 4,
        }}
      >
        <Stack alignItems="center" gap={2} marginBottom={3}>
          <Logo width={160} />
          {showProgress && <ProgressBar current={stepIndex} total={STEP_ORDER.length} />}
        </Stack>

        {step === 'welcome' && (
          <WelcomeStep
            ssoProvider={ssoProvider}
            onSso={handleSso}
            onEmail={() => setStep('email')}
          />
        )}
        {step === 'email' && (
          <EmailStep
            data={data}
            onChange={setData}
            onSubmit={() => setStep('verify-email')}
          />
        )}
        {step === 'verify-email' && (
          <CodeStep
            title="Verify your email"
            description={`We sent a 6-digit code to ${data.email || 'your email'}.`}
            onSubmit={() => setStep('phone')}
            onBack={() => setStep('email')}
          />
        )}
        {step === 'phone' && (
          <PhoneStep
            data={data}
            onChange={setData}
            onSubmit={() => setStep('verify-phone')}
            onBack={() => setStep('verify-email')}
          />
        )}
        {step === 'verify-phone' && (
          <CodeStep
            title="Verify your phone"
            description={`We sent a 6-digit code to ${data.phone || 'your phone'}.`}
            onSubmit={() => setStep('billing')}
            onBack={() => setStep('phone')}
          />
        )}
        {step === 'billing' && (
          <BillingStep
            data={data}
            onChange={setData}
            onSubmit={completeSignup}
            onBack={() => setStep('verify-phone')}
          />
        )}
        {step === 'completing' && <CompletingStep ssoProvider={ssoProvider} />}
      </Paper>
    </Box>
  );
};

const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <Stack direction="row" gap={0.75} width="100%">
    {Array.from({ length: total }, (_, i) => (
      <Box
        key={i}
        flex={1}
        height={4}
        sx={(theme) => ({
          backgroundColor:
            i <= current
              ? theme.palette.primary.main
              : theme.palette.divider,
          borderRadius: 2,
          transition: 'background-color 200ms',
        })}
      />
    ))}
  </Stack>
);

const WelcomeStep = ({
  ssoProvider,
  onSso,
  onEmail,
}: {
  ssoProvider: 'google' | 'github' | null;
  onSso: (provider: 'google' | 'github') => void;
  onEmail: () => void;
}) => (
  <Stack gap={2}>
    <Typography variant="h2" textAlign="center">
      Create your account
    </Typography>
    <Typography variant="body1" textAlign="center" color="textSecondary">
      Get started with the Akamai Cloud Manager prototype.
    </Typography>
    <Stack gap={1.5} marginTop={2}>
      <SsoButton
        provider="google"
        loading={ssoProvider === 'google'}
        disabled={ssoProvider !== null}
        onClick={() => onSso('google')}
      />
      <SsoButton
        provider="github"
        loading={ssoProvider === 'github'}
        disabled={ssoProvider !== null}
        onClick={() => onSso('github')}
      />
    </Stack>
    <Stack alignItems="center" direction="row" gap={1.5} marginY={1}>
      <Divider sx={{ flex: 1 }} />
      <Typography color="textSecondary" variant="body2">
        or
      </Typography>
      <Divider sx={{ flex: 1 }} />
    </Stack>
    <Button
      buttonType="primary"
      disabled={ssoProvider !== null}
      fullWidth
      onClick={onEmail}
    >
      Continue with email
    </Button>
  </Stack>
);

const SsoButton = ({
  provider,
  loading,
  disabled,
  onClick,
}: {
  provider: 'google' | 'github';
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) => {
  const label = provider === 'google' ? 'Continue with Google' : 'Continue with GitHub';
  return (
    <Button
      buttonType="outlined"
      disabled={disabled}
      fullWidth
      loading={loading}
      onClick={onClick}
      sx={{ justifyContent: 'center' }}
    >
      <Box alignItems="center" display="flex" gap={1}>
        {provider === 'google' ? <GoogleIcon /> : <GitHubIcon />}
        <span>{label}</span>
      </Box>
    </Button>
  );
};

const EmailStep = ({
  data,
  onChange,
  onSubmit,
}: {
  data: SignupData;
  onChange: (next: SignupData) => void;
  onSubmit: () => void;
}) => {
  const canContinue =
    data.email.includes('@') && data.name.trim().length > 0 && data.password.length >= 8;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canContinue) onSubmit();
      }}
    >
      <Stack gap={2}>
        <Typography variant="h2" textAlign="center">
          Sign up with email
        </Typography>
        <TextField
          label="Full name"
          autoComplete="name"
          required
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          helperText="At least 8 characters."
          required
          value={data.password}
          onChange={(e) => onChange({ ...data, password: e.target.value })}
        />
        <Button buttonType="primary" disabled={!canContinue} fullWidth type="submit">
          Continue
        </Button>
      </Stack>
    </form>
  );
};

const CodeStep = ({
  title,
  description,
  onSubmit,
  onBack,
}: {
  title: string;
  description: string;
  onSubmit: () => void;
  onBack: () => void;
}) => {
  const [code, setCode] = React.useState('');
  const canContinue = code.length === 6 && /^\d{6}$/.test(code);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canContinue) onSubmit();
      }}
    >
      <Stack gap={2}>
        <Typography variant="h2" textAlign="center">
          {title}
        </Typography>
        <Typography textAlign="center" color="textSecondary">
          {description}
        </Typography>
        <TextField
          label="6-digit code"
          inputProps={{
            inputMode: 'numeric',
            maxLength: 6,
            pattern: '[0-9]*',
            style: { letterSpacing: '0.4em', textAlign: 'center', fontSize: 20 },
          }}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          autoFocus
        />
        <Notice variant="info" spacingBottom={0}>
          Prototype mode: any 6-digit code works.
        </Notice>
        <Stack direction="row" gap={1}>
          <Button buttonType="secondary" onClick={onBack} sx={{ flex: 1 }}>
            Back
          </Button>
          <Button
            buttonType="primary"
            disabled={!canContinue}
            sx={{ flex: 1 }}
            type="submit"
          >
            Verify
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

const PhoneStep = ({
  data,
  onChange,
  onSubmit,
  onBack,
}: {
  data: SignupData;
  onChange: (next: SignupData) => void;
  onSubmit: () => void;
  onBack: () => void;
}) => {
  const digits = data.phone.replace(/\D/g, '');
  const canContinue = digits.length >= 10;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canContinue) onSubmit();
      }}
    >
      <Stack gap={2}>
        <Typography variant="h2" textAlign="center">
          Add your phone number
        </Typography>
        <Typography textAlign="center" color="textSecondary">
          We&rsquo;ll text you a verification code.
        </Typography>
        <TextField
          label="Phone number"
          type="tel"
          autoComplete="tel"
          placeholder="(555) 555-5555"
          required
          value={data.phone}
          onChange={(e) => onChange({ ...data, phone: e.target.value })}
        />
        <Stack direction="row" gap={1}>
          <Button buttonType="secondary" onClick={onBack} sx={{ flex: 1 }}>
            Back
          </Button>
          <Button
            buttonType="primary"
            disabled={!canContinue}
            sx={{ flex: 1 }}
            type="submit"
          >
            Send code
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

const BillingStep = ({
  data,
  onChange,
  onSubmit,
  onBack,
}: {
  data: SignupData;
  onChange: (next: SignupData) => void;
  onSubmit: () => void;
  onBack: () => void;
}) => {
  const setBilling = (patch: Partial<SignupData['billing']>) =>
    onChange({ ...data, billing: { ...data.billing, ...patch } });
  const b = data.billing;
  const canContinue =
    b.line1.trim() &&
    b.city.trim() &&
    b.state.trim() &&
    b.zip.trim() &&
    b.country.trim();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canContinue) onSubmit();
      }}
    >
      <Stack gap={2}>
        <Typography variant="h2" textAlign="center">
          Billing address
        </Typography>
        <Typography textAlign="center" color="textSecondary">
          Used for invoicing. You can change it later in account settings.
        </Typography>
        <TextField
          label="Address line 1"
          autoComplete="address-line1"
          required
          value={b.line1}
          onChange={(e) => setBilling({ line1: e.target.value })}
        />
        <TextField
          label="Address line 2 (optional)"
          autoComplete="address-line2"
          value={b.line2}
          onChange={(e) => setBilling({ line2: e.target.value })}
        />
        <Stack direction="row" gap={2}>
          <TextField
            label="City"
            autoComplete="address-level2"
            required
            value={b.city}
            onChange={(e) => setBilling({ city: e.target.value })}
            sx={{ flex: 2 }}
          />
          <TextField
            label="State / Region"
            autoComplete="address-level1"
            required
            value={b.state}
            onChange={(e) => setBilling({ state: e.target.value })}
            sx={{ flex: 1 }}
          />
        </Stack>
        <Stack direction="row" gap={2}>
          <TextField
            label="ZIP / Postal code"
            autoComplete="postal-code"
            required
            value={b.zip}
            onChange={(e) => setBilling({ zip: e.target.value })}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Country"
            autoComplete="country"
            required
            value={b.country}
            onChange={(e) => setBilling({ country: e.target.value })}
            sx={{ flex: 1 }}
          />
        </Stack>
        <Stack direction="row" gap={1}>
          <Button buttonType="secondary" onClick={onBack} sx={{ flex: 1 }}>
            Back
          </Button>
          <Button
            buttonType="primary"
            disabled={!canContinue}
            sx={{ flex: 1 }}
            type="submit"
          >
            Finish
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

const CompletingStep = ({
  ssoProvider,
}: {
  ssoProvider: 'google' | 'github' | null;
}) => (
  <Stack alignItems="center" gap={2} paddingY={4}>
    <CircleProgress size="md" />
    <Typography variant="h3" textAlign="center">
      {ssoProvider === 'google' && 'Continuing with Google…'}
      {ssoProvider === 'github' && 'Continuing with GitHub…'}
      {!ssoProvider && 'Setting up your account…'}
    </Typography>
  </Stack>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#4285F4"
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
    />
    <path
      fill="#FBBC05"
      d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="currentColor"
      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
    />
  </svg>
);
