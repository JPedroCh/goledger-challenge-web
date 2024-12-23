import { Flex, IconButton, Input } from "@chakra-ui/react";
import { Field } from "../field";
import { useForm } from "react-hook-form";
import { LuX } from "react-icons/lu";
import { IoSearchOutline } from "react-icons/io5";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface ArtistFilterProps {
  setPayload: React.Dispatch<React.SetStateAction<ArtistSelector>>;
}

const formSchema = z.object({
  name: z.string(),
  country: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ArtistFilter({ setPayload }: ArtistFilterProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const [watchNameField, watchCountryField] = watch(["name", "country"]);

  const onSubmit = handleSubmit((data) => {
    const selector: ArtistSelector = { "@assetType": "artist" };

    if (data?.name) {
      selector.name = data.name;
    }

    if (data?.country) {
      selector.country = data.country;
    }

    setPayload(selector);
  });

  return (
    <form onSubmit={onSubmit} id="search-form">
      <Flex
        justifyContent={"flex-end"}
        alignItems={"flex-end"}
        gap={"1rem"}
        flexWrap={{ mdDown: "wrap", md: "noWrap" }}
      >
        {(watchNameField !== "" || watchCountryField !== "") && (
          <IconButton
            aria-label="Remove item"
            variant="outline"
            _hover={{ bgColor: "red" }}
            onClick={() => {
              setValue("name", "");
              setValue("country", "");
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
          color="white"
        >
          <Input
            placeholder="Insert the artist's country"
            variant="subtle"
            color="black"
            {...register("country")}
          />
        </Field>
        <IconButton aria-label="Remove item" bgColor="primary" type="submit">
          <IoSearchOutline color="white" />
        </IconButton>
      </Flex>
    </form>
  );
}
