import numpy as np
import gym
import gym_minigrid
from gym.spaces import Discrete
from collections import deque


def reward_exploration(x):
    return -0.01928963 + (1.00859 - -0.01928963)/(1 + (x/3.377371)**3.757612)


class StateBonus(gym.core.Wrapper):
    """
    Adds an exploration bonus based on which positions
    are visited on the grid.
    """

    def __init__(self, env):
        super().__init__(env)
        self.counts = {}

    def step(self, action):
        obs, reward, done, info = self.env.step(action)

        # Tuple based on which we index the counts
        # We use the position after an update
        env = self.unwrapped
        tup = (tuple(env.agent_pos))

        # Get the count for this key
        pre_count = 0
        if tup in self.counts:
            pre_count = self.counts[tup]

        # Update the count for this key
        new_count = pre_count + 1
        self.counts[tup] = new_count

        bonus = reward_exploration(new_count)
        reward += bonus

        for x in self.counts:
            if x != tup and self.counts[x] > 0:
                self.counts[x] -= 0.005

        return obs, reward, done, info

    def reset(self, **kwargs):
        self.counts.clear()
        return self.env.reset(**kwargs)


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

            count += 1
            fwd_cell = self.grid.get(*fwd_pos)

        new_obs.append(count)
        new_obs.append(obs['direction'])
        return np.array(new_obs)


class Stack(gym.Wrapper):
    def __init__(self, env, k):
        """Stack k last frames."""
        gym.Wrapper.__init__(self, env)
        self.k = k
        self.states = deque([], maxlen=k)
        shp = self.observation_space.n
        self.observation_space = (k, shp)

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
    env = StateBonus(env)
    env = DistanceToObs(env)
    env = Stack(env, k=8)
    return env
