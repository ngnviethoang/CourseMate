# Implementation Plan - Background Video Processing, Real-time Updates, and Clean Slide Features

We will refactor the video upload finalization logic to use a Hangfire background job, notify the client via SignalR upon completion, update the slide preview layout to black-on-white text, and add PPTX generation so users can download their slide outline directly.

## User Review Required

> [!NOTE]
> We will install `pptxgenjs` as a dependency in `coursemate-ui` to support client-side PPTX generation of edited slide outlines.

## Open Questions

None at this stage.

## Proposed Changes

---

### [Component Name] Backend - Video Upload Background Job

#### [NEW] [CompleteVideoUploadJob.cs](file:///d:/me/projects/CourseMate/CourseMate.Application/BackgroundJobs/CompleteVideoUploadJob.cs)
- Implement `CompleteVideoUploadJob` to handle merging of video chunks.
- On success:
  - Save `FileEntry` status as `Completed`.
  - Update `LessonVideo` URL if `LessonId` is provided.
  - Send a `VideoProcessed` real-time event to the user's SignalR connection with `{ FileId, FileUrl, Success = true }`.
- On failure:
  - Set `FileEntry` status to `Failed`.
  - Send a `VideoProcessed` real-time event with `{ FileId, Success = false }`.

#### [MODIFY] [INotificationService.cs](file:///d:/me/projects/CourseMate/CourseMate.Application/Services/NotificationServices/INotificationService.cs)
- Add `NotifyVideoProcessedAsync(Guid userId, Guid fileId, string fileUrl, bool success, string message, CancellationToken ct = default)` to the interface.

#### [MODIFY] [NotificationService.cs](file:///d:/me/projects/CourseMate/CourseMate.API/Services/NotificationService.cs)
- Implement `NotifyVideoProcessedAsync` to invoke SignalR client method `"VideoProcessed"`.

#### [MODIFY] [CompleteVideoUploadCommandHandler.cs](file:///d:/me/projects/CourseMate/CourseMate.Application/Commands/Files/CompleteVideoUploadCommandHandler.cs)
- Update `CompletedVideoUploadCommand` to include optional `Guid? LessonId` property.
- Change `CompleteVideoUploadCommandHandler` to enqueue `CompleteVideoUploadJob` in Hangfire instead of executing synchronously.
- Return a response immediately with `FileUrl = ""` or similar indicator.

---

### [Component Name] Frontend - Real-time Video Status & Clean Slides

#### [MODIFY] [file-service.ts](file:///d:/me/projects/CourseMate/coursemate-ui/src/lib/file-service.ts)
- Update `completeVideoUpload(fileId, totalChunks, lessonId)` to pass `lessonId` in the API payload.

#### [MODIFY] [video-upload.tsx](file:///d:/me/projects/CourseMate/coursemate-ui/src/app/management/lessons/[id]/video-upload.tsx)
- Add status option `'processing'`.
- Upon chunk upload completion, set status to `'processing'` (combining chunks).
- Establish a SignalR hub connection to `/hubs/notification` inside the component.
- Listen to `'VideoProcessed'` event.
- If `fileId` matches and `success` is true, set `videoUrl`, update state to `'success'`, and play the video.

#### [MODIFY] [ai-material-section.tsx](file:///d:/me/projects/CourseMate/coursemate-ui/src/app/management/lessons/[id]/ai-material-section.tsx)
- Update SignalR listener on `'DocumentProcessed'` to support both `lessonId`/`LessonId` and `message`/`Message` casing to ensure reliable auto-trigger of `loadOutline`.
- Re-style `SlidePreviewer` component to use a white background, black text, and simple bullet indicators.
- Replace static slide template download button with a dynamic PPTX download using `pptxgenjs`.

#### [MODIFY] [page.tsx](file:///d:/me/projects/CourseMate/coursemate-ui/src/app/management/lessons/[id]/page.tsx)
- Update `DocxAssistPanel` SignalR listener on `'DocumentProcessed'` to support both casing variants for `lessonId`/`LessonId`.

## Verification Plan

### Automated Tests
- Run backend tests to verify no compilation/logic breaks.

### Manual Verification
- Upload a video file chunk-by-chunk and verify:
  - Immediate return from `completed` API.
  - UI shows processing status.
  - Video merges successfully in the background.
  - SignalR notification is received.
  - UI automatically displays the video player once processing completes.
- Generate outline and verify:
  - Real-time SignalR outline completion triggers `GetOutline` automatically.
  - Preview displays black text on a white background.
  - "Tải slide" download button downloads a customized, correct PPTX file representing the slide contents.
