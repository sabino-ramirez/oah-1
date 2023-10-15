import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";

const UpdateModel = (props: {
  updateAmount: number;
  parentClickHandler: any;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

  return (
    <>
      <Button size={"sm"} onClick={onOpen}>
        update
      </Button>
      <Modal
        size={"xs"}
        initialFocusRef={initialRef}
        returnFocusOnClose={false}
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay
          bg={"blackAlpha.300"}
          backdropFilter="blur(2px) hue-rotate(270deg)"
        />
        <ModalContent>
          <ModalHeader justifyContent={"center"} textAlign={"center"}>
            confirm
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody justifyContent={"center"} textAlign={"center"}>
            update {props.updateAmount} items?
          </ModalBody>

          <ModalFooter justifyContent={"center"}>
            <HStack>
              <Button
                ref={initialRef}
                variant={"outline"}
                size={"sm"}
                onClick={onClose}
              >
                cancel
              </Button>
              <Button size={"sm"} onClick={props.parentClickHandler}>
                update
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateModel;
