import { useState } from 'react';
import { Video } from 'lucide-react';
import { useScreenRecorder } from '@/shared/hooks/useScreenRecorder';
import { Button, Icon } from '@/shared/components/ui';
import { formatTime } from '@artco-group/artco-ticketing-sync';
import { SCREEN_RECORDING } from '@/config';
import { cn } from '@/lib/utils';

interface ScreenRecorderProps {
  onRecordingComplete: (file: File | null, duration: number) => void;
  disabled?: boolean;
  variant?: 'standalone' | 'modal';
}

export default function ScreenRecorder({
  onRecordingComplete,
  disabled,
  variant = 'standalone',
}: ScreenRecorderProps) {
  const isModal = variant === 'modal';
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
      setConfirmed(false);
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
      <div
        className={cn(
          !isModal && 'border-border bg-muted/50 rounded-lg border p-4'
        )}
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-foreground text-sm font-medium">
              {disabled ? 'Uploading...' : 'Screen Recording'}
            </p>
            <p className="text-muted-foreground text-xs">
              {(recordedVideo.size / (1024 * 1024)).toFixed(2)} MB •{' '}
              {formatTime(duration)}
            </p>
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="text-destructive hover:text-destructive/80"
            >
              <Icon name="close" size="lg" />
            </Button>
          )}
        </div>

        <video
          src={previewUrl}
          controls
          className="max-h-[300px] w-full rounded-lg"
        />
      </div>
    );
  }

  if (!confirmed && previewUrl && recordedVideo && !recording) {
    return (
      <div
        className={cn(
          !isModal && 'border-primary bg-primary/5 rounded-lg border-2 p-4'
        )}
      >
        <p className="text-foreground mb-3 text-sm font-medium">
          Recording preview ({(recordedVideo.size / (1024 * 1024)).toFixed(2)}{' '}
          MB)
        </p>

        <video
          src={previewUrl}
          controls
          className="mb-3 max-h-[300px] w-full rounded-lg"
        />

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={disabled}
            className="flex-1"
          >
            {disabled ? 'Uploading...' : 'Confirm'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleDiscard}
            disabled={disabled}
            className="flex-1"
          >
            Discard
          </Button>
        </div>
      </div>
    );
  }

  if (recording) {
    return (
      <div
        className={cn(
          !isModal &&
            'border-destructive bg-destructive/10 rounded-lg border-2 p-4'
        )}
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-destructive flex items-center text-sm font-medium">
              <span className="bg-destructive mr-2 inline-block h-2 w-2 animate-pulse rounded-full"></span>
              Recording in progress...
            </p>
            <p className="text-muted-foreground text-xs">
              {formatTime(recordingTime)} / {formatTime(maxDuration)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-foreground text-sm font-medium">
              ~{estimatedSize.toFixed(1)} MB
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="destructive"
          onClick={stopRecording}
          className="w-full"
        >
          Stop Recording
        </Button>

        <p className="text-muted-foreground mt-2 text-xs">
          Click the button or stop screen sharing to finish
        </p>
      </div>
    );
  }

  // State 1a: Ready to record
  return (
    <div
      className={cn(
        'text-center',
        !isModal &&
          'rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4'
      )}
    >
      <Video className="text-muted-foreground mx-auto h-12 w-12" />

      <p className="text-foreground mt-2 text-sm font-medium">
        Record the Issue
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        Maximum 3 minutes • ~22 MB
      </p>

      <Button
        type="button"
        onClick={startRecording}
        disabled={disabled}
        className="mt-3"
      >
        Start Recording
      </Button>

      {error && <p className="text-destructive mt-2 text-xs">{error}</p>}
    </div>
  );
}
