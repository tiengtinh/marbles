ali1rathore @ali1rathore Mar 28 20:06
\http://hyperledger-fabric.readthedocs.io/en/release-1.0/chaincode4ade.html#terminal-3-use-the-chaincode
  peer chaincode install -n mymarbles -v 1.0 -p github.com/chaincode/marbles02/go

---

## Install chain code
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode install --name marbles --version v2 --lang golang --path github.com/marbles
## Instantiate the chain code
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n marbles -v v2 -c '{"Args":[""]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
you may have to wait for the instantiation to complete

when complete, you will see a newly created docker container named "dev-peer0.org1.example.com-marbles-v2-..."

## Invoke it!
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n marbles -c '{"function":"read_everything","Args":[""]}'

---

## Examples and Resources for creating HTTP API for week 3 assignment
Fabric NodeJS SDK Documentation

Example of NodeJS SDK Usage

---

## How to see the logs of peers

fabric-samples/first-network$ docker-compose -f docker-compose-cli.yaml logs --tail 100 -f peer0.org1.example.com peer1.org1.example.com peer0.org2.example.com peer1.org2.example.com

---

https://gist.github.com/thinhlvv/0c98666875d87763491707e325167526
This is my explanation to steps. You can leave your questions here 

---

https://gist.github.com/ali1rathore/4b9aba2e1f81160ea9a3a66023436e33

