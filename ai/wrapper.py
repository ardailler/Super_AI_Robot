from gym_minigrid.wrappers import *
import numpy as np
import gym
from gym.spaces import Discrete


class DistanceToObs(gym.core.ObservationWrapper):

    def __init__(self, env):
        super().__init__(env)
        self.observation_space = Discrete(2)

    def observation(self, obs):
        new_obs = []
        count = 0

        fwd_pos = self.front_pos
        fwd_cell = self.grid.get(*fwd_pos)
        while fwd_cell is None:
            direction = obs['direction']
            if direction == 0:
                fwd_pos[0] += 1
                
            elif direction == 1:
                fwd_pos[1] += 1

            elif direction == 2:
                fwd_pos[0] -= 1

            elif direction == 3:
                fwd_pos[1] -= 1

            count +=1 
            fwd_cell = self.grid.get(*fwd_pos)

        new_obs.append(count)
        new_obs.append(obs['direction'])
        return np.array(new_obs)


def make_env(env):
    env = gym.make(env)
    env = ActionBonus(env)
    env = DistanceToObs(env)
    return env

