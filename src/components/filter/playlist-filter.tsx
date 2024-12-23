import {
  createListCollection,
  Flex,
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

interface PlaylistFilterProps {
  setPayload: React.Dispatch<React.SetStateAction<PlaylistSelector>>;
}

const formSchema = z.object({
  name: z.string(),
  privatePlaylist: z.string().array(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PlaylistFilter({ setPayload }: PlaylistFilterProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { privatePlaylist: [] },
  });
  const [watchNameField] = watch(["name"]);

  const onSubmit = handleSubmit((data) => {
    const selector: PlaylistSelector = { "@assetType": "playlist" };

    if (data?.name) {
      selector.name = data.name;
    }

    if (data?.privatePlaylist[0] === "Public") {
      selector.private = false;
    } else if (data?.privatePlaylist[0] === "Private") {
      selector.private = true;
    }

    setPayload(selector);
  });

  const privacyFilterOptions = createListCollection({
    items: [
      { label: "Private", value: "Private" },
      { label: "Public", value: "Public" },
      { label: "Both", value: "Both" },
    ],
  });

  return (
    <form onSubmit={onSubmit} id="search-form">
      <Flex
        justifyContent={"flex-end"}
        alignItems={"flex-end"}
        gap={"1rem"}
        flexWrap={{ mdDown: "wrap", md: "noWrap" }}
      >
        {watchNameField !== "" && (
          <IconButton
            aria-label="Remove item"
            variant="outline"
            _hover={{ bgColor: "red" }}
            onClick={() => {
              setValue("name", "");
              setValue("privatePlaylist", []);
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
            placeholder="Insert the playlist's name"
            variant="subtle"
            color="black"
            {...register("name")}
          />
        </Field>
        <Field
          label="Privacy Filter"
          invalid={!!errors.privatePlaylist}
          errorText={errors.privatePlaylist?.message}
          color="white"
        >
          <Controller
            control={control}
            name="privatePlaylist"
            render={({ field }) => (
              <SelectRoot
                name={field.name}
                value={field.value}
                onValueChange={({ value }) => field.onChange(value)}
                onInteractOutside={() => field.onBlur()}
                collection={privacyFilterOptions}
                variant="subtle"
                color="black"
              >
                <SelectTrigger>
                  <SelectValueText placeholder="Select Option" />
                </SelectTrigger>
                <SelectContent>
                  {privacyFilterOptions.items.map((option) => (
                    <SelectItem item={option} key={option!.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            )}
          />
        </Field>
        <IconButton aria-label="Search item" bgColor="primary" type="submit">
          <IoSearchOutline color="white" />
        </IconButton>
      </Flex>
    </form>
  );
}
