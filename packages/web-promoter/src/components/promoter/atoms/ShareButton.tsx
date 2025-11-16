'use client';

import { Share2 } from 'lucide-react';
import { Button } from './Button';
import { useToast } from '@/hooks/use-toast';

export interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function ShareButton({
  title,
  text,
  url,
  variant = 'outline',
  size = 'sm',
}: ShareButtonProps) {
  const { success, info } = useToast();

  const handleShare = async () => {
    // Check if native share is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        success('Shared!', 'Content shared successfully');
      } catch (error) {
        // User cancelled share
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${text}\n\n${url}`);
        info('Copied!', 'Link copied to clipboard. Share it anywhere!');
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  return (
    <Button onClick={handleShare} variant={variant} size={size}>
      <Share2 className="w-4 h-4" />
      <span className="ml-phi-2">Share</span>
    </Button>
  );
}
