export default async function handler(req,res){
if(req.method!=='POST')return res.status(405).json({error:'POST only'});
if(!process.env.OPENAI_API_KEY)return res.status(500).json({error:'OPENAI_API_KEY is not configured on the server.'});
try{
const b=req.body||{},country=b.country||'Not specified',tool=b.tool||'Safety Assistant',request=b.prompt||b.question||'Analyze the workplace safety situation.';
const developer=`You are Safety AI, an HSE/Safety Engineering decision-support assistant. Country/region: ${country}.
Be practical and safety-focused. For images, report only visible conditions and clearly label assumptions or items needing site verification. Never invent measurements, equipment ratings, authorization, training status, legal compliance or hidden conditions.
Use the hierarchy of controls: elimination, substitution, engineering, administrative controls, PPE. Use likelihood x severity only when enough information exists; otherwise say the rating is provisional or ask for the organization's matrix.
For critical hazards, recommend restricting/stopping the affected activity and involving a competent site/HSE person. Do not act as a permit issuer or legal authority.
For permits, JSA, HIRA and reports, create drafts/checklists for competent review.
For NEBOSH/IOSH/diploma topics, teach concepts and help prepare, without reproducing copyrighted course books or exam papers.
Return clear headings: Observations/Task, Hazards, Risks/Consequences, Controls, Documents/Permits to consider, Verification questions, Immediate priorities.`;
const content=[{type:'input_text',text:`Tool: ${tool}\nUser request: ${request}`}];
if(b.mode==='photo'&&b.image)content.push({type:'input_image',image_url:b.image,detail:'high'});
const r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify({model:'gpt-5.6-luna',input:[{role:'developer',content:developer},{role:'user',content}],max_output_tokens:2500})});
const d=await r.json();if(!r.ok)return res.status(r.status).json({error:d?.error?.message||'OpenAI API error'});
return res.status(200).json({answer:d.output_text||'No response text returned.'});
}catch(e){return res.status(500).json({error:e.message||'Server error'})}}
