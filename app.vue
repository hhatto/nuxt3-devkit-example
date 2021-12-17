<template>
  <div>
    <p>property address: {{ propertyAddress }}</p>
    <p>staking: {{ staking?.toBigInt() }} DEV</p>
    <p>rewards: {{ reward?.toBigInt() }} DEV</p>
  </div>
</template>

<script>
import { ethers } from "ethers";
import { addresses } from "@devprotocol/dev-kit";
import { contractFactory } from "@devprotocol/dev-kit/l2";

export default {
  data() {
    const config = useRuntimeConfig();
    console.log(config, config.WEB3_PROVIDER_URL);
    return {
      config,
      propertyAddress: "0xA3F2C13c7392924C334E72C0Bab69a5f0131A786", // for L2
      staking: undefined,
      reward: undefined,
    };
  },
  async mounted() {
    // use arbitrum one
    const registry = addresses.arbitrum.one;
    const provider = new ethers.providers.JsonRpcProvider(
      this.config.WEB3_PROVIDER_URL
    );
    const network = await provider.ready;
    const contract = contractFactory(provider);
    const lockupContract = contract.lockup(registry.lockup);
    console.log(network, registry, lockupContract);

    const propertyStakingAmount = await lockupContract.totalLockedForProperty(
      this.propertyAddress
    );
    const stakingAmount = ethers.BigNumber.from(propertyStakingAmount).div(
      ethers.BigNumber.from(10).pow(18)
    );
    console.log(
      `${
        this.propertyAddress
      }'s staking amount is ${stakingAmount.toBigInt()} DEV`
    );

    const propertyRewards = await lockupContract.calculateRewardAmount(
      this.propertyAddress
    );
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
