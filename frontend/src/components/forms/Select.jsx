import React from "react";

const Select = React.forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={[
        "w-full",
        "bg-card",
        "border border-border",
        "rounded-lg",
        "px-4 py-2",
        "text-text-primary",
        "focus:outline-none focus:ring-2 focus:ring-ring",
        "dark:bg-dark-card dark:border-dark-border dark:text-dark-ink",
        "dark:focus:ring-dark-ring",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;