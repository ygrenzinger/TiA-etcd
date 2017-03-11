etcd --name origin \
  --initial-advertise-peer-urls http://0.0.0.0:2380 \
  --listen-peer-urls http://0.0.0.0:2380  \
  --listen-client-urls http://0.0.0.0:2379 \
  --advertise-client-urls http://0.0.0.0:2379  \
  --initial-cluster-token devoxx-cluster \
  --initial-cluster origin=http://0.0.0.0:2380 \
  --initial-cluster-state new \
   --cors='*'

# the name:listen-peer-urls must be the same in the initial-cluster
