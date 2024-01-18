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
import { useRef, useState } from "react";
import { UpdateReqFormat } from "../types";

const UpdateModel = (props: {
  parentUpdateReqs: UpdateReqFormat[];
  parentSetUpdateReqs: any;
  parentCellChanges: any;
  parentCellChangesIndex: number;
  parentClickHandler: any;
}) => {
  // handles modal functionality
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  // stores row numbers that hold updates
  const [uniqueupdaterownums, setuniqueupdaterownums] = useState<any[]>([]);

  /*
   * this function takes all changes up to the current index and returns
   * a flattened array of unique row numbers that have been affected.
   * This allows the updated reqs sent to the server to agree with the
   * undos and redos from grid changes.
   * */
  const calculateRowsUpdated = () => {
    const changedRowsUnique = Array.from(
      new Set(
        props.parentCellChanges
          .slice(
            0,
            props.parentCellChangesIndex > 0
              ? props.parentCellChangesIndex + 1
              : 1
          )
          .map((changes: any) =>
            changes.map((change: any) => {
              return change.rowId as number;
            })
          )
          .flat()
      )
    );
    // console.log("changed rows:", changedRowsUnique);

    setuniqueupdaterownums(changedRowsUnique);
  };

  return (
    <>
      <Button
        size={"sm"}
        onClick={() => {
          onOpen();
          calculateRowsUpdated();
        }}
      >
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
            update {uniqueupdaterownums.length} reqs?
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
              <Button
                size={"sm"}
                onClick={() => {
                  props.parentClickHandler(uniqueupdaterownums);
                  onClose();
                }}
              >
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
// const changedRowsUnique = Array.from(
//   new Set(
//     cellChanges
//       .slice(0, cellChangesIndex > 0 ? cellChangesIndex + 1 : 1)
//       .map((sub) =>
//         sub.map((c) => {
//           return c.rowId as number;
//         })
//       )
//       .flat()
//   )
// );
// console.log("changed rows:", changedRowsUnique);
