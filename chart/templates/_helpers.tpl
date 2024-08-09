{{/*
Expand the name of the chart.
*/}}
{{- define "devportal-charts.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "devportal-charts.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "devportal-charts.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "devportal-charts.labels" -}}
helm.sh/chart: {{ include "devportal-charts.chart" . }}
{{ include "devportal-charts.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "devportal-charts.selectorLabels" -}}
app.kubernetes.io/name: {{ include "devportal-charts.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
app-config file name
*/}}
{{- define "devportal.appConfigFilename" -}}
{{- "app-config.yaml" -}}
{{- end -}}

{{- define "extract-host" -}}
{{- $url := . -}}
{{- printf "%s" (regexFind "^(https?://[^/]+)" $url) -}}
{{- end -}}

{{/*
Create the name of the service account to use
*/}}
{{- define "devportal.serviceAccountName" -}}
{{- default (include "devportal-charts.fullname" .) .Values.serviceAccount.name }}
{{- end }}

{{/*
Show the RBAC enabled or not
*/}}
{{- define "rbac-enabled" -}}
{{ and (not .Values.platform.guest.enabled) .Values.permission.rbac.enabled }}
{{- end -}}
