import React from 'react';

const MockVectorIcons: React.FC<{
  name: string;
  size?: number;
  color?: string;
  style?: any;
}> = ({ name, size, color, style }) => {
  return React.createElement('View', { 'data-testid': `icon-${name}` });
};

export default MockVectorIcons;
