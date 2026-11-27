export default async function handler(req,res) {
  if(req.method !== 'GET') return res.status(405).end();
  res.setHeader('Cache-Control','no-store');
  const start=Date.now();
  try {
    const upstream=await fetch('https://novpn.4evr.sh/speed-test.bin',{headers:{Range:'bytes=0-1048575'},redirect:'error',signal:AbortSignal.timeout(15000)});
    if(!upstream.ok) return res.status(502).json({upstreamStatus:upstream.status});
    const reader=upstream.body.getReader();
    const chunks=[]; let bytes=0;
    while(bytes<1048576){
      const {done,value}=await reader.read(); if(done) break;
      const part=value.subarray(0,1048576-bytes); chunks.push(Buffer.from(part)); bytes+=part.length;
    }
    await reader.cancel().catch(()=>{});
    if(bytes!==1048576) return res.status(502).json({bytes,error:'Incomplete test'});
    res.setHeader('Content-Type','application/octet-stream');
    res.setHeader('X-Upstream-Time-Ms',String(Date.now()-start));
    res.status(200).send(Buffer.concat(chunks));
  } catch(e){res.status(502).json({error:String(e.message),elapsedMs:Date.now()-start});}
}
