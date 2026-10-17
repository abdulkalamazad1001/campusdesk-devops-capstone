import json,subprocess,urllib.request
from datetime import datetime,timezone

def kube(ns,*args):
 return json.loads(subprocess.check_output(['kubectl','--context','kind-campusdesk','-n',ns,*args,'-o','json'],text=True))
expected='f9bdd3af7bae550b433845272db006b7a08e34e2'
app=kube('argocd','get','application','campusdesk')['status']
assert app['sync']['status']=='Synced' and app['health']['status']=='Healthy'
deployments=[]
for name in ['backend','frontend']:
 d=kube('campusdesk','get','deployment',name)
 image=d['spec']['template']['spec']['containers'][0]['image']
 replicas=d['status'].get('availableReplicas',0)
 assert image.endswith(':'+expected) and replicas>=2
 deployments.append({'name':name,'image':image,'availableReplicas':replicas})
with urllib.request.urlopen('http://localhost:9090/api/v1/targets') as r:targets=json.load(r)['data']['activeTargets']
assert len(targets)>=2 and all(t['health']=='up' for t in targets)
with urllib.request.urlopen('http://localhost:8000/ready') as r:ready=json.load(r)
print(json.dumps({'checkedAt':datetime.now(timezone.utc).isoformat(),'context':'kind-campusdesk','argo':{'sync':app['sync']['status'],'health':app['health']['status'],'revision':app['sync']['revision']},'deployments':deployments,'prometheusTargets':[{'url':t['scrapeUrl'],'health':t['health']} for t in targets],'composeReadiness':ready},indent=2))
print('PASS: final application release is healthy and monitored.')
