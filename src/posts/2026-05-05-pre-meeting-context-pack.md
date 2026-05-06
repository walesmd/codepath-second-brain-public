---
title: What I read before each meeting now
date: 2026-05-05
draft: true
summary: Four days ago I closed a post by saying the pre-meeting context pack was probably the next thing I'd ship. It's running. Here's what it does, why it's structured as ambient automation rather than an on-demand skill, and where it still falls down.
---

Four days ago I closed the calendar-scheduling post by saying the next thing out of the persona analysis would probably be the pre-meeting context pack — the one that fires before any multi-attendee meeting and pulls relevant prior context into a brief that sits inside the calendar event. It's running. M-F at 7:33 AM, on the same machine that does my morning prep, before I'm awake to ask for it.

Here's what it does and what I learned building the second one.

## The shape of the gap

I already had two pieces of meeting infrastructure. The morning prep skill assembles a brief at 7:34 AM that walks through my day. The Granola ingest at 6 PM pulls every transcript from meetings that already happened. Both work well. But there was a window in the middle that nothing covered: the 30 minutes before a meeting starts, when I want to know what doc Chris attached to the invite and whether I've already read it.

That sounds small. It is small. But the cost of not knowing is that I either (a) walk in cold, which feels worse than it sounds when the doc was attached three days ago and I missed it, or (b) spend five minutes during the meeting clicking through links to catch up while the conversation moves past me. Neither scales when the calendar is dense.

## What it actually does

The skill runs as a scheduled task. At 7:33 AM, before the morning prep starts, it pulls the next 48 hours of my calendar, hydrates each event for the description and location fields, scans those for document URLs, and fetches the ones it can reach. The result is a dated pre-reads file the morning prep then folds into each meeting's "things to know" block.

Three connectors do the actual work. Google Calendar lists and hydrates events. Google Drive fetches Docs, Slides, Sheets, and Drive files. Notion fetches pages. Anything else — Loom, Figma, GitHub, raw URLs — the skill notes in the digest but doesn't try to fetch.

The output for any given meeting looks like this:

```
### 2:30 PM CT — Extended Leadership Meeting
**Pre-reads:**
- [Agenda/Notes - Extended Leadership Meeting] (Google Doc)
  - Status: previously ingested 2026-05-01, no refetch
  - Standing weekly notes/agenda doc. ELT members surface topics for Quinton each week.
- [2026 OKRs] (Notion)
  - Wrapper page around the inline OKR database — link only, no prose.
```

Two minutes of read, and I know what's been attached, what's changed, and what's the same recurring doc I've already seen six times.

## The boring parts that earn their keep

Most of the skill's lines are not about fetching documents. They're about deciding which events deserve a fetch in the first place, and which URLs in those events count as a pre-read versus noise.

The skip rules took the longest to get right. Anything I declined gets ignored. So do school drop-offs and pick-ups, focus blocks, lunches with no attendees, and any event where I'm the only person on the invite. Out-of-office and birthday events are skipped by event type. The first version of this didn't have most of those rules and the digest was a wall of personal blocks I didn't need summaries of.

URL extraction is the second tedious part. Google Calendar puts everything in the description field as raw HTML, and the field can contain a Zoom link, a Drive doc, a Notion page, a Loom recording, a GitHub link, a mailto, and a Granola share-URL all in the same invite. Some of those count as pre-reads (Drive, Notion). Some are out of scope (Loom, Figma — recordings I'm not going to skim before a meeting). Some are noise to strip entirely (Zoom, Meet, Teams, mailto). And Granola URLs I explicitly skip because the 6 PM ingest already covers them.

The seen-URLs cache is the piece I'm proudest of. The same agenda doc shows up on the same recurring 1:1 every week. Without a cache, the skill would re-summarize it every Monday morning, and the digest would be 80% restating things I read three weeks ago. With a cache, recurring docs get marked "previously ingested 2026-05-01, no changes" and the summary block disappears. The skill only re-fetches when the content hash changes or the URL hasn't been seen in over seven days.

## What ambient automation has to get right

The calendar-scheduling skill from the last post is invoked. I type a request, it answers, I see the result. If it's wrong, I notice immediately.

This skill is the opposite. It runs at 7:33 AM, I'm not watching, and the only signal of failure is that the morning prep is missing context I expected. Ambient tools fail quietly by default, and the consequences of a quiet failure compound — I read the digest, trust it, walk into a meeting having missed something, and don't realize the skill dropped a doc until the meeting is half over.

So the skill has more error handling than logic. Permission-denied on a Drive doc captures the owner's email so the digest can tell me who to ping for access. A doc too big to inline gets a partial fetch from the first 8000 characters instead of an empty result. A connector being down doesn't abort the whole run — it marks the affected URLs and processes everything else. Zero candidate events still produces an output file with a "no work meetings" note, so the morning prep can tell the difference between "the task ran and found nothing" and "the task didn't run."

None of that is interesting in isolation. It's interesting because the alternative is silent drift, and silent drift is what kills trust in automated systems faster than anything else.

## The thing I deliberately didn't do

I didn't try to ingest every fetched doc as durable knowledge.

The temptation was real. I have a knowledge-ingest pipeline that pulls source documents into topic files in the memory system, and most invite-attached docs are technically ingest-able. But most invite-attached docs are also ephemeral — agenda lists, "discuss these three things," prior-week action item recaps. Treating them as durable would pollute the topic files with operational noise.

So the skill makes a depth call per doc. Durable content (org charts, partnership briefs, strategy memos, role descriptions) gets pulled into the topic files via the existing ingest patterns. Ephemeral content stays in the pre-reads file and never goes upstream. The pre-reads file itself auto-archives monthly. When in doubt, the rule is err ephemeral.

## Four days running

The skill has now produced a pre-reads file every weekday morning since May 1. Today's caught two cached docs for the ELT meeting (the standing agenda doc and the 2026 OKRs page in Notion), correctly noted both were previously ingested with no changes, and skipped the Zoom-hosted agenda surface for my Mitchell 1:1 because the skill doesn't fetch from `docs.zoom.us` (out of scope by design).

The morning prep folds these into each meeting's brief automatically. I don't think about the skill anymore. That's the test.

## What fell down

Two things, both still open.

First, large Google Docs come back as a saved file path instead of inline content because the response exceeds the connector's token budget. The fallback is `head -c 8000` against the saved path, which captures the opening 8K characters of the doc. That's almost always enough for a pre-read summary because docs front-load their context. But it's a hack, and on the day I get a doc whose useful content lives below the fold, the summary will be wrong in a way I won't notice.

Second, the Zoom-hosted agenda surface is genuinely useful and the skill ignores it. Multiple of my recurring 1:1s use Zoom's built-in agenda feature instead of attaching a Google Doc, and I've now seen three meetings this week where the pre-reads file is empty even though there was an agenda — it just lived inside the Zoom invite UI. Either I add a Zoom connector path or I lean on the Google Doc convention. I haven't decided.

## What's next

There's a third skill from the persona analysis I want next: the post-meeting closeout. Granola already captures the transcript. What I don't have is a structured pull-out of action items, decisions, and "things I said I'd send by Friday" that lands in the right surface (the action-items file, the relevant project tracker, a draft Slack reply for things that need a response). That's three of the five personas' biggest source of dropped balls, and right now the closest thing I have is me skimming Granola notes manually.

That one's bigger than the first two and I want to scope it carefully before claiming it. Probably the next post.

Curiosity compounds,

— Mike

---

*This post is part of the internal documentation series for the CodePath Second Brain pilot. Questions or reactions? Find me in #tools-talk.*
