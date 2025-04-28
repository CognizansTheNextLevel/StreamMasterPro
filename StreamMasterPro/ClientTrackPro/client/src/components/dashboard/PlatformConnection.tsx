import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlatformIcon } from '@/components/ui/platform-icon';
import { useQuery } from '@tanstack/react-query';
import { PlatformConnection as PlatformConnectionType } from '@shared/schema';

const PlatformConnection: React.FC = () => {
  const { data: connections, isLoading } = useQuery<PlatformConnectionType[]>({
    queryKey: ['/api/users/1/platforms'], // Using static user ID for demo
  });

  // Platform configuration data
  const platformData = [
    {
      id: 'twitch',
      name: 'Twitch',
      color: 'bg-primary',
      textColor: 'text-primary',
      bgColor: 'bg-primary/20',
      label: 'Primary Platform',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      color: 'bg-secondary',
      textColor: 'text-secondary',
      bgColor: 'bg-secondary/20',
      label: 'Secondary Platform',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-500/20',
      label: 'Additional Platform',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      color: 'bg-black',
      textColor: 'text-black',
      bgColor: 'bg-black/20',
      label: 'Additional Platform',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      color: 'bg-pink-500',
      textColor: 'text-pink-500',
      bgColor: 'bg-pink-500/20',
      label: 'Additional Platform',
    }
  ];

  // Mock data for initial render
  const defaultConnections = [
    {
      id: 1,
      platform: 'twitch',
      platformUsername: 'GamerPro123',
      isPrimary: true,
      followerCount: 24531,
      subscriberCount: 437
    },
    {
      id: 2,
      platform: 'youtube',
      platformUsername: 'GamerPro123',
      isPrimary: false,
      followerCount: 12785,
      subscriberCount: 215
    },
    {
      id: 3,
      platform: 'facebook',
      platformUsername: 'GamerPro123',
      isPrimary: false,
      followerCount: 8429,
      subscriberCount: 126
    }
  ];

  const connectionsToDisplay = connections || defaultConnections;

  return (
    <div className="mt-6 mb-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Connected Platforms</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {connectionsToDisplay.map((connection) => {
          const platform = platformData.find(p => p.id === connection.platform) || platformData[0];
          
          return (
            <Card key={connection.id} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-md ${platform.color} flex items-center justify-center text-white`}>
                      <PlatformIcon platform={connection.platform} size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{platform.name}</h4>
                      <p className="text-xs text-muted-foreground">{platform.label}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">Connected</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Followers</span>
                    <span className="text-foreground font-medium">{connection.followerCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {connection.platform === 'youtube' ? 'Members' : 'Subscribers'}
                    </span>
                    <span className="text-foreground font-medium">{connection.subscriberCount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformConnection;
