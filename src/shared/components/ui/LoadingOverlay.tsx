interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({
  message = 'Loading...',
}: LoadingOverlayProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#004179]"></div>
        </div>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}
