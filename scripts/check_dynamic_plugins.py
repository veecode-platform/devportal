import os
import sys
import yaml
import subprocess
import hashlib
import json
import tarfile
import shutil

# --- Constants ---
DYNAMIC_PLUGINS_FILE = "dynamic-plugins.default.yaml"
WRAPPERS_DIR = "dynamic-plugins/wrappers"
PLUGINS_ROOT = "dynamic-plugins-root"
TMP_DIR = "tmp/plugin-downloads"
CONFIG_OUTPUT = os.path.join(PLUGINS_ROOT, "app-config.dynamic-plugins.yaml")
MAX_ENTRY_SIZE = 20_000_000  # 20MB

# --- Utility and Logging Functions ---
def print_header(title, success=False):
    """Prints a formatted header to the console."""
    char = "✅" if success else "🚀"
    print(f"\n{'='*80}\n{char} {title}\n{'='*80}\n")

def normalize_plugin_key(name: str) -> str:
    """Normalizes the package name to be used as a directory-safe key."""
    return name.replace("@", "").replace("/", "-").replace(".", "-")

def hash_string(text: str) -> str:
    """Generates a SHA256 hash for a given text."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def run_command(command: list, cwd: str = None, check: bool = True):
    """Runs a shell command and streams its output in real-time."""
    print(f"🔩 Executing: {' '.join(command)}{f' in {cwd}' if cwd else ''}")
    try:
        # Stream output directly to the user's terminal
        process = subprocess.run(
            command, cwd=cwd, check=check, text=True,
            stdout=sys.stdout, stderr=sys.stderr
        )
        return process
    except subprocess.CalledProcessError as e:
        # The error output is already on the screen
        print(f"\n❌ ERROR: Command failed with exit code {e.returncode}.", file=sys.stderr)
        raise

# --- Plugin Handling Functions ---
def build_embedded_plugins():
    """Installs dependencies and builds the local dynamic plugins."""
    print_header("Building Embedded Plugins")
    run_command(["yarn", "install"], cwd="dynamic-plugins")
    run_command(["yarn", "build"], cwd="dynamic-plugins")
    print_header("Embedded Plugins Build Complete", success=True)

def get_plugin_wrapper_map() -> dict:
    """Creates a map of 'normalized-plugin-name' -> 'path/to/wrapper'."""
    wrapper_map = {}
    print_header("Mapping Local Plugin Wrappers")
    if not os.path.exists(WRAPPERS_DIR):
        print(f"    ⚠️  Wrappers directory '{WRAPPERS_DIR}' not found. Skipping.")
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
                print(f"    ✔️  Mapped plugin '{key}' to wrapper '{wrapper_path}'")
    
    if not wrapper_map:
        print("    ⚠️ No valid plugins found in wrappers.")
    print_header("Wrapper Mapping Complete", success=True)
    return wrapper_map

def copy_embedded_plugin(wrapper_path: str, dest_path: str):
    """Copies the package.json and the dist-* content to the destination."""
    print(f"    -> Copying plugin from '{wrapper_path}'...")
    os.makedirs(dest_path, exist_ok=True)
    
    shutil.copy2(os.path.join(wrapper_path, "package.json"), dest_path)
    
    found_dist = False
    for dist_type in ["dist-scalprum", "dist-dynamic"]:
        dist_path = os.path.join(wrapper_path, dist_type)
        if os.path.exists(dist_path):
            shutil.copytree(dist_path, dest_path, dirs_exist_ok=True)
            found_dist = True
            print(f"    ✔️ Content from '{dist_type}' copied to '{dest_path}'")
            break
    
    if not found_dist:
        print(f"    ⚠️ No 'dist-scalprum' or 'dist-dynamic' folder found in '{wrapper_path}'")

def extract_plugin_from_tar(tar_file_path: str, plugin_folder_in_tar: str, dest_root: str):
    """Extracts a specific folder from a tarball to the destination."""
    with tarfile.open(tar_file_path, "r:gz") as tar:
        members_to_extract = [m for m in tar.getmembers() if m.name.startswith(plugin_folder_in_tar)]
        if not members_to_extract:
            raise FileNotFoundError(f"Folder '{plugin_folder_in_tar}' not found inside '{tar_file_path}'")
        
        tar.extractall(path=dest_root, members=members_to_extract)

def process_oci_plugin(package: str, plugin_output_path: str):
    """Downloads and extracts a plugin from an OCI registry."""
    print(f"    -> Processing OCI plugin: {package}")
    
    image, plugin_folder_in_tar = package.split("!")
    temp_download_dir = os.path.join(TMP_DIR, hash_string(package))
    
    print(f"    -> Downloading image layers to '{temp_download_dir}'...")
    run_command(["skopeo", "copy", image.replace("oci://", "docker://"), f"dir:{temp_download_dir}"])
    
    manifest_file = os.path.join(temp_download_dir, "manifest.json")
    with open(manifest_file, 'r') as f:
        manifest = json.load(f)
    layer_digest = manifest["layers"][0]["digest"].split(":")[1]
    layer_tarball = os.path.join(temp_download_dir, layer_digest)

    print(f"    -> Extracting '{plugin_folder_in_tar}' from layer to '{PLUGINS_ROOT}'...")
    if os.path.exists(plugin_output_path):
        shutil.rmtree(plugin_output_path)
    
    # We extract to the root, as the tarball already contains the full path
    extract_plugin_from_tar(layer_tarball, plugin_folder_in_tar, PLUGINS_ROOT)

    shutil.rmtree(temp_download_dir)
    print(f"    ✔️ OCI plugin extracted successfully.")


# --- Main Orchestration Function ---
def main():
    if "--skip-build" not in sys.argv:
        build_embedded_plugins()
    else:
        print_header("Skipping build of embedded plugins (--skip-build)")

    plugin_wrapper_map = get_plugin_wrapper_map()
    
    try:
        with open(DYNAMIC_PLUGINS_FILE, 'r') as f:
            content = yaml.safe_load(f)
    except FileNotFoundError:
        print(f"🚨 ERRO FATAL: Arquivo '{DYNAMIC_PLUGINS_FILE}' não encontrado.", file=sys.stderr)
        sys.exit(1)

    plugins = content.get("plugins", [])
    os.makedirs(PLUGINS_ROOT, exist_ok=True)
    
    final_config = {"dynamicPlugins": {"rootDirectory": PLUGINS_ROOT, "frontend": {}}}
    
    print_header(f"Processing {len(plugins)} plugins from '{DYNAMIC_PLUGINS_FILE}'")

    for plugin in plugins:
        package = plugin.get("package")
        if not package: continue

        plugin_key_raw = os.path.basename(package.split("!")[-1])
        plugin_key = normalize_plugin_key(plugin_key_raw)
        plugin_output_path = os.path.join(PLUGINS_ROOT, plugin_key)
        
        print(f"\n--- Analyzing plugin: {plugin_key} ---")

        if plugin.get("disabled", False):
            if os.path.exists(plugin_output_path):
                print(f"    🗑️  Plugin is disabled. Removing from '{plugin_output_path}'...")
                shutil.rmtree(plugin_output_path)
            else:
                print(f"    ⏩ Plugin is disabled. Nothing to do.")
            continue
        
        print("    🟢 Plugin is enabled. Processing...")
        if package.startswith("oci://"):
            process_oci_plugin(package, plugin_output_path)
        elif package.startswith("./dynamic-plugins/dist/"):
            source_wrapper_path = plugin_wrapper_map.get(plugin_key)
            if not source_wrapper_path:
                raise FileNotFoundError(f"❌ Embedded plugin '{plugin_key}' not found in wrapper map. Check build output and names.")
            copy_embedded_plugin(source_wrapper_path, plugin_output_path)
        else:
            print(f"    ⚠️  Unknown package format, skipping: {package}")

        if "pluginConfig" in plugin:
            # Use o nome do pacote como está no YAML para a chave do frontend
            config_key = plugin_key_raw
            print(f"    -> Found 'pluginConfig'. Adding to frontend config under key '{config_key}'...")
            final_config["dynamicPlugins"]["frontend"][config_key] = plugin["pluginConfig"]

    with open(CONFIG_OUTPUT, "w") as f:
        yaml.safe_dump(final_config, f, default_flow_style=False, sort_keys=False, indent=2)
        
    print_header("All dynamic plugins processed successfully", success=True)
    print(f"📄 Configuration file generated at: {CONFIG_OUTPUT}")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n🚨 FATAL ERROR: {e}", file=sys.stderr)
        sys.exit(1)