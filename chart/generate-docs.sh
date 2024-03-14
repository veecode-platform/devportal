#!/bin/bash
script_path=$(dirname "$0")

#check if frigate is installed and install it if not
if ! command -v frigate &> /dev/null
then
    echo "frigate could not be found, installing it now"
    if command -v pip &> /dev/null
    then
        pip install frigate
    elif command -v pip3 &> /dev/null
    then
        pip3 install frigate
    else
        echo "pip or pip3 could not be found, please install it manually"
        exit 1
    fi
fi

cp ${script_path}/values.yaml ${script_path}/values-tmp.yaml

# Read the file line by line
while IFS= read -r line; do
  # Check if the line starts with '#' and contain a ':'
  if [[ "${line}" == "#"* && "${line}" = *":"* ]]; then
    # Remove the '#' character
    modified_line="${line:1}"
    echo "${modified_line}"
  else
    echo "${line}"
  fi
done < ${script_path}/values.yaml > ${script_path}/modified_values.yaml

# Overwrite the original file with the modified content
mv ${script_path}/modified_values.yaml ${script_path}/values.yaml

sed -i '/^ +:/!s/[{}]//g' ${script_path}/values.yaml

frigate gen ${script_path}/ --output-format markdown --no-credits > ${script_path}/README.md

mv ${script_path}/values-tmp.yaml ${script_path}/values.yaml
# rm ${script_path}/values-tmp.yaml