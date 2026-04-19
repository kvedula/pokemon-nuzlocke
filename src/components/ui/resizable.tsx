'use client';

import { GripVertical } from 'lucide-react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { cn } from '@/lib/utils';

const ResizablePanelGroup = ({
  className,
  direction = 'horizontal',
  ...props
}: React.ComponentProps<typeof Group> & { direction?: 'horizontal' | 'vertical' }) => (
  <Group
    orientation={direction}
    className={cn(
      'flex h-full w-full',
      direction === 'vertical' && 'flex-col',
      className
    )}
    {...props}
  />
);

const ResizablePanel = Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & {
  withHandle?: boolean;
}) => (
  <Separator
    className={cn(
      'relative flex items-center justify-center bg-border transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
      'data-[orientation=horizontal]:w-1 data-[orientation=horizontal]:cursor-col-resize',
      'data-[orientation=vertical]:h-1 data-[orientation=vertical]:cursor-row-resize',
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className={cn(
        'z-10 flex items-center justify-center rounded-sm border bg-muted/80 hover:bg-muted',
        'data-[orientation=horizontal]:h-6 data-[orientation=horizontal]:w-3',
        'data-[orientation=vertical]:h-3 data-[orientation=vertical]:w-6'
      )}>
        <GripVertical className="h-2.5 w-2.5 text-muted-foreground" />
      </div>
    )}
  </Separator>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
