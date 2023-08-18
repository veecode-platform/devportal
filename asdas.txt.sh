helm upgrade platform-devportal --install --debug --dry-run veecode-platform/devportal \
    --set appConfig.app.baseUrl=https://devportal-luangazin.cloud.okteto.net \
    --set appConfig.backend.baseUrl=https://devportal-luangazin.cloud.okteto.net \
    --set "locations[0].type=url,locations[0].target=https://github.com/veecode-platform/demo-catalog/blob/main/catalog-info.yaml"

helm upgrade platform-devportal --install veecode-platform/devportal \
    --set appConfig.app.baseUrl=https://devportal-luangazin.cloud.okteto.net \
    --set appConfig.backend.baseUrl=https://devportal-luangazin.cloud.okteto.net \
    --set "locations[0].type=url,locations[0].target=https://github.com/veecode-platform/demo-catalog/blob/main/catalog-info.yaml"


Component, Template, API, Group, User, Resource, System, Domain, Location

    docker run --rm -ti -u "$UID" -v $(pwd):/src -w /src registry.redhat.io/rhel9/nodejs-18:latest sh -c "yum install zlib-devel brotli-devel -y && npm i -g yarn && yarn && yarn build"

    docker run --rm -ti -u "$UID" -v $(pwd):/src -w /src registry.redhat.io/rhel9/nodejs-18:latest sh 


    docker run --rm -ti -u "$UID" -v $(pwd):/src -w /src quay.io/centos/centos:stream9 sh -c "yum install zlib-devel brotli-devel -y && npm i -g yarn && yarn && yarn build"
    quay.io/centos/centos:stream9

    docker run --rm -ti -u "$UID" -v $(pwd):/src -w /src veecode/devportal-rhel9-devel:node18 sh -c "yarn && yarn build"

    yum install zlib-devel brotli-devel

Repository atualizado

## confirando yarn.lock para o nexus
```sh
sed -i -e 's,https://registry.yarnpkg.com,https://nexus.selic.bc/nexus/repository/npm-public,g' yarn.lock
```
 
## Build da imagem devel: ##
```sh
docker build . -t veecode/devportal-rhel9-devel:latest -f packages/backend/Dockerfile.rhel9-devel
```
## Usando a imagem devel para build do devportal ##
```sh
docker run --rm -ti -u "$UID" -v $(pwd):/src -w /src veecode/devportal-rhel9-devel:latest sh -c "yarn && yarn build"
```
## Build da imagem docker do devportal ##
```sh
docker build . -t veecode/devportal-bundle:latest -f packages/backend/Dockerfile.rhel9
```
## Rodando o container ##
```sh
docker run --rm -p 7007:7007 --network="host" veecode/devportal-bundle:latest
```

docker build . -t veecode/devportal-bundle:latest -f packages/backend/Dockerfile && docker run --rm -p 7007:7007 --network="host" veecode/devportal-bundle:latest



Component, Template, API, Group, User, Resource, System, Domain, Location





export NAMESPACE="luangazin"
export GITHUB_ORG="luangazin"
export PAT_TOKEN="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"
export CATALOG_URL="https://github.com/luangazin/demo-catalog"
helm upgrade devportal --install ./chart \
  --set platform.behaviour.mode="demo" \
  --set "appConfig.app.baseUrl=https://devportal-${NAMESPACE}.cloud.okteto.net" \
  --set "appConfig.backend.baseUrl=https://devportal-${NAMESPACE}.cloud.okteto.net"  \
  --set "integrations.github.token=${PAT_TOKEN}" \
  --set "catalog.providers.github.organization=${GITHUB_ORG}" \
  --set "catalog.providers.github.catalogPath=catalog-info.yaml" \
  --set "catalog.providers.github.filters.branch=main"


export NAMESPACE="luangazin"
export GITHUB_ORG="luangazin"
export PAT_TOKEN="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"
export CATALOG_URL="https://github.com/luangazin/demo-catalog"
helm upgrade devportal --install ./chart \
  --set platform.behaviour.mode="demo" \
  --set "appConfig.app.baseUrl=http://devportal.localhost:8000" \
  --set "appConfig.backend.baseUrl=http://devportal.localhost:8000"  \
  --set "integrations.github.token=${PAT_TOKEN}" \
  --set "catalog.providers.github.organization=${GITHUB_ORG}" \
  --set "catalog.providers.github.catalogPath=catalog-info.yaml" \
  --set "catalog.providers.github.filters.branch=main" \
  --set "ingress.enabled=true" \
  --set "ingress.className=nginx" \
  --set "ingress.host=devportal.localhost" \
  -n vkpr


export NAMESPACE="luangazin"
export GITHUB_ORG="luangazin"
export PAT_TOKEN="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"
export CATALOG_URL="https://github.com/luangazin/demo-catalog"
helm upgrade devportal --install veecode-platform/devportal \
--set "appConfig.app.baseUrl=https://devportal-${NAMESPACE}.cloud.okteto.net" \
--set "appConfig.backend.baseUrl=https://devportal-${NAMESPACE}.cloud.okteto.net"  \
--set "locations[0].type=url,locations[0].target=https://github.com/andrevtg/demo-catalog/blob/main/catalog-info.yaml" \
--set "integrations.github.token=${PAT_TOKEN}"


export NAMESPACE="luangazin"
export GITHUB_ORG="luangazin"
export PAT_TOKEN="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"
export CATALOG_URL="https://github.com/luangazin/demo-catalog"
helm upgrade devportal --install ./chart \
  --set platform.behaviour.mode="demo" \
  --set "appConfig.app.baseUrl=https://devportal-${NAMESPACE}.cloud.okteto.net" \
  --set "appConfig.backend.baseUrl=https://devportal-${NAMESPACE}.cloud.okteto.net"  \
  --set "integrations.github.token=${PAT_TOKEN}" \
  --set "catalog.providers.github.organization=${GITHUB_ORG}" 