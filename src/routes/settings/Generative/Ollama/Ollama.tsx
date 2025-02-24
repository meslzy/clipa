import { Stack, Select } from "@mantine/core";

import { useQuery } from "@tanstack/react-query";
import ollama from "ollama/browser";

import { useGenerativeSource } from "~/features/generative/generativeHooks";
import { GenerativeSource } from "~/features/generative/generativeTypes";

export const Ollama = () => {
  const { selected, config, setConfig } = useGenerativeSource(GenerativeSource.Ollama);

  const list = useQuery({
    enabled: selected,
    queryKey: ["ollama-list"],
    queryFn: async () => {
      return ollama.list();
    },
  });

  return (
    <Stack gap={"sm"}>
      <Select
        label={"Ollama model"}
        placeholder={"Select model"}
        nothingFoundMessage={"No models found"}
        checkIconPosition={"right"}
        disabled={list.isLoading}
        allowDeselect={false}
        value={config.model}
        error={list.error?.message}
        data={list.data?.models.map((model) => ({
          value: model.name,
          label: model.name,
        }))}
        searchable
        onChange={(value) => {
          setConfig({
            model: value,
          });
        }}
      />
    </Stack>
  );
};
