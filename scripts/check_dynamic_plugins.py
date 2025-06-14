import os
import sys
import yaml
import subprocess
import hashlib
import json
import tarfile
import shutil

# --- Constantes ---
DYNAMIC_PLUGINS_FILE = "dynamic-plugins.default.yaml"
WRAPPERS_DIR = "dynamic-plugins/wrappers"
PLUGINS_ROOT = "dynamic-plugins-root"
CONFIG_OUTPUT = os.path.join(PLUGINS_ROOT, "app-config.dynamic-plugins.yaml")

# --- Funções de Utilidade e Logging ---
def print_header(title, success=False):
    char = "✅" if success else "🚀"
    print(f"\n{'='*80}\n{char} {title}\n{'='*80}\n")

def normalize_plugin_key(name: str) -> str:
    return name.replace("@", "").replace("/", "-").replace(".", "-")

def run_command(command: list, cwd: str = None):
    print(f"🔩 Executando: {' '.join(command)}{f' em {cwd}' if cwd else ''}")
    try:
        process = subprocess.run(
            command, cwd=cwd, check=True, text=True,
            stdout=sys.stdout, stderr=sys.stderr
        )
        return process
    except subprocess.CalledProcessError as e:
        print(f"\n❌ ERRO ao executar comando: {' '.join(e.cmd)}", file=sys.stderr)
        raise

# --- Funções de Manipulação de Plugins ---
def build_embedded_plugins():
    print_header("Iniciando Build dos Plugins Embutidos")
    run_command(["yarn", "install"], cwd="dynamic-plugins")
    run_command(["yarn", "build"], cwd="dynamic-plugins")
    print_header("Build dos Plugins Embutidos Concluído", success=True)

def get_plugin_wrapper_map() -> dict:
    """Cria um mapa de 'nome-normalizado' -> 'caminho/para/o/wrapper'."""
    wrapper_map = {}
    print_header("Mapeando Wrappers de Plugins Locais")
    if not os.path.exists(WRAPPERS_DIR):
        print(f"⚠️  Diretório de wrappers '{WRAPPERS_DIR}' não encontrado.")
        return wrapper_map

    for wrapper_name in os.listdir(WRAPPERS_DIR):
        wrapper_path = os.path.join(WRAPPERS_DIR, wrapper_name)
        if not os.path.isdir(wrapper_path):
            continue
        
        pkg_path = os.path.join(wrapper_path, "package.json")
        if os.path.exists(pkg_path):
            with open(pkg_path, 'r') as f:
                pkg = json.load(f)
            
            name = pkg.get("scalprum", {}).get("name") or pkg.get("name")
            if name:
                key = normalize_plugin_key(name)
                wrapper_map[key] = wrapper_path
                print(f"    ✔️  Mapeado plugin '{key}' para wrapper '{wrapper_path}'")
    
    if not wrapper_map:
        print("    ⚠️ Nenhum plugin encontrado nos wrappers.")
    print_header("Mapeamento Concluído", success=True)
    return wrapper_map

def copy_embedded_plugin(wrapper_path: str, dest_path: str):
    """Copia o package.json e o conteúdo de dist-* para o destino."""
    print(f"    -> Copiando plugin de '{wrapper_path}'...")
    os.makedirs(dest_path, exist_ok=True)
    
    # Copia o package.json da raiz do wrapper
    shutil.copy2(os.path.join(wrapper_path, "package.json"), dest_path)
    
    # Encontra e copia o conteúdo de dist-scalprum ou dist-dynamic
    found_dist = False
    for dist_type in ["dist-scalprum", "dist-dynamic"]:
        dist_path = os.path.join(wrapper_path, dist_type)
        if os.path.exists(dist_path):
            shutil.copytree(dist_path, dest_path, dirs_exist_ok=True)
            found_dist = True
            print(f"    ✔️ Conteúdo de '{dist_type}' copiado para '{dest_path}'")
            break
    
    if not found_dist:
        print(f"    ⚠️ Nenhuma pasta 'dist-scalprum' ou 'dist-dynamic' encontrada em '{wrapper_path}'")

# --- Função Principal ---
def main():
    if "--skip-build" not in sys.argv:
        build_embedded_plugins()
    else:
        print_header("Ignorando build dos plugins embutidos (--skip-build)")

    plugin_wrapper_map = get_plugin_wrapper_map()
    
    with open(DYNAMIC_PLUGINS_FILE, 'r') as f:
        content = yaml.safe_load(f)

    plugins = content.get("plugins", [])
    os.makedirs(PLUGINS_ROOT, exist_ok=True)
    
    final_config = {"dynamicPlugins": {"rootDirectory": PLUGINS_ROOT, "frontend": {}}}
    
    print_header(f"Processando {len(plugins)} plugins de '{DYNAMIC_PLUGINS_FILE}'")

    for plugin in plugins:
        package = plugin.get("package")
        if not package: continue

        disabled = plugin.get("disabled", False)
        
        plugin_key_raw = os.path.basename(package.split("!")[-1])
        plugin_key = normalize_plugin_key(plugin_key_raw)
        plugin_output_path = os.path.join(PLUGINS_ROOT, plugin_key)
        
        print(f"\n--- Analisando plugin: {plugin_key} ---")

        if disabled:
            if os.path.exists(plugin_output_path):
                print(f"    🗑️  Plugin desabilitado. Removendo de '{plugin_output_path}'...")
                shutil.rmtree(plugin_output_path)
            else:
                print(f"    ⏩ Plugin desabilitado. Nada a fazer.")
            continue
        
        print("    🟢 Plugin habilitado. Verificando tipo...")
        if package.startswith("oci://"):
            # Lógica OCI continua igual (aqui ela está simplificada, use a sua completa)
            print(f"    -> Processando OCI: {package}")
            pass 
        elif package.startswith("./dynamic-plugins/dist/"):
            source_wrapper_path = plugin_wrapper_map.get(plugin_key)
            if not source_wrapper_path:
                raise FileNotFoundError(f"❌ Plugin embutido '{plugin_key}' não encontrado no mapa de wrappers. Verifique o build e os nomes.")
            
            copy_embedded_plugin(source_wrapper_path, plugin_output_path)
        else:
            print(f"    ⚠️  Formato de pacote desconhecido, pulando: {package}")

        if "pluginConfig" in plugin:
            print(f"    -> Adicionando 'pluginConfig' para '{plugin_key_raw}'")
            # Usa a chave original do YAML para o frontend
            config_key = os.path.basename(package) 
            final_config["dynamicPlugins"]["frontend"][config_key] = plugin["pluginConfig"]

    with open(CONFIG_OUTPUT, "w") as f:
        yaml.safe_dump(final_config, f, default_flow_style=False, sort_keys=False, indent=2)
        
    print_header("Processamento de plugins dinâmicos concluído", success=True)
    print(f"📄 Arquivo de configuração gerado em: {CONFIG_OUTPUT}")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n🚨 ERRO FATAL: {e}", file=sys.stderr)
        sys.exit(1)