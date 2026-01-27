import { useState } from 'react';
import { Video } from 'lucide-react';
import { useScreenRecorder } from '@/shared/hooks/useScreenRecorder';
import { Icon } from '@/shared/components/ui';
import { formatTime } from '@artco-group/artco-ticketing-sync';
import { SCREEN_RECORDING } from '@/config';

interface ScreenRecorderProps {
  onRecordingComplete: (file: File | null, duration: number) => void;
  disabled?: boolean;
}

export default function ScreenRecorder({
  onRecordingComplete,
  disabled,
}: ScreenRecorderProps) {
  const [recordedVideo, setRecordedVideo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  const {
    recording,
    recordingTime,
    estimatedSize,
    maxDuration,
    error,
    startRecording,
    stopRecording,
  } = useScreenRecorder({
    maxDuration: SCREEN_RECORDING.MAX_DURATION_SECONDS,
    bitrate: SCREEN_RECORDING.BITRATE,
    onComplete: (file, actualDuration) => {
      setRecordedVideo(file);
      setDuration(actualDuration);
      setPreviewUrl(URL.createObjectURL(file));
      setConfirmed(false); // Reset confirmation state
    },
  });

  const handleConfirm = () => {
    if (recordedVideo) {
      setConfirmed(true);
      onRecordingComplete(recordedVideo, duration);
    }
  };

  const handleDiscard = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setRecordedVideo(null);
    setDuration(0);
    setPreviewUrl(null);
    setConfirmed(false);
  };

  const handleRemove = () => {
    handleDiscard();
    onRecordingComplete(null, 0);
  };

  // State 3: Recording confirmed - show compact preview with remove button
  if (confirmed && previewUrl && recordedVideo) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex-between mb-3">
          <div>
            <p className="text-greyscale-900 text-sm font-medium">
              🎥 Snimak Ekrana
            </p>
            <p className="text-greyscale-500 text-xs">
              {(recordedVideo.size / (1024 * 1024)).toFixed(2)} MB •{' '}
              {formatTime(duration)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-error-500 hover:text-error-600 transition-colors"
          >
            <Icon name="close" size="lg" />
          </button>
        </div>

        <video
          src={previewUrl}
          controls
          className="w-full rounded-lg"
          style={{ maxHeight: '300px' }}
        />
      </div>
    );
  }

  // State 2: Recording finished - show preview with confirm/discard buttons
  if (!confirmed && previewUrl && recordedVideo && !recording) {
    return (
      <div className="border-brand-primary rounded-lg border-2 bg-blue-100 p-4">
        <p className="text-greyscale-900 mb-3 text-sm font-medium">
          Pregled snimka ({(recordedVideo.size / (1024 * 1024)).toFixed(2)} MB)
        </p>

        <video
          src={previewUrl}
          controls
          className="mb-3 w-full rounded-lg"
          style={{ maxHeight: '300px' }}
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleConfirm}
            className="btn-primary flex-1"
          >
            ✓ Potvrdi
          </button>
          <button
            type="button"
            onClick={handleDiscard}
            className="btn-secondary flex-1"
          >
            ✗ Odbaci
          </button>
        </div>
      </div>
    );
  }

  // State 1b: Recording in progress
  if (recording) {
    return (
      <div className="border-error-500 bg-error-100 rounded-lg border-2 p-4">
        <div className="flex-between mb-3">
          <div>
            <p className="text-error-700 flex items-center text-sm font-medium">
              <span className="bg-error-500 mr-2 inline-block h-2 w-2 animate-pulse rounded-full"></span>
              Snimanje u toku...
            </p>
            <p className="text-greyscale-600 text-xs">
              {formatTime(recordingTime)} / {formatTime(maxDuration)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-greyscale-900 text-sm font-medium">
              ~{estimatedSize.toFixed(1)} MB
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={stopRecording}
          className="btn-destructive w-full"
        >
          ⏹️ Zaustavi Snimanje
        </button>

        <p className="text-greyscale-500 mt-2 text-xs">
          Kliknite na dugme ili zatvorite dijeljenje ekrana za zaustavljanje
        </p>
      </div>
    );
  }

  // State 1a: Ready to record
  return (
    <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
      <div className="text-center">
        <Video className="text-greyscale-400 mx-auto h-12 w-12" />

        <p className="text-greyscale-900 mt-2 text-sm font-medium">
          Snimite Problem
        </p>
        <p className="text-greyscale-500 mt-1 text-xs">
          Maksimalno 3 minute • ~22 MB
        </p>

        <button
          type="button"
          onClick={startRecording}
          disabled={disabled}
          className="btn-primary mt-3"
        >
          Započni Snimanje
        </button>

        {error && <p className="text-error-500 mt-2 text-xs">{error}</p>}
      </div>
    </div>
  );
}
