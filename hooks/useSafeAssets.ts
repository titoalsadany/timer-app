import { useState, useEffect } from 'react';
import { Asset } from 'expo-asset';

interface AssetLoadResult {
  loaded: boolean;
  error: string | null;
  asset: any;
}

export function useSafeAsset(assetModule: number | null): AssetLoadResult {
  const [result, setResult] = useState<AssetLoadResult>({
    loaded: false,
    error: null,
    asset: null,
  });

  useEffect(() => {
    if (!assetModule) {
      setResult({ loaded: true, error: null, asset: null });
      return;
    }

    async function loadAsset() {
      try {
        const [loadedAsset] = await Asset.loadAsync([assetModule]);
        setResult({ loaded: true, error: null, asset: loadedAsset });
      } catch (error) {
        console.warn(`Failed to load asset:`, error);
        setResult({ 
          loaded: false, 
          error: `Asset loading failed`, 
          asset: null 
        });
      }
    }

    loadAsset();
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
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    async function loadCriticalAssets() {
      try {
        // Pre-load critical assets for the app
        const iconAsset = require('../assets/images/icon.png');
        await Asset.loadAsync([iconAsset]);
        setAssetsReady(true);
      } catch (error) {
        console.warn('Failed to load critical assets:', error);
        // Still set to true to allow app to continue
        setAssetsReady(true);
      }
    }

    loadCriticalAssets();
  }, []);

  return assetsReady;
}