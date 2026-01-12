import { useState, useRef, useEffect } from 'react';

export function useScreenRecorder({ 
  maxDuration = 180,  // 3 minutes (180 seconds)
  bitrate = 1000000,  // 1 Mbps
  onComplete 
}) {
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [estimatedSize, setEstimatedSize] = useState(0);
  const [error, setError] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const startTimeRef = useRef(0);

  // Calculate estimated file size in real-time
  useEffect(() => {
    if (recording) {
      // Formula: (bitrate in Mbps) * seconds / 8 = MB
      const sizeMB = (bitrate / 1000000) * recordingTime / 8;
      setEstimatedSize(sizeMB);
    }
  }, [recordingTime, recording, bitrate]);

  const startRecording = async () => {
    try {
      setError(null);
      
      // Request screen capture WITHOUT audio
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 24 },
        },
        audio: false, // Don't capture system audio
      });

      // Request microphone separately
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true, // Helps normalize microphone volume
        },
      });

      // Combine video from screen and audio from microphone
      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...micStream.getAudioTracks(),
      ]);

      // Store both streams for cleanup
      streamRef.current = { screen: screenStream, mic: micStream, combined: combinedStream };
      startTimeRef.current = Date.now();

      // Choose best available codec
      const options = { videoBitsPerSecond: bitrate };
      
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        options.mimeType = 'video/webm;codecs=vp9';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        options.mimeType = 'video/webm;codecs=vp8';
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        options.mimeType = 'video/webm';
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        options.mimeType = 'video/mp4';
      }

      const mediaRecorder = new MediaRecorder(combinedStream, options);
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const actualDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        
        const blob = new Blob(chunksRef.current, { 
          type: options.mimeType || 'video/webm' 
        });
        
        // Create File object for upload
        const file = new File(
          [blob], 
          `screen-recording-${Date.now()}.webm`, 
          { type: blob.type }
        );
        
        // Pass file and actual duration to parent
        onComplete?.(file, actualDuration);
        cleanup();
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('Greška tokom snimanja');
        cleanup();
      };

      // Handle user clicking "Stop Sharing" in browser
      screenStream.getVideoTracks()[0].onended = () => {
        stopRecording();
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second
      setRecording(true);

      // Start timer with auto-stop at max duration
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          
          if (newTime >= maxDuration) {
            stopRecording();
            alert('Snimanje automatski zaustavljeno nakon 3 minute');
          }
          
          return newTime;
        });
      }, 1000);

    } catch (err) {
      console.error('Error starting recording:', err);
      
      if (err.name === 'NotAllowedError') {
        setError('Potrebna je dozvola za snimanje ekrana');
      } else if (err.name === 'NotSupportedError') {
        setError('Vaš browser ne podržava snimanje ekrana');
      } else {
        setError('Greška pri pokretanju snimanja');
      }
      
      cleanup();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const cleanup = () => {
    clearInterval(timerRef.current);
    
    // Stop all tracks from both screen and microphone streams
    if (streamRef.current?.screen) {
      streamRef.current.screen.getTracks().forEach((track) => track.stop());
    }
    if (streamRef.current?.mic) {
      streamRef.current.mic.getTracks().forEach((track) => track.stop());
    }
    if (streamRef.current?.combined) {
      streamRef.current.combined.getTracks().forEach((track) => track.stop());
    }
    
    setRecordingTime(0);
    setEstimatedSize(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, []);

  return {
    recording,
    recordingTime,
    estimatedSize,
    maxDuration,
    error,
    startRecording,
    stopRecording,
  };
}

// Helper function to format time (seconds to MM:SS)
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

