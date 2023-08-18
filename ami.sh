#!/bin/bash
echo 'PATH="${PATH}:${HOME}/.vkpr/bin/"' >> ${HOME}/.bashrc && \
echo 'alias vkpr="rit vkpr"' >> ${HOME}/.bashrc && source ${HOME}/.bashrc

sudo yum update && sudo yum upgrade
sudo yum install -y curl-minimal wget openssl git unzip docker

sudo service docker start && sudo systemctl enable docker.service
sudo usermod -a -G docker ec2-user && newgrp docker

curl -fsSL https://get.vkpr.net/ | bash

curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

helm repo add veecode-platform https://veecode-platform.github.io/public-charts/ && \
helm repo update

vkpr infra up

kubectl create namespace vkpr

k3d cluster edit vkpr-local --port-add 80:7007@server:0

helm upgrade devportal --install veecode-platform/devportal \
  --set "platform.behaviour.mode=demo" \
  --set "appConfig.app.baseUrl=http://localhost:7007" \
  --set "appConfig.backend.baseUrl=http://localhost:7007"  \
  --set "service.type=LoadBalancer" \
  --set "locations[0].type=url,locations[0].target=https://github.com/veecode-platform/demo-catalog/blob/main/catalog-info.yaml" -n vkpr

# rm ${HOME}/.bash_history

############################################

sudo vim /lib/systemd/system/startup.service

```
[Unit]
Description=Startup Script

[Service]
ExecStart=/home/ec2-user/.local/bin/startup.sh

[Install]
WantedBy=multi-user.target
```

touch /home/ec2-user/.local/bin/startup.sh
```
#!/bin/bash
echo 'PATH="${PATH}:${HOME}/.vkpr/bin/"' >> ${HOME}/.bashrc
echo 'alias vkpr="rit vkpr"' >> ${HOME}/.bashrc
echo 'alias k="kubectl"' >> ${HOME}/.bashrc
```

sudo systemctl enable startup.service --now