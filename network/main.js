'use strict'
var util = require('util');
var path = require('path');
var hfc = require('fabric-client');

// More verbose debugging
var log4js = require('log4js');
var logger = log4js.getLogger('Helper');
logger.setLevel('DEBUG');
hfc.setLogger(logger);

// indicate to the application where the setup file is located so it able
// to have the hfc load it to initalize the fabric client instance
hfc.setConfigSetting('network-connection-profile-path',path.join(__dirname, 'config', 'network-config.yaml'));
hfc.setConfigSetting('fredrick-connection-profile-path',path.join(__dirname, 'config', 'fredrick.yaml'));
hfc.setConfigSetting('alice-connection-profile-path',path.join(__dirname, 'config', 'alice.yaml'));
hfc.setConfigSetting('bob-connection-profile-path',path.join(__dirname, 'config', 'bob.yaml'));

const getRegisteredUser = require('./getRegisteredUser')
const getClientForOrg = require('./getClientForOrg')
const createChannel = require('./createChannel')
const joinChannel = require('./joinChannel')

async function start() {
  try {
    // await getClientForOrg('bob')

    // const aliceUser1 = await getRegisteredUser('user17','alice',true)
    // console.log('aliceUser1: ', aliceUser1)
    
    // const createChannelResult = await createChannel('transfers','./channel/transfers.tx','f1','fredrick')
    // logger.info('createChannelResult ', createChannelResult)

    const joinChannelResult = await joinChannel("fredrick-bob",["peer0.fredrick.coderschool.vn"],"admin","fredrick")
    logger.info('joinChannelResult ', joinChannelResult)
  } catch (err) {
    console.error(err)
  }
}

start()