export const createRouteAnimation = (
  duration: number = 3000,
  onProgress?: (progress: number) => void,
  onComplete?: () => void
): (() => void) => {
  let animationId: number;
  let startTime: number;
  let isCancelled = false;

  const animate = (currentTime: number) => {
    if (isCancelled) return;

    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    if (onProgress) {
      onProgress(progress);
    }

    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      if (onComplete) {
        onComplete();
      }
    }
  };

  animationId = requestAnimationFrame(animate);

  return () => {
    isCancelled = true;
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
};

export const interpolatePath = (
  path: [number, number][],
  progress: number
): [number, number][] => {
  if (path.length < 2) return path;

  const totalDistance = path.reduce((acc, point, index) => {
    if (index === 0) return 0;
    const prev = path[index - 1];
    return acc + Math.sqrt(
      Math.pow(point[0] - prev[0], 2) + Math.pow(point[1] - prev[1], 2)
    );
  }, 0);

  const targetDistance = totalDistance * progress;
  let currentDistance = 0;
  const result: [number, number][] = [];

  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];
    const segmentDistance = Math.sqrt(
      Math.pow(next[0] - current[0], 2) + Math.pow(next[1] - current[1], 2)
    );

    if (currentDistance + segmentDistance >= targetDistance) {
      const segmentProgress = (targetDistance - currentDistance) / segmentDistance;
      const interpolatedPoint: [number, number] = [
        current[0] + (next[0] - current[0]) * segmentProgress,
        current[1] + (next[1] - current[1]) * segmentProgress
      ];
      result.push(interpolatedPoint);
      break;
    }

    result.push(current);
    currentDistance += segmentDistance;
  }

  return result;
};

export const calculateAnimationProgress = (
  totalSegments: number,
  currentSegment: number
): number => {
  return currentSegment / totalSegments;
};

export const getAnimatedPathStyle = (
  isAnimating: boolean,
  baseStyle: { weight: number; color: string; opacity: number }
): { weight: number; color: string; opacity: number; dashArray?: string } => {
  if (isAnimating) {
    return {
      ...baseStyle,
      dashArray: '10, 5',
      opacity: baseStyle.opacity * 0.8
    };
  }
  return baseStyle;
}; 