export default async function handler(request) {
  const headers = {'Cache-Control':'no-store'};
  if (request.method !== 'GET') return new Response(null,{status:405,headers});
  const start = Date.now();
  try {
    const upstream = await fetch('https://novpn.4evr.sh/speed-test.bin',{headers:{Range:'bytes=0-1048575'},redirect:'error',signal:AbortSignal.timeout(15000)});
    if (!upstream.ok) throw new Error('Upstream HTTP '+upstream.status);
    const reader = upstream.body.getReader();
    const out = new Uint8Array(1048576);
    let bytes = 0;
    try {
      while(bytes < out.length) {
        const {done,value} = await reader.read();
        if(done) break;
        const part = value.subarray(0,out.length-bytes);
        out.set(part,bytes); bytes += part.length;
      }
    } finally { await reader.cancel().catch(()=>{}); }
    if(bytes !== out.length) throw new Error('Incomplete test: '+bytes);
    return new Response(out,{headers:{...headers,'Content-Type':'application/octet-stream','X-Upstream-Time-Ms':String(Date.now()-start)}});
  } catch(e) {
    return new Response(JSON.stringify({error:e.message,elapsedMs:Date.now()-start}),{status:502,headers:{...headers,'Content-Type':'application/json'}});
  }
}
