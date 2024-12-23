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
import { errorTreatment } from "../../services/error-treatment";

interface DeleteAlbumDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  album: CompleteAlbumInfo | undefined;
  refreshPage: () => void;
}
export default function DeleteAlbumDialog({
  open,
  setOpen,
  album,
  refreshPage,
}: DeleteAlbumDialogProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleDeleteAlbum = async (payload: DeleteAlbumPayload) => {
    const response = await sendRequest<RequestResult<Album>>(
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
        description: errorTreatment(response.error, "album"),
        type: "error",
      });
    }
  };

  const onSubmit = () => {
    setIsLoading(true);
    const payload: DeleteAlbumPayload = {
      key: {
        "@assetType": "album",
        name: album?.name || "",
        artist: {
          "@assetType": "artist",
          "@key": album?.artist?.["@key"] || "",
        },
      },
    };

    handleDeleteAlbum(payload);
  };

  return (
    <DialogRoot
      key={album?.["@key"]}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Album</DialogTitle>
        </DialogHeader>
        <DialogBody pb="4">
          <Stack gap="4">
            <Text fontSize={"15px"}>
              Are you sure you want to delete this album?
            </Text>
            <DataListRoot
              orientation={{ mdDown: "vertical", md: "horizontal" }}
              mb={4}
            >
              <DataListItem label="Name" value={album?.name} />
              <DataListItem label="Year" value={album?.year} />
              <DataListItem label="Artist" value={album?.artist?.name} />
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
