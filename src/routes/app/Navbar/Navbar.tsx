import { Tabs, Group } from "@mantine/core";

import { IconKey, IconNotes, IconSettings, IconClipboard } from "@tabler/icons-react";

import { useNavigate } from "@tanstack/react-router";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <Group component={"header"} p={"md"} data-tauri-drag-region>
      <Tabs w={"100%"} defaultValue={"clipboard"} inverted>
        <Tabs.List grow>
          <Tabs.Tab
            p={"sm"}
            value={"vault"}
            onClick={() => navigate({
              to: "/vault",
            })}
          >
            <IconKey size={20}/>
          </Tabs.Tab>
          <Tabs.Tab
            p={"sm"}
            value={"clipboard"}
            onClick={() => navigate({
              to: "/",
            })}
          >
            <IconClipboard size={20}/>
          </Tabs.Tab>
          <Tabs.Tab
            p={"sm"}
            value={"note"}
            onClick={() => navigate({
              to: "/note",
            })}
          >
            <IconNotes size={20}/>
          </Tabs.Tab>
          <Tabs.Tab
            p={"sm"}
            value={"settings"}
            onClick={() => navigate({
              to: "/settings",
            })}
          >
            <IconSettings size={20}/>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </Group>
  );
};
