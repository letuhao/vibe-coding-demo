-- Database Initialization Script for Production
-- Generated: 2024-01-15
-- Author: Vibe Coding Demo

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS expense_manager_prod;

-- Use the database
\c expense_manager_prod;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create user if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'expense_user') THEN
        CREATE ROLE expense_user WITH LOGIN PASSWORD 'secure_password_2024';
    END IF;
END
$$;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE expense_manager_prod TO expense_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO expense_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO expense_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO expense_user;

-- Set default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO expense_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO expense_user;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at);

-- Create composite indexes
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date);
CREATE INDEX IF NOT EXISTS idx_expenses_user_category ON expenses(user_id, category_id);

-- Analyze tables for better query planning
ANALYZE;
