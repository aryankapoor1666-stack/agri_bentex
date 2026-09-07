"""Run with: python3 scripts/verify-site.py"""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
ROOT = Path(__file__).resolve().parents[1]
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path=path; self.stack=[]; self.ids=set(); self.links=[]; self.base=path.as_uri(); self.mains=0; self.products=0
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='base': self.base=urljoin(self.path.as_uri(),a['href'])
        if tag=='main': self.mains+=1
        if 'part-card' in a.get('class','').split(): self.products+=1
        if 'id' in a:
            assert a['id'] not in self.ids, (self.path,'Duplicate ID',a['id'])
            self.ids.add(a['id'])
        for name in ['href','src','action']:
            if name in a and tag!='base': self.links.append(a[name])
        if tag not in VOID:self.stack.append(tag)
    def handle_endtag(self,tag):
        assert self.stack and self.stack.pop()==tag,(self.path,'Invalid nesting',tag)
pages=[ROOT/'index.html',ROOT/'contact.html',ROOT/'enquiry.html',*sorted((ROOT/'categories').glob('*.html')),*sorted((ROOT/'products').glob('*.html'))]
assert len(pages)==228
parsed={}
for path in pages:
    p=Page(path);p.feed(path.read_text());assert not p.stack,path
    assert p.mains==1,(path,p.mains)
    parsed[path]=p
for path,p in parsed.items():
    for link in p.links:
        target=urlsplit(urljoin(p.base,link))
        if target.scheme!='file':continue
        file=Path(unquote(target.path))
        assert file.is_file(),(path,'Missing local target',link,file)
        if target.fragment and file in parsed:
            assert target.fragment in parsed[file].ids,(path,'Missing fragment',link)
assert sum(p.products for path,p in parsed.items() if path.parent.name=='categories')==222
assert all(p.products==0 for path,p in parsed.items() if path.parent.name=='products')
print('PASS: 228 HTML pages, nesting, unique IDs, one main per page, all local links/assets/fragments and 222 static catalogue cards.')
