import { Tabs as MantineTabs } from "@mantine/core";

import classes from "./index.module.css";

interface TabsProps {
  tabs: Array<{ value: string; label: string }>;
  defaultValue: string;
  onChange: (e: any) => void;
}

export default function Tabs({ defaultValue, tabs, onChange }: TabsProps) {
  return (
    <MantineTabs
      variant="unstyled"
      value={defaultValue}
      classNames={classes}
      onChange={onChange}
    >
      <MantineTabs.List grow>
        {tabs?.map((tab, index) => (
          <MantineTabs.Tab value={tab?.value} key={index}>
            {tab?.label}
          </MantineTabs.Tab>
        ))}
      </MantineTabs.List>
    </MantineTabs>
  );
}
