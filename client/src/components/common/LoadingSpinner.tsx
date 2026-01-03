interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

function LoadingSpinner({ size = 'medium', text, fullScreen = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-20 w-20',
  };

  const content = (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        {/* Outer ring */}
        <div
          className={`animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 ${sizeClasses[size]}`}
        />
        {/* Inner pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`rounded-full bg-blue-600 animate-pulse ${
            size === 'small' ? 'h-2 w-2' : size === 'medium' ? 'h-3 w-3' : 'h-4 w-4'
          }`} />
        </div>
      </div>
      {text && (
        <div className="mt-4 text-center">
          <p className="text-gray-700 font-medium">{text}</p>
          <div className="flex justify-center gap-1 mt-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return <div className="flex flex-col items-center justify-center py-12">{content}</div>;
}

export default LoadingSpinner;
