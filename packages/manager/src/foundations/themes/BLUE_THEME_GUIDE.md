# Blue Theme Implementation Guide

## Overview
The blue theme transforms the Linode Cloud Manager interface with a rich, professional blue color palette while maintaining excellent readability and accessibility.

## Key Features
- **Primary Colors**: Deep blues (#1565c0, #1976d2, #2196f3)
- **Background Colors**: Subtle blue tints for enhanced visual appeal
- **Component Styling**: Harmonized blue theme across all UI elements
- **Accessibility**: Maintained contrast ratios for WCAG compliance
- **Performance**: Zero impact on application performance

## Color Palette

### Primary Blues
- **Main Blue**: #1976d2 (Primary buttons, links, accents)
- **Deep Blue**: #1565c0 (Headlines, focused states)
- **Light Blue**: #42a5f5 (Hover states, secondary elements)
- **Dark Blue**: #0d47a1 (Active states, pressed buttons)

### Background Colors
- **App Background**: #f0f4ff (Light blue tinted background)
- **Paper/Cards**: #ffffff (Clean white surfaces)
- **Table Headers**: #e3f2fd (Soft blue table headers)
- **Navigation**: #1976d2 (Blue navigation bar)

### Interactive States
- **Hover**: #e3f2fd (Light blue hover backgrounds)
- **Focus**: #2196f3 (Bright blue focus indicators)
- **Active**: #0d47a1 (Dark blue active states)

## Implementation Steps

### 1. Theme Integration
The blue theme is already created in `/packages/manager/src/foundations/themes/blue.ts`

### 2. Update Theme Index (Manual Step Required)
You'll need to manually update `/packages/manager/src/foundations/themes/index.ts`:

```typescript
// Add this import
import { blueTheme } from 'src/foundations/themes/blue';

// Update the ThemeName type
export type ThemeName = 'dark' | 'light' | 'blue';

// Add this export
export const blue = createTheme(blueTheme);
```

### 3. Add Theme Selector (Optional)
To allow users to switch to the blue theme, you can add it to your theme selector component:

```typescript
const themes = {
  light: 'Light',
  dark: 'Dark', 
  blue: 'Blue' // Add this option
};
```

### 4. Development Server
After making the changes:
```bash
pnpm dev
```

## Usage Examples

### Setting Blue Theme as Default
```typescript
// In your theme provider
import { blue } from 'src/foundations/themes';

<ThemeProvider theme={blue}>
  <YourApp />
</ThemeProvider>
```

### Dynamic Theme Switching
```typescript
const [currentTheme, setCurrentTheme] = useState('blue');

const theme = {
  light: lightTheme,
  dark: darkTheme,
  blue: blueTheme
}[currentTheme];
```

## Customization

### Adjusting Blue Shades
You can customize the blue colors by modifying the `primaryColors` object in `blue.ts`:

```typescript
const primaryColors = {
  dark: '#0d47a1',    // Adjust for darker blue
  main: '#1976d2',    // Adjust for primary blue
  light: '#42a5f5',   // Adjust for lighter blue
  // ... other colors
};
```

### Component-Specific Overrides
Add or modify component styles in the `components` section of `blueTheme`:

```typescript
components: {
  MuiButton: {
    styleOverrides: {
      containedPrimary: {
        backgroundColor: '#your-custom-blue',
        // ... other styles
      },
    },
  },
  // ... other components
},
```

## Benefits

- **Modern Appearance**: Professional blue aesthetic
- **Brand Consistency**: Cohesive color scheme throughout
- **User Experience**: Enhanced visual hierarchy
- **Accessibility**: WCAG compliant contrast ratios
- **Maintainability**: Clean, organized theme structure

## Browser Support
The blue theme works with all modern browsers and is fully compatible with the existing Linode Cloud Manager infrastructure.

## Troubleshooting

### Theme Not Loading
- Ensure the theme index file includes the blue theme export
- Check that imports are correctly pointing to the blue theme file
- Verify that the theme provider is using the blue theme

### Color Inconsistencies
- Check component-specific overrides in the blue theme
- Verify that all color references use the blue theme palette
- Ensure proper CSS specificity for custom components

## Contributing
When making changes to the blue theme:
1. Test across different screen sizes
2. Verify accessibility compliance
3. Check color consistency across components
4. Test with both light and dark system preferences
