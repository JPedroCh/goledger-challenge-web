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
import { handleFetchArtists } from "../../services/artists";

const formSchema = z.object({
  artistKey: z.string({ message: "Artist is required" }).array(),
  name: z.string().min(1, { message: "Name is required" }),
  year: z.coerce.string().min(1, { message: "Year is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const CreateAlbum = () => {
  const [artists, setArtists] = useState<Artist[] | null>(null);
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

  const handleCreateAlbum = async (payload: CreateAlbumPayload) => {
    const response = await sendRequest<RequestResult<Album>>(
      createAsset(payload)
    );
    setIsLoading(false);
    if (response.type === "success") {
      toaster.success({
        title: "Success",
        description: "Album created succesfully!",
        type: "success",
      });
      navigate("/albums/");
    } else if (response.type === "error") {
      toaster.error({
        title: "Error",
        description: "It was not possible to create the album!",
        type: "error",
      });
    }
  };

  const artistsList = useMemo(() => {
    if (artists !== null) {
      return createListCollection({
        items: artists?.map((artist: Artist) => ({
          label: artist.name,
          value: artist["@key"],
        })),
      });
    }
    return createListCollection({
      items: [{ label: "", value: "" }],
    });
  }, [artists]);

  useEffect(() => {
    handleFetchArtists({ setResult: setArtists });
  }, []);

  const onSubmit = handleSubmit((data) => {
    setIsLoading(true);
    const payload: CreateAlbumPayload = {
      asset: [
        {
          "@assetType": "album",
          name: data?.name || "",
          year: Number(data?.year),
          artist: {
            "@assetType": "artist",
            "@key": data?.artistKey?.[0],
          },
        },
      ],
    };

    handleCreateAlbum(payload);
  });

  return (
    <Box minH="100vh" bgGradient="radialGradient">
      <Navbar />
      <Flex padding="3rem" justifyContent="center">
        <form onSubmit={onSubmit} id="create-album-form">
          <Stack
            gap="4"
            minW="600px"
            bgColor="white"
            padding="4rem"
            borderRadius="50px"
            shadow="-1px 9px 9px -1px rgba(0,0,0,0.75)"
          >
            <Text fontSize={"24px"} textAlign="center" mb="1rem">
              Add New Album
            </Text>
            <Field
              label="Name"
              invalid={!!errors.name}
              errorText={errors.name?.message}
            >
              <Input
                placeholder="Insert the album's name"
                variant="subtle"
                color="black"
                {...register("name")}
              />
            </Field>
            <Field
              label="Year"
              invalid={!!errors.year}
              errorText={errors.year?.message}
            >
              <Input
                placeholder="Insert the album's year"
                variant="subtle"
                color="black"
                {...register("year")}
              />
            </Field>
            <Field
              label="Artist"
              invalid={!!errors.artistKey}
              errorText={errors.artistKey?.message}
            >
              <Controller
                control={control}
                name="artistKey"
                render={({ field }) => (
                  <SelectRoot
                    name={field.name}
                    value={field.value}
                    onValueChange={({ value }) => field.onChange(value)}
                    onInteractOutside={() => field.onBlur()}
                    collection={artistsList}
                    variant="subtle"
                  >
                    <SelectTrigger>
                      <SelectValueText placeholder="Select artist" />
                    </SelectTrigger>
                    <SelectContent>
                      {artistsList.items.map((artist) => (
                        <SelectItem item={artist} key={artist!.value}>
                          {artist.label}
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

export default CreateAlbum;
