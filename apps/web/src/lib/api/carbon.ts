import { apiFetch } from "./client"
import { CarbonCalculateRequest, CarbonRecord, SimulateRequest, SimulateResult } from "@/types"

export async function calculateFootprint(data: CarbonCalculateRequest): Promise<CarbonRecord> {
  return apiFetch<CarbonRecord>("/api/v1/carbon/calculate", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function saveRecord(record: CarbonRecord): Promise<{record_id: string, saved: boolean}> {
  return apiFetch<{record_id: string, saved: boolean}>("/api/v1/carbon/save", {
    method: "POST",
    body: JSON.stringify(record),
  })
}

export async function getHistory(): Promise<{records: CarbonRecord[], count: number}> {
  return apiFetch<{records: CarbonRecord[], count: number}>("/api/v1/carbon/history")
}

export async function getSample(): Promise<CarbonRecord> {
  return apiFetch<CarbonRecord>("/api/v1/carbon/sample")
}

export async function simulate(data: SimulateRequest): Promise<SimulateResult> {
  return apiFetch<SimulateResult>("/api/v1/carbon/simulate", {
    method: "POST",
    body: JSON.stringify(data),
  })
}
