```
configtxgen -profile ThreeOrgsChannel -outputCreateChannelTx transfers.tx -channelID transfers
configtxgen -profile ThreeOrgsChannel -outputCreateChannelTx channel/fredrick-bob.tx -channelID fredrick-bob
configtxgen -profile ThreeOrgsChannel -outputCreateChannelTx channel/fredrick-alice.tx -channelID fredrick-alice

# custom
configtxgen -profile ThreeOrgsChannel -outputCreateChannelTx channel/bob-alice.tx -channelID bob-alice
```

## on first-network
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode install -n mycc -v 1.0 -p github.com/chaincode/chaincode_example02/go

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" cli peer chaincode install -n mycc2 -v 1.0 -p github.com/chaincode/chaincode_example02/go
docker exec cli peer chaincode instantiate -o orderer.example.com:7050 --tls $CORE_PEER_TLS_ENABLED --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n mycc2 -v 1.0 -c '{"Args":["init","a", "100", "b","200"]}' -P "OR ('Org1MSP.member','Org2MSP.member')"

# the cafile does exist in the cli container
peer chaincode instantiate -o orderer.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n mycc2 -v 1.0 -c '{"Args":["init","a", "100", "b","200"]}' -P "OR ('Org1MSP.member','Org2MSP.member')"

peer chaincode query -C mychannel -n mycc2 -v v0 -c '{"Args":["query","a"]}'

peer chaincode invoke -o orderer.example.com:7050  --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem  -C mychannel -n mycc2 -c '{"Args":["invoke","a","b","10"]}'

# try no cafile
peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n mycc2 -c '{"Args":["invoke","a","b","10"]}'