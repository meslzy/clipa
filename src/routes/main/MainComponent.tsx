import { Stack } from "@mantine/core";

import { Outlet } from "@tanstack/react-router";

import { Header } from "./Header";

export const MainComponent = () => {
  return (
    <Stack h={"100%"} gap={"xs"}>
      <Header/>
      <Outlet/>
    </Stack>
  );
};
