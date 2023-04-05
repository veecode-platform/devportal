# Building platform devportal

## Building application
```sh
yarn build:backend
```
## Building docker 
```sh
docker buildx build . -t veecode/devportal:latest --platform=linux/amd64 -f packages/backend/Dockerfile --push
```
docker build . -t veecode/devportal-bundle:1.0.9 -f packages/backend/Dockerfile
# DevelopingHelm Chart Template

## Running in Dry run mode

```sh
helm install --values ./values-demo.yaml -n luangazin --generate-name=true --dry-run --debug ./chart/
```

## Installing devportal

```sh
helm upgrade platform-devportal --install --values ./values-demo.yaml -n luangazin ./chart/
```
## Removing devportal

```sh
helm uninstall platform-devportal
```

## Listing all keys from values.yaml
```sh
yaml-paths --nofile --expand --keynames --noescape --search='=~/.*/' values-demo.yaml
```
Add --values to get values from key