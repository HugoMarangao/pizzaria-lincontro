// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyDDkivLXJyAWo3mvD0xxKZV-sNJUig5WGw",
    authDomain: "pizzaria-lincontro.firebaseapp.com",
    projectId: "pizzaria-lincontro",
    storageBucket: "pizzaria-lincontro.appspot.com",
    messagingSenderId: "787711824906",
    appId: "1:787711824906:web:5ace3d37b3d2e6a7757bf3",
    measurementId: "G-Z9GPGXT5W2"
  };
  
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './logo.png',
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});