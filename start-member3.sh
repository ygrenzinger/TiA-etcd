ETCD_NAME="member3"
ETCD_INITIAL_CLUSTER="origin=http://0.0.0.0:2380,member3=http://0.0.0.0:2580,member2=http://0.0.0.0:2480"
ETCD_INITIAL_CLUSTER_STATE="existing"
PORT_PEER=2580
PORT_CLIENT=2579

etcd --name $ETCD_NAME \
  --initial-advertise-peer-urls http://0.0.0.0:$PORT_PEER \
  --listen-peer-urls http://0.0.0.0:$PORT_PEER \
  --listen-client-urls http://0.0.0.0:$PORT_CLIENT \
  --advertise-client-urls http://0.0.0.0:$PORT_CLIENT \
  --initial-cluster $ETCD_INITIAL_CLUSTER \
  --initial-cluster-state $ETCD_INITIAL_CLUSTER_STATE \
   --cors='*'
