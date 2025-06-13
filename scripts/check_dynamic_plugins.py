import os
import yaml
import subprocess
import hashlib
import json
import tarfile
import shutil

DYNAMIC_PLUGINS_FILE = "dynamic-plugins.default.yaml"
PLUGINS_ROOT = "dynamic-plugins-root"
CONFIG_OUTPUT = os.path.join(PLUGINS_ROOT, "app-config.dynamic-plugins.yaml")
MAX_ENTRY_SIZE = 20_000_000  # 20MB


def run_skopeo_copy(image, dest_dir):
    image_url = image.replace("oci://", "docker://")
    subprocess.run(["skopeo", "copy", image_url, f"dir:{dest_dir}"], check=True)


def extract_plugin_layer(manifest_file, image_dir, plugin_path, dest):
    with open(manifest_file) as f:
        manifest = json.load(f)
    layer = manifest["layers"][0]["digest"].split(":")[1]
    tar_file = os.path.join(image_dir, layer)

    with tarfile.open(tar_file, "r:gz") as tar:
        members = [m for m in tar.getmembers() if m.name.startswith(plugin_path)]
        for m in members:
            if m.size > MAX_ENTRY_SIZE:
                raise Exception(f"Zip bomb protection: {m.name}")
        tar.extractall(dest, members)


def hash_plugin(package):
    return hashlib.sha256(package.encode("utf-8")).hexdigest()


def get_digest(image):
    image_url = image.replace("oci://", "docker://")
    result = subprocess.run(["skopeo", "inspect", image_url], check=True, capture_output=True)
    digest = json.loads(result.stdout)["Digest"].split(":")[1]
    return digest


def copy_embedded_plugin(local_path, plugin_output):
    if os.path.exists(plugin_output):
        shutil.rmtree(plugin_output)
    shutil.copytree(local_path, plugin_output)


def build_embedded_plugins():
    subprocess.run(["yarn", "--cwd", "dynamic-plugins", "install"], check=True)
    subprocess.run(["yarn", "--cwd", "dynamic-plugins", "build"], check=True)


def main():
    os.makedirs(PLUGINS_ROOT, exist_ok=True)

    build_embedded_plugins()

    with open(DYNAMIC_PLUGINS_FILE) as f:
        content = yaml.safe_load(f)

    plugins = content.get("plugins", [])
    output_config = {"dynamicPlugins": {"rootDirectory": PLUGINS_ROOT}}

    for plugin in plugins:
        package = plugin["package"]
        disabled = plugin.get("disabled", False)

        if package.startswith("oci://"):
            _, plugin_path = package.split("!")
        elif package.startswith("./dynamic-plugins/dist/"):
            plugin_path = os.path.basename(package)
        else:
            print(f"⚠️  Ignoring plugin with unknown package: {package}")
            continue

        plugin_output = os.path.join(PLUGINS_ROOT, plugin_path)

        if disabled:
            if os.path.exists(plugin_output):
                print(f"🗑️  Removing disabled plugin: {plugin_path}")
                shutil.rmtree(plugin_output)
            continue

        # plugin habilitado
        if package.startswith("oci://"):
            print(f"📦 Plugin OCI: {package}")
            image, plugin_path = package.split("!")
            plugin_output = os.path.join(PLUGINS_ROOT, plugin_path)
            tmp_dir = os.path.join("tmp", hashlib.sha256(package.encode()).hexdigest())
            os.makedirs(tmp_dir, exist_ok=True)
            run_skopeo_copy(image, tmp_dir)

            manifest_file = os.path.join(tmp_dir, "manifest.json")
            if os.path.exists(plugin_output):
                shutil.rmtree(plugin_output)
            os.makedirs(plugin_output, exist_ok=True)
            extract_plugin_layer(manifest_file, tmp_dir, plugin_path, PLUGINS_ROOT)

            plugin_hash = hash_plugin(package)
            with open(os.path.join(plugin_output, "dynamic-plugin-config.hash"), "w") as f:
                f.write(plugin_hash)

            digest = get_digest(image)
            with open(os.path.join(plugin_output, "dynamic-plugin-image.hash"), "w") as f:
                f.write(digest)

        elif package.startswith("./dynamic-plugins/dist/"):
            print(f"📦 Local embedded plugin: {package}")
            local_path = package.replace("./", "")
            copy_embedded_plugin(local_path, plugin_output)

    with open(CONFIG_OUTPUT, "w") as f:
        yaml.safe_dump(output_config, f)

    print("✅ Dynamic plugins processed successfully.")


if __name__ == "__main__":
    main()
