#!/bin/bash

# check if namespace vkpr exists and create it if not
kubectl get namespace vkpr || kubectl create namespace vkpr

kubectl apply -f ./cluster-role.yaml
kubectl apply -f ./service-account.yaml
kubectl apply -f ./cluster-role-binding.yaml

SERVICE_ACCOUNT_NAME=$(cat ./service-account.yaml | yq -e '.metadata.name')
SERVICE_ACCOUNT_NAMESPACE=$(cat ./service-account.yaml | yq -e '.metadata.namespace // "default"')
echo "Generating token for $SERVICE_ACCOUNT_NAME namespace $SERVICE_ACCOUNT_NAMESPACE"
SERVICE_ACCOUNT_TOKEN=$(kubectl create token ${SERVICE_ACCOUNT_NAME} -n ${SERVICE_ACCOUNT_NAMESPACE})

## Getting current server authority certificate
K8S_SERVER_CERTIFICATE=$(cat ~/.kube/config | yq -r ".clusters[] | select(.name == \"$(cat ~/.kube/config | yq -r '.current-context')\").cluster.certificate-authority-data")
K8S_SERVER_HOST=$(cat ~/.kube/config | yq -r ".clusters[] | select(.name == \"$(cat ~/.kube/config | yq -r '.current-context')\").cluster.server")
echo "-----------------------------------"
echo "K8S Server Host: $K8S_SERVER_HOST"
echo "-----------------------------------"
echo "Service Account Token: $SERVICE_ACCOUNT_TOKEN"
echo "-----------------------------------"
echo "K8S Certificate Authority Data: $K8S_SERVER_CERTIFICATE" 
echo "-----------------------------------"
