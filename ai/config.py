
# Hyperparameters used for the training DQN
# memory_capacity = 600000
# num_steps       = 50e6
# batch_size      = 32
# target_update   = 10000
# start_learning  = 50000
# freq_learning   = 4
# learning_rate   = 0.00001
# gamma           = 0.99
# epsilon_decay   = 1000000
# epsilon_start   = 1
# epsilon_end     = 0.01


class Config():

    def __init__(self,
                 memory_capacity=100000,
                 num_steps=500000,
                 batch_size=64,
                 target_update=1000,
                 start_learning=20000,
                 freq_learning=1,
                 learning_rate=0.001,
                 gamma=0.99,
                 epsilon_decay=30000,
                 epsilon_start=1,
                 epsilon_end=0.1):

        self.memory_capacity = memory_capacity
        self.num_steps = num_steps
        self.batch_size = batch_size
        self.target_update = target_update
        self.start_learning = start_learning
        self.freq_learning = freq_learning
        self.learning_rate = learning_rate
        self.gamma = gamma
        self.epsilon_decay = epsilon_decay
        self.epsilon_start = epsilon_start
        self.epsilon_end = epsilon_end
