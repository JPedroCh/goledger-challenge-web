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
import { toaster, Toaster } from "../toaster";
import { sendRequest } from "../../services/request";
import { createAsset } from "../../services/assets";

interface CreateArtistDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refreshPage: () => void;
}

interface FormValues {
  name: string;
  country: string;
}

export default function CreateArtistDialog({
  open,
  setOpen,
  refreshPage,
}: CreateArtistDialogProps) {
  const ref = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<FormValues>();

  const handleCreateArtist = useCallback(
    async (payload: CreateArtistPayload) => {
      const response = await sendRequest<Result<Artist>>(createAsset(payload));

      if (response.type === "success") {
        toaster.success({
          title: "Success",
          description: "Artist created succesfully!",
          type: "success",
        });
        setOpen(false);
        refreshPage();
        resetField("name");
        resetField("country");
      } else if (response.type === "error") {
        toaster.error({
          title: "Error",
          description: "It was not possible to create the artist!",
          type: "error",
        });
      }
    },
    []
  );

  const onSubmit = handleSubmit((data) => {
    const payload: CreateArtistPayload = {
      asset: [
        {
          "@assetType": "artist",
          name: data?.name || "",
          country: data.country,
        },
      ],
    };

    handleCreateArtist(payload);
  });

  return (
    <DialogRoot
      initialFocusEl={() => ref.current}
      lazyMount
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Artist</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} id="create-artist-form">
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
                  {...register("name", { required: "Name is required" })}
                />
              </Field>
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
