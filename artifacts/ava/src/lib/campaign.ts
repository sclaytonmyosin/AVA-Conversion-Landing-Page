import { useSearch } from "wouter";
import { resolveCampaign } from "@workspace/ava-campaigns";

export function useCampaign() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  return resolveCampaign(params.get("utm_source"), params.get("utm_campaign"));
}
