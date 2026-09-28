import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<IconProps> = ({ name, className = "w-5 h-5", size }) => {
  // @ts-expect-error dynamic indexing of Lucide icons
  const IconComponent = LucideIcons[name] || LucideIcons.CircleDollarSign;
  return <IconComponent className={className} size={size} />;
};
