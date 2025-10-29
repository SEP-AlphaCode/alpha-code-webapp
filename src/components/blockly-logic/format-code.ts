import prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import parserEstree from "prettier/plugins/estree";
import * as uuid from 'uuid'

export async function formatCode(code: string): Promise<string> {
    try {
        const formatted = prettier.format(code, {
            parser: "babel",
            plugins: [parserBabel, parserEstree],
            semi: true,
            singleQuote: true,
            tabWidth: 2,
            trailingComma: "es5",
        });
        return formatted;
    } catch (err) {
        console.error("Format error:", err);
        return code; // fallback to original
    }
}

export function injectLoopCheck(code: string) {
    const patterns: RegExp[] = [
        // function foo(...) {
        /\bfunction\s+[\w$]+\s*\([^)]*\)\s*\{/g,
        // arrow function: const x = (...) => {
        /=\s*\([^)]*\)\s*=>\s*\{/g,
        // for loop: for (...)
        /\bfor\s*\([^)]*\)\s*\{/g,
        // while loop: while (...)
        /\bwhile\s*\([^)]*\)\s*\{/g,
        // do {...} while (...)
        /\bdo\s*\{/g,
    ];
    const loopCheckFnName = 'loop_check_' + (uuid.v4()).replaceAll('-', '_')
    for (const pattern of patterns) {
        code = code.replace(pattern, (match) => `${match}\n${loopCheckFnName}();\n`);
    }

    return {
        result: code.trim(),
        checkFnName: loopCheckFnName
    };
}