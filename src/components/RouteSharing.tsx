import { useState } from 'react';
import type { SharedRoute } from '../types';
import { generateShareableLink, copyToClipboard, shareRoute } from '../utils/routeSharing';

interface RouteSharingProps {
  route: SharedRoute;
  onClose?: () => void;
}

export const RouteSharing = ({ route, onClose }: RouteSharingProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showLink, setShowLink] = useState(false);

  const handleCopyLink = async () => {
    const shareableLink = generateShareableLink(route);
    const success = await copyToClipboard(shareableLink);
    
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    const success = await shareRoute(route);
    setIsSharing(false);
    
    if (success && onClose) {
      onClose();
    }
  };

  const shareableLink = generateShareableLink(route);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[2000] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Share Route
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Route Details</div>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium">From:</span> {route.startCity}</div>
              <div><span className="font-medium">To:</span> {route.endCity}</div>
              <div><span className="font-medium">Algorithm:</span> {route.algorithm.toUpperCase()}</div>
              <div><span className="font-medium">Distance:</span> {route.totalDistance.toFixed(2)} km</div>
              {route.roadDistance > 0 && (
                <div><span className="font-medium">Road Distance:</span> {route.roadDistance.toFixed(2)} km</div>
              )}
              <div><span className="font-medium">Nodes Explored:</span> {route.nodesExplored}</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {isSharing ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sharing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share Route
                </>
              )}
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full btn-secondary flex items-center justify-center gap-2"
            >
              {isCopied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
                </>
              )}
            </button>

            <button
              onClick={() => setShowLink(!showLink)}
              className="w-full text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            >
              {showLink ? 'Hide' : 'Show'} Shareable Link
            </button>

            {showLink && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Shareable Link:</div>
                <div className="text-xs break-all bg-white dark:bg-gray-600 p-2 rounded border">
                  {shareableLink}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 