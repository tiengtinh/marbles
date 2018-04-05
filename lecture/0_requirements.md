## Week 3 Lab Exercises

### Asset Management Network

We'll be building a simple asset management system where ownership of assets can be transfered between users.

In this case the assets are ... Marbles!

Not just any boring marbles, these marbles have different **colors** and **sizes**. Wow so many difficulty!

### Step 1: Build your first hyperledger network!

#### First get Go and Docker dependencies

- [linux dependencies](https://gist.github.com/ali1rathore/e8ca80b4cebd07b186df46a551a40285)
- [MacOS dependencies](https://gist.github.com/ali1rathore/a7c8b339733ae0f4d4256f57464ecd72)
- [Windows dependencies](https://gist.github.com/ali1rathore/89b9f73b0a653cf5bed46b10c26eca3d)

#### Then build your local fabric network

[Build Your First Network](https://gist.github.com/ali1rathore/c6a8323906c7db969eb4ea10b7249ef9)

### Step 2: Create Marble Chaincode!

Create a `marbles.go` file for our new chaincode

- [How to write chaincode](http://hyperledger-fabric.readthedocs.io/en/release-1.0/chaincode4ade.html)
- [How to deploy chaincode](http://hyperledger-fabric.readthedocs.io/en/release-1.0/build_network.html#install-instantiate-chaincode)

#### The assets

We need to keep track of 2 assets and 1 relationship between the assets:

- Which marbles exist and who they belong to
  - Marbles: (id : string, color : string, size : int, owner : OwnerRelation)
- Which users are enabled (disabled owners are not visible to application)
  - Owner: (id : string, username: string, company : string, enabled : bool)
- Mapping from marble to Owner.id
  - OwnerRelation : (id : string)

The Marbles and Owner structs should also contain a "ObjectType" field that is used by CouchDB

```
type Marble struct {
  ObjectType string `json:"docType"`
  ...
}
```

#### The Init function

The marbles do not require initialization, so we will use it to demonstrate a few functions

- Print the results of `stub.GetFunctionAndParameters()` and `stub.GetStringArgs()`
- Print the esult of `stub.GetTxID()` to get the ID of the proposal that initializes the chaincode

#### The chaincode functions

Implement the following functions:

- init_marble - creates a new marble, store into chaincode state
- get_marble - gets info about a marble
- delete_marble - remove marble from state
- init_owner
- get_owner
- set_owner(marble_id, new_owner_id, authorizaing_company)
  - authorizing company should be the company of the marble's current owner
- disable_owner

### Step 3: Install, instantiate, and invoke the chaincode

Connect to the `cli` container and use the `peer chaincode` commands to deploy and interact with your chaincode

### Step 4: Bonus - create a REST API and UI

Create a REST API that connects with a peer to interact with the marbles and owners

## Resources

<http://hyperledger-fabric.readthedocs.io/en/release-1.0/build_network.html>

#### Useful Docker Commands

`docker ps -a` - Show all docker processes.

`docker-compose -f <your_docker_compose_file.yaml> up -d` - Start docker containers that are described by docker-compose.yaml.

`docker rm -f $(docker ps -aq)` - Shut down/remove all docker processes.

`docker network ls` - Shows docker networks.

`docker logs <id|name>` - Show the logs for a docker container. Logs are useful for debugging problems.

`docker exec -it <id|name> bash` - Enter the docker container and start an interactive bash terminal.