import { RobotAction } from "./robot";
import { RobotDance } from "./robot";
import { RobotExpression } from "./robot";

export type RobotCategory = "action" | "dance" | "expression";

/**
 * Type chuẩn dùng cho UI (Grid, Tab, List, v.v.)
 */
export interface RobotActionUI {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  duration?: number; // có thể null với expression
  imageUrl?: string | null;
  icon?: string | null;
  status: number;
  statusText: string;
  createdDate?: string;
  lastUpdate?: string;
  category: RobotCategory;
}

/**
 * Mapper: convert Action -> RobotActionUI
 */
export const mapActionToUI = (action: RobotAction): RobotActionUI => ({
  id: action.id,
  name: action.name,
  code: action.code,
  description: action.description,
  duration: action.duration,
  icon: action.icon,
  status: action.status,
  statusText: action.statusText,
  createdDate: action.createdDate,
  lastUpdate: action.lastUpdate,
  category: "action",
});

/**
 * Mapper: convert Dance -> RobotActionUI
 */
export const mapDanceToUI = (dance: RobotDance): RobotActionUI => ({
  id: dance.id,
  name: dance.name,
  code: dance.code,
  description: dance.description,
  duration: dance.duration,
  icon: dance.icon,
  status: dance.status,
  statusText: dance.statusText,
  createdDate: dance.createdDate,
  lastUpdate: dance.lastUpdate,
  category: "dance",
});

/**
 * Mapper: convert Expression -> RobotActionUI
 */
export const mapExpressionToUI = (expression: RobotExpression): RobotActionUI => ({
  id: expression.id,
  name: expression.name,
  code: expression.code,
  description: null, // Expression không có description
  duration: undefined, // Expression không có duration
  imageUrl: expression.imageUrl,
  icon: null,
  status: expression.status,
  statusText: expression.statusText ?? "",
  createdDate: expression.createdDate,
  lastUpdate: expression.lastUpdate,
  category: "expression",
});
