#!/bin/bash

# Script to update all IF nodes from typeVersion 2 to 2.2

echo "Updating IF nodes from typeVersion 2 to 2.2..."

# Find all JSON files with IF nodes
files_with_if=$(grep -l "n8n-nodes-base.if" test-workflows/*/*/*json)

updated_count=0
for file in $files_with_if; do
    echo "Processing: $file"
    
    # Check if file has IF nodes with typeVersion 2
    if grep -q "\"type\": \"n8n-nodes-base.if\"" "$file" && grep -q "\"typeVersion\": 2," "$file"; then
        # Create a temporary file for sed processing
        temp_file=$(mktemp)
        
        # Use sed to update typeVersion 2 to 2.2 ONLY for lines that are part of IF nodes
        # This is a bit complex, so we'll use a more careful approach
        awk '
        /\"type\": \"n8n-nodes-base.if\"/ { in_if_node = 1 }
        /\"typeVersion\": 2,/ && in_if_node { 
            gsub(/\"typeVersion\": 2,/, "\"typeVersion\": 2.2,")
            in_if_node = 0
        }
        /^\s*}/ && in_if_node { in_if_node = 0 }
        { print }
        ' "$file" > "$temp_file"
        
        # Check if changes were made
        if ! cmp -s "$file" "$temp_file"; then
            cp "$temp_file" "$file"
            echo "  ✓ Updated IF nodes in $file"
            ((updated_count++))
        else
            echo "  - No IF nodes with typeVersion 2 found in $file"
        fi
        
        rm "$temp_file"
    else
        echo "  - No IF nodes with typeVersion 2 in $file"
    fi
done

echo "Completed! Updated $updated_count files."