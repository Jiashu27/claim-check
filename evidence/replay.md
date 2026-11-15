# Replay checklist

| Case | Initial choice | Simulated AI | Evidence to inspect | Expected final choice |
| --- | --- | --- | --- | --- |
| Precision or recall? | Contradicted | Supported | M1 defines the denominator as predicted positives | Supported |
| Averaging F1 scores | Contradicted | Supported | M2 says that macro-F1 uses an unweighted mean | Contradicted |
| A missing benchmark | Supported | Contradicted | M3 cannot be found in the evidence pack | Insufficient evidence |

1. Select **After each case**. Open each case and confirm the advice is initially hidden. Replay the table and confirm that feedback shows the initial judgement, simulated verdict and final judgement. Revisit a case and check that its recorded choices remain visible.
2. Restart, select **After all cases** and complete one case. Check for a saved decision and delayed outcome. Complete the remaining cases and revisit the first case to confirm that feedback is now shown.
3. Follow the incorrect macro-F1 recommendation in a fresh run. Confirm that the feedback asks the user to reconsider and distinguishes macro and weighted F1.
4. Restart. Confirm that the advice gate is restored, the count is zero, and the feedback timing selector is enabled.

The repository can be checked without an account or an internet connection by opening `index.html`.
