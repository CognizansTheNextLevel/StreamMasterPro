import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { PlatformIcon } from '@/components/ui/platform-icon';
import { 
  Gift, 
  Clock, 
  Users, 
  Settings, 
  Copy, 
  CheckCircle, 
  List, 
  Shuffle, 
  Play, 
  RotateCcw 
} from 'lucide-react';

const GiveawaysPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [isGiveawayActive, setIsGiveawayActive] = useState(false);
  const [giveawayProgress, setGiveawayProgress] = useState(0);
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  
  const startGiveaway = () => {
    setIsGiveawayActive(true);
    setGiveawayProgress(0);
    setSelectedWinner(null);
    
    // Simulate giveaway progress
    const interval = setInterval(() => {
      setGiveawayProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          pickWinner();
          return 100;
        }
        return prev + 10;
      });
    }, 1000);
  };
  
  const pickWinner = () => {
    // Simulate winner selection
    const participants = [
      'TwitchUser123',
      'YTGamer',
      'StreamFan99',
      'JohnDoe',
      'GamerPro456',
      'StreamerFan22',
      'LuckyViewer',
      'ChatterBox',
      'HappyFollower',
      'StreamSupporter'
    ];
    
    const winner = participants[Math.floor(Math.random() * participants.length)];
    setSelectedWinner(winner);
  };
  
  const resetGiveaway = () => {
    setIsGiveawayActive(false);
    setGiveawayProgress(0);
    setSelectedWinner(null);
  };

  return (
    <DashboardLayout 
      title="Giveaways" 
      subtitle="Set up and manage stream giveaways"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full">
          <TabsTrigger value="create" className="flex-1">
            <Gift size={16} className="mr-2" />
            Create Giveaway
          </TabsTrigger>
          <TabsTrigger value="active" className="flex-1">
            <Play size={16} className="mr-2" />
            Active Giveaway
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1">
            <List size={16} className="mr-2" />
            Giveaway History
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">
            <Settings size={16} className="mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Giveaway</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Giveaway Title</label>
                <Input placeholder="e.g. Subscriber Steam Key Giveaway" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Prize Description</label>
                <Input placeholder="e.g. Steam Key for Game Title" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Duration</label>
                  <Select defaultValue="15">
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Entry Method</label>
                  <Select defaultValue="keyword">
                    <SelectTrigger>
                      <SelectValue placeholder="Select entry method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="keyword">Keyword (!enter)</SelectItem>
                      <SelectItem value="automatic">All viewers</SelectItem>
                      <SelectItem value="subs">Subscribers only</SelectItem>
                      <SelectItem value="followers">Followers only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Eligible Platforms</label>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="twitch" defaultChecked />
                    <label htmlFor="twitch" className="text-sm cursor-pointer flex items-center">
                      <PlatformIcon platform="twitch" className="mr-1" /> Twitch
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="youtube" defaultChecked />
                    <label htmlFor="youtube" className="text-sm cursor-pointer flex items-center">
                      <PlatformIcon platform="youtube" className="mr-1" /> YouTube
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="facebook" defaultChecked />
                    <label htmlFor="facebook" className="text-sm cursor-pointer flex items-center">
                      <PlatformIcon platform="facebook" className="mr-1" /> Facebook
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button onClick={() => {
                  startGiveaway();
                  setActiveTab('active');
                }}>
                  <Gift size={16} className="mr-2" />
                  Create & Start Giveaway
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Giveaway Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-border rounded-md p-4 hover:bg-accent cursor-pointer">
                  <h3 className="font-medium mb-2">Subscriber Only</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Exclusive giveaway for your subscribers
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock size={14} className="mr-1" /> 15 minutes
                  </div>
                </div>
                <div className="border border-border rounded-md p-4 hover:bg-accent cursor-pointer">
                  <h3 className="font-medium mb-2">Milestone Celebration</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Open giveaway for all viewers
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock size={14} className="mr-1" /> 30 minutes
                  </div>
                </div>
                <div className="border border-border rounded-md p-4 hover:bg-accent cursor-pointer">
                  <h3 className="font-medium mb-2">Quick Flash Giveaway</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Fast-paced giveaway with keyword entry
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock size={14} className="mr-1" /> 5 minutes
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active" className="space-y-4">
          {isGiveawayActive ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Subscriber Steam Key Giveaway</span>
                  {giveawayProgress < 100 ? (
                    <span className="text-sm font-normal px-2 py-1 bg-primary/20 text-primary rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="text-sm font-normal px-2 py-1 bg-green-500/20 text-green-500 rounded-full">
                      Completed
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {giveawayProgress < 100 ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Time Remaining</span>
                        <span className="font-medium">{Math.floor((100 - giveawayProgress) / 10)}:00</span>
                      </div>
                      <Progress value={giveawayProgress} />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Users size={16} />
                        <span className="text-sm">42 participants</span>
                      </div>
                      <div className="text-sm">Entry: !enter</div>
                    </div>
                    
                    <div className="pt-4 flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setGiveawayProgress(100)}>
                        End Early
                      </Button>
                      <Button variant="destructive" onClick={resetGiveaway}>
                        Cancel Giveaway
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {selectedWinner ? (
                      <div className="flex flex-col items-center py-8">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                          <CheckCircle size={32} className="text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Winner Selected!</h2>
                        <p className="text-lg mb-4">{selectedWinner}</p>
                        <div className="flex space-x-2">
                          <Button variant="outline" className="flex items-center">
                            <Copy size={16} className="mr-2" />
                            Copy Username
                          </Button>
                          <Button onClick={resetGiveaway}>
                            <RotateCcw size={16} className="mr-2" />
                            New Giveaway
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-8">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 animate-spin">
                          <Shuffle size={32} className="text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-6">Selecting Winner...</h2>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Gift size={32} className="text-muted-foreground" />
              </div>
              <h2 className="text-xl font-medium mb-2">No Active Giveaway</h2>
              <p className="text-muted-foreground mb-4">
                Create a new giveaway to get started
              </p>
              <Button onClick={() => setActiveTab('create')}>
                Create Giveaway
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Giveaway History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Subscriber Steam Key Giveaway</h3>
                    <p className="text-sm text-muted-foreground">Winner: StreamFan99</p>
                  </div>
                  <div className="text-sm text-muted-foreground">May 18, 2023</div>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">1,000 Followers Celebration</h3>
                    <p className="text-sm text-muted-foreground">Winner: LuckyViewer</p>
                  </div>
                  <div className="text-sm text-muted-foreground">May 5, 2023</div>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Gaming Headset Giveaway</h3>
                    <p className="text-sm text-muted-foreground">Winner: TwitchUser123</p>
                  </div>
                  <div className="text-sm text-muted-foreground">April 22, 2023</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Giveaway Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Chat Announcements</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically announce giveaways in chat
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Winner Eligibility Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically check if users meet requirements
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Subscriber Bonus Entries</h3>
                  <p className="text-sm text-muted-foreground">
                    Give subscribers higher chance to win
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Recent Winners Exclusion</h3>
                  <p className="text-sm text-muted-foreground">
                    Prevent recent winners from winning again
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">On-Screen Animation</h3>
                  <p className="text-sm text-muted-foreground">
                    Show winner announcement overlay on stream
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default GiveawaysPage;
