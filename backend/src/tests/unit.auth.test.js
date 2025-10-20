const { signQRToken, verifyQRToken } = require('../middleware/auth');
process.env.JWT_SECRET = 'test_secret';
process.env.QR_TTL_SECONDS = '2';

test('QR token valid then expires', (done) => {
  const t = signQRToken('session123', 1);
  const v = verifyQRToken(t);
  expect(v.ok).toBe(true);
  expect(v.sid).toBe('session123');
  setTimeout(() => {
    const v2 = verifyQRToken(t);
    expect(v2.ok).toBe(false);
    done();
  }, 1200);
});
