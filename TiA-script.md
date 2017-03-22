./start-cluster.sh #default port 2380 / 2379

./curl-add-member.sh member2 24
./start-newmember.sh 24 member2 origin=http://0.0.0.0:2380,member2=http://0.0.0.0:2480

curl http://0.0.0.0:2379/v2/members -XPOST \
  -H "Content-Type: application/json" \
  -d '{"peerURLs":["http://0.0.0.0:2580"]}'

./curl-add-member.sh member3 25
./start-newmember.sh 25 member3 origin=http://0.0.0.0:2380,member3=http://0.0.0.0:2580,member2=http://0.0.0.0:2480

curl http://0.0.0.0:2579/v2/keys/toggles/etcd -XPUT -d value="on"

# stop origin for leader election
# restart origin
# stop member2
# etcdctl cluster-health > healthy
# stop member3
# etcdctl cluster-health > unhealthy / no leader because split brains
# restarting etcd member works directly
# because id of members are registered in the cluster-health
#

# testing change and notifications
# curl http://0.0.0.0:2579/v2/keys/toggles/etcd -XPUT -d value="on"

# with ttl
# curl http://0.0.0.0:2579/v2/keys/foo -XPUT -d value=bar -d ttl=5
# etcdctl ls

# created in order
# curl http://0.0.0.0:2379/v2/keys/queue -XPOST -d value=Job1
# curl -s 'http://0.0.0.0:2379/v2/keys/queue?recursive=true&sorted=true'

# Atomic Compare-and-Swap, Atomic Compare-and-Delete
# used to build a distributed lock service.

# https://coreos.com/etcd/docs/latest/op-guide/clustering.html
# https://coreos.com/etcd/docs/latest/etcd-live-cluster-reconfiguration.html
# https://coreos.com/etcd/docs/latest/v2/api.html
