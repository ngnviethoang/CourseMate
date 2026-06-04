# Agent Plan: Auto Build and Fix Loop

## Goal

Automatically run `npm run build`, detect build errors, fix them, and repeat the process until the project builds successfully without errors.

## Main Workflow

1. Run the build command:

```bash
npm run build
```

2. Capture the full build output, including stdout and stderr.

3. Check the result:

   * If the build succeeds, stop the loop and report success.
   * If the build fails, analyze the error output.

4. Identify the root cause of the failure:

   * TypeScript errors
   * ESLint errors
   * Missing imports
   * Incorrect exports
   * Broken module paths
   * Invalid environment variables
   * Dependency issues
   * Framework-specific build errors
   * Syntax errors
   * Type mismatch errors

5. Apply the smallest safe fix possible.

6. Re-run `npm run build`.

7. Repeat until the build succeeds.

## Rules for the Agent

* Always inspect the exact build error before editing files.
* Do not guess the fix without evidence from the build output.
* Prefer minimal changes over large refactors.
* Fix one root cause at a time when possible.
* Preserve existing behavior unless the build error requires a change.
* Do not remove features just to make the build pass.
* Do not silence errors with `any`, `// @ts-ignore`, or disabling lint rules unless there is no safer option.
* Do not delete tests, pages, components, or business logic to bypass errors.
* If the same error repeats after a fix, re-check the affected file and adjust the solution.
* If a dependency is missing, inspect `package.json` before installing or replacing it.
* If the error is caused by environment variables, document the required variable instead of hardcoding secrets.
* Stop only when `npm run build` completes successfully.

## Loop Logic

```text
START
→ Run npm run build
→ Did the build pass?
   → YES: report success and stop
   → NO: read build errors
→ Locate affected files
→ Understand root cause
→ Apply minimal fix
→ Run npm run build again
→ Repeat
```

## Success Criteria

The task is complete only when:

```bash
npm run build
```

finishes with exit code `0` and no build-blocking errors.

## Final Report

After success, the agent should summarize:

* What errors were found
* Which files were changed
* What fixes were applied
* Confirmation that `npm run build` now passes
