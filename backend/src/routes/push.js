const router = require('express').Router();
const webpush = require('web-push');
const { requireAuth } = require('../middleware/auth');

function configureWebPush() {
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const sub = process.env.VAPID_SUBJECT || 'mailto:admin@example.com';
  if (pub && priv) {
    webpush.setVapidDetails(sub, pub, priv);
  }
}
configureWebPush();

router.get('/vapid-public', (_req, res) => {
  res.json({ key: process.env.VAPID_PUBLIC_KEY || '' });
});

router.post('/subscribe', requireAuth, async (req, res) => {
  const { endpoint, keys } = req.body || {};
  if (!endpoint || !keys || !keys.p256dh || !keys.auth) return res.status(400).json({ error: 'Invalid subscription' });

  await req.prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { userId: req.user.id, p256dh: keys.p256dh, auth: keys.auth },
    create: { userId: req.user.id, endpoint, p256dh: keys.p256dh, auth: keys.auth }
  });

  res.json({ status: 'subscribed' });
});

// helper to send a push
async function sendPushToUser(prisma, userId, payload) {
  const subs = await prisma.pushSubscription.findMany({ where: { userId }});
  await Promise.all(subs.map(async s => {
    try {
      await webpush.sendNotification({
        endpoint: s.endpoint,
        keys: { p256dh: s.p256dh, auth: s.auth }
      }, JSON.stringify(payload));
    } catch (e) {
      if (e.statusCode === 410 || e.statusCode === 404) {
        await prisma.pushSubscription.delete({ where: { endpoint: s.endpoint }});
      }
    }
  }));
}

router.post('/test', requireAuth, async (req, res) => {
  await sendPushToUser(req.prisma, req.user.id, { title: 'Hello from KelasHub', body: 'This is a test push.' });
  res.json({ status: 'sent' });
});

module.exports = router;
module.exports.sendPushToUser = async (prisma, userId, payload) => {
  const webpush = require('web-push');
  return Promise.resolve().then(async () => {
    const subs = await prisma.pushSubscription.findMany({ where: { userId }});
    for (const s of subs) {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth }}, JSON.stringify(payload));
      } catch (e) {
        if (e.statusCode === 410 || e.statusCode === 404) {
          await prisma.pushSubscription.delete({ where: { endpoint: s.endpoint }});
        }
      }
    }
  });
};
