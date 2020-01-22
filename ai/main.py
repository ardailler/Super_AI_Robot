from config import Config
from dqn import DQN

agent = DQN("MiniGrid-Empty-16x16-v0", Config(), True)
agent.train(display=False)
