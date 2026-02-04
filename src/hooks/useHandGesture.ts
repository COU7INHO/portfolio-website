import { useRef, useState, useCallback, useEffect } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

export type Gesture = 'up' | 'down' | 'neutral';

export function useHandGesture() {
  const [isActive, setIsActive] = useState(false);
  const [gesture, setGesture] = useState<Gesture>('neutral');
  const videoRef = useRef<HTMLVideoElement>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const animFrameRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const lastTimestampRef = useRef<number>(-1);

  const detectGestureFromLandmarks = useCallback(
    (landmarks: { x: number; y: number; z: number }[]): Gesture => {
      if (landmarks.length < 21) return 'neutral';

      // MediaPipe normalized coords: y=0 is top, y=1 is bottom
      const wrist = landmarks[0];
      const indexMcp = landmarks[5];  // index finger base
      const indexTip = landmarks[8];  // index finger tip
      const middleTip = landmarks[12];
      const middleMcp = landmarks[9];
      const ringTip = landmarks[16];
      const ringMcp = landmarks[13];
      const pinkyTip = landmarks[20];
      const pinkyMcp = landmarks[17];

      // Index finger extended upward: tip well above its MCP
      const indexExtended = indexTip.y < indexMcp.y - 0.05;
      // Index finger pointing down: tip well below wrist
      const indexPointingDown = indexTip.y > wrist.y + 0.05;

      // Other fingers closed: tips at or below their MCPs
      const middleClosed = middleTip.y > middleMcp.y - 0.02;
      const ringClosed = ringTip.y > ringMcp.y - 0.02;
      const pinkyClosed = pinkyTip.y > pinkyMcp.y - 0.02;
      const othersClosed = middleClosed && ringClosed && pinkyClosed;

      if (indexExtended && othersClosed) return 'up';
      if (indexPointingDown && othersClosed) return 'down';
      return 'neutral';
    },
    []
  );

  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;

    if (!video || !landmarker || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const timestamp = performance.now();
    if (timestamp === lastTimestampRef.current) {
      animFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }
    lastTimestampRef.current = timestamp;

    try {
      const results = landmarker.detectForVideo(video, timestamp);
      if (results.landmarks && results.landmarks.length > 0) {
        const detected = detectGestureFromLandmarks(results.landmarks[0]);
        setGesture(detected);
      } else {
        setGesture('neutral');
      }
    } catch {
      // Skip frame on error
    }

    animFrameRef.current = requestAnimationFrame(processFrame);
  }, [detectGestureFromLandmarks]);

  // Handle scrolling based on gesture
  useEffect(() => {
    if (!isActive || gesture === 'neutral') return;

    let scrollFrame: number;
    const scrollSpeed = gesture === 'up' ? -5 : 5;

    const doScroll = () => {
      window.scrollBy({ top: scrollSpeed, behavior: 'instant' });
      scrollFrame = requestAnimationFrame(doScroll);
    };

    scrollFrame = requestAnimationFrame(doScroll);
    return () => cancelAnimationFrame(scrollFrame);
  }, [isActive, gesture]);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 320, height: 240 },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      if (!landmarkerRef.current) {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
        });
      }

      setIsActive(true);
      lastTimestampRef.current = -1;
      animFrameRef.current = requestAnimationFrame(processFrame);
    } catch (err) {
      console.error('Hand gesture init failed:', err);
    }
  }, [processFrame]);

  const stop = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsActive(false);
    setGesture('neutral');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return { isActive, start, stop, gesture, videoRef };
}
