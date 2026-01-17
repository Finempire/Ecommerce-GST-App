-- GST Automation Database Schema
-- Run this script to create the database tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    whatsapp_number VARCHAR(20),
    role VARCHAR(50) DEFAULT 'business' CHECK (role IN ('admin', 'ca', 'business')),
    subscription_plan VARCHAR(50) DEFAULT 'free_trial',
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscription Plans Table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    features JSONB,
    max_assessees INTEGER,
    max_transactions INTEGER,
    validity_days INTEGER DEFAULT 365,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Uploads Table
CREATE TABLE IF NOT EXISTS uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_type VARCHAR(20),
    platform_name VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    upload_id UUID REFERENCES uploads(id) ON DELETE CASCADE,
    order_id VARCHAR(100),
    transaction_date DATE,
    description TEXT,
    quantity INTEGER DEFAULT 1,
    sale_price DECIMAL(12, 2) DEFAULT 0,
    taxable_value DECIMAL(12, 2) DEFAULT 0,
    gst_rate DECIMAL(5, 2) DEFAULT 0,
    igst DECIMAL(12, 2) DEFAULT 0,
    cgst DECIMAL(12, 2) DEFAULT 0,
    sgst DECIMAL(12, 2) DEFAULT 0,
    hsn_code VARCHAR(20),
    state_code VARCHAR(5),
    product_name VARCHAR(500),
    ledger_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    report_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255),
    file_content TEXT,
    file_path VARCHAR(500),
    status VARCHAR(50) DEFAULT 'generated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_uploads_user_id ON uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_uploads_status ON uploads(status);
CREATE INDEX IF NOT EXISTS idx_transactions_upload_id ON transactions(upload_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_hsn ON transactions(hsn_code);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);

-- Insert default subscription plans
INSERT INTO subscription_plans (plan_name, price, features, max_assessees, max_transactions, validity_days)
VALUES 
    ('Light', 3900.00, '{"json_export": true, "tally_xml": true, "csv_export": true, "gstr1": true, "platforms": 5, "email_support": true}', 100, 10000, 365),
    ('Popular', 4900.00, '{"json_export": true, "tally_xml": true, "csv_export": true, "gstr1": true, "platforms": 10, "bulk_processing": true, "priority_support": true}', 250, 50000, 365),
    ('Professional', 8000.00, '{"json_export": true, "tally_xml": true, "csv_export": true, "gstr1": true, "platforms": -1, "bulk_processing": true, "api_access": true, "whitelabel": true, "priority_support": true}', -1, -1, 365)
ON CONFLICT DO NOTHING;
