import {
  createListCollection,
  HStack,
  IconButton,
  Input,
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

interface SongFilterProps {
  setPayload: React.Dispatch<React.SetStateAction<SongSelector>>;
  albums: Album[] | null;
}

const formSchema = z.object({
  albumKey: z.string().array(),
  name: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function SongFilter({ setPayload, albums }: SongFilterProps) {
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
      albumKey: [],
    },
  });
  const [watchNameField, watchAlbumKey] = watch(["name", "albumKey"]);

  const albumsList = useMemo(() => {
    if (albums !== null) {
      return createListCollection({
        items: albums?.map((album) => ({
          label: album.name,
          value: album["@key"],
        })),
      });
    }
    return createListCollection({
      items: [{ label: "", value: "" }],
    });
  }, [albums]);

  const onSubmit = handleSubmit((data) => {
    const selector: SongSelector = { "@assetType": "song" };

    if (data?.name) {
      selector.name = data.name;
    }

    if (data?.albumKey.length !== 0) {
      selector.album = {
        "@assetType": "album",
        "@key": data.albumKey[0],
      };
    }

    setPayload(selector);
  });

  return (
    <form onSubmit={onSubmit} id="search-form">
      <HStack justifyContent={"flex-end"} alignItems={"flex-end"}>
        {(watchNameField !== "" || watchAlbumKey?.length !== 0) && (
          <IconButton
            aria-label="Remove item"
            variant="outline"
            _hover={{ bgColor: "red" }}
            onClick={() => {
              setValue("name", "");
              setValue("albumKey", []);
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
          color="white"
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
                color="black"
              >
                <SelectTrigger>
                  <SelectValueText placeholder="Select album" />
                </SelectTrigger>
                <SelectContent>
                  {albumsList.items.map((artist) => (
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
      </HStack>
    </form>
  );
}
