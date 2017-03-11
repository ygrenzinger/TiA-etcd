ETCD_NAME=$2
ETCD_INITIAL_CLUSTER=$3

etcd --name $ETCD_NAME \
  --initial-advertise-peer-urls http://0.0.0.0:$180 \
  --listen-peer-urls http://0.0.0.0:$180 \
  --listen-client-urls http://0.0.0.0:$179 \
  --advertise-client-urls http://0.0.0.0:$179 \
  --initial-cluster $ETCD_INITIAL_CLUSTER \
  --initial-cluster-state existing \
   --cors='*'
