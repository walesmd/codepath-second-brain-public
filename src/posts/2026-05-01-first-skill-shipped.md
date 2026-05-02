---
title: From persona to first skill shipped
date: 2026-05-01
summary: Eight days ago I claimed the persona work would let me build AI for real work patterns instead of guessing. Here's the first thing I shipped, what it does, and where it almost didn't work.
---

Eight days ago I posted about running an 8-week calendar analysis across 22 colleagues to find five recurring shapes of work, and I closed with a claim: this would let me build the Second Brain pilot against real use patterns rather than hypothetical ones.

That's the kind of thing easy to write and hard to actually do. So here's the first one.

## Why scheduling

Of the twelve use cases I pulled out of the persona analysis, calendar scheduling wasn't the most ambitious. It was the most cross-cutting. Every one of the five personas had it. The Strategy Coordinator juggling parallel hiring loops. The Partnership Operator coordinating across 10+ external relationships. The Program Conductor with 30+ named 1:1s. The People Operator running a constant new-hire intake. The Systems Steward booking the recurring snapshot review. Different jobs, same friction.

It's also the kind of friction that's invisible until you measure it. A 30-minute meeting between two busy people takes maybe 4-7 minutes to actually book — checking availability, finding overlap, double-checking time zones, sending the invite, attaching a Zoom link, writing a one-line agenda. Multiply that by a dozen meetings a week and you're bleeding an hour of context-switched, no-flow time. None of which shows up in a calendar audit.

So this seemed like the right place to start: high frequency, low risk, narrow enough to actually finish, and present in everyone's week.

## What the skill actually does

It takes a natural-language request like *"Schedule a 30-min 1:1 with Mitchell this week"* and walks through the parts that humans do badly: resolves the attendee from a name, reads both calendars, computes the intersection of free time inside working hours, scores candidate slots, picks one that respects the day-of-week shape of the user's existing meetings, and creates the event with a Zoom link attached.

The boring parts are where it earns its keep. Time-zone math is the single biggest source of scheduling errors, and the skill has a dedicated reference document for it because I kept getting it wrong by hand. Working-hours detection reads the user's actual calendar pattern instead of trusting a static 9-5 default. Attendee resolution handles the case where you say "Mitchell" and there are two of them in the org.

The piece I'm most happy with is the fallback ladder. Real scheduling rarely produces a clean answer. Two people don't have an hour together this week. Three of them do, but only at 7am Eastern. The skill doesn't just shrug and say "no slot found." It walks through four escalation paths in order: is there a similar meeting already on the calendar that the topic could fold into; is there a conflict on a candidate slot that looks safely reschedulable; should we extend the window by a few days; could the meeting compress to 25 minutes to fit. The user picks. That's where the skill starts to feel less like automation and more like a coordinator who's done this before.

## The thing I deliberately didn't do

I didn't package it as a plugin yet.

Cowork supports `.skill` files — single-file bundles you can drop into the Customize panel and share with a teammate. That's the obvious distribution path, and I'll get there. But I've watched myself rewrite this skill maybe a dozen times in two weeks, and almost every revision came from actually using it. The fallback ladder didn't exist in version one. The "anchor now before searching" rule landed the day I asked it to find time today and it cheerfully proposed 11am — three hours in the past. The urgency-detection logic showed up after I noticed it was picking mid-week slots when I'd said "ASAP."

Packaging too early would have frozen all of those mistakes in a distributable artifact. Iterating before packaging means the source of truth lives in one place — `.claude/skills/calendar-scheduling/` — until I've used it enough to know what's stable versus still drifting. The skill bundle is a publishing step, not a development environment.

## Production use

Two real users this week, only one of them me.

Quinton rebooked our 1:1 through it on Friday. The skill handled the time-zone gap (he's in PT, I'm in CT), found a slot that respected his back-to-back stretch on Monday afternoon, and dropped the invite on his calendar. Mitchell took a slot the same day as the test subject for a separate thread. Two people, two clean bookings, zero rework.

That sounds small. It's the first time I've shipped something from this system that someone other than me actually depends on, and the difference between "I built a thing" and "two people used it without asking how it worked" is the entire point.

## What fell down

The first version got time zones wrong in a way I'm still slightly embarrassed about. The Google Calendar API returns event times with the offset baked into the dateTime field, and I had the skill double-converting from the separate timeZone metadata field. Result: every slot was wrong by an hour, which is exactly the kind of bug that erodes trust the moment a user notices. I caught it in testing. The fix is a single line of code and a memory entry telling future-me to read the offset literally.

There's also a class of requests the skill explicitly doesn't handle. Scheduling on behalf of someone else (executive-assistant style) is out of scope. So is one-sided focus-time blocking. Both showed up in the persona work as real patterns, and both will probably need their own skill rather than getting bolted onto this one. Narrow tools that do one thing well beat sprawling ones that do many things adequately.

## What's next

Internally, this is teed up to be the first skill that goes organization-wide through the Second Brain pilot. There's another skill I've been iterating on that was the original first-deploy candidate; I have some reservations about its architecture I'm waiting on feedback before resolving. Calendar scheduling has now passed two real users without incident, which makes it the better precedent.

Next out of the persona analysis: the pre-meeting context pack — the one that fires 30 minutes before any multi-attendee meeting and pulls the most relevant prior interactions into a brief that sits inside the calendar event. That one's narrower than it sounds and will probably be the next post.

Curiosity compounds,

— Mike

---

*This post is part of the internal documentation series for the CodePath Second Brain pilot. Questions or reactions? Find me in #tools-talk.*
