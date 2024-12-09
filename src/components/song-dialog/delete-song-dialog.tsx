import { Stack, Text } from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../dialog";
import { DataListItem, DataListRoot } from "../data-list";
import { toaster, Toaster } from "../toaster";
import { sendRequest } from "../../services/request";
import { deleteAsset } from "../../services/assets";
import { Button } from "../button";
import { useState } from "react";

interface DeleteSongDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  song: CompleteSongInfo | undefined;
  refreshPage: () => void;
}
export default function DeleteSongDialog({
  open,
  setOpen,
  song,
  refreshPage,
}: DeleteSongDialogProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleDeleteSong = async (payload: DeleteSongPayload) => {
    const response = await sendRequest<RequestResult<Song>>(
      deleteAsset(payload)
    );
    setIsLoading(false);

    if (response.type === "success") {
      toaster.success({
        title: "Success",
        description: "Song deleted succesfully!",
        type: "success",
      });
      setOpen(false);
      refreshPage();
    } else if (response.type === "error") {
      toaster.error({
        title: "Error",
        description: "It was not possible to delete the song!",
        type: "error",
      });
    }
  };

  const onSubmit = () => {
    setIsLoading(true);
    const payload: DeleteSongPayload = {
      key: {
        "@assetType": "song",
        name: song?.name || "",
        album: {
          "@assetType": "album",
          "@key": song?.album?.["@key"] || "",
        },
      },
    };

    handleDeleteSong(payload);
  };

  return (
    <DialogRoot
      key={song?.["@key"]}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Song</DialogTitle>
        </DialogHeader>
        <DialogBody pb="4">
          <Stack gap="4">
            <Text fontSize={"15px"}>
              Are you sure you want to delete this song?
            </Text>
            <DataListRoot orientation="horizontal" mb={4}>
              <DataListItem label="Name" value={song?.name} />
              <DataListItem label="Album's Name" value={song?.album?.name} />
              <DataListItem label="Album's Year" value={song?.album?.year} />
            </DataListRoot>
          </Stack>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button
              variant="outline"
              _hover={{ bgColor: "red", color: "white" }}
            >
              Cancel
            </Button>
          </DialogActionTrigger>
          <Button
            bgColor="secondary"
            _hover={{ bgColor: "primary" }}
            onClick={() => onSubmit()}
            loading={isLoading}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
      <Toaster />
    </DialogRoot>
  );
}
