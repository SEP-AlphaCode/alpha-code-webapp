export type Json = {
    [key: string]: unknown
}

export type BlockType =
    | "value"
    | "call_function"
    | "add_function"
    | "statements"
    | "if"
    | "loop"
    | "comment";

export interface BaseBlock {
    type: BlockType;
}

export interface ValueBlock extends BaseBlock {
  type: "value";
  /** Whether this value is a literal constant or an evaluated expression */
  is_literal: boolean;
  /** Literal value or nested function/value block */
  value: number | string | void | CallFunctionBlock | ValueBlock;
  /** Declared data type */
  dtype: "number" | "string" | "list" | "void" | string;
}

// ─── 2. Call Function ───────────────────────────────────────
export interface CallFunctionBlock extends BaseBlock {
  type: "call_function";
  fn_name: string;
  args: ValueBlock[];
}

// ─── 3. Add Function (declaration) ──────────────────────────
export interface AddFunctionBlock extends BaseBlock {
  type: "add_function";
  fn_name: string;
  /** Parameter count or list of parameter names (you can pick one) */
  args: number | string[];
  /** Body code: sequence of blocks */
  code: ExecutableBlock[];
  /** Return expression (often an access_var call) */
  return: ValueBlock;
}

// ─── 4. Statements ──────────────────────────────────────────
export interface StatementsBlock extends BaseBlock {
  type: "statements";
  code: ExecutableBlock[];
}

// ─── 5. If ──────────────────────────────────────────────────
export interface IfBlock extends BaseBlock {
  type: "if";
  condition: ValueBlock;
  /** Executed if condition true */
  if_true: ExecutableBlock[];
  /** Executed if condition false — can be another if, or a statements/code array */
  if_false?: ExecutableBlock[] | IfBlock;
}

// ─── 6. Loop ────────────────────────────────────────────────
export interface LoopBlock extends BaseBlock {
  type: "loop";
  condition: ValueBlock;
  code: ExecutableBlock[];
}

// ─── 7. Comment ─────────────────────────────────────────────
export interface CommentBlock extends BaseBlock {
  type: "comment";
  text: string;
}

// ─── 8. Union Types ─────────────────────────────────────────
export type ExecutableBlock =
  | CallFunctionBlock
  | AddFunctionBlock
  | StatementsBlock
  | IfBlock
  | LoopBlock
  | CommentBlock;

// Blocks that can appear as expressions (values)
// export type ExpressionBlock = ValueBlock | CallFunctionBlock;

// The entire program
export type Program = ExecutableBlock[];