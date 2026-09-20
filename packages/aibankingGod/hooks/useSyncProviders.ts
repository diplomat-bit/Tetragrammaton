
import { useSyncExternalStore } from "react"
import { store } from "./store"
import { EIP6963ProviderDetail } from "../types";

export const useSyncProviders = () =>
  useSyncExternalStore<EIP6963ProviderDetail[]>(store.subscribe, store.value, store.value)
