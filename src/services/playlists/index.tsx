import { sendRequest } from "../request";
import { fetchAssets } from "../assets";
import { toaster } from "../../components/toaster";

type fetchPlaylistsProps = {
  setResult: React.Dispatch<React.SetStateAction<Playlist[] | null>>;
  selector?: PlaylistSelector;
};

export const handleFetchPlaylists = async ({
  setResult,
  selector = {
    "@assetType": "playlist",
  },
}: fetchPlaylistsProps) => {
  const response = await sendRequest<RequestResult<Playlist[]>>(
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
      description: "It was not possible to fetch the playlists!",
      type: "error",
    });
  }
};
