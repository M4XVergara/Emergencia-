-- ============================================================
--  SCHEMA CLÍNICA BIENESTAR — pegar en Supabase SQL Editor
--  Menu: Project → SQL Editor → New query → pegar → Run
-- ============================================================

-- ── TABLA PACIENTES ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pacientes (
    id               BIGSERIAL PRIMARY KEY,         -- PK interna de Supabase
    patient_id       BIGINT UNIQUE NOT NULL,         -- ID original de la app (Date.now())
    nombre           TEXT NOT NULL,
    apellido_paterno TEXT NOT NULL,
    apellido_materno TEXT NOT NULL,
    rut              TEXT NOT NULL,
    edad             INTEGER NOT NULL CHECK (edad > 0),
    sexo             TEXT NOT NULL,

    -- Signos vitales
    temperatura      NUMERIC(4,1),
    presion_sistolica  INTEGER,
    presion_diastolica INTEGER,
    pulsaciones      INTEGER,
    spo2             INTEGER,

    -- Info clínica
    nivel_dolor      INTEGER CHECK (nivel_dolor BETWEEN 0 AND 10),
    alergias         TEXT,
    medicamentos     TEXT,
    diagnostico      TEXT DEFAULT '',

    -- Síntomas como array JSON (Supabase lo maneja nativamente)
    sintomas         TEXT[] DEFAULT '{}',

    -- Triage
    urgencia         TEXT CHECK (urgencia IN ('Roja', 'Amarillo', 'Verde')),
    fecha_registro   TEXT,

    -- Auditoría automática
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABLA SOLICITUDES DE HORA ─────────────────────────────────
CREATE TABLE IF NOT EXISTS solicitudes_hora (
    id               BIGSERIAL PRIMARY KEY,
    solicitud_id     BIGINT UNIQUE NOT NULL,
    nombre           TEXT NOT NULL,
    apellido_paterno TEXT NOT NULL,
    apellido_materno TEXT NOT NULL,
    rut              TEXT NOT NULL,
    edad             INTEGER,
    sexo             TEXT,
    comuna           TEXT,
    consultorio      TEXT,
    distancia_km     TEXT,
    tiempo_espera_min     INTEGER,
    tiempo_espera_max     INTEGER,
    tiempo_espera_promedio INTEGER,
    telefono         TEXT,
    email            TEXT,
    motivo           TEXT,
    estado           TEXT DEFAULT 'pendiente',   -- pendiente / confirmada / atendida
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── TRIGGER: actualizar updated_at automáticamente ───────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON pacientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── SEGURIDAD (Row Level Security) ───────────────────────────
-- Habilitar RLS para que nadie acceda sin autenticación desde fuera
ALTER TABLE pacientes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitudes_hora ENABLE ROW LEVEL SECURITY;

-- Política: solo usuarios autenticados pueden leer/escribir pacientes
CREATE POLICY "Solo autenticados leen pacientes"
    ON pacientes FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Solo autenticados insertan pacientes"
    ON pacientes FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Solo autenticados actualizan pacientes"
    ON pacientes FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Solo autenticados eliminan pacientes"
    ON pacientes FOR DELETE
    USING (auth.role() = 'authenticated');

-- Las solicitudes de hora las puede insertar cualquiera (público)
-- pero solo los autenticados las pueden leer/gestionar
CREATE POLICY "Público puede insertar solicitudes"
    ON solicitudes_hora FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Solo autenticados leen solicitudes"
    ON solicitudes_hora FOR SELECT
    USING (auth.role() = 'authenticated');
