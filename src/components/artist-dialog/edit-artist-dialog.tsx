import { Input, Stack } from "@chakra-ui/react";
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { DataListItem, DataListRoot } from "../data-list";
import { toaster, Toaster } from "../toaster";
import { sendRequest } from "../../services/request";
import { updateAsset } from "../../services/assets";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../button";

interface EditArtistDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  artist: Artist | undefined;
  refreshPage: () => void;
}

const formSchema = z.object({
  country: z.string().min(2, { message: "Country is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditArtistDialog({
  open,
  setOpen,
  artist,
  refreshPage,
}: EditArtistDialogProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: artist?.country,
    },
  });

  const handleUpdateArtist = async (payload: UpdateArtistPayload) => {
    const response = await sendRequest<RequestResult<Artist>>(
      updateAsset(payload)
    );
    setIsLoading(false);

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
  };

  const onSubmit = handleSubmit((data) => {
    setIsLoading(true);
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
              <DataListRoot
                orientation={{ mdDown: "vertical", md: "horizontal" }}
                mb={4}
              >
                <DataListItem label="Current Name" value={artist?.name} />
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
                  {...register("country")}
                />
              </Field>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button
                variant="outline"
                _hover={{ bgColor: "red", color: "white" }}
                onClick={() => resetField("country")}
              >
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button
              type="submit"
              bgColor="secondary"
              _hover={{ bgColor: "primary" }}
              loading={isLoading}
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
