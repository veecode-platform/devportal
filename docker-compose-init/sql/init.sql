CREATE DATABASE "keycloak";
CREATE DATABASE "platform_devportal" ;

CREATE user devportal WITH ENCRYPTED PASSWORD 'devportal';
CREATE user keycloak WITH ENCRYPTED PASSWORD 'keycloak';

GRANT ALL privileges ON DATABASE platform_devportal TO devportal ;
GRANT ALL privileges ON DATABASE keycloak TO keycloak ;
