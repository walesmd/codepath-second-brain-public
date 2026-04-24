---
title: Before you ship AI tools to your team, learn how your team actually works
date: 2026-04-23
draft: true
summary: How we used calendar data to map five work patterns across 22 CodePath employees — and what 12 concrete AI use cases came out the other side.
---

Most AI rollouts at organizations follow a familiar pattern: pick a tool, write a usage policy, host a demo, send a Slack message. Some people start using it. Most don't. The org declares a win because seats were provisioned, and moves on.

We wanted to try something different.

Before building anything for the Second Brain pilot, we asked a more basic question: how do our colleagues actually spend their time? Not at the job-title level — "Program Manager does program things" — but at the calendar and workflow level. What meetings do they sit in, how often, with whom? What rituals do they repeat every week? Where does information pile up and then get manually moved somewhere else?

The idea was to let the real work tell us where AI could help, rather than guessing.

## What we actually did

We ran an 8-week calendar analysis across 22 CodePath employees, spanning every major team: product, engineering, programs, partnerships, people, finance, and ops. We cross-referenced calendar data against Notion — role pages, org chart, team homepages — to confirm who was doing what. The goal wasn't to monitor anyone; it was to surface the work patterns underneath the job titles.

What came back wasn't 22 unique profiles. It was five.

## Five shapes of work

When you look past the domains and the org chart, almost everyone at CodePath fits one of five work patterns. We call them personas — types of work, not portraits of individuals. Each covers three to six people whose daily shapes look remarkably similar even though their actual jobs are quite different.

**The Strategy Coordinator** runs multiple parallel workstreams across external stakeholders, leadership, and hiring. Their calendar mixes a dense executive rhythm (weekly syncs, officer reviews, 1:1s with directs) with a large one-off layer driven by funder touchpoints, board preparation, and hiring panels. More than 60% of their meetings, in some cases over 80%, are non-recurring. The defining cognitive load: "where did we leave off?" across a dozen simultaneous threads.

**The Partnership Operator** maintains a portfolio of 10 to 20+ concurrent external relationships. Two of the three people in this persona block time every single weekday for a triple-tool audit — HubSpot, Notion, Asana — just to know which partnerships need attention. They're essentially using their calendar as a CRM operating system. The real pain isn't the meetings; it's everything that happens after: the transcript-to-HubSpot-to-follow-up-email chain that currently runs entirely on human memory and willpower.

**The Program Conductor** runs a structured recurring operation — a cohort, a curriculum cycle, a team — at high cadence. Their calendar is 60 to 80% recurring, the highest in the dataset. They carry a dense network of named 1:1s (one person has 30+ named relationships), run per-student or per-report intervention cycles, and synthesize their week upward on a recurring deadline. When the machine runs smoothly, the week flows. When one thing slips, it cascades.

**The People Operator** runs a recurring people cycle — onboarding, compliance, recruiting — with a ritualized daily triage and a constant inbound volume. One person's calendar showed 82 "Check Email/Slack" bookend blocks in eight weeks. Another processed nearly 15 new-hire welcome meetings over the same period. One person alone ran Resume Review 41 times. The work is predictable in shape but overwhelming in volume.

**The Systems Steward** produces structured artifacts on cadence from data scattered across source systems: KPI snapshots after leadership meetings, funder budget reports reshaped per foundation, SaaS renewal audits, payroll reconciliations. Their meeting load is relatively light, but their artifact load is high. One person's calendar literally shows an event titled "Snapshot KPIs after leadership meeting" — eight times in eight weeks. Same ritual, same manual process, every week.

## What those patterns tell us

A few things jumped out.

First, the problem most people experience as "I don't have time" is actually more specific: they spend a lot of time on context reconstruction. Pre-meeting state-rebuilding, post-meeting write-up, re-synthesizing a week's work for an upward 1:1 — these are all versions of the same thing. Information exists somewhere (in transcripts, in HubSpot notes, in Notion docs), but getting it out of wherever it lives and into the moment when you actually need it is entirely manual.

Second, the rituals are remarkably stable. The daily audit blocks, the weekly up-synthesis, the post-meeting filing — these aren't ad hoc. People have already built routines around these pain points, which means they've implicitly validated that the problem is real and recurring. That's useful signal for where AI can actually slot in.

Third, the tools aren't the gap. Almost everyone in the pilot uses Google Calendar, Fireflies, Notion, and Slack. The connective tissue between those tools — the step that moves information from a meeting transcript to a downstream record, or from a scattered week to a structured update — is where the manual work lives.

## Twelve use cases that fall out of this

From the five personas, we built 12 concrete use cases. Each has a specific trigger, input, processing logic, output, and — importantly — an "existing slot it fits into." We didn't design hypothetical workflows; we looked for places where AI output could land inside something people already do.

Five of the twelve apply across most or all personas:

A pre-meeting context pack, delivered 30 minutes before any multi-attendee meeting, pulling the most relevant prior interactions with the attendees into a brief that sits inside the calendar event you're about to open. A weekly up-synthesis digest, drafted from the week's transcripts and tasks on Friday afternoon, ready to edit rather than write from scratch. A named 1:1 prep pack, surfacing prior commitments and recent activity before recurring check-ins. A meeting-to-artifact autopilot, routing Fireflies transcripts to the right downstream record — Greenhouse note, HubSpot update, Notion doc — rather than stopping at the transcript. And a morning triage brief, replacing the manual inbox sweep with a classified 90-second digest.

The remaining seven are persona-specific: a hiring loop decision synthesizer for the Strategy Coordinator running multiple parallel panels, a portfolio morning pulse that replaces the Partnership Operator's daily three-tool audit, a per-student intervention brief for Program Conductors before each student check-in, a resume review bookend for the person running 41 resume sessions over eight weeks. Each one is narrow enough to be buildable and specific enough to be testable.

## Why this matters for the pilot

There's a reasonable version of this project where we skip this step entirely. Someone demos Claude, we share a usage guide, we call it AI enablement. Plenty of organizations stop there.

The problem with that version is that AI assistance is only useful when it fits the work, not just the job title. A Program Conductor and a Systems Steward might sit in the same Claude training session, come away with the same tool, and have completely different experiences — not because one is more motivated or technically savvy, but because their underlying work shapes and pain points are different. Generic tools don't solve specific problems.

What the persona work gives us is a way to build the Second Brain pilot against real use patterns rather than hypothetical ones. We know which use cases fire multiple times daily versus weekly. We know which connectors need to be live before certain use cases make sense. We know that feasibility (writing back into Greenhouse or HubSpot) is the dimension most likely to determine whether the high-value use cases are actually deliverable in the near term.

That's not a typical starting point for an AI rollout. It's a more useful one.

---

*This post is part of the internal documentation series for the CodePath Second Brain pilot. Questions or reactions? Find us in #tools-talk.*
