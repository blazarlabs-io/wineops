import type { Meta, StoryObj } from "@storybook/react";
import QuantityWidget from ".";
import { VineyardStatus } from "@/models/types/db";

const meta: Meta<typeof QuantityWidget> = {
  title: "Widgets/Quantity",
  component: QuantityWidget,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    status: {
      control: "radio",
      options: Object.values(VineyardStatus),
    },
  },
};

export default meta;
type Story = StoryObj<typeof QuantityWidget>;

export const Default: Story = {
  args: {
    status: VineyardStatus.VEGETATION,
    actual: 40,
    supply: 23,
    demand: 15,
  },
};
