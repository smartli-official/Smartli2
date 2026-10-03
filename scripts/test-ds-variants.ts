import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function ping() {
  try {
    const r = await fetch('https://integrate.api.nvidia.com/v1/models', {
      headers: { 'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}` },
      signal: AbortSignal.timeout(15000)
    });
    console.log('models endpoint:', r.status);
  } catch (e: any) {
    console.log('models endpoint error:', e.message, '| cause:', e.cause?.message || e.cause);
  }
}

async function tryModel(model: string, body: any = {}) {
  console.log(`\n--- ${model} ---`);
  const start = Date.now();
  try {
    const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'Say hi in three words.' }],
        max_tokens: 200,
        stream: true,
        ...body
      }),
      signal: AbortSignal.timeout(200_000)
    });
    console.log(`[${((Date.now()-start)/1000).toFixed(1)}s] ${res.status}`);
    if (!res.ok) {
      console.log((await res.text()).slice(0, 200));
      return;
    }
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let text = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      for (const line of decoder.decode(value).split('\n')) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try { text += JSON.parse(line.slice(6)).choices?.[0]?.delta?.content || ''; } catch {}
        }
      }
    }
    console.log(`[${((Date.now()-start)/1000).toFixed(1)}s] OK "${text.trim()}"`);
  } catch (e: any) {
    console.log(`ERROR:`, e.message, '| cause:', e.cause?.message || e.cause);
  }
}

async function main() {
  await ping();
  await tryModel('deepseek-ai/deepseek-v4-flash-0731');
  await tryModel('deepseek-ai/deepseek-v4-flash-0731');
}

main();
