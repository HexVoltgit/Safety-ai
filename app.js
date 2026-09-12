const ws=document.getElementById('workspace');
function shell(title,body){ws.innerHTML=`<h2>${title}</h2>${body}`;ws.scrollIntoView({behavior:'smooth',block:'start'})}
function scanner(){shell('📸 Photo Hazard Scanner',`<p>Upload a clear workplace photo and describe the task if you know it.</p><div class="upload"><input id="photo" type="file" accept="image/jpeg,image/png,image/webp"></div><label>Country / region</label><input id="country" class="field" value="India"><label>What do you want to know?</label><textarea id="question" class="field" rows="3">Identify visible hazards, explain risks, recommend controls using the hierarchy of controls, and tell me what HIRA/JSA/permit/checklist may need to be considered.</textarea><button class="primary" onclick="runVision()">🔍 Analyze photo</button><div id="out"></div>`)}
async function compressImage(file){return new Promise((resolve,reject)=>{const img=new Image(),c=document.createElement('canvas'),r=new FileReader();r.onload=()=>{img.onload=()=>{let w=1600,h=img.height*(1600/img.width);if(img.width<1600){w=img.width;h=img.height}c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);resolve(c.toDataURL('image/jpeg',.82))};img.onerror=reject;img.src=r.result};r.onerror=reject;r.readAsDataURL(file)})}
async function runVision(){const f=document.getElementById('photo')?.files[0],out=document.getElementById('out');if(!f){alert('Please select a photo.');return}out.innerHTML='<p class="status">🤖 Safety AI is analyzing the image…</p>';try{const image=await compressImage(f);const res=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image,country:document.getElementById('country').value,question:document.getElementById('question').value,mode:'photo'})});const data=await res.json();if(!res.ok)throw new Error(data.error||'AI request failed');out.innerHTML=`<div class="result">${escapeHtml(data.answer)}</div>`}catch(e){out.innerHTML=`<div class="result">Error: ${escapeHtml(e.message)}\n\nThe server must have OPENAI_API_KEY configured.</div>`}}

function learningHub(){
shell('🎓 HSE Learning Hub',`
<p>Choose a learning pathway. The AI can explain concepts, create revision notes, quizzes, scenarios and study plans.</p>
<div class="academy">
<button onclick="course('NEBOSH')">🇬🇧 <b>NEBOSH</b><span>IGC • Diploma • Fire Safety • Construction • Environmental</span></button>
<button onclick="course('IOSH')">🦺 <b>IOSH</b><span>Managing Safely • Working Safely • safety leadership concepts</span></button>
<button onclick="course('Advanced Diploma')">🎓 <b>Advanced Diploma</b><span>Occupational Health & Safety • HSE • Industrial Safety • Fire & Safety</span></button>
<button onclick="course('International HSE')">🌍 <b>International HSE</b><span>Global safety practice • audits • risk • emergency management</span></button>
<button onclick="course('ISO & Auditing')">📑 <b>ISO & Auditing</b><span>ISO 45001 • ISO 14001 • ISO 9001 • internal/lead-auditor concepts</span></button>
<button onclick="course('Specialist Safety')">🏗️ <b>Specialist Safety</b><span>Construction • Oil & Gas • Process • Electrical • Fire • Environmental</span></button>
</div>
<div id="courseOut"></div>`);
}

function course(name){
const out=document.getElementById('courseOut');
out.innerHTML=`
<h3>${name}</h3>
<label>What do you want to learn?</label>
<textarea id="prompt" class="field" rows="5" placeholder="Example: Teach me this topic from beginner to advanced, then give me MCQs and a practical scenario."></textarea>
<button class="primary" onclick="runCourse('${name}')">🤖 Learn with Safety AI</button>`;
}
async function runCourse(name){
const out=document.getElementById('courseOut');
out.innerHTML='<p class="status">🤖 Building your lesson…</p>';
try{
const res=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},
body:JSON.stringify({country:'International',prompt:document.getElementById('prompt').value,mode:'text',tool:name+' Learning'})});
const data=await res.json();
if(!res.ok) throw new Error(data.error||'AI request failed');
out.innerHTML=`<div class="result">${escapeHtml(data.answer)}</div>`;
}catch(e){out.innerHTML=`<div class="result">Error: ${escapeHtml(e.message)}</div>`}
}

function textTool(mode){shell(mode,`<p>Describe the job, activity or question.</p><label>Country / region</label><input id="country" class="field" value="India"><textarea id="prompt" class="field" rows="6" placeholder="Example: Excavation for a 2 m deep trench near a road. Prepare a practical risk assessment."></textarea><button class="primary" onclick="runText('${mode}')">🤖 Ask Safety AI</button><div id="out"></div>`)}
async function runText(mode){const out=document.getElementById('out');out.innerHTML='<p class="status">🤖 Preparing safety guidance…</p>';try{const res=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({country:document.getElementById('country').value,prompt:document.getElementById('prompt').value,mode:'text',tool:mode})});const data=await res.json();if(!res.ok)throw new Error(data.error||'AI request failed');out.innerHTML=`<div class="result">${escapeHtml(data.answer)}</div>`}catch(e){out.innerHTML=`<div class="result">Error: ${escapeHtml(e.message)}</div>`}}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}

// SAFETY AI V3 UI enhancement

document.addEventListener('DOMContentLoaded',()=>{const f=document.querySelector('input[type="file"]'),b=document.getElementById('v3ScanBtn');if(f&&b)f.addEventListener('change',()=>{if(f.files&&f.files.length)b.textContent='Photo Selected ✓';});});
