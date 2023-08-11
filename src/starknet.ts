import { Account, constants, ec, json, stark, Provider, hash, CallData } from "starknet";


export class Client {
  protected provider
  constructor({}) {
    this.provider = new Provider({ sequencer: { network: constants.NetworkName.SN_MAIN } });
  }
}