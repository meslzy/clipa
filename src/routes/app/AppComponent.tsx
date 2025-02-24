import { Box, Stack } from "@mantine/core";

import { Outlet } from "@tanstack/react-router";

import { Header } from "./Header";
import { Navbar } from "./Navbar";

export const AppComponent = () => {
  return (
    <Stack gap={0} h={"100%"}>
      <Header/>
      <Box mx={"md"} pos={"relative"} flex={1}>
        <Outlet/>
      </Box>
      <Navbar/>
    </Stack>
  );
};
