import React from 'react';

const StarBorder = ({
  as: Component = 'button',
  className = '',
  color = '#96e072',
  speed = '6s',
  thickness = 2,
  children,
  ...rest
}) => {
  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-full p-[2px] ${className}`}
      style={{
        padding: `${thickness}px`,
        ...rest.style
      }}
      {...rest}
    >
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      />
      <div
        className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      />
      <div className="relative z-10 w-full h-full bg-[#134611] rounded-full text-white text-center flex items-center justify-center">
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
