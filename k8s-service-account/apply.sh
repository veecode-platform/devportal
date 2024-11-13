#!/bin/bash

# check if namespace veecode-apr exists and create it if not
export NAMESPACE=${1:-default}
export CLUSTER_ROLE_NAME="platform-devportal-kubernetes-$NAMESPACE-read-only"
export SERVICE_ACCOUNT_NAME="platform-devportal-kubernetes-read-only"
kubectl get namespace $NAMESPACE || kubectl create namespace $NAMESPACE
yq eval '''
    .metadata.name = env(CLUSTER_ROLE_NAME) 
''' -i cluster-role.yaml
yq eval '''
    .metadata.name = env(CLUSTER_ROLE_NAME) |
    .roleRef.name = env(CLUSTER_ROLE_NAME) |
    .subjects[].name = env(SERVICE_ACCOUNT_NAME) |
    .subjects[].namespace = env(NAMESPACE)
''' -i cluster-role-binding.yaml
yq eval '''
    .metadata.name = env(SERVICE_ACCOUNT_NAME) |
    .metadata.namespace = env(NAMESPACE)
''' -i service-account.yaml

kubectl apply -f ./cluster-role.yaml
kubectl apply -f ./service-account.yaml
kubectl apply -f ./cluster-role-binding.yaml

echo "Generating token for $SERVICE_ACCOUNT_NAME namespace ${NAMESPACE}"
SERVICE_ACCOUNT_TOKEN=$(kubectl create token ${SERVICE_ACCOUNT_NAME} --duration=87660h -n ${NAMESPACE})

# ## Getting current server authority certificate
K8S_SERVER_CERTIFICATE=$(cat ~/.kube/config | yq -r ".clusters[] | select(.name == \"$(cat ~/.kube/config | yq -r '.current-context')\").cluster.certificate-authority-data")
K8S_SERVER_HOST=$(cat ~/.kube/config | yq -r ".clusters[] | select(.name == \"$(cat ~/.kube/config | yq -r '.current-context')\").cluster.server")
echo "-----------------------------------"
echo "K8S Server Host: $K8S_SERVER_HOST"
echo "-----------------------------------"
echo "Service Account Token: $SERVICE_ACCOUNT_TOKEN"
echo "-----------------------------------"
echo "K8S Certificate Authority Data: $K8S_SERVER_CERTIFICATE" 
echo "-----------------------------------"
