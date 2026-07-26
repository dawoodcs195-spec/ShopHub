const Spinner = ({ size = 40, className = "" }) => {
  const px = typeof size === "number" ? `${size}px` : size;

  return (
    <div
      style={{ width: px, height: px }}
      className={[
        "rounded-full border-2",
        "border-primary/20 border-t-primary",
        "dark:border-white/10 dark:border-t-primary",
        "animate-spin",
        className,
      ].join(" ")}
      aria-label="Loading"
      role="status"
    />
  );
};

export default Spinner;