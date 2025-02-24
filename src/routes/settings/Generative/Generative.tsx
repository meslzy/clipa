import { Text, Stack, Select, Accordion } from "@mantine/core";

import { useGenerative } from "~/features/generative/generativeHooks";
import { GenerativeSource } from "~/features/generative/generativeTypes";

import { Ollama } from "./Ollama";

export const Generative = () => {
  const generative = useGenerative();

  return (
    <Accordion.Item value={"generative"}>
      <Accordion.Control>
        <Text>Generative</Text>
      </Accordion.Control>
      <Accordion.Panel>
        <Stack gap={"sm"}>
          <Select
            label={"Generative"}
            placeholder={"Select generative"}
            checkIconPosition={"right"}
            allowDeselect={false}
            value={generative.selected}
            data={Object.entries(GenerativeSource).map(([label, value]) => ({
              value,
              label,
            }))}
            clearable
            searchable
            onChange={(value) => {
              if (value) {
                generative.setSelected(value as GenerativeSource);
              } else {
                generative.setSelected(null);
              }
            }}
          />
          {
            generative.selected === GenerativeSource.Ollama && (
              <Ollama/>
            )
          }
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  );
};
