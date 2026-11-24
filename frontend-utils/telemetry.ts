// TypeScript contract for the INDUSTRYWISE telemetry API.
export type AssetStatus = "normal" | "warning" | "critical";
export interface AssetTelemetry {
  id: string;
  temperature_c: number;
  vibration_mm_s: number;
  health: number;
  status: AssetStatus;
}
export interface TelemetryResponse {
  timestamp: string;
  source: "synthetic-demo" | "hardware";
  assets: AssetTelemetry[];
}
export async function fetchTelemetry(baseUrl = "http://localhost:8000"): Promise<TelemetryResponse> {
  const response = await fetch(`${baseUrl}/api/telemetry`);
  if (!response.ok) throw new Error(`Telemetry API failed: ${response.status}`);
  return response.json() as Promise<TelemetryResponse>;
}
