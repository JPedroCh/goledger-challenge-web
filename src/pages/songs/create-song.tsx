import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/navbar";
import {
  Box,
  createListCollection,
  Flex,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { sendRequest } from "../../services/request";
import { toaster } from "../../components/toaster";
import { Controller, useForm } from "react-hook-form";
import { Field } from "../../components/field";
import { createAsset } from "../../services/assets";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../components/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { handleFetchAlbums } from "../../services/albums";
import { errorTreatment } from "../../services/error-treatment";

const formSchema = z.object({
  albumKey: z.string({ message: "Album is required" }).array(),
  name: z.string().min(1, { message: "Name is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const CreateSong = () => {
  const [albums, setAlbums] = useState<Album[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleCreateSong = async (payload: CreateSongPayload) => {
    const response = await sendRequest<RequestResult<Song>>(
      createAsset(payload)
    );
    setIsLoading(false);
    if (response.type === "success") {
      toaster.success({
        title: "Success",
        description: "Song created succesfully!",
        type: "success",
      });
      navigate("/songs/");
    } else if (response.type === "error") {
      toaster.error({
        title: "Error",
        description: errorTreatment(response.error, "song"),
        type: "error",
      });
    }
  };

  const albumsList = useMemo(() => {
    if (albums !== null) {
      return createListCollection({
        items: albums?.map((album: Album) => ({
          label: album.name,
          value: album["@key"],
        })),
      });
    }
    return createListCollection({
      items: [{ label: "", value: "" }],
    });
  }, [albums]);

  useEffect(() => {
    handleFetchAlbums({ setResult: setAlbums });
  }, []);

  const onSubmit = handleSubmit((data) => {
    setIsLoading(true);
    const payload: CreateSongPayload = {
      asset: [
        {
          "@assetType": "song",
          name: data?.name || "",
          album: {
            "@assetType": "album",
            "@key": data?.albumKey?.[0],
          },
        },
      ],
    };

    handleCreateSong(payload);
  });

  return (
    <Box minH="100vh" bgGradient="radialGradient">
      <Navbar />
      <Flex padding="3rem" justifyContent="center">
        <form onSubmit={onSubmit} id="create-album-form">
          <Stack
            gap="4"
            minW={{ md: "600px" }}
            maxW={{ smDown: "280px" }}
            bgColor="white"
            padding="4rem"
            borderRadius="50px"
            shadow="-1px 9px 9px -1px rgba(0,0,0,0.75)"
          >
            <Text fontSize={"24px"} textAlign="center" mb="1rem">
              Add New Song
            </Text>
            <Field
              label="Name"
              invalid={!!errors.name}
              errorText={errors.name?.message}
            >
              <Input
                placeholder="Insert the song's name"
                variant="subtle"
                color="black"
                {...register("name")}
              />
            </Field>
            <Field
              label="Album"
              invalid={!!errors.albumKey}
              errorText={errors.albumKey?.message}
            >
              <Controller
                control={control}
                name="albumKey"
                render={({ field }) => (
                  <SelectRoot
                    name={field.name}
                    value={field.value}
                    onValueChange={({ value }) => field.onChange(value)}
                    onInteractOutside={() => field.onBlur()}
                    collection={albumsList}
                    variant="subtle"
                  >
                    <SelectTrigger>
                      <SelectValueText placeholder="Select album" />
                    </SelectTrigger>
                    <SelectContent>
                      {albumsList.items.map((album) => (
                        <SelectItem item={album} key={album!.value}>
                          {album.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                )}
              />
            </Field>
            <Flex gap="4" justifyContent="center">
              <Button
                variant="outline"
                _hover={{ bgColor: "red", color: "white" }}
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                bgColor="secondary"
                _hover={{ bgColor: "primary" }}
                loading={isLoading}
              >
                Confirm
              </Button>
            </Flex>
          </Stack>
        </form>
      </Flex>
    </Box>
  );
};

export default CreateSong;
