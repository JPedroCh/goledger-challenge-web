import { sendRequest } from "../request";
import { fetchAssets } from "../assets";
import { toaster } from "../../components/toaster";

type fetchArtistsProps = {
  setResult: React.Dispatch<React.SetStateAction<Artist[] | null>>;
  selector?: ArtistSelector;
};

export const handleFetchArtists = async ({
  setResult,
  selector = {
    "@assetType": "artist",
  },
}: fetchArtistsProps) => {
  const response = await sendRequest<RequestResult<Artist[]>>(
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
      description: "It was not possible to fetch the artists!",
      type: "error",
    });
  }
};

type fetchArtistInfoProps = {
  setResult: React.Dispatch<React.SetStateAction<Artist | null>>;
  selector: ArtistSelector;
};

export const handleFetchArtistInfo = async ({
  setResult,
  selector,
}: fetchArtistInfoProps) => {
  const response = await sendRequest<RequestResult<Artist[]>>(
    fetchAssets({
      query: {
        selector,
      },
    })
  );

  if (response.type === "success") {
    setResult(response?.value?.result?.[0]);
  } else if (response.type === "error") {
    toaster.error({
      title: "Error",
      description: "It was not possible to fetch the artist info!",
      type: "error",
    });
  }
};
