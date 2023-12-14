#!/bin/bash

kubectl delete -f ./cluster-role-binding.yaml
kubectl delete -f ./service-account.yaml
kubectl delete -f ./cluster-role.yaml