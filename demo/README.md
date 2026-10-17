# CampusDesk presentation

Final recording: **11 minutes 31 seconds**, 1280 × 720, H.264 video with AAC
narration, approximately 14.7 MB. [Media verification](../evidence/2026-10-17/media-verification.txt)
records the file hashes, audio/video streams and slide count.

- [Narrated MP4](walkthrough.mp4) — slides first, then source, application, tests,
  a real commit/push and CI result, Terraform/AWS, Argo CD, Kubernetes, Prometheus,
  Grafana, security, autoscaling and a verified cleanup appendix.
- [12-slide PDF](slides.pdf).
- [Narration and chapter times](NARRATION.md).
- [English subtitles](walkthrough.srt).

The narration is computer-generated using macOS Rishi, as requested by the owner;
it does not claim to be the student's recorded voice. Commands and application
interactions are real. AWS Console images and original provisioning transcripts
are dated captures from the same project deployment and are labeled accordingly.
The middle of the CI waiting interval is omitted; the actual result is retained.
Additional source excerpts and the final cleanup results are readable evidence cards.

Download the MP4 using GitHub's **View raw / Download** control if the repository
viewer does not play it inline. Keep the SRT alongside it for optional subtitles.

`local-walkthrough.mp4` is the older silent rehearsal, retained as history. The
submission video is **walkthrough.mp4**.

## Reproduction

`scripts/record-walkthrough.mjs` records the running system and synthesizes the
narration. `scripts/finalize-walkthrough.mjs` adds repository excerpts and verified
cleanup, trims the CI wait, and produces the MP4, SRT and narration index. These
scripts require the local application, Argo CD, monitoring, Playwright, macOS
`say`, FFmpeg and the dated evidence files. The finalizer verifies successful
cleanup evidence before adding that appendix. `RECORD_PUSH=1` explicitly enables
the real commit/push scene and commits only already-staged changes.
