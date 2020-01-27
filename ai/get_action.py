import torch
import argparse
import copy
import np
import sys
import json

parser = argparse.ArgumentParser()
parser.add_argument('--state', default=[])
args = parser.parse_args()


model = torch.load('dqn.pt')
model.eval()
state = np.array(args.state)
state = torch.from_numpy(state).float()
            state = state.flatten()
action = model(state).argmax().item()

result = {'action': action}


print(json.dumps(results, ensure_ascii=False))
sys.stdout.flush()
