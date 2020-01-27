from config import Config
from robot import DQN

agent = DQN("MiniGrid-Empty-8x8-v0", Config(), True)
agent.train(display=False)
