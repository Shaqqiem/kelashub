const { sendPushToUser } = require('../routes/push');

function start(prisma) {
  const pollSecs = parseInt(process.env.REMINDER_POLL_SECONDS || '60');
  const windowMins = parseInt(process.env.REMINDER_WINDOW_MINUTES || '10');

  async function tick() {
    const now = new Date();
    const soon = new Date(now.getTime() + windowMins * 60 * 1000);

    const sessions = await prisma.session.findMany({
      where: { startsAt: { gte: now, lte: soon } },
      include: { class: true }
    });

    for (const s of sessions) {
      // find enrolled users
      const enrollments = await prisma.enrollment.findMany({ where: { classId: s.classId }, include: { user: true }});
      await Promise.all(enrollments.map(enr =>
        sendPushToUser(prisma, enr.userId, {
          title: `Upcoming session: ${s.title}`,
          body: `Starts at ${new Date(s.startsAt).toLocaleString()} (Class: ${s.class.title})`
        })
      ));
    }
    // eslint-disable-next-line no-console
    console.log(`[reminder] tick ${now.toISOString()} sessions=${sessions.length}`);
  }

  setInterval(tick, pollSecs * 1000);
  // initial tick
  tick().catch(() => {});
}

module.exports = { start };
