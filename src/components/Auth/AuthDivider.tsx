
export function AuthDivider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-gaming-light-gray/20" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-gaming-dark/30 px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
    </div>
  );
}
