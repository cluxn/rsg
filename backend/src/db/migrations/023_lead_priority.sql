-- Add priority tag to leads (hot/warm/cold, separate from pipeline status)
ALTER TABLE leads ADD COLUMN priority ENUM('none','cold','warm','hot') NOT NULL DEFAULT 'none' AFTER lead_status;
