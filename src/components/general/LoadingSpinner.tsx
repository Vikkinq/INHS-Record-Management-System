type LoadingSpinnerProps = {
  label?: string;
};

export default function LoadingSpinner({ label = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
        {/* Spinner + Logo */}
        <div className="relative w-28 h-28">
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-[5px] border-primary/20 border-t-primary animate-spin" />

          {/* Logo */}
          <img
            src="https://live.staticflickr.com/5065/5732629600_f6f22b9816_n.jpg"
            alt="INHS Logo"
            className="absolute inset-0 m-auto w-16 h-16 rounded-full object-cover shadow-md bg-white"
          />
        </div>

        {/* Text */}
        <p className="text-base font-medium text-muted-foreground tracking-wide">{label}</p>
      </div>
    </div>
  );
}
