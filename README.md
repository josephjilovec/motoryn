# Motoryn

Public website: https://motoryn-amber.vercel.app/

## Experience

A complete automotive editorial site for the existing vehicle-care planning concept. The garage homepage uses original layered vehicle artwork, oversized variable typography, a moving type strip, subtle pointer response and scroll reveals. Linked pages cover the ownership record, workshop brief, brand context, local note builder and privacy.

Serve this repository root through the existing Vercel project. Static HTML, CSS and JavaScript; no framework, server, package installation, WebGL or build step is required. Keep existing hosting and domain settings.

## Routes and interactions

- `/`: the garage, original vehicle imagery and links into the service concept.
- `/the-record/`: three fictional evidence categories and a native detail overlay.
- `/the-brief/`: owner/workshop perspectives and an expandable sample brief.
- `/about/`: brand explanation and native FAQ disclosures.
- `/start/`: a three-step, browser-local ownership-note builder, editable output, copy, local text download and optional email-app handoff.
- `/privacy/`: exact boundaries of local drafts and display preferences.

The menu is a full-screen native dialog. Dialogs support Escape and focus return. The motion control pauses decorative animation; system reduced-motion preferences are respected. Color scenes and motion preferences use session storage only. Form fields and notes are not stored there. Essential content and standard links remain available without JavaScript; the note builder provides a direct-email alternative.

## Business and information boundaries

Motoryn remains a concept in development. No inspection, diagnosis, maintenance interval, verified shop network, vehicle-account integration, appointment or payment service is implied. Records and dates are explicitly fictional. The website does not automatically submit, upload or store entered form data. Visitors review and decide whether to copy, download or open their own email app. No analytics or advertising scripts are added. Existing contact email is retained.

## Assets

See [image provenance](assets/IMAGE_NOTES.md), [new image prompts and variants](assets/motion-images.json), and [font attribution](assets/fonts/README.md). The three new images are original AI concepts. No third-party reference-site code, characters, artwork, assets or proprietary font is copied. The original workshop image is preserved. Raster images have responsive sources and supporting images load lazily; the hero car uses a transparent WebP.

## Verification

Check all six routes, mobile overflow, full-screen menu and Escape/focus return, scene/motion preferences, record and brief interactions, local-note creation/edit/download/email URL encoding, reduced motion and no-JavaScript fallback. Do not send an email, submit real records, or book a service during QA. Preview-only configuration and harness files are excluded from publication.
