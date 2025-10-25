import { Crown, Medal, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BadgeIconProps {
  rank: number;
  size?: number;
}

export const BadgeIcon = ({ rank, size = 16 }: BadgeIconProps) => {
  if (rank === 1) {
    return (
      <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-1.5 py-0.5 text-xs">
        <Crown size={size} className="fill-current" />
      </Badge>
    );
  }
  
  if (rank === 2) {
    return (
      <Badge variant="default" className="bg-gradient-to-r from-gray-300 to-gray-400 text-white px-1.5 py-0.5 text-xs">
        <Trophy size={size} className="fill-current" />
      </Badge>
    );
  }
  
  if (rank === 3) {
    return (
      <Badge variant="default" className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-1.5 py-0.5 text-xs">
        <Medal size={size} className="fill-current" />
      </Badge>
    );
  }
  
  return null;
};
