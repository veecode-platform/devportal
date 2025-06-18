# Base paths
DYNAMIC_PLUGINS_DIR=dynamic-plugins
DIST_DIR=$(DYNAMIC_PLUGINS_DIR)/dist

# Command aliases
YARN=yarn
TURBO=turbo

.PHONY: all clean tsc build export-dynamic copy-dynamic-plugins check-dynamic-plugins full install

## Cleans build artifacts
clean:
	cd $(DYNAMIC_PLUGINS_DIR) && $(YARN) clean

## Installs dependencies
install:
	cd $(DYNAMIC_PLUGINS_DIR) && $(YARN) install

## Compiles TypeScript files
tsc:
	cd $(DYNAMIC_PLUGINS_DIR) && $(YARN) tsc

## Builds dynamic plugins (optional, as export-dynamic depends on tsc)
build:
	cd $(DYNAMIC_PLUGINS_DIR) && $(YARN) build

## Exports dynamic plugins using janus-cli
export-dynamic:
	cd $(DYNAMIC_PLUGINS_DIR) && $(YARN) export-dynamic

## Copies dynamic plugins to the dist folder
copy-dynamic-plugins:
	cd $(DYNAMIC_PLUGINS_DIR) && $(YARN) copy-dynamic-plugins dist

## Runs the 'check-dynamic-plugins' script from the root
check-dynamic-plugins:
	$(YARN) check-dynamic-plugins

## Executes all steps in the correct order
full: install clean tsc export-dynamic copy-dynamic-plugins check-dynamic-plugins
	@echo "✅ Dynamic plugins exported, copied to $(DIST_DIR), and checked."