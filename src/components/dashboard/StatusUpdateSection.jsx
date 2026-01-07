import { useState } from 'react';

function StatusUpdateSection({ currentStatus, ticketId, onStatusUpdate }) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const statusOptions = [
    { value: 'New', label: 'New' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Resolved', label: 'Resolved' },
  ];

  const handleStatusUpdate = async () => {
    if (selectedStatus === currentStatus) return;

    setIsUpdating(true);

    try {
      await onStatusUpdate(ticketId, selectedStatus);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Update Status
      </h2>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label
            htmlFor="status-select"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Current Status
          </label>
          <select
            id="status-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="shrink-0 pt-6">
          <button
            onClick={handleStatusUpdate}
            disabled={selectedStatus === currentStatus || isUpdating}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedStatus === currentStatus || isUpdating
                ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                : 'bg-[#004179] text-white hover:bg-[#003366]'
            }`}
          >
            {isUpdating ? (
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Updating...
              </div>
            ) : (
              'Update Status'
            )}
          </button>
        </div>
      </div>

      <p className="mt-2 text-xs text-gray-500">
        Change status to reflect current work progress
      </p>

      {showSuccess && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-green-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-sm font-medium text-green-600">
              Status updated successfully
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusUpdateSection;
