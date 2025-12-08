import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aswaq.app',
  appName: 'أسواق سجاد',
  webDir: 'out',
  server: {
    // Use http scheme to avoid mixed-content and chunk loading issues in WebView
    androidScheme: 'http',
    // If you want to debug against a local dev server, set:
    // url: 'http://localhost:3002',
    // cleartext: true,
  },
};

export default config;
