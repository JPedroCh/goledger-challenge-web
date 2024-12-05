import { useCallback, useEffect, useMemo, useState } from "react";
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
import { toaster, Toaster } from "../../components/toaster";
import { Controller, useForm } from "react-hook-form";
import { Field } from "../../components/field";
import { fetchAssets, updateAsset } from "../../services/assets";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../components/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { DataListItem, DataListRoot } from "../../components/data-list";
import { Button } from "../../components/button";

const formSchema = z.object({
  artistKey: z.string().array(),
  year: z.coerce.string(),
});

type FormValues = z.infer<typeof formSchema>;

const EditAlbum = () => {
  const [artists, setArtists] = useState<Artist[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const location = useLocation();
  const currentAlbum: CompleteAlbumInfo = location.state || {};
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: currentAlbum?.year,
      artistKey: [currentAlbum?.artist?.["@key"]],
    },
  });

  const handleEditAlbum = useCallback(async (payload: UpdateAlbumPayload) => {
    const response = await sendRequest<RequestResult<Album>>(
      updateAsset(payload)
    );

    if (response.type === "success") {
      toaster.success({
        title: "Success",
        description: "Album edited succesfully!",
        type: "success",
      });
      setIsLoading(false);
      navigate("/albums/");
    } else if (response.type === "error") {
      setIsLoading(false);
      toaster.error({
        title: "Error",
        description: "It was not possible to edit the album!",
        type: "error",
      });
    }
  }, []);

  const handleFetchArtists = useCallback(async () => {
    const response = await sendRequest<RequestResult<Artist[]>>(
      fetchAssets({
        query: {
          selector: {
            "@assetType": "artist",
          },
        },
      })
    );

    if (response.type === "success") {
      setArtists(response?.value?.result);
    } else if (response.type === "error") {
      toaster.error({
        title: "Error",
        description: "It was not possible to fetch the artists!",
        type: "error",
      });
    }
  }, []);

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
    handleFetchArtists();
  }, []);

  const onSubmit = handleSubmit((data) => {
    setIsLoading(true);
    const payload: UpdateAlbumPayload = {
      update: {
        "@assetType": "album",
        name: currentAlbum?.name,
        year: Number(currentAlbum?.year),
        artist: {
          "@assetType": "artist",
          "@key": currentAlbum?.artist["@key"],
        },
      },
    };

    if (data?.year && data?.year !== "0") {
      payload.update.year = Number(data.year);
    }

    if (data?.artistKey) {
      payload.update.artist["@key"] = data.artistKey[0];
    }

    handleEditAlbum(payload);
  });

  return (
    <Box minH="100vh" bgGradient="radialGradient">
      <Navbar />
      <Flex padding="3rem" justifyContent="center">
        <form onSubmit={onSubmit} id="edit-album-form">
          <Stack
            gap="4"
            minW="600px"
            bgColor="white"
            padding="4rem"
            borderRadius="50px"
            shadow="-1px 9px 9px -1px rgba(0,0,0,0.75)"
          >
            <Text fontSize={"24px"} textAlign="center" mb="1rem">
              Edit Album
            </Text>
            <DataListRoot orientation="vertical" mb={4}>
              <DataListItem
                label="Current Album's Name"
                value={currentAlbum?.name}
              />
              <DataListItem
                label="Current Album's Artist"
                value={currentAlbum?.artist.name}
              />
              <DataListItem
                label="Current Album's Year"
                value={currentAlbum?.year}
              />
            </DataListRoot>
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
      <Toaster />
    </Box>
  );
};

export default EditAlbum;
