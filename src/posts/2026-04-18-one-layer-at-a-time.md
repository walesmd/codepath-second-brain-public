---
title: What runs while I'm not looking
date: 2026-04-18T15:48:11-05:00
summary: A walkthrough of the three scheduled tasks that pull my day together without me asking, plus the pipeline that rebuilds this dashboard overnight.
---

The first post on this site probably made it sound like I built a Second Brain from scratch. I didn't. The scaffolding came from Nathan Esquenazi's Cowork starter pack: the memory system, the async-messaging pattern (`claude-messages/`), the scheduled-task architecture, and the 20-plus CodePath org knowledge files I lean on every day. That base was already compounding long before I added anything.

What I added on top is smaller than it looks. Three scheduled tasks run without me asking. Each one taps into the connectors I've given Cowork (Gmail, Google Calendar, Slack, Notion, HubSpot, Granola) and writes a markdown file I read later. The tasks are the point of this whole exercise. The public dashboard further down is the side project.

## The morning brief

Every weekday at 7:55 AM Central, a task called `daily-morning-prep` fires. It pulls today's calendar, cross-references each meeting against my memory files and action items, checks Slack for anything overnight that looks urgent, and writes a brief into `daily-prep/`.

By the time I sit down with coffee, the file is already there. It tells me who I'm meeting with, what was said to them last, what I owe them, and what's sitting in my action items that's tied to today's schedule. I don't have to think about what's on deck. I read the brief and start.

The connectors do most of the work. Google Calendar for the schedule. Gmail for overnight threads. Slack for overnight messages. The memory system for who's who. Cowork glues them together through a single prompt that runs on a timer.

## The nightly commit

Every night at 11:55 PM, `nightly-git-commit-push` stages whatever has changed in my private notes, commits it with today's date, and pushes GitHub.

This one isn't fancy. It exists because I'm an Engineer and if it's not in git, it doesn't exist. Later on, when I realized I wanted a web-based dashboard, this kept the build from running against stale notes or refusing to run because the private repo had drift. Automating the commit removed a class of small potential failures.

It also means the private repo has a continuous history. Not a flurry of commits when I remember, followed by a week of silence. A steady line of daily snapshots, which is what the dashboard's staleness metrics actually rely on.

## The Friday status

Every Friday at 6 PM Central, `weekly-status-update` compiles the week. It reads Calendar to see what I actually attended, Slack for threads I was in, Gmail for anything that mattered, the action items file for what closed and what moved, and all five daily-prep files from the week. It drops a status note into `weekly-updates/`.

The Friday file is the one I'd actually want to hand to a manager. It's the week as it happened, not as I remember it Monday morning.

## Two organizing pieces that make the automation work

The scheduled tasks are only as useful as what they can read. Two small additions make the reads richer.

`ACTION-ITEMS.md` is a single markdown file of open items, each with a trigger condition. "Raise this with Chris at the Monday 1:1." "Expect this info from Anna on April 20." The morning brief reads this file and surfaces whatever's relevant to the day's calendar. The weekly status reads it and reports what closed and what's aging.

The `projects/` folder holds active work that isn't really knowledge. Each project has a `BRIEF.md`, a `notes.md`, and a `docs/` subfolder. When a project comes up in that day's meetings, the morning brief pulls from the brief file the same way it pulls from a topic file. New information about a live project goes into the project folder, not into the general memory, so the main knowledge base doesn't get polluted by in-flight work.

Neither of these is clever. They just give the scheduled tasks more signal to work with.

## The public dashboard (the side project)

The automation above is the core. What I built this weekend was the dashboard pipeline, which is optional. You could run the three scheduled tasks forever without publishing a line.

The pipeline has five pieces. A public repo separate from the private one. An analytics script (`build_metrics.py`, about 400 lines of stdlib-only Python) that walks the private repo, counts files and lines and commit history, and writes a `metrics.json` into the public repo. An Eleventy site that serves from `/docs` via GitHub Pages, with one layout, one index template, and one post template. An orchestrator shell script that runs the whole thing as a pipeline: push the private repo, bail out if the public repo has uncommitted drafts, regenerate analytics, rebuild Eleventy, commit and push. A launchd plist (`com.walesmd.secondbrain.build.plist`) that fires the orchestrator at 6 AM local time.

The orchestrator's safety check was the best call I made there. The pipeline regenerates `docs/` and `src/_data/metrics.json` every night, but if I've got an uncommitted draft post or a CSS tweak in the public repo, the script stops and waits for me to resolve it by hand before touching anything.

So there are two scheduling systems running side by side. Cowork's scheduled tasks handle the three automation jobs (morning, nightly, Friday), because those need the connectors. Launchd handles the dashboard rebuild, because that one's just shelling out to git and python and doesn't need Cowork at all. Different tools for different shapes of job.

## What this actually cost

The three scheduled tasks took maybe two hours of prompt iteration to get the output files the way I wanted them. The dashboard pipeline was maybe six hours of real code across a few sessions: around 500 lines of Python and bash combined, one Eleventy layout, one page template, one post template, one CSS file. The hard part wasn't the code. It was deciding which numbers on the dashboard would tell a story worth looking at, and writing prompts for the scheduled tasks that produce files worth reading in the morning.

## What the starter pack saved me

Months of scaffolding, conservatively. I didn't design the memory system. I didn't invent the async-messaging channel. I didn't figure out how scheduled tasks should be structured inside Cowork. All of that is in Nathan's starter pack. What I did was plug in my connectors, write three prompts for the scheduled tasks, add two small organizing files, and bolt a public dashboard onto the side of it.

If you're at CodePath and you want to do something similar, the honest advice is: start with Nathan's starter pack. Wire up your own connectors. Write the first scheduled task, even a rough one. See what lands in the file the next morning. That's when it clicks and continue to iterate.

— Mike
