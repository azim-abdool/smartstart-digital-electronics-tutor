# SmartStart Digital Electronics Tutor — integrated reconstruction v0.4

This folder is a GitHub Pages-ready static website.

## Included in this release

- Persistent responsive tutor menu and seven-module dashboard.
- Module 1: Digital Foundations.
- Module 2: Logic Fundamentals.
- Module 3: Boolean Design, partially restored with three activities:
  - Boolean Algebra and Duality;
  - Compound Truth Tables;
  - Minterms, Maxterms, SOP and POS.
- Module 5 decoder activity retained.
- Expanded glossary and browser-local progress for six available activities.

## Module 3 source preservation

The reconstructed activities retain the original tutor's Boolean notation, its compound example
`F=((X.Z).(X.Y)+(Z+X))`, its dual expression, truth-table workflow, minterm and maxterm progression,
canonical SOP/POS theorems, and combining theorem `X.Y + X.Y' = X`.

Karnaugh maps, logic hazards and the original "Petric Method" section remain queued for the next Boolean Design increment.

## Deploying over the current GitHub Pages version

Upload the contents of this folder to the root of the existing repository, preserving the folders. Replace the existing files and commit the changes. The WordPress iframe URL does not change.

## Important

Upload the **contents** of this folder, not the outer `smartstart-tutor-v0.4` folder itself. The repository root should contain `index.html`, `assets/`, `modules/`, `activities/`, and the other folders.
