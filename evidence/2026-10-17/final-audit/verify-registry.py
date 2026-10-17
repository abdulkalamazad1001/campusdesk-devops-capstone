import json,urllib.request
from datetime import datetime,timezone
sha='f9bdd3af7bae550b433845272db006b7a08e34e2'
results=[]
for component in ['backend','frontend']:
 repo=f'abdulkalamazad1001/campusdesk-capstone-{component}'
 with urllib.request.urlopen(f'https://ghcr.io/token?scope=repository:{repo}:pull') as r:token=json.load(r)['token']
 req=urllib.request.Request(f'https://ghcr.io/v2/{repo}/manifests/{sha}',headers={'Authorization':'Bearer '+token,'Accept':'application/vnd.docker.distribution.manifest.list.v2+json, application/vnd.oci.image.index.v1+json'})
 with urllib.request.urlopen(req) as r:
  digest=r.headers.get('Docker-Content-Digest');data=json.load(r)
 platforms=sorted(m['platform']['architecture'] for m in data['manifests'])
 assert platforms==['amd64','arm64']
 results.append({'image':f'ghcr.io/{repo}:{sha}','digest':digest,'architectures':platforms,'anonymousPull':True})
print(json.dumps({'checkedAt':datetime.now(timezone.utc).isoformat(),'images':results},indent=2))
