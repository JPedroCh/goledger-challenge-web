type Album = {
  "@assetType": "album";
  name: string;
  year: number;
  "@key": string;
  artist: {
    "@assetType": "artist";
    "@key": string;
  };
};

type CompleteAlbumInfo = {
  "@assetType": "album";
  "@key": string;
  name: string;
  year: string;
  artist: {
    "@assetType": "artist";
    "@key": string;
    name: string;
    country: string;
  };
};

type AlbumSelector = {
  "@assetType": "album";
  name?: string;
  year?: number;
  "@key"?: string;
  artist?: {
    "@assetType": "artist";
    "@key": string;
  };
};

type FetchAlbumsPayload = {
  query: {
    selector: AlbumSelector;
  };
};

type CreateAlbumPayload = {
  asset: [
    {
      "@assetType": "album";
      name: string;
      year: number;
      artist: {
        "@assetType": "artist";
        "@key": string;
      };
    }
  ];
};

type UpdateAlbumPayload = {
  update: {
    "@assetType": "album";
    name: string;
    year: number;
    artist: {
      "@assetType": "artist";
      "@key": string;
    };
  };
};

type DeleteAlbumPayload = {
  key: {
    "@assetType": "album";
    name: string;
    artist: {
      "@assetType": "artist";
      "@key": string;
    };
  };
};
