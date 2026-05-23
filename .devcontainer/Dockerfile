FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        watchman \
        git-lfs \
        bash-completion \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

USER node
