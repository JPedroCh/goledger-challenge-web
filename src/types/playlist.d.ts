type SongWithOnlyKey = {
  "@assetType": "song";
  "@key": string;
};

type Playlist = {
  "@assetType": "playlist";
  name: string;
  private: boolean;
  "@key": string;
  songs: SongWithOnlyKey[];
};

type PlaylistSelector = {
  "@assetType": "playlist";
  name?: string;
  private?: boolean;
  "@key"?: string;
  songs?: SongWithOnlyKey[];
};

type FetchPlaylistPayload = {
  query: {
    selector: PlaylistSelector;
  };
};

type CreatePlaylistPayload = {
  asset: [
    {
      "@assetType": "playlist";
      name: string;
      private: boolean;
      songs: SongWithOnlyKey[];
    }
  ];
};

type UpdatePlaylistPayload = {
  update: {
    "@assetType": "playlist";
    name: string;
    private: boolean;
    songs: SongWithOnlyKey[];
  };
};

type DeletePlaylistPayload = {
  key: {
    "@assetType": "playlist";
    name: string;
  };
};
