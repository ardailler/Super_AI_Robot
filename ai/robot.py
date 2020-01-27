import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import math
import time
from tqdm import tqdm
from collections import deque
from random import sample
from wrapper import make_env


class Memory():

    def __init__(self, capacity):
        self.memory = deque(maxlen=capacity)

    def push(self, state, action, next_state, reward, done):
        self.memory.append((state.flatten(),
                            action,
                            reward,
                            next_state.flatten(),
                            done))

    """
    Return a random sample from self.memory of len = number
    """

    def sample(self, number):
        batch = sample(self.memory, number)

        # Unwrap the batch to get the variables
        state, action, next_state, reward, done = zip(*batch)

        return (np.array(state, dtype=np.float32),
                np.array(action),
                np.array(reward, dtype=np.float32),
                np.array(next_state, dtype=np.float32),
                np.array(done, dtype=np.uint8))


class Dense_NN(nn.Module):

    def __init__(self, in_dim, out_dim):
        super(Dense_NN, self).__init__()

        in_d = in_dim[0] * in_dim[1]
        self.fc1 = nn.Linear(in_d, 16)
        self.fc2 = nn.Linear(16, 32)
        self.fc3 = nn.Linear(32, out_dim)

    def forward(self, x):
        x = self.fc1(x)
        x = F.relu(x)
        x = self.fc2(x)
        x = F.relu(x)
        return self.fc3(x)


class DQN():

    def __init__(self,
                 env,
                 config,
                 train):

        # Class name
        class_name = type(self).__name__.lower()

        # Gym environnement
        self.env = make_env(env)

        # Are we in evaluation mode
        self._train = train

        if train:
            # Parameters
            self.gamma = config.gamma
            self.bath_size = config.batch_size
            self.step_target_update = config.target_update
            self.freq_learning = config.freq_learning
            self.epsilon_decay = config.epsilon_decay
            self.epsilon_start = config.epsilon_start
            self.epsilon_end = config.epsilon_end
            self.num_steps = config.num_steps
            self.start_learning = config.start_learning

            # Experience-Replay
            self.memory = Memory(config.memory_capacity)

        # List to save the rewards
        self.plot_reward = []
        self.plot_eval = []

        # Architecture of the neural networks
        self.model = None

        # Error function
        self.__loss_fn = torch.nn.SmoothL1Loss(reduction='mean')

        # Architecture of the neural networks
        self.model = Dense_NN(self.env.observation_space,
                              self.env.action_space.n)
        if train:
            self.qtarget = Dense_NN(
                self.env.observation_space, self.env.action_space.n)

        # Backpropagation function
        self.__optimizer = torch.optim.Adam(
            self.model.parameters(), lr=config.learning_rate)

        # Make the model using the GPU if available
        if torch.cuda.is_available():
            self.device = torch.device('cuda')
            self.model.cuda()
            if train:
                self.qtarget.cuda()
        else:
            self.device = torch.device('cpu')

        # Path for the saves
        self.path_log = class_name + '.txt'
        self.path_save = class_name
        self.path_fig = class_name

    """
    Get the action for the qvalue given a state
    """

    def get_policy(self, state):
        with torch.no_grad():
            state = torch.from_numpy(state).float() \
                .to(self.device)
            state = state.flatten()
            return self.model(state).argmax().item()

    """
    Compute the probabilty of exploration during the training
    using a e-greedy method with a decay.
    """

    def act(self, state, step):
        # Compute the exploration rate
        eps_threshold = self.epsilon_end + \
            (self.epsilon_start - self.epsilon_end) * \
            math.exp(-1. * step / self.epsilon_decay)

        # Choice between exploration or intensification
        if np.random.rand() < eps_threshold:
            return self.env.action_space.sample(), eps_threshold
        else:
            return self.get_policy(state), eps_threshold

    """
    Train the model.
    """

    def learn(self):
        # Get a random batch from the memory
        state, action, next_state, rewards, done = self.memory.sample(
            self.bath_size)

        state = torch.from_numpy(state).to(self.device)
        action = torch.from_numpy(action).to(self.device).long().unsqueeze(-1)
        next_state = torch.from_numpy(next_state).to(self.device)
        rewards = torch.from_numpy(rewards).to(self.device)
        done = torch.from_numpy(done).to(self.device)

        # Q values predicted by the model
        pred = self.model(state).gather(1, action).squeeze()

        with torch.no_grad():
            action_by_qvalue = self.model(
                next_state).argmax(1).long().unsqueeze(-1)
            max_qtarget = self.qtarget(next_state).gather(
                1, action_by_qvalue).squeeze()

            y = rewards + (1. - done) * self.gamma * max_qtarget

        loss = self.__loss_fn(y, pred)

        # backpropagation of loss to NN
        self.__optimizer.zero_grad()
        loss.backward()
        for param in self.model.parameters():
            param.grad.data.clamp_(-1, 1)
        self.__optimizer.step()

    """
    Save the model.
    """

    def save_model(self, final=False):
        if final:
            path = self.path_save + '-final.pt'
        else:
            path = self.path_save + '.pt'

        torch.save(self.model.state_dict(), path)

    """
    Write logs into a file
    """

    def log(self, string):
        with open(self.path_log, "a") as f:
            f.write(string + "\n")

    """
    Run n episode to train the model.
    """

    def train(self, display):
        step, episode, best = 0, 0, 0
        pbar = tqdm(total=self.num_steps)

        while step <= self.num_steps:
            episode_reward = 0.0
            done = False
            state = self.env.reset()
            start_time = time.time()
            episode += 1

            # Run one episode until termination
            while not done:
                if display:
                    self.env.render()

                # Select one action
                action, eps = self.act(state, step)

                # Get the output of env from this action
                next_state, reward, done, _ = self.env.step(action)

                # Push the output to the memory
                self.memory.push(state, action, next_state, reward, done)

                # Learn
                if step >= self.start_learning:
                    if not step % self.freq_learning:
                        self.learn()

                    # Clone the q-values model to the q-targets model
                    if not step % self.step_target_update:
                        self.qtarget.load_state_dict(self.model.state_dict())

                step += 1
                pbar.update()
                episode_reward += reward
                state = next_state

            end_time = round(time.time() - start_time, 4)

            if not episode % 20:
                mean_reward = sum(self.plot_reward[-20:]) / 20
                max_reward = max(self.plot_reward[-20:])
                if max_reward > best:
                    self.log('Saving model, best reward :{}'.format(
                        max_reward
                    ))
                    self.save_model()
                    best = max_reward
                self.log('Episode {} -- step:{} -- avg_reward:{} -- '
                         'best_reward:{} -- eps:{} -- time:{}'.format(
                             episode,
                             step,
                             mean_reward,
                             max_reward,
                             round(eps, 3),
                             end_time))

            if not episode % 5:
                self.plot_reward.append(episode_reward)

        pbar.close()
        self.env.close()
        self.save_model(final=True)

    """
    Eval a trained model for n episodes.
    """

    def test(self, num_episodes=20, display=False, model_path=None):

        if not self._train:
            if model_path is None:
                raise ValueError('No path model given.')
            self.model.load_state_dict(torch.load(model_path))

        self.model.eval()
        self.plot_reward.clear()

        for episode in range(1, num_episodes + 1):
            # Run one episode until termination
            episode_reward = 0
            test = 0
            done = False
            state = self.env.reset()

            for _ in range(np.random.randint(10)):
                state, _, done, _ = self.env.step(0)
                if done:
                    state = self.env.reset()

            while not done:
                if display:
                    self.env.render()

                action = self.get_policy(state)

                # Get the output of env from this action
                state, reward, done, _ = self.env.step(action)

                episode_reward += reward

            print('Episode {} -- reward:{}'.format(
                episode,
                episode_reward,
                test))
            self.plot_reward.append(episode_reward)

        self.env.close()
