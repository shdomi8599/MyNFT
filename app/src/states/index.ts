import { atom } from "recoil";

export const isLoginState = atom({
  key: "isLoginState",
  default: false,
});

export const networkState = atom({
  key: "networkState",
  default: "hardhat",
});
