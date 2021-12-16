<template>
  <div>
    <p>property address: {{ propertyAddress }}</p>
    <p>staking: {{ staking?.toBigInt() }} DEV</p>
    <p>rewards: {{ reward?.toBigInt() }} DEV</p>
  </div>
</template>

<script>
import { ethers } from "ethers";
import { contractFactory, addresses } from "@devprotocol/dev-kit";

export default {
  data() {
    const config = useRuntimeConfig();
    console.log(config, config.WEB3_PROVIDER_URL);
    return {
      config,
      propertyAddress: "0xac1AC9d00314aE7B4a7d6DbEE4860bECedF92309",
      staking: undefined,
      reward: undefined,
    };
  },
  async mounted() {
    // use main net
    const registryContractAddress = addresses.eth.main.registry;
    const provider = new ethers.providers.JsonRpcProvider(
      this.config.WEB3_PROVIDER_URL
    );
    const network = await provider.ready;
    console.log(network);
    const contract = contractFactory(provider);
    const lockupContractAddress = await contract
      .registry(registryContractAddress)
      .lockup();

    const propertyStakingAmount = await contract
      .lockup(lockupContractAddress)
      .getPropertyValue(this.propertyAddress);
    const stakingAmount = ethers.BigNumber.from(propertyStakingAmount).div(
      ethers.BigNumber.from(10).pow(18)
    );
    console.log(
      `${
        this.propertyAddress
      }'s staking amount is ${stakingAmount.toBigInt()} DEV`
    );

    const propertyRewards = await contract
      .lockup(lockupContractAddress)
      .calculateRewardAmount(this.propertyAddress);
    const reward = ethers.BigNumber.from(propertyRewards[0]).div(
      ethers.BigNumber.from(10).pow(36)
    );
    console.log(
      `${this.propertyAddress}'s rewards is ${reward.toBigInt()} DEV`
    );

    this.staking = stakingAmount;
    this.reward = reward;
  },
};
</script>
