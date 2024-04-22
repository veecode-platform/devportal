FROM postgres:15.5

# Install the build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    postgresql-server-dev-all \
    libopenblas-dev \
    liblapack-dev \
    wget

# Download and install pgvector
RUN wget https://github.com/ankane/pgvector/archive/refs/tags/v0.6.2.tar.gz && \
    tar -xvzf v0.6.2.tar.gz && \
    cd pgvector-0.6.2 && \
    make && \
    make install

# Clean up the Dockerfile
RUN apt-get remove -y \
    build-essential \
    postgresql-server-dev-all \
    libopenblas-dev \
    liblapack-dev \
    wget && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/* && \
    rm v0.6.2.tar.gz && \
    rm -rf pgvector-0.6.2

# Run the postgres server
CMD ["postgres"]