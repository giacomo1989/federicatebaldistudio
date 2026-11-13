import fs from 'node:fs';
import path from 'node:path';
const projects=JSON.parse(fs.readFileSync('data/projects.json','utf8'));
const scan=dir=>fs.existsSync(dir)?fs.readdirSync(dir).filter(f=>/^\d+\.(jpe?g|png|webp|avif)$/i.test(f)).sort((a,b)=>parseInt(a)-parseInt(b)||a.localeCompare(b)).map(f=>`${dir}/${f}`):[];
fs.writeFileSync('data/images-manifest.json',JSON.stringify({home:scan('images/foto-dinamiche-home'),projects:Object.fromEntries(projects.map(p=>[p.id,scan(p.imageFolder)]))},null,2));
