import { sendRequest } from "../request";
import { fetchAssets } from "../assets";
import { toaster } from "../../components/toaster";

type fetchSongsProps = {
  setResult: React.Dispatch<React.SetStateAction<Song[] | null>>;
  selector?: SongSelector;
};

export const handleFetchSongs = async ({
  setResult,
  selector = {
    "@assetType": "song",
  },
}: fetchSongsProps) => {
  const response = await sendRequest<RequestResult<Song[]>>(
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
      description: "It was not possible to fetch the songs!",
      type: "error",
    });
  }
};
