import { makeEvent } from '@/lib/generator';

// Stream simulated attack events using Server-Sent Events.
// Works on Vercel (Node runtime) without a persistent WebSocket server.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;

      const send = (data: unknown) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Initial burst so the map populates immediately.
      for (let i = 0; i < 8; i += 1) send(makeEvent());

      const interval = setInterval(() => {
        const batch = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < batch; i += 1) send(makeEvent());
      }, 700);

      // Stop after a bounded window to avoid unbounded serverless execution;
      // the client auto-reconnects via EventSource.
      const timeout = setTimeout(() => {
        clearInterval(interval);
        closed = true;
        controller.close();
      }, 60000);

      // @ts-expect-error attach for potential cancel cleanup
      stream._cleanup = () => {
        clearInterval(interval);
        clearTimeout(timeout);
        closed = true;
      };
    },
    cancel() {
      // @ts-expect-error optional cleanup hook
      this._cleanup?.();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
