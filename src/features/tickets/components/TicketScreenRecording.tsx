import {
  type ScreenRecording,
  formatTime,
} from '@artco-group/artco-ticketing-sync';
import type { TicketId } from '@/types';

interface TicketScreenRecordingProps {
  screenRecording: ScreenRecording;
  ticketId: TicketId;
  onDownload?: (ticketId: TicketId, filename: string) => void;
}

function TicketScreenRecording({
  screenRecording,
  ticketId,
  onDownload,
}: TicketScreenRecordingProps) {
  if (!screenRecording || !screenRecording.originalName) {
    return null;
  }

  const handleDownload = () => {
    if (onDownload && screenRecording.originalName) {
      onDownload(ticketId, screenRecording.originalName);
    }
  };

  const fileSizeMB = ((screenRecording.size ?? 0) / (1024 * 1024)).toFixed(2);

  return (
    <div className="mt-4">
      <h3 className="text-greyscale-700 mb-3 text-sm font-semibold">
        Snimak Ekrana
      </h3>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex-between mb-3">
          <div>
            <p className="text-greyscale-900 text-sm font-medium">
              {screenRecording.originalName}
            </p>
            <p className="text-greyscale-500 text-xs">
              {fileSizeMB} MB
              {screenRecording.duration && (
                <> • {formatTime(screenRecording.duration)}</>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="btn-primary w-full px-4 py-2 text-sm font-medium"
        >
          Preuzmi Video
        </button>
      </div>
    </div>
  );
}

export default TicketScreenRecording;
