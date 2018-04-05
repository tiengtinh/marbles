
# Create configuration files for network

We can use the NodeJS Fabric Client SDK to interact with the fabric `peer` and fabric `ca` services

Before we can use the SDK, we'll want to set up some configuration info, such as location of user credentials for each organization etc

Its good practice to keep configuration data in files instead of hardcoding it in the code. We'll create a config file for each organization:

### Organization specfic coniguration

* Create a `config` directory `mkdir config`
* Copy the following into  `config/fredrick.yaml`

```yaml
---
name: "fredrick-salmon"

#
# Any properties with an "x-" prefix will be treated as application-specific, exactly like how naming
# in HTTP headers or swagger properties work. The SDK will simply ignore these fields and leave
# them for the applications to process. This is a mechanism for different components of an application
# to exchange information that are not part of the standard schema described below. In particular,
# the "x-type" property with the "hlfv1" value example below is used by Hyperledger Composer to
# determine the type of Fabric networks (v0.6 vs. v1.0) it needs to work with.
#
x-type: "hlfv1"

#
# Describe what the target network is/does.
#
description: "Salmon Network - client definition for Fredrick"

#
# Schema version of the content. Used by the SDK to apply the corresponding parsing rules.
#
version: "1.0"

#
# The client section is SDK-specific. The sample below is for the node.js SDK
#
client:
  # Which organization does this application instance belong to? The value must be the name of an org
  # defined under "organizations"
  organization: Fredrick

  # Some SDKs support pluggable KV stores, the properties under "credentialStore"
  # are implementation specific
  credentialStore:
    # [Optional]. Specific to FileKeyValueStore.js or similar implementations in other SDKs. Can be others
    # if using an alternative impl. For instance, CouchDBKeyValueStore.js would require an object
    # here for properties like url, db name, etc.
    path: "./fabric-client-kv-fredrick"

    # [Optional]. Specific to the CryptoSuite implementation. Software-based implementations like
    # CryptoSuite_ECDSA_AES.js in node SDK requires a key store. PKCS#11 based implementations does
    # not.
    cryptoStore:
      # Specific to the underlying KeyValueStore that backs the crypto key store.
      path: "/tmp/fabric-client-kv-fredrick"

    # [Optional]. Specific to Composer environment
    wallet: wallet-name
```
* Do the same to create a `alice.yaml` and `bob.yaml`. Change the `name`, `organization`, and `path` parameters appropriately

## Network configuration

Create a `config/network-config.yaml` file with the following yaml, and fill in the **TODO:**:

```yaml
---
#
# The network connection profile provides client applications the information about the target
# blockchain network that are necessary for the applications to interact with it. These are all
# knowledge that must be acquired from out-of-band sources. This file provides such a source.
#
name: "salmon-fabric"

#
# Any properties with an "x-" prefix will be treated as application-specific, exactly like how naming
# in HTTP headers or swagger properties work. The SDK will simply ignore these fields and leave
# them for the applications to process. This is a mechanism for different components of an application
# to exchange information that are not part of the standard schema described below. In particular,
# the "x-type" property with the "hlfv1" value example below is used by Hyperledger Composer to
# determine the type of Fabric networks (v0.6 vs. v1.0) it needs to work with.
#
x-type: "hlfv1"

#
# Describe what the target network is/does.
#
description: "Salmon Network"

#
# Schema version of the content. Used by the SDK to apply the corresponding parsing rules.
#
version: "1.0"

#
# The client section will be added on a per org basis see fredrick.yaml and alice.yaml and bob.yaml
#
#client:


# [Optional]. But most apps would have this section so that channel objects can be constructed
# based on the content below. If an app is creating channels, then it likely will not need this
# section.
#
channels:
  # name of the channel
  fredrick-alice:
    # Required. list of orderers designated by the application to use for transactions on this
    # channel. This list can be a result of access control ("org1" can only access "ordererA"), or
    # operational decisions to share loads from applications among the orderers.  The values must
    # be "names" of orgs defined under "organizations/peers"
    orderers:
      - orderer.coderschool.vn

    # Required. list of peers from participating orgs
    peers:
      peer0.fredrick.coderschool.vn:
        # [Optional]. will this peer be sent transaction proposals for endorsement? The peer must
        # have the chaincode installed. The app can also use this property to decide which peers
        # to send the chaincode install request. Default: true
        endorsingPeer: true

        # [Optional]. will this peer be sent query proposals? The peer must have the chaincode
        # installed. The app can also use this property to decide which peers to send the
        # chaincode install request. Default: true
        chaincodeQuery: true

        # [Optional]. will this peer be sent query proposals that do not require chaincodes, like
        # queryBlock(), queryTransaction(), etc. Default: true
        ledgerQuery: true

        # [Optional]. will this peer be the target of the SDK's listener registration? All peers can
        # produce events but the app typically only needs to connect to one to listen to events.
        # Default: true
        eventSource: true

      #------------------------
      # TODO add Alice's peer to this channel
      #------------------------

   
    # [Optional]. what chaincodes are expected to exist on this channel? The application can use
    # this information to validate that the target peers are in the expected state by comparing
    # this list with the query results of getInstalledChaincodes() and getInstantiatedChaincodes()
    chaincodes:
      # the format follows the "cannonical name" of chaincodes by fabric code
      - salmon_price_cc:v0

  #---------------------
  # TODO: Add the fredrick_bob and transfers channel
  #--------------------
 
 

#
# list of participating organizations in this network
#
organizations:

  # the profile will contain public information about organizations other than the one it belongs to.
  # These are necessary information to make transaction lifecycles work, including MSP IDs and
  # peers with a public URL to send transaction proposals. The file will not contain private
  # information reserved for members of the organization, such as admin key and certificate,
  # fabric-ca registrar enroll ID and secret, etc.
  Fredrick:
    mspid: FredrickMSP

    peers:
      - peer0.fredrick.coderschool.vn

    # [Optional]. Certificate Authorities issue certificates for identification purposes in a Fabric based
    # network. Typically certificates provisioning is done in a separate process outside of the
    # runtime network. Fabric-CA is a special certificate authority that provides a REST APIs for
    # dynamic certificate management (enroll, revoke, re-enroll). The following section is only for
    # Fabric-CA servers.
    certificateAuthorities:
      - ca-fredrick

    # [Optional]. If the application is going to make requests that are reserved to organization
    # administrators, including creating/updating channels, installing/instantiating chaincodes, it
    # must have access to the admin identity represented by the private key and signing certificate.
    # Both properties can be the PEM string or local path to the PEM file. Note that this is mainly for
    # convenience in development mode, production systems should not expose sensitive information
    # this way. The SDK should allow applications to set the org admin identity via APIs, and only use
    # this route as an alternative when it exists.
    adminPrivateKey:
      path: crypto-config/peerOrganizations/fredrick.coderschool.vn/users/Admin@fredrick.coderschool.vn/msp/keystore/key.pem
    signedCert:
      path: crypto-config/peerOrganizations/fredrick.coderschool.vn/users/Admin@fredrick.coderschool.vn/msp/signcerts/Admin@fredrick.coderschool.vn-cert.pem

  #-------------
  # TODO: Fill in the Alice and Bob organizations
  #--------------

#
# List of orderers to send transaction and channel create/update requests to. For the time
# being only one orderer is needed. If more than one is defined, which one get used by the
# SDK is implementation specific. Consult each SDK's documentation for its handling of orderers.
#
orderers:
  orderer.coderschool.vn:
    url: grpcs://localhost:7050

    # these are standard properties defined by the gRPC library
    # they will be passed in as-is to gRPC client constructor
    grpcOptions:
      ssl-target-name-override: orderer.coderschool.vn
      grpc-max-send-message-length: 15

    tlsCACerts:
      path: crypto-config/ordererOrganizations/coderschool.vn/orderers/orderer.coderschool.vn/tls/ca.crt

#
# List of peers to send various requests to, including endorsement, query
# and event listener registration.
#
peers:
  peer0.fredrick.coderschool.vn:
    # this URL is used to send endorsement and query requests
    url: grpcs://localhost:7051

    # this URL is used to connect the EventHub and registering event listeners
    eventUrl: grpcs://localhost:7053

    grpcOptions:
      ssl-target-name-override: peer0.fredrick.coderschool.vn
    tlsCACerts:
      path: crypto-config/peerOrganizations/fredrick.coderschool.vn/peers/peer0.fredrick.coderschool.vn/tls/ca.crt

  #--------------------------------
  # TODO: fill in the other peers using info from your docker-compose.yaml and crypto-config.yaml
  #--------------------------------
 
#
# Fabric-CA is a special kind of Certificate Authority provided by Hyperledger Fabric which allows
# certificate management to be done via REST APIs. Application may choose to use a standard
# Certificate Authority instead of Fabric-CA, in which case this section would not be specified.
#
certificateAuthorities:
  ca-fredrick:
    url: https://localhost:7054
    # the properties specified under this object are passed to the 'http' client verbatim when
    # making the request to the Fabric-CA server
    httpOptions:
      verify: false
    tlsCACerts:
      path: crypto-config/peerOrganizations/fredrick.coderschool.vn/ca/ca.fredrick.coderschool.vn-cert.pem

    # Fabric-CA supports dynamic user enrollment via REST APIs. A "root" user, a.k.a registrar, is
    # needed to enroll and invoke new users.
    registrar:
      - enrollId: admin
        enrollSecret: adminpw
    # [Optional] The optional name of the CA.
    caName: ca-fredrick

  #----------------
  # TODO: Fill in the other CAs
  #----------------

```

# NodeJS SDK Dependancies

Create the `package.json` file for the NodeJS dependancies with the follow json:.

```json
{
  "name": "salmon-fabric",
  "version": "1.0.0",
  "description": "A salmon scenario using node.js SDK APIs",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "keywords": [
    "fabric-client sample app",
    "v1.0 fabric nodesdk sample"
  ],
  "engines": {
    "node": ">=8.9.4 <9.0",
    "npm": ">=5.6.0 <6.0"
  },
  "license": "Apache-2.0",
  "dependencies": {
    "body-parser": "^1.17.1",
    "cookie-parser": "^1.4.3",
    "cors": "^2.8.3",
    "express": "^4.15.2",
    "express-bearer-token": "^2.1.0",
    "express-jwt": "^5.1.0",
    "express-session": "^1.15.2",
    "fabric-ca-client": "~1.1.0",
    "fabric-client": "~1.1.0",
    "fs-extra": "^2.0.0",
    "jsonwebtoken": "^7.3.0",
    "log4js": "^0.6.38"
  }
}

```

Then run `npm install -g` to install the dependancies

# Now start the SDK and load configuration data

```javascript
'use strict'
var util = require('util');
var path = require('path');
var hfc = require('fabric-client');

// indicate to the application where the setup file is located so it able
// to have the hfc load it to initalize the fabric client instance
hfc.setConfigSetting('network-connection-profile-path',path.join(__dirname, 'config', 'network-config.yaml'));
hfc.setConfigSetting('fredrick-connection-profile-path',path.join(__dirname, 'config', 'fredrick.yaml'));
hfc.setConfigSetting('alice-connection-profile-path',path.join(__dirname, 'config', 'alice.yaml'));
hfc.setConfigSetting('bob-connection-profile-path',path.join(__dirname, 'config', 'bob.yaml'));
````

###  More verbose debugging

```javascript
var log4js = require('log4js');
var logger = log4js.getLogger('Helper');
logger.setLevel('DEBUG');
hfc.setLogger(logger);
````

# Registering Users with the CA

```javascript
async function getClientForOrg (userorg, username) {
	logger.debug('getClientForOrg - ****** START %s %s', userorg, username)
	// get a fabric client loaded with a connection profile for this org
	let config = '-connection-profile-path';

	// build a client context and load it with a connection profile
	// lets only load the network settings and save the client for later
	let client = hfc.loadFromConfig(hfc.getConfigSetting('network'+config));

	// This will load a connection profile over the top of the current one one
	// since the first one did not have a client section and the following one does
	// nothing will actually be replaced.
	// This will also set an admin identity because the organization defined in the
	// client section has one defined
	client.loadFromConfig(hfc.getConfigSetting(userorg+config));

	// this will create both the state store and the crypto store based
	// on the settings in the client section of the connection profile
	await client.initCredentialStores();

	// The getUserContext call tries to get the user from persistence.
	// If the user has been saved to persistence then that means the user has
	// been registered and enrolled. If the user is found in persistence
	// the call will then assign the user to the client object.
	if(username) {
		let user = await client.getUserContext(username, true);
		if(!user) {
			throw new Error(util.format('User was not found :', username));
		} else {
			logger.debug('User %s was found to be registered and enrolled', username);
		}
	}
	logger.debug('getClientForOrg - ****** END %s %s \n\n', userorg, username)

	return client;
}

var getRegisteredUser = async function(username, userOrg, isJson) {
	try {
		var client = await getClientForOrg(userOrg);
		logger.debug('Successfully initialized the credential stores');
			// client can now act as an agent for organization Org1
			// first check to see if the user is already enrolled
		var user = await client.getUserContext(username, true);
		if (user && user.isEnrolled()) {
			logger.info('Successfully loaded member from persistence');
		} else {
			// user was not enrolled, so we will need an admin user object to register
			logger.info('User %s was not enrolled, so we will need an admin user object to register',username);
            // the username and password of the fabric-ca-server
			let adminUserObj = await client.setUserContext({username: 'admin', password: 'adminpw'});
			let caClient = client.getCertificateAuthority();
			let secret = await caClient.register({
				enrollmentID: username,
				affiliation: userOrg + '.department1'
			}, adminUserObj);
			logger.debug('Successfully got the secret for user %s',username);
			user = await client.setUserContext({username:username, password:secret});
			logger.debug('Successfully enrolled username %s  and setUserContext on the client object', username);
		}
		if(user && user.isEnrolled) {
			if (isJson && isJson === true) {
				var response = {
					success: true,
					secret: user._enrollmentSecret,
					message: username + ' enrolled Successfully',
				};
				return response;
			}
		} else {
			throw new Error('User was not enrolled ');
		}
	} catch(error) {
		logger.error('Failed to get registered user: %s with error: %s', username, error.toString());
		return 'failed '+error.toString();
	}

};
```

```javascript
res = getRegisteredUser('user1','alice',true).then(function(res) {return res})
```

# Creating the channels

```javascript
//Attempt to send a request to the orderer with the sendTransaction method
var createChannel = async function(channelName, channelConfigPath, username, orgName) {
	logger.debug('\n====== Creating Channel \'' + channelName + '\' ======\n');
	try {
		// first setup the client for this org
		var client = await getClientForOrg(orgName);
		logger.debug('Successfully got the fabric client for the organization "%s"', orgName);

		// read in the envelope for the channel config raw bytes
		var envelope = fs.readFileSync(path.join(__dirname, channelConfigPath));
		// extract the channel config bytes from the envelope to be signed
		var channelConfig = client.extractChannelConfig(envelope);

		//Acting as a client in the given organization provided with "orgName" param
		// sign the channel config bytes as "endorsement", this is required by
		// the orderer's channel creation policy
		// this will use the admin identity assigned to the client when the connection profile was loaded
		let signature = client.signChannelConfig(channelConfig);

		let request = {
			config: channelConfig,
			signatures: [signature],
			name: channelName,
			txId: client.newTransactionID(true) // get an admin based transactionID
		};

		// send to orderer
		var response = await client.createChannel(request)
		logger.debug(' response ::%j', response);
		if (response && response.status === 'SUCCESS') {
			logger.debug('Successfully created the channel.');
			let response = {
				success: true,
				message: 'Channel \'' + channelName + '\' created Successfully'
			};
			return response;
		} else {
			logger.error('\n!!!!!!!!! Failed to create the channel \'' + channelName +
				'\' !!!!!!!!!\n\n');
			throw new Error('Failed to create the channel \'' + channelName + '\'');
		}
	} catch (err) {
		logger.error('Failed to initialize the channel: ' + err.stack ? err.stack :	err);
		throw new Error('Failed to initialize the channel: ' + err.toString());
	}
};
```

```javascript
createChannel('transfers','./transfers.tx','f1','fredrick').then(function(res){return res})
```

# Joining Channel

```javascript
/*
 * Have an organization join a channel
 */
var joinChannel = async function(channel_name, peers, username, org_name) {
	logger.debug('\n\n============ Join Channel start ============\n')
	var error_message = null;
	var all_eventhubs = [];
	try {
		logger.info('Calling peers in organization "%s" to join the channel', org_name);

		// first setup the client for this org
		var client = await getClientForOrg(org_name, username);
		logger.debug('Successfully got the fabric client for the organization "%s"', org_name);
		var channel = client.getChannel(channel_name);
		if(!channel) {
			let message = util.format('Channel %s was not defined in the connection profile', channel_name);
			logger.error(message);
			throw new Error(message);
		}

		// next step is to get the genesis_block from the orderer,
		// the starting point for the channel that we want to join
		let request = {
			txId : 	client.newTransactionID(true) //get an admin based transactionID
		};
		let genesis_block = await channel.getGenesisBlock(request);

		// tell each peer to join and wait for the event hub of each peer to tell us
		// that the channel has been created on each peer
		var promises = [];
		var block_registration_numbers = [];
		let event_hubs = client.getEventHubsForOrg(org_name);
		event_hubs.forEach((eh) => {
			let configBlockPromise = new Promise((resolve, reject) => {
				let event_timeout = setTimeout(() => {
					let message = 'REQUEST_TIMEOUT:' + eh._ep._endpoint.addr;
					logger.error(message);
					eh.disconnect();
					reject(new Error(message));
				}, 60000);
				let block_registration_number = eh.registerBlockEvent((block) => {
					clearTimeout(event_timeout);
					// a peer may have more than one channel so
					// we must check that this block came from the channel we
					// asked the peer to join
					if (block.data.data.length === 1) {
						// Config block must only contain one transaction
						var channel_header = block.data.data[0].payload.header.channel_header;
						if (channel_header.channel_id === channel_name) {
							let message = util.format('EventHub % has reported a block update for channel %s',eh._ep._endpoint.addr,channel_name);
							logger.info(message)
							resolve(message);
						} else {
							let message = util.format('Unknown channel block event received from %s',eh._ep._endpoint.addr);
							logger.error(message);
							reject(new Error(message));
						}
					}
				}, (err) => {
					clearTimeout(event_timeout);
					let message = 'Problem setting up the event hub :'+ err.toString();
					logger.error(message);
					reject(new Error(message));
				});
				// save the registration handle so able to deregister
				block_registration_numbers.push(block_registration_number);
				all_eventhubs.push(eh); //save for later so that we can shut it down
			});
			promises.push(configBlockPromise);
			eh.connect(); //this opens the event stream that must be shutdown at some point with a disconnect()
		});

		let join_request = {
			targets: peers, //using the peer names which only is allowed when a connection profile is loaded
			txId: client.newTransactionID(true), //get an admin based transactionID
			block: genesis_block
		};
		let join_promise = channel.joinChannel(join_request);
		promises.push(join_promise);
		let results = await Promise.all(promises);
		logger.debug(util.format('Join Channel R E S P O N S E : %j', results));

		// lets check the results of sending to the peers which is
		// last in the results array
		let peers_results = results.pop();
		// then each peer results
		for(let i in peers_results) {
			let peer_result = peers_results[i];
			if(peer_result.response && peer_result.response.status == 200) {
				logger.info('Successfully joined peer to the channel %s',channel_name);
			} else {
				let message = util.format('Failed to joined peer to the channel %s',channel_name);
				error_message = message;
				logger.error(message);
			}
		}
		// now see what each of the event hubs reported
		for(let i in results) {
			let event_hub_result = results[i];
			let event_hub = event_hubs[i];
			let block_registration_number = block_registration_numbers[i];
			logger.debug('Event results for event hub :%s',event_hub._ep._endpoint.addr);
			if(typeof event_hub_result === 'string') {
				logger.debug(event_hub_result);
			} else {
				if(!error_message) error_message = event_hub_result.toString();
				logger.debug(event_hub_result.toString());
			}
			event_hub.unregisterBlockEvent(block_registration_number);
		}
	} catch(error) {
		logger.error('Failed to join channel due to error: ' + error.stack ? error.stack : error);
		error_message = error.toString();
	}

	// need to shutdown open event streams
	all_eventhubs.forEach((eh) => {
		eh.disconnect();
	});

	if (!error_message) {
		let message = util.format(
			'Successfully joined peers in organization %s to the channel:%s',
			org_name, channel_name);
		logger.info(message);
		// build a response to send back to the REST caller
		let response = {
			success: true,
			message: message
		};
		return response;
	} else {
		let message = util.format('Failed to join all peers to channel. cause:%s',error_message);
		logger.error(message);
		throw new Error(message);
	}
};
```

```javascript
joinChannel("fredrick-bob",["peer0.fredrick.coderschool.vn"],"admin","fredrick")
```