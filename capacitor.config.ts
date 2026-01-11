import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.skilltrack.app',
  appName: 'Skill Track',
  server: {
    url: 'http://192.168.43.204:3000',
    cleartext: true,
  },
}

export default config
