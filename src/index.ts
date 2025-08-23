// ---- Global handlers FIRST ----
process.on('uncaughtException', (err: unknown) => {
  console.error('❌ Uncaught Exception');
  if (err instanceof Error) {
    console.error('Name:', err.name);
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);
  } else {
    console.error('Non-Error thrown:', err);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown, promise) => {
  console.error('❌ Unhandled Rejection');
  console.error('Promise:', promise);
  if (reason instanceof Error) {
    console.error('Name:', reason.name);
    console.error('Message:', reason.message);
    console.error('Stack:', reason.stack);
  } else {
    console.error('Reason (non-Error):', reason);
  }
  process.exit(1);
});

// Enable TS source maps for clean stack traces
try {
  const sms = await import('source-map-support');
  sms.default.install();
  console.log('✅ Source map support installed');
} catch (err) {
  console.error('Source map support not installed', err);
}

// IMPORTANT: Await the server import so the process stays alive.
await import('./server.js');
