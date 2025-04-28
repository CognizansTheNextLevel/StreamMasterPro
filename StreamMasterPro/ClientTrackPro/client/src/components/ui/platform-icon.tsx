import React from 'react';
import { SiTwitch, SiYoutube, SiFacebook } from 'react-icons/si';

interface PlatformIconProps {
  platform: string;
  size?: number;
  className?: string;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ 
  platform, 
  size = 18, 
  className = '' 
}) => {
  switch (platform.toLowerCase()) {
    case 'twitch':
      return <SiTwitch size={size} className={`text-[#9146FF] ${className}`} />;
    case 'youtube':
      return <SiYoutube size={size} className={`text-[#FF0000] ${className}`} />;
    case 'facebook':
      return <SiFacebook size={size} className={`text-[#1877F2] ${className}`} />;
    default:
      return null;
  }
};