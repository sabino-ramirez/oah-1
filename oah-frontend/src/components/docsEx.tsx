import * as React from "react";
import { render } from "react-dom";
import {
  ReactGrid,
  Column,
  Row,
  CellChange,
  TextCell,
  DefaultCellTypes,
} from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";

interface Person {
  name: string;
  surname: string;
}

const getPeople = (): Person[] => [
  { name: "Thomas", surname: "Goldman" },
  { name: "Susie", surname: "Quattro" },
  { name: "", surname: "" },
];

const getColumns = (): Column[] => [
  { columnId: "name", width: 150 },
  { columnId: "surname", width: 150 },
];

const headerRow: Row = {
  rowId: "header",
  cells: [
    { type: "header", text: "Name" },
    { type: "header", text: "Surname" },
  ],
};

const getRows = (people: Person[]): Row[] => [
  headerRow,
  ...people.map<Row>((person, idx) => ({
    rowId: idx,
    cells: [
      { type: "text", text: person.name },
      { type: "text", text: person.surname },
    ],
  })),
];

const applyChangesToPeople = (
  changes: CellChange<TextCell>[],
  prevPeople: Person[]
): Person[] => {
  changes.forEach((change) => {
    const personIndex = change.rowId as number;
    const fieldName = change.columnId as keyof Person;
    prevPeople[personIndex][fieldName] = change.newCell.text;
    // console.log("rowId", change.rowId);
    // console.log("columnId", change.columnId);
  });
  return [...prevPeople];
};

const DocsEx = () => {
  const [people, setPeople] = React.useState<Person[]>(getPeople());

  const rows = getRows(people);
  const columns = getColumns();

  // const handleChanges = (changes: CellChange<TextCell>[]) => {
  //   setPeople((prevPeople) => applyChangesToPeople(changes, prevPeople));
  // };

  const handleChanges = (changes: CellChange<any>[]) => {
    setPeople((prevPeople) => applyChangesToPeople(changes, prevPeople));
  };

  return (
    <ReactGrid rows={rows} columns={columns} onCellsChanged={handleChanges} />
  );
};

export default DocsEx;
