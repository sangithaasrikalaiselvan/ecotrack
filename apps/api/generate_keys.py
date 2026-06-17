import os
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
import re

private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
private_pem = private_key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.TraditionalOpenSSL,
    encryption_algorithm=serialization.NoEncryption()
).decode('utf-8')

public_key = private_key.public_key()
public_pem = public_key.public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
).decode('utf-8')

with open('.env', 'r') as f:
    content = f.read()

# pydantic-settings handles quoted strings with \n
priv_escaped = private_pem.replace('\n', '\\n')
pub_escaped = public_pem.replace('\n', '\\n')

content = re.sub(r'^JWT_PRIVATE_KEY=.*', f'JWT_PRIVATE_KEY="{priv_escaped}"', content, flags=re.MULTILINE)
content = re.sub(r'^JWT_PUBLIC_KEY=.*', f'JWT_PUBLIC_KEY="{pub_escaped}"', content, flags=re.MULTILINE)

with open('.env', 'w') as f:
    f.write(content)
