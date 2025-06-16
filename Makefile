# Caminho base
DYNAMIC_PLUGINS_DIR=dynamic-plugins
DIST_DIR=$(DYNAMIC_PLUGINS_DIR)/dist

# Alias dos comandos
YARN=yarn
TURBO=turbo

.PHONY: all clean tsc build export-dynamic copy-dynamic-plugins full

## Limpa os artefatos
clean:
	cd $(DYNAMIC_PLUGINS_DIR) && $(YARN) clean

## Compila os arquivos TypeScript
tsc:
	cd $(DYNAMIC_PLUGINS_DIR) && $(YARN) tsc

## Build dos plugins (opcional, pois export-dynamic depende de tsc)
build:
	cd $(DYNAMIC_PLUGINS_DIR) && $(YARN) build

## Exporta os plugins dinâmicos com janus-cli
export-dynamic:
	cd $(DYNAMIC_PLUGINS_DIR) && $(YARN) export-dynamic

## Copia os plugins para a pasta dist
copy-dynamic-plugins:
	cd $(DYNAMIC_PLUGINS_DIR) && $(YARN) copy-dynamic-plugins dist

## Executa tudo na ordem correta
full: clean tsc export-dynamic copy-dynamic-plugins
	@echo "✅ Dynamic plugins exportados e copiados para $(DIST_DIR)"
