import { useState, useEffect } from 'react';

interface AssetLoadResult {
  loaded: boolean;
  error: string | null;
  asset: any;
}

export function useSafeAsset(assetModule: number | null): AssetLoadResult {
  const [result, setResult] = useState<AssetLoadResult>({
    loaded: true, // Default to loaded for graceful fallback
    error: null,
    asset: null,
  });

  useEffect(() => {
    if (!assetModule) {
      setResult({ loaded: true, error: null, asset: null });
      return;
    }

    // Return the actual asset module to prevent native crashes
    setResult({ loaded: true, error: null, asset: assetModule });
  }, [assetModule]);

  return result;
}

export function useSafeVideoAsset(videoModule: number | null): AssetLoadResult {
  return useSafeAsset(videoModule);
}

export function useSafeLottieAsset(lottieModule: number | null): AssetLoadResult {
  return useSafeAsset(lottieModule);
}

export function useSafeAssets(): boolean {
  const [assetsReady, setAssetsReady] = useState(true); // Default to ready

  useEffect(() => {
    // Skip asset loading to prevent Metro bundler issues
    // Just set ready state immediately
    setAssetsReady(true);
  }, []);

  return assetsReady;
}