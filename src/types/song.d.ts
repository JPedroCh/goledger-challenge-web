type Song = {
  "@assetType": "song";
  name: string;
  "@key": string;
  album: {
    "@assetType": "album";
    "@key": string;
  };
};

type CompleteSongInfo = {
  "@assetType": "song";
  "@key": string;
  name: string;
  album: {
    "@assetType": "album";
    "@key": string;
    name: string;
    year: number;
  };
};

type SongSelector = {
  "@assetType": "song";
  name?: string;
  "@key"?: string;
  album?: {
    "@assetType": "album";
    "@key": string;
  };
};

type FetchSongsPayload = {
  query: {
    selector: SongSelector;
  };
};

type CreateSongPayload = {
  asset: [
    {
      "@assetType": "song";
      name: string;
      album: {
        "@assetType": "album";
        "@key": string;
      };
    }
  ];
};

type DeleteSongPayload = {
  key: {
    "@assetType": "song";
    name: string;
    album: {
      "@assetType": "album";
      "@key": string;
    };
  };
};
