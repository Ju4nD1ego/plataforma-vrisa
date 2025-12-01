FROM postgres:15

COPY init/01-base_inicial.ddl.sql /docker-entrypoint-initdb.d/
COPY init/02-datos_obligatorios.dml.sql /docker-entrypoint-initdb.d/
