-- 01-init.sql
-- Create the chatbotto database if it doesn't exist
CREATE DATABASE IF NOT EXISTS chatbotto;
-- Connect to the chatbotto database
\ c chatbotto;
-- Check if the textsearch_ja extension exists
DO $$ BEGIN CREATE EXTENSION IF NOT EXISTS textsearch_ja;
EXCEPTION
WHEN duplicate_object THEN -- Do nothing, the extension already exists
NULL;
END $$;