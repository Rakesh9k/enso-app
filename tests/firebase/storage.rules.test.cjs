const fs = require('node:fs');
const path = require('node:path');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');
const { ref, uploadBytes, getMetadata, deleteObject } = require('firebase/storage');

let env;
const projectId = 'demo-enso-security';
const rules = fs.readFileSync(path.resolve(__dirname, '../../storage.rules'), 'utf8');

before(async () => {
  env = await initializeTestEnvironment({ projectId, storage: { rules } });
});
after(async () => { await env.cleanup(); });

describe('Storage ownership and metadata enforcement', () => {
  it('denies unauthenticated reads and writes to a known private object', async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await uploadBytes(ref(ctx.storage(), 'voice_journals/alice/123.m4a'),
        new Uint8Array([1, 2, 3]), { contentType: 'audio/mp4' });
    });
    const storage = env.unauthenticatedContext().storage();
    await assertFails(getMetadata(ref(storage, 'voice_journals/alice/123.m4a')));
    await assertFails(uploadBytes(ref(storage, 'voice_journals/alice/456.m4a'),
      new Uint8Array([1, 2, 3]), { contentType: 'audio/mp4' }));
  });

  it('allows owner audio upload but denies other user access', async () => {
    const alice = env.authenticatedContext('alice').storage();
    const bob = env.authenticatedContext('bob').storage();
    const aliceRef = ref(alice, 'voice_journals/alice/123.m4a');
    await assertSucceeds(uploadBytes(aliceRef, new Uint8Array([1, 2, 3]), { contentType: 'audio/mp4' }));
    await assertSucceeds(getMetadata(aliceRef));
    await assertFails(getMetadata(ref(bob, 'voice_journals/alice/123.m4a')));
    await assertFails(deleteObject(ref(bob, 'voice_journals/alice/123.m4a')));
  });

  it('denies forged uid paths, non-audio, oversize and unknown paths', async () => {
    const alice = env.authenticatedContext('alice').storage();
    await assertFails(uploadBytes(ref(alice, 'voice_journals/bob/123.m4a'),
      new Uint8Array([1, 2, 3]), { contentType: 'audio/mp4' }));
    await assertFails(uploadBytes(ref(alice, 'voice_journals/alice/123.m4a'),
      new Uint8Array([1, 2, 3]), { contentType: 'text/plain' }));
    await assertFails(uploadBytes(ref(alice, 'profile_photos/alice/avatar.png'),
      new Uint8Array([1, 2, 3]), { contentType: 'image/png' }));
    await assertFails(uploadBytes(ref(alice, 'voice_journals/alice/not-a-timestamp.m4a'),
      new Uint8Array([1, 2, 3]), { contentType: 'audio/mp4' }));
    await assertFails(uploadBytes(ref(alice, 'voice_journals/alice/oversize.m4a'),
      new Uint8Array(5 * 1024 * 1024 + 1), { contentType: 'audio/mp4' }));
  });
});
