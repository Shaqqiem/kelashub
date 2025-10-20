self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data.json(); } catch {}
  const title = data.title || 'KelasHub';
  const options = {
    body: data.body || '',
    icon: '/kelashub-v3/icon.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
