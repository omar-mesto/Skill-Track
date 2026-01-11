let audio: HTMLAudioElement | null = null

export const playNotificationSound = () => {
  if (!audio) {
    audio = new Audio('/sounds/notification.mp3')
    audio.volume = 0.7
  }

  audio.currentTime = 0
  audio.play().catch(() => {
  })
}
