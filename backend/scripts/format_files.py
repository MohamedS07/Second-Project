import os
import re
from pathlib import Path
from html.parser import HTMLParser
from html import unescape

def format_css(css_content):
    """Basic CSS formatting"""
    # Remove extra whitespace
    css_content = re.sub(r'\s+', ' ', css_content)
    # Add newlines after braces
    css_content = re.sub(r'\{', ' {\n    ', css_content)
    css_content = re.sub(r'\}', '\n}\n\n', css_content)
    css_content = re.sub(r';', ';\n    ', css_content)
    # Clean up extra spaces
    css_content = re.sub(r'\n\s+\n', '\n', css_content)
    css_content = re.sub(r'\n{3,}', '\n\n', css_content)
    return css_content.strip() + '\n'

def format_html(html_content):
    """Basic HTML formatting with proper indentation"""
    lines = []
    indent_level = 0
    indent_str = '  '  # 2 spaces
    
    # Split by tags
    parts = re.split(r'(<[^>]+>)', html_content)
    
    for part in parts:
        part = part.strip()
        if not part:
            continue
            
        # Check if it's a tag
        if part.startswith('<'):
            # Closing tag
            if part.startswith('</'):
                indent_level = max(0, indent_level - 1)
                lines.append(indent_str * indent_level + part)
            # Self-closing or single tags
            elif part.endswith('/>') or re.match(r'<(br|hr|img|input|meta|link)', part, re.I):
                lines.append(indent_str * indent_level + part)
            # Opening tag
            else:
                lines.append(indent_str * indent_level + part)
                # Don't indent for inline tags
                if not re.match(r'<(span|a|strong|em|b|i|code)', part, re.I):
                    indent_level += 1
        else:
            # Text content
            if part:
                lines.append(indent_str * indent_level + part)
    
    return '\n'.join(lines) + '\n'

def format_file(file_path):
    """Format a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if file_path.suffix == '.css':
            formatted = format_css(content)
        elif file_path.suffix == '.html':
            formatted = format_html(content)
        else:
            return False
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(formatted)
        
        print(f"[OK] Formatted: {file_path.relative_to(Path.cwd())}")
        return True
    except Exception as e:
        print(f"[ERROR] Error formatting {file_path}: {e}")
        return False

def main():
    frontend_dir = Path(__file__).parent.parent.parent / 'frontend'
    
    # Find all HTML and CSS files
    html_files = list(frontend_dir.rglob('*.html'))
    css_files = list(frontend_dir.rglob('*.css'))
    
    all_files = html_files + css_files
    
    print(f"Found {len(html_files)} HTML files and {len(css_files)} CSS files")
    print("Formatting files...\n")
    
    success_count = 0
    for file_path in all_files:
        if format_file(file_path):
            success_count += 1
    
    print(f"\n[OK] Successfully formatted {success_count}/{len(all_files)} files")

if __name__ == '__main__':
    main()
