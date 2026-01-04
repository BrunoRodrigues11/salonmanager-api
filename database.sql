-- Ativa a extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tipos ENUM
CREATE TYPE user_role AS ENUM ('Manicure', 'Cabeleireira', 'Ambas');
CREATE TYPE procedure_category AS ENUM ('Manicure', 'Cabeleireira – Feminino', 'Cabeleireira – Masculino', 'Extras');
CREATE TYPE service_status AS ENUM ('Fez', 'Não Fez');

-- Tabela: Colaboradoras
CREATE TABLE collaborators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Procedimentos
CREATE TABLE procedures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category procedure_category NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Pivô: Procedimentos permitidos por colaboradora
CREATE TABLE collaborator_allowed_procedures (
    collaborator_id UUID REFERENCES collaborators(id) ON DELETE CASCADE,
    procedure_id UUID REFERENCES procedures(id) ON DELETE CASCADE,
    PRIMARY KEY (collaborator_id, procedure_id)
);

-- Tabela: Configuração de Preços
CREATE TABLE price_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    procedure_id UUID NOT NULL REFERENCES procedures(id) ON DELETE CASCADE,
    value_done DECIMAL(10, 2) NOT NULL DEFAULT 0,
    value_not_done DECIMAL(10, 2) NOT NULL DEFAULT 0,
    value_additional DECIMAL(10, 2) NOT NULL DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_price_proc UNIQUE (procedure_id)
);

-- Tabela: Registros de Serviços
CREATE TABLE service_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    collaborator_id UUID REFERENCES collaborators(id),
    procedure_id UUID REFERENCES procedures(id),
    status service_status NOT NULL,
    notes TEXT,
    extras TEXT[], -- Array de strings no Postgres
    calculated_value DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);