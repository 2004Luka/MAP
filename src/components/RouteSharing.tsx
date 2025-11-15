import { useState } from 'react';
import { X, Share2, Copy, Check, ExternalLink } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-fade-in">
      <div className="card max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-text-header dark:text-neutral-50 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Share Route
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-body dark:hover:text-neutral-300 p-2 rounded-lg hover:bg-bg-hover dark:hover:bg-neutral-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="space-y-5">
          <div className="bg-gradient-to-br from-bg-subtle to-bg-hover dark:from-neutral-700/50 dark:to-neutral-800/50 rounded-xl p-4 border border-border-light dark:border-neutral-600">
            <div className="text-sm font-semibold text-text-body dark:text-neutral-300 mb-3">Route Details</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-text-muted dark:text-neutral-400">From:</span>
                <span className="text-text-header dark:text-neutral-200 font-semibold">{route.startCity}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-text-muted dark:text-neutral-400">To:</span>
                <span className="text-text-header dark:text-neutral-200 font-semibold">{route.endCity}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-text-muted dark:text-neutral-400">Algorithm:</span>
                <span className="text-text-header dark:text-neutral-200 font-semibold">{route.algorithm.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-text-muted dark:text-neutral-400">Distance:</span>
                <span className="text-text-header dark:text-neutral-200 font-semibold">{route.totalDistance.toFixed(2)} km</span>
              </div>
              {route.roadDistance > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium text-text-muted dark:text-neutral-400">Road Distance:</span>
                  <span className="text-text-header dark:text-neutral-200 font-semibold">{route.roadDistance.toFixed(2)} km</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium text-text-muted dark:text-neutral-400">Nodes Explored:</span>
                <span className="text-text-header dark:text-neutral-200 font-semibold">{route.nodesExplored.toLocaleString()}</span>
              </div>
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
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
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
                  <Check className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Link
                </>
              )}
            </button>

            <button
              onClick={() => setShowLink(!showLink)}
              className="w-full text-sm text-text-muted dark:text-neutral-400 hover:text-text-header dark:hover:text-neutral-200 font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              {showLink ? 'Hide' : 'Show'} Shareable Link
            </button>

            {showLink && (
              <div className="bg-gradient-to-br from-bg-subtle to-bg-hover dark:from-neutral-700/50 dark:to-neutral-800/50 rounded-xl p-4 border border-border-light dark:border-neutral-600 animate-slide-down">
                <div className="text-xs font-semibold text-text-muted dark:text-neutral-400 mb-2">Shareable Link:</div>
                <div className="text-xs break-all bg-bg-card dark:bg-neutral-800 p-3 rounded-lg border border-border-light dark:border-neutral-600 text-text-body dark:text-neutral-300 font-mono">
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
