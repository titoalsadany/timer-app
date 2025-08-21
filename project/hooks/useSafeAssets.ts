import { useState, useEffect } from 'react';

interface AssetLoadResult {
  loaded: boolean;
  error: string | null;
  asset: any;
}

export function useSafeAsset(assetPath: string | null): AssetLoadResult {
  const [result, setResult] = useState<AssetLoadResult>({
    loaded: false,
    error: null,
    asset: null,
  });

  useEffect(() => {
    if (!assetPath) {
      setResult({ loaded: true, error: null, asset: null });
      return;
    }

    try {
      const asset = require(assetPath);
      setResult({ loaded: true, error: null, asset });
    } catch (error) {
      console.warn(`Failed to load asset: ${assetPath}`, error);
      setResult({ 
        loaded: false, 
        error: `Asset not found: ${assetPath}`, 
        asset: null 
      });
    }
  }, [assetPath]);

  return result;
}

export function useSafeVideoAsset(videoPath: string | null): AssetLoadResult {
  return useSafeAsset(videoPath);
}

export function useSafeLottieAsset(lottiePath: string | null): AssetLoadResult {
  return useSafeAsset(lottiePath);
} 