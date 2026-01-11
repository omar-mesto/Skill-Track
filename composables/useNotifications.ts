import { ref } from 'vue'
import { initializeApp, getApps } from 'firebase/app'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'
import { useSaveFcmToken } from '@@/queries/notifications'
import { playNotificationSound } from '@@/utils/playNotificationSound'

export function useNotifications() {
  const token = ref<string | null>(null)

  const init = async () => {
    if (import.meta.server) {
      return
    }

    const supported = await isSupported()
    if (!supported) return

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
    await navigator.serviceWorker.ready

    const config = useRuntimeConfig()
    const toast = useToast()

    const firebaseConfig = {
      apiKey: config.public.firebaseApiKey as string,
      authDomain: config.public.firebaseAuthDomain as string,
      projectId: config.public.firebaseProjectId as string,
      storageBucket: config.public.firebaseStorageBucket as string,
      messagingSenderId: config.public.firebaseMessagingSenderId as string,
      appId: config.public.firebaseAppId as string,
    }

    const app = getApps().length
      ? getApps()[0]
      : initializeApp(firebaseConfig)

    const messaging = getMessaging(app)

    const t = await getToken(messaging, {
      vapidKey: config.public.firebaseVapidKey as string,
      serviceWorkerRegistration: registration,
    })
    if (!t) return

    token.value = t

    await useSaveFcmToken(t)
    playNotificationSound()
    onMessage(messaging, (payload) => {
      toast.add({ description: payload?.notification?.body, color: 'success', class: 'text-black bg-white' })
    })
  }

  return {
    init,
    token,
  }
}
