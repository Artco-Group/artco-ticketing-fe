import { useState } from 'react';
import {
  useScreenRecorder,
  formatTime,
} from '@/shared/hooks/useScreenRecorder';

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
    maxDuration: 180, // 3 minutes
    bitrate: 1000000, // 1 Mbps
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
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              🎥 Snimak Ekrana
            </p>
            <p className="text-xs text-gray-500">
              {(recordedVideo.size / (1024 * 1024)).toFixed(2)} MB •{' '}
              {formatTime(duration)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-600 transition-colors hover:text-red-700"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
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
      <div className="rounded-lg border-2 border-[#004179] bg-blue-50 p-4">
        <p className="mb-3 text-sm font-medium text-gray-900">
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
            className="flex-1 rounded-lg bg-[#004179] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#003366]"
          >
            ✓ Potvrdi
          </button>
          <button
            type="button"
            onClick={handleDiscard}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
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
      <div className="rounded-lg border-2 border-red-500 bg-red-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="flex items-center text-sm font-medium text-red-900">
              <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-red-500"></span>
              Snimanje u toku...
            </p>
            <p className="text-xs text-gray-600">
              {formatTime(recordingTime)} / {formatTime(maxDuration)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              ~{estimatedSize.toFixed(1)} MB
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={stopRecording}
          className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          ⏹️ Zaustavi Snimanje
        </button>

        <p className="mt-2 text-xs text-gray-500">
          Kliknite na dugme ili zatvorite dijeljenje ekrana za zaustavljanje
        </p>
      </div>
    );
  }

  // State 1a: Ready to record
  return (
    <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>

        <p className="mt-2 text-sm font-medium text-gray-900">
          Snimite Problem
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Maksimalno 3 minute • ~22 MB
        </p>

        <button
          type="button"
          onClick={startRecording}
          disabled={disabled}
          className="mt-3 rounded-lg bg-[#004179] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#003366] disabled:cursor-not-allowed disabled:opacity-50"
        >
          🎥 Započni Snimanje
        </button>

        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
