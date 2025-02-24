import { icons, IconProps, TablerIcon } from "@tabler/icons-react";

interface DyIconProps extends IconProps {
  icon: string;
}

export const DyIcon = (props: DyIconProps) => {
  const { icon, ...rest } = props;

  const Icon = icons[icon] as TablerIcon;

  return (
    <Icon {...rest}/>
  );
};
