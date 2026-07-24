import React from "react";

const Input = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={[
        "w-full",
        "bg-card",
        "border border-border",
        "rounded-lg",
        "px-4 py-2",
        "text-text-primary",
        "placeholder:text-text-muted",
        "focus:outline-none focus:ring-2 focus:ring-ring",
        "dark:bg-dark-card dark:border-dark-border dark:text-dark-ink dark:placeholder:text-dark-ink-muted",
        "dark:focus:ring-dark-ring",
        className,
      ].join(" ")}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;