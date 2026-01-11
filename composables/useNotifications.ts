import { ref } from 'vue'
import { initializeApp, getApps } from 'firebase/app'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'
import { useSaveFcmToken } from '@@/queries/notifications'
import { playNotificationSound } from '@@/utils/playNotificationSound'

export function useNotifications() {
  const token = ref<string | null>(null)

  const init = async () => {
    if (import.meta.server) return

    const supported = await isSupported()
    if (!supported) return

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
    await navigator.serviceWorker.ready

    const config = useRuntimeConfig()
    const toast = useToast()

    const firebaseConfig = {
      apiKey: config.public.firebaseApiKey,
      authDomain: config.public.firebaseAuthDomain,
      projectId: config.public.firebaseProjectId,
      storageBucket: config.public.firebaseStorageBucket,
      messagingSenderId: config.public.firebaseMessagingSenderId,
      appId: config.public.firebaseAppId,
    }

    const app = getApps().length
      ? getApps()[0]
      : initializeApp(firebaseConfig)

    const messaging = getMessaging(app)

    const fcmToken = await getToken(messaging, {
      vapidKey: config.public.firebaseVapidKey,
      serviceWorkerRegistration: registration,
    })

    if (!fcmToken) return

    token.value = fcmToken
    await useSaveFcmToken(fcmToken)

    onMessage(messaging, (payload) => {
      playNotificationSound()

      toast.add({
        description: payload?.notification?.body,
        color: 'success',
        class: 'text-black bg-white',
      })
    })
  }

  return { init, token }
}
