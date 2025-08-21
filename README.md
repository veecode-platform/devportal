````markdown
# VeeCode DevPortal — Open-source Backstage Distribution

[![License](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](./LICENSE)
[![Docs](https://img.shields.io/badge/docs-DevPortal-informational.svg)](https://docs.platform.vee.codes/devportal/intro/)
[![ArtifactHub](https://img.shields.io/badge/Helm-ArtifactHub-9cf.svg)](https://artifacthub.io/packages/helm/veecode-platform/devportal)

**VeeCode DevPortal** is a production-ready, open-source distribution of **Backstage**. It ships with an opinionated setup, a curated plugin set, and **Dynamic Plugins** support to help you stand up an Internal Developer Platform (IDP) without assembling everything from scratch.


## ✨ Highlights

- **Backstage, supercharged** — catalog, scaffolder, TechDocs, and a curated set of integrations.
- **Dynamic Plugins** — enable/configure plugins via YAML, avoiding deep forks.
- **Flexible installs** — run locally with Node/Yarn, via **VKDR** for a 5-minute local cluster, or deploy to **Kubernetes** with Helm.
- **Open & extensible** — Apache-2.0 licensed, vendor-neutral, and easy to customize.

## 🚀 Quickstart

Choose your path:

### 1) Local Development (Node/Yarn)

**Requirements:** Node LTS (18+ or 20+) and Yarn (via Corepack).

```bash
# 1) enable corepack (first time)
corepack enable

# 2) load scripts and prepare dynamic plugins
yarn init-local

# 3) start the app (uses app-config.yaml)
yarn dev
# or force local overrides:
yarn dev-local   # uses app-config.local.yaml
````

> Tip: Configure OAuth and secrets in `app-config.local.yaml` for local testing.

### 2) Local “5-minute” Cluster with VKDR

Spin up an isolated local environment (great for demos/evals).

```bash
# Install VKDR CLI
curl -s https://get-vkdr.vee.codes | bash

# Bring up base infra
vkdr init
vkdr infra up

# Install DevPortal (GitHub OAuth + token)
vkdr devportal install \
  --github-token=$GH_TOKEN \
  --github-client-id=$CLIENT_ID \
  --github-client-secret=$CLIENT_SECRET \
  --install-samples
```

> Access your portal at `https://devportal.localhost` (or your configured host).

### 3) Kubernetes (Helm)

```bash
helm repo add veecode-platform https://veecode-platform.github.io/public-charts/
helm repo update

# customize your values (OAuth, host, theme, etc.)
helm upgrade platform-devportal veecode-platform/devportal \
  --install -n vkpr --create-namespace \
  -f values.yaml
```

## ⚙️ Configuration & Dynamic Plugins

* **App config:** `app-config.yaml` (and `app-config.local.yaml` for local overrides)
* **Dynamic plugins:** `dynamic-plugins.yaml` and `dynamic-plugins.default.yaml`

  * Toggle and configure plugins without changing core app sources.
  * For local plugin development/publishing, use `dynamic-plugins-root/`.

Common scripts:

```bash
yarn init-local   # install deps + prepare dynamic plugins
yarn dev          # start app
yarn dev-local    # start app using local config
```

## 🧩 What’s included

* **Backstage base** — catalog, scaffolder, TechDocs
* **VeeCode plugin set** (examples):

  * CI/CD and Git provider integrations
  * Service & infra explorers (clusters, environments, DBs)
  * Secrets/Vault integration
  * Kong service management
  * Scaffolder extensions for common templates
* **Auth** examples (GitHub/Keycloak)
* **Helm chart** and **VKDR** guides for repeatable installs

> Explore the wider plugin catalog in the VeeCode organization and documentation.


## 🗂️ Repository layout (overview)

```
chart/                      # Helm chart assets
docker/                     # Docker build assets
docker-compose.yaml         # Local docker-compose alternative
docs/                       # Public docs/examples (when applicable)
dynamic-plugins/            # Dynamic plugin manifests
dynamic-plugins-root/       # Local plugin sources for distribution
keycloak/                   # Keycloak setup examples
k8s-service-account/        # K8s SA examples for catalog/scaffolder
packages/                   # App packages
plugins/                    # In-repo plugins
scripts/                    # Helper scripts
DEV.md                      # Dev environment & detailed notes
```


## 📚 Documentation

* **DevPortal Intro:** [https://docs.platform.vee.codes/devportal/intro/](https://docs.platform.vee.codes/devportal/intro/)
* **Simple K8s Setup (GitHub/GitLab):** [https://docs.platform.vee.codes/devportal/installation-guide/simple-setup/](https://docs.platform.vee.codes/devportal/installation-guide/simple-setup/)
* **Local install with VKDR:** [https://docs.platform.vee.codes/devportal/installation-guide/VKDR/](https://docs.platform.vee.codes/devportal/installation-guide/VKDR/)
* **GitHub OAuth & tokens:** [https://docs.platform.vee.codes/devportal/installation-guide/VKDR/github/](https://docs.platform.vee.codes/devportal/installation-guide/VKDR/github/)
* **Customization (themes/logos):** [https://docs.platform.vee.codes/devportal/installation-guide/Customization/](https://docs.platform.vee.codes/devportal/installation-guide/Customization/)
* **Admin-UI:** [https://docs.platform.vee.codes/admin-ui/intro/](https://docs.platform.vee.codes/admin-ui/intro/)
* **Helm Chart (ArtifactHub):** [https://artifacthub.io/packages/helm/veecode-platform/devportal](https://artifacthub.io/packages/helm/veecode-platform/devportal)
* **VeeCode Plugins:** [https://github.com/veecode-platform/platform-backstage-plugins](https://github.com/veecode-platform/platform-backstage-plugins)

## 🤝 Contributing

We welcome contributions!

* Use **Conventional Commits** (e.g., `feat: …`, `fix: …`).
* Open an issue or discussion for proposals and RFCs.
* Include/adjust docs and examples when behavior changes.
* Add tests where applicable.

> Be respectful and supportive. We follow a standard open-source code of conduct.


## 🔒 Security

If you discover a vulnerability, **do not** open a public issue.
Please email **[security@vee.codes](mailto:security@vee.codes)** with details (and a PoC if possible).


## 🙏 Acknowledgments

* Thanks to the **Backstage** open-source community for the foundation.
* Thanks to all **VeeCode** and community contributors who make this distribution better.

```

If you want, I can open a PR adding this README and aligning links/sections to any internal conventions you prefer. 

**Notes (checked for accuracy):** repo structure and local commands (`yarn init-local`, `yarn dev`, `yarn dev-local`) are present in the repository; VKDR, Helm, OAuth, and customization flows are documented in the official VeeCode docs and ArtifactHub pages. :contentReference[oaicite:0]{index=0}
::contentReference[oaicite:1]{index=1}
```
