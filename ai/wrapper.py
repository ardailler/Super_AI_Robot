from gym_minigrid.wrappers import ActionBonus, StateBonus
import numpy as np
import gym
from gym.spaces import Discrete
from collections import deque


class DistanceToObs(gym.core.ObservationWrapper):

    def __init__(self, env):
        super().__init__(env)
        self.observation_space = Discrete(2)
        self.action_space = Discrete(3)

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

            count += 1
            fwd_cell = self.grid.get(*fwd_pos)

        new_obs.append(count)
        new_obs.append(obs['direction'])
        return np.array(new_obs)


class NegRewardWall(gym.Wrapper):
    def __init__(self, env):
        """Stack k last frames."""
        gym.Wrapper.__init__(self, env)

    def step(self, action):
        ob, reward, done, info = self.env.step(action)
        if ob[1] == 0:
            reward = -1
        return ob, reward, done, info


class Stack(gym.Wrapper):
    def __init__(self, env, k):
        """Stack k last frames."""
        gym.Wrapper.__init__(self, env)
        self.k = k
        self.states = deque([], maxlen=k)
        shp = self.observation_space.n
        self.observation_space = (shp, k)

    def reset(self):
        ob = self.env.reset()
        for _ in range(self.k):
            self.states.append(ob)
        return self._get_ob()

    def step(self, action):
        ob, reward, done, info = self.env.step(action)
        self.states.append(ob)
        return self._get_ob(), reward, done, info

    def _get_ob(self):
        assert len(self.states) == self.k
        return np.array(self.states)


def make_env(env):
    env = gym.make(env)
    env = ActionBonus(env)
    env = StateBonus(env)
    env = DistanceToObs(env)
    env = NegRewardWall(env)
    # env = Stack(env, k=8)
    return env
