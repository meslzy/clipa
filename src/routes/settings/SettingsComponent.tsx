import { Accordion, ScrollArea } from "@mantine/core";

import { Generative } from "./Generative";

const OPEND = [
  "generative",
];

export const SettingsComponent = () => {
  return (
    <ScrollArea pos={"absolute"} inset={0}>
      <Accordion defaultValue={OPEND} multiple>
        <Generative/>
      </Accordion>
    </ScrollArea>
  );
};
