from logging.config import fileConfig
import os
import sys
from sqlalchemy import engine_from_config, pool, create_engine
from alembic import context

# --- Alembic Config ---
config = context.config

# --- Logging config ---
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# --- Agregar el path del backend ---
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

# --- Importar la URL de la base de datos desde tu app ---
from app.db import DATABASE_URL
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# --- Importar metadatos de los modelos ---
from app.models import Base
target_metadata = Base.metadata


# --- Modo offline ---
def run_migrations_offline():
    """Ejecuta las migraciones sin conexión (modo offline)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


# --- Modo online ---
def run_migrations_online():
    """Ejecuta las migraciones con conexión (modo online)."""
    url = config.get_main_option("sqlalchemy.url")
    connectable = create_engine(url, poolclass=pool.NullPool)

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


# --- Ejecutar según el modo ---
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
