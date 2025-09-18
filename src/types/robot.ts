import React from "react";

export interface RobotAction {
  id: string;
  name: string;
  description?: string;
  image?: React.ReactNode;
  color?: string;      // cho background gradient
  bgColor?: string;    // riêng cho grid circle
  commands: string[];
}
