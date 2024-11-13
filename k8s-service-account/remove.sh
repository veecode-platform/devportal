#!/bin/bash

export NAMESPACE=$1
#if NAMESPACE is not set, ask for it
if [ -z "$NAMESPACE" ]; then
  read -p "Enter the namespace: " NAMESPACE
fi
echo "Deleting service account in namespace $NAMESPACE"


kubectl delete -f ./cluster-role-binding.yaml -n $NAMESPACE
kubectl delete -f ./service-account.yaml -n $NAMESPACE
kubectl delete -f ./cluster-role.yaml -n $NAMESPACE