import {
  Action,
  Border,
  Button,
  Chart,
  Color,
  Dropdown,
  Interaction,
  NotificationToast,
  Select,
} from '@linode/design-language-system';

import { breakpoints } from 'src/foundations/breakpoints';
import { latoWeb } from 'src/foundations/fonts';

import type { ThemeOptions } from '@mui/material/styles';

export const inputMaxWidth = 416;

export const charts = { ...Chart } as const;

// Blue-themed background colors
export const bg = {
  app: '#f0f4ff', // Light blue background
  appBar: 'transparent',
  bgAccessRow: '#f0f4ff',
  bgAccessRowTransparentGradient: 'rgb(240, 244, 255, .001)',
  bgPaper: '#ffffff',
  interactionBgPrimary: '#e3f2fd', // Light blue interaction
  lightBlue1: '#e1f5fe', // Lighter blue
  lightBlue2: '#b3e5fc', // Medium light blue
  main: '#f0f4ff',
  mainContentBanner: '#1565c0', // Deep blue banner
  offWhite: '#f8faff', // Off-white with blue tint
  primaryNavPaper: '#1976d2', // Blue navigation
  tableHeader: '#e3f2fd',
  white: '#ffffff',
} as const;

// Enhanced blue primary colors
const primaryColors = {
  dark: '#0d47a1', // Dark blue
  divider: '#e3f2fd',
  headline: '#1565c0', // Deep blue headlines
  light: '#42a5f5', // Light blue
  main: '#1976d2', // Primary blue
  text: '#1565c0', // Blue text
  white: '#ffffff',
};

// Blue-focused color palette
export const color = {
  black: '#000000',
  blue: '#1976d2', // Primary blue
  blueDTwhite: '#1976d2',
  border2: '#bbdefb', // Light blue border
  border3: '#e3f2fd', // Very light blue border
  boxShadow: '#90caf9', // Blue shadow
  boxShadowDark: '#64b5f6',
  buttonPrimaryHover: '#1565c0', // Darker blue hover
  disabledText: '#9e9e9e',
  drawerBackdrop: 'rgba(25, 118, 210, 0.1)', // Blue backdrop
  green: '#4caf50',
  grey1: '#757575',
  grey2: '#e0e0e0',
  grey3: '#bdbdbd',
  grey4: '#616161',
  grey5: '#f8faff', // Blue-tinted grey
  grey6: '#e0e0e0',
  grey7: '#eeeeee',
  grey8: '#e0e0e0',
  grey9: '#f8faff',
  grey10: '#e3f2fd',
  headline: primaryColors.headline,
  label: '#1565c0',
  offBlack: '#212121',
  orange: '#ff9800',
  red: '#f44336',
  tableHeaderText: 'rgba(21, 101, 192, 0.7)', // Blue table headers
  tagButtonBg: '#e3f2fd',
  tagButtonBgHover: '#1976d2',
  tagButtonText: '#1565c0',
  tagButtonTextHover: '#ffffff',
  tagIcon: '#1976d2',
  tagIconHover: '#ffffff',
  teal: '#009688',
  white: '#ffffff',
  yellow: '#ffeb3b',
} as const;

// Blue-themed text colors
export const textColors = {
  headlineStatic: '#1565c0',
  linkActiveLight: '#1976d2',
  linkHover: '#1565c0',
  tableHeader: '#1976d2',
  tableStatic: '#1565c0',
  textAccessTable: '#1565c0',
} as const;

// Blue-themed border colors
export const borderColors = {
  borderFocus: '#2196f3', // Bright blue focus
  borderHover: '#42a5f5', // Light blue hover
  borderTable: '#e3f2fd',
  borderTypography: '#bbdefb',
  divider: '#e3f2fd',
  dividerDark: '#1976d2',
} as const;

export const notificationToast = {
  default: {
    backgroundColor: '#e3f2fd',
    borderLeft: `6px solid #1976d2`,
    color: '#1565c0',
  },
  error: {
    backgroundColor: '#ffebee',
    borderLeft: `6px solid #f44336`,
  },
  info: {
    backgroundColor: '#e3f2fd',
    borderLeft: `6px solid #2196f3`,
  },
  success: {
    backgroundColor: '#e8f5e8',
    borderLeft: `6px solid #4caf50`,
  },
  warning: {
    backgroundColor: '#fff3e0',
    borderLeft: `6px solid #ff9800`,
  },
} as const;

const iconCircleAnimation = {
  '& .circle': {
    fill: primaryColors.main,
    transition: 'fill .2s ease-in-out .2s',
  },
  '& .insidePath *': {
    stroke: 'white',
    transition: 'fill .2s ease-in-out .2s, stroke .2s ease-in-out .2s',
  },
  '& .outerCircle': {
    animation: '$dash 2s linear forwards',
    stroke: primaryColors.dark,
    strokeDasharray: 1000,
    strokeDashoffset: 1000,
  },
};

const iconCircleHoverEffect = {
  '& .circle': {
    fill: primaryColors.main,
  },
  '& .insidePath *': {
    stroke: 'white',
  },
};

const genericLinkStyle = {
  '&:disabled': {
    color: '#9e9e9e',
    cursor: 'not-allowed',
  },
  '&:hover:not(:disabled)': {
    backgroundColor: 'transparent',
    color: '#1565c0',
    textDecoration: 'underline',
  },
  background: 'none',
  border: 'none',
  color: '#1976d2',
  cursor: 'pointer',
  font: 'inherit',
  minWidth: 0,
  padding: 0,
};

const genericStatusPillStyle = {
  '&:before': {
    borderRadius: '50%',
    content: '""',
    display: 'inline-block',
    height: 16,
    marginRight: 8,
    minWidth: 16,
    width: 16,
  },
  backgroundColor: 'transparent',
  color: '#1565c0',
  fontFamily: latoWeb.bold,
  fontSize: '1rem',
  padding: 0,
};

const genericTableHeaderStyle = {
  '&:hover': {
    '& span': {
      color: '#1976d2',
    },
    cursor: 'pointer',
  },
};

const visuallyVisible = {
  clip: 'none',
  height: 'auto',
  overflow: 'initial',
  position: 'relative',
  width: 'auto',
};

const visuallyHidden = {
  clip: 'rect(1px, 1px, 1px, 1px)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute !important',
  width: 1,
};

const graphTransparency = '0.7';
const spacing = 8;

export const blueTheme: ThemeOptions = {
  addCircleHoverEffect: {
    ...iconCircleHoverEffect,
  },
  animateCircleIcon: {
    ...iconCircleAnimation,
  },
  applyLinkStyles: {
    ...genericLinkStyle,
  },
  applyStatusPillStyles: {
    ...genericStatusPillStyle,
  },
  applyTableHeaderStyles: {
    ...genericTableHeaderStyle,
  },
  bg,
  borderColors,
  breakpoints,
  charts,
  color,
  components: {
    // Comprehensive blue theme component overrides
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#1976d2',
          color: '#ffffff',
          '&:hover, &:focus': {
            backgroundColor: '#1565c0',
          },
          '&:active': {
            backgroundColor: '#0d47a1',
          },
        },
        outlined: {
          border: `1px solid #1976d2`,
          color: '#1976d2',
          '&:hover': {
            backgroundColor: '#e3f2fd',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2',
          color: '#ffffff',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        head: {
          backgroundColor: '#e3f2fd',
        },
        root: {
          '&:hover': {
            backgroundColor: '#f0f4ff',
          },
        },
      },
    },
  },
  font: {
    bold: latoWeb.bold,
    normal: latoWeb.normal,
  },
  graphs: {
    blue: `rgba(25, 118, 210, ${graphTransparency})`,
    cpu: {
      percent: `rgba(33, 150, 243, ${graphTransparency})`,
      system: `rgba(25, 118, 210, ${graphTransparency})`,
      user: `rgba(66, 165, 245, ${graphTransparency})`,
      wait: `rgba(144, 202, 249, ${graphTransparency})`,
    },
    green: `rgba(76, 175, 80, ${graphTransparency})`,
    memory: {
      buffers: `rgba(103, 58, 183, ${graphTransparency})`,
      cache: `rgba(156, 39, 176, ${graphTransparency})`,
      swap: `rgba(238, 44, 44, ${graphTransparency})`,
      used: `rgba(187, 222, 251, ${graphTransparency})`,
    },
    red: `rgba(244, 67, 54, ${graphTransparency})`,
    yellow: `rgba(255, 235, 59, ${graphTransparency})`,
  },
  inputStyles: {
    default: {
      backgroundColor: '#ffffff',
      border: `1px solid #bbdefb`,
      color: '#1565c0',
    },
    focused: {
      backgroundColor: '#ffffff',
      border: `1px solid #1976d2`,
      boxShadow: `0 0 2px 1px #90caf9`,
      color: '#1565c0',
    },
    error: {
      backgroundColor: '#ffffff',
      border: `1px solid #f44336`,
      color: '#1565c0',
    },
  },
  name: 'blue',
  notificationToast,
  palette: {
    background: {
      default: bg.app,
    },
    divider: primaryColors.divider,
    primary: primaryColors,
    secondary: primaryColors,
    mode: 'light',
  },
  shadows: [
    'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none',
    'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none',
    'none', 'none', 'none', 'none', 'none',
  ],
  spacing,
  textColors,
  typography: {
    body1: {
      color: primaryColors.text,
      fontSize: '0.875rem',
      lineHeight: '1.125rem',
    },
    h1: {
      color: primaryColors.headline,
      fontFamily: latoWeb.bold,
      fontSize: '1.25rem',
      lineHeight: '1.75rem',
    },
    h2: {
      color: primaryColors.headline,
      fontFamily: latoWeb.bold,
      fontSize: '1.125rem',
      lineHeight: '1.5rem',
    },
    h3: {
      color: primaryColors.headline,
      fontFamily: latoWeb.bold,
      fontSize: '1rem',
      lineHeight: '1.4rem',
    },
    fontFamily: latoWeb.normal,
    fontSize: 16,
  },
  visually: {
    hidden: visuallyHidden,
    visible: visuallyVisible,
  },
};
