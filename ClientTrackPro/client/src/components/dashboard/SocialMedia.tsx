import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlatformIcon } from '@/components/ui/platform-icon';
import { Plus, Share } from 'lucide-react';

const SocialMedia: React.FC = () => {
  const [connectedPlatforms, setConnectedPlatforms] = useState({
    instagram: true,
    twitter: true,
    discord: true,
    tiktok: true,
    linkedin: false
  });

  const socialPlatforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      gradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
      connected: connectedPlatforms.instagram
    },
    {
      id: 'twitter',
      name: 'Twitter',
      color: 'bg-[#1DA1F2]',
      connected: connectedPlatforms.twitter
    },
    {
      id: 'discord',
      name: 'Discord',
      color: 'bg-[#5865F2]',
      connected: connectedPlatforms.discord
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      color: 'bg-[#000000]',
      connected: connectedPlatforms.tiktok
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      color: 'bg-[#0077B5]',
      connected: connectedPlatforms.linkedin
    }
  ];

  const toggleConnection = (platformId: string) => {
    setConnectedPlatforms(prev => ({
      ...prev,
      [platformId]: !prev[platformId as keyof typeof prev]
    }));
  };

  return (
    <Card className="border-border overflow-hidden mb-6">
      <CardHeader className="p-4 border-b border-border">
        <CardTitle className="font-medium text-foreground">Social Media Integration</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {socialPlatforms.map(platform => (
            <div 
              key={platform.id}
              className="bg-muted p-4 rounded-lg flex flex-col items-center space-y-2 hover:bg-accent transition-colors cursor-pointer"
              onClick={() => toggleConnection(platform.id)}
            >
              <div className={`w-12 h-12 rounded-full ${platform.gradient || platform.color} flex items-center justify-center text-white`}>
                <PlatformIcon platform={platform.id} size={20} />
              </div>
              <span className="text-sm font-medium text-foreground">{platform.name}</span>
              {platform.connected ? (
                <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-500">Connected</span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded bg-muted-foreground/90 text-muted-foreground">Connect</span>
              )}
            </div>
          ))}
          
          <div className="bg-muted p-4 rounded-lg flex flex-col items-center space-y-2 hover:bg-accent transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-muted-foreground/20 flex items-center justify-center text-muted-foreground">
              <Plus size={20} />
            </div>
            <span className="text-sm font-medium text-foreground">Add More</span>
            <span className="text-xs text-transparent">Spacer</span>
          </div>
        </div>
        
        <div className="mt-4">
          <Button className="flex items-center space-x-2">
            <Share size={16} />
            <span>Auto-Share Stream</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMedia;
