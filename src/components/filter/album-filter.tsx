import {
  createListCollection,
  IconButton,
  Input,
  Flex,
} from "@chakra-ui/react";
import { Field } from "../field";
import { Controller, useForm } from "react-hook-form";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../select";
import { LuX } from "react-icons/lu";
import { IoSearchOutline } from "react-icons/io5";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";

interface AlbumFilterProps {
  setPayload: React.Dispatch<React.SetStateAction<AlbumSelector>>;
  artists: Artist[] | null;
}

const formSchema = z.object({
  artistKey: z.string().array(),
  name: z.string(),
  year: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AlbumFilter({ setPayload, artists }: AlbumFilterProps) {
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

    setPayload(selector);
  });

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

  return (
    <form onSubmit={onSubmit} id="search-form">
      <Flex
        justifyContent={"flex-end"}
        alignItems={"flex-end"}
        gap={"1rem"}
        flexWrap={{ mdDown: "wrap", md: "noWrap" }}
      >
        {(watchNameField !== "" ||
          watchCountryField.toString() !== "" ||
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
            type="number"
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
        <IconButton aria-label="Remove item" bgColor="primary" type="submit">
          <IoSearchOutline color="white" />
        </IconButton>
      </Flex>
    </form>
  );
}
