export default function handler(req,res){
if(req.method!=='GET')return res.status(405).end();
const part=Number(req.query.part);if(!Number.isInteger(part)||part<0||part>=42)return res.status(400).end();
const rate=16000,n=rate*10,b=Buffer.alloc(44+n*2);
b.write('RIFF',0);b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(n*2,40);
for(let i=0;i<n;i++){const t=i/rate,p=t%1; b.writeInt16LE(Math.round(1800*Math.max(0,Math.min(1,p*30,(.65-p)*30))*Math.sin(2*Math.PI*(Math.floor(t)%2?440:330)*t)),44+i*2)}
res.setHeader('Content-Type','audio/wav');res.setHeader('Access-Control-Allow-Origin','https://razerdisa.github.io');res.setHeader('Cache-Control','public, max-age=86400');res.setHeader('Content-Length',b.length);res.status(200).end(b)
}