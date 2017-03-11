const request = require('request');
const _ = require('lodash');
const Etcd = require('node-etcd');
const etcdMembersUrl = ['http://0.0.0.0:2379', 'http://0.0.0.0:2479', 'http://0.0.0.0:2479'];
const etcd = new Etcd(etcdMembersUrl);

let socket = null;
exports.setSocket = function(s) {
  socket = s;
};

let members = {};
exports.machines = function(req, res) {
  const url =  'http://0.0.0.0:2379/v2/members';
  request(url, function (error, response, body) {
    data = JSON.parse(body);
    if (!error) {
      members = _.map(data.members, (member) => {
          return {
            'id': member.id,
            'name': member.name,
            'url': member.clientURLs[0]
          }
        });
    }
    res.json(members);
  });
};

exports.health = function(req, res) {
  const machine = _.find(members, { 'name': req.params.name });
  request(machine.url+'/health', function (error, response, body) {
    let health = false;
    if (!error) {
      health = true;
    }
    res.json({'health': health});
  });
};

exports.isLeader = function(req, res) {
  const machine = _.find(members, { 'name': req.params.name });
  request(machine.url+'/v2/stats/leader', function (error, response, body) {
    let leader = false;
    if (!error) {
        if (JSON.parse(body).leader) {
          leader = true;
        }
    }
    res.json({'leader': leader});
  });
};

var toggleDir = 'toggles/';
exports.createTogglesDirectory = function(req, res) {
  console.log('create toggles directory');
  etcd.mkdir(toggleDir, function(response) {
    console.log('create watcher of toggles directory');
    var watcher = etcd.watcher(toggleDir, null, {recursive: true});
    watcher.on("change", function(change) {
      console.log('send change '+JSON.stringify(change));
      socket.emit('send:notifications', change);
    });
    res.json(response);
  });
};

exports.setToggle = function(req, res) {
  const key = req.params.key;
  const value = req.params.value;
  console.log('set ' + toggleDir+key + ' with ' + value);
  etcd.set(toggleDir+key, value, function(response) {
    console.log(JSON.stringify(response));
    res.json(response);
  });
};
