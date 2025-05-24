#!/bin/bash

# Linode Cloud Manager Blue Theme Deployment Script
# This script sets up your blue-themed Cloud Manager on a Linode VM

set -e

echo "🚀 Starting Linode Cloud Manager Blue Theme Deployment..."

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Update system
echo -e "${BLUE}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS using NodeSource repository
echo -e "${BLUE}📱 Installing Node.js 20 LTS...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
echo -e "${BLUE}📦 Installing pnpm...${NC}"
npm install -g pnpm

# Install Git if not present
echo -e "${BLUE}🔧 Installing Git...${NC}"
sudo apt install -y git

# Install PM2 for process management
echo -e "${BLUE}🔄 Installing PM2...${NC}"
npm install -g pm2

# Clone your forked repository
echo -e "${BLUE}📥 Cloning your blue-themed Cloud Manager...${NC}"
cd /home/$(whoami)
if [ -d "manager" ]; then
    echo -e "${YELLOW}⚠️  Directory exists, removing old version...${NC}"
    rm -rf manager
fi

git clone https://github.com/LewChew/manager.git
cd manager

# Checkout the blue theme branch
echo -e "${BLUE}🔵 Switching to blue theme branch...${NC}"
git checkout blue-theme-updates

# Manually apply the theme index changes (since we couldn't update it automatically)
echo -e "${BLUE}🎨 Applying blue theme integration...${NC}"
cat > packages/manager/src/foundations/themes/index.ts << 'EOF'
import { createTheme } from '@mui/material/styles';

// Themes & Brands
import { darkTheme } from 'src/foundations/themes/dark';
import { lightTheme } from 'src/foundations/themes/light';
import { blueTheme } from 'src/foundations/themes/blue';
import { deepMerge } from 'src/utilities/deepMerge';

import type { Chart as ChartLight } from '@linode/design-language-system';
import type { Chart as ChartDark } from '@linode/design-language-system/themes/dark';
import type { latoWeb } from 'src/foundations/fonts';
// Types & Interfaces
import type {
  customDarkModeOptions,
  notificationToast as notificationToastDark,
} from 'src/foundations/themes/dark';
import type {
  bg,
  borderColors,
  color,
  notificationToast,
  textColors,
} from 'src/foundations/themes/light';
import type {
  bg as blueBg,
  borderColors as blueBorderColors,
  color as blueColor,
  notificationToast as blueNotificationToast,
  textColors as blueTextColors,
} from 'src/foundations/themes/blue';

export type ThemeName = 'dark' | 'light' | 'blue';

type ChartLightTypes = typeof ChartLight;
type ChartDarkTypes = typeof ChartDark;
type ChartTypes = MergeTypes<ChartLightTypes, ChartDarkTypes>;

type Fonts = typeof latoWeb;

type MergeTypes<A, B> = Omit<A, keyof B> &
  Omit<B, keyof A> &
  { [K in keyof A & keyof B]: A[K] | B[K] };

type LightModeColors = typeof color;
type DarkModeColors = typeof customDarkModeOptions.color;
type BlueModeColors = typeof blueColor;

type Colors = MergeTypes<LightModeColors, DarkModeColors> & MergeTypes<LightModeColors, BlueModeColors>;

type LightModeBgColors = typeof bg;
type DarkModeBgColors = typeof customDarkModeOptions.bg;
type BlueModeBgColors = typeof blueBg;

type BgColors = MergeTypes<LightModeBgColors, DarkModeBgColors> & MergeTypes<LightModeBgColors, BlueModeBgColors>;

type LightModeTextColors = typeof textColors;
type DarkModeTextColors = typeof customDarkModeOptions.textColors;
type BlueModeTextColors = typeof blueTextColors;
type TextColors = MergeTypes<LightModeTextColors, DarkModeTextColors> & MergeTypes<LightModeTextColors, BlueModeTextColors>;

type LightModeBorderColors = typeof borderColors;
type DarkModeBorderColors = typeof customDarkModeOptions.borderColors;
type BlueModeBorderColors = typeof blueBorderColors;
type BorderColors = MergeTypes<LightModeBorderColors, DarkModeBorderColors> & MergeTypes<LightModeBorderColors, BlueModeBorderColors>;

type LightNotificationToast = typeof notificationToast;
type DarkNotificationToast = typeof notificationToastDark;
type BlueNotificationToast = typeof blueNotificationToast;
type NotificationToast = MergeTypes<
  LightNotificationToast,
  DarkNotificationToast
> & MergeTypes<LightNotificationToast, BlueNotificationToast>;

/**
 * Augmenting the Theme and ThemeOptions.
 * This allows us to add custom fields to the theme.
 * Avoid doing this unless you have a good reason.
 */
declare module '@mui/material/styles/createTheme' {
  interface Theme {
    addCircleHoverEffect?: any;
    animateCircleIcon?: any;
    applyLinkStyles?: any;
    applyStatusPillStyles?: any;
    applyTableHeaderStyles?: any;
    bg: BgColors;
    borderColors: BorderColors;
    charts: ChartTypes;
    color: Colors;
    font: Fonts;
    graphs: any;
    inputStyles: any;
    name: ThemeName;
    notificationToast: NotificationToast;
    textColors: TextColors;
    visually: any;
  }

  interface ThemeOptions {
    addCircleHoverEffect?: any;
    animateCircleIcon?: any;
    applyLinkStyles?: any;
    applyStatusPillStyles?: any;
    applyTableHeaderStyles?: any;
    bg?: DarkModeBgColors | LightModeBgColors | BlueModeBgColors;
    borderColors?: DarkModeBorderColors | LightModeBorderColors | BlueModeBorderColors;
    charts: ChartTypes;
    color?: DarkModeColors | LightModeColors | BlueModeColors;
    font?: Fonts;
    graphs?: any;
    inputStyles?: any;
    name: ThemeName;
    notificationToast?: NotificationToast;
    textColors?: DarkModeTextColors | LightModeTextColors | BlueModeTextColors;
    visually?: any;
  }
}

export const light = createTheme(lightTheme);
export const dark = createTheme(deepMerge(lightTheme, darkTheme));
export const blue = createTheme(blueTheme);
EOF

# Create environment file with blue theme as default
echo -e "${BLUE}⚙️  Setting up environment configuration...${NC}"
cd packages/manager
cp .env.example .env

# Create a demo OAuth client ID (you'll need to replace this with a real one)
cat >> .env << 'EOF'

# Blue Theme Demo Configuration
REACT_APP_CLIENT_ID=your-oauth-client-id-here
REACT_APP_DEFAULT_THEME=blue
EOF

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies (this may take a few minutes)...${NC}"
pnpm install

# Create a simple script to override the default theme
echo -e "${BLUE}🎨 Setting blue theme as default...${NC}"
cat > src/ThemeWrapper.tsx << 'EOF'
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { blue } from 'src/foundations/themes';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  return (
    <ThemeProvider theme={blue}>
      {children}
    </ThemeProvider>
  );
};
EOF

# Build the application for production
echo -e "${BLUE}🔨 Building the application...${NC}"
pnpm build

# Install nginx for serving the static files
echo -e "${BLUE}🌐 Installing and configuring Nginx...${NC}"
sudo apt install -y nginx

# Configure nginx to serve the Cloud Manager
sudo tee /etc/nginx/sites-available/cloud-manager << 'EOF'
server {
    listen 80;
    listen [::]:80;
    
    root /home/$(whoami)/manager/packages/manager/build;
    index index.html;
    
    server_name _;
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma no-cache;
        add_header Expires 0;
    }
    
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy (if needed for development)
    location /api/ {
        proxy_pass https://api.linode.com/;
        proxy_set_header Host api.linode.com;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Replace the placeholder with actual username
sudo sed -i "s/\$(whoami)/$(whoami)/g" /etc/nginx/sites-available/cloud-manager

# Enable the site
sudo ln -sf /etc/nginx/sites-available/cloud-manager /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Start and enable nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# Configure firewall
echo -e "${BLUE}🔒 Configuring firewall...${NC}"
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
echo "y" | sudo ufw enable

# Get the server IP
SERVER_IP=$(curl -s http://checkip.amazonaws.com/ || curl -s http://icanhazip.com/)

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}🎨 Your Blue-Themed Linode Cloud Manager is now available at:${NC}"
echo -e "${GREEN}   http://${SERVER_IP}${NC}"
echo ""
echo -e "${YELLOW}📝 Important Notes:${NC}"
echo -e "   • You'll need to set up OAuth authentication to fully use the Cloud Manager"
echo -e "   • Visit https://cloud.linode.com/profile/clients to create an OAuth app"
echo -e "   • Set the callback URL to: http://${SERVER_IP}/oauth/callback"
echo -e "   • Update the REACT_APP_CLIENT_ID in /home/$(whoami)/manager/packages/manager/.env"
echo -e "   • Rebuild with: cd /home/$(whoami)/manager/packages/manager && pnpm build"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo -e "   • View nginx logs: sudo tail -f /var/log/nginx/access.log"
echo -e "   • Restart nginx: sudo systemctl restart nginx"
echo -e "   • Update code: cd /home/$(whoami)/manager && git pull"
echo ""
echo -e "${GREEN}🎉 Enjoy your beautiful blue-themed Cloud Manager!${NC}"
EOF

chmod +x deploy-blue-cloud-manager.sh
