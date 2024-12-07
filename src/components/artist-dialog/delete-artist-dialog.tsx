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
import { useState } from "react";
import { DataListItem, DataListRoot } from "../data-list";
import { toaster, Toaster } from "../toaster";
import { sendRequest } from "../../services/request";
import { deleteAsset } from "../../services/assets";
import { Button } from "../button";

interface DeleteArtistDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  artist: Artist | undefined;
  refreshPage: () => void;
}
export default function DeleteArtistDialog({
  open,
  setOpen,
  artist,
  refreshPage,
}: DeleteArtistDialogProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDeleteArtist = async (payload: DeleteArtistPayload) => {
    const response = await sendRequest<RequestResult<Artist>>(
      deleteAsset(payload)
    );
    setIsLoading(false);

    if (response.type === "success") {
      toaster.success({
        title: "Success",
        description: "Artist deleted succesfully!",
        type: "success",
      });
      setOpen(false);
      refreshPage();
    } else if (response.type === "error") {
      toaster.error({
        title: "Error",
        description: "It was not possible to delete the artist!",
        type: "error",
      });
    }
  };

  const onSubmit = () => {
    setIsLoading(true);
    const payload: DeleteArtistPayload = {
      key: {
        "@assetType": "artist",
        name: artist?.name || "",
      },
    };

    handleDeleteArtist(payload);
  };

  return (
    <DialogRoot
      key={artist?.["@key"]}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Artist</DialogTitle>
        </DialogHeader>
        <DialogBody pb="4">
          <Stack gap="4">
            <Text fontSize={"15px"}>
              Are you sure you want to delete this artist?
            </Text>
            <DataListRoot orientation="horizontal" mb={4}>
              <DataListItem label="Name" value={artist?.name} />
              <DataListItem label="Country" value={artist?.country} />
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
