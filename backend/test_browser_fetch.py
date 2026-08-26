import urllib.request
import json
import ssl

ctx = ssl.create_default_context()

headers = {
    "Origin": "https://ai-identity-guardian-app.onrender.com",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site",
    "Sec-Fetch-Dest": "empty",
}

print("--- Testing GET /api/v1/health ---")
req = urllib.request.Request("https://ai-identity-guardian-api.onrender.com/api/v1/health", headers=headers)
try:
    with urllib.request.urlopen(req, context=ctx, timeout=15) as res:
        print("Status:", res.status)
        print("Headers:", dict(res.headers))
        body = res.read().decode("utf-8")
        print("Body:", body)
        data = json.loads(body)
        print("Parsed JSON:", data)
except Exception as e:
    print("Error:", e)

print("\n--- Testing POST /api/v1/analysis/username ---")
post_body = json.dumps({"username": "test_user_99"}).encode("utf-8")
headers_post = {
    **headers,
    "Content-Type": "application/json",
}
req_post = urllib.request.Request(
    "https://ai-identity-guardian-api.onrender.com/api/v1/analysis/username",
    data=post_body,
    headers=headers_post,
    method="POST"
)
try:
    with urllib.request.urlopen(req_post, context=ctx, timeout=15) as res:
        print("Status:", res.status)
        print("Headers:", dict(res.headers))
        body = res.read().decode("utf-8")
        print("Body:", body)
except Exception as e:
    print("Error:", e)
