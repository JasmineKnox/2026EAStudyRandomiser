"""Rebuild browser data, standalone HTML and audit after editing content-bank.json."""
from pathlib import Path
import json,csv,re
root=Path(__file__).resolve().parent
bank=json.loads((root/'content-bank.json').read_text())
(root/'bank.js').write_text('window.STUDY_BANK = '+json.dumps(bank,ensure_ascii=False,indent=2)+';\n')
html=(root/'index.html').read_text()
html=re.sub(r'<link rel="stylesheet" href="style\.css(?:\?[^"]*)?">',lambda _: '<style>\n'+(root/'style.css').read_text()+'\n</style>',html)
for name in ['bank.js','engine.js','app.js']:
    html=re.sub(r'<script src="'+re.escape(name)+r'(?:\?[^"]*)?"></script>',lambda _: '<script>\n'+(root/name).read_text().replace('</script','<\\/script')+'\n</script>',html)
(root/'EA_Study_Randomiser.html').write_text(html)
with (root/'Content_Audit.csv').open('w',newline='',encoding='utf-8-sig') as f:
    writer=csv.writer(f)
    writer.writerow(['Subject','EA coverage','Syllabus version','Unit/topic','Specific content','Focus','Task type','Required selection','Checked','Syllabus URL','QCAA resources'])
    for s in bank['subjects']:
        for t in s['topics']:
            writer.writerow([s['name'],s['coverage'],s['version'],t['unit'],t['title'],'; '.join(t['focus']),t['kind'],t['option'] or (s['option']['label'] if s['option'] else ''),bank['checked'],s['syllabus'],s['page']])
print('Standalone HTML and content audit rebuilt.')
