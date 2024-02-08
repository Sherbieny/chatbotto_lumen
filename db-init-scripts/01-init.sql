DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_database WHERE datname = 'chatbotto'
    ) THEN
        EXECUTE 'CREATE DATABASE chatbotto';
    END IF;
END
$$;