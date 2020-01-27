from config import Config
from robot import DQN

# agent = DQN("MiniGrid-FourRooms-v0", Config(), False)
agent = DQN("MiniGrid-Empty-8x8-v0", Config(), False)
agent.test(display=True, model_path='ai/dqn.pt')
