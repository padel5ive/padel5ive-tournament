import { getStore } from '@netlify/blobs';
import { randomBytes, timingSafeEqual } from 'node:crypto';

const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Access-Control-Allow-Origin':'null'};
const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const validID=id=>typeof id==='string'&&/^[a-zA-Z0-9_-]{6,32}$/.test(id);
const validPayload=data=>data&&data.version===1&&Array.isArray(data.pairs)&&data.pairs.length>=2&&data.pairs.length<=16&&Array.isArray(data.rows)&&Array.isArray(data.results)&&Array.isArray(data.ko)&&data.results.length<=300&&data.ko.length<=80;
export default async function handler(req){
  if(req.method!=='GET'&&req.method!=='POST')return reply({error:'Method not allowed'},405);
  try{
    const store=getStore('padel5ive-results');
    if(req.method==='GET'){
      const id=new URL(req.url).searchParams.get('id');
      if(!validID(id))return reply({error:'Invalid link'},400);
      const data=await store.get('result-'+id,{type:'json',consistency:'strong'});
      return data?reply(data):reply({error:'Results not found'},404);
    }
    const configured=process.env.PADEL5IVE_SHARE_PIN;
    if(!configured||configured.length<8)return reply({error:'PADEL5IVE_SHARE_PIN must be configured (at least 8 characters) in Netlify settings.'},503);
    const received=req.headers.get('x-padel-pin')||'';
    const a=Buffer.from(configured),b=Buffer.from(received);
    if(a.length!==b.length||!timingSafeEqual(a,b))return reply({error:'Incorrect sharing PIN'},401);
    const text=await req.text();
    if(text.length>150000)return reply({error:'Results data too large'},413);
    let body;try{body=JSON.parse(text)}catch{return reply({error:'Invalid JSON'},400)}
    if(!validPayload(body?.data))return reply({error:'Invalid tournament results'},400);
    let id=body.id;
    if(id&&!validID(id))return reply({error:'Invalid existing link ID'},400);
    if(!id){
      for(let i=0;i<5;i++){
        const candidate=randomBytes(7).toString('base64url');
        const existing=await store.get('result-'+candidate,{type:'text'});
        if(!existing){id=candidate;break;}
      }
      if(!id)return reply({error:'Could not generate unique link'},503);
    }
    await store.setJSON('result-'+id,body.data);
    return reply({id});
  }catch(err){console.error('Results API error',err);return reply({error:'Results service temporarily unavailable'},503);}
}
