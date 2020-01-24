import sys
import json
results = {
    'test': 1,
    'test2': [1,2,3,4,5]
}
print(json.dumps(results, ensure_ascii=False))
sys.stdout.flush()
