# Claim Check

Prose word count • 361

## Status and stack

Claim Check is a browser practice prototype for judging three revision claims with imperfect AI advice. HTML and CSS present the cases. JavaScript handles judgement, source lookup, feedback timing and restart. Fixed verdict, explanation and source ID fields simulate AI responses. The illustrative evidence excerpts were written for these cases. Live retrieval, model calls and participant evaluation are future work. Decisions stay in browser memory and clear on reload or restart.

## Run or inspect

Open `index.html` in a modern browser. The files run offline without dependencies, accounts or API keys. If local file access is restricted, serve the folder and open http://localhost:8000.

```bash
python3 -m http.server 8000
```

Choose when to see feedback before revealing advice. For Precision or recall?, select Contradicted, reveal the advice, open M1, then change to Supported. For Averaging F1 scores, retain Contradicted after opening M2. For A missing benchmark, inspect M3 and choose Insufficient evidence. For deferred feedback, complete all three cases and revisit earlier cases from the case buttons. See [review checklist](evidence/replay.md). The optional state checks run with Node.js.

```bash
node evidence/check.cjs
```

## Development record

The milestones below refer to the original local development history. The public GitHub commit records the published snapshot.

- `9899d04` defined grounded, contradicted and missing source examples with stable evidence and expected answers.
- `bbcc8fd` added initial judgement, disclosure of advice and evidence, and independent final judgement.
- `4b9c712` preserved each case decision and added two feedback timings to carry the Assignment 1 question into repeated practice.
- `f95e92b` refined the focus handoff to the final choices. JavaScript state checks exercised gated disclosure, both feedback timings, incorrect final feedback, recovery and restart.

## AI assistance

ChatGPT (Codex) helped design and implement the prototype, draft the report and draw the figures. The initial draft gave feedback immediately. It was extended to defer feedback until all cases were complete so that timing could be varied separately from the explanation. The test harness checked the implemented states against the examples. The report’s paper descriptions were checked against the publications.

## Accompanying files

The project report is supplied separately. The source package includes a Git bundle to preserve the development history and release tag. The bundle preserves the original local revisions. All runnable project files are in this public repository.
