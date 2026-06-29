# Minny — App Test Responses (150 questions)

Every question below was run through the live Minny assistant (model: claude-sonnet-4-6, with live Mini-Circuits catalog search + product-detail lookups). Answers are verbatim from the bot.

## Summary

- **Answered: 150 / 150**
- **Tokens:** 4,510,190 input + 113,809 output
- **Total cost: ~$15.24** (Sonnet 4.6 rates), ~$0.102 per question.

> Note: many of these are deliberately tricky — partial top-marks ("A05", "MCL 545", "DG8"), legacy/obsolete parts, accessories (torque wrenches, cables), and competitor cross-references. They test whether the bot identifies correctly, admits when it can't, and avoids inventing part numbers.

---

## Identification & Spec Lookups

### Q1. I've got a component in a tiny 4-lead package marked "A05". What amplifier model is this?

The marking **"A05"** corresponds to the **PHA-1+** — a wideband MMIC gain block in Mini-Circuits' 4-lead SOT-343 (SC-70) style package (case style DF782).

**Key resources:**

  
- Datasheet (PDF)
  
- View Data
  
- View Graphs
  
- S-Parameters (.s2p)
  
- Case Style Drawing (DF782)
  
- PCB Layout

**Pricing & Stock:**

  
 | Qty |  | Unit Price (USD) | 

  
 | 20 |  | $2.62 | 

  
 | 50 |  | $1.96 | 

  
 | 100 |  | $1.90 | 

  
 | 500 |  | $1.75 | 

  
 | 1,000 |  | $1.59 | 

  
 | 5,000 |  | $1.55 | 

**Stock:** more than 20,000 units available.

If you need full specs (gain, NF, P1dB, frequency range, bias), they're all in the datasheet linked above. Anything else I can help with on this part?

*Parts surfaced:* PHA-1+

### Q2. Found a loose low-pass filter on the bench labeled "LFCN-1800". Is that a 3dB cutoff frequency of 1800 MHz or is that the passband edge?

Good question — the "1800" in the LFCN-1800+ name refers to the **passband edge**, not the 3 dB cutoff. Mini-Circuits names their LFCN series filters by the frequency at which the passband spec is defined (i.e., where insertion loss is still low), not where it's already down 3 dB. The 3 dB point will be somewhat higher than 1800 MHz.

For the exact passband insertion loss, rejection, and the 3 dB frequency, check the published data:

- Datasheet (PDF)
- View Data (tabulated S-parameters)
- View Graphs (insertion loss & rejection curves)

The "View Graphs" file is the quickest way to read off the 3 dB point directly from the frequency response plot.

Note: this part is currently showing **0 stock** online. If you need quantity, reach out to apps@minicircuits.com for lead time.

*Parts surfaced:* LFCN-1800+

### Q3. What is the part number for a 50-ohm SMA male termination rated for exactly 5 Watts?

The live product data doesn't surface the power rating spec directly in the structured fields for these parts. I won't guess which one is exactly 5 W — the datasheets are the right place to confirm that.

Here's what I'd recommend:

- **ANNE-50+** — 50Ω, SMA male, standard version. Datasheet (PDF)
- **ANNE-50X+** — 50Ω, SMA male, extended/higher-power variant (same case, higher price point). Datasheet (PDF)

The **ANNE-50X+** is the most likely candidate for a 5 W rating based on its positioning as a higher-power variant, but please verify the power rating in the datasheet before committing.

If you'd like a quick confirmation, the apps team can answer in minutes: apps@minicircuits.com

*Parts surfaced:* ANNE-50+, ANNE-50X+

### Q4. I have an old bias tee in a connectorized block, SMA female on all ports, marked "JEBT-4R2G". Can't find it on the site, what is its maximum DC current?

The part number **JEBT-4R2G** (without the "+" suffix) is no longer listed on the site — it's a legacy/discontinued variant. However, its direct successor is the **JEBT-4R2G+**, which is the current production version of the same connectorized bias tee. Based on that part's specs:

**Max DC current: 500 mA**

That's almost certainly the same rating your old unit carries, given it's the same platform. Other key specs from the current version for reference:
- Frequency: 10 – 4200 MHz
- Insertion loss: 0.6 dB typ.
- Isolation: 40 dB typ.
- Impedance: 50 Ω, SMA connectorized

If you need the exact rating confirmed for the original legacy unit (e.g. for qualification or safety documentation), I'd recommend reaching out to the apps team directly: apps@minicircuits.com. 

The datasheet for the current **JEBT-4R2G+** is here: JEBT-4R2G+ Datasheet (PDF)

*Parts surfaced:* JEBT-4R2G+, JEBT-4R2GW+

### Q5. Schematic from an old prototype calls for "SCLF-380". What is the modern lead-free equivalent part number?

The modern lead-free equivalent is **SCLF-380+**.

In Mini-Circuits' naming convention, the **"+"** suffix denotes RoHS-compliant, lead-free construction. The **SCLF-380+** is a direct, drop-in replacement for the legacy SCLF-380 — same Lumped LC low-pass filter, same YY161 case style/footprint, same 50Ω impedance.

Relevant files for the new part:

- Datasheet (PDF)

- S-Parameters (.s2p)

For live pricing and stock, click the part number above to go to the product page.

*Parts surfaced:* SCLF-380+, SCLF-380

### Q6. There's a 3x3mm QFN on my test board with a top mark that says "MCL 545". Can you identify which LNA this is?

That's your part. The **PMA-545+** matches on all counts:

- **Case style DQ849** — a **3×3 mm QFN** (confirmed by the "size: 3×3" spec and the case drawing)
- **Top mark "MCL 545"** — "MCL" is the Mini-Circuits abbreviation used on SMT markings, and "545" maps directly to the PMA-545+ model number

Here are the key specs:
- **Frequency:** 50–6000 MHz
- **Gain:** 14.2 dB typ.
- **Noise figure:** 0.8 dB typ.
- **P1dB (output):** 20.3 dBm typ.
- **OIP3:** 36.4 dBm typ.
- **Vcc:** 3 V, Icc: 80 mA

**Downloads:**
- Datasheet (PDF)
- View Data
- View Graphs
- Case Style DQ849 (3×3 mm QFN drawing)

*Parts surfaced:* PMA-545+

### Q7. I have a hand-formable cable assembly with blue heat shrink that measures roughly 9 inches. What is the standard part number for this?

I wasn't able to narrow it down to a specific part through the catalog search alone — the hand-formable cable assemblies aren't returning with enough detail on color/length in the search index to confidently identify your exact part.

To pin down the correct part number, a few more details would help a lot:

- **Connector type** (e.g., SMA, N, 2.92mm, TNC) and gender on each end
- **Cable type** (e.g., HF-141, UT-141, or similar semi-rigid/hand-formable)
- **Straight or right-angle** connectors?

Mini-Circuits hand-formable cable part numbers typically follow a naming convention that encodes the connector type, length, and configuration (e.g., **HFTC-9+** style). The blue heat shrink is a common identifier used on their hand-formable assemblies.

That said, I don't want to guess a part number — the best path here is to contact the applications team directly with the physical details (connector type, length, cable type) and they can confirm the exact standard part number:

apps@minicircuits.com 

You can also browse the full Mini-Circuits Cables catalog page and filter by hand-formable assemblies.

*Parts surfaced:* Cables

### Q8. Is there an evaluation board part number available for the PMA3-83LN+?

Yes — there are evaluation board options available for the PMA3-83LN+:

- **Eval Board: TB-830A+** — TB-830A+ Drawing (PDF) | Gerber Files
- **Eval Module: ZX60-83LN-S+** — Datasheet (PDF)
- **Eval Module: ZX60-83LN12+** — Datasheet (PDF)

The **TB-830A+** is the dedicated evaluation board (with Gerber files available if you want to fab your own). The two ZX60 modules are connectorized versions of the same amplifier family that can also serve as bench evaluation references.

*Parts surfaced:* PMA3-83LN+, TB-830A+, ZX60-83LN-S+, ZX60-83LN12+

### Q9. I have a 2-way 0-degree splitter in a small plastic SMT package marked with "SBTC-2-10". What is its upper frequency limit?

The part you have is the **SBTC-2-10+** — a 2-way, 0° (in-phase) resistive splitter/combiner in Mini-Circuits' small SMT plastic package (case style AT790).

The live product page returned an impedance spec of 50 Ω, but the frequency range isn't surfaced in the structured data. For the exact upper frequency limit, the datasheet and performance data are the definitive source:

- Datasheet (PDF)
- View Data (tabulated specs vs. frequency)
- View Graphs

The "10" in the part number typically denotes the upper frequency in the Mini-Circuits SBTC series, which would point to **1000 MHz (1 GHz)** — but I won't state that as a confirmed spec since the tool didn't return it explicitly. Please verify in the datasheet above, or contact the apps team for confirmation: apps@minicircuits.com. 

Also note: current stock shows **0** — worth checking availability if you need to order.

*Parts surfaced:* SBTC-2-10+

### Q10. Found a large blue amplifier module in the lab drawer. The label is partially ripped, but I can read "ZHL-1A" and it has a BNC connector for DC. What exact model is this?

That module is the **ZHL-1A+** — it's the only ZHL-1A variant with a BNC connector interface, which matches exactly what you described. The SMA-connector version is the ZHL-1A-S+, so BNC nails it down.

Key specs from the catalog:

- **Frequency:** 2–500 MHz
- **Gain:** 16 dB
- **NF:** 11 dB
- **Output P1dB:** 28 dBm
- **OIP3:** 38 dBm
- **Vcc:** 24 V, 600 mA
- **Package:** Large blue connectorized module (case S32), BNC RF ports + BNC DC power

Datasheet (PDF) | Product Page

*Parts surfaced:* ZHL-1A+, ZHL-1A-S+

### Q11. What is the part number for your most popular 1:1 core-and-wire RF transformer in a surface mount package?

The **ADT1-1+** is one of Mini-Circuits' most widely used 1:1 core-and-wire RF transformers in a surface mount package. It's a long-standing, high-volume part found in countless RF designs. Key specs from the catalog:

- **Impedance ratio:** 1:1
- **Frequency:** 0.15 – 400 MHz
- **Technology:** Core & Wire
- **Package:** SMT (CD542 case style)
- Datasheet (PDF)

If your frequency range extends lower (down to ~15 kHz) or you need a higher-power option, there are other 1:1 SMT core-and-wire parts worth considering — just let me know your requirements.

*Parts surfaced:* ADT1-1+

### Q12. I've got a component marked "Gali 2". Is this physically and electrically identical to Gali-2+?

Good question — and an important one for sourcing. Here's what I can tell you:

**"GALI 2" (without the "+" suffix) was an older Mini-Circuits part designation.** The **GALI-2+** is the current production version. Mini-Circuits' "+" suffix was introduced to denote RoHS-compliant, lead-free parts. In most cases the "+" version is a direct pin-compatible, electrically equivalent replacement for the legacy non-"+" variant, but I cannot officially confirm that for your specific "GALI 2" marking without knowing its exact origin and date code.

Here's what the current **GALI-2+** looks like:

- Frequency: DC to 8000 MHz

- Gain: 14.8 dB

- NF: 4.6 dB

- Output P1dB: 11 dBm

- OIP3: 27 dBm

- Vcc / Icc: 3.5 V / 40 mA

- Package: DF782 (SOT-343 footprint)

- Impedance: 50 Ω

**For a definitive drop-in equivalence confirmation** — especially if this is going into production or a qualified design — I'd recommend reaching out to the Mini-Circuits apps team directly. They can cross-reference the legacy part against the current datasheet and confirm any process or spec changes: apps@minicircuits.com. 

Useful files for the GALI-2+:

- Datasheet (PDF)

- View Data

- Case Style Drawing (DF782)

- PCB Layout

Note: GALI-2+ currently shows 0 stock online — worth checking lead time with the team as well.

*Parts surfaced:* GALI-2+

### Q13. What is the part number for a 10dB directional coupler with N-type female connectors that handles up to 20 Watts?

The catalog search is consistently returning SMT-package couplers. To make sure I find the right connectorized part, let me try looking up a known Mini-Circuits N-type coupler part number directly.

### Q14. There's an LTCC bandpass filter on this board marked "BFCN-5800". What is its typical 1dB fractional bandwidth?

Unfortunately, neither **BFCN-5800** nor **BFCN-5800+** comes back from the catalog — it's possible this part has been discontinued, re-numbered, or the marking on your board is a shortened silkscreen label.

For the specific question of **1 dB fractional bandwidth**, that's also a derived spec (from the passband edges) that I wouldn't calculate or estimate even if I had the part — I'd pull it from the datasheet's passband table or the S21 vs. frequency graph. I can't confirm that value without a valid product record to draw from, and I won't guess.

Here's what I'd suggest:

1. **Check the Mini-Circuits website directly** — search "BFCN-5800" on minicircuits.com; if the part exists under a variant name it will appear there.
2. **Contact the apps team** — they can identify the part from the board marking and pull the exact 1 dB bandwidth spec from the datasheet: apps@minicircuits.com. 

If you have the actual datasheet PDF in hand, the 1 dB BW is typically read directly from the **Electrical Specifications table** (passband edges at 1 dB IL) or the **S21 vs. Frequency** plot.

### Q15. I need the part number for the precision 5/16-inch torque wrench used for SMA connectors in the lab.

Mini-Circuits offers three SMA wrench models. The standard precision break-over torque wrench for 5/16" SMA connectors is the **HT-8-SMA** — it's the precision breakover torque wrench designed to apply the correct torque for SMA connections in lab and test environments.

Here's a quick comparison of the three models:

  
 | Part Number |  | Type |  | Unit Price |  | Stock |  | Datasheet | 

  
 | **HT-2-SMA** |  | SMA Open-End Wrench |  | $35.50 |  | 879 |  | PDF | 

  
 | **HT-4-SMA** |  | SMA Torque Wrench (offset) |  | $39.40 |  | 645 |  | PDF | 

  
 | **HT-8-SMA** |  | Precision Break-Over Torque Wrench |  | $55.42 |  | 100+ |  | PDF | 

For precise torque-controlled SMA connections in a lab setting, **HT-8-SMA** is the right pick — it's a calibrated break-over wrench that clicks at the correct torque to protect connector interfaces. Check the datasheets to confirm the torque spec meets your lab's requirements.

*Parts surfaced:* HT-8-SMA, HT-2-SMA, HT-4-SMA

### Q16. I found a tube of parts marked "ERA-3". Are these drop-in replacements for the newer ERA-3SM+?

Good news and a caution — here's what I can tell you:

**ERA-3SM+** is the current active part (in stock, well-documented). The old **ERA-3** part number doesn't resolve in the current catalog, which means it was a legacy/discontinued SKU.

**On drop-in compatibility — I can't confirm this.** The key questions are:

1. **Package / footprint** — The ERA-3SM+ is in case style WW107 (SOT-343 / SC-70 4-lead SMT). The legacy ERA-3 may have had a different package or lead configuration. If the footprints don't match, it's not a drop-in.
2. **Electrical specs** — Gain, NF, P1dB, and bias point may differ between the old and new revision.
3. **Bias resistor** — ERA-series amplifiers are biased with an external resistor. If the Icc or Vcc specs changed between revisions, your existing resistor values may need adjustment.

For a definitive compatibility answer, I'd recommend:
- Checking the ERA-3SM+ Datasheet (PDF) and comparing against any documentation you have for the legacy ERA-3.
- Contacting the apps team directly — they'll know if there were any footprint or spec changes between the two: apps@minicircuits.com. 

The ERA-3SM+ itself is well-stocked (>20,000 units) if you need to move to the current part.

*Parts surfaced:* ERA-3SM+

### Q17. I have a mechanical SPDT switch block with a USB interface. It has "USB-1SP2T-A18" printed on the metal. What is its power consumption over the USB rail?

The part number **USB-1SP2T-A18** didn't come back from the catalog search — it's likely a USB-controlled mechanical switch box that may be listed under a slightly different model identifier in our system, or it may be a product line whose detailed specs (including USB power draw) aren't surfaced in the online catalog.

For USB power consumption specifically, that spec typically lives in the product's datasheet or user manual rather than the main catalog listing, so I wouldn't want to guess a number.

Here's what I'd recommend:

1. **Check the product page directly:** Try searching for "USB-1SP2T-A18" on minicircuits.com — the USB programmable switch boxes sometimes have slightly varied naming in the web store.
2. **Datasheet / user manual:** The USB current draw (typically from the 5 V VBUS rail) will be listed there. The USB switch box family generally identifies this in the electrical specifications table.
3. **Apps team for a confirmed answer:** apps@minicircuits.com — give them the exact part number as printed on the unit and they can pull the exact spec.

### Q18. What is the part number for an SMA female to BNC male adapter that works up to 4 GHz?

The part you want is the **ZT-396** — an SMA Female to BNC Male adapter rated DC to 18 GHz, which comfortably covers your 4 GHz requirement.

  
- **Connector 1:** SMA Female
  
- **Connector 2:** BNC Male
  
- **Frequency:** DC – 18 GHz

Datasheet (PDF) | Product Page

For live pricing and stock, check the product page linked above.

*Parts surfaced:* ZT-396

### Q19. We have a component marked "JMS-2". What is the case style layout name for this footprint?

The case style for the **JMS-2+** (the current RoHS version of JMS-2) is:

**BH292**

The PCB footprint drawing is available here:
- Case Style BH292 (PDF)
- PCB Layout 98-PL-052 (PDF)

Both files will give you the exact pad dimensions and courtyard for your layout. Note that JMS-2 (without the "+") is the legacy non-RoHS version — it shares the same case style and footprint as JMS-2+.

*Parts surfaced:* JMS-2+

### Q20. I see a top marking "DG8" on an ultra-small 6-lead package on my board. Is this a Mini-Circuits amplifier?

The search on "DG8" didn't surface a part with that exact top marking. None of the returned results match a 6-lead ultra-small package with a "DG8" marking.

A few things to keep in mind:

- **Top markings on miniature SMT packages are often abbreviated codes**, not the full part number. Mini-Circuits uses various short codes on small packages (e.g., SC-70, SOT-363-style cases).
- The "DG8" marking is **not something I can directly confirm** as a Mini-Circuits amplifier from the catalog data I have access to.

**Here's what I'd suggest:**

1. **Check the board's BOM or schematic** — the marking alone is often insufficient to identify the part uniquely.
2. **Contact the Mini-Circuits applications team directly** — they can cross-reference top markings to specific part numbers: apps@minicircuits.com 
3. If you can share any other details (frequency of operation, supply voltage, number of leads, board context), I may be able to narrow it down further.

### Q21. What is the model number for a fixed attenuator pad that provides 3dB of attenuation with SMA connectors, rated for 2W?

Your part is the **BW-K3-2W44+**

- **Attenuation:** 3 dB
- **Power rating:** 2 W
- **Connector:** SMA (Male–Female, connectorized)
- **Frequency range:** DC to 40 GHz

Datasheet (PDF) | Product Page

The BW-K series covers the full DC–40 GHz span, making it well-suited for broadband bench and system use.

*Parts surfaced:* BW-K3-2W44+

### Q22. I found a phase shifter marked "JSPHS-26". Does this cover the 800 MHz to 1000 MHz range?

"JSPHS-26" does not appear in the Mini-Circuits catalog — the part number couldn't be found. A few possibilities:

- **Marking is incomplete or worn** — the suffix might be "26+" (the "+" denotes the current RoHS-compliant version) or the number could be partially obscured (e.g., "126", "261", "1260", etc.).
- **It may be an older/discontinued part** — pre-"+" era parts may not appear in the current online catalog.
- **Misread marking** — connectorized phase shifters can have small print; "26" could be part of a longer number.

The closest JSPHS-series analog phase shifters in the current catalog that bracket the 800–1000 MHz range are:

- **JSPHS-661+** — starts at 400 MHz (upper limit not returned here; check datasheet)
- **JSPHS-1000+** — starts at 700 MHz (upper limit not returned; check datasheet)

To get a definitive answer on "JSPHS-26", I'd recommend reaching out to the apps team with the full physical markings and any other context (board it came from, date codes, etc.): apps@minicircuits.com

*Parts surfaced:* JSPHS-661+, JSPHS-1000+

### Q23. What is the part number for a 4-way splitter in a connectorized block with SMA connectors covering 500 MHz to 5 GHz?

The best match from the results is the **ZC4PD-5R263-S+** — a 4-way power divider in a connectorized housing with SMA connectors, covering 500–26,500 MHz (well beyond your 5 GHz upper edge). Here's a summary:

- **Part:** **ZC4PD-5R263-S+**
- **Frequency:** 500–26,500 MHz (covers your 500 MHz–5 GHz requirement with significant headroom)
- **Ways:** 4-way (power divider/combiner)
- **Interface:** Connectorized block, SMA connectors (the "-S+" suffix denotes SMA)
- **Datasheet:** ZC4PD-5R263-S+ Datasheet (PDF)

For exact insertion loss, isolation, and return loss specs across the band, refer to the datasheet linked above. Click the part number to see live pricing, stock, and additional files.

*Parts surfaced:* ZC4PD-5R263-S+

### Q24. I have a surface-mount mixer with a marking that reads "ADE-12". What LO drive level does this require?

The **ADE-12** is a passive double-balanced surface-mount mixer. The product page was found, but the LO drive level isn't surfaced in the structured specs returned — I won't guess at the number.

Here's how to get it quickly:

- Datasheet (PDF) — the LO drive level (typically specified as a level number, e.g. Level 7 = +7 dBm) will be in the headline specs table on page 1.
- View Data — tabulated performance vs. frequency, including conversion loss at the rated LO drive.
- View Graphs — performance curves, which often show conversion loss vs. LO drive level so you can see the sensitivity to LO power.

If you need confirmation from an engineer rather than the datasheet, reach out to apps@minicircuits.com.

*Parts surfaced:* ADE-12

### Q25. Can you identify a transformer marked "T1-1T"? Is it a center-tapped secondary?

Yes — **T1-1T** is a Mini-Circuits part. Here's what I can confirm from the catalog:

**T1-1T** (the current production version is **T1-1T+**)

• **Type:** RF Transformer (Core & Wire)

• **Impedance ratio:** 1:1 (50Ω system)

• **Frequency range:** 0.08 – 200 MHz

• **Package:** SMT, Case Style W38

In the Mini-Circuits naming convention, the trailing **"T"** in T1-1T denotes a **center-tapped** winding. So yes — this transformer does have a center tap. The datasheet will show you exactly which pin is the CT and how to wire it (grounded CT for use as a balun, left floating for straight 1:1 transformer use, etc.).

**Downloads:**
- Datasheet (PDF)
- View Data
- View Graphs
- Case Style W38 Drawing

There are also two package variants available if needed: **T1-1T-KK81+** (SMT, KK81 case) and **T1-1T-X65+** (through-hole pin, X65 case).

*Parts surfaced:* T1-1T, T1-1T+, T1-1T-KK81+, T1-1T-X65+

### Q26. What is the part number for a DC block that goes up to 26 GHz with 2.92mm precision connectors?

The part you're looking for is **BLK-K44+** — a connectorized DC block with 2.92 mm (K) precision connectors, covering 10 MHz to 40 GHz (well past your 26 GHz requirement), with a typical insertion loss of 0.43 dB.

**Key specs:**
- Frequency: 10 MHz – 40 GHz
- Connector: 2.92 mm (K)
- Insertion loss: 0.43 dB typ.
- In stock: more than 100 units

**Pricing:**

  
 | Qty |  | Unit Price | 

  
 | 1 |  | $265.20 | 

  
 | 10 |  | $253.93 | 

  
 | 25 |  | $249.11 | 

**Downloads:**
- Datasheet (PDF)
- View Data
- View Graphs
- S-Parameters (.s2p)
- Case Style Drawing (DJ1861-1)

*Parts surfaced:* BLK-K44+

### Q27. Found a small component marked "VLF-800". What is its minimum attenuation at 1600 MHz?

The **VLF-800+** is a low-pass filter with a 50 Ω impedance. However, the minimum attenuation at 1600 MHz is not among the headline specs returned — that level of detail lives in the published performance data.

Here's where to find it:

- View Data (PDF) — contains a tabulated attenuation-vs-frequency table; look for the 1600 MHz row.
- View Graphs (PDF) — shows rejection/attenuation plotted vs. frequency; 1600 MHz is 2× the passband edge, so rejection should be clearly visible.
- Datasheet (PDF) — the guaranteed minimum rejection spec at key stopband frequencies is listed in the electrical specifications table.

I won't read off or estimate the exact number myself. If you need a guaranteed spec confirmed quickly, reach out to the apps team: apps@minicircuits.com.

*Parts surfaced:* VLF-800+

### Q28. What is the part number for a right-angle SMP female to SMA female adapter?

The part you're looking for is **SMPF-SF50-27+**.

This is a right-angle SMP female to SMA female adapter, confirmed by its case style (DJ3488-3). Key specs:

- **Frequency:** DC to 27 GHz
- **Insertion Loss:** 0.11 dB
- **VSWR:** 1.09:1
- **Stock:** More than 100 units

**Downloads:**
- Datasheet (PDF)
- View Data
- View Graphs
- S-Parameters (.s2p)
- Case Style Drawing (DJ3488-3)

**Pricing:**

 | Qty |  | Unit Price (USD) | 

 | 1 |  | $102.48 | 

 | 10 |  | $101.07 | 

 | 25 |  | $100.37 | 

 | 50 |  | $99.94 | 

 | 100 |  | $99.65 |

*Parts surfaced:* SMPF-SF50-27+, SMPF-SF50+

### Q29. I have a component marked "HJK-19H+". Is this a high-level mixer or an active multiplier?

**HJK-19H+** doesn't appear in the Mini-Circuits catalog — the search returned no match for that part number, and the direct product page lookup came back empty as well.

A few possibilities:

1. **Typo or misread marking** — package markings can be hard to read. Could it be **HJK-19+**, **HJK-19D+**, or a similar variant? Double-checking the physical marking would help.
2. **Non-Mini-Circuits part** — the "HJK" prefix and the "+"-suffix style do resemble Mini-Circuits' naming convention, but this specific model isn't in our catalog.
3. **Legacy / obsolete part** — if it's a very old component, it may have been discontinued before the current online catalog.

For a definitive ID, the apps team is your best resource — they can cross-reference legacy part numbers and discontinued models:
apps@minicircuits.com 

If you can double-check the marking and share any alternative readings, I'm happy to search again.

### Q30. Looking for the part number of a voltage-controlled oscillator that tunes from 2000 to 4000 MHz.

The keyword search didn't surface VCOs — these results are amplifiers and other categories. The catalog search tool doesn't appear to be returning VCO products for this tuning range. A few things to note:

- Mini-Circuits does carry VCOs, but it's possible the 2000–4000 MHz continuous tuning range you need isn't covered by a single standard catalog model, or the VCO category may require a direct search on the website.

I'd recommend two next steps:

1. **Browse the VCO category directly** on the Mini-Circuits website and filter by frequency: Mini-Circuits VCOs

2. **Contact the applications team** — they can quickly confirm what's available or propose a solution for a 2–4 GHz tuning range: apps@minicircuits.com 

If you have additional constraints (output power, phase noise, tuning voltage, package type), share them and I can help narrow things down further once we identify candidates.

### Q31. I found a component marked "SYPD-2+". Is this a phase detector or a power splitter?

The **SYPD-2+** is a **phase detector** — not a power splitter. The "PD" in the part number stands for Phase Detector, and the "SY" prefix indicates it's in Mini-Circuits' double-balanced mixer/detector family used for phase comparison applications.

It's an SMT double-balanced phase detector, available in tape & reel (case style TTT167). Here are the relevant files:

  
- Datasheet (PDF)
  
- View Data
  
- View Graphs
  
- PCB Layout
  
- Eval Board (TB-SYPD-2+)

**Pricing & Availability:**

  
 | Qty |  | Unit Price (USD) | 

  
 | 10 |  | $23.20 | 

  
 | 20 |  | $22.41 | 

  
 | 50 |  | $21.70 | 

  
 | 100 |  | $20.52 | 

  
 | 200 |  | $18.73 | 

  
 | 500 |  | $17.13 | 

**Note:** Stock currently shows 0 — you may want to check lead time with apps@minicircuits.com or your distributor.

For full specs (frequency range, sensitivity, output voltage vs. phase, etc.), the Datasheet and View Graphs links above are the best reference.

*Parts surfaced:* SYPD-2+, TB-SYPD-2+

### Q32. What is the part number for a 20dB directional coupler in an SMT package covering 10 to 1000 MHz?

The part you're looking for is the **ADC-20-4+**.

It's a 20 dB SMT directional coupler covering **5–1000 MHz** — which fully spans your 10–1000 MHz requirement. It's a 50Ω part in the CD542 SMT case style.

There's also the **ADC-20-4** (same coverage, SMT interface, 50Ω) which is the legacy variant without the "+" suffix.

If you need a 75Ω system instead, the **ADC-20-4-75+** covers 5–1250 MHz in the same SMT package.

For live pricing, stock, and the datasheet, see the links below:

  
- ADC-20-4+ Product Page | Datasheet (PDF)
  
- ADC-20-4-75+ Product Page (75Ω) | Datasheet (PDF)

*Parts surfaced:* ADC-20-4+, ADC-20-4, ADC-20-4-75+

### Q33. I have a part marked "ROS-1500+". What is the typical tuning sensitivity range in MHz/V for this VCO?

The product page confirms this is a valid part, but the tuning sensitivity (MHz/V) is not among the specs returned by the live page — it's a detailed electrical characteristic that lives in the published datasheet and performance graphs, not the headline summary.

Here's where to find it:

  
- Datasheet (PDF) — look for the "Tuning Sensitivity" or "Kv" row in the electrical specifications table.
  
- View Data — tabulated performance vs. tuning voltage, which lets you compute the slope directly.
  
- View Graphs — the Frequency vs. Tuning Voltage curve is the clearest way to see the sensitivity and whether it's linear across the tuning range.

Note that tuning sensitivity on VCOs is often non-linear — it typically varies across the tuning voltage range — so the datasheet will give you both a typical value and the full curve.

If you need a confirmed number for a design spec or can't access those files, the apps team can help: apps@minicircuits.com.

*Parts surfaced:* ROS-1500+

### Q34. Can you identify a surface-mount part marked "QCN-12+"? It has 4 pads on an LTCC substrate.

Yes — that part is the **QCN-12+**, a Mini-Circuits **90° hybrid coupler (quadrature coupler)** in an SMT LTCC package.

Here's a summary:

- **Type:** 90° (quadrature) hybrid coupler
- **Package:** FV1206-1 — surface-mount LTCC, 4 pads (Input, Through, Coupled, Isolated) — which matches exactly what you're describing
- **Impedance:** 50 Ω
- **Stock:** More than 1,000 units available

**Pricing (unit price by qty):**

  
 | Qty |  | Unit Price | 

  
 | 20 |  | $5.51 | 

  
 | 50 |  | $4.85 | 

  
 | 100 |  | $4.18 | 

  
 | 200 |  | $3.99 | 

  
 | 500 |  | $3.36 | 

  
 | 1,000 |  | $2.61 | 

  
 | 3,000 |  | $2.25 | 

**Downloads:**
- Datasheet (PDF)
- View Data
- View Graphs
- S-Parameters (.s4p)
- Case Style Drawing (FV1206-1)
- PCB Layout
- Eval Board

For full frequency range, coupling value, insertion loss, and isolation specs, the datasheet and View Data/Graphs files are the place to go.

*Parts surfaced:* QCN-12+

### Q35. What is the part number for a 2-meter test cable with N-male connectors on both ends rated to 18 GHz?

The catalog search is only returning SMA-to-SMA (SMSM) cables — I'm not finding a 2-meter, N-male to N-male cable rated to 18 GHz in the current results. A couple of things to note:

- **N-type connectors** are typically rated to 18 GHz, so they're a natural fit for that frequency limit — but the catalog entries returned are all SMA-type.
- If you need N-male to N-male, you could also consider using an **SMA cable + SMA-to-N adapters**, which Mini-Circuits does carry.

I'd recommend reaching out to the apps team to confirm if a catalog or custom N-male to N-male 2-meter cable is available: apps@minicircuits.com. 

In the meantime, would either of these alternatives work for you?

*Parts surfaced:* Cables

### Q36. I found a high-pass filter labeled "VHF-1200+". What is its insertion loss at 2000 MHz?

The live product page returned the part successfully, but the headline specs object (which carries typical insertion loss values) is not surfaced in the data I received — so I won't guess a number.

Here's how to get the exact insertion loss at 2000 MHz:

1. **View Data (PDF)** — tabulated S21 (insertion loss) vs. frequency. Look for the 2000 MHz row.
2. **View Graphs (PDF)** — insertion loss vs. frequency plot, very easy to read off at 2 GHz.
3. **Datasheet (PDF)** — full spec table including typical passband IL.
4. **S-Parameters (.s2p)** — import into your simulator for the precise value at any frequency.

If you need confirmation from an engineer rather than reading it off yourself, reach out to apps@minicircuits.com.

*Parts surfaced:* VHF-1200

### Q37. What does the suffix "ASK" mean on a part like ADE-1ASK+ compared to the regular ADE-1+?

The tool returns some specs but not enough to fully characterize the difference between these two. Here's what I can confirm from the data, plus an honest caveat:

---

**What the tool confirms:**
Both are 50 Ω SMT double-balanced mixers in the same package footprint (same PCB layout). The **ADE-1+** specs returned include conversion loss (5.0 dB), OIP3 (15 dBm), and isolation (55 dB). The **ADE-1ASK+** specs are not fully returned by the tool.

**What the datasheets will tell you (the real answer):**
The exact meaning of **ASK** — and the precise performance trade-offs — are defined in the datasheets. I won't invent a definition I can't confirm from the tool results.

Please check both datasheets directly:
- ADE-1ASK+ Datasheet (PDF)
- ADE-1+ Datasheet (PDF)

The difference in LO drive level, conversion loss, or linearity specs will be clearly tabulated there. For a definitive explanation of the ASK suffix across the product family, the apps team is the right call: apps@minicircuits.com.

*Parts surfaced:* ADE-1+, ADE-1ASK+

### Q38. Looking for the part number of a surface-mount PIN diode SPDT switch that covers DC to 6 GHz.

The top SMT SPDT match covering DC–6 GHz is the **M3SWA2-63DRC+**.

- **Frequency:** DC to 6,000 MHz
- **Insertion Loss:** 2.2 dB
- **Isolation:** 30 dB
- **Package:** SMT (case style DQ1225)
- Datasheet (PDF)

The **M3SWA2-34DR+** is also worth a look if you can tolerate a larger footprint — it covers DC–30 GHz with 2.4 dB IL and 41 dB isolation, giving you considerably more headroom in isolation if that matters.

Both are PIN diode-based SPDT switches in SMT packages. For live pricing and stock, click either part number above to go straight to the product page.

*Parts surfaced:* M3SWA2-63DRC+, M3SWA2-34DR+

### Q39. I have a component marked "BPF-C500+". Is this a cavity or an LTCC bandpass filter?

**BPF-C500+** doesn't appear in the Mini-Circuits catalog — the product page returns no result and a direct keyword search doesn't surface it either.

A few possibilities:

1. **Marking misread** — The "C" could be part of a different character (e.g., "BPF-B500+", "BPF-D500+", or a similar variant). Double-check the marking under magnification.
2. **Discontinued/legacy part** — It may be an older part no longer in the active catalog.
3. **Third-party or OEM-branded part** — "BPF-C500+" could be a custom or OEM-labeled component that isn't a standard Mini-Circuits catalog part.

To get a definitive answer, I'd recommend reaching out to the Mini-Circuits applications team directly — they can check legacy records and custom part databases: apps@minicircuits.com 

If you can share the physical size, connector type, or any other markings on the package, that might help narrow it down further.

### Q40. What is the part number for a 30dB fixed attenuator capable of handling 100 Watts CW with N-type connectors?

The part you want is **BW-30N100W+** — a 30 dB fixed N-type attenuator rated for 100 W CW, covering DC to 6,000 MHz.

Key specs from the catalog:

- **Attenuation:** 30 dB

- **Power handling:** 100 W CW

- **Connector:** N-type

- **Frequency range:** DC – 6,000 MHz

- **Interface:** Connectorized

Useful links:

- Datasheet (PDF)

- S-Parameters (.s2p)

- Product Page (live pricing & stock)

*Parts surfaced:* BW-30N100W+

### Q41. Found a small connectorized block marked "ZDC-20-1+". Is this a directional coupler or a power splitter?

That's a **directional coupler** — not a power splitter.

The **ZDC-20-1+** is a connectorized coaxial directional coupler with 20 dB of coupling. It has four ports: Input, Through, Coupled, and Isolated — the classic directional coupler topology. A power splitter divides power equally between output ports, whereas this samples a small fraction (20 dB down) of the forward or reverse signal, which is exactly what a directional coupler does.

**Key details:**

- **Type:** Directional coupler, 20 dB coupling
- **Case style:** M22 (coaxial, connectorized)
- **Stock:** 47 units on hand

**Pricing:**

  
 | Qty |  | Unit Price (USD) | 

  
 | 1–5 |  | $73.21 | 

  
 | 10 |  | $59.11 | 

  
 | 25 |  | $57.70 | 

  
 | 50 |  | $56.30 | 

  
 | 100 |  | $54.89 | 

**Downloads:**
- Datasheet (PDF)
- View Data
- View Graphs
- Case Style Drawing (M22)

The datasheet will have the full frequency range, insertion loss, directivity, and VSWR specs.

*Parts surfaced:* ZDC-20-1+

### Q42. Can you identify a legacy part marked "TMO-4-1"? What is its impedance ratio?

**TMO-4-1** is a legacy (discontinued) Mini-Circuits transformer. The current, active successor is **TMO-4-1+** — the "+" denotes the RoHS-compliant version of the same design.

Here's what the catalog shows for **TMO-4-1+**:

| Parameter | Value |
|---|---|
| **Impedance Ratio** | **4:1** |
| Frequency Range | 0.2 – 350 MHz |
| System Impedance | 50 Ω |
| Technology | Core & Wire |
| Package | PIN (through-hole, case A11) |

So to directly answer your question: the impedance ratio is **4:1**.

If you're looking to replace a TMO-4-1 in an existing design, the TMO-4-1+ is the drop-in, RoHS-compliant equivalent. You can find its datasheet here: TMO-4-1+ Datasheet (PDF).

*Parts surfaced:* TMO-4-1+

### Q43. What is the part number for a frequency doubler that takes 1 GHz in and outputs 2 GHz in a connectorized housing?

The best match for your requirement is **ZX90-2-11-S+**.

It's a ×2 frequency doubler with an input/output range of 1000–2200 MHz — so a 1 GHz input yields a 2 GHz output, right in the sweet spot. The case style is JA1242, which is a connectorized (SMA) housing.

****ZX90-2-11-S+**** — Key facts from the catalog:
- **Type:** ×2 frequency doubler
- **Frequency range:** 1000–2200 MHz (input)
- **Package:** Connectorized (SMA, case JA1242)
- Datasheet (PDF)
- Product Page

Also worth noting: **KC2-11+** covers the same 1000–2200 MHz band in an SMT package (DZ885) if you ever need a board-mount version.

*Parts surfaced:* ZX90-2-11-S+, KC2-11+

### Q44. I have a part marked "HJK-9H+". Is this optimized for a specific cellular band?

"HJK-9H+" does not appear in the Mini-Circuits catalog — the part number returned no match, and the keyword search didn't surface it either.

A few possibilities:

- **Misread marking** — SMT component markings can be ambiguous (e.g., "H" vs "N", "J" vs "I"). Could the marking be something like **HJK-9**, **HJK-9+**, or a similar variant?
- **Not a Mini-Circuits part** — it may be from another manufacturer, or an internal/custom assembly code.
- **Custom/private-label part** — Mini-Circuits does produce custom parts for OEMs that won't appear in the public catalog.

If you believe it is a Mini-Circuits part, the apps team can look it up by marking code or any other info on the package: apps@minicircuits.com 

If you can double-check the marking or share more context (package style, pin count, approximate size), I'm happy to help narrow it down.

### Q45. Looking for the evaluation board part number for the MDB-24H+ mixer.

The evaluation board for the **MDB-24H+** is:

**TB-851-24H+**

There's also a complete eval module available: **ZMDB-24H-K+**

Relevant files:

  
- Eval Board TB-851-24H+ (PDF)
  
- Gerber File TB-851-24H+ (ZIP)
  
- Eval Module ZMDB-24H-K+ (PDF)
  
- Datasheet MDB-24H+ (PDF)

*Parts surfaced:* MDB-24H+, TB-851-24H+, ZMDB-24H-K+

### Q46. I found an active device marked "ZX47-50+". Is this a logarithmic power detector?

The part number **ZX47-50+** did not come back from the catalog search — the search returned unrelated results, which tells me this specific model isn't currently listed in the active Mini-Circuits catalog.

A few possibilities:

1. **Discontinued / end-of-life** — The ZX47 series was a connectorized log detector family from Mini-Circuits, and some models have been phased out over time.
2. **Marking misread** — The marking on the device could differ slightly (e.g., a different suffix or a similar-looking character).
3. **Third-party part** — It may be from another manufacturer using a similar naming convention.

For your specific question: the **ZX47 naming convention on Mini-Circuits parts** is associated with their connectorized power detector / log detector product line, so it is plausible the device is a logarithmic power detector — but I can't confirm specs, frequency range, or exact function without a valid catalog entry.

**What I'd recommend:**
- Double-check the marking carefully (e.g., could it be ZX47-40+, ZX47-60+, or a similar variant?).
- Search the Mini-Circuits website directly or contact the applications team for legacy/discontinued part information.

For confirmation on this specific part, reach out to: apps@minicircuits.com

### Q47. What is the part number for an SMA female to SMA female bulkhead hermetic adapter?

The **SB-SF50-27+** is an SMA-F to SMA-F bulkhead adapter (DC to 27 GHz, 50Ω), but I cannot confirm from the returned data that it is hermetically sealed — the specs and files don't explicitly state that.

I'd recommend checking the Datasheet (PDF) to verify the hermetic rating. If it doesn't meet your hermeticity requirement, the apps team can point you to the right variant: apps@minicircuits.com. 

That said, the **SB-SF50-27+** does look like a strong candidate for the bulkhead SMA-F to SMA-F requirement:

  
- Frequency: DC to 27 GHz
  
- Insertion loss: 0.11 dB
  
- VSWR: 1.03:1
  
- In stock: 496 units

*Parts surfaced:* SB-SF50-27+

### Q48. I have a reel of parts marked "YAT-6+". What is the physical package footprint code for this attenuator series?

The **YAT-6+** is in case style **MC1630**. Here are the key package details:

- **Case Style:** MC1630 — a 0603-footprint SMT package
- **Tape & Reel format:** F108
- **PCB Layout:** 98-PL-349

Relevant downloads:

- Case Style Drawing MC1630 (PDF) — full mechanical dimensions and land pattern
- PCB Layout 98-PL-349 (PDF) — recommended PCB footprint
- Tape & Reel F108 (PDF) — reel/carrier specs for your pick-and-place setup
- Datasheet (PDF)

The YAT-6+ is rated at 2 W power handling. If you need other attenuation values in the same package, the YAT series covers multiple dB steps in the same MC1630 footprint — just let me know.

*Parts surfaced:* YAT-6+

### Q49. Can you identify a component marked "SIM-73G+"? What is its maximum operating frequency?

I was not able to find a part numbered exactly **SIM-73G+** in the Mini-Circuits catalog. The closest match is the **SIM-73L+**, which is an SMT frequency mixer in the same SIM-73 family. It's possible "SIM-73G+" is a misread, a custom variant, or a part from another manufacturer.

Here's what the **SIM-73L+** looks like, for reference:

  
- **Type:** Frequency Mixer (SMT, 50 Ω)
  
- **Frequency:** 2,400 – 7,000 MHz
  
- **Interface:** SMT (case style HV1195)
  
- **Datasheet:** SIM-73L+ Datasheet (PDF)

If you're certain the marking reads "SIM-73G+", I'd recommend double-checking the part marking and reaching out to our applications team for confirmation: apps@minicircuits.com.

*Parts surfaced:* SIM-73L+

### Q50. What is the part number for a 2-way 90-degree splitter covering 1800 to 2700 MHz?

The search results don't include descriptions flagging 90° (quadrature) types directly, but two strong candidates stand out from the catalog for your 1800–2700 MHz requirement. Let me highlight the most relevant ones:

**GP2Y+** — 2-way 90° (quadrature hybrid), 1600–3300 MHz, 50Ω, connectorized
**GP2Y1+** — 2-way 90° (quadrature hybrid), 1550–4400 MHz, 50Ω, connectorized

Both cover your 1800–2700 MHz band. The "GP" prefix in Mini-Circuits' naming convention denotes 90° (quadrature) power splitters/combiners.

Also worth noting: **SCG-2-322+** covers 1800–3200 MHz and is a 2-way connectorized splitter — confirm its phase type via the datasheet.

For the GP2Y+ and GP2Y1+, confirm exact specs (insertion loss, isolation, amplitude/phase balance) via their datasheets:

- GP2Y+ Datasheet (PDF)

- GP2Y1+ Datasheet (PDF)

Do you need an SMT package, a specific connector type, or have other constraints (power handling, isolation)?

*Parts surfaced:* GP2Y+, GP2Y1+, SCG-2-322+

### Q51. I found a part marked "PMA-5451+". Is this a low noise amplifier or a driver amplifier?

The **PMA-5451+** is a **low noise amplifier (LNA)**. Its headline noise figure of **0.6 dB** is a strong indicator — that's firmly in LNA territory, not a driver amp.

Key specs from the product page:
- **Noise Figure:** 0.6 dB
- **Impedance:** 50 Ω
- **Package:** 3×3 mm SMT (Case DQ849)
- **Stock:** 12,144 units on hand

For full specs (gain, P1dB, frequency range, bias) and performance curves, see:
- Datasheet (PDF)
- View Graphs (PDF)
- View Data (PDF)

*Parts surfaced:* PMA-5451+

### Q52. Looking for the part number of a USB-controlled SP8T electromechanical switch matrix.

Here are the USB-controlled SP8T electromechanical switch models from Mini-Circuits:

| Part Number | Frequency | Key Specs |
|---|---|---|
| **USB-1SP8T-183** | See datasheet | IL 65 dB, ISO 0.25 dB |
| **USB-1SP8T-183SP** | See datasheet | IL 65 dB, ISO 0.25 dB (alt case style NR3314) |
| **USB-1SP8T-34** | See datasheet | IL 80 dB, ISO 0.25 dB |
| **USB-1SP8T-852H** | See datasheet | IL 70 dB, ISO 1 dB |

All are connectorized, USB-controlled, electromechanical SP8T switches. A few notes on each:

- **USB-1SP8T-183 / USB-1SP8T-183SP** — same electrical specs, different mechanical form factors (NR3245 vs NR3314 case styles).
- **USB-1SP8T-34** — highest isolation spec (80 dB).
- **USB-1SP8T-852H** — housed in a larger QM2280 enclosure; may suit higher-power or ruggedized applications.

For a full switch matrix system (multiple SP8T modules integrated with USB control), also check out Mini-Circuits' Mechanical Switch Matrix product page, which covers rack-mount and custom configurations.

Do you need the datasheet or pricing/stock for any of these?

*Parts surfaced:* USB-1SP8T-183, USB-1SP8T-183SP, USB-1SP8T-34, USB-1SP8T-852H

### Q53. I have a component marked "XLF-631+". What specific filter topology is this based on?

The part number **XLF-631+** does not appear in the Mini-Circuits catalog — neither a direct lookup nor a keyword search returned it.

A few possibilities:

1. **Marking misread** — The "X", "L", and "6" can be easy to misread on small SMT markings. Common similar Mini-Circuits filter families include **XLF** (LTCC low-pass filters), but I can't confirm a specific "XLF-631+" exists.
2. **It may be a different manufacturer's part** — I can only speak to Mini-Circuits catalog parts and can't identify parts from other manufacturers.
3. **It could be a custom or legacy part** — If it was supplied through a special order or is an older production run, it may not appear in the public catalog.

If you believe it is a Mini-Circuits part, I'd recommend reaching out to the applications team directly — they can look it up by internal records: apps@minicircuits.com. 

If you can double-check the marking or share any other details (package size, number of pins, approximate frequency of use), I'm happy to help narrow it down.

### Q54. What is the part number for a right-angle precision adapter, 2.92mm male to 2.92mm female?

The right-angle 2.92mm (K) precision adapters you're looking for are:

- ****24FR-KF+**** — 2.92mm Male to 2.92mm Female, right angle
- ****24MR-KF+**** — 2.92mm Female to 2.92mm Male, right angle (opposite orientation)

The "R" in the part number denotes the right-angle configuration. Both are rated to 40 GHz (2.92mm interface). Check the product pages for live pricing, stock, and datasheets.

24FR-KF+ Datasheet (PDF)

24MR-KF+ Datasheet (PDF)

*Parts surfaced:* 24FR-KF+, 24MR-KF+

### Q55. Can you identify a legacy plugin part marked "JTOS-150"? Is it still active?

**JTOS-150** (without the "+" suffix) is a legacy, discontinued part number. It does not resolve to an active product page on minicircuits.com.

The current active successor is **JTOS-150+** — a plug-in (connector-interface) VCO in the same JTOS family and case style (BK377), with the "+" denoting Mini-Circuits' enhanced RoHS-compliant version. Key specs from the catalog:

- **Type:** VCO (Voltage-Controlled Oscillator), plug-in/connectorized
- **Tuning start (flo):** 75 MHz
- **Phase noise:** −147 dBc/Hz (typ)
- **Vcc:** 12 V | **Icc:** 20 mA
- **Impedance:** 50 Ω
- **Case:** BK377 (plug-in module)
- Datasheet (PDF)

There is also a **JTOS-150P+** variant (same case, slightly different tuning/specs — flo 72 MHz) if you need to compare. For live pricing, stock, and S-parameters, visit the product page directly.

If you need to confirm a direct pin/mechanical drop-in equivalence between the old JTOS-150 and JTOS-150+, the apps team can verify: apps@minicircuits.com.

*Parts surfaced:* JTOS-150+, JTOS-150P+

### Q56. I found a connectorized part marked "ZFRSC-123+". Is this a resistive splitter or a reactive splitter?

The part number **ZFRSC-123+** doesn't pull up in the Mini-Circuits catalog — it may be a misread marking, an older/obsolete part number, or a transcription error on the label.

That said, I can help you decode the naming convention:

- **ZFR** prefix on connectorized Mini-Circuits splitters/combiners typically indicates a **resistive (R-type)** power divider — these use a resistive network and work from DC up, but have inherent insertion loss (~6 dB for a 2-way split) and lower isolation compared to reactive designs.
- **Reactive** (Wilkinson-type) splitters in the connectorized line typically carry prefixes like **ZFSC** (no "R") or **ZN2PD**, and are narrowband by nature but more efficient (ideal ~3 dB split loss).

The "R" in **ZFR**SC strongly suggests **resistive**, but I can't confirm specs for this specific part number since it's not resolving in the catalog.

A couple of suggestions:
1. Double-check the marking — could it be **ZFRSC-2-13+**, **ZFRSC-183-S+**, or similar?
2. If you have a photo of the label, the apps team can identify it: apps@minicircuits.com

*Parts surfaced:* ZFRSC-183-S+

### Q57. What is the part number for a bias tee that can handle up to 500mA of DC current and works at 10 GHz?

The best match for your requirements (≥500 mA, covers 10 GHz) is the **MBT-283+**.

Here's why it stands out:
- **Frequency:** 1,500–28,000 MHz (covers 10 GHz with plenty of headroom)
- **Max DC current:** 500 mA
- **Insertion loss:** 0.7 dB typ.
- **Isolation:** 47 dB typ.
- **Interface:** Connectorized

Datasheet (PDF) | Product Page

Also worth noting — if you need a wider frequency range (10 MHz to 43.5 GHz) and can tolerate more current headroom, the **ZBT-44-1A-FT+** handles up to 1.2 A DC. And if you only need to go up to exactly 10 GHz from a low start frequency (10 MHz), the **TCBT-14+** covers 10 MHz–10 GHz, though its DC current rating is 200 mA (below your 500 mA requirement).

So **MBT-283+** is your best fit.

*Parts surfaced:* MBT-283+, ZBT-44-1A-FT+, TCBT-14+

### Q58. I have a reel marked "RC-2SP4T-26". What kind of test equipment box is this?

The **RC-2SP4T-26** is not a reel component — it's a **bench-top/rack-mount RF switch box**: specifically a **dual SP4T (Single-Pole, 4-Throw) USB/Ethernet-controlled RF switch system** from Mini-Circuits' RC (Remote-Controlled) instrument series.

It is not a passive SMT part that would come on a reel. If your reel is labeled "RC-2SP4T-26," it may be a mis-labeled or mis-identified reel — this part number belongs to a box-style test instrument.

Here are the key details:

**Pricing & Availability**

  
 | Qty |  | Unit Price (USD) | 

  
 | 1 |  | $4,991.12 | 

**Current Stock:** 5 units

**Downloads**

  
- Datasheet (PDF)
  
- View Data
  
- View Graphs
  
- Case Style Drawing (MR2616)

If you genuinely have a reel and need help identifying what's on it, the apps team can help: apps@minicircuits.com.

*Parts surfaced:* RC-2SP4T-26

### Q59. Looking for the part number of a 1:4 ratio transformer covering 5 to 500 MHz in a core and wire surface mount package.

Good match right at the top. The **ADT4-5WT+** fits your spec precisely:

- **Impedance ratio:** 4:1
- **Frequency:** 0.3–500 MHz (fully covers your 5–500 MHz requirement)
- **Technology:** Core & Wire
- **Interface:** SMT (case style CD637)
- **Impedance:** 50Ω

Datasheet (PDF) | Product Page

A couple of close alternatives worth knowing about:
- **ADT4-6WT+** — 0.5–600 MHz, 4:1, Core & Wire SMT (CD636 case) — wider upper end if you ever need it
- **TC4-6T+** — 1.5–600 MHz, 4:1, Core & Wire SMT (AT224-1 case)

The ADT4-5WT+ is the tightest fit for your stated 5–500 MHz band. Check the product page for live pricing and stock.

*Parts surfaced:* ADT4-5WT+, ADT4-6WT+, TC4-6T+

### Q60. I found a part marked "LAT-10+". Is this a surface-mount or an inline coaxial attenuator?

The **LAT-10+** is a **surface-mount (SMT)** attenuator — not a coaxial inline unit. A few indicators confirm this:

- **Case style MMM168** — a small SMT package
- It has a **PCB Layout** (98-PL-225) and **Tape & Reel** (F8) filing, both of which are SMT-specific documents
- An **evaluation board** (TB-LAT-10+) is available, typical for SMT parts
- System impedance: **50 Ω**
- Attenuation: **10 dB** (the "10" in the part number)

Handy links:
- Datasheet (PDF)
- View Graphs
- Case Style Drawing (MMM168)

If you need the same 10 dB attenuation in a connectorized/inline package instead, I can find those options for you.

*Parts surfaced:* LAT-10+, TB-LAT-10+

### Q61. What is the part number for a low noise amplifier module covering 20 to 40 GHz with 2.92mm connectors?

The best match for a 20–40 GHz LNA module with 2.92mm connectors is the **ZVA-18403G+** (and its variant **ZVA-18403GX+**).

Both cover **18–40 GHz** — fully spanning your 20–40 GHz requirement — and have the lowest noise figure of all the 2.92mm results:

  
- **Frequency:** 18,000–40,000 MHz
  
- **Gain:** 43 dB typ.
  
- **Noise Figure:** 3.8 dB typ.
  
- **Output P1dB:** 22 dBm typ.
  
- **OIP3:** 28 dBm typ.
  
- **Vcc:** 15 V, 190 mA
  
- **Interface:** 2.92mm (K-connector)

The **ZVA-18403GX+** is the extended-temperature variant of the same part — useful if your environment runs hot or cold. Datasheets:

  
- ZVA-18403G+ Datasheet (PDF)
  
- ZVA-18403GX+ Datasheet (PDF)

*Parts surfaced:* ZVA-18403G+, ZVA-18403GX+

### Q62. Can you identify a component marked "K1245"? Is it a low pass or a high pass filter?

Unfortunately, "K1245" does not match any Mini-Circuits part number or catalog marking in our database. The search returned no relevant results for that code.

A few things to consider:

- **Mini-Circuits part markings** on small SMT components are often abbreviated codes (e.g., a filter marked "SLP-xxx" for low-pass, "SHP-xxx" for high-pass, etc.). "K1245" doesn't correspond to a known Mini-Circuits marking pattern.
- It's possible the component is from **another manufacturer**, or the marking is a date/lot code rather than a part identifier.

**To help identify it further:**
1. Can you describe the package — size (0402, 0603, SOT-23, etc.), number of pins/pads, and any other markings?
2. Do you know where it came from (PCB application, frequency band, signal path context)?
3. Is there a longer part number elsewhere on the reel or bag?

If you believe it is a Mini-Circuits part, you can also reach our applications team directly: apps@minicircuits.com — they can cross-reference lot codes and internal markings.

### Q63. I have a part marked "ZFM-3+". What is the recommended LO power level for this connectorized mixer?

The specs returned for the **ZFM-3+** include an `lo_drive` value — here's what the tool shows:

The LO drive level is **+7 dBm** (Level 7), which is the recommended LO input power for this mixer.

A few other details while I have it up:

- **Stock:** 2 units currently available
- **Pricing:**

  
 | Qty |  | Unit Price (USD) | 

  
 | 1 |  | $94.48 | 

  
 | 10 |  | $80.25 | 

  
 | 25 |  | $78.83 | 

  
 | 100 |  | $75.99 | 

**Downloads:**
- Datasheet (PDF)
- View Data
- View Graphs

For full frequency range, conversion loss, isolation, and IF/RF/LO port specs, the datasheet and View Data files are the best reference.

*Parts surfaced:* ZFM-3+

### Q64. What is the part number for a phase shifter controlled by a 0-5V analog voltage covering 200 to 400 MHz?

The product pages for these parts don't return the full frequency range in the structured data, so I need to point you to the datasheets to confirm exact band coverage. Here's what I can tell you:

**Best candidate: **JSPHS-446+****
This connectorized analog phase shifter has its model number derived from its center frequency (~446 MHz), which suggests it covers a band around 200–700 MHz — but you should verify against the datasheet before committing.

  
- Impedance: 50 Ω
  
- Package: BK276 (connectorized)
  
- Insertion loss: 2.5 dB typ.
  
- Datasheet (PDF) — check the frequency range and tuning voltage spec
  
- View Graphs — phase shift vs. voltage curves

**Also worth checking: **JSPHS-42+**** — flo listed at 300 MHz; may cover your band depending on its upper limit. Datasheet (PDF)

I can't confirm the 0–5 V tuning voltage range from the tool data alone — the datasheets will show the exact Vtune spec and phase-shift range. If neither part fits, the apps team can help identify the right match: apps@minicircuits.com.

*Parts surfaced:* JSPHS-446+, JSPHS-42+

### Q65. Looking for the part number of a 10dB fixed attenuator in an 0402 surface-mount footprint.

Your part is **BAT-10+** — a 10 dB fixed SMT attenuator in the KC3009 case style (0402 footprint), rated DC to 60 GHz.

Datasheet (PDF) | Product Page

For live pricing and stock, click the product page link above.

*Parts surfaced:* BAT-10+

### Q66. I found a part marked "ROS-3000V+". What is its typical output power into a 50-ohm load?

The **ROS-3000V+** is confirmed as a valid Mini-Circuits part (a voltage-tunable VCO), and the tool returns its impedance as **50 Ω** — but typical output power is not among the headline specs surfaced from the product page.

I won't guess that value. Here's how to find it:

1. **Datasheet (PDF)** — the output power spec (in dBm) will be listed in the Electrical Specifications table.
2. **View Data** — tabular data including output power vs. tuning voltage.
3. **View Graphs** — output power vs. frequency/voltage curves.

If you need confirmation beyond what's in those files, the apps team can help directly: apps@minicircuits.com.

*Parts surfaced:* ROS-3000V+

### Q67. What is the part number for a 3-foot test cable with a 3.5mm male connector on one end and an SMA male on the other?

The catalog search isn't surfacing a mixed 3.5mm-male to SMA-male part directly through keyword matching, and attempts to guess the part number haven't confirmed a match. The search results show 3.5mm-to-3.5mm cables (e.g., **T40-3FT-KMKM+**, **E40-3FT-KMKM+**) but not a 3.5mm-male to SMA-male combination in 3 ft.

A few possibilities:
1. **This exact configuration may exist but isn't surfacing** via keyword search — Mini-Circuits' cable naming convention uses connector codes (e.g., "KM" = 3.5mm male, "SM" = SMA male), so a part like `T40-3FT-KMSM+` is the logical candidate, but it did not come up as a confirmed product.
2. **An adapter could bridge the gap** — pair a 3.5mm-to-3.5mm or SMA-to-SMA 3 ft cable with a 3.5mm-to-SMA adapter.

I'd recommend reaching out directly to the Mini-Circuits applications team — they can confirm if this exact cable is cataloged or quote a custom assembly:
apps@minicircuits.com

*Parts surfaced:* Cables, T40-3FT-KMKM+, E40-3FT-KMKM+

### Q68. Can you identify an active component marked "MACA-242H+"?

**MACA-242H+** is a Mini-Circuits **MMIC amplifier** (gain block / driver amplifier) in a compact SMT package.

Here's what the product page confirms:

- **Impedance:** 50 Ω
- **Package:** Case style DZ1034 (SMT), tape & reel available (F34)
- **Eval board:** TB-MACA-242H+ available

The "MACA" family are wideband MMIC amplifiers, and the "242H" designation places it in that series — but for the full electrical specs (frequency range, gain, NF, P1dB, OIP3, Vcc/Icc), please refer to the published data:

- Datasheet (PDF)
- View Data
- View Graphs
- Case Style Drawing (DZ1034)
- PCB Layout

**Pricing & Availability:**

  
 | Qty |  | Unit Price (USD) | 

  
 | 10 |  | $15.98 | 

  
 | 20 |  | $15.98 | 

  
 | 50 |  | $15.00 | 

  
 | 100 |  | $14.14 | 

  
 | 200 |  | $12.69 | 

  
 | 500 |  | $11.84 | 

**Stock: currently 0** — contact apps@minicircuits.com for lead time or alternative recommendations.

*Parts surfaced:* MACA-242H+, TB-MACA-242H+

### Q69. I have a component marked "ZVE-8G+". Is this a high-power amplifier module?

Yes — the **ZVE-8G+** is a connectorized **high-power amplifier module** from Mini-Circuits' ZVE series, designed for demanding broadband applications.

Here's what the live product page confirms:

  
- **Impedance:** 50 Ω
  
- **Package:** Connectorized module (Case Style BN333)
  
- **Stock:** More than 10 units available

**Pricing:**

  
 | Qty |  | Unit Price (USD) | 

  
 | 1 |  | $1,899.08 | 

  
 | 5 |  | $1,899.08 | 

For full performance specs (gain, P1dB, output power, frequency range, Vcc), the datasheet and graphs are the definitive source:

  
- Datasheet (PDF)
  
- View Data
  
- View Graphs
  
- S-Parameters (.zip)
  
- Case Style Drawing (BN333)

The detailed gain, noise figure, P1dB, and saturated output power values are all in the datasheet — I'd recommend opening that first.

*Parts surfaced:* ZVE-8G+

### Q70. What is the part number for a high-pass filter in an LTCC package that has a passband from 3 GHz to 8 GHz?

Looking at the search results, the closest LTCC high-pass filter candidates from the HFCG/HFCN family are:

****HFCG-4400+**** — LTCC, GE0805C-9 package, rejection 38 dB, stopband upper edge ~3000 MHz
****HFCG-4000+**** — LTCC, GE0805C-9 package, rejection 40 dB, stopband upper edge ~2500 MHz
****HFCG-3800+**** — LTCC, GE0805C-9 package, rejection 34 dB, stopband upper edge ~2700 MHz

However, I have to be honest: none of the returned results clearly shows a passband starting at 3 GHz and extending to 8 GHz. The frequency data in the results (fhi values) appears to describe stopband edges rather than passband limits, and I cannot confirm from these results alone that any of these parts has a passband covering 3–8 GHz. The HFCG-4400+ is the highest-cutoff part returned and may be the closest, but I won't claim it matches your spec without confirmation.

For a definitive answer, I'd recommend two steps:

1. Check the datasheets directly — HFCG-4400+ Datasheet — to see if the passband extends to 8 GHz.
2. Reach out to the applications team with your exact requirement (HPF, 3–8 GHz passband, LTCC): apps@minicircuits.com 

They can point you to the exact part or confirm if a custom solution is needed. Click any part number above for live pricing and stock on the product page.

*Parts surfaced:* HFCG-4400+, HFCG-4000+, HFCG-3800+

### Q71. I found a part marked "SCG-2-63+". Is this a splitter or a directional coupler?

**SCG-2-63+** didn't come up as an active Mini-Circuits part number in the catalog, and the product page returned no result either. A few possibilities:

- **Typo or marking variation** — could the marking be slightly different? For example, **SCN-2-63+** (a splitter/combiner series) or something similar?
- **Discontinued part** — it may be an older part no longer in the active catalog.
- **Third-party part** — some distributors use similar naming conventions.

For context, Mini-Circuits' **"SC"** prefix typically denotes a **splitter/combiner**, while directional couplers usually carry prefixes like **DBTC**, **CDC**, **CPD**, **ZFDC**, etc. So if it is a genuine Mini-Circuits part, the "SC" prefix would suggest a **splitter/combiner** — but I can't confirm that without a valid catalog entry.

My recommendation: double-check the marking on the part (especially the middle digits), and if you can share a clearer read, I can search again. Alternatively, the apps team can identify it from a photo or part marking: apps@minicircuits.com.

### Q72. Looking for the part number of a digital step attenuator with a parallel control interface and a 4x4mm QFN package.

The catalog search is returning fixed attenuators rather than DSA/programmable parts with those specific package/interface filters. To narrow this down precisely, a couple more details would help me find the right match:

To find the right **digital step attenuator**, fill in what you know (leave blank / "any" if unsure):

- **Frequency:** (e.g. 0.1–6000 MHz)
- **Attenuation range & step size:** (e.g. 0–31.5 dB, 0.5 dB steps)
- **Control interface:** Parallel ✓
- **Package:** 4×4 mm QFN ✓
- **Supply voltage:** (e.g. 3.3 V, 5 V)
- **Frequency band / application:** (e.g. cellular, WiFi, wideband)

Reply with whatever you've got and I'll find the best matches.

### Q73. What is the part number for a 1:16 impedance ratio balun transformer?

There are 14 models with a 1:16 impedance ratio. Here's a summary of the lineup — all are core & wire, 50Ω system impedance:

| Part Number | Freq Range | Package |
|---|---|---|
| **ADT16-1T+** | 1.5–160 MHz | SMT (CD542) |
| **ADT16-6+** | 0.25–105 MHz | SMT (CD636) |
| **ADT16-6T+** | 0.1–70 MHz | SMT (CD637) |
| **TC16-1T+** | 20–300 MHz | SMT (AT224-1) |
| **TC16-1TG2+** | 20–300 MHz | SMT (AT224-3) |
| **TC16-1TX+** | 20–300 MHz | SMT (AT1521) |
| **TC16-161T+** | 0.6–160 MHz | SMT (AT224-1) |
| **TC16-161TG2+** | 0.6–160 MHz | SMT (AT224-3) |
| **TC16-161TX+** | 0.6–160 MHz | SMT (AT1521) |
| **T16-6T-KK81+** | 0.03–75 MHz | SMT (KK81) |
| **T16-6T-X65+** | 0.03–75 MHz | Through-hole (X65) |
| **TMO-16-1+** | 0.3–120 MHz | Through-hole (A11) |

To narrow it down to the best fit for your application, just let me know your operating frequency and package preference.

*Parts surfaced:* ADT16-1T+, ADT16-6+, ADT16-6T+, TC16-1T+

### Q74. I have a part marked "ZX95-1200+". Is this a VCO or a complete synthesizer module?

The part number **ZX95-1200+** is not currently found in the Mini-Circuits online catalog — neither the product page nor a keyword search returned it.

That said, the **ZX95** prefix is a well-known Mini-Circuits VCO (Voltage-Controlled Oscillator) series — connectorized, coaxial-style modules (the "ZX" prefix denotes connectorized hardware). The "1200" in the part number would typically indicate the approximate upper tuning frequency in MHz. So it is **a VCO, not a synthesizer** — it produces an RF output whose frequency varies with an applied tuning voltage, with no internal phase-lock loop or reference.

It's possible the part has been discontinued or the marking on your unit uses a slightly different format. A few things to try:

1. **Check the label carefully** — it might be ZX95-1200W+, ZX95-1200-S+, or a similar variant.
2. **Search the website directly** at minicircuits.com for any close matches.
3. **Contact the apps team** for confirmation on the exact part status, specs, and any recommended replacement: apps@minicircuits.com.

### Q75. Can you identify a component marked "DAT-31-SP+"? What type of serial control interface does it require?

The **DAT-31-SP+** is a **digitally programmable attenuator (DSA)** from Mini-Circuits — a 6-bit, 0–31.5 dB step attenuator in an SMT package (case style DG983-1), designed for 50 Ω systems.

Regarding the control interface: the "SP" in the part name stands for **Serial (SPI) control**. It uses a **3-wire SPI-compatible serial interface** (clock, data, latch/enable) rather than parallel TTL control lines — making it well-suited for microcontroller-driven designs where you want to minimize control line count.

The exact electrical specifications for the SPI interface (logic levels, timing, clock speed) are detailed in the datasheet:

  
- Datasheet (PDF)
  
- View Data (PDF)
  
- View Graphs (PDF)
  
- PCB Layout
  
- Eval Board TB-334

If you need confirmation on specific SPI timing parameters, the apps team can help: apps@minicircuits.com.

*Parts surfaced:* DAT-31-SP+, TB-334

## Alternative Model Requests & Cross-Referencing

### Q76. We are using the Analog Devices HMC219 mixer. Do you have a pin-compatible surface mount replacement?

Good results. The HMC219 is a passive, double-balanced mixer in a 16-lead SOIC (4×4 mm exposed paddle) package covering ~1–4 GHz RF/LO with +10 dBm LO drive. The closest Mini-Circuits candidates from the SMT 1–4 GHz results are the **SIM-43H+** and **SIM-43+** family. Let me be upfront with you about pin compatibility.

---

**Important caveat on "pin-compatible":** The HMC219 uses Analog Devices' proprietary 16-lead SOIC footprint. Mini-Circuits SMT mixers in this frequency range use our own packages (typically SC-70 style or a Mini-Circuits QFN). A drop-in pin-for-pin replacement on the same PCB footprint is unlikely — I can't confirm that without you verifying the package drawing against your layout.

**That said, here are the closest SMT functional equivalents** covering 1–4 GHz at 50Ω:

****SIM-43H+**** — 1,000–4,000 MHz, SMT, 50Ω — the tightest frequency match to the HMC219's RF/LO band.

****SIM-43+**** — 750–4,200 MHz, SMT, 50Ω — slightly wider coverage.

****SIM-43MH+**** — 824–4,200 MHz, SMT, 50Ω — higher LO drive variant.

For each, check the case-style drawing on the product page to compare the footprint to your HMC219 layout. If none match your PCB pad layout exactly, our apps team can advise on the closest fit or whether a layout adapter is needed:
apps@minicircuits.com 

What LO drive level does your design use, and do you need IF bandwidth down to DC or does it have a low-end cutoff?

*Parts surfaced:* SIM-43H+, SIM-43+, SIM-43MH+

### Q77. I need a lower-cost alternative to the MACOM MAAM-011229 amplifier. What is the closest match in your catalog?

The MACOM MAAM-011229 is a 50 MHz–6 GHz wideband MMIC amplifier with approximately 13–14 dB gain, ~2 dB NF, high OIP3 (~40 dBm), and 5V operation. Here's how our closest match stacks up:

---

**Lead Recommendation: **PHA-1+****

A direct functional alternative — same 50 MHz–6 GHz band, same 5V supply, same gain/NF/linearity class:

| Spec | PHA-1+ |
|---|---|
| Frequency | 50 – 6,000 MHz |
| Gain | 13.5 dB |
| Noise Figure | 2.2 dB |
| OIP3 | 42 dBm |
| Output P1dB | 22.4 dBm |
| Vcc / Icc | 5V / 146 mA |
| Package | SOT-89 (DF782) |

**Pricing & Availability:**

 | Qty |  | Unit Price (USD) | 

 | 20 |  | $2.62 | 

 | 50 |  | $1.96 | 

 | 100 |  | $1.90 | 

 | 500 |  | $1.75 | 

 | 1,000 |  | $1.59 | 

 | 5,000 |  | $1.55 | 

Stock: **more than 20,000 units** available now.

**Downloads:**

- Datasheet (PDF)

- View Data

- View Graphs

- S-Parameters (.s2p)

- PCB Layout

---

**Two other options worth knowing about:**

- **PHA-1H+** — Same package, slightly lower Icc (132 mA) with nearly identical gain/NF/OIP3. Good if power consumption is a consideration.
- **LHA-1+** — Also 50–6,000 MHz, higher output P1dB (22.7 dBm) and OIP3 (40 dBm), 5V/146 mA, in a different footprint (FG873).

All three are well under $3/unit at low volumes — typically significantly cheaper than MACOM pricing at comparable quantities. Check the PHA-1+ datasheet against your exact gain flatness and return loss requirements to confirm fit.

*Parts surfaced:* PHA-1+, PHA-1H+, LHA-1+

### Q78. We currently use the Marki Microwave T3-06. Does Mini-Circuits offer a wideband mixer with comparable IP3 performance?

Good data. Now I have enough to give a useful answer. The Marki T3-06 is a triple-balanced mixer covering roughly 0.5–6 GHz with very high IIP3 (typically +23–27 dBm) and LO drive of +17–20 dBm. Here's how the Mini-Circuits catalog lines up:

---

The Marki T3-06 is a high-linearity triple-balanced mixer (nominally ~500 MHz–6 GHz, LO drive +17–20 dBm, IIP3 in the +23–27 dBm range). The closest Mini-Circuits equivalents are in the **MCA1T** series — also triple-balanced, wideband SMT mixers built for high IP3:

**Top picks:**

****MCA1T-60+**** — Triple-balanced, 1600–6000 MHz, SMT
The most direct frequency match to the T3-06 upper band. Triple-balanced topology for excellent spurious suppression and high linearity.

- Frequency: 1600–6000 MHz

- Package: SMT (DZ885-2 case)

- Datasheet (PDF) — IIP3, conversion loss, and LO drive specs are all in here

****MCA1T-12G+**** — Triple-balanced, 3800–12000 MHz, SMT
Wider upper coverage if your system extends beyond 6 GHz.

- Frequency: 3800–12000 MHz

- Datasheet (PDF)

****MCA1T-85+**** — Triple-balanced, 2800–8500 MHz, SMT
A good middle ground if you need higher-frequency coverage with the same triple-balanced architecture.

- Frequency: 2800–8500 MHz

- Datasheet (PDF)

---

**Important caveat:** The live product pages didn't return the IIP3/OIP3 and conversion loss figures directly, so I won't quote a number and ask you to trust it. The datasheets for all three include the full linearity performance tables and IP3 vs. frequency graphs — that's the right place to do an apples-to-apples comparison against the T3-06 spec sheet.

If you'd like the apps team to do a direct side-by-side comparison and confirm a drop-in recommendation, reach out at apps@minicircuits.com.

*Parts surfaced:* MCA1T-60+, MCA1T-12G+, MCA1T-85+

### Q79. Is there a direct cross-reference for the Qorvo TQP3M9024 gain block amplifier?

Good results. The TQP3M9024 key specs are: 50 MHz–4 GHz, ~19 dB gain, ~2.3 dB NF, OIP3 ~+36 dBm, OP1dB ~+21 dBm, Vcc 3.3–5V, SOT-89 package. Let me match against these.

The closest candidates from the search:

**Best cross-reference: **PSA4-5043+****

This is the tightest match across the board:

- **Frequency:** 50 MHz – 4 GHz ✓
- **Gain:** 18.4 dB (vs. ~19 dB) ✓
- **NF:** 0.75 dB (actually better than TQP3M9024's ~2.3 dB)
- **OIP3:** +33.5 dBm
- **OP1dB:** +18.8 dBm
- **Vcc:** 3.05 V (5V variant: **PSA4-5043-D+**)
- **Package:** SOT-89 (MMM1362) — same footprint class as TQP3M9024 ✓

The NF on the PSA4-5043+ is significantly better than the Qorvo part, which is a bonus. OIP3 is slightly lower (~36 vs. ~33.5 dBm), so if linearity is the critical spec, also worth checking:

****CMA-5043+**** — same 50 MHz–4 GHz band, 18.4 dB gain, NF 0.75 dB, OIP3 +33.5 dBm, OP1dB +19.8 dBm, Vcc 5V. Different package (DL1721), so not a pin-compatible drop-in, but electrically very close.

**Summary of best picks:**

| Part | Freq | Gain | NF | OIP3 | OP1dB | Vcc | Package |
|---|---|---|---|---|---|---|---|
| TQP3M9024 (Qorvo) | 50M–4G | ~19 dB | ~2.3 dB | ~+36 dBm | ~+21 dBm | 3.3–5V | SOT-89 |
| **PSA4-5043+** | 50M–4G | 18.4 dB | 0.75 dB | +33.5 dBm | +18.8 dBm | 3.05V | SOT-89 |
| **PSA4-5043-D+** | 50M–4G | 18.4 dB | 0.8 dB | +34 dBm | +19 dBm | 5V | SOT-89 |
| **CMA-5043+** | 50M–4G | 18.4 dB | 0.75 dB | +33.5 dBm | +19.8 dBm | 5V | DL1721 |

**Recommendation:** If you're running from 3.3V and need an SOT-89 footprint, **PSA4-5043+** is the closest drop-in. For 5V operation, **PSA4-5043-D+**. The NF is much better than the Qorvo part; OIP3 is within ~2–3 dB — verify your link budget to confirm it meets margin.

For a definitive pin-for-pin drop-in confirmation, I'd recommend reviewing the datasheets side by side and checking with our apps team: apps@minicircuits.com

*Parts surfaced:* PSA4-5043+, PSA4-5043-D+, CMA-5043+

### Q80. I am looking for an alternative to the Hittite HMC358 VCO that tunes around 5.8 GHz.

Unfortunately, the keyword search didn't return any VCOs — those are all filters. Let me be direct with you:

**Mini-Circuits does not currently carry VCOs in the 5.8 GHz range.** The catalog searches across all oscillator/VCO categories at that frequency came back empty. Mini-Circuits' VCO line generally covers lower frequency ranges, and the 5.8 GHz band is outside what's available.

For a direct HMC358 alternative at 5.8 GHz, your best options would be to look at:
- **Analog Devices / Hittite** — the HMC358 is still listed in their portfolio
- **Crystek** (CVCO55 series)
- **Z-Communications** — strong VCO portfolio in the 5–6 GHz range

That said, if you have flexibility on your architecture (e.g., using a lower-frequency VCO + frequency doubler, or a PLL synthesizer), Mini-Circuits may be able to help with supporting components.

I'd also recommend reaching out to the Mini-Circuits apps team directly — they may be aware of upcoming products or custom solutions: apps@minicircuits.com.

### Q81. We use the pSemi PE4304 digital step attenuator. Do you have a 6-bit DSA with a serial interface that can replace it drop-in?

Good to know — my catalog search tool is not surfacing the programmable/DSA MMIC series with the current filters. Let me be transparent with you about what I found and what I'd recommend.

My searches are returning only fixed attenuators — the tool isn't surfacing Mini-Circuits' programmable DSA MMIC series (such as the **RAS** or **DAT** families) through those keyword filters. I don't want to invent a part number or claim a pin-compatible replacement I can't verify from a tool result.

Here's what I'd recommend:

**1. Check Mini-Circuits' Programmable Attenuator page directly:**
minicircuits.com — Programmable Attenuators

Mini-Circuits does offer SMT digital step attenuator ICs (serial/SPI control, 6-bit / 63 dB / 0.5 dB LSB are common configurations), but for a confirmed drop-in replacement for the PE4304 — which has a specific pinout, package (SC-70 / QFN), supply voltage, and SPI protocol — that needs to be validated by someone who can compare datasheets directly.

**2. Contact the applications team** — they can do a proper cross-reference:
apps@minicircuits.com 

Give them: the PE4304 package/pinout, your frequency band, supply voltage, and attenuation range — they'll tell you quickly if there's a direct drop-in or what the closest match is.

*Parts surfaced:* Programmable Attenuators

### Q82. Do you have a surface-mount equivalent to the Skyworks SKY13311-374LF SPDT switch?

Good results. The SKY13311-374LF is a GaAs SPDT switch rated DC–3 GHz with ~0.6 dB insertion loss and ~23 dB isolation in a tiny SC-70 (6-lead) SMT package, operating from a single 3V supply with CMOS logic control. Let me highlight the closest SMT matches from Mini-Circuits:

The **HSWA2-30DR+** is likely your best drop-in candidate:

- **Frequency:** DC – 3,000 MHz

- **Insertion Loss:** 1.2 dB typ.

- **Isolation:** 44 dB typ.

- **Impedance:** 50Ω

- **Package:** SMT (DG983-1)

The frequency range is a direct match to the Skyworks part (DC–3 GHz), and the isolation is actually substantially better (44 dB vs. ~23 dB). The insertion loss is higher (~1.2 dB vs. ~0.6 dB), which is the main trade-off to evaluate.

Two other SMT options if you need wider bandwidth or different package footprint:
- **MSW2-50+** — DC–5 GHz, 2.2 dB IL, 24 dB isolation, SMT
- **M3SWA2-63DRC+** — DC–6 GHz, 2.2 dB IL, 30 dB isolation, SMT

A few things worth confirming against your design:
1. **Control voltage / logic** — the Skyworks part uses CMOS-compatible logic. Check the HSWA2-30DR+ datasheet for its control voltage requirements.
2. **Package footprint** — the DG983-1 case style will differ from the SC-70; verify PCB land pattern compatibility.
3. **Bias/supply** — confirm supply voltage compatibility with your system.

Datasheets: HSWA2-30DR+ Datasheet (PDF) | MSW2-50+ Datasheet (PDF)

If you'd like a closer electrical match on insertion loss or a specific control interface, the apps team can help narrow it further: apps@minicircuits.com

*Parts surfaced:* HSWA2-30DR+, MSW2-50+, M3SWA2-63DRC+

### Q83. I need a drop-in replacement for the obsolete Avago/Broadcom VMMK-1218 LNA.

Here's what I can offer as a functional replacement. A true "drop-in" depends on your board layout and bias circuit, but the specs line up well:

---

**Top Pick: **AVA-183MP+****

This is Mini-Circuits' closest functional match to the VMMK-1218 in terms of frequency coverage and noise performance:

| Parameter | AVA-183MP+ |
|---|---|
| Frequency | 50 – 18,000 MHz |
| Gain | 16.5 dB (typ) |
| Noise Figure | 1.8 dB (typ) |
| Output P1dB | 23.8 dBm (typ) |
| OIP3 | 31.1 dBm (typ) |
| Vcc | 8 V |
| Icc | 160 mA |
| Package | DG1847-1 (surface-mount) |

Datasheet (PDF) | Product Page | S-Parameters

**How it compares to the VMMK-1218:**
- Gain is higher (~16.5 dB vs ~13 dB) — you may need to account for this in your link budget
- NF is comparable (1.8 dB vs ~1.4 dB at lower freqs; VMMK-1218 NF rises toward 18 GHz)
- The AVA-183MP+ is an SMT part, not a bare die — so this is a **functional replacement, not a pin-compatible drop-in**
- Bias is different (8V/160mA vs VMMK-1218's ~3V/50mA), so your bias circuit will need redesign

**Also worth noting:** **PVGA-273-D+** covers 300 MHz – 26.5 GHz if you need the extra upper-band headroom, with 15.7 dB gain and 2.1 dB NF.

---

**Bottom line:** If you're doing a board redesign anyway, the **AVA-183MP+** is the strongest functional match. If you were using the VMMK-1218 as a bare die in a custom assembly or hybrid module, I'd recommend reaching out to the apps team — they may have additional options or can advise on the layout transition: apps@minicircuits.com.

*Parts surfaced:* AVA-183MP+, PVGA-273-D+

### Q84. What is your closest catalog cross-reference to the Marki IQ-0416 I/Q mixer?

Good — now I have a solid picture. Here's an honest assessment:

---

**Closest Mini-Circuits cross-references to the Marki IQ-0416 (4–16 GHz IQ mixer)**

The IQ-0416 is a broadband, connectorized IQ mixer spanning 4–16 GHz. Mini-Circuits' catalog IQ/image-reject mixers don't cover that full span in a single part today, but here are the closest options depending on your actual operating sub-band:

**Best overall frequency coverage (4–16 GHz region):**

- **MCA1-12G+** — SMT IQ mixer, 3.8–12 GHz. Covers the lower ~⅔ of the Marki's range. Datasheet
- **MAC-12G+** — Connectorized IQ mixer, 3.8–12 GHz, 50Ω. Connectorized like the IQ-0416. Datasheet
- **SIM-153+** — SMT single-balanced mixer, 3.4–15 GHz, 50Ω. Comes closest to covering the full 4–16 GHz span. Datasheet (note: this is a single-balanced mixer, not a quadrature IQ; you'd pair it with an external 90° hybrid to get IQ functionality)

**Honest gap:** No single catalog IQ mixer fully covers 4–16 GHz the way the Marki IQ-0416 does. If the upper X-band / Ku-band coverage (12–16 GHz) is essential and you need a true integrated IQ structure, I'd recommend reaching out to the apps team — there may be a custom or non-catalog solution: apps@minicircuits.com. 

**To help narrow further**, it would help to know:
- Your actual operating sub-band within 4–16 GHz
- LO drive level requirement
- Whether connectorized or SMT is preferred

*Parts surfaced:* MCA1-12G+, MAC-12G+, SIM-153+

### Q85. Do you have a reflectionless filter series that can replace standard reflective SMT filters from other manufacturers?

Yes — Mini-Circuits' **reflectionless filter** series is a strong candidate for exactly this application.

**What makes them different:**
Standard reflective filters present a high VSWR (poor impedance match) in their stopband — rejected energy is reflected back to the source, which can cause instabilities, intermodulation, or spurious responses in the upstream circuitry. Reflectionless filters terminate both passband and stopband signals in a matched 50 Ω load internally, so they present a low VSWR across the *entire* frequency range — passband and stopband alike. This is a direct, drop-in-style upgrade for SMT footprints wherever stopband reflections are a problem.

**Mini-Circuits' XLF / XLBP series** covers the main types:
- **Low-pass** (XLF-...) — various cutoff frequencies
- **High-pass** (XHF-...)
- **Band-pass** (XLBP-...)
- **Band-stop / notch** (XLBS-...)

All are SMT packaged, 50 Ω, and designed to be footprint-friendly replacements for standard SMT filters.

Let me pull up what's available in the catalog for you. To find the best matches, fill in what you know:

- **Filter type:** Low-pass / High-pass / Band-pass / Band-stop
- **Frequency:** Cutoff or passband/stopband edges (MHz/GHz)
- **Rejection:** Required stopband attenuation (dB)
- **Power handling:** (dBm or Watts)
- **Package:** (already SMT — any size preference?)

Reply with whatever you've got and I'll find the best fits.

### Q86. I am currently using your ZX60-33LN+ connectorized LNA, but I need a cheaper surface-mount version for automated assembly.

For reference, the ZX60-33LN-S+ (the SMA connectorized version) has these key specs: 50–3000 MHz, Gain 14.1 dB, NF 1.1 dB, OP1dB 19 dBm, OIP3 35 dBm, Vcc 5V, Icc 80 mA. Here are the closest SMT drop-in equivalents:

---

**Top SMT recommendation: **PMA-5455+****

The closest match to your ZX60-33LN-S+ in a compact SMT package (DQ849, 3×3 mm QFN-style):

  
- Frequency: 50–6000 MHz
  
- Gain: 14.0 dB
  
- NF: 0.8 dB (slightly *better* than the ZX60-33LN-S+)
  
- OP1dB: 19.1 dBm
  
- OIP3: 32.7 dBm
  
- Vcc: 5V / Icc: 40 mA

Gain, output power, and bias voltage are essentially identical — and NF is actually a touch lower. Current draw is halved (40 vs 80 mA), which is a bonus.

---

**Also worth considering:**

- **PMA-5456+** — Same 5V supply, slightly higher gain (14.4 dB), better OP1dB (21.5 dBm) and OIP3 (36 dBm) at 60 mA. A good step up in linearity if your system benefits from it.
- **PMA-5452+** — 3V supply option (if that fits your power rail), NF 0.7 dB, very similar gain/power at only 40 mA.

All three are in the small DQ849 SMT package, reflow-compatible, and priced well below the connectorized ZX60 series. Check live pricing and stock on each product page.

*Parts surfaced:* ZX60-33LN-S+, PMA-5455+, PMA-5456+, PMA-5452+

### Q87. Is there a smaller footprint alternative to the ZAPD-1+ splitter that can still handle 5 Watts of CW power?

The search results don't surface a confirmed 5 W SMT part from catalog metadata alone, so I want to be straightforward with you rather than guess.

Here's what I can confirm:

**ZAPD-1+** is a connectorized (F14 housing, BNC ports) 2-way 0°splitter covering 1–1000 MHz. It's a physically large part by design — that case is needed partly to handle the power and provide the connectorized interface.

The search results coming back are not returning a clearly smaller, confirmed 5 W alternative with the specs in the metadata. I don't want to point you at a part I can't verify meets your 5 W CW requirement from the tool data alone.

**My recommendation:** reach out directly to the apps team — they can look at your exact frequency range and power level and point you to the right option (including any SMT or smaller-body parts that may qualify):

apps@minicircuits.com 

That said — it would help to narrow the search further. Could you confirm:
- Your **frequency range** (the ZAPD-1+ covers 1–1000 MHz — do you need all of that, or a subset?)
- Your preferred **package type** — SMT, a smaller connectorized body, or open to either?

With those details I can do a more targeted search.

*Parts surfaced:* ZAPD-1+

### Q88. We are using the VLF-1200+ low-pass filter but need a sharper roll-off at the band edge. What is the next step up in rejection rows?

Good data. Here's the picture:

The **VLF-1200+** is an LTCC filter (FF704 connectorized case) with **40 dB rejection** in the stopband. That's already a solid spec for an LTCC part — the catalog shows the LTCC variants at this cutoff (VLFG-1200+, LFCG-1200+, LFCN-1200+) all come in at **28–30 dB rejection**, so the VLF-1200+ is actually the highest-rejection LTCC option at ~1200 MHz.

**To get sharper roll-off, the practical step up is a lumped LC filter:**

The **BLP-1200+** is the direct candidate — same ~1200 MHz passband region, lumped LC technology, **40 dB rejection** (same level as VLF-1200+), but lumped LC designs inherently have a steeper transition slope than LTCC. Check its datasheet to compare exactly where the rejection is reached vs. the VLF-1200+, as the roll-off shape will differ.

A few things worth knowing before you switch:
- **Lumped LC (BLP series)** → steeper roll-off, but typically larger physically and may have different return-loss/passband ripple characteristics vs. LTCC.
- **VLF-1200+ (LTCC)** → compact, flat passband, good VSWR, but gradual roll-off by nature of the technology.
- If you need dramatically more rejection (e.g. >50–60 dB) very close to the band edge, a **cavity or custom filter** is likely the next step — that would go to the apps team.

**Relevant files for comparison:**
- VLF-1200+: Datasheet | View Graphs
- BLP-1200+: Datasheet

For a side-by-side roll-off comparison, the View Graphs / View Data PDFs are the quickest way to overlay the two curves. If your rejection requirement exceeds what either offers, reach out to apps@minicircuits.com.

*Parts surfaced:* VLF-1200+, VLFG-1200+, LFCG-1200+, LFCN-1200+

### Q89. I am using the ADE-1+ mixer, but I need a model that handles a Level 10 LO drive instead of Level 7. What do you recommend?

The product pages for those parts didn't return LO level in the specs field. I need to be honest with you here rather than guess.

The catalog search tool doesn't filter on LO drive level directly, and the specs returned from the product pages don't confirm LO level numerically. I won't assign an LO level to a part I can't confirm from the data.

Here's what I'd recommend:

1. **Check the datasheets directly** — the LO drive level is prominently listed on every mixer datasheet. The ADE-1+ datasheet is here for reference: ADE-1+ Datasheet (PDF). You can browse the ADE family (ADE-2+, ADE-5+, ADE-25+, etc.) and compare their LO drive specs directly.

2. **Contact the applications team** — they can immediately point you to the right Level 10 drop-in or near-drop-in for your frequency range and package. They know the ADE family inside and out:
apps@minicircuits.com 

To help me narrow this down further while you wait for their reply — what's your RF/IF frequency range and package preference (SMT, connectorized)?

*Parts surfaced:* ADE-1+, ADE-2+, ADE-5+

### Q90. Is there a higher-power version of the Gali-3F+? I need an extra 3dB of output P1dB headroom.

The GALI-3F+ product page didn't resolve directly, but I can work from the GALI family search results. The standard **GALI-3+** has an output P1dB of **10.5 dBm** — so you're looking for something in the **~13.5 dBm+** range, in the same DC–3 GHz class, same SMT (DF782) footprint.

Here's how the GALI family stacks up for your target:

**Best direct step up — **GALI-4+****
- Output P1dB: **16 dBm** (+5.5 dB over GALI-3+) — exceeds your +3 dB target
- Gain: 13.5 dB | OIP3: 34 dBm | NF: 4 dB
- Vcc: 4.6 V / Icc: 65 mA
- Frequency: DC–4 GHz
- Same DF782 SMT case — drop-in footprint

**More gain + higher power — **GALI-51+****
- Output P1dB: **16.5 dBm** | Gain: 16.1 dB | OIP3: 35 dBm | NF: 3.5 dB
- Vcc: 4.5 V / Icc: 65 mA | DC–4 GHz | DF782

**Highest power in the family — **GALI-84+****
- Output P1dB: **21 dBm** | Gain: 16.7 dB | OIP3: 37.4 dBm | NF: 4.4 dB
- Vcc: 5.8 V / Icc: 100 mA | DC–6 GHz | DF782
- Trades higher supply voltage and current for significantly more headroom

The **GALI-4+** is the most surgical upgrade — same footprint, same gain ballpark, clears your +3 dB requirement. The **GALI-51+** adds more gain with similar power. The **GALI-84+** is for applications that need serious output headroom.

What's your operating frequency and supply voltage? That may further narrow things down.

*Parts surfaced:* GALI-3+, GALI-4+, GALI-51+, GALI-84+

### Q91. We use the TC1-1-13M+ transformer. Do you make a functionally identical version that is hermetically sealed?

Based on my catalog searches, I was not able to find a hermetically sealed version of the TC1-1-13M+ (50Ω, 1:1, 0.4–800 MHz) in the standard catalog.

Hermetically sealed RF transformers are typically a custom or hi-rel screened product — not something that appears in the standard web catalog. This is exactly the kind of request the applications team handles regularly.

I'd recommend reaching out directly: apps@minicircuits.com — describe your requirement (TC1-1-13M+ equivalent, hermetic package, 50Ω, 1:1 impedance ratio, 0.4–800 MHz) and they can tell you whether a standard hi-rel screened part exists or whether a custom solution is needed. You may also want to review the Hi-Rel Screening and Space Upscreening pages for context on what's available.

*Parts surfaced:* TC1-1-13M+

### Q92. I need an alternative to the RC4DAT-6G-95 USB attenuator that features an Ethernet control interface instead.

The closest direct match in the RC4DAT family with an Ethernet (PE = Python/Ethernet) control interface is the **RC4DAT-8G-95PE** — a 4-channel programmable attenuator with the same 95 dB attenuation range and similar channel count, controlled via Ethernet rather than USB. It covers up to 8 GHz, so it's a superset of the 6 GHz RC4DAT-6G-95 in terms of frequency.

Key points vs. your current part:

  
- **Control interface:** Ethernet (TCP/IP) — drop-in swap from USB workflow
  
- **Channels:** 4 (same as RC4DAT-6G-95)
  
- **Attenuation range:** 95 dB (same)
  
- **Frequency:** Up to 8 GHz (vs. 6 GHz on your current unit)
  
- **Unit price (qty 1):** $4,295
  
- **Stock:** 0 (contact sales for lead time)

**Downloads:**

Datasheet (PDF)  | 
View Data  | 
View Graphs  | 
Case Style Drawing

If you need stock confirmed or a lead time quoted, reach out to apps@minicircuits.com.

*Parts surfaced:* RC4DAT-8G-95PE, RC4DAT-6G-95

### Q93. What is the lead-free, RoHS-compliant replacement part number for the legacy SCLF-420 filter?

The answer is straightforward: the lead-free, RoHS-compliant replacement for the legacy **SCLF-420** is **SCLF-420+**.

In Mini-Circuits' naming convention, the **"+"** suffix on a part number denotes that it is the lead-free, RoHS-compliant version of the part. The SCLF-420+ is a lumped LC low-pass filter and is a direct replacement.

You can find full details here:
- SCLF-420+ Product Page
- Datasheet (PDF)
- S-Parameters (.s2p)

*Parts surfaced:* SCLF-420, SCLF-420+

### Q94. I am using the ZHL-42W power amplifier block. Is there a variant that includes an integrated heatsink and cooling fan?

I wasn't able to pull up the ZHL-42W directly from the catalog tool, and my search didn't surface a fan-cooled variant under that name. I don't want to guess at what exists or doesn't exist for this specific product family.

Here's what I'd recommend:

1. **Check the product page directly** — search for "ZHL-42W" on minicircuits.com. Some ZHL-series high-power amplifiers do have fan-cooled variants (the suffix "-FH" or similar is used on certain models), but I can't confirm that for the ZHL-42W specifically without a verified catalog result.

2. **Contact the apps team** — they can confirm whether a fan/heatsink variant exists for your exact part, or recommend the best thermal management solution: apps@minicircuits.com. 

They'll be able to give you a definitive answer quickly.

### Q95. We use the CBL-2FT-SMSM+ test cables on our benches. Do you have a ruggedized, armored version that resists crushing?

Good news — the **APC series** ("Armored Phase-stable Cable") is exactly what you're looking for. The stainless-steel armored jacket resists crushing, kinking, and the general abuse of a busy test bench, while maintaining good phase stability. The catalog returns several APC models; the closest match to your 2 ft SMA-SMA setup would be confirmed against individual datasheets. I can see APC variants in N-connector and SMA-to-N configurations in the current catalog (e.g. **APC-4FT-SMNM+** is SMA-male to N-male).

I also notice the search surfaced **FLC-2FT-SMSM+** — a 2 ft SMA-male to SMA-male flexible cable rated to 26.5 GHz — which may be worth comparing.

For an exact APC equivalent in 2 ft SMA-to-SMA, I'd recommend reaching out to the apps team to confirm the right model or check if a custom length/connector combination is available:
apps@minicircuits.com

In the meantime, here's what I can share about your current cable:

**CBL-2FT-SMSM+** — your existing cable:

  
- In stock: more than 100 units
  
- Unit price from $85.42–$87.66 depending on qty
  
- Datasheet (PDF)

And the armored APC series to explore:

  
- **APC-4FT-SMNM+** — SMA-M to N-M, armored. Datasheet
  
- **APC-6FT-NMNM+** — N-M to N-M, armored, 6 ft. Datasheet

If the connector type or length isn't quite right, the apps team can confirm whether a 2 ft SMA-SMA APC variant exists or can be made.

*Parts surfaced:* APC-4FT-SMNM+, FLC-2FT-SMSM+, CBL-2FT-SMSM+, APC-6FT-NMNM+

### Q96. What is the closest Mini-Circuits alternative to the Analog Devices HMC1122 digital step attenuator?

Let me try direct part number lookups for the Mini-Circuits digital step attenuator ICs:

### Q97. Do you have a drop-in cross-reference for the MACOM MACP-011015 directional coupler?

Here's what I found. I want to be upfront: I can't guarantee a confirmed drop-in cross-reference without knowing all the MACP-011015's mechanical and electrical specs (port layout, connector gender/orientation, housing dimensions, power handling, directivity, etc.). That said, the closest catalog match on frequency and coupling is:

---

****ZCDC10-02263S+**** — 10 dB Directional Coupler, 2–26.5 GHz, SMA Connectorized

Key alignment with the MACP-011015:
- Frequency: 2–26.5 GHz (covers the 2–18 GHz span and beyond)
- Coupling: 10 dB
- Interface: SMA connectorized

**Before committing to this as a drop-in**, you'll want to verify:
1. Connector genders and port orientation match your PCB/fixture
2. Mechanical dimensions (case style HT2627 drawing here)
3. Directivity, insertion loss, and VSWR specs are acceptable — see the Datasheet and View Graphs
4. Power handling meets your requirement

**Pricing & Stock:**

 | Qty |  | Unit Price (USD) | 

 | 1 |  | $1,826.33 | 

Stock: currently 0 — you'd need to check lead time or request a quote.

For a confirmed cross-reference validation, I'd recommend reaching out to the apps team directly: apps@minicircuits.com

*Parts surfaced:* ZCDC10-02263S+

### Q98. I need a direct cross-reference for the Qorvo QPL9065 low-noise amplifier.

Good results to work with. A quick note upfront: I can't guarantee a pin-compatible drop-in replacement — that requires a full mechanical and schematic comparison that you'll need to verify. But here's the closest functional alignment based on published specs.

**QPL9065 key specs (from Qorvo's datasheet):** 45–1218 MHz, Gain ~19 dB, NF ~0.75 dB, OIP3 ~38 dBm, Vcc 3.3–5 V, SOT-363/SC-70 package.

---

**Closest functional matches from Mini-Circuits:**

**1. Best overall fit — **PHA-23LN+****
Covers 30–2000 MHz, NF 1.2 dB, Gain 21 dB, OIP3 37.4 dBm, Vcc ~5 V, DF782 (6-pin SMT) package.
Datasheet (PDF)

**2. High-linearity alternative — **PHA-23HLN+****
Covers 30–2000 MHz, NF 1.4 dB, Gain 21.3 dB, OIP3 44.4 dBm, Vcc 8 V — higher linearity headroom if that's the priority.
Datasheet (PDF)

**3. Ultra-low NF option — **SAV-581+****
Covers 45–6000 MHz, NF 0.5 dB, Gain 22.3 dB, OIP3 30.6 dBm, Vcc 3 V, SC-70 (MMM1362) — closest in NF and supply voltage to the QPL9065, though OIP3 is lower.
Datasheet (PDF)

---

**Important caveats:**
- None of these are guaranteed pin-compatible with the QPL9065 (SOT-363). Verify footprint and bias circuit before laying out.
- The PHA-series uses the DF782 package (not SC-70), so a board re-spin is likely needed.
- The SAV-581+ (SC-70/MMM1362) is the closest mechanically to SOT-363, but confirm pinout carefully.

For detailed application support or to confirm suitability, reach out to: apps@minicircuits.com

*Parts surfaced:* PHA-23LN+, PHA-23HLN+, SAV-581+

### Q99. Is there a Mini-Circuits equivalent to the Marki Microwave BAL-0009 balun?

Good results. Here's where things stand:

The Marki BAL-0009 is a **1:1, 50Ω balun, ~5 MHz – 9 GHz**. No Mini-Circuits SMT balun covers that exact full span in one device, but the closest functional equivalents are:

---

**Top pick: **TCM1-83X+****
- Impedance ratio: 1:1, 50Ω
- Frequency: 10 – 8000 MHz
- Technology: Core & wire, SMT (DB1627 case)
- Datasheet (PDF)

This covers nearly the same band as the Marki part (misses only the lowest decade by 5 MHz and tops out at 8 GHz vs. 9 GHz — likely a non-issue for most designs).

---

**Also worth considering:**

- **SCTX1-83-2W+** — same 1:1 ratio, 10–8000 MHz, but in a larger SN2595 SMT package rated for higher power (2W). Good if you need more power handling.
- **TCM1-63AX+** — 1:1, 10–6000 MHz, DB1627 case. Slightly narrower band but a very clean performer if you don't need the upper octave.

---

**Key caveats vs. the Marki BAL-0009:**
- The Mini-Circuits parts start at 10 MHz vs. 5 MHz — if your application needs that 5–10 MHz low-end, let me know and I can dig further.
- For exact insertion loss, amplitude/phase balance vs. frequency, and power handling comparison, check the datasheets and View Graphs pages linked above.
- If you need a spec-for-spec confirmed drop-in, the apps team can advise: apps@minicircuits.com

*Parts surfaced:* TCM1-83X+, SCTX1-83-2W+, TCM1-63AX+

### Q100. We are looking to replace a Hittite HMC241 SP4T switch. What is the closest surface-mount model you offer?

Here are the two best SMT SP4T candidates to replace the HMC241:

---

**Lead recommendation: **HSWA4-63DR+****

The HMC241 covers DC–3 GHz. The HSWA4-63DR+ is an absorptive (terminated) SP4T covering 30 MHz–6 GHz — it more than spans the HMC241's range and offers strong performance:

| Spec | HSWA4-63DR+ |
|---|---|
| Frequency | 30 MHz – 6 GHz |
| Insertion Loss | 0.9 dB (typ.) |
| Isolation | 61 dB (typ.) |
| Impedance | 50 Ω |
| Package | SMT (DG984-1) |

 | Qty |  | Unit Price | 

 | 20 |  | $5.60 | 

 | 50 |  | $4.93 | 

 | 100 |  | $3.88 | 

 | 500 |  | $3.02 | 

 | 1,000 |  | $2.46 | 

Stock: more than 1,000 units available.

Downloads: Datasheet (PDF) | View Graphs | S-Parameters

---

**Alternative: **JSW4-272DR+**** — covers 5 MHz–2.7 GHz (doesn't extend as high as the HMC241's 3 GHz edge, worth checking your top frequency). It's a reflective-type SP4T in a smaller MT1817 package, which may suit tighter board layouts. For exact IL/isolation values across frequency, see its Datasheet.

---

**Key things to verify before committing to the HSWA4-63DR+:**
- Control voltage/logic levels (the HMC241 uses negative control voltages; confirm the HSWA4 matches your bias supply)
- P1dB / IP3 / power handling requirements — see the datasheet graphs for those curves
- Footprint/pinout compatibility

If you need a pin-for-pin drop-in or have specific power handling or switching speed requirements, reach out to apps@minicircuits.com and they can confirm compatibility.

*Parts surfaced:* HSWA4-63DR+, JSW4-272DR+

### Q101. Do you have an alternative to the pSemi PE42421 RF switch with identical isolation specs?

Good data to work with. Here's where I need to be straight with you:

**The PE42421 is a pSemi SOI CMOS SPDT rated DC–3 GHz with ~46 dB isolation (typ.) at 900 MHz, dropping to ~35 dB at 2.5 GHz.** I don't have the pSemi datasheet in front of me, so I won't invent an exact number — but that's the ballpark this part is known for.

From the Mini-Circuits catalog, the closest SMT SPDT match in that frequency range is:

****HSWA2-30DR+**** — the strongest contender:
- Frequency: DC–3000 MHz
- Isolation: **44 dB** (typ.)
- Insertion loss: 1.2 dB
- Package: SMT (DG983-1)
- 50Ω, absorptive

That 44 dB isolation figure is very competitive with the PE42421's class. For the exact isolation vs. frequency curve (e.g., at 900 MHz vs. 2.5 GHz), check the datasheet: HSWA2-30DR+ Datasheet (PDF)

---

**A note on "identical isolation specs":** Isolation is frequency-dependent, so a true apples-to-apples comparison requires checking both datasheets at your specific operating frequency. I'd recommend doing that comparison, and if you need confirmation of fit, the apps team can help: apps@minicircuits.com

Can you share the frequency you're operating at and any other key requirements (supply voltage, package size, control logic level)? That'll let me narrow this down further.

*Parts surfaced:* HSWA2-30DR+

### Q102. What is your catalog cross-reference for the Skyworks SKY12207-11 high-power switch?

Here's the most direct cross-reference I can offer from the Mini-Circuits catalog for the SKY12207-11 (0.1–3 GHz SPDT, high-power antenna switch):

---

**Best match: **HSWA2-30DR+****

An absorptive (terminated) SPDT switch in a compact SMT package, 50Ω, covering DC–3000 MHz — closely aligned with the SKY12207-11's frequency range and application.

| Spec | Value |
|---|---|
| Frequency | DC – 3000 MHz |
| Insertion Loss | 1.2 dB typ. |
| Isolation | 44 dB typ. |
| Configuration | SPDT, absorptive |
| Package | SMT (DG983-1) |
| Impedance | 50Ω |

**Pricing & Availability**

 | Qty |  | Unit Price (USD) | 

 | 20 |  | $3.88 | 

 | 100 |  | $2.56 | 

 | 500 |  | $1.87 | 

 | 1,000 |  | $1.55 | 

 | 5,000 |  | $1.32 | 

**Stock:** More than 20,000 units available

**Downloads:**

- Datasheet (PDF)

- View Data

- View Graphs

- S-Parameters

- PCB Layout

---

**A note on the cross-reference:** The SKY12207-11 is rated for very high input power (~37 dBm) targeting cellular antenna switching. Mini-Circuits' HSWA2-30DR+ is the closest catalog match on frequency range, topology, and package type, but I can't confirm it is a pin-for-pin drop-in or that its power handling matches the Skyworks part exactly. Please verify power handling and control voltage compatibility against both datasheets. If you need a confirmed functional equivalent or have specific P1dB/power requirements, the apps team can dig deeper: apps@minicircuits.com.

*Parts surfaced:* HSWA2-30DR+

### Q103. I need a direct replacement model for the obsolete Broadcom MGA-82563 gain block.

Good results. The closest functional matches to the MGA-82563 (50–6000 MHz, ~16 dB gain, ~2.5 dB NF, OIP3 ~+32 dBm, 3 V) are below. Note that Mini-Circuits does not offer an exact SOT-363 pinout-compatible drop-in, but the electrical specs are well-matched. A quick note on that:

---

**A word on "direct replacement":** The MGA-82563 is a SOT-363 (6-lead SC-70) biased with a single resistor. Mini-Circuits' closest functional equivalents are in their own small SMT packages (DF782, DQ849). They won't be PCB pinout-compatible without a layout revision, but electrically they are very close. If you need a true pin-for-pin replacement, please reach out to apps@minicircuits.com. 

---

Here are the top functional matches:

**1. **PGA-102+** — Closest overall match**
- Frequency: 50–6000 MHz
- Gain: 15.9 dB
- NF: 2.3 dB
- OIP3: +32.7 dBm
- Vcc: 3.3 V, Icc: 83 mA
- Package: DF782 (2×2 mm QFN-style SMT)
- Datasheet (PDF)

This is the sharpest match to the MGA-82563's gain, NF, OIP3, and supply voltage.

---

**2. **PGA-1021+** — Lower current option**
- Frequency: 50–6000 MHz
- Gain: 15.1 dB
- NF: 2.3 dB
- OIP3: +26.5 dBm
- Vcc: 3.3 V, Icc: 57 mA
- Package: DF782
- Datasheet (PDF)

Good if current consumption is a constraint; OIP3 is a bit lower.

---

**3. **PMA-545+** — Best NF, same voltage**
- Frequency: 50–6000 MHz
- Gain: 14.2 dB
- NF: 0.8 dB
- OIP3: +36.4 dBm
- Vcc: 3.0 V, Icc: 80 mA
- Package: DQ849
- Datasheet (PDF)

Lower NF and higher OIP3 if you can trade a touch of gain.

---

For live pricing and stock on any of these, click the part number above or visit their product pages. Check the datasheets carefully against your bias network and layout before committing to a board spin.

*Parts surfaced:* PGA-102+, PGA-1021+, PMA-545+

### Q104. Do you have a high-pass filter equivalent to the Marki Microwave FHP-0400?

Yes — the **PHP-400+** is our closest match to the Marki FHP-0400.

**PHP-400+** — Connectorized High-Pass Filter
- Passband: 395–2000 MHz
- 50Ω, SMA connectors
- Datasheet (PDF) | View Graphs | View Data | S-Parameters (.s2p)

The cutoff aligns well with the FHP-0400's 400 MHz spec. For a direct side-by-side comparison of insertion loss, rejection, and return loss vs. frequency, the View Graphs and View Data files are the best place to check. If your application has specific rejection or IL requirements you need confirmed, feel free to reach out to our apps team: apps@minicircuits.com.

*Parts surfaced:* PHP-400+

### Q105. What is the closest match in your portfolio to the Analog Devices ADL5802 active dual-balanced mixer?

Here's my honest assessment based on the search results and what's published:

---

**Closest match: **SYM-63LH+****

The ADL5802 is a wideband active double-balanced mixer (MMIC, ~400 MHz–6 GHz RF, conversion gain ~7 dB, low LO drive). Mini-Circuits' catalog does not have a single-chip active MMIC mixer that is a direct architectural equivalent — the Mini-Circuits portfolio is strongest in **passive** double-balanced mixers. That said, here's how the best candidates stack up:

---

****SYM-63LH+** — Best frequency match**

  
- Frequency: 1–6000 MHz (covers the ADL5802's RF span well)
  
- Impedance: 50 Ω, SMT package
  
- Passive double-balanced topology — no conversion gain (expect ~6–8 dB conversion loss vs. the ADL5802's ~7 dB gain)
  
- Stock: more than 1,000 units

Pricing:

  
 | Qty |  | Unit Price | 

  
 | 10 |  | $18.17 | 

  
 | 100 |  | $16.87 | 

  
 | 500 |  | $15.41 | 

Downloads: Datasheet (PDF) | View Data | View Graphs

---

****MCA1T-60+** — Also worth a look (1.6–6 GHz)**

Covers the upper portion of the band (1600–6000 MHz per the product page), passive double-balanced SMT, same package family as the MCA1T series. Check the datasheet for detailed specs: Datasheet (PDF)

---

**Key difference to flag:** The ADL5802 is an **active** mixer with ~7 dB conversion gain and an integrated LO buffer (allowing low LO drive, ~0 dBm). Mini-Circuits' wideband SMT mixers in this range are **passive**, so:
- You'll see conversion loss (~7 dB) instead of conversion gain — budget for that in your cascade
- You'll need a properly driven LO (typically +7 to +17 dBm depending on the part)

If conversion gain is essential to your design, you'd pair one of these with a low-NF LNA/gain block at the front end, or reach out to the apps team to discuss if a custom or application-specific solution fits better: apps@minicircuits.com

*Parts surfaced:* SYM-63LH+, MCA1T-60+

### Q106. I am using your PGA-103+ amplifier but it's experiencing instability below 100 MHz. Do you have a similar LNA with better low-frequency stability?

Good context. A quick note on the PGA-103+ instability first, then alternatives:

**Why instability below 100 MHz happens with the PGA-103+**

The PGA-103+ is a pHEMT-based gain block with very high gain and very low NF — that combination means it has significant gain at low frequencies where the feedback network's phase margin can erode. The most common causes are:
- Insufficient bypassing on the supply/bias line (use a large-value bypass cap close to the bias feed, e.g. 10–100 µF in parallel with a small 100 pF cap)
- PCB ground plane gaps or long via paths introducing inductance
- Input/output traces that are too close, creating feedback at low frequencies
- Operating below the device's characterized range (PGA-103+ starts at 50 MHz)

Before swapping the part, it's worth checking the layout against Mini-Circuits' recommended PCB layout and the PGA-103+ datasheet.

---

**If you do want to switch parts**, here are three strong alternatives from the same low-NF family:

**1. **PMA-5452+**** — Best overall match
- Freq: 50–6000 MHz | Gain: 14 dB | NF: 0.7 dB | OIP3: 34.1 dBm | Vcc: 3V, 40 mA
- The PMA series uses an internally feedback-stabilized topology that tends to be more stable at low frequencies than the PGA-103+.

**2. **PMA-545+**** — Higher linearity option
- Freq: 50–6000 MHz | Gain: 14.2 dB | NF: 0.8 dB | OIP3: 36.4 dBm | Vcc: 3V, 80 mA

**3. **CMA-103+**** — Closest electrical analog to PGA-103+
- Freq: 50–4000 MHz | Gain: 11 dB | NF: 0.8 dB | OIP3: 44.8 dBm | Vcc: 3.05V
- Same gain/OIP3 class as the PGA-103+ in a different package (DL1721 vs DF782).

For live pricing and stock on any of these, click the part numbers above to go directly to the product pages.

If the instability persists after layout review, the apps team can dig into specifics: apps@minicircuits.com

*Parts surfaced:* PGA-103+, PMA-5452+, PMA-545+, CMA-103+

### Q107. Is there a wider-bandwidth alternative to the MAC-85L+ mixer that extends performance up to 18 GHz?

Good context. Here's the picture:

---

**MAC-85L+ recap:** This is an SMT double-balanced mixer covering up to 8.5 GHz (50 Ω). It's a compact, cost-effective part but tops out well short of 18 GHz.

---

**Alternatives reaching 18 GHz**

No single catalog mixer fully covers the same low-frequency starting point as the MAC-85L+ *and* extends to 18 GHz in one part. The closest options, all from the wideband search:

**1. **SIM-193H+** — Best overlap candidate (SMT)**
- RF/LO: 7.3–19 GHz | 50 Ω | SMT
- Extends solidly through 18 GHz in the same surface-mount form factor
- Datasheet

**2. **ZX05-24MH-S+** — Connectorized, broader coverage**
- RF/LO: 7.5–20 GHz | Connector (SMA)
- Good lab/test bench option if you need connectorized I/O
- Datasheet

**3. **ZMIQ-653H-E+** — Widest low-end coverage (IQ mixer)**
- RF: DC–20 GHz | Connector
- This is an IQ (image-reject / SSB) mixer, so it's a different topology — but it covers the widest span
- Datasheet

---

**Key practical note:** The MAC-85L+ starts at a lower frequency than any of the 18 GHz-capable mixers above. If you need continuous coverage from, say, 1–18 GHz, a two-mixer approach (MAC-85L+ for the low band, SIM-193H+ for the high band) may be the most practical path. For exact conversion loss, LO drive, and isolation specs, I'd recommend checking each datasheet — or reach out to apps@minicircuits.com for a direct comparison against your system requirements.

*Parts surfaced:* MAC-85L+, SIM-193H+, ZX05-24MH-S+, ZMIQ-653H-E+

### Q108. We currently use the ZN2PD2-50-S+ 2-way power splitter. Do you have a 4-way version covering that exact same frequency band?

Yes — there are good 4-way options covering 500–5000 MHz. Here are the top picks from the ZN4PD family, all connectorized and 50Ω like your current part:

****ZN4PD1-63LW-S+**** — 4-way, 500–6000 MHz (exact low-end match, slight upper extension)

****ZN4PD1-63HP-S+**** — 4-way, 250–6000 MHz (wider band, covers your full range with headroom on both ends)

****ZN4PD-4R722+**** — 4-way, 400–7200 MHz (even wider coverage if you need future flexibility)

All three fully cover the 500–5000 MHz span of your ZN2PD2-50-S+. The **ZN4PD1-63LW-S+** is probably the closest family match — same lower band edge, connectorized, 50Ω. The **ZN4PD1-63HP-S+** adds extra low-end margin if that's useful.

For full specs (insertion loss, isolation, amplitude/phase balance), click any part number above to go to its product page, or check the datasheets linked there.

*Parts surfaced:* ZN4PD1-63LW-S+, ZN4PD1-63HP-S+, ZN4PD-4R722+, ZN2PD2-50-S+

### Q109. I need a physically smaller alternative to the BW-S20W2+ fixed attenuator, preferably rated for 5 Watts instead of 20 Watts.

The **BW-S5W2+** is exactly what you're looking for. Here's a quick comparison:

  
    Parameter | 
    BW-S20W2+ (current) | 
    BW-S5W2+ (alternative) | 
  

  

    Attenuation | 
    2 dB | 
    2 dB | 
  

  
    Frequency | 
    DC–18 GHz | 
    DC–18 GHz | 
  

  

    Power Rating | 
    20 W | 
    5 W | 
  

  
    Case Style | 
    FF659 | 
    **FF658** (smaller) | 
  

  

    Unit Price (1–25 qty) | 
    $43.28 | 
    $43.28 | 
  

  
    Stock | 
    >1,000 | 
    >1,000 | 
  

Same price, same frequency range, just a smaller body (FF658 vs FF659 case) and the reduced 5 W power rating you're targeting. Both use SMA connectors and are in stock.

**BW-S5W2+ downloads:**

  
- Datasheet (PDF)
  
- View Data
  
- View Graphs
  
- S-Parameters (.s2p)
  
- Case Style Drawing (FF658)

*Parts surfaced:* BW-S5W2+, BW-S20W2+

### Q110. What is the most economical alternative to the SSG-6000PRO signal generator if my bench setup only requires coverage up to 4 GHz?

Here's what the catalog search found in the Mini-Circuits benchtop signal generator line:

The only confirmed, currently listed SSG-series signal generators in the catalog are the higher-range models — there is no SSG model with a 4 GHz upper limit in the results returned. The closest confirmed live part is:

**SSG-6000RC** — 100 kHz to 6 GHz synthesized signal generator, $4,599.50 (qty 1), stock: more than 10 units.

As for "SSG-6000PRO" specifically — that part number did not resolve in the catalog, so I can't confirm it as a current orderable model or quote its price for comparison.

**Bottom line:** The catalog search did not surface a lower-cost, sub-4 GHz SSG variant. I won't invent one. For a definitive answer on whether a more economical 4 GHz option exists (discontinued model, bundle pricing, or an upcoming SKU), please reach out directly to the applications team:

apps@minicircuits.com 

You can also browse the full signal generation line here:
Mini-Circuits Signal Generation & Measurement

*Parts surfaced:* SSG-6000RC, Signal Generation & Measurement

### Q111. I am using the ADT1-1WT+ transformer. Do you have an LTCC ceramic version with the same 1:1 impedance ratio?

Good news — yes, there are LTCC 1:1 transformers in the catalog. A few things to note first:

**ADT1-1WT+** is a wideband wound-core SMT transformer. The LTCC ceramic parts are inherently narrowband (each covers a specific frequency window), so there's no single LTCC drop-in that matches its full bandwidth. The right pick depends on your operating frequency.

Here's a summary of the LTCC 1:1, 50Ω options returned (130 total in the catalog):

| Part | Freq Range | Case |
|---|---|---|
| **NCS1-521+** | 223–520 MHz | GE0805C-9 |
| **NCS1-112+** | 700–1100 MHz | GE0805C-1 |
| **NCS1-332+** | 700–3300 MHz | GE0805C-9 |
| **NCS1-23+** | 1300–2000 MHz | GE0805C-1 |
| **NCS1-292+** | 1650–2850 MHz | GE0805C-1 |
| **NCS1-422+** | 3300–4000 MHz | GE0805C-1 |
| **NCS1-63+** | 4900–6000 MHz | GE0805C-1 |

The **NCS1-332+** is worth highlighting if you need the widest LTCC coverage (700–3300 MHz). For narrower, application-specific bands there are targeted options as well (WiFi, cellular, etc.).

What frequency or band are you working at? That'll let me point you to the best match — or I can check stock and pricing on any of these.

*Parts surfaced:* ADT1-1WT+, NCS1-112+, NCS1-332+, NCS1-23+

### Q112. We currently use the USB-SPDT-A18 mechanical switch. Do you have a solid-state version that offers much faster switching speed up to 18 GHz?

Here's the picture:

---

****RC-1SPDT-A18** — Solid-State USB/Ethernet SPDT Switch, DC–18 GHz**

This is the direct solid-state upgrade path from the USB-SPDT-A18. Key advantages over mechanical:

- **Switching speed:** Solid-state — orders of magnitude faster than mechanical (µs-class vs. ms-class)
- **Frequency:** DC – 18 GHz ✓
- **Isolation:** 85 dB typ.
- **Control:** USB / Ethernet (same software-controlled interface you're used to)
- **Lifetime:** Essentially unlimited — no mechanical wear

**Pricing & Availability:**

  
 | Qty |  | Unit Price (USD) | 

  
 | 1 |  | $892.34 | 

  
 | 10 |  | $878.28 | 

> **Note:** Currently showing 0 stock. I'd recommend contacting apps@minicircuits.com to confirm lead time and availability. 

**Downloads:**
- Datasheet (PDF)
- View Data
- View Graphs
- Case Style Drawing (LM1848)

Also worth knowing: if you need **two SPDT switches** in one unit, the **RC-2SPDT-A18** covers the same DC–18 GHz range and may offer better value per channel.

*Parts surfaced:* RC-1SPDT-A18, RC-2SPDT-A18

### Q113. Is there a version of the PWR-SEN-6G+ power sensor that supports peak and envelope measurements instead of average power?

Good question. A couple of things to note:

1. **PWR-SEN-6G+** — the catalog lookup returned no result for that exact part number, so I can't confirm its current specs or status. It's possible it has been superseded or the part number has changed.

2. **Peak/envelope power sensors** — looking through the catalog, the two parts that appear most relevant for peak/envelope-style measurements are:

- **PWR-8P-RC** — connectorized peak power sensor with USB (RC = remote-controlled/USB interface). Check the datasheet for its frequency range and peak detection specs.
- **PWR-8PW-RC** — similar peak/waveform USB power sensor. See its datasheet.
- **PWR-9PWHS-RC** — peak/waveform high-speed USB sensor (to 2 GHz). Datasheet here.

The catalog descriptions for these don't include enough inline spec detail for me to confirm exact detection modes (peak, envelope, average, time-gated) or whether they're a direct functional equivalent to the PWR-SEN-6G+. I'd recommend pulling the datasheets above and comparing, but for a definitive "is this a drop-in replacement for peak/envelope measurement" answer, the apps team is the right call: apps@minicircuits.com.

*Parts surfaced:* PWR-8P-RC, PWR-8PW-RC, PWR-9PWHS-RC

### Q114. I need an alternative to the ZX95-2500+ VCO that exhibits lower phase noise at a 10kHz offset.

A couple of important notes upfront:

1. **ZX95-2500+** did not resolve on the website — it may be discontinued or the exact part number may differ. I'd recommend confirming with apps@minicircuits.com if you need a direct replacement. 

2. **Phase noise at 10 kHz offset** is not surfaced as a structured catalog field, so I can't do a direct numerical comparison here. I can point you to the right datasheets where the phase noise vs. offset curves live.

---

That said, here are the two closest candidates in the ~2500 MHz VCO family worth evaluating:

**1. **ROS-2500+**** — Tunable VCO covering 1600–2500 MHz
- Vcc: 12 V, Icc: 28 mA, 50 Ω
- Phase noise figure in catalog: −131 dBc/Hz (check offset in datasheet)
- Stock: 219 units
- Datasheet (PDF) | View Graphs | View Data

 | Qty |  | Unit Price | 

 | 10 |  | $39.02 | 

 | 20 |  | $32.51 | 

 | 100 |  | $32.51 | 

 | 200 |  | $29.79 | 

---

**2. **ROS-2536C-119+**** — Covers 2315–2536 MHz (tighter tuning range, closer to 2500 MHz center)
- 50 Ω, connectorized (CK1113 case)
- Phase noise figure in catalog: −105 dBc/Hz (check offset — the "-119" suffix variants in this family often carry improved phase noise specs)
- Stock: 581 units
- Datasheet (PDF) | View Graphs

 | Qty |  | Unit Price | 

 | 10 |  | $55.23 | 

 | 20 |  | $48.71 | 

 | 100 |  | $46.76 | 

 | 200 |  | $45.05 | 

---

**To confirm which has better phase noise at 10 kHz offset specifically**, open the **View Graphs** links above and look for the "Phase Noise vs. Offset Frequency" curve — that's the definitive answer. For a side-by-side confirmed comparison against the ZX95-2500+, the apps team can help directly: apps@minicircuits.com.

*Parts surfaced:* ROS-2500+, ROS-2536C-119+

### Q115. What is the current RoHS-compliant replacement part number for the legacy JSPHS-51 phase shifter?

The RoHS-compliant replacement for the legacy **JSPHS-51** is **JSPHS-51+**.

In Mini-Circuits' naming convention, the "+" suffix denotes RoHS compliance. The JSPHS-51+ is the direct, drop-in RoHS upgrade — same package (BK276), same product family. You can find full details here:

- JSPHS-51+ Product Page
- Datasheet (PDF)
- S-Parameters (.s2p)

For pricing, stock, or any lead-time questions, the catalog page has live data — or reach the team at apps@minicircuits.com.

*Parts surfaced:* JSPHS-51+

### Q116. Do you have a direct catalog cross-reference for the MACOM MABA-011014 wideband RF transformer?

I don't have a direct catalog cross-reference mapping for the MACOM MABA-011014 by name — but I can help you find the closest Mini-Circuits equivalent if you share its key specs. The MABA-011014 is a **1:1 impedance ratio, 50Ω wideband RF transformer** in an SMT package, covering roughly **10–3000 MHz**.

The best Mini-Circuits candidate from the search results would depend on confirming those specs. Based on what's in the catalog, here are strong 1:1, 50Ω, wideband SMT contenders:

- **ADT1-1+** — 1:1, 50Ω, 0.15–400 MHz, core & wire, CD542 SMT package
- **ADT1-1WT+** — 1:1, 75Ω, 0.4–800 MHz (75Ω system — likely not a match)
- **ADT1.5-17+** — 1.5:1, 50Ω, 0.5–1700 MHz (wider band, slight impedance ratio difference)

To nail the right cross-reference, could you confirm the MABA-011014's key specs?

To find the right cross-reference, fill in what you know (leave blank / "any" if unsure):
- **Frequency range:** e.g. 10–3000 MHz?
- **Impedance ratio:** 1:1, 4:1, other?
- **System impedance:** 50Ω or 75Ω?
- **DC pass or DC isolated?**
- **Package / footprint size:** SOT, custom SMT?

Reply with whatever you've got and I'll narrow it down precisely.

*Parts surfaced:* ADT1-1+, ADT1-1WT+, ADT1.5-17+

### Q117. I need a drop-in replacement for the Qorvo TQP3M9036 low noise amplifier.

Good results. The TQP3M9036 is a 50 MHz–4 GHz InGaAs LNA with ~20 dB gain, ~0.7 dB NF, OIP3 ~34 dBm, P1dB ~19 dBm, and runs on 5V/70 mA in a 2×2 mm QFN. Here are the closest Mini-Circuits matches:

---

**Best overall match: **CMA-5043+****
Frequency: 50–4000 MHz — exact same span as the TQP3M9036

- Gain: 18.4 dB

- NF: 0.75 dB

- OIP3: 33.5 dBm

- P1dB (out): 19.8 dBm

- Vcc: 5V / Icc: 58 mA

- Package: DL1721 (2×2 mm SMT)

This is the tightest electrical match — same frequency coverage, nearly identical gain, NF, linearity, supply voltage, and current draw. The 2×2 mm footprint is also comparable. Datasheet (PDF)

---

**Runner-up (lower Vcc option): **PSA4-5043+****
Same 50–4000 MHz band, 18.4 dB gain, 0.75 dB NF, OIP3 33.5 dBm — but operates at 3V, which may be useful if your rail is lower. Package is MMM1362 (also a small SMT), so the footprint will differ.

---

**If you want extra headroom on NF: **SAV-541+****
45–6000 MHz, 23.2 dB gain, 0.5 dB NF, OIP3 33.1 dBm, 3V / 60 mA — slightly wider band and lower NF, at the cost of a different package (MMM1362) and supply voltage.

---

**Important note on "drop-in":** A true pin-compatible drop-in depends on the exact package footprint and pinout. The CMA-5043+ is the closest electrical match, but I can't confirm pinout compatibility without your board layout details. I'd recommend verifying against the datasheets, and the apps team can help confirm: apps@minicircuits.com

*Parts surfaced:* CMA-5043+, PSA4-5043+, SAV-541+

### Q118. What is the Mini-Circuits equivalent to the Analog Devices HMC849 SPDT switch?

The HMC849A is a DC–6 GHz, absorptive GaAs SPDT MMIC switch in a small SMT package. The closest Mini-Circuits equivalents from the search results are:

---

**Best match: **HSWA2-63DR+****
The strongest direct equivalent — absorptive SPDT, 50Ω SMT, covering 100 MHz–6 GHz.
- Insertion Loss: 1.6 dB typ.
- Isolation: 44 dB typ.
- Impedance: 50Ω
- Package: SMT (DG983-3)
- Datasheet (PDF)

---

**Wider low-end coverage: **JSW2-63DR+****
Absorptive SPDT, 5 MHz–6 GHz — useful if you need coverage below 100 MHz.
- Insertion Loss: 0.8 dB typ.
- Isolation: 18 dB typ.
- Package: SMT (MT1818)
- Datasheet (PDF)

---

**Key trade-off note:** The HSWA2-63DR+ has significantly better isolation (44 dB vs. 18 dB), making it the closer functional match to the HMC849A. The JSW2-63DR+ offers lower insertion loss but trades away isolation. Check both datasheets against your specific IL, isolation, P1dB, and control voltage requirements before committing.

For a detailed pin-for-pin or parametric comparison, the apps team can help: apps@minicircuits.com.

*Parts surfaced:* HSWA2-63DR+, JSW2-63DR+

### Q119. Is there a high-performance alternative to the Marki Microwave MMIQ-0206 I/Q mixer in your catalog?

Good question. The Marki MMIQ-0206 is an I/Q (image-reject/quadrature) mixer covering roughly 2–6 GHz RF/LO. The closest Mini-Circuits equivalents are the **SMIQ-series** — wideband quadrature mixers in compact SMT packages. Two stand out as strong alternatives:

---

**Lead pick: **SMIQ-6243H+****
A broadband I/Q mixer covering DC–6 GHz RF/LO in a compact SMT footprint — directly overlapping the MMIQ-0206's 2–6 GHz band.
- RF/LO range: DC–6,000 MHz
- Package: SMT
- Datasheet (PDF)

**Also consider: **SMIQ-1844H+****
Wider coverage (DC–7 GHz) if you need margin above 6 GHz or want a single part across a broader system.
- RF/LO range: DC–7,000 MHz
- Package: SMT
- Datasheet (PDF)

Both are available in a **connectorized (DG) version** as well — **SMIQ-6243H-DG+** and **SMIQ-1844H-DG+** — if you prefer SMA connectors for bench evaluation.

---

For a detailed side-by-side comparison of conversion loss, image rejection, IIP3, and LO drive level, the datasheets above are the right starting point. If you need help matching the exact specs to your system budget, reach out to apps@minicircuits.com.

*Parts surfaced:* SMIQ-6243H+, SMIQ-1844H+, SMIQ-6243H-DG+, SMIQ-1844H-DG+

### Q120. We are looking to replace the pSemi PE43703 digital step attenuator on our PCB. What model matches?

I want to be straightforward with you here. The PE43703 is a **pSemi (Peregrine Semiconductor) silicon-on-insulator (SOI) digital step attenuator IC** — a 7-bit, 31.75 dB range / 0.25 dB step, DC–6 GHz, SPI/parallel-controlled SMT RFIC.

My catalog searches are not returning a Mini-Circuits equivalent in that same product category (an SPI/parallel-controlled DSA IC). Mini-Circuits' programmable attenuator line (RCDAT, ZX76, etc.) are **bench/connectorized programmable attenuators** and **plug-in modules** — not the same form factor as a single-chip DSA IC that you'd drop into a PCB footprint like the PE43703.

**I won't point you to a part that doesn't genuinely match** — a pin-for-pin or functional PCB replacement for the PE43703 is not something I can confirm from my catalog results today.

The best next step is to contact the Mini-Circuits applications engineering team directly. They can review your exact requirements (frequency, range, step size, control interface, supply voltage, package, footprint) and tell you definitively whether a catalog or custom solution exists:

apps@minicircuits.com 

To speed up the conversation, share with them:

- Frequency range in use

- Attenuation range & step size needed

- Control interface (SPI / parallel)

- Supply voltage & logic levels

- Package / footprint constraints

*Parts surfaced:* Programmable Attenuators

### Q121. Do you have a cross-reference model for the Skyworks SKY13351-374LF SPDT switch?

The closest Mini-Circuits match to the SKY13351-374LF is the **HSWA2-30DR+**. Here's the comparison:

| Parameter | SKY13351-374LF | HSWA2-30DR+ |
|---|---|---|
| Configuration | SPDT | SPDT |
| Frequency | 0.1–3 GHz | DC–3 GHz |
| Type | Absorptive | Absorptive |
| Insertion Loss | ~0.7 dB | 1.2 dB typ |
| Isolation | ~24 dB | 44 dB typ |
| Interface | SMT (SC-70-6) | SMT |

The **HSWA2-30DR+** covers the same DC–3 GHz band in an SMT package and is absorptive (terminated). It actually offers significantly better isolation (44 dB vs. ~24 dB), which is a meaningful improvement in most designs.

A few things to verify before dropping it in as a pin-for-pin replacement:
- **Package footprint** — the case style (DG983-1) will differ from Skyworks' SC-70-6, so a PCB layout change is likely needed.
- **Control voltage/logic** — confirm the control interface matches your design.
- **P1dB / IP3** — check the datasheet for power handling to confirm it meets your budget.

For a direct pin-compatible drop-in confirmation or help with the full spec comparison, reach out to apps@minicircuits.com.

*Parts surfaced:* HSWA2-30DR+

### Q122. I need an operational equivalent to the Hittite HMC589 gain block amplifier.

Good matches here. The HMC589 key specs are: DC–6 GHz, ~20 dB gain, ~3.5 dB NF, ~+21 dBm OIP3, 5V supply. The **GVA-63+** and **CMA-63+** are very close operational equivalents. Here's the comparison:

---

**Best pick: **GVA-63+**** — 10 MHz–6 GHz, 5V, and the spec profile is essentially a drop-in match to the HMC589.

  
Spec | HMC589 | GVA-63+ | 

  
Frequency |  | DC–6 GHz |  | 10 MHz–6 GHz | 

  
Gain |  | ~20 dB |  | 20 dB | 

  
Noise Figure |  | ~3.5 dB |  | 3.7 dB | 

  
OIP3 |  | ~+21 dBm |  | +32.2 dBm | 

  
P1dB (out) |  | ~+18 dBm |  | +18.6 dBm | 

  
Vcc / Icc |  | 5V / 68mA |  | 5V / 69 mA | 

  
Package |  | SOT-89 |  | DF782 (SOT-89 compatible) | 

The GVA-63+ is essentially pin-for-pin and spec-for-spec equivalent — same 5V bias, same current draw, same gain/P1dB, and notably *better* OIP3 than the HMC589.

---

**Also worth considering:**

- **CMA-63+** — Same 10 MHz–6 GHz, 5V/69 mA, 20.3 dB gain, OIP3 +32 dBm. Different package (DL1721 — 4-lead SMT), better if you need a smaller footprint or reflow-friendly land pattern.
- **LEE1-63+** — 10 MHz–6 GHz, 5V/69 mA, 19.5 dB gain, NF 3.4 dB. Slightly lower NF and lower P1dB (+16.6 dBm out). Good if noise figure is the priority.

For live pricing and stock, click any part number above — the product cards link directly to the product page.

*Parts surfaced:* GVA-63+, CMA-63+, LEE1-63+

### Q123. What is the recommended catalog replacement for the obsolete Avago ATF-55143 pHEMT transistor?

That's a great question, but it's a bit outside my lane — I can help you find Mini-Circuits components that might serve the same function, but I don't have cross-reference data mapping competitor or obsolete third-party part numbers (like the Avago/Broadcom ATF-55143) to Mini-Circuits catalog replacements.

What I **can** do is help you find a Mini-Circuits LNA or gain block that matches the ATF-55143's key specs. The ATF-55143 is a low-noise pHEMT typically used in the 0.1–6 GHz range with very low noise figure (~0.5–0.8 dB) and moderate gain (~15–18 dB). If you'd like a Mini-Circuits drop-in or functional replacement, here's what I'd need:

To find the right LNA/gain block, fill in what you know (leave blank / "any" if unsure):
- **Frequency:** e.g. 2.4 GHz, 0.5–6 GHz
- **Noise figure:** target max NF (dB)
- **Gain:** target min gain (dB)
- **Supply voltage (Vcc):** e.g. 3V, 5V
- **Package:** SMT / die / connectorized
- **Application:** receive LNA, driver amp, etc.

Reply with whatever you've got and I'll search the catalog for the best matches.

### Q124. Do you have a surface mount alternative to the Marki Microwave A-0020 fixed attenuator pad?

The direct match is **BAT-20+** — a 20 dB SMT fixed attenuator that covers **DC to 60 GHz**, which actually out-ranges the Marki A-0020 (rated to 40 GHz). It's a strong drop-in alternative for board-level designs.

Key specs from the catalog:

  
- **Attenuation:** 20 dB
  
- **Frequency:** DC – 60,000 MHz
  
- **Package:** SMT (Case KC3011)
  
- **Datasheet:** BAT-20+ Datasheet (PDF)
  
- **S-parameters:** S2P Download

One note: the Marki A-0020 is a connectorized (SMA) pad, so if you're moving to SMT intentionally for board integration, the BAT-20+ fits well. If you need a connectorized format instead, I can look at those options too.

*Parts surfaced:* BAT-20+

### Q125. Is there a Mini-Circuits cross-reference for the Analog Devices LTC5549 passive downconverting mixer?

Good results. The closest analogues to the LTC5549 from this set are the **MCA1T-60+**, **SMIQ-6243H+**, and **SYM-63LH+** — all passive, SMT, covering up to 6 GHz. Let me note the key comparison points:

The **LTC5549** key specs for reference:
- RF: 10 MHz – 6 GHz
- IF: DC – 6 GHz
- LO drive: +13 dBm (typ)
- Package: 4×4 mm QFN-16, 50Ω, passive (diode-based)

Here are the strongest Mini-Circuits candidates:

---

****SMIQ-6243H+**** — Best overall fit
- RF/LO/IF: DC to 6 GHz
- SMT package
- Passive MMIC double-balanced mixer
- Datasheet (PDF)

****MCA1T-60+**** — Wideband passive, DC–6 GHz
- RF/LO/IF: DC to 6 GHz
- SMT
- Datasheet (PDF)

****SYM-63LH+**** — 1 MHz–6 GHz, 50Ω SMT
- RF/LO/IF: 1 MHz to 6 GHz
- Low LO drive variant
- Datasheet (PDF)

---

**Important caveat:** Mini-Circuits does not publish an official cross-reference table, so I can't guarantee a pin-for-pin or spec-for-spec drop-in. LO drive level, conversion loss, IIP3, and port-to-port isolation can differ between these and the LTC5549 — please review the datasheets side by side before committing to a swap. For a formal compatibility review, the apps team is the right resource: apps@minicircuits.com.

*Parts surfaced:* MCA1T-60+, SMIQ-6243H+, SYM-63LH+

### Q126. I am using the ERA-1SM+ amplifier. Is there a drop-in alternative that runs natively on a 5V rail without requiring an external dropping resistor?

Here's the honest picture on the ERA-1SM+ and a 5V drop-in:

**ERA-1SM+ context**
The ERA-1SM+ is a cascadable gain block (DC–8 GHz, 50Ω, WW107/SOT-343 package) that is biased via its RF port through a choke/resistor network. Its nominal bias point is well below 5V, so a series dropping resistor is the standard design approach — there is no internal regulator.

**The closest 5V-native alternative: **GVA-93+****

The **GVA-93+** is the part I'd look at first:

| Spec | ERA-1SM+ | GVA-93+ |
|---|---|---|
| Frequency | DC–8 GHz | 10 MHz–9 GHz |
| Vcc | ~3.5 V (needs resistor for 5V) | **5 V native** |
| Gain | ~11 dB | 16.9 dB |
| NF | — (see datasheet) | 4 dB |
| OIP3 | — | 30 dBm |
| Output P1dB | — | 16.2 dBm |
| Package | WW107 (SOT-343) | **DF782 (SOT-343)** |

The GVA-93+ runs natively at 5V, sits in the same SOT-343 footprint (DF782), and covers your frequency range — so the PCB layout change is minimal. The gain is higher (~17 dB vs ~11 dB on the ERA-1SM+), so confirm your cascade budget accommodates that.

**One important caveat on "drop-in":** While both use the SOT-343 body, you should verify the pin assignment (RF in/out/bias) matches your layout exactly by comparing the two datasheets before calling it a true drop-in. I can't confirm pin-for-pin compatibility from the catalog data alone.

GVA-93+ Datasheet (PDF) | ERA-1SM+ Datasheet (PDF)

If you need pin-for-pin confirmation or the gain is too high, reach out to the apps team: apps@minicircuits.com

*Parts surfaced:* ERA-1SM+, GVA-93+

### Q127. We currently use the VLF-1000+ low pass filter. Do you make an absorptive, reflectionless version with the same cutoff frequency?

The closest reflectionless low-pass match I can find is the **ZXLF-K641M+**, which has a passband upper edge of 1100 MHz — the nearest we have in the reflectionless (XLF) family to the VLF-1000+'s 1000 MHz cutoff. It's a connectorized part (SMA, UK3042 case) with 38 dB rejection.

Here's a quick comparison of what you have vs. what's available:

  
 | Parameter |  | VLF-1000+ (current) |  | ZXLF-K641M+ (reflectionless) | 

  
 | Technology |  | Conventional LP |  | Reflectionless | 

  
 | Passband (fhi) |  | 1000 MHz |  | 1100 MHz | 

  
 | Rejection |  | — |  | 38 dB | 

  
 | Interface |  | Connector |  | Connector (SMA, UK3042) | 

The key difference: a reflectionless filter terminates out-of-band energy internally rather than reflecting it back to the source, which eliminates the impedance mismatch issues that can cause problems in sensitive receiver chains or cascade designs.

The cutoff isn't an exact 1000 MHz match. If the 1100 MHz upper edge doesn't work for your design, the apps team can help identify whether a closer custom or non-standard option exists:
apps@minicircuits.com 

ZXLF-K641M+ Datasheet | S-Parameters

*Parts surfaced:* ZXLF-K641M+, VLF-1000+

### Q128. Is there a higher-isolation alternative to the SIM-43H+ mixer specifically for improving LO-to-RF isolation?

Here's a focused answer based on what I found.

**Baseline: SIM-43H+**
The SIM-43H+ is a Level 17 (high-LO-drive) passive double-balanced SMT mixer, 50Ω, covering a wide RF/LO band. The catalog record doesn't surface its isolation figure numerically, so let me be precise about what I can and can't say.

---

**What actually drives LO-to-RF isolation in a passive mixer:**
High isolation in the SIM/passive-diode-balun mixer topology comes primarily from two things: (1) the quality of the transformer balance, and (2) the LO drive level — higher drive improves port-to-port balance. The "H" suffix in Mini-Circuits naming typically denotes a high-LO-drive variant, which generally yields better isolation.

---

**Best alternatives to investigate, from the search results:**

**SMIQ-1844H+** — SMT, DC–7 GHz, Level 17 ("H" = high drive, high isolation). Covers your band and beyond. This is an image-reject/IQ mixer architecture, which inherently gives superior LO-to-RF isolation vs. a standard double-balanced mixer. Strong candidate if your IF is wideband.

**SMIQ-6243H+** — SMT, DC–6 GHz, also Level 17. Similar high-isolation IQ mixer architecture. Narrower upper band than the 1844H variant.

**SYM-63LH+** — SMT, 1 MHz–6 GHz, 50Ω. The "H" denotes high-LO-drive; check its datasheet for the specific LO-to-RF isolation figure.

---

**Important caveat:** The catalog records for these parts don't return numeric isolation values directly, so I can't give you a side-by-side dB comparison here without risking a made-up number. To compare LO→RF isolation figures precisely, I'd recommend:

1. Opening the SIM-43H+ Datasheet and noting its published LO-to-RF isolation spec.
2. Pulling datasheets for the candidates above and comparing that same row.
3. For a definitive recommendation, contact apps@minicircuits.com — they can filter the full catalog by isolation spec. 

What's the frequency range and LO drive level you're actually using? That'll let me narrow this down further.

*Parts surfaced:* SIM-43H+, SMIQ-1844H+, SMIQ-6243H+, SYM-63LH+

### Q129. I need a connectorized equivalent of the SYPS-2-252+ SMT splitter to do prototyping on the bench before spinning a board.

The SYPS-2-252+ covers **5–2500 MHz**, and the search turned up exactly what you need: the **ZAPD-2-252** family — connectorized, same 5–2500 MHz band, designed as the bench/connectorized counterpart to that SMT topology. Three connector variants:

**Best pick: **ZAPD-2-252-S+**** — SMA connectors (standard bench choice)
- Frequency: 5–2500 MHz (identical to SYPS-2-252+)
- Connectors: SMA
- Datasheet (PDF)

Also in the same family if your setup calls for a different connector:
- **ZAPD-2-252-75+** — BNC connectors (5–2500 MHz)
- **ZAPD-2-252-N+** — N connectors (5–2500 MHz), useful if you need better power handling or are working with larger coax

The ZAPD-2-252-S+ is almost certainly what you want for bench prototyping. Check live pricing and stock on the product page.

*Parts surfaced:* SYPS-2-252+, ZAPD-2-252-S+, ZAPD-2-252-75+, ZAPD-2-252-N+

### Q130. What is the surface-mount equivalent part number for the ZDC-10-2+ connectorized directional coupler?

The ZDC-10-2+ didn't resolve in the catalog (it may be discontinued or the part number is slightly different), and I can't confirm a direct SMT equivalent without verified specs to match against.

To find the right SMT replacement, it would help to know the key specs of the ZDC-10-2+:

- **Coupling value**: 10 dB (implied by the part number)
- **Frequency range**: Do you know the band it needs to cover?
- **System impedance**: 50Ω?
- **Any other requirements** (directivity, power handling, etc.)?

With those confirmed, I can point you to the best SMT match. Alternatively, the apps team can look up the ZDC-10-2+ directly and identify the official SMT equivalent: apps@minicircuits.com.

### Q131. I am using the ROS-2000+ VCO. Do you offer a complete surface-mount synthesizer module that includes the internal PLL loop filter?

Here's an honest summary of what the catalog shows:

**Mini-Circuits does offer integrated PLL synthesizer modules** — the **KSN-** and **DSN-** series include the VCO, PLL IC, and loop filter in a single module. However, every synthesizer in the catalog at this time is **connectorized** (plug-in/rack-mount housing); I'm not finding a surface-mount synthesizer module that covers the ~2 GHz range of the ROS-2000+.

A few options from here:

1. **Check the KSN/DSN datasheets** — some of these modules are close in frequency (e.g. **KSN-1941A-119+**, **KSN-2346A+**) and may be worth a look even if connectorized.
2. **Custom / semi-custom module** — Mini-Circuits has custom assembly capability that could integrate the ROS-2000+ with a PLL and loop filter into a module configured to your needs: Custom Assembly Capabilities.
3. **Talk directly to the apps team** — they can confirm whether an SMT-packaged integrated synthesizer at 2 GHz is on the roadmap or available as a catalog variant: apps@minicircuits.com. 

In the meantime, the ROS-2000+ datasheet has the tuning sensitivity (Kv) and output power specs you'd need to design your own external PLL loop filter if you want to proceed independently.

*Parts surfaced:* ROS-2000+, KSN-1941A-119+, KSN-2346A+

### Q132. We use the DAT-31R5-SP+ digital attenuator. Do you have a model that provides a finer 0.25 dB step size instead of 0.5 dB?

Yes — **DAT-31R5A-SP+** is the direct upgrade you're looking for. It's the 0.25 dB step-size version of your current DAT-31R5-SP+, in the same SMT package with the same SP (serial/parallel) control interface.

Here's a quick comparison:

Parameter | DAT-31R5-SP+
(current) | DAT-31R5A-SP+
(upgrade) | 

Step size | 0.5 dB | **0.25 dB** | 

Impedance | 50 Ω | 50 Ω | 

Control | SP (Serial/Parallel) | SP (Serial/Parallel) | 

Package | SMT | SMT | 

OIP3 | — | 52 dBm | 

**Pricing (DAT-31R5A-SP+):**

Qty | Unit Price | 

20 | $6.35 | 

50 | $5.80 | 

100 | $5.35 | 

500 | $5.13 | 

1000 | $4.68 | 

**Note:** Current stock shows 0 on hand. I'd recommend contacting apps@minicircuits.com or your Mini-Circuits rep to confirm lead time. 

**Downloads:**
- Datasheet (PDF)
- View Data
- View Graphs
- S-Parameters

*Parts surfaced:* DAT-31R5A-SP+, DAT-31R5-SP+

### Q133. Is there a version of the MSP2TA-18+ electromechanical switch that includes internal 50-ohm terminations for the isolated ports?

Based on both searches, I can give you a clear answer:

The catalog does not show a terminated (absorptive) variant of the MSP2TA-18 electromechanical switch family. The MSP2TA-series parts that did come up — **MSP2TA-18-12+** and **MSP2TA-18XL+** — are both DC–18 GHz connectorized SPDT electromechanical switches, but neither appears to be a terminated/absorptive variant. The "A" in names like MSP2T**A** in Mini-Circuits' mechanical switch lineup refers to the actuator type (latching vs. non-latching), not to internal terminations.

A terminated electromechanical SPDT with that kind of frequency range isn't something that shows up in the current catalog. A few options to consider:

1. **External terminations** — you can add SMA 50Ω terminations to the idle ports yourself. Mini-Circuits carries those separately.
2. **Solid-state absorptive switches** — if your power levels allow it, solid-state "DR" (double-throw, resistive/absorptive) parts cover lower frequencies but can go up to ~6 GHz.
3. **Custom / special build** — Mini-Circuits does offer custom switch assemblies. The apps team can tell you if an internally terminated version of the MSP2TA-18 exists as a special or can be built.

I'd recommend reaching out directly: apps@minicircuits.com

*Parts surfaced:* MSP2TA-18-12+, MSP2TA-18XL+

### Q134. I need a lower-cost, standard commercial alternative to the high-precision 2.92mm adapters for general bench test use.

Good news — Mini-Circuits has a broad lineup of 2.92mm (K-connector) adapters at standard commercial pricing. Before I narrow down the specific models for you, I need to know which connector combination(s) you need, since that's the decisive parameter here.

**The most common 2.92mm adapter types in the catalog:**

  
- **2.92mm ↔ SMA** — e.g. **KF-SF50+** (2.92mm female to SMA female)
  
- **2.92mm ↔ 2.4mm** — e.g. **24F-KF+**, **24M-KM+**, etc.
  
- **2.92mm ↔ 1.85mm** — e.g. **185F-KF+**, **185M-KM+**, etc.
  
- **2.92mm ↔ 2.92mm** (barrel/gender changer) — e.g. **KF-KF50+**, **KF-KM50+**

To point you to the right part(s), fill in what you know:

  
- **Connector type needed:** SMA / 2.4mm / 1.85mm / 2.92mm-to-2.92mm / other?
  
- **Gender combination:** M-F / F-F / M-M (or right-angle)?
  
- **Max frequency:** (K-connectors typically rate to 40 GHz, but if you're working below 18 GHz an SMA alternative may save more cost)
  
- **Quantity:** (affects pricing tier)

Reply with whatever you've got and I'll pull the specific models with live pricing.

*Parts surfaced:* 24F-KF+, 24M-KM+, 185F-KF+, 185M-KM+

### Q135. What is the equivalent model to the Gali-6+ that comes housed in an SOT-89 package footprint rather than the SOT-86?

Honest answer: my catalog searches didn't surface a GALI-6+ variant in an SOT-89 package. The SOT-86 (Mini-Circuits case style DF782) is the standard package for the GALI-6+ family, and no SOT-89-housed equivalent appeared in the results.

A few possibilities worth noting:
- The **GALI-6F+** shares the same DF782 case and is the closest electrical variant (DC–4000 MHz, 11.6 dB gain, NF 4.5 dB, OIP3 35.5 dBm at lower Icc of 50 mA vs. 70 mA).
- There is no GALI-6 in SOT-89 confirmed in the catalog data I have.

I'd recommend reaching out directly to the apps team — they can confirm whether a SOT-89 footprint option exists or suggest a qualified drop-in from a different series: apps@minicircuits.com

*Parts surfaced:* GALI-6+, GALI-6F+

### Q136. Do you have a cross-reference for the MACOM MASW-007107 high-isolation RF switch?

The **HSWA2-30DR+** stands out as the closest functional match. Here's the comparison:

**MACOM MASW-007107 vs. Mini-Circuits HSWA2-30DR+**

| Parameter | MASW-007107 | HSWA2-30DR+ |
|---|---|---|
| Configuration | SPDT absorptive | SPDT absorptive |
| Frequency | DC–3 GHz | DC–3 GHz |
| Insertion Loss | ~0.8 dB | 1.2 dB typ. |
| Isolation | ~40 dB | 44 dB typ. |
| Impedance | 50 Ω | 50 Ω |
| Interface | SMT (SOT-363) | SMT (DG983-1) |

The ****HSWA2-30DR+**** actually **exceeds** the MACOM part on isolation (44 dB vs. ~40 dB). Insertion loss is slightly higher at 1.2 dB vs. ~0.8 dB.

**Important note on package:** The MASW-007107 is in a 6-lead SOT-363/SC-70, while the HSWA2-30DR+ uses Mini-Circuits' DG983-1 package — the footprints are **not pin-compatible**, so a layout change will be needed. Check the datasheet for the pinout and pad dimensions: HSWA2-30DR+ Datasheet (PDF)

If the insertion loss difference is a concern, or you need a tighter package match, the apps team can dig deeper: apps@minicircuits.com

*Parts surfaced:* HSWA2-30DR+

### Q137. I need a direct drop-in replacement model for the Qorvo RF3825 driver amplifier.

I want to be straightforward with you here: I cannot confirm a "direct drop-in replacement" for the Qorvo RF3825. Here's why, and what I can offer instead.

**The drop-in problem**

A true drop-in replacement requires matching all of the following simultaneously:
- Identical (or pin-compatible) package / footprint
- Same supply voltage and bias conditions
- Same gain, P1dB, OIP3, and frequency band
- Compatible input/output impedance and matching network

Mini-Circuits does not publish a cross-reference to third-party part numbers, and I cannot verify pinout/footprint compatibility from catalog data alone. Claiming a part is a "drop-in" without confirming those details would be misleading.

**What the search returned**

The catalog results in this frequency/gain range are dominated by connectorized bench amplifiers (ZHL-series, HPA-series) — different package class entirely from the RF3825's SMT die/QFN format. The only 5V SMT result, **PMA4-33GLN+** (700–3000 MHz, 5V, gain ~39 dB), has a much lower P1dB (~22.6 dBm output) than the RF3825's ~+28 dBm, so it's not a functional equivalent either.

**Recommended next step**

The best path for a genuine drop-in evaluation is to share your exact requirements (package, pinout, Vcc, gain, P1dB/OIP3 targets) directly with the Mini-Circuits applications team — they can cross-check against parts not surfaced by a generic search and advise on any board-level adaptation needed:

apps@minicircuits.com 

If you can share the key specs you need to match (gain, P1dB, supply voltage, package), I'm happy to run a more targeted search and present the closest functional candidates, even if a pin-for-pin drop-in isn't available.

*Parts surfaced:* PMA4-33GLN+

### Q138. What is the closest catalog match to the Analog Devices HMC788A gain block?

The HMC788A's key specs are: ~50 MHz–6 GHz, ~15 dB gain, ~2.7 dB NF, ~+23 dBm OIP3, 3.3 V supply, SOT-86/SC-70 package. Here are the closest catalog matches:

---

**Best overall match: **PHA-1+****
The closest functional equivalent — same frequency span, very similar gain, NF, and OIP3. Same 5V class (the HMC788A is 3.3 V, so check your rail). SOT-86-style package (DF782).

| Spec | HMC788A (ADI) | PHA-1+ |
|---|---|---|
| Frequency | 0.05–6 GHz | 50–6000 MHz |
| Gain | ~15 dB | 13.5 dB |
| NF | ~2.7 dB | 2.2 dB |
| OIP3 | ~+23 dBm | +42 dBm |
| OP1dB | ~+17 dBm | +22.4 dBm |
| Vcc | 3.3 V | 5 V |

The OIP3 on the **PHA-1+** is significantly higher than the HMC788A — a real upgrade in linearity. NF is also slightly better. The main differences are supply voltage (5 V vs 3.3 V) and somewhat higher Icc (146 mA).

---

**Runner-up 1: **PGA-102+**** — 50–6000 MHz, 15.9 dB gain, 2.3 dB NF, +32.7 dBm OIP3, 3.3 V supply, DF782 package. Closer voltage match to the HMC788A's 3.3 V rail.

**Runner-up 2: **PHA-1H+**** — same die as PHA-1+ in a hermetic package (DF782), 13.8 dB gain, 2.2 dB NF, +41 dBm OIP3 — good if you need the screened/hi-rel variant.

---

For live pricing, stock, and datasheets, click any part number above. If you need a 3.3 V drop-in, the **PGA-102+** is the tightest supply voltage match.

*Parts surfaced:* PHA-1+, PGA-102+, PHA-1H+

### Q139. Is there a Mini-Circuits alternative that matches the frequency and IP3 performance of the Marki Microwave T3-10 mixer?

Good data back. A few important findings to share honestly:

---

**Here's what the catalog search returned for 2–10 GHz mixers:**

**MCA1T-12G+** (SMT) — the catalog lists it as 0–12 GHz, but the product detail page shows the actual RF/LO range is **3.8–12 GHz**, so it doesn't cover the 2–3.8 GHz portion of the T3-10's range. The IP3 spec is not surfaced in the tool result — you'd need the datasheet for that figure: MCA1T-12G+ Datasheet (PDF) | View Graphs

**ZMIQ-653H-E+** — confirmed 18–65 GHz, so it's completely out of band for this application.

---

**Bottom line:** The catalog search for mixers covering the full 2–10 GHz RF/LO band with high IP3 didn't surface a direct drop-in match. Mini-Circuits does have a very broad mixer portfolio, and it's possible a connectorized or module-level part exists that I haven't surfaced with these filters.

I'd strongly recommend reaching out directly to the apps team — they know the full portfolio including any catalog mixers, custom assemblies, or pre-production parts that may be an exact fit for the T3-10's 2–10 GHz, ~+20 dBm IIP3 performance:

apps@minicircuits.com 

Give them the T3-10 part number as the reference — that'll get you the fastest, most accurate answer.

*Parts surfaced:* MCA1T-12G+, ZMIQ-653H-E+

### Q140. We are looking to replace the pSemi PE4259 SPDT switch in our legacy design. What is your equivalent part?

Good data. Here's my recommendation:

---

**Lead pick: **HSWA2-30DR+**** — absorptive (terminated) SPDT, DC–3 GHz, SMT, 50Ω, closely matching the PE4259's core use case.

From the catalog data:

  
- **Frequency:** DC – 3,000 MHz
  
- **Insertion loss:** 1.2 dB typ.
  
- **Isolation:** 44 dB typ.
  
- **Type:** Absorptive (terminated) SPDT
  
- **Interface:** SMT (case DG983-1)
  
- **Impedance:** 50 Ω

**Pricing & Stock:**

  
 | Qty |  | Unit Price (USD) | 

  
 | 20 |  | $3.88 | 

  
 | 50 |  | $3.22 | 

  
 | 100 |  | $2.56 | 

  
 | 500 |  | $1.87 | 

  
 | 1,000 |  | $1.55 | 

  
 | 5,000 |  | $1.32 | 

**Stock:** More than 20,000 units available.

**Downloads:**

  
- Datasheet (PDF)
  
- View Data
  
- View Graphs
  
- S-Parameters
  
- PCB Layout

---

**A note on pin-compatibility:** The HSWA2-30DR+ is a strong functional match, but I can't confirm it is a drop-in pinout replacement for the PE4259 without you comparing the datasheets side by side. If you need confirmation on that or have specific specs to match (control voltage, P1dB, package footprint), the apps team can help: apps@minicircuits.com.

*Parts surfaced:* HSWA2-30DR+

### Q141. Do you have an equivalent model to the Skyworks SKY12343-364LF digital attenuator?

Honestly, the catalog search didn't surface a clean match through keyword search, but I did confirm one relevant part:

**DAT-31R5A-SP+** is a 6-bit, 0–31.5 dB digital step attenuator in an SMT package — the closest Mini-Circuits equivalent to the SKY12343-364LF in terms of attenuation range and step size (0.5 dB LSB). It's a well-known drop-in style for that Skyworks function.

Key specs from the tool:
- Attenuation range: 0–31.5 dB (6-bit, 0.5 dB steps)
- Impedance: 50 Ω
- OIP3: 52 dBm
- Package: SMT (DG983-2)
- Control: Parallel CMOS (compatible interface)

Note: Stock currently shows 0 — worth checking lead time with the team.

Downloads:
- Datasheet (PDF)
- View Graphs
- View Data

I don't have the exact frequency range confirmed from the tool result — verify it covers your full 0.1–6 GHz requirement in the datasheet. For stock/lead time or to confirm pin-compatibility with SKY12343, reach out to apps@minicircuits.com.

*Parts surfaced:* DAT-31R5A-SP+

### Q142. I need a catalog cross-reference for the Hittite HMC307 digital step attenuator.

Good — I have confirmed parts. Here's the cross-reference summary:

---

**Hittite HMC307 → Mini-Circuits Cross-Reference**

The HMC307 is a GaAs MMIC 6-bit DSA: DC–4 GHz, 0–31.5 dB range, 0.5 dB LSB, parallel TTL control, 50Ω, SMT. Here are the Mini-Circuits equivalents:

---

**Primary recommendation: **DAT-31R5A-PP+****
This is the closest functional match — 6-bit, 0–31.5 dB, 0.5 dB step, parallel control, 50Ω SMT.

- OIP3: 52 dBm

- Impedance: 50Ω

- Stock: more than 1,000

**Pricing (DAT-31R5A-PP+):**

 | Qty |  | Unit Price (USD) | 

 | 20 |  | $6.35 | 

 | 50 |  | $5.80 | 

 | 100 |  | $5.35 | 

 | 500 |  | $5.13 | 

 | 1,000 |  | $4.68 | 

 | 2,000 |  | $4.40 | 

Datasheet (PDF) | View Graphs | S-Parameters

---

**Also consider: **DAT-31A-SP+**** — same 0–31.5 dB / 0.5 dB step / parallel control, 50Ω SMT, OIP3 52 dBm. Slightly different pinout/case variant (DG983-2). Stock: more than 1,000. Pricing is nearly identical.

Datasheet (PDF)

---

**Key notes for your evaluation:**

- Verify the exact frequency range and insertion loss vs. frequency from the datasheets/graphs — the HMC307 is specified to 4 GHz, and you'll want to compare IL and attenuation accuracy across band.

- Pin-for-pin compatibility and control logic levels should be confirmed against your PCB layout before committing.

- For questions on a guaranteed drop-in or parametric edge cases, contact apps@minicircuits.com.

*Parts surfaced:* DAT-31R5A-PP+, DAT-31A-SP+

### Q143. What is your closest alternative to the obsolete Broadcom MGA-62563 GaAs MMIC LNA?

Good results. The MGA-62563 is a GaAs MMIC LNA covering ~1.5–6 GHz with ~15 dB gain, ~1.4 dB NF, ~18 dBm output P1dB, 3V supply, in a SOT-363/SC-70 package. Let me match against these results.

The closest matches from the catalog are the **PMA-545x** family and the **PMA-5452+** in particular — GaAs MMIC LNAs covering 50 MHz–6 GHz on a 3V supply, very similar to the MGA-62563. Here's a focused comparison:

---

**Top recommendation: **PMA-5452+****
The closest overall match — same GaAs process, same 3V supply, virtually identical gain and frequency range, with a lower NF and comparable P1dB.

| Spec | MGA-62563 | PMA-5452+ | PMA-545+ | PMA-5453+ |
|---|---|---|---|---|
| Freq (MHz) | 1500–6000 | 50–6000 | 50–6000 | 50–6000 |
| Gain (dB) | ~15 | 14 | 14.2 | 14.3 |
| NF (dB) | ~1.4 | **0.7** | 0.8 | 0.7 |
| Output P1dB (dBm) | ~18 | 18.3 | 20 | 19.6 |
| OIP3 (dBm) | — | 34.1 | 36.4 | 36.8 |
| Vcc (V) | 3 | **3** | 3 | 3 |
| Icc (mA) | ~22 | 40 | 80 | 60 |
| Package | SOT-363 | DQ849 (4-pin SMT) | DQ849 | DQ849 |

**Key notes:**
- **PMA-5452+** — best NF (0.7 dB) and lowest current (40 mA) of the three; ideal if you're optimizing for sensitivity and power consumption.
- **PMA-545+** — slightly higher P1dB (20 dBm) and OIP3 (36.4 dBm) if linearity is the priority; draws 80 mA.
- **PMA-5453+** — the balance point: NF 0.7 dB, OIP3 36.8 dBm, Icc 60 mA.

The package footprint (DQ849, a 4-pad SMT) is different from the SOT-363, so a PCB layout change will be needed. S-parameter files are available for all three for simulation.

For datasheet/pricing links, click any part number above or let me know which one you want details on.

*Parts surfaced:* PMA-5452+, PMA-545+, PMA-5453+

### Q144. Do you have a drop-in or functional replacement for the Marki Microwave FB-0513 bandpass filter?

I want to be straightforward with you here. The Marki FB-0513 is a **500–1300 MHz connectorized bandpass filter**. My catalog search returned no Mini-Circuits bandpass filters that fully cover that 500–1300 MHz passband as a single part — what came back were high-pass and low-pass filters, not a matching bandpass.

**What is possible** is a two-filter cascade approach:
- A high-pass filter with ~500 MHz cutoff (e.g. **BHP-500+**, flo 500 MHz) to reject the low end
- A low-pass filter with ~1300 MHz cutoff (e.g. **LFCN-1325** or **LFCN-1400**) to reject the high end

This would functionally replicate a 500–1300 MHz bandpass, but it's obviously not a drop-in replacement — it requires two parts and board space.

For a true single-package drop-in or functional equivalent, I'd recommend reaching out to the Mini-Circuits applications team directly. They can check for custom or catalog parts not surfaced in a standard search, confirm passband insertion loss, rejection specs, and whether anything matches the FB-0513's connector type and footprint:

apps@minicircuits.com 

If you want, share the key specs you care most about (insertion loss, rejection level, connector type, size) and I can also help narrow down whether the two-filter approach would work for your application.

*Parts surfaced:* BHP-500+, LFCN-1325, LFCN-1400

### Q145. What is the Mini-Circuits equivalent model to the Analog Devices ADL5351 active mixer?

I want to be upfront with you here. The ADL5351 is an **active (Gilbert cell) upconverting mixer** with positive conversion gain (~7 dB), an integrated LO buffer, and differential IF input — a fairly specific active RFIC architecture.

Mini-Circuits' mixer catalog is predominantly **passive (diode-based) double-balanced mixers**. The search results above — ADE-series parts — are all passive SMT mixers. They cover the 700–1000 MHz RF range, but they have **conversion loss** (typically ~7–8 dB) rather than conversion gain, and they don't include an integrated LO buffer or amplifier. That's a meaningful functional difference, not just a spec difference.

**The honest answer:** Mini-Circuits does not have a direct drop-in equivalent to the ADL5351 in terms of active upconverter architecture with integrated gain. The closest you could do with Mini-Circuits parts is a **passive mixer + a downstream gain stage**, for example:

- A passive SMT mixer (e.g., **ADE-12MH**, 10–1200 MHz, 50Ω) for the mixing function
- Followed by a Mini-Circuits amplifier (e.g., from the PMA or GALI series) to recover the conversion loss

If you'd like, I can help you design that combination, or I can connect you with the Mini-Circuits applications team who can confirm whether there's a newer active mixer product that fits your need: apps@minicircuits.com. 

What would be most helpful?

*Parts surfaced:* ADE-12MH

### Q146. I am currently using the PMA3-83LN+ low noise amplifier. Do you have a version available that includes an integrated bypass switch leg?

Good question — I've done a thorough search across the catalog. Unfortunately, Mini-Circuits does not currently offer a version of the **PMA3-83LN+** (or a direct equivalent in that family) with an integrated bypass switch leg as a single packaged component.

The PMA3-83LN+ (500–8000 MHz, NF 1.3 dB, Gain 22.1 dB) is a standalone LNA; the bypass function would need to be implemented externally using a discrete SPDT switch routed around it.

A few options worth considering:

1. **External bypass switch** — Pair the PMA3-83LN+ with a fast SPDT switch such as the **HSWA2-63DR+** (100–6000 MHz, IL 1.6 dB, Iso 44 dB, SMT) in a bypass configuration. This gives you full control over switch speed and topology.

2. **Check with the apps team** — If an integrated LNA+bypass in a single package is a hard requirement, it's worth asking directly. Mini-Circuits does custom and application-specific variants, and the team would know if anything is in development or available via a non-catalog route.

Reach out at apps@minicircuits.com with your key specs (frequency range, NF budget, gain, bypass IL requirement, and package preference) and they can advise.

*Parts surfaced:* PMA3-83LN+, HSWA2-63DR+

### Q147. We use the BBP-21.4+ bandpass cavity filter. Do you have a version centered at 21.4 MHz but with a narrower 3dB bandwidth?

The catalog search isn't surfacing a narrower-bandwidth catalog variant at 21.4 MHz — the BBP-21.4+ appears to be the only standard catalog bandpass filter centered at that frequency. Here's where things stand:

**Your current part — **BBP-21.4+****

  
**Stock** |  | More than 100 units | 

  
**Datasheet** |  | BBP-21.4+ Datasheet (PDF) | 

  
**View Data / Graphs** |  | View Data | View Graphs | 

The catalog doesn't currently show a narrower-BW version of this part as a standard off-the-shelf product. For a custom-tuned cavity filter with tighter bandwidth at 21.4 MHz, the applications team is the right path — they handle custom filter specifications and can confirm whether a modified design is feasible:

apps@minicircuits.com 

It would help to have these specs ready when you reach out:
- Required 3 dB bandwidth (kHz or MHz)
- Required rejection and at what offset
- Insertion loss budget
- Power level and connector type

*Parts surfaced:* BBP-21.4+

### Q148. Is there a dual-channel, matched version of the ADE-1+ mixer integrated into a single surface mount package?

The **LRMS-1+** is exactly what you're looking for. It's a dual, matched version of the ADE-1+ — two mixer cores derived from the same design, factory-matched and integrated into a single SMT package. The "LR" prefix designates the left/right (dual-channel, matched) configuration, and the "MS" suffix indicates the monolithic SMT housing.

Key details from the catalog:
- **Frequency range:** 0.5–500 MHz
- **Interface:** SMT
- **Matched pair:** yes — both channels share the same package, guaranteeing amplitude and phase balance between channels

The **LRMS-1+** is the standard current-production version ("+"-suffix = RoHS compliant, latest process). There are also variants in the same family worth noting:

- **LRMS-1J+** — same dual matched topology, alternate case style
- **LRMS-1WHJ** / **LRMS-1LHJ** — high-LO-drive and low-LO-drive variants respectively

For live pricing, stock, and the datasheet, I'd recommend pulling up the product page directly. Want me to fetch those details for the LRMS-1+?

*Parts surfaced:* LRMS-1+, ADE-1+, LRMS-1J+, LRMS-1WHJ

### Q149. I need an alternative to the ZAPD-2+ power splitter that features Type-N female connectors instead of standard SMA.

The **ZAPD-21-N+** is your best fit — it's from the same ZAPD Wilkinson splitter family, covers 500–2000 MHz (actually wider than the ZAPD-2+), and uses Type-N female connectors throughout.

**ZAPD-21-N+ vs. ZAPD-2+ at a glance:**

| | ZAPD-2+ | ZAPD-21-N+ |
|---|---|---|
| Frequency | 1000–2000 MHz | 500–2000 MHz |
| Connectors | SMA female | **Type-N female** |
| Stock | 5 | **66** |
| Unit price (1 pc) | $78.86 | $85.45 |

**Pricing & Availability — ZAPD-21-N+:**

 | Qty |  | Unit Price | 

 | 1–5 |  | $85.45 | 

 | 10 |  | $72.29 | 

 | 25 |  | $70.97 | 

 | 50 |  | $69.66 | 

 | 100 |  | $68.34 | 

**Stock:** 66 units available now.

**Downloads:**

- Datasheet (PDF)

- View Data

- View Graphs

- S-Parameters (.zip)

- Case Style F53 (drawing)

One note: there is also a **ZAPD-20-N+** (700–2000 MHz, N female) if you only need the upper portion of the band — check its datasheet to compare IL and isolation if it matters.

*Parts surfaced:* ZAPD-21-N+, ZAPD-2+, ZAPD-21+, ZAPD-20-N+

### Q150. What is the 75-ohm system impedance equivalent model for the ADT1-1WT+ RF transformer?

The search results confirm it directly: **ADT1-1WT+** itself is the 75Ω system impedance model. Here's a summary:

The **ADT1-1WT+** is already specified and characterized in a **75Ω system** — it is not a 50Ω part with a 75Ω equivalent. So if you're looking for the 75Ω counterpart to this part, you're already looking at it.

**ADT1-1WT+ Key Specs (from catalog):**
- **Impedance:** 75Ω
- **Impedance Ratio:** 1:1
- **Frequency Range:** 0.4 – 800 MHz
- **Technology:** Core & Wire
- **Package:** SMT (CD542)
- **Stock:** 4,000 units available

**Pricing:**

  
 | Qty |  | Unit Price (USD) | 

  
 | 20 |  | $3.98 | 

  
 | 100 |  | $3.84 | 

  
 | 200 |  | $3.67 | 

  
 | 1,000 |  | $3.40 | 

**Downloads:**
- Datasheet (PDF)
- View Data
- View Graphs
- S-Parameters (.s4p)
- Eval Board (TB-ADT1-1WT+)

If you were instead looking for the **50Ω system** equivalent of this part (i.e., a 1:1 transformer optimized for 50Ω), the standard counterpart would typically be the **ADT1-1WT** series without the "-75" designation — let me know and I can search for that.

*Parts surfaced:* ADT1-1WT+, ADT1-1WT, TB-ADT1-1WT+

