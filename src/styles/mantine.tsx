import { Menu, Modal, Button, Popover, Tooltip, ScrollArea, createTheme, MantineSize } from "@mantine/core";

import classes from "./components.module.css";

const generateSizes = (mdValue: number): Record<MantineSize, string> => {
  return {
    xs: `${mdValue * 0.5}px`, // 1/3 of md
    sm: `${mdValue * 0.75}px`, // 2/3 of md
    md: `${mdValue}px`,        // md as given
    lg: `${mdValue * 1.33}px`, // 4/3 of md
    xl: `${mdValue * 1.66}px`, // 5/3 of md
  };
};

export const mantineTheme = createTheme({
  fontFamily: "Inter, sans-serif",
  primaryColor: "red",
  primaryShade: 7,
  breakpoints: {
    xs: "20em",
    sm: "36em",
    md: "48em",
    lg: "64em",
    xl: "80em",
  },
  fontSizes: generateSizes(16),
  spacing: generateSizes(12),
  radius: generateSizes(8),
  components: {
    Button: Button.extend({
      defaultProps: {
        variant: "default",
      },
    }),
    Tooltip: Tooltip.extend({
      defaultProps: {
        withArrow: true,
        position: "top",
        color: "red",
      },
    }),
    Modal: Modal.extend({
      defaultProps: {
        centered: true,
      },
    }),
    Menu: Menu.extend({
      defaultProps: {
        withArrow: true,
      },
    }),
    Popover: Popover.extend({
      defaultProps: {
        withArrow: true,
      },
    }),
    ScrollArea: ScrollArea.extend({
      classNames: {
        viewport: classes.scrollAreaViewport,
      },
    }),
  },
});
