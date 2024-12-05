import { Button, Input, Stack } from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../dialog";
import { Field } from "../field";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { DataListItem, DataListRoot } from "../data-list";
import { toaster, Toaster } from "../toaster";
import { sendRequest } from "../../services/request";
import { updateAsset } from "../../services/assets";

interface EditArtistDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  artist: Artist | undefined;
  refreshPage: () => void;
}

interface FormValues {
  name: string;
  country: string;
}

export default function EditArtistDialog({
  open,
  setOpen,
  artist,
  refreshPage,
}: EditArtistDialogProps) {
  const ref = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<FormValues>({
    defaultValues: {
      name: artist?.name,
      country: artist?.country,
    },
  });

  const handleUpdateArtist = useCallback(
    async (payload: UpdateArtistPayload) => {
      const response = await sendRequest<Result<Artist>>(updateAsset(payload));

      if (response.type === "success") {
        toaster.success({
          title: "Success",
          description: "Artist edited succesfully!",
          type: "success",
        });
        setOpen(false);
        refreshPage();
        resetField("country");
      } else if (response.type === "error") {
        toaster.error({
          title: "Error",
          description: "It was not possible to edit the artist!",
          type: "error",
        });
      }
    },
    []
  );

  const onSubmit = handleSubmit((data) => {
    const payload: UpdateArtistPayload = {
      update: {
        "@assetType": "artist",
        name: artist?.name || "",
        country: data.country,
      },
    };

    handleUpdateArtist(payload);
  });

  return (
    <DialogRoot
      key={artist?.["@key"]}
      initialFocusEl={() => ref.current}
      lazyMount
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Artist</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} id="edit-artist-form">
          <DialogBody pb="4">
            <Stack gap="4">
              <Field
                label="Name"
                invalid={!!errors.name}
                errorText={errors.name?.message}
              >
                <Input
                  placeholder="Insert the artist's name"
                  variant="subtle"
                  color="black"
                  value={artist?.name}
                  disabled
                  {...register("name")}
                />
              </Field>
              <DataListRoot orientation="vertical" mb={4}>
                <DataListItem label="Current Country" value={artist?.country} />
              </DataListRoot>
              <Field
                label="Country"
                invalid={!!errors.country}
                errorText={errors.country?.message}
              >
                <Input
                  placeholder="Insert the artist's country"
                  variant="subtle"
                  color="black"
                  {...register("country", { required: "Country is required" })}
                />
              </Field>
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
              type="submit"
              bgColor="secondary"
              _hover={{ bgColor: "primary" }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <Toaster />
    </DialogRoot>
  );
}
