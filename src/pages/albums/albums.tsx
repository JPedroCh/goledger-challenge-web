import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "../../components/navbar";
import {
  Box,
  Button,
  createListCollection,
  Flex,
  HStack,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { sendRequest } from "../../services/request";
import { Toaster, toaster } from "../../components/toaster";
import StyledCard from "../../components/card";
import { Controller, useForm } from "react-hook-form";
import { Field } from "../../components/field";
import { IoSearchOutline } from "react-icons/io5";
import { fetchAssets } from "../../services/assets";
import { LuX } from "react-icons/lu";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../components/select";
import DeleteAlbumDialog from "../../components/album-dialog/delete-album-dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  artistKey: z.string().array(),
  name: z.string(),
  year: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const Albums = () => {
  const [albums, setAlbums] = useState<Album[] | null>(null);
  const [artists, setArtists] = useState<Artist[] | null>(null);
  const [isExpectedRefresh, setIsExpectedRefresh] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [currentAlbum, setCurrentAlbum] = useState<
    CompleteAlbumInfo | undefined
  >(undefined);
  const [payload, setPayload] = useState<FetchAlbumsPayload>({
    query: {
      selector: {
        "@assetType": "album",
      },
    },
  });
  const refreshPage = () => setIsExpectedRefresh((prev: boolean) => !prev);
  const navigate = useNavigate();

  useEffect(() => {
    handleFetchAlbums();
    handleFetchArtists();
  }, [isExpectedRefresh, payload]);

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

  const handleFetchAlbums = useCallback(async () => {
    const response = await sendRequest<RequestResult<Album[]>>(
      fetchAssets(payload)
    );

    if (response.type === "success") {
      setAlbums(response?.value?.result);
    } else if (response.type === "error") {
      toaster.error({
        title: "Error",
        description: "It was not possible to fetch the albums!",
        type: "error",
      });
    }
  }, [payload]);

  const artistsList = useMemo(() => {
    if (artists !== null) {
      return createListCollection({
        items: artists?.map((artist) => ({
          label: artist.name,
          value: artist["@key"],
        })),
      });
    }
    return createListCollection({
      items: [{ label: "", value: "" }],
    });
  }, [artists]);

  const albumWithArtistList: CompleteAlbumInfo[] = useMemo(() => {
    const result: CompleteAlbumInfo[] =
      albums?.map((album) => {
        const matchingArtist = artists?.find(
          (artist) => artist["@key"] === album.artist["@key"]
        );
        return {
          "@assetType": "album",
          "@key": album["@key"] || "",
          name: album.name || "",
          year: album.year.toString() || "",
          artist: {
            "@assetType": "artist",
            "@key": matchingArtist?.["@key"] || "",
            name: matchingArtist?.name || "",
            country: matchingArtist?.country || "",
          },
        };
      }) || [];
    return result;
  }, [artists, albums]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artistKey: [],
    },
  });
  const [watchNameField, watchCountryField, watchArtistKey] = watch([
    "name",
    "year",
    "artistKey",
  ]);

  const onSubmit = handleSubmit((data) => {
    const selector: AlbumSelector = { "@assetType": "album" };

    if (data?.name) {
      selector.name = data.name;
    }

    if (data?.year) {
      selector.year = Number(data.year);
    }

    if (data?.artistKey.length !== 0) {
      selector.artist = {
        "@assetType": "artist",
        "@key": data.artistKey[0],
      };
    }

    setPayload({
      query: {
        selector,
      },
    });
  });

  return (
    <Box minH="100vh" bgGradient={"radialGradient"}>
      <Navbar />
      <Box padding="3rem">
        <Flex
          justifyContent="space-between"
          flexDir="row"
          alignItems="flex-end"
        >
          <Button
            marginTop={"50px"}
            padding={"25px"}
            border={"1px solid "}
            color={"primary"}
            backgroundColor={"transparent"}
            borderRadius={"50px"}
            _hover={{
              transform: "scale(1.01)",
              bgColor: "primary",
              color: "white",
            }}
            onClick={() => navigate("/albums/create")}
          >
            Add New Album
          </Button>
          <form onSubmit={onSubmit} id="search-form">
            <HStack justifyContent={"flex-end"} alignItems={"flex-end"}>
              {(watchNameField !== "" ||
                watchCountryField !== "" ||
                watchArtistKey?.length !== 0) && (
                <IconButton
                  aria-label="Remove item"
                  variant="outline"
                  _hover={{ bgColor: "red" }}
                  onClick={() => {
                    setValue("name", "");
                    setValue("year", "");
                    setValue("artistKey", []);
                    onSubmit();
                  }}
                >
                  <LuX color="white" />
                </IconButton>
              )}
              <Field
                label="Name"
                invalid={!!errors.name}
                errorText={errors.name?.message}
                color="white"
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
                color="white"
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
                color="white"
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
                      color="black"
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
              <IconButton
                aria-label="Remove item"
                bgColor="primary"
                type="submit"
              >
                <IoSearchOutline color="white" />
              </IconButton>
            </HStack>
          </form>
        </Flex>
      </Box>
      <Flex flexDir="row" gap="6" flexWrap="wrap" justifyContent="center">
        {albumWithArtistList?.map((album, index) => (
          <StyledCard
            key={index}
            title={album.name}
            content={[album.artist.name || "", album.year.toString()]}
            item={album}
            cancelButtonFunction={setOpenDeleteDialog}
            redirectAddress="/albums/edit"
            setCurrentItem={setCurrentAlbum}
          />
        ))}
        <Toaster />
      </Flex>
      <DeleteAlbumDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        album={currentAlbum}
        refreshPage={refreshPage}
      />
    </Box>
  );
};

export default Albums;
