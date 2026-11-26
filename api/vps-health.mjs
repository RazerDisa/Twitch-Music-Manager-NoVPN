export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  res.setHeader('Access-Control-Allow-Origin','*');
  try {
    const r=await fetch('http://fr2.switched.cloud:20991/',{signal:AbortSignal.timeout(10000),redirect:'error'});
    const body=await r.text();
    const ok=r.ok && body.trim()==='Music NoVPN Server OK';
    return res.status(ok?200:502).json({ok,upstreamStatus:r.status,expectedResponse:ok});
  } catch(e) {
    return res.status(502).json({ok:false,error:String(e.message)});
  }
}
