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
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toaster, Toaster } from "../toaster";
import { sendRequest } from "../../services/request";
import { createAsset } from "../../services/assets";
import { Button } from "../button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { errorTreatment } from "../../services/error-treatment";

interface CreateArtistDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refreshPage: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  country: z.string().min(2, { message: "Country is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateArtistDialog({
  open,
  setOpen,
  refreshPage,
}: CreateArtistDialogProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleCreateArtist = async (payload: CreateArtistPayload) => {
    const response = await sendRequest<RequestResult<Artist>>(
      createAsset(payload)
    );
    setIsLoading(false);

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
        title: `Error`,
        description: errorTreatment(response.error, "artist"),
        type: "error",
      });
    }
  };

  const onSubmit = handleSubmit((data) => {
    setIsLoading(true);
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
          <DialogTitle>Add New Artist</DialogTitle>
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
                  {...register("name")}
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
