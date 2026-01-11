importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "AIzaSyCrMGnEBan380c2Rr2HNNoOBRlTqW0dlDw",
  authDomain: "skill-truck-765a5.firebaseapp.com",
  projectId: "skill-truck-765a5",
  storageBucket: "skill-truck-765a5.firebasestorage.app",
  messagingSenderId: "142849981352",
  appId: "1:142849981352:web:2ac20bbe3df1cdac08bb9d",
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || 'Notification'
  const options = { body: payload?.notification?.body || '' }
  self.registration.showNotification(title, options)
})
