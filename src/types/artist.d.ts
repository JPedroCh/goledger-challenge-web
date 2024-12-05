type Artist = {
  "@assetType": string;
  name: string;
  country: string;
  "@key": string;
};

type ArtistSelector = {
  "@assetType": string;
  name?: string;
  country?: string;
  "@key"?: string;
};

type FetchArtistPayload = {
  query: {
    selector: ArtistSelector;
  };
};

type CreateArtistPayload = {
  asset: [
    {
      "@assetType": "artist";
      name: string;
      country: string;
    }
  ];
};

type UpdateArtistPayload = {
  update: {
    "@assetType": "artist";
    name: string;
    country: string;
  };
};

type DeleteArtistPayload = {
  key: {
    "@assetType": "artist";
    name: string;
  };
};
