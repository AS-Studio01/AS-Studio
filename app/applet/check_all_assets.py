import os
import re

files = []
for root, dirs, filenames in os.walk('.'):
    if any(p in root for p in ['node_modules', '.git', 'dist']):
        continue
    for f in filenames:
        if f.endswith(('.html', '.css', '.js', '.json', '.xml')):
            files.append(os.path.join(root, f))

pattern = re.compile(r'([^\s"\'()<>]*(?:assets/)[^\s"\'()<>]*)')

issues = []

for file_path in files:
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    matches = pattern.findall(content)
    for m in matches:
        clean_m = m.strip('"\'')
        clean_m = clean_m.split('?')[0].split('#')[0].rstrip(');,')
        if clean_m.startswith('http://') or clean_m.startswith('https://'):
            path_part = clean_m.split('assets/', 1)[1]
            disk_path = os.path.join('assets', path_part)
        elif clean_m.startswith('/'):
            disk_path = clean_m.lstrip('/')
        else:
            dir_name = os.path.dirname(file_path)
            disk_path = os.path.normpath(os.path.join(dir_name, clean_m))

        if not os.path.exists(disk_path):
            issues.append((file_path, m, disk_path))

print(f'Total issues found: {len(issues)}')
for f, m, d in issues:
    print(f'{f}: {m} -> not found at {d}')
