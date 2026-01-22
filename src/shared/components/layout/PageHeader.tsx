import type { ReactNode } from 'react';

interface PageHeaderProps {
  title?: string;
  userEmail: string;
  onLogout: () => void;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  maxWidth?: string;
}

function PageHeader({
  title,
  userEmail,
  onLogout,
  leftContent,
  rightContent,
  maxWidth = 'max-w-7xl',
}: PageHeaderProps) {
  return (
    <header className="dashboard-header border-b border-gray-200 bg-white px-6 py-4">
      <div className={`mx-auto flex ${maxWidth} items-center justify-between`}>
        {/* Left side - either custom content or title */}
        {leftContent || (
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        )}

        {/* Right side */}
        <div className="flex items-center gap-6">
          {rightContent}
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-600">{userEmail}</span>
            <button
              onClick={onLogout}
              className="text-primary-500 hover:text-primary-600 font-medium hover:underline"
            >
              Odjava
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default PageHeader;
