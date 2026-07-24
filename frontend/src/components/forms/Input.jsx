import React from 'react';

const Input = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={`w-full bg-surface border border-border rounded-lg px-4 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
            {...props}
        />
    );
});

Input.displayName = 'Input';

export default Input;