import React from 'react';

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <select
            ref={ref}
            className={`w-full bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
            {...props}
        >
            {children}
        </select>
    );
});

Select.displayName = 'Select';

export default Select;