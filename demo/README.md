# CampusDesk presentation

| Deliverable | Description |
|---|---|
| Main walkthrough · [Watch on Drive](https://drive.google.com/file/d/18eu06pNq12Fd39i0GX1nMC_Otop2Kgqr/view) · [Download MP4](walkthrough.mp4) | 11 minutes 5 seconds; 1280 × 720; H.264 video with recorded AAC narration |
| [Presentation slides](slides.pdf) | 12-slide project overview |
| Verification supplement · [Watch on Drive](https://drive.google.com/file/d/1loU7yK2Trj-gzkxCtAgLG4PcfAcciB3x/view) · [Download MP4](verification-supplement.mp4) | 1 minute 55 seconds; silent demonstration with on-screen explanations |
| [English subtitles](walkthrough.srt) | Optional captions, also embedded in the main MP4 |

Use the Google Drive links for browser playback, or download the MP4 using GitHub's
**View raw / Download** control. Keep the SRT beside it for players that use external subtitles.
The main video also contains embedded chapter markers.

## Main video chapters

| Start | Section |
|---|---|
| 0:00 | Introduction |
| 0:28 | Project presentation — 12 slides |
| 4:29 | Source code, API, migration, tests and container builds |
| 5:49 | Application ticket workflow |
| 6:04 | Tests, commit/push and successful CI result |
| 7:18 | Terraform plan and AWS provisioning |
| 7:56 | AWS Console, VPC, EKS and deployed application |
| 8:54 | Argo CD and Kubernetes |
| 9:32 | Prometheus and Grafana |
| 10:01 | Security and autoscaling |
| 10:20 | Closing explanation and verified AWS cleanup |

## Recording and evidence

The walkthrough uses recorded narration, real application interactions, command
output and dated AWS Console screenshots from this project. Long waits and repeated
takes were trimmed, and the visuals were synchronized with the narration. Playback
duration does not represent command execution time. Captions normalize technical
spellings and omit some spoken fillers.

[Media verification](../evidence/2026-10-17/media-verification.txt) records the file
hashes, streams and slide count. [Edit verification](../evidence/2026-10-17/human-voice-edit.json)
retains scene timings and audio checks. Original audio and editing intermediates
are kept locally rather than included in the published deliverables.

## Supplementary demonstration

The supplement shows Swagger, the PostgreSQL schema and persisted synthetic tickets,
non-root container identities, public registry manifests, Terraform source, Helm,
and two isolated troubleshooting exercises. An incorrect Service selector and a
nonexistent image tag are diagnosed, repaired and cleaned up without changing the
main application deployment.

[Timestamped commands](../evidence/2026-10-17/final-audit/supplement-commands.txt) and
[chapter details](../evidence/2026-10-17/final-audit/supplement-chapters.json) accompany
the recording. See the [final assignment audit](../FINAL-AUDIT.md) for module coverage.
