from pathlib import Path
import re,json
ROOT = Path(__file__).resolve().parent
src=(ROOT/'src/mockup-original.html').read_text()
addon=(ROOT/'src/documents-module.html').read_text()
m=re.search(r'(<script type="__bundler/template">)(.*?)(</script>)',src,re.S)
template=json.loads(m[2]);pos=template.rfind('</body>');template=template[:pos]+addon+template[pos:]
encoded=json.dumps(template,ensure_ascii=False).replace('</','<\\/')
out=src[:m.start(2)]+encoded+src[m.end(2):]
(ROOT/'Nyx-Documents.html').write_text(out)
