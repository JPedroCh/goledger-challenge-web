import { Card, IconButton, Stack, Text } from "@chakra-ui/react";
import { FaEye } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { LuX } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface StyledCardProps {
  title: string;
  content: string[];
  cancelButtonFunction: React.Dispatch<React.SetStateAction<boolean>>;
  editButtonFunction?: React.Dispatch<React.SetStateAction<boolean>>;
  viewAddress?: string | undefined;
  redirectAddress?: string | undefined;
  setCurrentItem: React.Dispatch<React.SetStateAction<any>>;
  addAddress?: string | undefined;
  item: object;
}

export default function StyledCard({
  title,
  content,
  cancelButtonFunction,
  editButtonFunction,
  viewAddress,
  redirectAddress,
  setCurrentItem,
  addAddress,
  item,
}: StyledCardProps) {
  const navigate = useNavigate();

  const onClickEdit = () => {
    if (redirectAddress !== undefined) {
      return navigate(redirectAddress, { state: item });
    } else if (editButtonFunction) {
      return editButtonFunction(true);
    }
  };

  return (
    <Card.Root
      width="200px"
      shadow="-1px 9px 9px -1px rgba(0,0,0,0.75)"
      bgGradient="linear-gradient(90deg, rgba(25,4,130,1) 0%, rgba(119,82,254,1) 91%);"
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
        {addAddress && (
          <IconButton
            aria-label="Add item"
            variant="outline"
            _hover={{ bgColor: "primary" }}
            onClick={() => {
              setCurrentItem(item);
              navigate(addAddress, { state: item });
            }}
          >
            <IoMdAdd color="white" />
          </IconButton>
        )}
        {viewAddress !== undefined && (
          <IconButton
            aria-label="View item"
            variant="outline"
            _hover={{ bgColor: "primary" }}
            onClick={() => {
              setCurrentItem(item);
              navigate(viewAddress, { state: item });
            }}
          >
            <FaEye color="white" />
          </IconButton>
        )}
        {(redirectAddress !== undefined || editButtonFunction) && (
          <IconButton
            aria-label="Edit item"
            variant="outline"
            _hover={{ bgColor: "primary" }}
            onClick={() => {
              setCurrentItem(item);
              onClickEdit();
            }}
          >
            <MdOutlineEdit color="white" />
          </IconButton>
        )}
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
