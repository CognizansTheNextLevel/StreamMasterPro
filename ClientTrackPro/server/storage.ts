import {
  User, InsertUser, PlatformConnection, InsertPlatformConnection,
  StreamStats, InsertStreamStats, Goal, InsertGoal,
  ScheduledStream, InsertScheduledStream, Automation, InsertAutomation,
  ChatMessage, InsertChatMessage, Follower, InsertFollower,
  Subscriber, InsertSubscriber, Competition, InsertCompetition,
  CompetitionEntry, InsertCompetitionEntry, Giveaway, InsertGiveaway
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Platform connections
  getPlatformConnections(userId: number): Promise<PlatformConnection[]>;
  createPlatformConnection(connection: InsertPlatformConnection): Promise<PlatformConnection>;
  updatePlatformConnection(id: number, data: Partial<InsertPlatformConnection>): Promise<PlatformConnection | undefined>;
  deletePlatformConnection(id: number): Promise<boolean>;
  
  // Stream stats
  getStreamStats(userId: number, limit?: number): Promise<StreamStats[]>;
  getStreamStatsById(id: number): Promise<StreamStats | undefined>;
  createStreamStats(stats: InsertStreamStats): Promise<StreamStats>;
  updateStreamStats(id: number, data: Partial<StreamStats>): Promise<StreamStats | undefined>;
  
  // Goals
  getGoals(userId: number, onlyActive?: boolean): Promise<Goal[]>;
  getGoalById(id: number): Promise<Goal | undefined>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: number, data: Partial<Goal>): Promise<Goal | undefined>;
  deleteGoal(id: number): Promise<boolean>;
  
  // Scheduled streams
  getScheduledStreams(userId: number): Promise<ScheduledStream[]>;
  getScheduledStreamById(id: number): Promise<ScheduledStream | undefined>;
  createScheduledStream(stream: InsertScheduledStream): Promise<ScheduledStream>;
  updateScheduledStream(id: number, data: Partial<ScheduledStream>): Promise<ScheduledStream | undefined>;
  deleteScheduledStream(id: number): Promise<boolean>;
  
  // Automations
  getAutomations(userId: number, onlyActive?: boolean): Promise<Automation[]>;
  getAutomationById(id: number): Promise<Automation | undefined>;
  createAutomation(automation: InsertAutomation): Promise<Automation>;
  updateAutomation(id: number, data: Partial<Automation>): Promise<Automation | undefined>;
  deleteAutomation(id: number): Promise<boolean>;
  
  // Chat messages
  getChatMessages(userId: number, limit?: number, platform?: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Followers and subscribers
  getFollowers(userId: number, limit?: number, platform?: string): Promise<Follower[]>;
  createFollower(follower: InsertFollower): Promise<Follower>;
  
  getSubscribers(userId: number, limit?: number, platform?: string): Promise<Subscriber[]>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  
  // Competitions
  getCompetitions(userId: number, onlyActive?: boolean): Promise<Competition[]>;
  getCompetitionById(id: number): Promise<Competition | undefined>;
  createCompetition(competition: InsertCompetition): Promise<Competition>;
  updateCompetition(id: number, data: Partial<Competition>): Promise<Competition | undefined>;
  deleteCompetition(id: number): Promise<boolean>;
  
  // Competition entries
  getCompetitionEntries(competitionId: number): Promise<CompetitionEntry[]>;
  getCompetitionEntryById(id: number): Promise<CompetitionEntry | undefined>;
  getCompetitionEntryByParticipant(competitionId: number, participantName: string, participantPlatform: string): Promise<CompetitionEntry | undefined>;
  createCompetitionEntry(entry: InsertCompetitionEntry): Promise<CompetitionEntry>;
  updateCompetitionEntry(id: number, data: Partial<CompetitionEntry>): Promise<CompetitionEntry | undefined>;
  deleteCompetitionEntry(id: number): Promise<boolean>;
  
  // Giveaways
  getGiveaways(userId: number, onlyActive?: boolean): Promise<Giveaway[]>;
  getGiveawayById(id: number): Promise<Giveaway | undefined>;
  createGiveaway(giveaway: InsertGiveaway): Promise<Giveaway>;
  updateGiveaway(id: number, data: Partial<Giveaway>): Promise<Giveaway | undefined>;
  deleteGiveaway(id: number): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private platformConnections: Map<number, PlatformConnection>;
  private streamStats: Map<number, StreamStats>;
  private goals: Map<number, Goal>;
  private scheduledStreams: Map<number, ScheduledStream>;
  private automations: Map<number, Automation>;
  private chatMessages: Map<number, ChatMessage>;
  private followers: Map<number, Follower>;
  private subscribers: Map<number, Subscriber>;
  private competitions: Map<number, Competition>;
  private competitionEntries: Map<number, CompetitionEntry>;
  private giveaways: Map<number, Giveaway>;

  private currentIds: {
    users: number;
    platformConnections: number;
    streamStats: number;
    goals: number;
    scheduledStreams: number;
    automations: number;
    chatMessages: number;
    followers: number;
    subscribers: number;
    competitions: number;
    competitionEntries: number;
    giveaways: number;
  };

  constructor() {
    this.users = new Map();
    this.platformConnections = new Map();
    this.streamStats = new Map();
    this.goals = new Map();
    this.scheduledStreams = new Map();
    this.automations = new Map();
    this.chatMessages = new Map();
    this.followers = new Map();
    this.subscribers = new Map();
    this.competitions = new Map();
    this.competitionEntries = new Map();
    this.giveaways = new Map();

    this.currentIds = {
      users: 1,
      platformConnections: 1,
      streamStats: 1,
      goals: 1,
      scheduledStreams: 1,
      automations: 1,
      chatMessages: 1,
      followers: 1,
      subscribers: 1,
      competitions: 1,
      competitionEntries: 1,
      giveaways: 1
    };

    // Initialize with a demo user and sample data
    this.initializeDemoData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  // Platform connections
  async getPlatformConnections(userId: number): Promise<PlatformConnection[]> {
    return Array.from(this.platformConnections.values()).filter(
      (conn) => conn.userId === userId
    );
  }

  async createPlatformConnection(connection: InsertPlatformConnection): Promise<PlatformConnection> {
    const id = this.currentIds.platformConnections++;
    const now = new Date();
    const newConnection: PlatformConnection = { 
      ...connection, 
      id, 
      followerCount: 0, 
      subscriberCount: 0, 
      createdAt: now 
    };
    this.platformConnections.set(id, newConnection);
    return newConnection;
  }

  async updatePlatformConnection(id: number, data: Partial<InsertPlatformConnection>): Promise<PlatformConnection | undefined> {
    const connection = this.platformConnections.get(id);
    if (!connection) return undefined;

    const updatedConnection = { ...connection, ...data };
    this.platformConnections.set(id, updatedConnection);
    return updatedConnection;
  }

  async deletePlatformConnection(id: number): Promise<boolean> {
    return this.platformConnections.delete(id);
  }

  // Stream stats
  async getStreamStats(userId: number, limit?: number): Promise<StreamStats[]> {
    const stats = Array.from(this.streamStats.values())
      .filter(stat => stat.userId === userId)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    
    return limit ? stats.slice(0, limit) : stats;
  }

  async getStreamStatsById(id: number): Promise<StreamStats | undefined> {
    return this.streamStats.get(id);
  }

  async createStreamStats(stats: InsertStreamStats): Promise<StreamStats> {
    const id = this.currentIds.streamStats++;
    const newStats: StreamStats = {
      ...stats,
      id,
      endTime: null,
      peakViewers: 0,
      averageViewers: 0,
      newFollowers: 0,
      newSubscribers: 0,
      chatMessages: 0,
      revenue: 0
    };
    this.streamStats.set(id, newStats);
    return newStats;
  }

  async updateStreamStats(id: number, data: Partial<StreamStats>): Promise<StreamStats | undefined> {
    const stats = this.streamStats.get(id);
    if (!stats) return undefined;

    const updatedStats = { ...stats, ...data };
    this.streamStats.set(id, updatedStats);
    return updatedStats;
  }

  // Goals
  async getGoals(userId: number, onlyActive?: boolean): Promise<Goal[]> {
    let goals = Array.from(this.goals.values()).filter(goal => goal.userId === userId);
    
    if (onlyActive) {
      goals = goals.filter(goal => goal.isActive);
    }
    
    return goals;
  }

  async getGoalById(id: number): Promise<Goal | undefined> {
    return this.goals.get(id);
  }

  async createGoal(goal: InsertGoal): Promise<Goal> {
    const id = this.currentIds.goals++;
    const now = new Date();
    const newGoal: Goal = { ...goal, id, createdAt: now };
    this.goals.set(id, newGoal);
    return newGoal;
  }

  async updateGoal(id: number, data: Partial<Goal>): Promise<Goal | undefined> {
    const goal = this.goals.get(id);
    if (!goal) return undefined;

    const updatedGoal = { ...goal, ...data };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }

  async deleteGoal(id: number): Promise<boolean> {
    return this.goals.delete(id);
  }

  // Scheduled streams
  async getScheduledStreams(userId: number): Promise<ScheduledStream[]> {
    return Array.from(this.scheduledStreams.values())
      .filter(stream => stream.userId === userId)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  async getScheduledStreamById(id: number): Promise<ScheduledStream | undefined> {
    return this.scheduledStreams.get(id);
  }

  async createScheduledStream(stream: InsertScheduledStream): Promise<ScheduledStream> {
    const id = this.currentIds.scheduledStreams++;
    const now = new Date();
    const newStream: ScheduledStream = { ...stream, id, createdAt: now };
    this.scheduledStreams.set(id, newStream);
    return newStream;
  }

  async updateScheduledStream(id: number, data: Partial<ScheduledStream>): Promise<ScheduledStream | undefined> {
    const stream = this.scheduledStreams.get(id);
    if (!stream) return undefined;

    const updatedStream = { ...stream, ...data };
    this.scheduledStreams.set(id, updatedStream);
    return updatedStream;
  }

  async deleteScheduledStream(id: number): Promise<boolean> {
    return this.scheduledStreams.delete(id);
  }

  // Automations
  async getAutomations(userId: number, onlyActive?: boolean): Promise<Automation[]> {
    let automations = Array.from(this.automations.values()).filter(automation => automation.userId === userId);
    
    if (onlyActive) {
      automations = automations.filter(automation => automation.isActive);
    }
    
    return automations;
  }

  async getAutomationById(id: number): Promise<Automation | undefined> {
    return this.automations.get(id);
  }

  async createAutomation(automation: InsertAutomation): Promise<Automation> {
    const id = this.currentIds.automations++;
    const now = new Date();
    const newAutomation: Automation = { ...automation, id, createdAt: now };
    this.automations.set(id, newAutomation);
    return newAutomation;
  }

  async updateAutomation(id: number, data: Partial<Automation>): Promise<Automation | undefined> {
    const automation = this.automations.get(id);
    if (!automation) return undefined;

    const updatedAutomation = { ...automation, ...data };
    this.automations.set(id, updatedAutomation);
    return updatedAutomation;
  }

  async deleteAutomation(id: number): Promise<boolean> {
    return this.automations.delete(id);
  }

  // Chat messages
  async getChatMessages(userId: number, limit?: number, platform?: string): Promise<ChatMessage[]> {
    let messages = Array.from(this.chatMessages.values())
      .filter(message => message.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    if (platform) {
      messages = messages.filter(message => message.platform === platform);
    }
    
    return limit ? messages.slice(0, limit) : messages;
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentIds.chatMessages++;
    const newMessage: ChatMessage = { ...message, id };
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }

  // Followers
  async getFollowers(userId: number, limit?: number, platform?: string): Promise<Follower[]> {
    let followers = Array.from(this.followers.values())
      .filter(follower => follower.userId === userId)
      .sort((a, b) => new Date(b.followedAt).getTime() - new Date(a.followedAt).getTime());
    
    if (platform) {
      const platformConnectionIds = Array.from(this.platformConnections.values())
        .filter(conn => conn.userId === userId && conn.platform === platform)
        .map(conn => conn.id);
      
      followers = followers.filter(follower => 
        platformConnectionIds.includes(follower.platformConnectionId)
      );
    }
    
    return limit ? followers.slice(0, limit) : followers;
  }

  async createFollower(follower: InsertFollower): Promise<Follower> {
    const id = this.currentIds.followers++;
    const newFollower: Follower = { ...follower, id };
    this.followers.set(id, newFollower);
    return newFollower;
  }

  // Subscribers
  async getSubscribers(userId: number, limit?: number, platform?: string): Promise<Subscriber[]> {
    let subscribers = Array.from(this.subscribers.values())
      .filter(subscriber => subscriber.userId === userId)
      .sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime());
    
    if (platform) {
      const platformConnectionIds = Array.from(this.platformConnections.values())
        .filter(conn => conn.userId === userId && conn.platform === platform)
        .map(conn => conn.id);
      
      subscribers = subscribers.filter(subscriber => 
        platformConnectionIds.includes(subscriber.platformConnectionId)
      );
    }
    
    return limit ? subscribers.slice(0, limit) : subscribers;
  }

  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const id = this.currentIds.subscribers++;
    const newSubscriber: Subscriber = { ...subscriber, id };
    this.subscribers.set(id, newSubscriber);
    return newSubscriber;
  }
  
  // Competitions
  async getCompetitions(userId: number, onlyActive?: boolean): Promise<Competition[]> {
    let competitions = Array.from(this.competitions.values())
      .filter(comp => comp.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (onlyActive) {
      competitions = competitions.filter(comp => comp.isActive);
    }
    
    return competitions;
  }

  async getCompetitionById(id: number): Promise<Competition | undefined> {
    return this.competitions.get(id);
  }

  async createCompetition(competition: InsertCompetition): Promise<Competition> {
    const id = this.currentIds.competitions++;
    const now = new Date();
    const newCompetition: Competition = { ...competition, id, createdAt: now };
    this.competitions.set(id, newCompetition);
    return newCompetition;
  }

  async updateCompetition(id: number, data: Partial<Competition>): Promise<Competition | undefined> {
    const competition = this.competitions.get(id);
    if (!competition) return undefined;

    const updatedCompetition = { ...competition, ...data };
    this.competitions.set(id, updatedCompetition);
    return updatedCompetition;
  }

  async deleteCompetition(id: number): Promise<boolean> {
    // First delete all related entries
    const entries = Array.from(this.competitionEntries.values())
      .filter(entry => entry.competitionId === id);
      
    for (const entry of entries) {
      this.competitionEntries.delete(entry.id);
    }
    
    return this.competitions.delete(id);
  }
  
  // Competition entries
  async getCompetitionEntries(competitionId: number): Promise<CompetitionEntry[]> {
    return Array.from(this.competitionEntries.values())
      .filter(entry => entry.competitionId === competitionId)
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }

  async getCompetitionEntryById(id: number): Promise<CompetitionEntry | undefined> {
    return this.competitionEntries.get(id);
  }
  
  async getCompetitionEntryByParticipant(
    competitionId: number, 
    participantName: string, 
    participantPlatform: string
  ): Promise<CompetitionEntry | undefined> {
    return Array.from(this.competitionEntries.values()).find(
      entry => entry.competitionId === competitionId && 
              entry.participantName === participantName && 
              entry.participantPlatform === participantPlatform
    );
  }

  async createCompetitionEntry(entry: InsertCompetitionEntry): Promise<CompetitionEntry> {
    const id = this.currentIds.competitionEntries++;
    const now = new Date();
    const newEntry: CompetitionEntry = { 
      ...entry, 
      id, 
      isWinner: false,
      watchTimeMinutes: entry.watchTimeMinutes || 0,
      secretWordsUsed: entry.secretWordsUsed || [],
      socialInteractions: entry.socialInteractions || [],
      totalPoints: entry.totalPoints || 0,
      entries: entry.entries || [],
      prizeAwarded: null,
      createdAt: now,
      updatedAt: now
    };
    this.competitionEntries.set(id, newEntry);
    return newEntry;
  }

  async updateCompetitionEntry(id: number, data: Partial<CompetitionEntry>): Promise<CompetitionEntry | undefined> {
    const entry = this.competitionEntries.get(id);
    if (!entry) return undefined;

    const updatedEntry = { ...entry, ...data, updatedAt: new Date() };
    this.competitionEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteCompetitionEntry(id: number): Promise<boolean> {
    return this.competitionEntries.delete(id);
  }
  
  // Giveaways
  async getGiveaways(userId: number, onlyActive?: boolean): Promise<Giveaway[]> {
    let giveaways = Array.from(this.giveaways.values())
      .filter(giveaway => giveaway.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (onlyActive) {
      giveaways = giveaways.filter(giveaway => giveaway.isActive);
    }
    
    return giveaways;
  }

  async getGiveawayById(id: number): Promise<Giveaway | undefined> {
    return this.giveaways.get(id);
  }

  async createGiveaway(giveaway: InsertGiveaway): Promise<Giveaway> {
    const id = this.currentIds.giveaways++;
    const now = new Date();
    const newGiveaway: Giveaway = { ...giveaway, id, createdAt: now };
    this.giveaways.set(id, newGiveaway);
    return newGiveaway;
  }

  async updateGiveaway(id: number, data: Partial<Giveaway>): Promise<Giveaway | undefined> {
    const giveaway = this.giveaways.get(id);
    if (!giveaway) return undefined;

    const updatedGiveaway = { ...giveaway, ...data };
    this.giveaways.set(id, updatedGiveaway);
    return updatedGiveaway;
  }

  async deleteGiveaway(id: number): Promise<boolean> {
    return this.giveaways.delete(id);
  }

  // Initialize with demo data
  private initializeDemoData() {
    // Create demo user
    const demoUser: InsertUser = {
      username: 'GamerPro123',
      password: 'password123', // In a real app, this would be hashed
      displayName: 'GamerPro123',
      email: 'gamer@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=1'
    };
    
    this.createUser(demoUser).then(user => {
      const userId = user.id;
      
      // Create platform connections
      this.createPlatformConnection({
        userId,
        platform: 'twitch',
        platformUserId: 'twitch123',
        platformUsername: 'GamerPro123',
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        isPrimary: true
      }).then(twitchConn => {
        // Update follower counts
        this.updatePlatformConnection(twitchConn.id, { followerCount: 24531, subscriberCount: 437 });
      });
      
      this.createPlatformConnection({
        userId,
        platform: 'youtube',
        platformUserId: 'youtube123',
        platformUsername: 'GamerPro123',
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        isPrimary: false
      }).then(youtubeConn => {
        // Update follower counts
        this.updatePlatformConnection(youtubeConn.id, { followerCount: 12785, subscriberCount: 215 });
      });
      
      this.createPlatformConnection({
        userId,
        platform: 'facebook',
        platformUserId: 'facebook123',
        platformUsername: 'GamerPro123',
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        isPrimary: false
      }).then(fbConn => {
        // Update follower counts
        this.updatePlatformConnection(fbConn.id, { followerCount: 8429, subscriberCount: 126 });
      });
      
      // Create current stream
      const now = new Date();
      this.createStreamStats({
        userId,
        title: 'Fortnite - Season 8',
        platform: 'twitch',
        startTime: new Date(now.getTime() - 9000000) // Started 2.5 hours ago
      }).then(stream => {
        // Update with current stats
        this.updateStreamStats(stream.id, {
          peakViewers: 1500,
          averageViewers: 1243,
          newFollowers: 147,
          newSubscribers: 24,
          chatMessages: 3256
        });
      });
      
      // Create goal
      this.createGoal({
        userId,
        title: 'Monthly Subscribers',
        targetValue: 500,
        currentValue: 450,
        goalType: 'subscribers',
        deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        isActive: true
      });
      
      // Create scheduled streams
      const createScheduledStreams = [
        {
          userId,
          title: 'Minecraft Build Challenge',
          description: 'Building epic structures with viewers',
          startTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000), // 3 days from now, 7PM
          endTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000), // 3 days from now, 10PM
          platforms: ['twitch', 'youtube']
        },
        {
          userId,
          title: 'Fortnite with Subscribers',
          description: 'Playing with subscribers and viewers',
          startTime: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000), // 6 days from now, 8PM
          endTime: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000), // 6 days from now, 11PM
          platforms: ['twitch', 'youtube', 'facebook']
        },
        {
          userId,
          title: 'Special Q&A Session',
          description: 'Answering viewer questions',
          startTime: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000), // 9 days from now, 6PM
          endTime: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000), // 9 days from now, 8PM
          platforms: ['twitch']
        }
      ];
      
      createScheduledStreams.forEach(stream => this.createScheduledStream(stream));
      
      // Create automations
      const automations = [
        {
          userId,
          name: 'Follower Milestone Alerts',
          description: 'Triggers every 10 new followers',
          triggerType: 'follower',
          triggerValue: '10',
          actionType: 'overlay',
          actionData: { message: 'New follower milestone reached!' },
          isActive: true
        },
        {
          userId,
          name: 'Hourly Giveaway Reminder',
          description: 'Posts in chat every 60 minutes',
          triggerType: 'timer',
          triggerValue: '3600',
          actionType: 'chat_message',
          actionData: { message: 'Don\'t forget to enter the giveaway by typing !enter in chat!' },
          isActive: true
        },
        {
          userId,
          name: 'New Sub Animation',
          description: 'Plays animation on new subscribers',
          triggerType: 'subscriber',
          triggerValue: '1',
          actionType: 'overlay',
          actionData: { animationType: 'celebration' },
          isActive: true
        }
      ];
      
      automations.forEach(automation => this.createAutomation(automation));
      
      // Create some demo chat messages
      const chatMessages = [
        {
          userId,
          platform: 'twitch',
          senderUsername: 'TwitchUser123',
          senderDisplayName: 'TwitchUser123',
          message: 'Hey there! Love the stream today, that was an amazing play!',
          timestamp: new Date(now.getTime() - 4 * 60 * 1000), // 4 minutes ago
          userBadges: { subscriber: '3', premium: '1' }
        },
        {
          userId,
          platform: 'youtube',
          senderUsername: 'YTGamer',
          senderDisplayName: 'YTGamer',
          message: 'Can you show your loadout again? I missed it earlier',
          timestamp: new Date(now.getTime() - 2 * 60 * 1000), // 2 minutes ago
          userBadges: { member: '2' }
        },
        {
          userId,
          platform: 'facebook',
          senderUsername: 'JohnDoe',
          senderDisplayName: 'JohnDoe',
          message: 'First time catching your stream live! Excited to be here!',
          timestamp: new Date(now.getTime() - 1 * 60 * 1000), // 1 minute ago
          userBadges: {}
        },
        {
          userId,
          platform: 'twitch',
          senderUsername: 'StreamFan99',
          senderDisplayName: 'StreamFan99',
          message: '!uptime',
          timestamp: new Date(now.getTime() - 10 * 1000), // 10 seconds ago
          userBadges: {}
        }
      ];
      
      chatMessages.forEach(message => this.createChatMessage(message));
      
      // Create some demo competitions
      const currentDate = new Date();
      const nextWeek = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      const nextMonth = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      // Create a standard giveaway
      this.createGiveaway({
        userId,
        title: "Weekly Subscriber Giveaway",
        description: "Win a $50 Steam gift card by being a subscriber and active in chat",
        startDate: currentDate,
        endDate: nextWeek,
        isActive: true,
        entryMethod: "subscribers_only",
        eligiblePlatforms: ["twitch", "youtube"],
        prize: "$50 Steam Gift Card"
      });
      
      // Create a standard competition
      this.createCompetition({
        userId,
        title: "Monthly Community Challenge",
        description: "Participate in our monthly community challenge for prizes!",
        startDate: currentDate,
        endDate: nextMonth,
        isActive: true,
        competitionType: "standard",
        entryMethods: [
          { type: "chat_command", command: "!enter", points: 1 }
        ],
        prizes: [
          { position: 1, description: "Gaming Headset", value: 100 },
          { position: 2, description: "$50 Amazon Gift Card", value: 50 },
          { position: 3, description: "$25 Amazon Gift Card", value: 25 }
        ]
      });
      
      // Create an extended competition with secret words and watch time
      const secretWords = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentDate.getTime() + i * 24 * 60 * 60 * 1000);
        secretWords.push({
          date: date.toISOString().split('T')[0],
          word: `secret${i+1}`
        });
      }
      
      const extendedCompetition = {
        userId,
        title: "Ultimate Fan Competition",
        description: "A month-long competition to find our biggest fan! Track social media engagement, secret words, and watch time.",
        startDate: currentDate,
        endDate: nextMonth,
        isActive: true,
        competitionType: "extended",
        entryMethods: [
          { type: "watch_time", points: 1, description: "1 point per minute watched" },
          { type: "secret_word", points: 50, description: "50 points per secret word" },
          { type: "social_media", points: 100, description: "100 points per social media interaction" }
        ],
        prizes: [
          { position: 1, description: "Gaming PC Upgrade Package", value: 500 },
          { position: 2, description: "Premium Gaming Headset", value: 200 },
          { position: 3, description: "1 Year Subscription", value: 100 }
        ],
        dailySecretWords: secretWords,
        socialIntegrations: [
          { platform: "twitter", tag: "#MyStreamCompetition" },
          { platform: "instagram", tag: "#MyStreamCompetition" },
          { platform: "tiktok", tag: "#MyStreamChallenge" }
        ],
        watchTimeMultiplier: 1
      };
      
      this.createCompetition(extendedCompetition).then(competition => {
        // Create some sample entries
        const sampleEntries = [
          {
            competitionId: competition.id,
            participantName: "SuperFan123",
            participantPlatform: "twitch",
            participantId: "12345",
            totalPoints: 230,
            entries: [
              { type: "watch_time", points: 180, timestamp: currentDate },
              { type: "secret_word", word: "secret1", points: 50, timestamp: currentDate }
            ],
            watchTimeMinutes: 180,
            secretWordsUsed: [{ word: "secret1", date: currentDate.toISOString().split('T')[0], points: 50 }]
          },
          {
            competitionId: competition.id,
            participantName: "GameLover99",
            participantPlatform: "youtube",
            participantId: "67890",
            totalPoints: 310,
            entries: [
              { type: "watch_time", points: 160, timestamp: currentDate },
              { type: "secret_word", word: "secret1", points: 50, timestamp: currentDate },
              { type: "social_media", platform: "twitter", points: 100, timestamp: currentDate }
            ],
            watchTimeMinutes: 160,
            secretWordsUsed: [{ word: "secret1", date: currentDate.toISOString().split('T')[0], points: 50 }],
            socialInteractions: [{ platform: "twitter", postId: "tw12345", points: 100, timestamp: currentDate }]
          }
        ];
        
        sampleEntries.forEach(entry => this.createCompetitionEntry(entry));
      });
    });
  }
}

export const storage = new MemStorage();
