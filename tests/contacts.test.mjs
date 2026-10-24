import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const section=html.match(/<section class="contacts"[\s\S]*?<\/section>/)?.[0];
assert.ok(section,'Contacts section exists');
for(const [label,href,value] of [
 ['email','mailto:m.karpovich2010@gmail.com','m.karpovich2010@gmail.com'],
 ['Telegram','https://t.me/winquix','@winquix'],
 ['VK','https://vk.com/winquix','winquix']
]){
 assert.ok(section.includes(`href="${href}"`),`${label} has correct destination`);
 assert.ok(section.includes(`class="contact-value">${value}</span>`),`${label} has visible contact information`);
}
assert.equal((section.match(/class="contact-link"/g)||[]).length,3);
assert.equal((section.match(/class="contact-icon"/g)||[]).length,3);
assert.equal((section.match(/aria-hidden="true" focusable="false"/g)||[]).length,3);
assert.equal((section.match(/target="_blank" rel="noopener noreferrer"/g)||[]).length,2);
assert.equal((section.match(/(?:fill|stroke)="currentColor"/g)||[]).length,3,'All icons inherit the monochrome text color');
assert.ok(!/<(?:img|script)\b/i.test(section),'Contacts do not load remote icon images or scripts');
assert.ok(html.includes('href="#contacts"'),'Demonstration links to contacts');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'IDs are unique');
for(const [,id] of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(id),`Anchor #${id} exists`);
for(const [,script] of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(script);
console.log('Contact links, monochrome SVG, accessibility, anchors and JavaScript: PASS');
