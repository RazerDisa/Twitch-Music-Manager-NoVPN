export default function handler(req,res){
if(req.method!=='GET')return res.status(405).end();
const p=Number(req.query.part);if(!Number.isInteger(p)||p<0||p>=42)return res.status(400).end();
const rate=44100,n=rate*10,b=Buffer.alloc(44+n*4);
b.write('RIFF',0);b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(2,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*4,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(n*4,40);
for(let i=0;i<n;i++){const t=i/rate+p*10;const e=0.5-0.5*Math.cos(2*Math.PI*t);b.writeInt16LE(Math.round(1000*e*Math.sin(2*Math.PI*330*t)),44+i*4);b.writeInt16LE(Math.round(1000*e*Math.sin(2*Math.PI*440*t)),46+i*4)}
res.setHeader('Content-Type','audio/wav');res.setHeader('Access-Control-Allow-Origin','https://razerdisa.github.io');res.setHeader('Cache-Control','public, max-age=86400, s-maxage=86400');res.end(b)}