# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

University JavaScript/ES exercise project (MINTAMBILLOS course). The repo provides travel destination data and image assets as a starting point for building a JS application.

## Data Structure

`TravelData.json` has three top-level arrays:

- `countries` — each entry has `id`, `name`, and `cities[]` (each city: `name`, `imageUrl`, `description`)
- `temples` — each entry has `id`, `name`, `imageUrl`, `description`
- `beaches` — each entry has `id`, `name`, `imageUrl`, `description`

The `imageUrl` values in the JSON are placeholder strings (e.g. `"enter_your_image_for_sydney.jpg"`). The actual image files in the repo root use title-case names like `Sydney.jpg`, `Angkor_Wat.jpg`, `Bora_Bora_Beach.jpg`, etc.
