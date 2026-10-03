'use client';

import React, { createContext, useContext, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  motion,
  type MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionProps,
} from 'framer-motion';
import { cn } from '@/lib/utils';

interface DockContextValue {
  mouseX: MotionValue<number>;
  iconSize: number;
  iconMagnification: number;
  iconDistance: number;
  disableMagnification: boolean;
}

const DockContext = createContext<DockContextValue | undefined>(undefined);

export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string;
  iconSize?: number;
  iconMagnification?: number;
  disableMagnification?: boolean;
  iconDistance?: number;
  direction?: 'top' | 'middle' | 'bottom';
  children: React.ReactNode;
}

const DEFAULT_SIZE = 40;
const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;
const DEFAULT_DISABLEMAGNIFICATION = false;

const dockVariants = cva(
  'glass pointer-events-auto mx-auto flex h-[58px] w-max items-end justify-center gap-1 rounded-[28px] px-3 pb-2 shadow-2xl shadow-black/30'
);

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      children,
      iconSize = DEFAULT_SIZE,
      iconMagnification = DEFAULT_MAGNIFICATION,
      disableMagnification = DEFAULT_DISABLEMAGNIFICATION,
      iconDistance = DEFAULT_DISTANCE,
      direction = 'middle',
      ...props
    },
    ref
  ) => {
    const mouseX = useMotionValue(Infinity);

    return (
      <DockContext.Provider
        value={{
          mouseX,
          iconSize,
          iconMagnification,
          iconDistance,
          disableMagnification,
        }}
      >
        <motion.div
          ref={ref}
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          {...props}
          className={cn(dockVariants({ className }), {
            'items-start': direction === 'top',
            'items-center': direction === 'middle',
            'items-end': direction === 'bottom',
          })}
        >
          {children}
        </motion.div>
      </DockContext.Provider>
    );
  }
);

Dock.displayName = 'Dock';

export interface DockIconProps
  extends Omit<MotionProps & React.HTMLAttributes<HTMLDivElement>, 'children'> {
  size?: number;
  magnification?: number;
  disableMagnification?: boolean;
  distance?: number;
  mouseX?: MotionValue<number>;
  className?: string;
  children?: React.ReactNode;
}

const DockIcon = ({
  size,
  magnification,
  disableMagnification,
  distance,
  mouseX,
  className,
  children,
  ...props
}: DockIconProps) => {
  const context = useContext(DockContext);

  const finalSize = size ?? context?.iconSize ?? DEFAULT_SIZE;
  const finalMagnification = magnification ?? context?.iconMagnification ?? DEFAULT_MAGNIFICATION;
  const finalDistance = distance ?? context?.iconDistance ?? DEFAULT_DISTANCE;
  const finalDisableMagnification =
    disableMagnification ?? context?.disableMagnification ?? DEFAULT_DISABLEMAGNIFICATION;
  const finalMouseX = mouseX ?? context?.mouseX ?? useMotionValue(Infinity);

  const ref = useRef<HTMLDivElement>(null);
  const padding = Math.max(6, finalSize * 0.2);

  const distanceCalc = useTransform(finalMouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const targetSize = finalDisableMagnification ? finalSize : finalMagnification;

  const sizeTransform = useTransform(
    distanceCalc,
    [-finalDistance, 0, finalDistance],
    [finalSize, targetSize, finalSize]
  );

  const scaleSize = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width: scaleSize, height: scaleSize, padding }}
      className={cn(
        'flex aspect-square cursor-pointer items-center justify-center rounded-full',
        finalDisableMagnification && 'hover:bg-muted-foreground transition-colors',
        className
      )}
      {...props}
    >
      <div className="relative flex h-full w-full items-center justify-center">{children}</div>
    </motion.div>
  );
};

DockIcon.displayName = 'DockIcon';

const DockDivider = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('mx-1.5 h-8 w-px shrink-0 self-center bg-border/70', className)}
      {...props}
    />
  )
);

DockDivider.displayName = 'DockDivider';

export { Dock, DockIcon, DockDivider, dockVariants };
