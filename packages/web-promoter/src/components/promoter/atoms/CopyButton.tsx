'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from './Button';
import { useToast } from '@/hooks/use-toast';

export interface CopyButtonProps {
  text: string;
  label?: string;
  showLabel?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function CopyButton({
  text,
  label = 'Copy',
  showLabel = true,
  variant = 'outline',
  size = 'sm',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      success('Copied!', 'Text copied to clipboard');

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Button onClick={handleCopy} variant={variant} size={size}>
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {showLabel && <span className="ml-phi-2">{copied ? 'Copied!' : label}</span>}
    </Button>
  );
}
