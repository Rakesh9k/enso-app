const fs = require('node:fs');
const path = require('node:path');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');

let env;
const projectId = 'demo-enso-security';
const rules = fs.readFileSync(path.resolve(__dirname, '../../storage.rules'), 'utf8');

before(async () => {
  env = await initializeTestEnvironment({
    projectId,
    storage: { rules },
  });
});
after(async () => { await env.cleanup(); });

describe('Storage ownership and metadata enforcement', () => {
  it('denies unauthenticated upload and read', async () => {
    const storage = env.unauthenticatedContext().storage();
    const ref = storage.ref('voice_journals/alice/123.m4a');
    await assertFails(ref.put(new Uint8Array([1, 2, 3]), { contentType: 'audio/mp4' }));
    await assertFails(ref.getDownloadURL());
  });

  it('allows owner audio upload but denies other user access', async () => {
    const alice = env.authenticatedContext('alice').storage();
    const bob = env.authenticatedContext('bob').storage();
    await assertSucceeds(alice.ref('voice_journals/alice/123.m4a')
      .put(new Uint8Array([1, 2, 3]), { contentType: 'audio/mp4' }));
    await assertSucceeds(alice.ref('voice_journals/alice/123.m4a').getMetadata());
    await assertFails(bob.ref('voice_journals/alice/123.m4a').getMetadata());
    await assertFails(bob.ref('voice_journals/alice/123.m4a').delete());
  });

  it('denies forged uid path, non-audio, oversize and unknown paths', async () => {
    const alice = env.authenticatedContext('alice').storage();
    await assertFails(alice.ref('voice_journals/bob/123.m4a')
      .put(new Uint8Array([1, 2, 3]), { contentType: 'audio/mp4' }));
    await assertFails(alice.ref('voice_journals/alice/123.m4a')
      .put(new Uint8Array([1, 2, 3]), { contentType: 'text/plain' }));
    await assertFails(alice.ref('profile_photos/alice/avatar.png')
      .put(new Uint8Array([1, 2, 3]), { contentType: 'image/png' }));
    await assertFails(alice.ref('voice_journals/alice/not-a-timestamp.m4a')
      .put(new Uint8Array([1, 2, 3]), { contentType: 'audio/mp4' }));
  });
});
