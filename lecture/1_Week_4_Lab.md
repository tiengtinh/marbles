
# Recommended Reading

![color](http://pbs.twimg.com/media/DS87MfMUMAAX--6.jpg)

Recommended Reading
Before you start this Lab, you may want to get familiar with the basic concepts of Hyperledger Fabric. Official Hyperledger Fabric documentation provides comprehensive source of information related to Hyperledger Fabric configuration, modes of operation and prerequisities. We recommend to read the following articles and use them as the reference when going through this tutorial.

* Hyperledger Fabric Glossary - http://hyperledger-fabric.readthedocs.io/en/latest/glossary.html
* Hyperledger Fabric Model - http://hyperledger-fabric.readthedocs.io/en/latest/fabric_model.html
* Hyperledger Fabric Prerequisities - http://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html
* Hyperledger Fabric Samples - http://hyperledger-fabric.readthedocs.io/en/latest/samples.html
* Building Your First Network - http://hyperledger-fabric.readthedocs.io/en/latest/build_network.html

Also, check our References section with various useful links related to the content of this tutorial.

# Model the Business Network

In this lab we'll be creating our business network for the Salmon scenario as described in the [week 3 homework](http://learning.coderschool.vn/courses/blockchain/unit/3#!assignment)

We'll use Hyperledger's `cryptogen` and `configtxgen` tools to create a business network consisting of:

* A single Orderer
* 3 Peers (each part of seperate organization)
  * 1 peer each for Fredrick, Alice, and Bob
  * **note:** Regulators can only read from the ledger, so no peer is needed for them.
* 3 Channels
  * 1 for price agreement between Fredrick and Alice
  * 1 for price agreement between Fredrick and Bob
  * 1 for transfer of Salmon
* Chaincode for recording Salmon transactions

At the end of this lab, you will have a running instance of Hyperledger Fabric business network, as well as chaincode.  Also, your network will be be secured by TLS.

This lab we'll use a fictional "coderschool.vn" company and its 3 organizations: Fredrick, Alice, and Bob.

We'll be using Docker containers for managing the infrastructure for this business network on our laptops.

# Generate Peer and Orderer Certificates (cryptogen)

We use the development tool named `cryptogen` to generate required certificates for the Peers and Orderer.  In production, we would use the `fabric ca` toolset.  Our network also implements TLS (transport layer security) when authenticating remote procedure calls (grpc protocal)


The `cryptogen` tool uses a `yaml` file for configuration, and generates a `crypto-config` directory with all the certificates

The `cryptogen showtemplate` command will show a template `yaml` file that you can use to define your own network.

Create the template `crypto-config.yaml` file using: 

```bash 
cryptogen showtemplate > crypto-config.yaml
````

Now edit this file to change the names of the Orgs as described above
also:
* change all the domains to `coderschool.vn`
* we'll be using the CA's for creating users and managing logins. So under each organization, have the following configuration:
```yaml
CA:
  Hostname: ca
```

* Because we're using CA's we need to set the Subject Alternative Names to 'localhost' under the `Template` parameters:
```yaml
Template:
  SANS:
    - "localhost"
```

Here is an example of the Alice organization:

```yaml

  - Name: Alice
    Domain: alice.coderschool.vn
    EnableNodeOUs: false
    CA:
      Hostname: ca
    Template:
      Count: 1
      SANS:
        - "localhost"
    Users:
      Count: 1

```

To generate the certificates into a `crypto-config` directory, run:

```bash
cryptogen generate --config=./crypto-config.yaml
```

Unfortunately, this command generates the CA key.pem files with random names (for security).  This makes it difficult to automate the setup with our docker-compose.  Lets change the random names to `key.pem` using this command:

```bash
 for file in $(find crypto-config -iname *_sk); do dir=$(dirname $file); mv ${dir}/*_sk ${dir}/key.pem; done



```

You should see the following directory structure that contains the various certificates and keys for orderer and peers:

```
ali@ali-xps:~/code/week4/lab$ ls -al crypto-config/*/*
crypto-config/ordererOrganizations/coderschool.vn:
total 28
drwxr-xr-x 7 ali ali 4096 Apr  3 13:52 .
drwxr-xr-x 3 ali ali 4096 Apr  3 13:52 ..
drwxr-xr-x 2 ali ali 4096 Apr  3 13:52 ca
drwxr-xr-x 5 ali ali 4096 Apr  3 13:52 msp
drwxr-xr-x 3 ali ali 4096 Apr  3 13:52 orderers
drwxr-xr-x 2 ali ali 4096 Apr  3 13:52 tlsca
drwxr-xr-x 3 ali ali 4096 Apr  3 13:52 users

crypto-config/peerOrganizations/alice.coderschool.vn:
total 28
drwxr-xr-x 7 ali ali 4096 Apr  3 13:52 .
drwxr-xr-x 5 ali ali 4096 Apr  3 13:52 ..
drwxr-xr-x 2 ali ali 4096 Apr  3 13:52 ca
drwxr-xr-x 5 ali ali 4096 Apr  3 13:52 msp
drwxr-xr-x 3 ali ali 4096 Apr  3 13:52 peers
drwxr-xr-x 2 ali ali 4096 Apr  3 13:52 tlsca
drwxr-xr-x 4 ali ali 4096 Apr  3 13:52 users

crypto-config/peerOrganizations/bob.coderschool.vn:
total 28
drwxr-xr-x 7 ali ali 4096 Apr  3 13:52 .
drwxr-xr-x 5 ali ali 4096 Apr  3 13:52 ..
drwxr-xr-x 2 ali ali 4096 Apr  3 13:52 ca
drwxr-xr-x 5 ali ali 4096 Apr  3 13:52 msp
drwxr-xr-x 3 ali ali 4096 Apr  3 13:52 peers
drwxr-xr-x 2 ali ali 4096 Apr  3 13:52 tlsca
drwxr-xr-x 4 ali ali 4096 Apr  3 13:52 users

crypto-config/peerOrganizations/fredrick.coderschool.vn:
total 28
drwxr-xr-x 7 ali ali 4096 Apr  3 13:52 .
drwxr-xr-x 5 ali ali 4096 Apr  3 13:52 ..
drwxr-xr-x 2 ali ali 4096 Apr  3 13:52 ca
drwxr-xr-x 5 ali ali 4096 Apr  3 13:52 msp
drwxr-xr-x 3 ali ali 4096 Apr  3 13:52 peers
drwxr-xr-x 2 ali ali 4096 Apr  3 13:52 tlsca
drwxr-xr-x 4 ali ali 4096 Apr  3 13:52 users
ali@ali-xps:~/code/week4/lab$ 
```

> **Note** The crypto directories become the local MSP for each of the peers and orderers.  This will become more clear when we create the configuration and you docker-compose to bring up the different components.

# Understanding channel configuration

A Hyperledger Fabric network can have multiple ledgers.  Each ledger is called a *channel* and has its own set of *peers* that can propose and receive transactions. 

Channels can be created and reconfigured dynamically, and peers can be added on the fly.

Channels are created using *channel config update* transactions, which is a special type of transaction (called `configtx`) that affects the ledger's *metadata* rather than the ledger's world-state data.  Normal transactions are stored as incremental updates (*diffs*), but *configtx* are stored on the ledger in special blocks that contain the entire configuration.  Peers and clients only need the latest confitx block to knoow the channels configuration.

At this time, creating the configtx is a manual process involving the `configtxgen` tool, but Hyperledger's architecture does not preclude future automation of the process.

# Create Genesis Block and channel.tx (configtxgen)

Next we configure the `configtx.yaml` file, which is the input to the `configtxgen` tool and generates a few important files 

* `channel.tx` (channel creation transaction).  This transaction lets us create the Hyperledger Fabric channel.  The channel is the location where the ledger exists and the mechanism that lets peers join the business network.
* `Genisis Block` the first block in our blockchain, used to bootstrap the ordering service and hold channel configuration
* `Anchor peers transaction` specifies each Org's anchor peer on this channel

## Customizing the `configtx.yaml`

Copy the existing `configtx.yaml` from [fabric-samples/balance-transfer/artifacts/channel/configtx.yaml](https://github.com/hyperledger/fabric-samples/blob/release-1.1/balance-transfer/artifacts/channel/configtx.yaml).  The sections are:

* *Profile:*  described the organizational structure of the network
* *Organizations:* details regarding individual organizations
* *Orderer:* details regarding the Orderer parameters
* *Application:* defaults for applications - no needed 


Now customize it and make necessary modifications:

* Change the profile names to ThreeOrgsOrdererGenesis and ThreeOrgsChannel, and add a 3rd organization 
* The organizations in the *Profiles* section are named exactly as we named them in the `crypto-config.yaml`
* The *ID* and *Name* fields correspong to the MSP for the peers
* The *MSPDir* to point to the output directories in `crypto-config` dir

> The `configtx.yaml` file describes organizations and not necessarily the peers within the organization.  Peers will be specified in the `docker-compose.yaml` file



## Executing the configtxgen tool

### Creating the orderer genisis block

To create the genisis block, run:

```bash
configtxgen -profile ThreeOrgsOrdererGenesis -outputBlock genesis.block
```

You should see:

```bash
ali@ali-xps:~/code/week4/lab$ ./bin/configtxgen -profile ThreeOrgsOrdererGenesis -outputBlock genesis.block
2018-04-03 14:43:50.883 +07 [common/tools/configtxgen] main -> INFO 001 Loading configuration
2018-04-03 14:43:50.896 +07 [common/tools/configtxgen] doOutputBlock -> INFO 002 Generating genesis block
2018-04-03 14:43:50.896 +07 [common/tools/configtxgen] doOutputBlock -> INFO 003 Writing genesis block


```

### Create the channel configuration transaction

Create the channel configuration transcation like so (you can name the channel anything you like):

```bash
configtxgen -profile ThreeOrgsChannel -outputCreateChannelTx mychannel.tx -channelID mychannel # require configtx.yaml
```

You should see:

```bash
2018-04-03 15:33:14.192 +07 [common/tools/configtxgen] main -> INFO 001 Loading configuration
2018-04-03 15:33:14.197 +07 [common/tools/configtxgen] doOutputChannelCreateTx -> INFO 002 Generating new channel configtx
2018-04-03 15:33:14.214 +07 [common/tools/configtxgen] doOutputChannelCreateTx -> INFO 003 Writing new channel tx
```

Create 3 channels transactions for channels named, *fredrick-alice*, *fredrick-bob*, and *transfers*

### Create the definition of anchor peers for the Orgs.

Finally, we need to define anchor peers for each organization.  Since all organizations can see the *transfers*, lets add their peers.

> The `asOrg` paramter refers to the MSP ID definitions in the configtx.yaml

```bash
configtxgen -profile ThreeOrgsChannel -outputAnchorPeersUpdate FredrickMSPanchors.tx -channelID transfers -asOrg FredricMSP
```

> do the same for Bob and Alice organizations

You should now see the following artifacts:
* FredrickMSPanchors.tx
* AliceMSPanchors.tx
* BobMSPanchors.tx
* fredrick_alice.tx
* fredrick_bob.tx
* transfers.tx
* genesis.block

# Start the Hyperledger Fabric network

We'll use `docker-compose` to start our network of peers and orderers and certificate authorities.

The `docker-compose` command uses a yaml file to describe various aspects of containers and their network connections.

## Customizing the `docker-compose.yaml` 

Lets start with 
[base.yaml](https://github.com/hyperledger/fabric-samples/blob/release-1.1/balance-transfer/artifacts/base.yaml) 
and 
[docker-compose.yaml](https://github.com/hyperledger/fabric-samples/blob/release-1.1/balance-transfer/artifacts/docker-compose.yaml) 
files from the `fabric-samples/balance-transfer` repo.

You'll have to make a bunch of changes (find-replace is your friend)
* change the name of the services to match names generated from `cryptogen`
* change the volume paths to match the location of the `crypto-config` directory
* change the environment variables to have the correct domain names for peers and orderers
* and more...
* set the tls and ca keyfiles to our non-random file names:
  * FABRIC_CA_SERVER_TLS_KEYFILE=/etc/hyperledger/fabric-ca-server-config/key.pem
  * FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/key.pem

## Bringing up the network

When you're happy with your `docker-compose.yaml` file, use the following command to bring up the network:

```bash
docker-compose -f docker-compose.yaml up -d
```

You can see the running containers with this command:
```
ali@ali-xps:~/code/week4/lab$ docker ps -a --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}'
NAMES                           IMAGE                                                  STATUS
peer0.bob.coderschool.vn        hyperledger/fabric-peer                                Up 4 minutes
peer0.alice.coderschool.vn      hyperledger/fabric-peer                                Up 4 minutes
peer0.fredrick.coderschool.vn   hyperledger/fabric-peer                                Up 5 minutes
ca.fredrick.coderschool.vn      hyperledger/fabric-ca                                  Up 4 minutes
orderer.coderschool.vn          hyperledger/fabric-orderer                             Up 5 minutes
ca.alice.coderschool.vn         hyperledger/fabric-ca                                  Up 5 minutes
ca.bob.coderschool.vn           hyperledger/fabric-ca                                  Up 5 minutes
```

You can see the container logs with the `docker-compose logs` command

# Wow! Many Funs!

Alright, you've got the Hyperledger fabric network up and running.  Now you need to create the channels, add the peers to the channels, and create some chaincode!

![blockchain](https://banknxt.com/wp-content/uploads/2016/06/techiedilbert2.jpg)