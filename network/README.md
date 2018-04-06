```
configtxgen -profile ThreeOrgsChannel -outputCreateChannelTx transfers.tx -channelID transfers
configtxgen -profile ThreeOrgsChannel -outputCreateChannelTx channel/fredrick-bob.tx -channelID fredrick-bob
configtxgen -profile ThreeOrgsChannel -outputCreateChannelTx channel/fredrick-alice.tx -channelID fredrick-alice

# custom
configtxgen -profile ThreeOrgsChannel -outputCreateChannelTx channel/bob-alice.tx -channelID bob-alice
```