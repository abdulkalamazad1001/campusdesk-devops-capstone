# CampusDesk presentation

Final recording: **11 minutes 5 seconds**, 1280 × 720, H.264 video with AAC
narration, approximately 20.4 MB. [Media verification](../evidence/2026-10-17/media-verification.txt)
records the file hashes, audio/video streams and slide count.

- [Narrated MP4](walkthrough.mp4) — slides first, then source, application, tests,
  a recorded commit/push and its CI result, Terraform/AWS, Argo CD, Kubernetes,
  Prometheus, Grafana, security, autoscaling and verified cleanup.
- [12-slide PDF](slides.pdf).
- [Narration and chapter times](NARRATION.md).
- [English subtitles](walkthrough.srt), also embedded as an optional MP4 track.
- [Original recording script](RECORD-YOUR-VOICE.md); its timestamps refer to the earlier edit.

**T. Abdul Kalam Azad narrates this version in his own recorded voice.** The
13:57 microphone recording was edited to remove waiting time, an interruption,
repeated takes and a few reading slips. Natural phrasing is retained. Light noise
reduction and loudness leveling make speech consistent, and the 35 visual sections
are timed to the narration. There is no synthetic voice in this version.
Captions normalize technical spellings and omit some spoken fillers. The MP4
contains 35 chapter markers; caption/chapter support depends on the player.

Commands and application interactions are real recorded demonstrations. AWS
Console images and provisioning transcripts are dated captures from this project.
The recordings are retimed for the narration; they do not represent wall-clock
execution speed. The quiet middle of the CI wait is omitted, with the actual
result retained. Source excerpts and final cleanup results are evidence cards.

Download the MP4 using GitHub's **View raw / Download** control if the repository
viewer does not play it inline. Keep the SRT alongside it for players that use
external subtitles. The optional captions can be switched on in the player.

`local-walkthrough.mp4` is the older silent rehearsal, retained as history. The
submission video is **walkthrough.mp4**. The earlier synthetic narration remains
in Git history and in a local backup, while the unedited microphone recording is
kept locally and is not committed.

## Editing record

[Human-voice edit verification](../evidence/2026-10-17/human-voice-edit.json) records
the duration, scene timings, file hashes and audio checks. Source audio and
intermediate edits are preserved under ignored `evidence/local/human-voice/`.
The original audio is also saved as `CampusDesk-my-voice-original.m4a` in Downloads.

The original `scripts/record-walkthrough.mjs` and
`scripts/finalize-walkthrough.mjs` reproduce the earlier synthetic-voice recording
from the live application and dated evidence; they do not rebuild this human-voice
edit. Do not run the finalizer on the already finalized video.
