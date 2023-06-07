# Building platform devportal

## Building application
```sh
yarn build:backend
```
## Building docker 
```sh
docker buildx build . -t veecode/devportal-bundle:latest --platform=linux/amd64 -f packages/backend/Dockerfile --push
```
docker build . -t veecode/devportal-bundle:1.0.11 -f packages/backend/Dockerfile
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

Packaging helm chart
```sh
helm package --sign --key 'Veecode Platform' --passphrase-file ./chart/passphrase --keyring ./chart/certificate.gpg chart
```
## Generating chart 
```sh
helm plugin install https://github.com/mihaisee/helm-schema-gen.git
helm schema-gen values.yaml > values.schema.json
```


docker build . -t veecode/devportal-bundle:latest -f packages/backend/Dockerfile.rhel8

docker buildx build . -t veecode/devportal-bundle:1.0.11 -t veecode/devportal-bundle:latest --platform=linux/amd64 --platform=linux/arm64 -f packages/backend/Dockerfile --push


helm upgrade platform-devportal --install --values ./values-full-apr.yaml -n vkpr veecode-platform/devportal


helm package --sign --key 'Veecode Platform' --keyring ./chart/certificate.gpg chart --passphrase-file ./chart/passphrase



helm upgrade platform-devportal --install --values ./values-full-okteto.yaml -n luangazin veecode-platform/devportal

helm upgrade platform-devportal --install --values ./values-full.yaml -n vkpr veecode-platform/devportal

# build steps
sed -i -e 's,https://registry.yarnpkg.com,https://nexus.selic.bc/nexus/repository/npm-public,g' yarn.lock
docker run --rm -ti -u "$UID" -v $(pwd):/src -w /src registry.redhat.io/rhel9/nodejs-16:latest sh -c "npm i -g yarn && yarn config set \"strict-ssl\" false -g && yarn && yarn build"
docker build . -t veecode/devportal-bundle:latest -f packages/backend/Dockerfile.rhel9


helm upgrade platform-devportal --install --values ./values.yaml -n platform \
--set appConfig.backend.secret= \ #RANDOM SECRET
--set appConfig.database.connection.password= \
--set auth.providers.keycloak.clientSecret= \
--set integrations.gitlab.token= \
veecode-platform/devportal






{{- if .Values.ingress.enabled }}
{{- $servicePort := .Values.service.externalPort -}}
{{- $serviceName := include "chartmuseum.fullname" . -}}
{{- $ingressExtraPaths := .Values.ingress.extraPaths -}}
{{- if .Values.ingress.enabled -}}
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: {{ include "chartmuseum.fullname" . }}
  annotations:
{{ toYaml .Values.ingress.annotations | indent 4 }}
  labels:
{{- if .Values.ingress.labels }}
{{ toYaml .Values.ingress.labels | indent 4 }}
{{- end }}
{{ include "chartmuseum.labels.standard" . | indent 4 }}
spec:
  rules:
  {{- range .Values.ingress.hosts }}
  - host: {{ .name }}
    http:
      paths:
      {{- range $ingressExtraPaths }}
      - path: {{ default "/" .path | quote }}
        backend:
        {{- if $.Values.service.servicename }}
          serviceName: {{ $.Values.service.servicename }}
        {{- else }}
          serviceName: {{ default $serviceName .service }}
        {{- end }}
          servicePort: {{ default $servicePort .port }}
      {{- end }}
      - path: {{ default "/" .path | quote }}
        backend:
        {{- if $.Values.service.servicename }}
          serviceName: {{ $.Values.service.servicename }}
        {{- else }}
          serviceName: {{ default $serviceName .service }}
        {{- end }}
          servicePort: {{ default $servicePort .servicePort }}
  {{- end }}
  tls:
  {{- range .Values.ingress.hosts }}
  {{- if .tls }}
  - hosts:
    - {{ .name }}
    secretName: {{ .tlsSecret }}
  {{- end }}
  {{- end }}
{{- end -}}
{{- end }}