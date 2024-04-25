CREATE EXTENSION vector;
CREATE user devportal WITH ENCRYPTED PASSWORD 'devportal';
CREATE user keycloak_adm WITH ENCRYPTED PASSWORD 'keycloak_adm';

CREATE DATABASE "keycloak";
CREATE DATABASE "platform_devportal" ;

GRANT ALL privileges ON DATABASE platform_devportal TO devportal;
GRANT ALL privileges ON DATABASE keycloak TO keycloak_adm ;

-- ALTER DATABASE "keycloak" OWNER TO "keycloak_adm";
\c keycloak
GRANT CREATE,USAGE ON SCHEMA public TO keycloak_adm;

-- \c platform_devportal
-- DO $do$
-- DECLARE
--     sch text;
-- BEGIN
--     FOR sch IN SELECT nspname FROM pg_namespace WHERE nspacl IS NULL AND nspname NOT LIKE 'pg_%'
--     LOOP
--         EXECUTE format($$ GRANT ALL PRIVILEGES ON SCHEMA %I TO keycloak $$, sch);
--     END LOOP;
-- END;
-- $do$;