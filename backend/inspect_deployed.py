import urllib.request
import re

url = "https://ai-identity-guardian-app.onrender.com"
html = urllib.request.urlopen(url, timeout=15).read().decode("utf-8")
print("HTML length:", len(html))

scripts = re.findall(r'src=["\']([^"\']+)["\']', html)
print("Scripts found:", scripts)

for s in scripts:
    js_url = url + (s if s.startswith("/") else "/" + s)
    js = urllib.request.urlopen(js_url, timeout=15).read().decode("utf-8")
    print(f"\n--- Checking {s} (size: {len(js)}) ---")
    for term in ["custom_api_url", "ai-identity-guardian-api", "localhost", "/api/v1", "checkHealth", "health"]:
        count = js.count(term)
        print(f"  '{term}': {count} matches")
        if count > 0:
            idx = js.find(term)
            print(f"    first snippet: {js[max(0, idx-50):min(len(js), idx+100)]}")
