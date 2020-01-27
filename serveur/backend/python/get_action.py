import torch
import torch.nn as nn
import torch.nn.functional as F
import argparse
import copy
import numpy as np
import sys
import json


class Dense_NN(nn.Module):

    def __init__(self, in_dim, out_dim):
        super(Dense_NN, self).__init__()

        self.fc1 = nn.Linear(in_dim, 16)
        self.fc2 = nn.Linear(16, 32)
        self.fc3 = nn.Linear(32, out_dim)

    def forward(self, x):
        x = self.fc1(x)
        x = F.relu(x)
        x = self.fc2(x)
        x = F.relu(x)
        return self.fc3(x)


parser = argparse.ArgumentParser()
parser.add_argument('--state', default=[])
args = parser.parse_args()


model = Dense_NN(16, 3)
model.load_state_dict(torch.load('dqn.pt', map_location=torch.device('cpu')))


model.eval()
state = np.array(args.state)
state = torch.from_numpy(state).float()
state = state.flatten()
action = model(state).argmax().item()

result = {'action': action}


print(json.dumps(result, ensure_ascii=False))
sys.stdout.flush()
