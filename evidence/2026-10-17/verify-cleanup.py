import json, subprocess
from datetime import datetime, timezone
REGION="ap-south-1"
VPC="vpc-09f58b5fefcde394e"
CLUSTER="campusdesk-24bcs10053"
def aws(*args):
 return json.loads(subprocess.check_output(["aws",*args,"--region",REGION,"--output","json"],text=True))
checks={}
checks["eksClusters"]=aws("eks","list-clusters","--query",f"clusters[?@=='{CLUSTER}']")
checks["vpcs"]=aws("ec2","describe-vpcs","--filters",f"Name=vpc-id,Values={VPC}","--query","Vpcs[].VpcId")
checks["subnets"]=aws("ec2","describe-subnets","--filters",f"Name=vpc-id,Values={VPC}","--query","Subnets[].SubnetId")
checks["activeNatGateways"]=aws("ec2","describe-nat-gateways","--filter",f"Name=vpc-id,Values={VPC}","--query","NatGateways[?State!='deleted'].NatGatewayId")
checks["elasticIPs"]=aws("ec2","describe-addresses","--filters","Name=allocation-id,Values=eipalloc-0d31c38f5b601a298","--query","Addresses[].AllocationId")
checks["loadBalancers"]=aws("elbv2","describe-load-balancers","--query",f"LoadBalancers[?VpcId=='{VPC}'].LoadBalancerName")
checks["classicLoadBalancers"]=aws("elb","describe-load-balancers","--query",f"LoadBalancerDescriptions[?VPCId=='{VPC}'].LoadBalancerName")
checks["activeInstances"]=aws("ec2","describe-instances","--filters",f"Name=vpc-id,Values={VPC}","--query","Reservations[].Instances[?State.Name!='terminated'].InstanceId[]")
checks["databaseVolumes"]=aws("ec2","describe-volumes","--filters","Name=tag:kubernetes.io/created-for/pvc/namespace,Values=campusdesk","--query","Volumes[].VolumeId")
checks["workerVolumes"]=aws("ec2","describe-volumes","--filters",f"Name=tag:kubernetes.io/cluster/{CLUSTER},Values=owned","--query","Volumes[].VolumeId")
checks["networkInterfaces"]=aws("ec2","describe-network-interfaces","--filters",f"Name=vpc-id,Values={VPC}","--query","NetworkInterfaces[].NetworkInterfaceId")
kms=aws("kms","describe-key","--key-id","45bc9ec7-11a2-4792-85fb-7f58ebc79f84","--query","KeyMetadata.{state:KeyState,deletionDate:DeletionDate}")
result={"checkedAt":datetime.now(timezone.utc).isoformat(),"region":REGION,"cluster":CLUSTER,"checks":checks,"kms":kms}
print(json.dumps(result,indent=2))
assert all(not values for values in checks.values()), "Owned resources remain"
assert kms["state"]=="PendingDeletion", "KMS deletion is not scheduled"
print("PASS: no active resources found in the listed project checks; KMS deletion scheduled.")
