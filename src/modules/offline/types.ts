export interface OfflineAsset {
  path: string;
  sha256: string;
}
export interface OfflineManifest {
  version: 1;
  release: string;
  build: string;
  base: string;
  assets: OfflineAsset[];
}
export interface OfflineStatus {
  ready: boolean;
  files: number;
  release: string;
}
