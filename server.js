import libnexajs from 'libnexa-js';





async function TransferExample(){
    // From private key
    var privateKey = new libnexajs.PrivateKey();

    // Create a change address
    var changePrivateKey = new libnexajs.PrivateKey();

    var changeAddress = changePrivateKey.toAddress();

    // Initialize an electrum client.
    const electrum = new ElectrumClient('Electrum client example', '1.4.1', 'electrum.nexa.org');

    // Request the full transaction hex for the transaction ID.
    const utxos = await electrum.request('blockchain.address.listunspent', address, 'exclude_tokens');

    // Nexa's max transaction outputs is 256.
    const MAX_INPUTS_OUTPUTS = 256;
    let tx = new libnexajs.Transaction()

    //Spends all inputs
    for (let utxo of utxos) {
    let input = {
        txId: utxo.outpoint_hash,
        outputIndex: utxo.tx_pos,
        address: key.address,
        satoshis: utxo.value
    };
    tx.from(input);
    }

    // Nexa cannot handle more than 256 inputs due to TPS limitations, to handle this use a script similar to this to consolidate your inputs.
    if (tx.inputs.length > MAX_INPUTS_OUTPUTS) {
    throw new Error("Too many inputs. Consider consolidate transactions or reduce the send amount.");
    }

    // assuming we have 15000 satoshis and the fee is coming from the amount.
    tx.to('nexa:nqtsq5g58rae9e24ea9tcdvwur8d4ur7py5v3a00ccwtkyqp', 15000)
    // sign with from 
    tx.sign(privateKey);
    var fee = tx._estimateSize() * (libnexajs.Transaction.FEE_PER_KB / 1000);
    tx._updateOutput(0, 15000 - fee);
    tx.change(changeAddress)

    // Broadcast TX to the network
    await electrum.request('blockchain.transaction.broadcast', tx.serialize());

}