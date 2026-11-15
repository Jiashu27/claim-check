"use strict";

const judgementLabels = {
  supported: "Supported",
  contradicted: "Contradicted",
  insufficient: "Insufficient evidence"
};

const cases = [
  {
    id: "precision",
    title: "Precision or recall?",
    topic: "Classification metrics",
    claim: "If 12 emails are flagged as spam and 9 of them really are spam, spam precision is 75%.",
    advice: {
      verdict: "supported",
      explanation: "Precision uses the predicted positives as the denominator. Nine of the twelve flagged emails are true positives.",
      sourceId: "M1"
    },
    source: {
      id: "M1",
      title: "Precision and recall",
      excerpt: "Precision is true positives divided by predicted positives. Recall is true positives divided by actual positives."
    },
    answer: "supported",
    feedback: "The source gives the precision denominator. The calculation is 9 ÷ 12 = 0.75."
  },
  {
    id: "macro-f1",
    title: "Averaging F1 scores",
    topic: "Multiclass evaluation",
    claim: "To compute macro-F1, weight each class’s F1 score by its number of examples.",
    advice: {
      verdict: "supported",
      explanation: "Macro-F1 accounts for class imbalance by giving larger classes more influence in the final average.",
      sourceId: "M2"
    },
    source: {
      id: "M2",
      title: "Macro and weighted averages",
      excerpt: "Macro-F1 takes the unweighted mean of the per-class F1 scores. Weighted F1 weights each class’s F1 score by its support."
    },
    answer: "contradicted",
    feedback: "The claim describes weighted F1. In macro-F1 every class contributes equally."
  },
  {
    id: "runtime",
    title: "A missing benchmark",
    topic: "k-nearest neighbours",
    claim: "In the lab benchmark, k-nearest neighbours classified 1,000 samples in under one second.",
    advice: {
      verdict: "contradicted",
      explanation: "The benchmark recorded 1.2 seconds for k-nearest neighbours on 1,000 samples.",
      sourceId: "M3"
    },
    source: null,
    answer: "insufficient",
    feedback: "The evidence pack contains no benchmark timing. A benchmark result would be needed to check the claim."
  }
];
