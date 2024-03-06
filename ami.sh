yum update && yum upgrade && \
yum install -y curl-minimal wget openssl git unzip

curl -fsSL https://get.vkpr.net/ | bash

echo 'alias vkpr="rit vkpr"' >> /root/.bashrc && source /root/.bashrc

curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

vkpr infra up

vkpr ingress install --ssl=false

helm repo add veecode-platform https://veecode-platform.github.io/public-charts/
helm repo update

helm upgrade devportal --install veecode-platform/devportal \
  --set "platform.behaviour.mode=demo" \
  --set "appConfig.app.baseUrl=http://localhost:7007" \
  --set "appConfig.backend.baseUrl=http://localhost:7007"  \
  --set "ingress.enabled=true" \
  --set "ingress.host=localhost.devportal:8000" \
  --set "ingress.className=nginx" \
  --set "locations[0].type=url,locations[0].target=https://github.com/veecode-platform/demo-catalog/blob/main/catalog-info.yaml"