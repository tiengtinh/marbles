# Week 3 Project : Salmon Supply Chain

In this scenario we will model a provenance use case: tracking responsibly sourced fish from the fisherman to the restaurant.

This business network is composed of:

- Fredrick - Fisherman who catches sustainable and legal salmon and sells to restaurant owners.
- Regulator - Organization that verifies that the salmon was caught legally and sustainably.
- Alice - Restaurant owner who serves the salmon to hungry customers.
- Bob - Another restaurant owner who also buys salmon from Fredrick.

Using **Hyperledger Fabric** we will demonstrate how salmon fishing can be improved, starting from the source (fisherman Fredrick) to the table (chef Alice) so that customers can know where their salmon was caught!

## The Salmon Data

After each catch of salmon, Fredrick records the salmon information to the ledger. Only Fredrick (and other fishermen) can add or update the salmon information on the ledger. The regulator and restaurant owners can only read from the ledger.

**You will** create the Golang struct to hold the Salmon data that will be written to the ledger.

The fields should be:

- vessel (string)
- datetime (string)
- location (string)
- holder (string)

## Selling Salmon

Fredrick sells his salmon all across the world to chefs like Bob for \$100 per kilo. However, he has a special deal with Alice to sell for \$50 dolars per kilo. On a public blockchain, everyone would know that Alice is getting a better deal. Obiously this is not advantagous for Fredrick's business if the entire world knows how much each buyer is paying.

So Fredrick wants everyone to know the details of the salmon, but the sale price should be known only to the buyer and seller.

**You will** create the channels needed for this scenario.

## Regulating membership

The role of the Regulators is to confirm and verify the details of the salmon that the fishermen catch. In this case the regulator will approve fishermen by adding them to the network. For example, if Fredrick is found to be catching salmon illegally, he can have his membership revoked without compromising the entire network. This feature is critical in enterprise applications because business relationships change over time.

**You will** add the members to the business network.

# Chaincode and Channels!

This scenario has 2 seperate chaincodes:

1. Setting the price agreement between fishermen (Fredrick) and restauranteur (Alice/Bob).
2. Transferring the salmon from fishermen to restauranteur.

We'll use 3 channels to provide privacy and confidentiality of transactions:

1. Price agreement between Fredrick and Alice.
2. Price agreement between Fredrick and Bob.
3. Transfer of salmon.

**You will** write the chaincode to implement these transactions.

# Your Assignment!

## Create the network

Use the [instructions to download](https://gist.github.com/ali1rathore/c6a8323906c7db969eb4ea10b7249ef9) the Fabric binaries and docker images and start a local network.

## Write and install the the chaincode on all peers

Write and install golang chaincode for these 3 transactions:

- `recordSalmon` -- adds salmon data to ledger, called by fisherman
  - this takes 5 arguments:
    - 0 - the id (key) of the salmon
    - 1 to 4 - (the 4 attributes of the salmon data)
- `changeSalmonHolder` -- change the owner of the salmon, called by restauranteur when they confirm receiving the salmon.
  - takes 2 arguments:
    - 0 - the id of the salmon
    - 1 - the name of the new holder
- `querySalmon` -- reads salmon data from ledger, called by restauranteur and regulator to view state of particular salmon
  - takes 1 argument - the id (key) of the salmon
  - returns JSON of the salmon data
- `queryAllSalmon` -- used by regulator to check sustainability of supply chain
  - takes no arguments, returns list of JSON of all salmon data

## Initialize the ledger

Add an additional chaincode method to add test data to the ledger:

- `initLedger` - spawns Salmon data into the ledger.

## Create a HTTP API for clients to interact with network

Use the NodeJS SDK to build a entrypoint for new clients to interact with the ledger and transactions.

For example, you will be able to call the `changeSalmonHolder` like this:

```
 // changeSalmonHolder - requires 2 arguments
var request = {
    chaincodeId:’salmon-app’,
    fcn: 'changeSalmonHolder', 
    args: ['1', 'Alice'],
    chainId: 'alice-channel',
    txId: tx_id
};
return channel.sendTransactionProposal(request);
```

### Examples and Resources

[Fabric NodeJS SDK Documentation](https://github.com/hyperledger/fabric-sdk-node)

[Example of NodeJS SDK Usage](https://github.com/hyperledger/fabric-samples/tree/release-1.1/balance-transfer)

# Bonus!

Create a set of UI web pages for this scenario that will use your HTTP API.

The pages should allow:

- fisherman to add / modify salmon data
- the restauranteur and regulator to read salmon data
- the restauranteur to update the holder

------

# Getting Started

## Download the fabric-samples repo

Use the `byfn.sh` script to start your local fabric network as described [here](https://gist.github.com/ali1rathore/c6a8323906c7db969eb4ea10b7249ef9)

## Create the chaincode file

The `fabric-samples/first-network/docker-compose-cli.yaml` defines a volume mount from your laptopt's `fabric-samples/chaincode` directory to the `cli` container's `/opt/gopath/src/github.com/chaincode` directory.

So (for example) put your code in `fabric-samples/chaincode/week3/marbles.go`.

When you attach to the `cli` container, you should see your code in `/opt/gopath/src/github.com/chaincode/week3/marbles.go`

## Connect to the **cli** Container

to run the `peer chaincode` commands, connect to the `cli` container:

```
docker attach cli
```

hit `Enter` a few times so you can see the command prompt. it should look like this:

```
root@05cc11f09432:/opt/gopath/src/github.com/hyperledger/fabric/peer# 
```

You can un-attach from this container by doing holding `ctrl` and pressing `pq`

## Installing the chaincode

Here is an example command for installing chaincode, which I've named `mymarbles`

```
peer chaincode install -n mymarbles -v 1.0 -p github.com/chaincode/week3
```

## Instantating the chaincode

We can instantiate the chaincode like this. You'll have to adjust the `Args` parameter based on the arguments for your chaincode's `Init` method

```
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

peer chaincode instantiate --tls true --cafile $ORDERER_CA -o orderer.example.com:7050 -C mychannel -n mymarbles -v 1.0 -c '{"Args":[]}'
```

If your instantiation was successful, you should see a new docker container name `dev-peer0.org1.example.com-mymarbles-1.0`. Use `docker ps -a` to see all containers

## Invoking the chaincode

Invocation is similar to instantiation

```
peer chaincode invoke --tls true --cafile $ORDERER_CA -o orderer.example.com:7050  -C mychannel -n mymarbles -c '{"Args":["readMarble","marble1"]}'
```

------

# Deeper-Dive into Chaincode

In Hyperledger Fabric, chaincode is the 'smart contract' that runs on the peers and creates transactions. More broadly, it enables users to create transactions in the Hyperledger Fabric network's shared ledger and update the world state of the assets.

Chaincode is programmable code, written in Go, and instantiated on a channel. Developers use chaincode to develop business contracts, asset definitions, and collectively-managed decentralized applications. The chaincode manages the ledger state through transactions invoked by applications. Assets are created and updated by a specific chaincode, and cannot be accessed by another chaincode.

Applications interact with the blockchain ledger through the chaincode. Therefore, the chaincode needs to be installed on every peer that will endorse a transaction and instantiated on the channel.

There are two ways to develop smart contracts with Hyperledger Fabric:

Code individual contracts into standalone instances of chaincode (More efficient way) Use chaincode to create decentralized applications that manage the lifecycle of one or multiple types of business contracts, and let the end users instantiate instances of contracts within these applications.

## Chaincode Key API

An important interface that you can use when writing your chaincode is defined by Hyperledger Fabric - ChaincodeStub and ChaincodeStubInterface. The ChaincodeStub provides functions that allow you to interact with the underlying ledger to query, update, and delete assets. The key APIs for chaincode include:

- func (stub *ChaincodeStub) GetState(key string) ([]byte, error)

  Returns the value of the specified key from the ledger. Note that GetState doesn't read data from the Write set, which has not been committed to the ledger. In other words, GetState doesn't consider data modified by PutState that has not been committed. If the key does not exist in the state database, (nil, nil) is returned.

- func (stub *ChaincodeStub) PutState(key string, value []byte) error

  Puts the specified key and value into the transaction's Write set as a data-write proposal. PutState doesn't affect the ledger until the transaction is validated and successfully committed.

- func (stub *ChaincodeStub) DelState(key string) error

  Records the specified key to be deleted in the Write set of the transaction proposal. The key and its value will be deleted from the ledger when the transaction is validated and successfully committed.

## Overview of a Chaincode Program

When creating a chaincode, there are two methods that you will need to implement:

- Init

  Called when a chaincode receives an instantiate or upgrade transaction. This is where you will initialize any application state.

- Invoke

  Called when the invoke transaction is received to process any transaction proposals.

As a developer, you must create both an Init and an Invoke method within your chaincode. The chaincode must be installed using the peer chaincode install command, and instantiated using the peer chaincode instantiate command before the chaincode can be invoked. Then, transactions can be created using the peer chaincode invoke or peer chaincode query commands.

### Sample Chaincode Decomposed - Dependencies

Let’s now walk through a sample chaincode written in Go, piece by piece:

```
package main

import (

    "fmt"

    "github.com/hyperledger/fabric/core/chaincode/shim"

    "github.com/hyperledger/fabric/protos/peer"

)
```

The import statement lists a few dependencies that you will need for your chaincode to build successfully.

- fmt - contains Println for debugging/logging github.com/hyperledger/fabric/core/chaincode/shim - contains the definition for the chaincode interface and the
- chaincode stub, which you will need to interact with the ledger, as we described in the Chaincode Key APIs section
- github.com/hyperledger/fabric/protos/peer - contains the peer protobuf package.

### Sample Chaincode Decomposed - Struct

```
type SampleChaincode struct {

}
```

This might not look like much, but this is the statement that begins the definition of an object/class in Go. SampleChaincode implements a simple chaincode to manage an asset.

### Sample Chaincode Decomposed - Init

Next, we’ll implement the Init method. Init is called during the chaincode instantiation to initialize data required by the application. In our sample, we will create the initial key/value pair for an asset, as specified on the command line:

```
func (t *SampleChaincode) Init(stub shim.ChainCodeStubInterface) peer.Response {

    // Get the args from the transaction proposal

   args := stub.GetStringArgs()

    if len(args) != 2 {

        return shim.Error("Incorrect arguments. Expecting a key and a value")

    }

    // We store the key and the value on the ledger

    err := stub.PutState(args[0], []byte(args[1]))

    if err != nil {

        return shim.Error(fmt.Sprintf("Failed to create asset: %s", args[0]))

    }

    return shim.Success(nil)

}
```

The Init implementation accepts two parameters as inputs, and proposes to write a key/value pair to the ledger by using the stub.PutState function. GetStringArgs retrieves and checks the validity of arguments which we expect to be a key/value pair. Therefore, we check to ensure that there are two arguments specified. If not, we return an error from the Init method, to indicate that something went wrong. Once we have verified the correct number of arguments, we can store the initial state in the ledger. In order to accomplish this, we call the stub.PutState function, specifying the first argument as the key, and the second argument as the value for that key. If no errors are returned, we will return success from the Init method.

### Sample Chaincode Decomposed - Invoke Method

Now, we’ll explore the Invoke method, which gets called when a transaction is proposed by a client application. In our sample, we will either get the value for a given asset, or propose to update the value for a specific asset.

```
func (t *SampleChaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {

    // Extract the function and args from the transaction proposal

    fn, args := stub.GetFunctionAndParameters()

    var result string

    var err error

    if fn == "set" {

        result, err = set(stub, args)

    } else { // assume 'get' even if fn is nil

        result, err = get(stub, args)

    }

    if err != nil { //Failed to get function and/or arguments from transaction proposal

        return shim.Error(err.Error())

    }

    // Return the result as success payload

    return shim.Success([]byte(result))

}
```

There are two basic actions a client can invoke: get and set.

The `get` method will be used to query and return the value of an existing asset. The `set` method will be used to create a new asset or update the value of an existing asset. To start, we’ll call GetFunctionandParameters to isolate the function name and parameter variables. Each transaction is either a set or a get. Let's first look at how the set method is implemented:

```
func set(stub shim.ChaincodeStubInterface, args []string) (string, error) {

    if len(args) != 2 {

        return "", fmt.Errorf("Incorrect arguments. Expecting a key and a value")

    }

    err := stub.PutState(args[0], []byte(args[1]))

    if err != nil {

        return "", fmt.Errorf("Failed to set asset: %s", args[0])

    }

    return args[1], nil

}
```

The `set` method will create or modify an asset identified by a key with the specified value. The `set` method will modify the world state to include the key/value pair specified. If the key exists, it will override the value with the new one, using the `PutState`method; otherwise, a new asset will be created with the specified value.

Next, let's look at how the get method is implemented:

```
func get(stub shim.ChaincodeStubInterface, args []string) (string, error) {

    if len(args) != 1 {

        return "", fmt.Errorf("Incorrect arguments. Expecting a key")

    }

    value, err := stub.GetState(args[0])

    if err != nil {

        return "", fmt.Errorf("Failed to get asset: %s with error: %s", args[0], err)

    }

    if value == nil {

        return "", fmt.Errorf("Asset not found: %s", args[0])

    }

    return string(value), nil

}
```

The `get` method will attempt to retrieve the value for the specified key. If the application does not pass in a single key, an error will be returned; otherwise, the `GetState` method will be used to query the world state for the specified key. If the key has not yet been added to the ledger (and world state), then an error will be returned; otherwise, the value that was set for the specified key is returned from the method.

### Sample Chaincode Decomposed - Main Function

The last piece of code in this sample is the main function, which will call the Start function. The main function starts the chaincode in the container during instantiation.

```
func main() {

    err := shim.Start(new(SampleChaincode))

    if err != nil {

        fmt.Println("Could not start SampleChaincode")

    } else {

        fmt.Println("SampleChaincode successfully started")

    }

}
```