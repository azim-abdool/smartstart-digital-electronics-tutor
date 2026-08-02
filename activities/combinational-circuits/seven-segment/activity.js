"use strict";
const MAP={0:"abcdef",1:"bc",2:"abdeg",3:"abcdg",4:"bcfg",5:"acdfg",6:"acdefg",7:"abc",8:"abcdefg",9:"abcdfg"};
const digit=document.querySelector('#digit'), bcd=document.querySelector('#bcd'), segments=document.querySelector('#segments');
function show(n){const active=MAP[n]; bcd.textContent=Number(n).toString(2).padStart(4,'0'); segments.textContent='abcdefg'.split('').map(s=>active.includes(s)?1:0).join(''); document.querySelectorAll('.segment').forEach(el=>el.classList.toggle('on',active.includes(el.id.slice(-1))));}
digit.addEventListener('input',()=>show(digit.value)); show(digit.value);
const chosen=new Set(); document.querySelectorAll('.segment-toggle').forEach(b=>b.addEventListener('click',()=>{const s=b.dataset.segment; chosen.has(s)?chosen.delete(s):chosen.add(s); b.classList.toggle('on',chosen.has(s));}));
document.querySelector('#clear').addEventListener('click',()=>{chosen.clear();document.querySelectorAll('.segment-toggle').forEach(b=>b.classList.remove('on'));});
document.querySelector('#check').addEventListener('click',()=>{const expected=MAP[document.querySelector('#target').value];const actual=[...chosen].sort().join('');const fb=document.querySelector('#feedback');const ok=actual===expected.split('').sort().join('');fb.className='feedback '+(ok?'correct':'incorrect');fb.textContent=ok?'Correct. The selected segments form the requested digit.':`Not yet. The required active segments are ${expected.split('').join(', ')}.`;if(ok)SmartStartProgress.complete('seven-segment');});
