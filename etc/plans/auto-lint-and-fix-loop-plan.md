# Agent Plan: Auto Lint and Fix Loop

## Goal

Automatically run `npm run lint`, detect lint errors, fix them, and repeat the process until lint passes without errors.

## Main Workflow

1. Run the lint command:

```bash
npm run lint
```

2. Capture the full lint output, including stdout and stderr.

3. Check the result:

   * If lint succeeds, stop the loop and report success.
   * If lint fails, analyze the lint output.

4. Identify the root cause of each lint failure:

   * Unused variables
   * Missing imports
   * Incorrect import order
   * Formatting issues
   * React hook dependency warnings
   * TypeScript lint errors
   * Accessibility issues
   * Naming convention violations
   * Forbidden patterns
   * Framework-specific lint rules

5. Apply the smallest safe fix possible.

6. Re-run `npm run lint`.

7. Repeat until lint succeeds.

## Rules for the Agent

* Always inspect the exact lint output before editing files.
* Do not guess the fix without evidence from the lint result.
* Prefer minimal changes over large refactors.
* Fix one root cause at a time when possible.
* Preserve existing behavior unless the lint rule requires a code change.
* Do not remove business logic just to make lint pass.
* Do not silence lint errors with disable comments unless there is no safer option.
* Do not use `any`, `// @ts-ignore`, or broad rule disabling as the default fix.
* If a warning is configured to fail the lint command, treat it as a blocking issue.
* If the same lint error repeats, re-check the affected file and adjust the solution.
* If the lint tool supports auto-fix, use it first only when it is safe:

```bash
npm run lint -- --fix
```

* After auto-fix, review changed files before continuing.
* Stop only when `npm run lint` completes successfully.

## Loop Logic

```text
START
→ Run npm run lint
→ Did lint pass?
   → YES: report success and stop
   → NO: read lint errors
→ Locate affected files
→ Understand root cause
→ Apply minimal safe fix
→ Run npm run lint again
→ Repeat
```

## Success Criteria

The task is complete only when:

```bash
npm run lint
```

finishes with exit code `0` and no lint-blocking errors or warnings.

## Final Report

After success, the agent should summarize:

* What lint errors were found
* Which files were changed
* What fixes were applied
* Confirmation that `npm run lint` now passes
