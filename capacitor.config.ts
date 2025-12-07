import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Skill_Track',
  webDir: 'dist',
  server: {
    url: 'http://192.168.34.204:3000',
    cleartext: true,
  },
}

export default config
