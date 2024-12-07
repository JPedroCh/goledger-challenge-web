import { sendRequest } from "../request";
import { fetchAssets, readAsset } from "../assets";
import { toaster } from "../../components/toaster";

type fetchAlbumsProps = {
  setResult: React.Dispatch<React.SetStateAction<Album[] | null>>;
  selector?: AlbumSelector;
};

export const handleFetchAlbums = async ({
  setResult,
  selector = {
    "@assetType": "album",
  },
}: fetchAlbumsProps) => {
  const response = await sendRequest<RequestResult<Album[]>>(
    fetchAssets({
      query: {
        selector,
      },
    })
  );

  if (response.type === "success") {
    setResult(response?.value?.result);
  } else if (response.type === "error") {
    toaster.error({
      title: "Error",
      description: "It was not possible to fetch the albums!",
      type: "error",
    });
  }
};

type fetchAlbumInfoProps = {
  setResult: React.Dispatch<React.SetStateAction<Album | null>>;
  key: string;
};

export const handleFetchAlbumInfo = async ({
  setResult,
  key,
}: fetchAlbumInfoProps) => {
  const response = await sendRequest<Album>(
    readAsset({
      key: {
        "@assetType": "album",
        "@key": key,
      },
    })
  );

  if (response.type === "success") {
    setResult(response?.value);
  } else if (response.type === "error") {
    toaster.error({
      title: "Error",
      description: "It was not possible to fetch the album info!",
      type: "error",
    });
  }
};
