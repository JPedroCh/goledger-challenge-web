import { Card, IconButton, Stack, Text } from "@chakra-ui/react";
import { LuX } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";

interface StyledCardProps {
  title: string;
  content: string[];
  cancelButtonFunction: React.Dispatch<React.SetStateAction<boolean>>;
  editButtonFunction: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentItem: React.Dispatch<React.SetStateAction<any>>;
  item: object;
}

export default function StyledCard({
  title,
  content,
  cancelButtonFunction,
  editButtonFunction,
  setCurrentItem,
  item,
}: StyledCardProps) {
  return (
    <Card.Root
      width="200px"
      shadow="-1px 9px 9px -1px rgba(0,0,0,0.75)"
      bgColor="secondary"
    >
      <Card.Body>
        <Stack gap="0">
          <Text fontWeight="semibold" textStyle="sm" color="white">
            {title}
          </Text>
          {content.map((item, index) => (
            <Text textStyle="sm" color="white" key={index}>
              {item}
            </Text>
          ))}
        </Stack>
      </Card.Body>
      <Card.Footer justifyContent="center">
        <IconButton
          aria-label="Edit item"
          variant="outline"
          _hover={{ bgColor: "primary" }}
          onClick={() => {
            setCurrentItem(item);
            editButtonFunction(true);
          }}
        >
          <MdOutlineEdit color="white" />
        </IconButton>
        <IconButton
          aria-label="Remove item"
          variant="outline"
          _hover={{ bgColor: "red" }}
          onClick={() => {
            setCurrentItem(item);
            cancelButtonFunction(true);
          }}
        >
          <LuX color="white" />
        </IconButton>
      </Card.Footer>
    </Card.Root>
  );
}
