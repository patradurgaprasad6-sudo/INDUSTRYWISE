-- PostgreSQL starter schema. Apply with psql after creating a database.
CREATE TABLE IF NOT EXISTS assets (
  asset_id VARCHAR(32) PRIMARY KEY,
  asset_name TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  installation_date DATE,
  active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS telemetry (
  id BIGSERIAL PRIMARY KEY,
  asset_id VARCHAR(32) NOT NULL REFERENCES assets(asset_id),
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  temperature_c REAL,
  vibration_mm_s REAL,
  rotational_speed_rpm INTEGER,
  source TEXT NOT NULL DEFAULT 'hardware'
);
CREATE INDEX IF NOT EXISTS telemetry_asset_time_idx ON telemetry(asset_id, captured_at DESC);
CREATE TABLE IF NOT EXISTS maintenance_events (
  id BIGSERIAL PRIMARY KEY,
  asset_id VARCHAR(32) NOT NULL REFERENCES assets(asset_id),
  scheduled_at TIMESTAMPTZ,
  event_type TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'planned'
);
