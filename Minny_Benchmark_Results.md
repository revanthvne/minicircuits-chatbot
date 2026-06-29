# Mini-Circuits Chatbot (Minny) — Benchmark Results

Every one of the 100 benchmark questions was run through the live Minny assistant (model: claude-sonnet-4-6, with live Mini-Circuits catalog search and product-detail lookups). Answers below are verbatim from the bot.

## Summary

- **Answered: 96 / 100**
- **Did not complete: 4** (Q14, Q34, Q40, Q64) — on these the model looped on catalog/detail lookups and never returned text (see note at the end).
- **Total tokens consumed (incl. retries & failures): 2,369,268 input + 72,040 output**
- **Total benchmark cost: ~$8.19** (Sonnet 4.6 @ $3/M in, $15/M out) — averaging ~$0.082 per question.

---

## Amplifiers (LNAs, Power Amplifiers, Gain Blocks)

### Q1. What is the exact OIP3 of the PGA-103+ when operated at 2 GHz with a 5V supply, and how does it degrade at 85C?

Good question — but I have to be straight with you: the product details tool returns pricing, stock, and file links, not tabulated RF specs. It cannot give me the specific OIP3 value at 2 GHz / 5V, nor a temperature derating curve for 85°C.

**Here's what I can say with confidence:**

- I do **not** have the numerical spec in front of me right now, so I will not invent a number. Quoting a made-up OIP3 — even a plausible-sounding one — would be worse than useless for a real design.
- The authoritative source for both the nominal OIP3 and any temperature performance data is the **datasheet** and the **measured data / graphs** files:

  
- Datasheet (PDF) — look for the IP3 vs. Frequency table and the IP3 vs. Temperature graphs
  
- View Data (PDF) — tabulated electrical performance
  
- View Graphs (PDF) — typically includes OIP3, gain, NF vs. frequency and temperature

**What to look for in the datasheet:**
- The spec table will list OIP3 at one or more test frequencies — check if 2 GHz is one of them, or interpolate from adjacent points.
- The "Typical Performance" graphs often include **OIP3 vs. Temperature**, which will show you the derating from 25°C to 85°C directly.

If you pull the datasheet and want help interpreting the numbers, calculating cascaded IIP3, or comparing to another part, I'm happy to work through that with you.

*Parts surfaced:* PGA-103+

### Q2. I hooked up a ZHL-42W and it's getting extremely hot even with no RF input. What did I break?

I wasn't able to pull up the ZHL-42W datasheet directly from the catalog search, but I know the ZHL family well enough to give you solid troubleshooting guidance — and "extremely hot with no RF input" is a classic bias/power supply problem, not an RF problem. Here's what to check:

**Most likely causes, in order:**

1. **Wrong supply voltage / polarity**
The ZHL-42W is a high-power connectorized amplifier that runs from a DC wall supply (typically +24 V or +28 V, supplied via a rear-panel barrel connector). If the voltage is too high, or polarity is reversed, the internal bias circuitry will dissipate far more power than normal — and it will get very hot immediately with no RF present.

→ Check: Is your supply voltage correct per the label on the unit? Is the polarity correct (center-positive)?

2. **Supply current way over spec**
Measure the DC current draw. If it's far above what the datasheet specifies at idle, the amplifier's bias circuit or one of the internal transistor stages has likely been damaged (often by a prior over-voltage or reverse-voltage event).

3. **Inadequate heatsinking / airflow**
The ZHL series draws significant quiescent current by design — these are Class A or AB biased amplifiers and they are normally warm to the touch even at idle. If you're running without the recommended heatsink or forced air, it can get quite hot even when operating correctly.

→ Check: Is the unit mounted to a heatsink or chassis? Is there airflow?

4. **Internal oscillation**
If the output is not properly terminated (50 Ω load) and the input is open, some high-gain amplifiers can self-oscillate, which dramatically increases dissipation.

→ Check: Are both ports terminated with 50 Ω loads when testing?

**Bottom line:** Power down the unit immediately if it's running extremely hot. Measure your supply voltage and current draw, and compare to the values printed on the unit or in the datasheet. If the current is way over spec, the unit has likely been damaged.

For the exact datasheet (with Vcc, Icc, and thermal specs), check the product page directly: ZHL-42W on Mini-Circuits.com

If after checking all of the above you believe the unit is damaged, our applications team can help assess it — .

### Q3. The datasheet for the Gali-74+ says it's a Darlington pair. Do I need an external RF choke to power it?

Good question — and the answer is **no, you don't need an external RF choke** for the GALI-74+.

Here's why: like all Mini-Circuits GALI-series InGaP HBT gain blocks, the GALI-74+ has its **bias network built into the chip**. The Darlington topology means DC bias is fed directly through the RF output pin (the collector/drain side), but the internal matching and biasing structure handles this. You bias it simply by connecting a resistor in series between your supply voltage and the RF output port — the resistor sets the operating current. No external RF choke required.

The recommended bias circuit is shown in the datasheet's application circuit:

- Place a series resistor between Vcc and the output (RFC) pad — value calculated for your target Icc and Vcc.

- Bypass the Vcc end of that resistor to ground with a decoupling capacitor (e.g. 100 nF ceramic).

- DC-block capacitors on both RF input and output as usual.

The formula to size the bias resistor is straightforward:

**R = (Vcc − Vd) / Icc**

where Vd is the device's operating voltage (from the datasheet) and Icc is the desired collector current. Check the datasheet's bias table for the recommended Vcc/Icc operating point for your gain/P1dB target.

Useful files for your design:

- Datasheet (PDF) — application circuit and bias resistor table are in there

- PCB Layout

- Eval Board TB-409-74+ — good reference for the complete bias network

The eval board schematic in particular is a great sanity-check — it shows exactly how Mini-Circuits recommends wiring the part up.

*Parts surfaced:* GALI-74+, TB-409-74+

### Q4. We are facing lead time issues on the ERA-2SM+. Do you have a direct drop-in replacement with identical footprint and DC bias?

Here's a complete picture.

---

**First, a note on the ERA-2SM+ itself:** Our system currently shows **more than 20,000 units in stock** with live pricing available. It may be worth verifying the lead time situation with your distributor or our sales team — .

---

**ERA-2SM+ key specs (WW107 package):**

- Frequency: DC – 6000 MHz

- Gain: 14.4 dB | NF: 4 dB | Output P1dB: 13 dBm | OIP3: 26 dBm

- Vcc: 3.4 V | Icc: 40 mA

- Package: WW107 (SOT-86, 4-lead)

---

**True drop-in alternatives — same WW107 footprint, same bias method (single supply via RF port choke):**

Within the ERA-xSM family (identical PCB layout 98-PL-075), the closest matches are:

**1. **ERA-1SM+**** — slightly lower gain option
- DC – 8 GHz | Gain: 10.9 dB | NF: 4.3 dB | OP1dB: 12 dBm | OIP3: 26 dBm
- Vcc: 3.4 V / 40 mA — identical bias to ERA-2SM+
- Broader bandwidth, lower gain. Good if your design can tolerate –3.5 dB less gain.

**2. **ERA-3SM+**** — higher gain option
- DC – 3 GHz | Gain: 18.7 dB | NF: 3.5 dB | OP1dB: 12.5 dBm | OIP3: 25 dBm
- Vcc: 3.2 V / 35 mA — nearly identical bias
- More gain, narrower bandwidth (3 GHz). Suitable if your operating band is ≤ 3 GHz.

**3. **ERA-4SM+**** — higher power option
- DC – 4 GHz | Gain: 13.4 dB | NF: 4.2 dB | OP1dB: 17.3 dBm | OIP3: 34 dBm
- Vcc: 4.5 V / 65 mA — requires a higher bias voltage; bias resistor change needed
- Similar gain, significantly better linearity. Note the Vcc difference.

---

**Bottom line:** If you need a true no-touch drop-in (same gain, same Vcc/Icc, same footprint), there isn't a perfect 1:1 substitute within the ERA family — the ERA-2SM+ is somewhat unique at 14.4 dB / 3.4 V. The **ERA-1SM+** is the closest electrically with identical Vcc/Icc and the same PCB land pattern, just with 3.5 dB less gain and wider bandwidth.

ERA-2SM+ Datasheet (PDF) | ERA-1SM+ Datasheet | ERA-3SM+ Datasheet

*Parts surfaced:* ERA-2SM+, ERA-1SM+, ERA-3SM+, ERA-4SM+

### Q5. Cascading three PMA3-83LN+ amplifiers. I'm seeing terrible gain ripple and oscillation around 5GHz. Using 50 ohm traces. Ideas?

Good — here's what's likely going on, based on the PMA3-83LN+ characteristics and classic cascaded-amp failure modes.

---

**Root Causes to Check, in Priority Order**

**1. Output–Input re-coupling (the most likely culprit)**

Three high-gain stages in series means the total forward gain is ~60–75 dB depending on frequency. At 5 GHz, even −65 dB of feedback from stage 3's output back to stage 1's input is enough to oscillate. Common paths:

- **Shared Vcc supply trace / insufficient inter-stage bypassing.** This is the #1 cause. Each stage needs its own local bypass network, ideally a π-filter (e.g. 100 pF + ferrite bead/RF choke + 100 pF) right at the Vcc pin. A single bulk cap shared across all three stages is essentially a feedback highway at RF.
- **Ground loop / shared ground inductance.** Any shared ground impedance between stages at 5 GHz (even 0.5 nH = ~15 Ω) is enough. Each stage needs its own short, low-inductance via cluster to the ground plane.
- **Board-level RF leakage.** At 5 GHz, λ/4 ≈ 15 mm in FR4. Traces routed near each other or between stages can capacitively couple tens of dB of feedback. Route stage outputs well away from stage inputs; consider inter-stage shield walls or absorber.

**2. S22/S11 mismatch-induced ripple**

The PMA3-83LN+ is a wideband MMIC. Its S11 and S22 are not perfectly 50 Ω across the whole band — at 5 GHz the inter-stage reflection mismatch between stages creates a standing wave that produces gain ripple. Fixes:
- Add a **small fixed attenuator (3–6 dB) between stages** — this directly improves the inter-stage match and buys ripple reduction at the cost of insertion gain. Often worth it when you have gain to spare.
- Or add a **series resistor isolator pad** (Mini-Circuits makes SMT attenuators in 0402/0603 that work well here).

**3. PCB layout — follow the eval board closely**

Mini-Circuits provides the PCB Layout (98-PL-456) and the Eval Board TB-830A+ — if your layout deviates from these, that's where to look. The eval board is also available as a Gerber file to compare directly.

**4. Unconditional stability margin**

Pull the S-parameters (.s2p) and compute the **Rollett K-factor and μ-factor** for a single stage in your simulator. Then cascade all three and check the combined S21 magnitude vs. your loop gain estimate. If K < 1 at any frequency, you need external stabilization (series gate resistor, shunt resistor to ground, or an inter-stage absorptive pad).

---

**Quick Triage Steps**

1. Probe Vcc at each stage with a scope — if you see RF on the supply, bypassing is the problem.
2. Remove stage 2 and 3, test stage 1 alone — clean? Add stage 2. Oscillation appears? The stage 1→2 inter-stage or supply is the issue.
3. Drop a 3 dB SMT pad between stages 1–2 and 2–3 and retest — if ripple improves dramatically, it's an impedance mismatch / loop gain problem.
4. Check your 50 Ω trace width in FR4 at 5 GHz — make sure the via transitions to ground plane are tight.

---

**Useful files for this part:**
- Datasheet (PDF)
- View Graphs (PDF)
- S-Parameters (.s2p)

Want me to search for a compatible inter-stage attenuator or isolator pad in the right size/power level to help stabilize the cascade?

*Parts surfaced:* PMA3-83LN+, TB-830A+

### Q6. whats the max input power for the little blue amplifier block before I fry it?

I want to make sure I point you to the right part. "Little blue amplifier block" could refer to a few different Mini-Circuits models — can you give me the part number? It's usually printed on the case (e.g., ZX60-33LN+, PGA-103+, etc.).

If you can't read it, any of these details will help narrow it down:

- **Frequency range** (rough is fine)
- **Gain** (approximate)
- **Connector type** (SMA, BNC, etc.) or package size

*Parts surfaced:* PGA-103+

### Q7. Why does noise figure matter if I can just add more gain later in the chain?

Great question — this is one of the most common misconceptions in RF system design. The short answer: **gain doesn't fix noise; it amplifies it.**

Here's why:

**The Friis equation tells the whole story:**

NF_total = NF₁ + (NF₂ − 1)/G₁ + (NF₃ − 1)/(G₁·G₂) + …

Every stage adds noise, but each contribution is *divided* by all the gain that came before it. That means the **first stage dominates** — and there's no recovering from a noisy first stage by adding gain later.

**A concrete example:**

Say you have two options for a front end:
- **Chain A:** LNA with NF = 1 dB, G = 20 dB → followed by a 10 dB NF amp
- **Chain B:** Skip the LNA, go straight to the 10 dB NF amp

Chain A NF:
> NF₁ = 1 dB (linear: 1.26), G₁ = 20 dB (linear: 100), NF₂ = 10 dB (linear: 10)
> NF_total = 1.26 + (10 − 1)/100 = 1.26 + 0.09 = **1.35 linear → ~1.3 dB**

Chain B NF:
> NF_total = **10 dB** — full stop.

Adding 40 dB of gain *after* that noisy first amp gives you a loud, amplified noisy signal. The SNR at the output is still degraded by 10 dB relative to what you put in.

**The core principle:**

Noise added early in the chain is **irreversible**. Once a weak signal is buried in noise, no amount of downstream gain can dig it out — you're just making the noise louder along with the signal. SNR can only stay flat or get worse as you move down a receive chain; it never improves.

**Practical implications:**
- Place your best (lowest NF) LNA as close to the antenna as possible — before any cables, switches, or filters that add loss
- Even a 0.5 dB cable loss *before* the LNA adds 0.5 dB to your system NF directly
- A lossy component (IL = L dB) with NF = L dB placed before the LNA is just as damaging as a noisy amplifier

So, more gain later helps with sensitivity budgets in terms of signal level, but it **cannot buy back lost SNR**. That's why front-end NF is one of the most critical specs in any receive system design.

Want help running a Friis budget for your specific chain, or finding a low-NF LNA for your band?

*Parts surfaced:* Cables

### Q8. Does the ZVE-3W-83+ require a sequenced bias turn-on (negative gate voltage before positive drain)?

Great question — and an important one for GaN/FET-based power amplifiers. The ZVE-3W-83+ datasheet is the definitive source for its bias sequencing requirements, since those details aren't surfaced in the catalog data I can pull here.

**What I can tell you in general:**

The ZVE-3W-83+ is a high-power connectorized amplifier. Whether it uses a GaN HEMT (which *does* require negative gate bias before drain) or an internally regulated design (which handles sequencing internally and just needs a single supply) depends on its internal topology — and that detail lives in the datasheet.

**What to check in the datasheet:**

1. **Bias/sequencing section** — look for a "Bias Sequence" or "Power Up/Down" section. If sequencing is required, it will be called out explicitly.
2. **Supply pins** — if only a single +Vcc is specified with no gate voltage pin, sequencing is handled internally.
3. **Application notes** — some Mini-Circuits ZVE-series amps include a recommended bias circuit schematic.

**Links for the ZVE-3W-83+:**

- Datasheet (PDF)
- View Data
- Product Page

If after reviewing the datasheet you're still unsure, our applications team can confirm the correct power-up sequence and recommend a protection circuit if needed — .

*Parts surfaced:* ZVE-3W-83+

### Q9. Is the PHA-1+ RoHS compliant and do you have the REACH SVHC declaration?

Good news — the product page includes an Environmental Rating document for the PHA-1+, which covers exactly what you're asking about.

**RoHS & REACH SVHC — PHA-1+**

The environmental compliance declaration is available here:
Environmental Rating — ENV08T1 (PDF)

That document (Mini-Circuits' standard ENV08 form) covers:
- **RoHS compliance status**
- **REACH SVHC declaration**
- **Halogen-free / conflict minerals** and other environmental declarations

Rather than me paraphrasing the exact compliance language, I'd recommend downloading that PDF directly — it's the official declaration and will have the precise wording you'll need for your compliance records.

If you need a countersigned version or a specific format for your customer/regulatory submission, that's something our compliance team can help with — .

*Parts surfaced:* PHA-1+

### Q10. My ZX60-P103LN+ isn't turning on. I'm applying 5V. Is there a minimum current I need to supply?

Good question. The **ZX60-P103LN+** is a connectorized LNA, and the datasheet has the full bias specs. I don't have the current draw value directly in the product data returned here, but here's what I can tell you:

**5V is the correct supply voltage** for this part — you're right on that. The typical quiescent current (Icc) is listed in the datasheet, so I'd recommend checking that first to confirm your supply can source enough current.

A few things to check:

1. **Current capability of your supply** — LNAs like this can draw anywhere from tens to hundreds of mA. If your supply is current-limited (e.g. a bench supply set to a low current limit, or a weak regulator), the voltage may appear correct on a meter but collapse under load. Check your supply's current limit setting and what it's actually sourcing.
2. **Bias pin / RF port** — The ZX60-P103LN+ is typically biased through the RF port via a bias tee (not a separate DC pin). Make sure you're injecting the 5V through a proper bias tee on the correct port, not just applying DC directly to the SMA with no choke.
3. **Polarity and connector integrity** — Confirm the center conductor is carrying the DC (not the shield), and the SMA connections are solid.
4. **Check the datasheet** for the exact Icc spec and operating conditions:

ZX60-P103LN+ Datasheet (PDF)

If after checking the datasheet everything looks correct on paper but it still won't come up, it's worth checking whether the unit may have been damaged by ESD or a transient overvoltage on the bias line. Let me know what you find and I'm happy to dig further.

*Parts surfaced:* ZX60-P103LN+

## Filters (Low Pass, High Pass, Band Pass, Reflectionless)

### Q11. I am cascading two XBF-24+ reflectionless filters. What is the expected insertion loss at 2.4 GHz, and do I need an isolator between them?

Good — I have the product details. The tool returns pricing and files but not the full tabular S-parameter data inline, so let me reason from what the XBF-24+ datasheet specifies (and what the "View Data" file confirms) for the 2.4 GHz band filter.

Here's a complete answer to both questions:

---

**Insertion Loss at 2.4 GHz — Two Cascaded XBF-24+**

The XBF-24+ is a bandpass filter centered near 2.4 GHz. At the center of the passband the typical insertion loss is on the order of what the datasheet specifies — **please verify the exact passband IL value from the datasheet**, since the live tool does not return tabular S-parameter numbers inline.

For cascading, the rule is simple:

> **IL_total = IL₁ + IL₂** (in dB, assuming well-matched 50 Ω interfaces)

So if the passband IL of a single unit is, say, X dB, two in series will give **2X dB** at 2.4 GHz. Check the "View Data" or "View Graphs" PDF for the precise IL at your exact frequency of interest — the S-parameter file (.s2p) is also available for simulation.

Datasheet (PDF) | View Graphs | S-Parameters (.s2p)

---

**Do You Need an Isolator Between Them?**

Short answer: **No — and that's precisely the advantage of reflectionless filters.**

Here's why this matters:

- A conventional filter reflects stopband energy back toward the source. When you cascade two of them, the reflected signals from the second filter bounce off the first filter's output port, creating **ripple, group delay distortion, and potential oscillation** in any active stages upstream. That's where an isolator is traditionally used — to absorb those re-reflections.

- The **XBF-24+** is a reflectionless (absorptive) design. Both its passband and stopband signals are **absorbed internally** — S11 and S22 remain well-matched (typically ≥15 dB return loss) across the full frequency range, both in-band and out-of-band.

- **Consequence for cascading:** Because neither unit presents a significant reflection at its ports in the stopband, re-reflection between the two stages is suppressed by design. You get **additive stopband rejection** without the inter-stage mismatch problems of conventional filters. No isolator is needed.

**Practical note:** The two-stage cascade roughly doubles the stopband rejection (in dB) relative to a single unit — that's the main reason to cascade reflectionless filters. The passband IL does add directly, so factor that into your link budget.

---

**Downloads for XBF-24+**

- Datasheet (PDF)

- View Data (PDF)

- View Graphs (PDF)

- S-Parameters (.s2p) — for cascade simulation in ADS/Keysight/etc.

- Eval Board TB-968-24+

For an accurate cascade simulation, I'd recommend importing the .s2p file into your simulator and connecting two instances in series — that gives you the exact combined IL and rejection at every frequency point.

*Parts surfaced:* XBF-24+, TB-968-24+

### Q12. Using a VLF-1000+ low pass filter but I'm still seeing a huge spur at 3GHz. I thought it blocked everything above 1 GHz?

Good question — and a common trap with LC low-pass filters. Here's what's likely happening:

**LTCC/LC filters have a stopband that wraps around at high frequencies.** The VLF-1000+ is specified with a passband to ~1000 MHz and a stopband in a defined window above that — but it does **not** maintain rejection all the way to 3 GHz and beyond. At some point the filter's response degrades (due to parasitic capacitance, inductance, and resonances in the structure) and the rejection rolls back up, creating "leakage windows" at higher frequencies.

Check the View Graphs and S-parameters swept out to 3+ GHz — you'll almost certainly see the rejection recover (get worse) well before 3 GHz.

**What to do:**

1. **Stack a second filter.** Cascade a high-frequency low-pass (e.g., a filter with good rejection specifically at 3 GHz) after the VLF-1000+. The two stopbands multiply in linear power, so even moderate rejection in each adds up.

2. **Use a filter specified to 3 GHz.** Look for a low-pass with a cutoff around 1 GHz but with rejection characterised and guaranteed out to 3 GHz or beyond.

3. **Check your layout.** At 3 GHz, board parasitics and ground return paths can bypass the filter entirely via radiation or poor isolation between input and output traces. Even a perfect filter can be bypassed by a bad PCB layout.

Would you like me to find a low-pass filter with confirmed stopband coverage through 3 GHz, or help you identify a good second-stage filter to stack with what you have?

*Parts surfaced:* VLF-1000+

### Q13. What is a reflectionless filter and why is it better than a normal one?

## Reflectionless Filters — What They Are and Why They Matter

**The problem with conventional filters**

A standard filter works by *reflecting* out-of-band energy back toward the source. In the stopband, the impedance match collapses — the filter looks like an open or short circuit. That reflected energy doesn't disappear; it bounces back up the signal chain and can:

- Re-mix in an upstream amplifier or mixer, generating new spurious products
- Cause gain ripple or instability in cascaded stages
- Degrade the output spectrum of a transmitter
- Make system-level spurious performance hard to predict or fix

**What a reflectionless filter does differently**

A reflectionless filter (Mini-Circuits' trademarked design is the **"X" series**) absorbs out-of-band energy internally rather than reflecting it. The topology uses a complementary pair of filter networks — the stopband energy of one is the passband of the other, and vice versa — connected so that the port impedance remains matched (nominally 50 Ω) *across all frequencies*, both passband and stopband.

The result: **S11 and S22 are low (well-matched) everywhere**, not just in the passband.

**Why that's better in practice**

| Situation | Conventional Filter | Reflectionless Filter |
|---|---|---|
| Stopband impedance | Poor (high VSWR) | Well-matched (≈50 Ω) |
| Upstream spurious re-mixing | Yes — reflected energy re-enters active stages | No — absorbed internally |
| Cascading sensitivity | Stage interactions can be unpredictable | Clean, predictable cascade |
| Transmitter spectral purity | Harmonics can reflect and intermodulate | Harmonics are absorbed |
| System debug complexity | High | Lower |

**When to choose one**

Reflectionless filters are especially valuable when:
- An active device (LNA, mixer, PA) sits directly upstream — reflected stopband energy causes the most harm there
- You need very clean spurious/harmonic performance in a transmitter chain
- You're cascading multiple filters and want predictable combined response
- The system is sensitive to VSWR-induced gain ripple

**When a standard filter is fine**

If there's a well-matched pad or isolator between the filter and any active stage, reflected energy is absorbed there anyway, and a standard filter may be simpler or lower-cost.

---

Want me to find reflectionless filters for a specific frequency range or application? Just give me the band and filter type (low-pass, high-pass, band-pass) and I'll pull up the best matches.

### Q14. Need an LTCC bandpass filter centered around 5.8 GHz. Must be surface mount. What are the options?

> ⚠️ **No answer returned.** The assistant repeatedly called the catalog/product-detail tools and exhausted its tool-use budget before producing a reply. (This is a product-discovery query that matches many parts; see closing note.)

### Q15. What is the group delay variation across the passband for the BBP-10.7+? We are sensitive to phase distortion.

The product detail API doesn't return a numeric group delay variation value — that spec isn't surfaced in the structured data. Here's what I'd recommend to get the answer precisely:

**Best sources for group delay on the BBP-10.7+:**

1. View Graphs (PDF) — Mini-Circuits typically includes a group delay vs. frequency plot here. This is your fastest path.
2. View Data (PDF) — Tabulated S-parameter and performance data across frequency, which you can use to compute group delay variation manually if needed.
3. S-Parameters (.s2p) — If you load the Touchstone file into your simulator (ADS, AWR, etc.), it will compute group delay directly from the phase of S21. This gives you the most detailed, quantitative answer.
4. Datasheet (PDF) — Check for any group delay spec in the electrical table.

**A practical note:** The BBP-10.7+ is a cavity bandpass filter centered at 10.7 MHz with a relatively narrow bandwidth. Cavity filters generally exhibit parabolic group delay peaking near the band edges — variation can be significant across the passband. If your application is sensitive to phase distortion (e.g., FSK/PSK demodulation, analog IF chains), it's worth reviewing the S-parameter-derived group delay plot carefully, or considering a Bessel/linear-phase filter topology if flatness is critical.

If you'd like help interpreting the S-parameter data or evaluating alternative filters with better group delay flatness, just let me know.

*Parts surfaced:* BBP-10.7+

### Q16. the ceramic filter cracked when we soldered it. do these need a specific reflow profile?

Yes, ceramic filters (and ceramic components in general) are susceptible to thermal shock cracking during soldering. A few things to check:

**Likely causes of cracking:**

1. **Too-fast ramp rate** — Ceramics don't tolerate sudden temperature changes well. If the board goes from room temp to peak reflow too quickly, differential thermal expansion cracks the component.
2. **Too-high peak temperature** — Exceeding the rated peak soldering temperature stresses the ceramic body.
3. **Cold-board handling after reflow** — Setting a hot board on a cold surface or blowing cool air over it can also crack ceramics.

**Recommended reflow guidelines for Mini-Circuits ceramic filters:**

Most Mini-Circuits LTCC/ceramic SMT components follow the **JEDEC J-STD-020** compatible profile:

| Phase | Parameter | Typical Limit |
|---|---|---|
| Preheat ramp | Rate | ≤ 3°C/sec |
| Soak zone | 150–200°C | 60–120 sec |
| Reflow ramp | Rate | ≤ 3°C/sec |
| Peak temperature | Top of reflow | 245–260°C (SAC305) |
| Time above liquidus (217°C) | | ≤ 60 sec |
| Cooling ramp | Rate | ≤ 4°C/sec |

**Key rules of thumb:**
- **Max ramp rate: 3°C/s up and down** — this is the most common cause of ceramic cracking
- **Controlled cooling** — let the board cool naturally or on a warm rail; don't force-cool it
- **Preheat is critical** — a good soak at 150–180°C equilibrates the board before the final ramp
- **Check your oven profile** vs. the specific component datasheet — the datasheet will list the exact rated peak temp for that part

**To confirm the exact profile for your specific part**, the datasheet is the authoritative source. If you let me know the part number, I can pull it up and link you to the datasheet directly.

What filter are you working with?

### Q17. Can the ZVBP-909M-S+ handle 10W of CW RF power in the stopband, or will it melt?

I wasn't able to locate **ZVBP-909M-S+** in the Mini-Circuits catalog — neither a direct lookup nor a keyword search returned that part number. It's possible there's a typo or slight variation in the part number.

A couple of things to check:

- **ZVBP** is a valid Mini-Circuits prefix for cavity bandpass filters (connectorized). Did you perhaps mean something like **ZVBP-909+** or a similar variant without the "-S" suffix?
- The "-S+" suffix sometimes indicates a surface-mount version, but cavity filters in this family are typically connectorized (SMA).

Could you double-check the part number — perhaps from the datasheet label or your order history? If you can confirm the exact part number, I'll pull the live specs and give you a definitive answer on the power handling.

Alternatively, if you'd like me to search for 909 MHz cavity bandpass filters more broadly, just say the word and I'll find the closest matches.

### Q18. How do I read the return loss graph on a high pass filter datasheet?

Good question — return loss graphs are one of the most useful (and sometimes misread) parts of a filter datasheet. Here's how to interpret them:

**What return loss (RL) measures**

Return loss tells you how well the filter's port is matched to your system impedance (typically 50Ω) at each frequency. It's the ratio of reflected power to incident power, expressed in dB:

> RL (dB) = −20 · log₁₀(|Γ|)

A **higher number = better match = less reflected power**. 20 dB RL means only 1% of power is reflected; 10 dB means ~10%.

---

**Reading the graph — region by region**

For a high-pass filter, the graph typically shows two very different behaviors:

**1. Passband (above cutoff)**
- RL should be **high** — typically >15–20 dB for a well-designed filter.
- This means the filter looks like a good 50Ω load and passes signal efficiently.
- Watch for ripple here (especially in Chebyshev designs) — each dip in RL is a small reflection.

**2. Stopband (below cutoff)**
- RL will be **very low** — often 0–3 dB.
- This is expected and correct. The filter is intentionally reflecting (or absorbing) the signal. A low RL in the stopband does NOT mean it's mismatched in a harmful way — it means the filter is doing its job.
- Exception: **reflectionless filters** are specifically designed to maintain good RL even in the stopband. Mini-Circuits' X-series filters do exactly this.

**3. Transition region (near cutoff)**
- RL degrades here — this is normal. The impedance is changing rapidly as the filter transitions from pass to stop.

---

**Key things to check**

| What to look for | Why it matters |
|---|---|
| Passband RL > 15 dB | Ensures <3% reflected power in-band |
| RL reference port (input or output?) | Some datasheets plot both S11 and S22 |
| Frequency axis scale (linear vs log) | Log scale stretches the low end — common for HPFs |
| Whether it's a reflective or reflectionless filter | Changes what stopband RL means for your system |

---

**Quick conversions**

- RL 20 dB → VSWR 1.22:1 → 1% reflected power
- RL 15 dB → VSWR 1.43:1 → 3.2% reflected power
- RL 10 dB → VSWR 1.92:1 → 10% reflected power
- RL 6 dB → VSWR 3.0:1 → 25% reflected power

---

**Practical tip:** If you're cascading a HPF with a sensitive amplifier or mixer, pay close attention to passband RL near the cutoff edge. Poor match there can cause gain ripple or stability issues in the downstream stage. If stopband reflections are a system concern, look at Mini-Circuits' reflectionless filter series.

Want me to pull up a specific filter or datasheet to walk through a real example?

### Q19. What is the export control classification number (ECCN) for the cavity filters?

ECCN classifications aren't something I have access to directly — that's export compliance territory rather than RF applications.

For accurate ECCN information on Mini-Circuits cavity filters (or any product), I'd recommend reaching out to Mini-Circuits directly through their website: Contact Mini-Circuits. Their export compliance or sales team can provide the official ECCN for specific part numbers.

### Q20. I put a filter backwards. Does it matter which port is in and out?

Great question — and the answer depends on the filter type.

**For most passive filters (LC, LTCC, cavity, etc.): no, it generally doesn't matter.**

Passive filters are reciprocal networks. A signal traveling from Port 1 → Port 2 sees the same insertion loss and frequency response as one going Port 2 → Port 1. Swapping input and output won't change filtering performance.

**Exceptions where it *can* matter:**

1. **Filters with built-in amplifiers (active filters)** — these are non-reciprocal by nature. Input and output are distinct.

2. **Absorptive / reflectionless filters** — these are designed so the *input* port is matched (terminated) in the stopband, while the *output* port reflects. Swapping them can change the impedance match your source sees in the stopband, which may affect adjacent circuitry (e.g., cause an upstream amplifier to see a bad load).

3. **Filters with integrated DC paths or bias lines** — if the filter passes DC on one port for biasing purposes, orientation matters.

4. **Asymmetric structures (e.g., some cavity or waveguide filters)** — physically asymmetric designs may have slightly different port match (S11 vs S22), even if insertion loss is symmetric. Check the datasheet S-parameters if stopband match is critical.

**Practical bottom line:**
- Standard SMT or connectorized passive filter (LC, LTCC, bandpass, lowpass, etc.)? You're fine either way.
- Reflectionless or active filter? Orient it as marked.

If you tell me the specific part number, I can pull up its datasheet and confirm.

## Mixers (Double Balanced, I/Q, Level 7/10/13/17)

### Q21. If I drive the ADE-1L+ with an LO of +3 dBm instead of the recommended +7 dBm, how much will my conversion loss degrade?

The product details API returns specs like frequency range and pricing, but the conversion loss vs. LO drive level curve is only in the graphical data — not in the structured spec fields. Here's what I can tell you honestly:

**What the datasheet confirms:**
The ADE-1L+ is rated for a **+7 dBm LO drive level**, with a typical conversion loss spec tied to that condition. The exact delta at +3 dBm isn't a number I can give you from the returned data — I won't invent it.

**What physics tells us (general mixer behavior):**
For a passive diode-ring mixer like the ADE-1L+, conversion loss is a function of how well the LO pumps the diodes into their switching state. Running 4 dB below the rated LO level typically causes:

- **~1–2 dB additional conversion loss** — the diodes don't switch as sharply, so the mixing action is less efficient.
- **Worse port-to-port isolation** (LO→RF, LO→IF) — again, because the diodes aren't fully commutating.
- **Reduced linearity headroom** (lower IP3/P1dB), since the junction conductance swing is smaller.

The degradation is usually mild at 4 dB below optimum for a Level 7 device, but it's not zero. The "View Graphs" document will have the actual **Conversion Loss vs. LO Power** curve for the ADE-1L+ specifically — that's the authoritative answer:

View Graphs (PDF) — look for the CL vs. LO Level plot.

**Bottom line:** Expect roughly 1–2 dB more conversion loss and some isolation degradation at +3 dBm LO, but check the graph above for the exact number at your frequency of interest. If your system budget can absorb that, it's usually workable — just don't expect rated IP3 performance either.

*Parts surfaced:* ADE-1L+

### Q22. I'm getting LO leaking directly into my IF port. Using a level 13 mixer. Is it broken?

Not necessarily — LO-to-IF leakage is normal and expected in any mixer. Here's how to think through it:

**What's happening physically**

In any double-balanced mixer, the LO signal is nominally cancelled at the IF port by the balanced diode/quad structure. But real-world port-to-port isolation is finite — typically 20–40 dB depending on the design. Some LO always leaks through.

**Common causes (not a broken part)**

1. **Normal isolation spec** — Check your mixer's LO→IF isolation spec in the datasheet. If your leakage is within that spec, the part is working correctly.
2. **Board layout** — Unbalanced traces, ground plane gaps, or poor RF return paths break the electrical symmetry and degrade isolation beyond the datasheet spec.
3. **LO drive level** — Running significantly above the rated drive (Level 13 = +13 dBm) can drive diodes asymmetrically and worsen isolation.
4. **IF port filtering** — The IF port has no inherent image or LO rejection filter. A low-pass or band-pass filter on the IF output is standard practice to remove LO feedthrough before your IF chain.
5. **LO power imbalance into the hybrid/transformer** — If the 180° hybrid or balun driving the LO port is mismatched or unbalanced, cancellation at IF degrades.

**Troubleshooting steps**

1. Measure your LO→IF leakage (dBm at IF port with no RF applied) and subtract your LO drive level. That gives you actual isolation in dB.
2. Compare to the datasheet isolation spec. If you're within spec, the mixer is fine — add a filter.
3. Check your PCB layout: symmetry around the IF balun, ground vias, trace lengths.
4. Verify LO drive is at +13 dBm — not significantly higher.
5. Confirm your IF filter cutoff is below the LO frequency.

**Bottom line:** LO-to-IF leakage is almost never a sign of a broken mixer. The fix is almost always an IF low-pass filter and/or layout improvement.

If you share the part number you're using, I can pull up the datasheet and check the specified LO→IF isolation so we can compare against what you're measuring.

### Q23. What does "Level 7" mean for a mixer? Does it need 7 volts?

Good question — it has nothing to do with voltage.

**"Level 7" refers to the LO drive power required by the mixer, specifically +7 dBm.**

Mini-Circuits (and the RF industry broadly) use a level notation where the number is the LO input power in dBm:

| Level | LO Drive Power |
|-------|---------------|
| Level 3 | +3 dBm |
| Level 7 | +7 dBm |
| Level 10 | +10 dBm |
| Level 13 | +13 dBm |
| Level 17 | +17 dBm |
| Level 23 | +23 dBm |

**Why does it matter?**

The LO drive level is a key design parameter because:

- **Too low** → mixer operates in an under-driven regime; conversion loss increases and port-to-port isolation degrades.
- **Too high** → you waste DC power (in active designs) or risk damaging the diodes (passive designs). The improvement in linearity above the rated level is minimal.
- **At the rated level** → the diodes switch properly, giving you the specified conversion loss, isolation, and linearity (IIP3, P1dB).

**Practical implication:** A Level 7 mixer needs a **+7 dBm LO source**. If your synthesizer or VCO puts out +13 dBm, you'd add a fixed attenuator on the LO port to bring it down to +7 dBm. If it only puts out +3 dBm, you'd need an LO amplifier.

Higher-level mixers (Level 13, 17) generally offer better linearity and IP3 at the cost of needing a more powerful — and often more expensive — LO driver.

Want help selecting a mixer for a specific application? I can search the catalog if you share your frequency plan and LO drive level.

### Q24. Need a frequency mixer that takes 10 GHz down to baseband. Connectorized preferred.

Here are the key parameters I need to pin down before searching:

To find the right **mixer** for your 10 GHz downconversion, fill in what you know (leave blank / "any" if unsure):

- **RF frequency:** 10 GHz ✓
- **IF (output) frequency:** Baseband — what's your target IF range? (e.g., DC–1 GHz, DC–500 MHz?)
- **LO frequency:** ~10 GHz (same as RF, depending on IF) — confirm or specify
- **LO drive level:** +7, +10, +13, +17 dBm?
- **Passive vs. active mixer:** passive preferred / active / don't care
- **Connector type:** SMA, 2.92mm (K), 3.5mm, other?
- **Single-ended or IQ (image-reject/SSB)?**

Reply with whatever you've got and I'll find the best matches.

### Q25. What is the phase and amplitude unbalance between the I and Q ports on the ZX95-100-S+?

The **ZX95-100-S+** is a VCO, not an IQ splitter or quadrature hybrid — it does not have I and Q output ports. There are no phase or amplitude unbalance specs for this part because that parameter simply doesn't apply to it.

If you're looking for something different, here are a couple of possibilities:

- **You meant a different part number** — perhaps a 90° hybrid coupler or an IQ mixer/modulator? If so, share the correct part number and I'll look it up.
- **You need a 90° hybrid/quadrature splitter** with characterized I/Q amplitude and phase balance — I can help you find one if you give me your frequency and system requirements.

Datasheet for ZX95-100-S+ (PDF)

*Parts surfaced:* ZX95-100-S+

### Q26. Using the MAC-85L+. I'm sweeping the RF from 1 to 5 GHz with a fixed LO at 6 GHz, but the IF power keeps dipping at 3 GHz. Why?

Good question — this is a classic image/spur issue, and the answer is straightforward once you map out the mixer products.

**The culprit: RF = LO/2 = 3 GHz**

With your LO fixed at 6 GHz, when RF sweeps through **3 GHz**, you hit the condition RF = LO/2. Here's what's happening:

**Two mechanisms collide at that exact point:**

1. **LO second-harmonic mixing**
The mixer (like any diode-based design) generates LO harmonics internally. The 2nd harmonic of your 6 GHz LO = 12 GHz. But more importantly, your 6 GHz LO also mixes with itself — any LO feedthrough that re-enters the RF port mixes with the incoming 3 GHz RF signal via the 2×RF term:

2 × RF = 2 × 3 GHz = 6 GHz = LO → this generates a DC or near-DC IF spur that robs energy from the desired IF output.

2. **IF = LO − RF = 6 − 3 = 3 GHz, and simultaneously IF = RF − LO/2...**
More directly: the desired IF at that point is **6 − 3 = 3 GHz**. That's a high IF frequency, but the real problem is the **even-order (2nd-order) intermodulation**: the mixer produces a strong **2×RF** term, and when RF = 3 GHz, 2×RF = 6 GHz lands right on top of the LO — causing strong re-conversion and gain compression specifically at that RF frequency.

3. **Half-IF spur / sub-harmonic response**
RF = LO/2 is the classic **"half-IF" or sub-harmonic" trap**. The mixer responds to LO/2 as a sub-harmonic pump frequency, creating an anomalous conversion path that interferes destructively with the normal down-conversion, showing up as an IF power dip or null.

---

**What to do about it:**

- **High-pass filter on the RF port** — put a filter that rejects 2×RF products (or blocks the band around LO/2) if your application allows it.
- **LO frequency plan adjustment** — if you have flexibility, shift the LO so LO/2 falls outside your RF sweep range. E.g., LO at 6.5 GHz puts the half-LO at 3.25 GHz; you can then notch or avoid that sub-range.
- **Check LO drive level** — running the LO higher than spec can worsen even-order products. Verify you're within the MAC-85L+ recommended LO drive per the datasheet.
- **Balanced/image-reject topology** — if the system allows, an image-reject mixer or an IQ architecture suppresses even-order spurs more effectively.

The dip at exactly 3 GHz with a 6 GHz LO is essentially a fingerprint of this RF = LO/2 condition — it's the mixer's even-order response, not a hardware defect.

*Parts surfaced:* MAC-85L+

### Q27. Can I use the SIM-43MH+ as a phase detector if I drive both RF and LO ports at the same frequency?

Good — the part is confirmed and well-stocked. Here's the full picture:

---

**Using the SIM-43MH+ as a Phase Detector**

**Yes, this works** — and it's one of the classic applications of a double-balanced mixer (DBM). Here's the principle and what to watch for:

**How it works**

When you drive both RF and LO ports at the same frequency *f*, the IF output contains a DC (or low-frequency) term proportional to the cosine of the phase difference between the two signals:

> V_IF ∝ cos(Δφ)

- At Δφ = 90°, V_IF = 0 V (the "quadrature null" — most sensitive point)
- At Δφ = 0° or 180°, V_IF is at its positive or negative peak
- The slope around 90° gives you your phase detector gain (V/rad)

**Practical considerations**

1. **Signal levels** — Drive the LO port at its rated LO level (check the datasheet for the SIM-43MH+ operating range). The RF port signal should be well below the LO level to keep the mixer in its linear phase-detection regime. Overdriving RF compresses the output and degrades linearity.

2. **IF port filtering** — You need a low-pass filter on the IF output to remove the 2f component and pass only the DC/baseband phase-difference term.

3. **Frequency match** — Both signals must be at *exactly* the same frequency (coherent), otherwise you get a beat note at IF rather than a stable DC output. This is why this technique is used inside PLLs — the VCO and reference are locked to the same frequency.

4. **Phase ambiguity** — The cosine response means the detector is periodic over 360°; you can't distinguish Δφ from −Δφ near 0° or 180°. Operating near the 90° null gives maximum sensitivity and an unambiguous linear region of roughly ±90°.

5. **Port isolation** — The SIM-43MH+ is a double-balanced design, so LO-to-RF and LO-to-IF isolation will limit how much of one signal leaks into the other. Check the isolation specs in the datasheet to assess any self-mixing offsets.

6. **Frequency range** — Make sure your operating frequency falls within the SIM-43MH+'s specified RF/LO band. See the datasheet for exact limits.

---

**Resources for the SIM-43MH+**

- Datasheet (PDF)
- View Data
- View Graphs
- Product Page

Bottom line: the SIM-43MH+ is a perfectly valid phase detector for a PLL or phase-noise measurement setup. The key is coherent signals, proper LO drive level, and a clean low-pass filter on the IF output. Let me know if you'd like help sizing the IF filter or selecting a companion LNA/buffer.

*Parts surfaced:* SIM-43MH+

### Q28. What is an image rejection mixer and do you sell them?

The catalog search isn't surfacing a dedicated IRM product group. Honestly, **Mini-Circuits does not currently offer a pre-built image rejection mixer module** as a standard catalog item — the search confirms this across all keyword variations.

---

## What Mini-Circuits Does Offer Instead

You have a couple of practical paths:

**1. Build your own IRM sub-system** using Mini-Circuits components:

- **90° hybrid coupler** (e.g. QCL or PBRX series) for the quadrature splitting on RF and IF

- **Matched mixer pair** (e.g. from the ADE or MAC series) — two units with well-matched conversion loss

- This approach gives you full control over frequency coverage and LO drive level

**2. Custom / Reference Design route** — Mini-Circuits' engineering team has designed IRM-type subsystems for customers before. This would be a custom assembly engagement.

Custom Assembly Capabilities 

---

If you'd like help selecting the **mixer pair** and **90° hybrids** to build an IRM at your target frequency, I'm happy to do that — just share your RF, LO, and IF frequency ranges and your LO drive level.

### Q29. Looking for a dual mixer pack. We currently use two ADE-1s, is there a dual-core package?

Unfortunately, Mini-Circuits doesn't offer a dual-core package version of the ADE-1 — there's no "two mixers in one housing" variant in the catalog for that family. The ADE-1 (and its close relatives) come as individual single-core mixer ICs.

A couple of options worth considering:

**1. Stay with **ADE-1+** (or the current-generation variant)**
The ADE-1+ covers 0.5–500 MHz at Level 7 LO in the CD636 SMT case. If board space is the concern, the slightly smaller ****ADE-1ASK+**** (CD542 case, 2–600 MHz) may help pack them tighter on a PCB.

**2. Consider an IQ / image-reject mixer**
If the reason you're using two ADE-1s is to build an I/Q or image-reject downconverter, Mini-Circuits has dedicated IQ mixer modules that integrate two mixer cores with 90° hybrids — potentially a cleaner solution. Let me know the application and I can search those.

**3. Custom assembly**
For a true dual-mixer module (two ADE-1 cores in a single shielded housing), that would be a custom assembly — something the Mini-Circuits team can quote. 

Could you share a bit more about why you need two ADE-1s in the same package? (e.g., I/Q demodulation, image rejection, diversity, board space) — that'll help me point you to the best existing solution.

*Parts surfaced:* ADE-1, ADE-1+, ADE-1ASK+

### Q30. im seeing a lot of mixing products. 2RF-2LO, 3RF-LO. how do i get rid of them?

Good question — these are intermodulation (IM) and mixing spurious products, a classic mixer headache.

**What they are**

Mixers produce outputs at frequencies m·RF ± n·LO for integer m, n. The ones you're seeing:

- **2RF − 2LO** → second-order product (m=2, n=2)
- **3RF − LO** → third-order product (m=3, n=1)

These are in addition to the wanted IF = RF − LO (or RF + LO).

---

**How to suppress them**

**1. Use a double-balanced or triple-balanced mixer**
Single-balanced mixers cancel even-order LO products but not all spurs. Double-balanced mixers (DBM) cancel all even-order spurs of both RF and LO (2RF±nLO, mRF±2LO, etc.). Triple-balanced (image-reject / IRM) mixers go further. Most Mini-Circuits catalog mixers are double-balanced — if you're not already using one, switch.

**2. Check your LO drive level**
Overdriving or underdriving the LO shifts the spur balance point. Run the mixer at its rated LO drive level (e.g. Level 7, 10, 13, or 17 dBm depending on the part). Check the spur table in the datasheet at that exact level.

**3. Reduce RF input power**
Spurious products grow faster than the fundamental. A 3rd-order spur rises 3 dB for every 1 dB rise in RF input. Backing off RF drive by a few dB can drop the spurs significantly more.

**4. Filter after the mixer**
An IF low-pass or band-pass filter is the most reliable fix. Know where your wanted IF lands, and choose a filter with enough rejection at the spur frequencies. This is the most practical approach when you can't avoid the spurs architecturally.

**5. Check for RF input harmonics**
If your RF source itself has harmonic content (2RF, 3RF), those mix with the LO and create the exact products you're seeing. Put a low-pass or band-pass filter on the RF port before the mixer.

**6. Re-examine your frequency plan**
Sometimes the cleanest fix is to choose a different IF frequency so the spurs fall out of band. The classic spur chart tool (or the Mini-Circuits spur calculator) lets you map all mRF±nLO products for a given RF/LO/IF set.

---

**Quick diagnostic**

| Spur | Order | Grows at | Fix priority |
|---|---|---|---|
| 2RF−2LO | 2nd | 2 dB/dB RF | DBM + IF filter |
| 3RF−LO | 3rd | 3 dB/dB RF | Back off RF + IF filter |

If you tell me your RF, LO, and IF frequencies — and which mixer you're using — I can pull the datasheet spur table and suggest a matching IF filter or a better-balanced mixer.

## Splitters / Combiners (Wilkinson, Resistive, Transformers)

### Q31. For the ZN2PD2-63-S+, is the specified insertion loss inclusive or exclusive of the theoretical 3dB split loss?

Good news — I can clarify this directly, and the datasheet will confirm it.

**For the ZN2PD2-63-S+ (and Mini-Circuits splitters/dividers in general), the specified insertion loss is the *excess* loss only — it does NOT include the theoretical 3 dB split loss.**

So the total signal loss from input to either output port is:

> **Total loss = 3 dB (split) + specified insertion loss (excess)**

For example, if the datasheet lists an insertion loss of 0.7 dB at a given frequency, the actual power at each output port is ~3.7 dB below the input. This is standard practice across the RF industry, and Mini-Circuits follows it consistently — the "insertion loss" figure on the spec table is purely the excess loss attributable to the component's non-ideal behavior (resistive loss, mismatch, etc.).

You can verify the exact insertion loss values across frequency in the datasheet and graphs here:
- Datasheet (PDF)
- View Graphs (PDF)
- S-Parameters (.zip)

*Parts surfaced:* ZN2PD2-63-S+

### Q32. I'm combining two 5W signals using a ZAPD-2+. The internal resistor burnt out. What did I do wrong?

That's a common mistake, and it's a good one to understand clearly.

**The ZAPD-2+ is a power splitter/combiner — but it's designed for combining signals that are coherent (same frequency, defined phase relationship).** The internal resistor is the key to understanding what happened.

---

**How the resistor works in a Wilkinson combiner:**

The internal isolation resistor (typically 100Ω in a 50Ω Wilkinson) dissipates power only when there is a **phase or amplitude imbalance** between the two input signals. In an ideal, perfectly matched, in-phase combine, zero power flows through it. In reality:

- If your two sources are **not phase-coherent** (e.g., two independent oscillators, even at the same frequency), the phase difference wanders — and at any given moment you can have up to **180° of phase difference**. At 180° out of phase, *all* of the input power is dumped into the isolation resistor, not the output port.
- Even with coherent sources, a **fixed phase offset** (e.g., 90° or 180°) between the two inputs will load the resistor heavily.
- 5W per port = 10W total. The resistor is rated for a fraction of that in the worst case.

**Bottom line:** The resistor burnt out because a significant fraction of your two 5W inputs was being dissipated there rather than delivered to the output — almost certainly due to a phase or amplitude mismatch between your two sources.

---

**What you should do instead:**

| Situation | Right approach |
|---|---|
| Two **coherent, in-phase** sources (split from one source) | Wilkinson combiner (ZAPD-2+) is fine — check your phases |
| Two **independent** sources | Use a **hybrid combiner** (90° or 180°) — mismatch power goes to a terminated port, not the resistor |
| High power combining | Verify the combiner's **input power rating** matches your use case |

**Specifically:**
- If your signals are from **independent amplifiers driven by the same source**, add a phase-matched path and verify phase at the combiner inputs before use.
- If they are truly **independent signals**, a **hybrid combiner** with a 50Ω load on the isolated port is the right architecture. The load absorbs imbalance power safely (and you can size it appropriately).

---

Want me to find a suitable hybrid combiner or high-power Wilkinson for your frequency and power level? If so, tell me:

- **Frequency** (or range)
- **Whether your sources are coherent or independent**
- **Output power target**

*Parts surfaced:* ZAPD-2+

### Q33. Can I use a splitter backwards to combine signals?

Yes — with some important caveats. Here's the practical answer:

**Technically yes, but it depends on the application.**

A resistive splitter (e.g., a simple resistor-based power divider) is passive and reciprocal, so you can drive two ports and take the combined output from the "input" port. Mini-Circuits' Wilkinson-type and hybrid splitter/combiners are explicitly designed and specified to work in both directions — they're listed as "splitter/combiners" for exactly this reason.

**What you need to watch for:**

- **Isolation between input ports:** A Wilkinson combiner provides good isolation between the two signal sources, preventing them from interfering with each other. A simple resistive splitter offers less isolation.

- **Loss:** You'll see at least 3 dB of combining loss (fundamental), plus any excess insertion loss of the device.

- **Phase coherence:** Wilkinson combiners work best when the two input signals are in phase. If they're out of phase, the power goes into the isolation resistor (heat), not the output port. For combining two independent sources, a 90° hybrid (branchline or rat-race) may handle phase mismatch better.

- **Port match / return loss:** The device was characterized with specific source/load impedances. Driving it in reverse with poorly matched sources can degrade performance.

- **Power handling:** Check the datasheet — power ratings sometimes differ depending on direction of use.

**Rule of thumb by type:**

| Topology | Use reversed? | Notes |
|---|---|---|
| Wilkinson (0°) | Yes | Best for coherent, in-phase combining |
| 90° Hybrid | Yes | Better for independent sources; outputs sum to one port, cancel at isolated port |
| 180° Hybrid (rat-race) | Yes | Can combine in-phase or out-of-phase depending on port choice |
| Resistive (R-pad) | Yes | Works, but lossy and low isolation |

**Bottom line:** Mini-Circuits splitter/combiners are fully rated for use as combiners — just confirm the topology matches your phase relationship, and check the datasheet power ratings. If you tell me your frequency range and number of channels, I can point you to specific parts.

### Q34. Need an 8-way power splitter, 50 ohms, SMA connectors, operating from 1 GHz to 8 GHz.

> ⚠️ **No answer returned.** The assistant repeatedly called the catalog/product-detail tools and exhausted its tool-use budget before producing a reply. (This is a product-discovery query that matches many parts; see closing note.)

### Q35. Using a 180-degree splitter (ZAPDQ-2-N) but the outputs are out of phase by 175 degrees at 2 GHz. Is this within spec?

The tool returns pricing, stock, and files, but the spec tables (including phase balance limits) live in the datasheet and "View Data" PDF. Here's what I can tell you:

**Phase error = 180° − 175° = 5° deviation from nominal.**

Whether that's in-spec depends on the published phase balance specification. The tool doesn't return that limit numerically, so you'll need to check the datasheet directly:

  
- Datasheet (PDF)
  
- View Data (tabulated performance vs. frequency)
  
- View Graphs

**What to look for in those documents:**

  
- The spec table will list a *phase balance* limit, typically expressed as "180° ± X°" across the band.
  
- Check that spec at 2 GHz specifically — phase balance often degrades toward band edges.
  
- The "View Data" PDF gives measured phase balance at each frequency point, so you can see exactly where 2 GHz falls relative to the limit.

If the datasheet shows a phase balance spec of ±5° or better and your 175° measurement hits that boundary exactly, it's worth also checking your measurement setup (cable length mismatches, connector torque) — a 5° error at 2 GHz can easily come from ~7 mm of electrical length difference between the two output paths.

If you're still unsure after reviewing the datasheet, I'd suggest looping in the apps team — .

*Parts surfaced:* ZAPDQ-2-N

### Q36. i terminated one port of my 4 way splitter with a 50 ohm load. why did the power on the other ports drop?

Great question — this is a classic splitter behavior that trips up a lot of designers. The answer depends on whether your splitter is a **Wilkinson** (or resistive) type or a **reactive** type, but here's the core explanation:

---

**Why the power dropped**

A 4-way splitter is designed to be used with **all ports properly terminated at all times** — including the output ports. When you terminated one output with a 50Ω load instead of driving it into a matched load *in the signal path*, you changed the impedance environment that the internal matching network sees.

Here's what's happening inside:

**In a Wilkinson splitter (the most common type):**
- The isolation resistors between output ports are there to maintain port-to-port isolation *and* to ensure each port sees the correct impedance.
- When all 4 outputs are connected to matched loads in your system, the power splits evenly.
- When you **terminate one port**, that port absorbs its share of power normally — but the isolation resistors now re-route a portion of the signal from the other ports into that termination, slightly increasing the loss seen at the remaining active ports.
- Effectively, that terminated port is **still consuming power**, but it's no longer delivering it to your system.

**The math (4-way split, ideal):**

| Condition | Each port gets |
|---|---|
| All 4 ports active | −6 dB (25% of input) |
| 1 port terminated, 3 active | Each active port loses a small additional fraction through the isolation network |

The drop is typically **small** (fractions of a dB) if the splitter has good isolation, but it's measurable.

---

**The bigger picture**

In a perfectly matched, high-isolation Wilkinson splitter, terminating one port should cause **minimal** additional loss on the others — the isolation resistors do their job. If you're seeing a **significant** drop (say >1 dB), it may indicate:

1. **Poor port isolation** in your splitter — check the isolation spec in the datasheet.
2. **Impedance mismatch** at the terminated port — verify the load is truly 50Ω at your frequency.
3. **Reactive splitter behavior** — some low-cost splitters use purely reactive (LC) networks with no isolation resistors, in which case terminating one port *significantly* affects the others because the ports are not isolated.

---

**Bottom line:** Power into a terminated port is absorbed (not reflected back), so the active ports each see slightly less. With a well-designed Wilkinson splitter and a good 50Ω termination, the effect should be small. If it's large, check your isolation spec and load match.

Want me to look up a high-isolation 4-way splitter for your frequency band, or help you calculate the expected loss?

### Q37. What is the difference between a resistive splitter and a reactive splitter?

Great question — this is a fundamental distinction in RF design.

## Resistive vs. Reactive Splitters

### Resistive Splitter
- Built with resistors in a resistive divider network.
- **Matched at all ports** (good return loss) even when ports are terminated.
- **Inherently lossy**: in a 2-way split, each output is ~6 dB below the input (3 dB split loss + 3 dB resistive loss).
- **Broadband** — flat response from DC to very high frequencies, since there are no reactive elements.
- Good **isolation between output ports**.
- Best used when: bandwidth is paramount, loss is acceptable, or you need DC-to-RF coverage.

### Reactive Splitter (e.g. Wilkinson, hybrid, transmission-line)
- Built with reactive elements — transmission lines, inductors, capacitors (or LTCC equivalents).
- **Lower loss**: a 2-way split ideally costs only 3 dB (the theoretical minimum), with no additional resistive loss.
- **Frequency-dependent**: performance (match, isolation, balance) is optimized over a specific band.
- A **Wilkinson** splitter adds a resistor between output ports to provide isolation *only when outputs are matched* — it remains lossless in that condition.
- Best used when: efficiency matters (e.g. transmit chains), and you can accept a defined operating bandwidth.

---

### Head-to-Head Summary

  
 | Property |  | Resistive |  | Reactive (Wilkinson etc.) | 

  
 | Insertion loss (2-way) |  | ~6 dB |  | ~3 dB (near ideal) | 

  
 | Bandwidth |  | DC to RF (very wide) |  | Band-limited | 

  
 | Port match |  | Good at all ports |  | Good within band | 

  
 | Isolation |  | Good |  | Good (within band) | 

  
 | Power handling |  | Limited by resistors |  | Generally higher | 

  
 | Typical use |  | Test, signal monitoring, wideband |  | Receiver/transmitter, efficient splitting | 

---

**Bottom line:** If you need maximum bandwidth and don't mind the extra loss, go resistive. If efficiency and power are important and you have a defined frequency range, go reactive.

Want me to find specific parts in either category for your application?

### Q38. What happens to the isolation between ports 1 and 2 on the SYPS-2-1 if the common port has a VSWR of 2.0:1?

Good — I have the file links. Now for the technical question itself, here's the analysis:

---

**The short answer: isolation degrades — and the math tells you by exactly how much.**

A Wilkinson splitter/combiner (which the SYPS-2-1 is) achieves high isolation between its output ports **only when all ports are terminated in the design impedance (50Ω)**. The isolation between ports 1 and 2 depends critically on the match at the common (sum) port.

**Why? The mechanism:**

In a Wilkinson, isolation between the two output ports is created by cancellation — the signal path through the resistor and the signal path through the transmission lines destructively interfere. That cancellation is **perfect only if the common port is matched**. Any reflection from the common port re-enters the network and breaks the cancellation, coupling energy from one output port to the other.

---

**Calculating the isolation degradation:**

A VSWR of 2.0:1 at the common port gives a reflection coefficient:

> |Γ| = (VSWR − 1) / (VSWR + 1) = (2.0 − 1) / (2.0 + 1) = 1/3 ≈ **0.333**

The reflected power fraction is:
> |Γ|² = (0.333)² ≈ 0.111 → **−9.54 dB**

This reflected wave re-enters the Wilkinson and splits equally toward ports 1 and 2. In the worst case (phase-coherent re-injection), the upper bound on the leakage from port 1 to port 2 via the common port mismatch is:

> Leakage ≈ |Γ| of common port + splitting loss (−3 dB each way) + insertion loss through the splitter

So the parasitic coupling path is approximately:
> −9.54 dB (reflected power) − 3 dB (splits to two ports) = **~−12.5 dB** of additional leakage power

If the SYPS-2-1's rated isolation is, say, **20 dB or better** (typical for a Wilkinson in its passband — confirm in the datasheet), the mismatch-induced leakage at ~−12.5 dB can **dominate** and drag effective isolation down to roughly **12–13 dB** in the worst case.

---

**Key takeaway:**

| Common port VSWR | |Γ| | Mismatch-induced leakage floor |
|---|---|---|
| 1.0:1 (perfect) | 0 | No degradation |
| 1.5:1 | 0.200 | ~−17 dB |
| **2.0:1** | **0.333** | **~−12.5 dB** |
| 3.0:1 | 0.500 | ~−9 dB |

**Practical recommendation:** If isolation matters in your design, keep the common port VSWR below 1.5:1. If the load is poorly matched, add an isolator or a buffer amplifier between the common port and the source/load to present a clean 50Ω termination to the splitter.

For the full measured isolation vs. frequency data, see the View Graphs and S-parameters — those will show you the baseline isolation to plug into the above analysis.

*Parts surfaced:* SYPS-2-1

### Q39. Are your surface mount splitters tape and reel? What is the reel size for the WP4G+?

Good news on both counts.

**Tape & Reel availability:** Many Mini-Circuits SMT splitters are available in tape and reel — but it varies by part and package. The best way to confirm for a specific model is to check its product page for a "T & R" file link.

**WP4G+ — Tape & Reel:**
Yes, the **WP4G+** is available in tape and reel. The reel spec is **F66**, which you can review in full here:

T&R Drawing – F66 (PDF)

Other useful files for the WP4G+:
- Datasheet (PDF)
- Case Style Drawing – DQ1225 (PDF)
- PCB Layout (PDF)

**Pricing & Stock (WP4G+):**

  
 | Qty |  | Unit Price | 

  
 | 20 |  | $1.96 | 

  
 | 50 |  | $1.90 | 

  
 | 100 |  | $1.83 | 

  
 | 200 |  | $1.68 | 

  
 | 500 |  | $1.61 | 

  
 | 1,000 |  | $1.44 | 

  
 | 2,000 |  | $1.40 | 

  
 | 5,000 |  | $1.35 | 

**Stock: more than 20,000 units** in stock and ready to ship.

If you need T&R confirmation for a different SMT splitter, just share the part number and I'll pull up its details.

*Parts surfaced:* WP4G+

### Q40. whats the biggest power combiner you make? i need to combine like 100 watts.

> ⚠️ **No answer returned.** The assistant repeatedly called the catalog/product-detail tools and exhausted its tool-use budget before producing a reply. (This is a product-discovery query that matches many parts; see closing note.)

## Transformers & Baluns

### Q41. I am using the TC1-1-13M+. Is the secondary center tap DC-isolated from the primary winding?

The **TC1-1-13M+** is a 1:1 impedance ratio RF transformer. The "TC" prefix in Mini-Circuits' naming convention denotes a **center-tapped** design — specifically, the secondary winding has a center tap, while the primary does not.

Regarding DC isolation: **yes, the secondary center tap is DC-isolated from the primary winding.** The primary and secondary are magnetically coupled windings with no galvanic (DC) connection between them. The center tap is simply a mid-point tap on the secondary coil itself.

A few things worth keeping in mind:
- The **secondary center tap** is typically connected to ground in your circuit when used as a balun or for biasing a differential pair.
- If you need to pass DC through the primary or secondary (e.g., for device biasing), check the datasheet for any DC current rating — most RF transformers like this one are not rated for significant DC current through the signal windings.

I'd recommend reviewing the full datasheet for the pinout and any DC handling notes:
TC1-1-13M+ Datasheet (PDF)

Let me know if you have any other questions about this part.

*Parts surfaced:* TC1-1-13M+

### Q42. I passed 50mA of DC through my surface mount transformer and now my RF insertion loss is massive.

That's a classic symptom of core saturation — here's what likely happened and how to diagnose it.

**What went wrong**

Surface-mount transformers use ferrite or high-permeability cores. When DC current flows through the winding, it creates a static magnetic flux bias in the core. If that bias is large enough to push the core into saturation, permeability collapses — and with it, inductance and coupling efficiency. The result is exactly what you're seeing: dramatically increased insertion loss.

**Was 50 mA too much?**

It depends entirely on the part. Every transformer has a maximum DC current rating. Exceeding it — even briefly — can cause:

1. **Reversible saturation** — core saturates while current flows, recovers when removed. RF performance returns to normal. This is the best case.
2. **Thermal damage** — DC current heats the winding resistance (P = I²R). If the winding or solder joints overheated, you may have permanent damage.
3. **Permanent magnetic remanence** — some core materials can be partially magnetized, shifting the operating point even after DC is removed.

**How to diagnose**

1. **Remove all DC** from the circuit and retest insertion loss with RF only. If IL recovers, the core was saturating but is undamaged — you just need to stay within the rated DC current.
2. **If IL stays high**, the transformer is likely damaged (winding open/shorted, core cracked, or solder joint failed). Replace it.
3. **Check DCR** with an ohmmeter on both windings. A winding short or open is immediately visible.
4. **Check the datasheet** for the transformer's rated max DC current. If your part doesn't have a DC current spec, it almost certainly isn't designed for DC bias on the signal path.

**Going forward — if you need DC on the transformer**

Some designs pass DC through a transformer intentionally (e.g., to bias an active device downstream). For that you need a part explicitly rated for DC current on that winding. If you let me know your frequency range, impedance ratio, and required DC current, I can find you a suitable part from the catalog.

What does the transformer look like after you remove the DC — does the insertion loss recover?

### Q43. I need to match a 50 ohm line to a 200 ohm antenna. What ratio transformer do I need?

Good question. For a 50Ω → 200Ω match, you need a **4:1 impedance ratio** transformer (since 200/50 = 4).

To find the right part, I need a couple more details:

To find the right 4:1 transformer, fill in what you know (leave blank or "any" if unsure):

- **Frequency range:** e.g. 1–500 MHz
- **System impedance:** 50Ω ✓ (secondary = 200Ω ✓)
- **DC:** pass or block?
- **Power level:** e.g. < 1W, 10W, etc.
- **Package:** SMT, connectorized, or either

Reply with whatever you've got and I'll find the best matches.

### Q44. Looking for a 1:4 impedance ratio balun, frequency range 10 MHz to 1000 MHz, core and wire type.

Good news — there are four core & wire SMT baluns with a 4:1 impedance ratio that cover your 10–1000 MHz band. All four actually extend to 1900 MHz, so you have plenty of headroom. They're all 50Ω system impedance. The only difference between them is the package/case style:

| Part Number | Case Style | Interface |
|---|---|---|
| **TC4-19+** | AT224-1 | SMT |
| **TC4-19G2+** | AT224-3 | SMT |
| **TC4-19X+** | AT1521 | SMT |
| **TCM4-19+** | DB714 | SMT |

**My top pick: TC4-19+** — it's the most widely used variant in this family and a solid default if you don't have a specific footprint requirement.

A few things that may help you choose between them:
- **TC4-19G2+** is a green/RoHS variant with a slightly different footprint (AT224-3 vs AT224-1)
- **TC4-19X+** uses the AT1521 case — a larger, more robust footprint useful if you need easier hand-soldering or better power handling
- **TCM4-19+** uses the DB714 case — a compact surface-mount package

Datasheets:
- TC4-19+ Datasheet
- TC4-19G2+ Datasheet
- TC4-19X+ Datasheet
- TCM4-19+ Datasheet

Do you have a preferred PCB footprint, or would you like pricing and stock on any of these?

*Parts surfaced:* TC4-19+, TC4-19G2+, TC4-19X+, TCM4-19+

### Q45. The insertion loss of my ADT2-1T+ gets exponentially worse below 5 MHz. Is this core saturation or just lacking inductance?

Good question — and the answer is almost certainly **insufficient magnetizing inductance**, not core saturation. Here's why:

**The low-frequency mechanism in a wideband transformer**

At low frequencies, what limits performance is the **magnetizing inductance (Lm)** of the primary winding. Lm appears in shunt across the signal path. Its impedance is:

> Z_Lm = j·2π·f·Lm

As frequency drops, Z_Lm falls, shunting more and more of your signal to ground (or across the winding). The insertion loss rises roughly as **20 dB/decade** — which to the eye on a linear frequency axis looks exponential. This is the textbook low-frequency rolloff of any transformer.

**Why it's probably not core saturation**

Core saturation is a **drive-level (power) problem**, not a frequency problem by itself. Symptoms:
- IL degrades as you **increase input power** at a fixed frequency
- Harmonic distortion rises sharply
- The onset is relatively abrupt with power, not gradual with frequency

If your IL is poor below 5 MHz **regardless of drive level** (even at −20 dBm), that's Lm rolloff, not saturation. Saturation would also typically shift the corner frequency upward as you increase power, and you'd see it in the harmonic content.

**The ADT2-1T+ rated range**

The ADT2-1T+ is specified from **0.4 to 800 MHz**. The low end of that spec (0.4 MHz = 400 kHz) is where Mini-Circuits guarantees the IL is within datasheet limits — it doesn't mean performance is flat all the way down. The closer you push to (or below) the lower band edge, the more Lm dominates and IL rises. Below ~5 MHz you're well outside the flat region for this particular core/winding geometry.

**Quick diagnostic**

| Test | What it tells you |
|---|---|
| Sweep IL vs. frequency at fixed low power (e.g. −20 dBm) | If IL worsens below ~5 MHz — Lm rolloff |
| Sweep IL vs. power at a fixed low frequency (e.g. 1 MHz) | If IL worsens as power rises — saturation |
| Check harmonic content at low-f / high-power | Rising H2/H3 → saturation |

**If you need better low-frequency coverage**, look for a transformer with a higher Lm (larger core, more turns, higher-permeability material). I can search for alternatives with a lower frequency bound — just let me know your required low-end frequency, impedance ratio (the ADT2-1T+ is 2:1), and any constraints on package or power level.

Useful files for the ADT2-1T+:

• Datasheet (PDF)

• View Graphs — look at the IL curve to see exactly where it starts rolling off

*Parts surfaced:* ADT2-1T+

### Q46. Using a balun to drive an ADC. The common mode rejection ratio seems terrible at 500 MHz.

Good context. A few quick questions to make sure I find the right part:

To find the right balun, fill in what you know (leave blank / "any" if unsure):

- **Frequency:** 500 MHz ✓
- **System impedance:** 50Ω or 75Ω?
- **Impedance ratio:** 1:1, 2:1, 4:1, other?
- **DC pass or DC isolation:** does the balun need to pass DC on either port?
- **Power level / signal level:** (e.g. small signal, <+10 dBm, etc.)
- **Package:** SMT, connectorized, or no preference?

Reply with whatever you've got and I'll find the best matches.

### Q47. what does the dot mean on the transformer schematic?

Great question — this comes up a lot when reading transformer schematics.

**The dot convention** indicates the **polarity** of the windings — specifically, which terminals are in phase with each other.

Here's what it means in practice:

**Current / Voltage Phase**

- When current flows *into* the dotted terminal on the primary, current flows *out of* the dotted terminal on the secondary.

- Equivalently, the dotted terminals on primary and secondary reach their positive voltage peak at the same time.

**Why it matters for RF transformers & baluns**

- **Balun winding sense** — the dot tells you which port is the "in-phase" leg of the balanced output. Reversing a winding (moving the dot) flips the signal 180°, turning a 0° balun into an inverting one.

- **Push-pull amplifiers** — correct dot orientation ensures the two transistors see anti-phase drive as intended.

- **Combiner/splitter hybrids** — dot placement defines whether you get a 0° or 180° hybrid.

**Practical rule of thumb**

- Dots on the *same side* of the schematic symbol → in-phase (non-inverting).

- Dots on *opposite sides* → out-of-phase (inverting, 180° relationship).

If you're looking at a specific Mini-Circuits transformer or balun schematic and want help interpreting the pinout or winding sense, share the part number and I can pull up the datasheet details for you.

### Q48. What is the maximum DC current I can sink into the secondary tap of the JTX-2-10T before saturating the core?

The tool result — and the published online specs for the **JTX-2-10T** — does not include a DC current rating or saturation current limit. This is common for RF transformers: core saturation current is not always a guaranteed datasheet spec, and it can depend on temperature, signal level, and winding configuration.

To get the definitive answer you'll want to go straight to the source:

- JTX-2-10T Datasheet (PDF) — check for any DC current or power handling note in the application notes section.

If it's not there either, this is a question for the applications team, who can give you the actual saturation threshold for your specific use case (bias current level, signal power, temperature). 

When you reach out, it helps to have the following ready:
- DC bias current level you're planning to inject
- RF signal power on the secondary
- Operating temperature range

That way the team can give you a definitive answer or recommend a part better suited to DC-biased operation (such as a part from the **TPDC** or **TCM** series, which are designed with DC-passing in mind).

*Parts surfaced:* JTX-2-10T

### Q49. do you sell transformers that look like little beads with wires?

You're thinking of **leaded/wirewound transformers** — yes, Mini-Circuits makes these. They're compact, bead-style or drum-core transformers with wire leads, used for impedance matching, baluns, and signal coupling.

To point you to the right ones, fill in what you know (leave blank or "any" if unsure):

- **Frequency:** ___
- **System impedance:** 50Ω or 75Ω ___
- **Impedance ratio:** (e.g. 1:1, 2:1, 4:1, 9:1) ___
- **DC pass or DC isolated:** ___
- **Power level:** ___

Reply with whatever you've got and I'll find the best matches.

### Q50. my T4-1+ is measuring weird on the VNA. Do I need to ground the secondary when testing the primary?

Here are the resources that will sort this out:

  
- Datasheet (PDF) — includes the schematic, pin-out, and recommended test circuit
  
- View Data — tabulated S-parameter data
  
- View Graphs — measured performance curves
  
- S-Parameters (.s4p) — you can load this directly into your VNA software and compare against your measurement

The **.s4p file is especially useful here** — load it into your VNA or simulator and compare the reference data to what you're seeing. If they match when you apply the correct termination, your fixture and setup are good. A big discrepancy after correct termination usually points to a fixture/cal plane issue.

What specifically looks wrong — S11, insertion loss, both? Happy to help interpret the readings.

*Parts surfaced:* T4-1, T4-1+

## Attenuators (Fixed, Variable, Programmable)

### Q51. For the RC4DAT-6G-95, what is the settling time of the RF amplitude when I send a USB command to change state from 0dB to 30dB?

The product details returned from the live page don't include settling time in the structured data, and that specification isn't something I can reliably state without it being explicitly listed in the tool result.

Here's what I'd recommend:

1. **Check the datasheet directly** — settling time (RF amplitude) for USB-commanded state changes is typically documented there: RC4DAT-6G-95 Datasheet (PDF)

2. **Check the "View Data" sheet** for additional tabulated specs: View Data (PDF)

One important note on **USB-commanded switching**: the settling time of the RF amplitude itself (i.e., the attenuator's analog switching speed) is typically on the order of microseconds. However, the **end-to-end latency from issuing a USB command to the RF settling** is dominated by USB transaction overhead — typically on the order of **milliseconds** — and that latency is not a fixed spec of the attenuator hardware alone. It depends on USB host controller behavior, OS scheduling, and driver stack.

If the datasheet doesn't have the specific number you need, the applications team can give you a definitive answer — .

*Parts surfaced:* RC4DAT-6G-95

### Q52. I put 10W into a 2W VAT-3+ attenuator and it smoked. Can you confirm what happens when it fails? Does it short or open?

The datasheet confirms the VAT-3+ is rated for **2W (33 dBm) max input power**, so putting 10W (40 dBm) into it — 5× its rated power — will absolutely destroy it.

As for the failure mode: the datasheet doesn't specify a guaranteed short or open post-failure, and I can't state that definitively from the spec sheet. Resistive attenuator pads like this typically fail in an unpredictable way when thermally overloaded — the thin-film resistive elements can burn open, short, or delaminate, and it can vary unit to unit. **I wouldn't rely on any particular failure mode for circuit protection purposes.**

A few practical notes:

- **10W → 3 dB → 5W out.** Even if it hadn't failed, 5W out of a 3 dB pad is not a safe operating point for downstream components.
- If you need to handle 10W, look at the **VAT-** series in higher power ratings — there are connectorized attenuators rated for much higher power. Let me know your attenuation value, frequency range, and connector type and I can find the right fit.
- If you're trying to protect downstream circuitry from overpower, a **limiter** or a properly rated high-power attenuator/pad is the right approach.

VAT-3+ Datasheet (PDF)

Want help finding a 3 dB attenuator rated for 10W or higher?

*Parts surfaced:* VAT-3+

### Q53. Why do attenuators improve return loss?

Great question — it's one of those "aha" moments in RF design.

**The core principle: the attenuator absorbs reflected waves**

When you have a mismatched load (poor return loss), power reflects back toward the source. An attenuator placed between the source and load improves the *apparent* return loss because **every reflection has to pass through the attenuator twice** — once on the way to the load, and once on the way back.

**The math:**

If your attenuator has attenuation value A (dB), the reflected signal from the load is attenuated by **2A dB** by the time it reaches the source.

So the system return loss becomes:

> RL_system ≈ RL_load + 2A

For example: a 6 dB attenuator in front of a load with 6 dB return loss improves the apparent return loss seen by the source to ~18 dB — a dramatic improvement.

**Why the attenuator itself has good return loss:**

A resistive attenuator (Pi or T network) presents a well-matched impedance (e.g. 50Ω) at both ports across a very wide bandwidth — its input impedance is largely independent of what's connected to the output. This is the fundamental advantage of a resistive pad.

**The trade-off:**

You pay for it in insertion loss. That 2A dB improvement costs A dB of forward signal loss. So a 10 dB pad gives you 20 dB of return loss improvement, but you lose 10 dB of signal level. It's a classic system design trade.

**Practical use cases:**
- Buffering a VCO or oscillator output from a varying load
- Improving the port match of a filter or amplifier for a flat frequency response
- Protecting a sensitive source from large reflections
- Broadband impedance bridging between mismatched stages

In short: the attenuator works as a bilateral absorber. It doesn't fix the mismatch at the load — it just hides it from the source by absorbing the reflected energy.

### Q54. Need a programmable attenuator. 0 to 60 dB in 0.5 dB steps. Must have an Ethernet interface and GUI.

Your specs — 0–60 dB, 0.5 dB step, Ethernet + GUI — point squarely to Mini-Circuits' **RCDAT** series. These are rack-friendly, box-style programmable attenuators with a built-in Ethernet port, USB, and a Windows GUI included. Two solid options depending on your frequency range:

---

**RCDAT-6000-60** — best pick if you're working up to 6 GHz.

  
- Attenuation range: 0–60 dB, 0.5 dB step resolution
  
- Frequency: up to 6000 MHz
  
- Control: Ethernet, USB, GUI included
  
- Stock: 37 units available

  
 | Qty |  | Unit Price (USD) | 

  
 | 1 |  | $917.00 | 

  
 | 10 |  | $898.00 | 

Datasheet (PDF) | View Data | View Graphs

---

**RCDAT-8000-60** — if you need coverage up to 8 GHz.

  
- Attenuation range: 0–60 dB, 0.5 dB step resolution
  
- Frequency: up to 8000 MHz
  
- Control: Ethernet, USB, GUI included
  
- Stock: more than 10 units available

  
 | Qty |  | Unit Price (USD) | 

  
 | 1 |  | $1,077.00 | 

Datasheet (PDF) | View Data | View Graphs

---

Both support USB and Ethernet control, include a Windows GUI, and are in stock. The RCDAT-6000-60 is the more economical choice if 6 GHz covers your application. What's your frequency range?

*Parts surfaced:* Programmable Attenuators, RCDAT-6000-60, RCDAT-8000-60

### Q55. What is the absolute attenuation accuracy at 18 GHz for the BW-S10W2+ fixed attenuator?

The product details returned from the live page don't include a detailed spec table with per-frequency attenuation accuracy values — that level of detail lives in the datasheet and "View Data" document.

For the absolute attenuation accuracy of the **BW-S10W2+** at 18 GHz specifically, I'd point you to these resources:

- Datasheet (PDF) — will list attenuation accuracy vs. frequency in the spec table
- View Data (PDF) — tabulated measured data across frequency
- View Graphs (PDF) — attenuation flatness plotted vs. frequency

The datasheet's spec table is the definitive source for the guaranteed accuracy at 18 GHz. If you'd like help interpreting the value once you pull it up, or need to compare it against another attenuator, just let me know.

*Parts surfaced:* BW-S10W2+

### Q56. Trying to control the DAT-31R5-SP+ via SPI but it's not responding. Does LE need to be toggled after the data shift?

Yes — LE (Latch Enable) is the key to why it's not responding. Here's exactly how the serial interface works on the DAT-31R5-SP+:

**Serial programming sequence:**

1. **Hold LE low** while you clock in data.
2. **Clock in 6 bits** MSB-first on the DATA line, synchronized to CLK (data is clocked in on the rising edge of CLK).
3. **Pulse LE high** after all 6 bits are shifted in — this is the latch strobe that transfers the shift register contents to the output latches and actually changes the attenuation state.
4. **Return LE low** to complete the cycle.

Without that LE rising edge at the end, the data sits in the shift register and the attenuator state never updates — which is the classic "not responding" symptom.

**A few other things to verify:**

- **Bit order:** 6 bits, MSB first. The MSB controls the 16 dB bit; LSB controls the 0.5 dB bit. If the order is reversed you'll get a response, just the wrong attenuation.
- **Logic levels:** The control pins are CMOS-compatible — make sure your SPI master's logic levels are within spec for the supply voltage you're using.
- **LE pulse width:** Give it a clean, non-glitchy pulse — a few nanoseconds minimum. If your LE line is floating or noisy, you may get spurious latches.
- **CLK idle state:** CLK should be low when idle (CPOL=0). Data is valid on the rising edge (CPHA=0) — so standard SPI Mode 0.

The full timing diagram is in the datasheet: DAT-31R5-SP+ Datasheet (PDF)

Let me know if you want help decoding the bit pattern for a specific attenuation value, or if the timing diagram raises any other questions.

*Parts surfaced:* DAT-31R5-SP+

### Q57. whats a pi pad vs a t pad attenuator?

Good question — these are both resistive attenuator topologies, just wired differently.

**Pi Pad (π)**

Three resistors arranged like the Greek letter π:
- One shunt resistor to ground on the **input**
- One series resistor across the signal path
- One shunt resistor to ground on the **output**

```
 o---[Rs]---o
 |          |
[Rp1]     [Rp2]
 |          |
GND        GND
```

**T Pad**

Three resistors arranged like the letter T:
- One series resistor on the **input**
- One series resistor on the **output**
- One shunt resistor to ground in the **middle**

```
 o---[Rs1]---+---[Rs2]---o
             |
            [Rp]
             |
            GND
```

---

**Key differences in practice:**

| | Pi Pad | T Pad |
|---|---|---|
| Shunt elements | Input & output | Center only |
| Series elements | Middle only | Input & output |
| Preferred when… | Low impedance lines (less sensitive to stray L) | Higher impedance or balanced lines |
| Common use | 50Ω/75Ω coax systems | Balanced / differential circuits |

**In reality, for 50Ω RF work**, both topologies give identical attenuation and return loss — it's just a matter of which fits your PCB layout or circuit better. Mini-Circuits' fixed attenuators cover both styles across a wide range of attenuation values and packages.

Want me to help you find a fixed attenuator for a specific frequency and attenuation value?

### Q58. Are there phase shifts introduced when I change states on your digital step attenuators?

Yes — this is a real and important effect. Digital step attenuators (DSAs) do introduce phase shift as you change attenuation states, and it's worth understanding both why it happens and how to account for it.

**Why it happens**

Each attenuation bit in a DSA is typically implemented as a switched PI or T attenuator section. When you switch a bit in or out, the reactive parasitics (transistor capacitances, bond wires, layout) change the electrical path length slightly. The result is a small but nonzero phase shift — called **insertion phase variation** or **phase skew** — between attenuation states.

**Typical magnitudes**

The effect scales with frequency and attenuation step size:
- At low frequencies (< 500 MHz): usually < a few degrees per state change
- At microwave frequencies (1–6 GHz+): can be 5–20° or more depending on the architecture and the bit being switched
- Larger attenuation bits (e.g. 16 dB or 32 dB) tend to produce larger phase shifts than smaller bits (e.g. 0.5 dB or 1 dB)

**Where it matters most**

- **Phased-array / beamforming systems** — if you're using a DSA to adjust amplitude taper across elements, the phase skew corrupts the beam
- **Vector signal calibration** — amplitude and phase are coupled across states
- **Predistortion / linearization loops** — unexpected phase changes degrade correction accuracy

**How Mini-Circuits specifies it**

On Mini-Circuits DSA datasheets, look for the spec labeled **"Insertion Phase Variation"** or **"Phase Skew"** — it's typically given across states and plotted vs. frequency. You'll often find it in the *View Graphs* section of the product page.

**Mitigation strategies**

1. **Characterize and calibrate** — measure insertion phase for every state at your operating frequency and store a correction table
2. **Use a companion phase shifter** — pair the DSA with a digital phase shifter to compensate
3. **Choose a reflectionless or absorptive topology** — some architectures have lower phase skew by design
4. **Operate at lower frequencies** where the effect is smaller

Would you like me to pull up specific DSA models for your frequency range and application so you can compare their phase skew specs?

### Q59. Do you have 75 ohm fixed attenuators with F-type connectors?

Unfortunately, the catalog search doesn't turn up any 75Ω fixed attenuators with F-type connectors. The BAT-series parts that appeared are 75Ω attenuators, but they use BNC-style (KC-series) connectors, not F-type.

A few options to consider:

- **Use a BNC-based 75Ω attenuator + BNC-to-F adapters** — the **BAT-xdB** series (BAT-1+ through BAT-9+, etc.) are 75Ω fixed attenuators in a BNC inline package. Pairing with 75Ω BNC↔F adapters is a common approach.
- **Check the full attenuator page** — it's possible there are F-connector variants not surfacing in search. I'd recommend browsing the Fixed Attenuators product page directly and filtering by connector.
- **Contact the team** — if you need F-type specifically in volume, the applications team can confirm availability or discuss options. 

What attenuation value and frequency range do you need? That'll help me point you toward the closest alternative.

*Parts surfaced:* BAT-1+, BAT-9+

### Q60. my rotary attenuator is scratchy. the RF power jumps around when i turn the dial.

That's a classic symptom of worn or dirty rotary attenuator contacts. Here's how to approach it:

**1. Clean the contacts first**
Use a small amount of DeoxIT D5 (or equivalent contact cleaner) applied to the wafer/contact area while slowly rotating the dial through its full range several times. This clears oxidation and debris that cause intermittent contact. Don't use WD-40 — it leaves a residue.

**2. Check for mechanical wear**
If cleaning doesn't help, the resistive element or wiper contacts may be worn through. On older rotary step attenuators, the carbon/cermet track degrades over time, especially with heavy use. At that point, the unit needs rebuild or replacement.

**3. Check torque/tightness**
A loose shaft bushing can cause the wiper to lift off the track under slight pressure. Snug up the front-panel nut if accessible.

**4. Verify it's not the connector**
Swap the cable on each port and wiggle-test. Intermittent connectors can mimic a bad attenuator.

**5. If the unit is beyond repair**
Mini-Circuits carries a full line of **fixed, step, and programmable attenuators** — SMA-connectorized and SMT — if you're looking to replace it. Just let me know:

- What frequency range do you need?
- How much attenuation (dB)?
- Fixed value, switched step, or electronically programmable?
- Power level?

I can pull up the right options from the catalog right away.

*Parts surfaced:* Programmable Attenuators

## Switches (Solid State, Mechanical, USB)

### Q61. What is the hot-switching power limitation of the MSP2TA-18XL electromechanical switch at 10 GHz?

The search didn't return the **MSP2TA-18XL** directly — the catalog lookup came back empty for that exact part number, and the keyword search returned unrelated results. This means I'm not able to confirm the part exists in the current online catalog, nor retrieve its datasheet or specs programmatically.

For the hot-switching power limit at 10 GHz specifically, that spec is typically documented in the product datasheet's "Hot Switching" or "Maximum Ratings" table, and it can vary with frequency (hot-switching ratings are often derated at higher frequencies compared to the cold-switching maximum).

Here's what I'd recommend:

1. **Check the datasheet directly** — visit the Mini-Circuits product page for the MSP2TA-18XL and look for the hot-switching power curve or table. Many electromechanical switch datasheets include a power vs. frequency derating curve for hot switching.

2. **Contact Mini-Circuits directly** — if the datasheet doesn't include a 10 GHz hot-switching figure explicitly, the applications team can confirm it. 

You can search for the part at www.minicircuits.com or reach out via the contact page for a definitive answer. Would you like help finding an alternative switch in the catalog?

### Q62. Im seeing a weird DC spike on my RF line every time the solid state switch toggles. Is this video leakage?

Yes, that's almost certainly **video leakage** (sometimes called "video feedthrough" or "switching transient feedthrough"). Here's what's happening and how to address it:

---

**What's going on**

When a solid-state switch (PIN diode or FET-based) toggles, the fast voltage/current transient on the control line capacitively or inductively couples into the RF signal path, producing a narrow pulse — visible on a scope or spectrum analyzer as a DC spike or baseband burst. It's called "video leakage" because it shows up in the video/baseband band (near DC).

---

**Common causes**

1. **Control line coupling** — The control voltage edge (fast rise/fall time) couples through parasitic capacitance between the control and RF paths inside or outside the package.
2. **Ground bounce** — Shared ground impedance between the control driver and the RF path; the switching current causes a momentary ground potential shift.
3. **Insufficient decoupling on the control line** — No (or inadequate) bypass capacitor on the control supply/line near the switch.
4. **Inadequate RF-path DC blocking** — If there's a DC path through the RF line, the control transient can push a real current spike down it.

---

**How to fix it**

1. **Add a DC block on the RF ports** — This is the most direct fix. A series DC-blocking capacitor (or a dedicated DC block component) on the RF input/output physically prevents the DC/baseband transient from propagating down the RF line.
2. **RC filter the control line** — Slow the control edge slightly with a series resistor + shunt capacitor right at the switch control pin. This reduces dV/dt and the coupled transient amplitude. (Trade-off: slower switching speed.)
3. **Improve control-line bypassing** — Place a good-quality bypass cap (100 nF ceramic) as close as possible to the switch control pin, with a short, direct path to ground.
4. **Separate control and RF grounds** — Star-ground back to a single point; avoid shared trace impedance.
5. **Choose a lower-transient switch** — Some switch families are specifically characterized for low video leakage / switching transients. Mini-Circuits lists switching speed and sometimes transient specs on switch datasheets.

---

**Want a DC block or a low-video-leakage switch recommendation?**

If you let me know your RF frequency range and connector/package preference, I can pull specific parts from the catalog.

### Q63. What is the difference between an absorptive switch and a reflective switch?

Great question — this comes up often in system design.

**Reflective Switch**

When a reflective switch is in the OFF state, the isolated port presents a **high impedance (near-open) or low impedance (near-short)** to the signal path. The input signal is reflected back toward the source rather than absorbed. This means:

- The off-port VSWR can be very high (poor match)
- Reflected energy travels back upstream and can disturb sensitive components (LNAs, VCOs, filters) causing gain ripple, frequency pulling, or spurious signals
- They are generally simpler, smaller, and cheaper

**Absorptive (Terminated) Switch**

When an absorptive switch is in the OFF state, the isolated port is **internally terminated** — typically in 50Ω. The signal is absorbed rather than reflected. This means:

- The off-port presents a good match (low VSWR) regardless of switch state
- Upstream and downstream components see a stable load at all times
- Critical in systems where a changing impedance on a switched path would degrade performance

**When to use each:**

| Situation | Recommended Type |
|---|---|
| Switching between well-matched, isolated paths | Reflective is fine |
| Protecting an LNA or VCO from reflected energy | Absorptive |
| Antenna switching (antenna is a decent load) | Either, but absorptive is safer |
| Test & measurement switching matrices | Absorptive (system integrity) |
| Cost/size sensitive, simple routing | Reflective |

**Bottom line:** If the components on the switched paths are sensitive to impedance changes — or if you need consistent match in both states — go absorptive. Otherwise, reflective is simpler and often sufficient.

Do you have a specific application in mind? I can help you find the right switch.

### Q64. Need a solid state SP4T switch, surface mount, operable up to 6 GHz, with integral CMOS driver.

> ⚠️ **No answer returned.** The assistant repeatedly called the catalog/product-detail tools and exhausted its tool-use budget before producing a reply. (This is a product-discovery query that matches many parts; see closing note.)

### Q65. Does the USB-SPDT-A18 have break-before-make or make-before-break logic?

The product lookup didn't return a result for **USB-SPDT-A18**, and the keyword search didn't surface it either — it may be a discontinued or unlisted model, or there could be a slight part number variation.

That said, I can't confirm the switching logic (break-before-make vs. make-before-break) from the catalog data alone — that level of detail lives in the datasheet or firmware documentation. Here's what I'd suggest:

1. **Check the datasheet directly** on the Mini-Circuits website — search for USB-SPDT-A18 at minicircuits.com. The switching behavior is typically called out in the electrical specifications or control/timing section.
2. **Contact the applications team** — they can confirm the logic definitively. 

If you can share what application you're designing for (e.g., antenna switching, signal routing), I'm happy to help you find a current USB-controlled SPDT switch that fits your needs.

### Q66. my mechanical switch is clicking but the rf isn't passing through. is it stuck?

That sounds like a mechanical issue with a coaxial switch — here are the most common causes and steps to diagnose it:

**1. Check DC control voltage/current**
Even if you hear a click, confirm the coil is getting the correct voltage and current. An under-voltage can partially actuate the solenoid without fully seating the RF contact.

**2. Inspect the RF contact path**
- Open the unit if serviceable and look for oxidized, worn, or physically damaged contacts.
- A click confirms the actuator moved, but the RF contact pin may not be making a solid connection (bent pin, debris, worn plating).

**3. Verify connector torque**
Loose SMA/N connectors can mimic an open switch. Torque to spec (SMA: 5 in-lb / 0.56 N·m; N-type: 12–15 in-lb).

**4. Check for contamination**
Dust, flux residue, or moisture inside the RF path can cause high insertion loss or an open. Clean with IPA if accessible.

**5. Measure with a VNA or signal source + power meter**
- Measure S21 (or insertion loss) directly across the switch in both positions.
- If both ports show open, the contact mechanism is likely failed. If only one port is open, a single contact may be damaged.

**6. Thermal effects**
If the switch worked before and just stopped, check whether it was exposed to over-power, ESD, or temperature extremes — all can damage the RF contact without visibly damaging the housing.

---

If it's a Mini-Circuits mechanical switch that's failed in service, I'd recommend reaching out to the team directly for a repair/replacement assessment — .

If you can share the part number, I can pull up the datasheet and specs to help narrow it down further.

### Q67. Why do RF switches have insertion loss even when they are closed?

Great question — it comes up a lot in system design.

Even in the "closed" (through) state, an RF switch has insertion loss because it is never a perfect conductor. Here are the main contributors:

**1. Semiconductor resistance (R_on)**
FET and PIN diode switches have a finite on-resistance (R_on) in the conducting channel. This resistance dissipates power and creates a voltage divider with the 50Ω system impedance — some signal is lost as heat.

**2. Parasitic reactances**
Every switch element has parasitic capacitance and inductance from the die, bond wires, and package. These create impedance mismatches and reactive loss, which worsen with frequency. This is why insertion loss specs always increase toward the high end of the frequency range.

**3. Package and substrate loss**
The plastic/ceramic package, bond wires, and PCB traces between the RF port and the switch die all add resistive and dielectric loss — small at low frequencies, significant at mmWave.

**4. Impedance mismatch**
If the switch's input/output impedance in the on-state isn't exactly 50Ω, some power is reflected rather than transmitted. Reflected power = loss in the forward path.

**5. Skin effect and conductor loss**
At high frequencies, current flows only on the surface of conductors (skin depth shrinks). This increases effective resistance and therefore loss.

---

**Practical takeaway for system designers:**

- Insertion loss compounds in a cascade — if you have two switches in series, you pay the loss twice.
- Use Friis' formula to account for switch loss in your noise figure and gain budget.
- For receive paths, place the switch as late as possible (after the LNA) so its loss doesn't degrade system NF.
- For transmit paths, make sure the switch's power handling (P1dB, max power) exceeds your PA output — otherwise loss isn't your only problem.

Anything specific you're designing — an SPDT in a T/R switch, a multi-throw for band switching, etc.? Happy to help find the right part.

### Q68. Using the VSWA2-63DR+. Isolation drops to 20dB at 5GHz. Is this expected or a layout issue?

Good question. Let me give you a straight answer based on the datasheet and what's typical for this device at 5 GHz.

**Short answer: 20 dB isolation at 5 GHz is broadly in the expected ballpark for this part, but layout can absolutely make it worse — so both factors are in play.**

---

**About the VSWA2-63DR+**

This is a reflective SPDT switch in a small SMT package. The "63" in the name indicates it covers up to ~6 GHz. Isolation in absorptive/reflective switches typically degrades with frequency due to:

1. **Parasitic capacitance across the OFF-state FET** — at 5 GHz, even a few tens of fF presents a low enough reactance to couple RF through the OFF port. This is a device physics limitation.
2. **Package parasitics** — bond wires and pad capacitance add additional coupling paths at higher frequencies.

The datasheet graphs will show you the rated isolation vs. frequency curve — check the View Graphs and Datasheet (PDF) to see where 5 GHz falls on the spec curve. If your measured 20 dB matches the datasheet curve at 5 GHz, it's device-limited, not a layout problem.

---

**Layout factors that can degrade isolation further**

If your measured isolation is *worse* than the datasheet curve, suspect:

- **Ground plane gaps or voids under the switch** — the switch relies on a solid, low-inductance ground. Any discontinuity adds common-mode coupling between RF1 and RF2.

- **RF1/RF2 trace routing too close together** — at 5 GHz, even a few mm of parallel trace can couple 5–10 dB of additional leakage.

- **Insufficient via stitching around the RF pads** — use a dense via fence between the two RF paths to break substrate coupling.

- **Shared power/ground return paths** — if Vdd/Vss runs near the RF lines, it can act as a coupling conduit.

- **Missing or inadequate bypass capacitors on the control/bias lines** — these lines can re-radiate at GHz frequencies if not well-bypassed close to the device.

**Recommended check:** Compare your board measurement against the S-parameters in the S-parameter file (.s3p) or simulate using the published data. Also review the PCB Layout reference (98-PL-278) and, if you haven't already, try the Eval Board (TB-486+) layout as a known-good baseline.

If your result matches the datasheet at 5 GHz and you need more isolation, you'd need to cascade two switch devices or look at a part with a higher isolation spec — happy to help find one if needed.

*Parts surfaced:* VSWA2-63DR+, TB-486+

### Q69. What is the lifespan (number of cycles) for your mechanical switch matrices?

Mechanical switch matrices aren't a product line where I have cycle-life specs in my catalog database — that level of detail lives in the individual product documentation and depends heavily on the specific switch technology used.

For accurate cycle-life specifications, I'd recommend:

1. **Check the datasheet** for the specific switch matrix model you're evaluating — it will list the mechanical endurance rating if published.
2. **Contact the Mini-Circuits team directly** for application-specific guidance, especially if you have a high-cycle or reliability-critical use case.

 — This is best answered by a Mini-Circuits applications or sales engineer who can pull the exact reliability data for the product you're considering.

If you have a specific switch matrix part number in mind, share it and I can pull up its product page and datasheet link for you.

### Q70. how fast can i switch the solid state switches? like 1 megahertz?

To point you to the right switches and confirm switching speed specs, I need a bit more info. Fill in what you know:

To find the right **solid-state RF switch**, fill in what you know (leave blank or "any" if unsure):

- **Frequency (RF signal):** e.g. 2.4 GHz, DC–6 GHz
- **Configuration:** SPST, SPDT, SP4T, SP6T…
- **Switching speed target:** 1 MHz toggle rate, or a specific rise/fall time?
- **Reflective or absorptive (terminated):**
- **Control voltage/logic:** TTL, CMOS, 3.3 V, 5 V…
- **Package:** SMT, connectorized, or any

Reply with whatever you've got and I'll find the best matches.

## Cables & Adapters

### Q71. What is the phase stability over flexure for the CBL-2FT-SMSM+ test cables at 18 GHz?

The product detail return doesn't include the specific phase-stability-over-flexure figure in its structured data. That spec is typically found in the full datasheet rather than the web product page summary.

Here's what I can point you to:

- Datasheet (PDF) — this is the best place to find the phase stability over flexure spec at 18 GHz, along with amplitude stability and bend-cycle ratings.
- View Graphs — includes insertion loss and other performance curves vs. frequency.

I don't want to quote a number I don't have confirmed from the tool result, so I'd recommend pulling the datasheet directly for that figure. If you can't find it there or need to confirm for a test report, I can route you to the applications team — .

*Parts surfaced:* CBL-2FT-SMSM+

### Q72. I bent a semi-rigid cable to 90 degrees and now the VSWR is terrible. Did I break the center conductor?

That's a very common failure mode with semi-rigid cable. Here's how to think through it:

**What likely happened**

Semi-rigid cable (typically UT-085, UT-141, etc.) uses a solid copper center conductor and a seamless copper outer conductor. When you bend it past its minimum bend radius — or bend it sharply at a single point — several things can go wrong:

1. **Center conductor kink or fracture** — the most common cause of sudden VSWR degradation. A kinked center conductor creates a mechanical impedance discontinuity (the local geometry changes, so Z₀ shifts away from 50Ω at that point).
2. **Outer conductor deformation** — the outer wall can buckle or flatten, again changing the coax geometry and Z₀.
3. **Dielectric cracking** — the PTFE or PE fill can crack, creating an air gap and another impedance step.
4. **Center conductor pullback** — in extreme cases, the center conductor can separate from the connector crimp or solder joint.

**How to diagnose it**

1. **VNA sweep** — do a return loss vs. frequency sweep. A purely reactive (lossless) discontinuity shows a sharp, frequency-periodic VSWR ripple. A resistive fault (partial break) shows a more broadband VSWR floor plus elevated insertion loss.
2. **Time-domain reflectometry (TDR)** — this is definitive. It will show you the exact physical location of the fault along the cable. A kink appears as a sharp spike at the corresponding time delay.
3. **Physical inspection** — run your fingers along the bend. If you can feel a flat spot or a hard kink point, the outer conductor is deformed there.
4. **DC continuity** — a simple ohmmeter check on the center conductor rules out a full break, but won't catch a partial kink or impedance change.

**A quick VSWR sanity check**

If you measured, say, VSWR = 3:1 at the problem frequency:

> |Γ| = (3−1)/(3+1) = 0.5 → Reflected power = 0.5² × 100% = **25%**
> RL = −20·log₁₀(0.5) = **6 dB**

That's a significant impedance discontinuity — consistent with a kink.

**Bottom line**

Semi-rigid cable is not re-bendable once formed. If it was bent sharply in the field, the cable assembly almost certainly needs to be replaced. Mini-Circuits offers a range of semi-rigid and flexible coax cable assemblies — if you'd like help finding a replacement (or a more bend-tolerant flexible alternative), just let me know your connector types, length, and frequency range.

### Q73. What is the difference between SMA and 3.5mm connectors? Can I screw them together?

Great question — this comes up a lot in the lab.

**SMA vs. 3.5mm: Key Differences**

| | SMA | 3.5 mm |
|---|---|---|
| **Outer diameter** | 7.00 mm (0.276") | 3.50 mm (0.138") |
| **Frequency rating** | Typically DC to 18 GHz | DC to 34 GHz |
| **Impedance** | 50 Ω | 50 Ω |
| **Dielectric** | PTFE (solid) | Air with support bead |
| **Thread** | 5/16"-36 UNS | 5/16"-36 UNS |
| **Precision** | Commercial grade | Precision/metrology grade |

**The critical point: same thread, different inner geometry.**

SMA and 3.5 mm connectors share the same 5/16"-36 thread pitch, so they will physically mate — the nut will engage and tighten. However, they are **not fully mechanically or electrically compatible**:

- The **center pin dimensions differ slightly**. A 3.5 mm connector has a smaller, more precisely machined center conductor. Mating them repeatedly can **deform or damage** the 3.5 mm center pin, which is expensive to replace (especially on a VNA port).
- **Electrical performance degrades** above ~18 GHz when mixing the two, since SMA's PTFE dielectric limits it to ~18 GHz regardless.
- **Metrology-grade 3.5 mm** connectors can be permanently damaged by a worn or oversized SMA pin.

**Recommendation:**

- Below 18 GHz in a lab/production setting: mating them works in a pinch, but it's not best practice.
- If you need to interface the two regularly, use a proper **SMA-to-3.5 mm adapter** — Mini-Circuits carries these. They are designed to handle the interface safely.
- For anything above 18 GHz, stay all-3.5 mm (or go to 2.92 mm/2.4 mm).

Want me to find an SMA ↔ 3.5 mm adapter in the catalog? If so, let me know the gender combination you need (e.g. SMA-male to 3.5mm-female).

### Q74. Need an adapter: N-Type Female to SMA Male, right angle, up to 18 GHz.

The closest match I can confirm from the catalog is **NF-SM50+** — an N-Type Female to SMA Male adapter, 50Ω. The catalog search returns it for this connector combination, and it's well-stocked. However, I want to be upfront: the tool result does not explicitly list a numeric frequency upper limit in its structured data, so I can't confirm from the returned specs alone that it's rated to 18 GHz. Please verify that in the datasheet.

****NF-SM50+** — N Female → SMA Male, 50Ω**

  
- Impedance: 50Ω
  
- Stock: more than 1,000 units

**Pricing:**

  
 | Qty |  | Unit Price (USD) | 

  
 | 1–10 |  | $32.66 | 

  
 | 25 |  | $31.22 | 

  
 | 50 |  | $29.39 | 

  
 | 100 |  | $28.38 | 

  
 | 250 |  | $24.76 | 

**Downloads:**

  
- Datasheet (PDF)
  
- View Data
  
- View Graphs
  
- S-Parameters (.s2p)
  
- Case Style Drawing (DJ826)

Please check the datasheet to confirm the 18 GHz right-angle rating. If that part doesn't meet your exact mechanical or frequency spec, let me know and I can dig further or loop in the team.

*Parts surfaced:* NF-SM50+

### Q75. What is the specified mating torque for the 2.92mm precision adapters?

The mating torque specification isn't surfaced in the online product data returned by the catalog — it's a mechanical detail typically found in the full datasheet. For the 2.92mm precision adapters, I'd recommend checking the datasheet directly, as it will contain the specified torque value.

For example, for the **24F-KF+** (2.92mm F-F adapter):
Datasheet (PDF)

As a general reference, 2.92mm (K) connectors are typically torqued to **8 in-lb (0.9 N·m)**, which is the industry-standard specification for this connector type per the MIL-PRF-39012 and related standards — but please confirm against the specific Mini-Circuits datasheet for the exact adapter you're using, as that is the authoritative value.

If you need help with a specific 2.92mm adapter model, let me know and I can pull up its datasheet link directly.

*Parts surfaced:* 24F-KF+

### Q76. My hand-formable cable (086-series) lost its shape after the 5th time I bent it. Are these single-use?

Good question — hand-formable cables are definitely not single-use, but they do have limits.

**How hand-formable cables work**

The 086-series uses a semi-rigid coaxial construction (typically with a tinned copper or aluminum outer conductor) that you can bend by hand to a desired shape. The key distinction from true semi-rigid is that it's *slightly* more forgiving, but it's still a metallic outer conductor — not a flexible braid. Each bend work-hardens the metal a bit.

**How many bends is realistic?**

In practice, most hand-formable cables are designed for **a handful of re-formations** (typically in the range of 5–20, depending on bend radius and angle), not for repeated flexing like a flexible cable. If yours lost shape on the 5th bend, that's within the expected envelope — especially if:

- The bends were tight (close to or below the minimum bend radius)
- The same spot was bent repeatedly
- The outer conductor has started to kink or crack

**What to do**

- If the cable still has good electrical performance (check VSWR/insertion loss), it may still be usable in its current shape.
- If the outer conductor is kinked or cracked, that's a reliability risk — replace it.
- If you need a cable you'll re-route frequently, consider a **flexible cable** (braided outer conductor) instead of hand-formable.

Let me know your frequency range, connector types, and length and I can pull up the right flexible or hand-formable replacement from the catalog.

*Parts surfaced:* Cables

### Q77. why are some cables rated for 18ghz and others only 6ghz if they both have sma connectors?

Great question — the SMA connector itself is often not the limiting factor. Here's what actually drives the frequency rating:

**1. Cable construction (the biggest factor)**
The coax inside the assembly determines most of the bandwidth. Key variables:
- **Dielectric material** — PTFE (Teflon) and air-dielectric designs push higher than polyethylene or foam
- **Center conductor diameter & shield quality** — smaller, more precise geometry supports higher-order mode suppression
- **Braided vs. semi-rigid vs. phase-stable** — semi-rigid (solid outer conductor) maintains tighter dimensional tolerances, enabling 18–40 GHz ratings

**2. SMA connector grade**
SMA is nominally rated to **18 GHz** by the standard, but connector quality varies enormously:
- Economy SMA connectors (press-fit, crimped) may only be reliable to **6–8 GHz** in practice due to impedance discontinuities at the connector-to-cable junction
- Precision SMA connectors (machined, controlled impedance interface) can reach the full **18 GHz**
- Above 18 GHz, you'd move to **2.92 mm (K)**, **2.4 mm**, or **1.85 mm** connectors

**3. Connector-to-cable interface**
Even a great connector paired with a poor cable transition (bad solder joint, impedance bump, or physical mismatch at the crimp) creates reflections that limit usable bandwidth. The whole assembly is rated as a system — the weakest link wins.

**4. Insertion loss slope**
Higher-frequency cables use lower-loss dielectrics and tighter geometry to keep insertion loss manageable. A 6 GHz cable at 18 GHz wouldn't just reflect — it would also have unacceptably high loss per foot.

**Bottom line:** "SMA" tells you the connector interface standard, not the system bandwidth. The cable type + connector grade + assembly quality together set the real upper frequency limit. If you're working above ~12 GHz, it's worth specifying precision SMA or stepping up to a 2.92 mm connector even if the mating part is SMA.

Want me to pull up some specific Mini-Circuits cable options for a particular frequency range or application?

*Parts surfaced:* Cables

### Q78. Seeing passive intermodulation (PIM) in our system. Are your standard flexible cables low-PIM rated?

Good question — PIM is a real concern in high-power systems like cellular base stations, DAS, and test environments.

**Standard flexible cables are not PIM-rated.** Mini-Circuits' standard flexible cable assemblies are designed for general lab and system use. They are not characterized or specified for PIM performance, and their connectors and cable materials are not selected for the low-ferromagnetic-content requirements that PIM-sensitive applications demand.

**For low-PIM applications, here's the picture:**

Mini-Circuits does offer **phase-stable / flexible cable assemblies** that are widely used in test and system integration, but if PIM is your primary spec, the right path depends on your system:

- **PIM level required** (e.g., ≤ −150 dBc, −160 dBc per 3GPP TS 25.466 or IEC 62037?)
- **Frequency band** (700 MHz, 1.7/2.1 GHz AWS, 2.5 GHz, etc.)
- **Connector types** (N, 4.3-10, 7-16 DIN, SMA?)
- **Power level** (carriers at +43 dBm / 20W each is typical for base station PIM testing)

**My honest recommendation:**

For a guaranteed low-PIM cable assembly (with a PIM spec on the datasheet), this is a custom or specialty product. I'd route you to the Mini-Circuits team who can confirm what's available or configure something to your spec. 

In the meantime, if you want to share your frequency band and connector requirements, I can search for the closest standard cable options and let you know what specs they carry — even if PIM isn't explicitly listed.

*Parts surfaced:* Cables

### Q79. Do you sell bulk raw cable or only pre-terminated assemblies?

The catalog search isn't surfacing individual bulk cable SKUs directly, so here's an honest answer:

**Mini-Circuits' primary cable offering is pre-terminated cable assemblies** — a broad range with connector combinations like SMA, N, BNC, MCX, MMCX, etc., in standard and custom lengths. You can browse the full lineup here:
Mini-Circuits Cables — Full Product Page

**For bulk/raw coax or custom-length unterminated cable**, that falls into the Custom Assemblies territory. I'd recommend reaching out to the team directly — they can confirm availability, cable types, and pricing. 

Is there a specific application in mind? If you tell me the frequency range, connector type, or length you need, I can point you to the closest standard assembly or help you frame the custom request.

*Parts surfaced:* Cables

### Q80. the sma connector on my test cable is freely spinning. is that normal or is it broken?

Good question — and the answer depends on *which* part of the connector is spinning.

**Normal (by design):**
The outer **coupling nut** (the hexagonal threaded ring) is meant to spin freely. That's how SMA connectors work — you thread the nut onto the mating connector while the body stays fixed. So if the hex nut rotates independently of the cable body, that's completely normal.

**Not normal (likely damaged):**
If the entire connector body is rotating relative to the cable — meaning the cable jacket or the connector backshell is spinning — that's a problem. It usually means:
- The connector crimp or solder joint has failed
- The cable has delaminated from the connector
- The strain relief has broken internally

**How to tell the difference:**
1. Hold the cable body still a few inches back from the connector.
2. Try to rotate just the hex nut with your fingers — it should spin freely.
3. Now try to rotate the *whole connector body* (the cylindrical part behind the nut) — it should **not** move relative to the cable. If it does, the connector is compromised.

**Why it matters:**
A spinning connector body can cause intermittent contact, degraded return loss, and unreliable measurements — especially at higher frequencies. If it's broken, it's worth replacing the cable or having the connector re-terminated before trusting any test data from it.

Need help finding a replacement cable or connector? I can pull up Mini-Circuits cable options if you give me the frequency range and connector configuration you need.

## VCOs & Synthesizers

### Q81. For the ROS-2500V+, what is the tuning sensitivity (MHz/V) at the center of the band, and what is the typical phase noise at 10kHz offset?

The catalog search didn't surface **ROS-2500V+** either — the detailed numerical specs (tuning sensitivity in MHz/V, phase noise at a specific offset) aren't returned by our catalog tools even when a part is found; those live in the datasheet itself.

Here's what I'd recommend:

1. **Check the datasheet directly** — the ROS-2500V+ datasheet should be at:

   ROS-2500V+ Datasheet (PDF)

   The tuning sensitivity curve (MHz/V vs. tuning voltage) and phase noise table/plot are both standard inclusions on Mini-Circuits VCO datasheets.

2. **What to look for in the datasheet:**
   - **Tuning sensitivity** — typically given as a curve or a min/typ/max table at the center tuning voltage. For a ~2500 MHz VCO, values commonly run in the range of tens to low hundreds of MHz/V, but I cannot state a specific number without the tool returning it.
   - **Phase noise at 10 kHz offset** — listed in the "Electrical Specifications" table as a typical dBc/Hz value.

3. If you can't access the PDF or need confirmation of a specific value for a design review, the Mini-Circuits applications team can help — .

### Q82. My VCO output frequency is shifting wildly when I touch the power supply cable. Is this load pulling or supply pushing?

Great diagnostic question. Based on what you're describing, this is almost certainly **supply pushing**, not load pulling. Here's how to tell them apart:

**Supply Pushing**
Sensitivity of the VCO output frequency to changes in supply voltage (V_cc). Touching the power cable changes its impedance/resistance slightly, causing small voltage fluctuations at the VCO's V_cc pin — and if the VCO has poor supply rejection, that directly modulates the output frequency.
- Unit: Hz/V (or kHz/V, MHz/V)
- Symptom: frequency shifts when you flex/touch the supply cable or when other loads on the rail switch on/off

**Load Pulling**
Sensitivity of the VCO output frequency to changes in the **RF load impedance** presented at its output port.
- Unit: Hz/Γ (or MHz/peak, over a full 360° rotation of the load impedance on a Smith chart)
- Symptom: frequency shifts when you change the RF connector, swap cables on the output, or vary the impedance of whatever the VCO is driving

Since the trigger is **touching the power supply cable** (not the RF output), supply pushing is the culprit.

---

**Practical fixes to try, in order:**

1. **Decouple the supply aggressively.** Add a multi-stage bypass network right at the VCO V_cc pin — a bulk cap (10–100 µF), a mid-range cap (100 nF), and a small cap (10–100 pF) all in parallel, placed as close to the pin as possible.

2. **Add a series RF choke (ferrite bead or inductor)** between the regulator output and the VCO supply pin to isolate high-frequency noise on the rail.

3. **Use a low-dropout linear regulator (LDO)** with high PSRR (power supply rejection ratio) specifically for the VCO rail — keep it separate from noisy digital logic supplies.

4. **Check PCB layout.** Long, thin supply traces act as antennas. The supply should be a low-impedance, short path directly to the bypass caps.

5. **Verify your cable/connector integrity.** A loose crimp or intermittent contact in the power cable will make this dramatically worse.

---

If you'd like, I can help you find a suitable RF choke or bias tee for the VCO supply line — just let me know the frequency range and DC current your VCO draws.

*Parts surfaced:* Cables

### Q83. What does a PLL actually do to a VCO?

Good question — here's the practical explanation.

**A PLL (Phase-Locked Loop) disciplines a VCO to a stable reference.**

A free-running VCO is inherently noisy and drifts — its output frequency wanders with temperature, supply voltage, and component aging. The PLL wraps a feedback loop around it to fix that.

**How it works, step by step:**

1. **Divide** — The VCO output is fed into a frequency divider (÷N), bringing it down to the reference frequency.
2. **Compare** — A phase-frequency detector (PFD) compares the divided VCO signal against a clean, stable reference (usually a crystal oscillator).
3. **Correct** — Any phase/frequency error produces an error signal from the PFD, which drives a charge pump and loop filter, generating a DC correction voltage.
4. **Tune** — That correction voltage is fed back to the VCO's tuning input (varactor), pulling the frequency until the error goes to zero.

At lock, the VCO output is an exact integer (or fractional) multiple of the reference: **f_out = N × f_ref**.

**What the PLL actually buys you:**

| Property | Free-running VCO | PLL-locked VCO |
|---|---|---|
| Frequency accuracy | Poor (drifts) | Inherits reference accuracy |
| Long-term stability | Poor | Crystal-like |
| Phase noise (close-in) | Moderate | Greatly reduced (inside loop BW) |
| Phase noise (far-out) | Set by VCO | Set by VCO (loop can't help here) |
| Agility | Fixed tune voltage | Programmable via ÷N |

**The phase noise picture** is worth understanding: inside the loop bandwidth, the PLL suppresses the VCO's own noise and the output tracks the (amplified) reference noise floor. Outside the loop bandwidth, the VCO noise is unaffected. So loop bandwidth choice is a trade-off — wider BW cleans up close-in spurs faster but can let reference spurs through.

**Bottom line:** The PLL turns a cheap, agile-but-drifty VCO into a frequency-accurate, low-phase-noise source that can be digitally programmed to any channel by changing N.

Want help selecting a Mini-Circuits VCO or synthesizer for a specific frequency/phase-noise requirement?

### Q84. Looking for a USB-controlled frequency synthesizer that outputs 5 GHz to 10 GHz with sub-Hz step size.

The catalog search returns one synthesizer model in this space — **KSN-2346A+** — but the tool result doesn't include the full frequency range or step-size specs for that part, so I can't confirm it covers 5–10 GHz with sub-Hz resolution from the data returned. The datasheet will have the definitive specs.

Datasheet (PDF) | Product Page

**Pricing (qty breaks):**

  
 | Qty |  | Unit Price (USD) | 

  
 | 20 |  | $38.64 | 

  
 | 25 |  | $38.38 | 

  
 | 50 |  | $38.11 | 

  
 | 100 |  | $37.72 | 

  
 | 250 |  | $34.21 | 

**Stock:** Currently showing 0 — you'd want to check lead time or contact the team.

---

That said, your requirements (5–10 GHz, sub-Hz step, USB control) are quite specific. For a benchtop/rack USB-controlled signal source at those frequencies and that resolution, this may also fall into Mini-Circuits' **programmable test system** territory, where the right fit is confirmed by the applications team rather than a standard catalog pick.

I'd recommend reaching out for a fuller conversation — . They can confirm whether **KSN-2346A+** meets your step-size and control requirements, or point you to a better-fit solution.

*Parts surfaced:* KSN-2346A+

### Q85. Using the SSG-6000RC. The fractional-N spurs are too high at 100 kHz offset. Can I change the internal loop filter bandwidth?

The **SSG-6000RC** is a fully self-contained signal generator — the PLL loop filter is internal and fixed. There is no user-accessible command or hardware adjustment to change the loop filter bandwidth.

Here's what that means for your fractional-N spur situation, and what you can actually do:

**Why the spurs appear at 100 kHz offset**
Fractional-N spurs are a byproduct of the delta-sigma modulator in the PLL. Their level and offset frequency are set by the PLL IC, the reference frequency, and the loop filter — all internal to the SSG-6000RC and not user-configurable.

**Practical workarounds within the instrument**
- **Change the output frequency slightly.** Even a small shift (a few kHz) can move the fractional boundary and significantly change spur levels. Fractional-N spurs are highly frequency-dependent — worth trying first.
- **Check if an integer-N channel spacing exists.** If your application tolerates it, choose a frequency that is an integer multiple of the reference to land in integer-N mode, where these spurs disappear entirely.

**If neither workaround is sufficient**
The loop filter architecture is not field-modifiable. For a use case requiring a specific frequency with tighter fractional-N spur suppression than the SSG-6000RC provides, the realistic options are:
- Adding an external bandpass filter on the RF output to reject the spur (practical if your output frequency is fixed).
- Evaluating a different signal source with a lower-noise fractional-N architecture or a configurable loop bandwidth.

For a deeper discussion of the SSG-6000RC's PLL performance characteristics or to ask about custom/alternate solutions, the engineering team is the right contact — .

Relevant docs:
- SSG-6000RC Datasheet (PDF)
- View Graphs (PDF)

*Parts surfaced:* SSG-6000RC

### Q86. im applying 5V to the tune pin but the frequency isn't changing.

That sounds like a VCO tuning issue. A few things to check:

**1. Verify the tuning pin is actually seeing 5 V**
Measure directly at the device pin (not just your supply) — a series resistor or ferrite bead in the tune line can drop voltage significantly under the tuning diode's leakage current.

**2. Check the tuning voltage range for your specific part**
Most VCOs have a defined V_tune range (e.g., 0.5–4.5 V, or 1–18 V). If 5 V is at or beyond the rail limit, the varactor may be fully reverse-biased and saturated — you'd be stuck at one end of the band. Check the datasheet spec for V_tune(min/max).

**3. Confirm the tune pin isn't being loaded down**
The tune node is high-impedance. If your source has a low output impedance or you've placed a large capacitor directly on the tune line, it can slow response or clamp the voltage. Use a 10 kΩ–100 kΩ series resistor between your DAC/pot and the tune pin, with no large cap directly at the pin.

**4. Check for DC path issues**
Some VCOs require the tune pin to have a DC return to ground (through a resistor). If the pin is floating or AC-coupled without a DC bias path, tuning won't work.

**5. Confirm power and ground**
Measure Vcc at the device pin. A marginal supply under load can cause the oscillator to lock at a fixed frequency or stop oscillating entirely.

**6. Look at the output**
If there's no output signal at all, the VCO may not be oscillating — that's a separate issue from tuning. Check output power with a spectrum analyzer or power meter.

---

Which VCO model are you working with? If you share the part number I can pull the exact tuning specs and datasheet so we can check against your setup.

### Q87. What is the difference between phase noise and jitter?

Good question — they're two ways of describing the same fundamental phenomenon (timing uncertainty in an oscillator or clock), just in different domains.

---

**Phase Noise** — frequency domain

Phase noise is the spectral representation of short-term frequency instability. It's measured as the power in a 1 Hz bandwidth at a given offset frequency from the carrier, normalized to the carrier power:

*L(f) in dBc/Hz at offset f*

- Preferred in RF/microwave work where you're thinking in terms of spectra and spurious signals.
- A phase-locked oscillator might spec: −100 dBc/Hz @ 10 kHz offset.
- Matters for receiver selectivity (reciprocal mixing), synthesizer settling, radar Doppler resolution.

---

**Jitter** — time domain

Jitter is the RMS (or peak-to-peak) variation in the timing of clock edges relative to their ideal positions, measured in seconds (typically ps or fs).

- Preferred in digital/data-converter work where you care about sampling aperture and bit-error rate.
- A clock oscillator might spec: 200 fs RMS jitter (integrated 12 kHz–20 MHz).

---

**The relationship**

They are mathematically linked via integration of the phase-noise spectral density over a defined offset-frequency band:

> **σ_t (RMS jitter)** = (1 / πf_carrier) × √( ∫ L(f) df )

where the integral is taken over the jitter bandwidth of interest (e.g., 12 kHz to 20 MHz for telecom clocks). A lower phase-noise floor and fewer close-in spurs → lower integrated jitter.

---

**Practical rule of thumb**

| You're designing… | Think in… |
|---|---|
| RF/microwave oscillator, PLL, synthesizer | Phase noise (dBc/Hz) |
| ADC/DAC clock, SerDes, digital timing | Jitter (ps/fs RMS) |
| Both (e.g., direct-RF sampling) | Both — convert between them |

The two specs are complementary, not redundant. Phase noise gives you the full spectral shape (useful for identifying specific offset-dependent problems like close-in flicker or broadband white-noise floor), while jitter gives you a single integrated number that's directly relatable to SNR degradation in a data converter.

Let me know if you'd like help selecting a low-phase-noise oscillator or VCO for a specific application.

### Q88. What is the harmonics level on the JTOS-3000P+ VCO at full tuning voltage?

The part number **JTOS-3000P+** didn't come up in the live catalog — it may be a discontinued, renamed, or non-standard variant. The search also didn't surface it.

For harmonics specs, the datasheet is the definitive source. Here's what I'd suggest:

1. **Check the datasheet directly** — if you have a prior datasheet for the JTOS-3000P+, the harmonics level (typically specified in dBc relative to the fundamental, at maximum tuning voltage) will be in the electrical specifications table.

2. **Try the Mini-Circuits site search** at minicircuits.com — if the part is still listed (even as end-of-life), the datasheet will be accessible.

3. **Contact the applications team directly** — they can confirm whether the part is still active, pull the spec, or suggest a current equivalent. 

If you can share the approximate frequency range or tuning voltage, I can look for a current equivalent JTOS-series VCO that may have the same harmonics spec documented.

### Q89. Are your surface mount VCOs hermetically sealed?

Most Mini-Circuits surface mount VCOs are **not hermetically sealed** — they use standard SMT plastic/ceramic packaging, which is the norm for commercial and industrial-grade VCOs.

However, Mini-Circuits does offer **hi-rel screening and space upscreening services** that can include more stringent environmental testing. For true hermetic packages, that's typically a custom or hi-rel request.

A few options depending on your need:

- **Hi-Rel Screening:** Hi-Rel Screening | Mini-Circuits — additional screening options for standard parts
- **Space Upscreening:** Space Upscreening | Mini-Circuits — for space-grade applications
- **Custom/Quantum:** If you need hermetic packaging for a cryogenic or space environment, that's worth a direct conversation with the team — 

If you can share more about your application (frequency range, environment, volume), I can point you to the right VCOs or escalate to the right team.

### Q90. how long does it take for the synthesizer to lock onto a new frequency?

That's a great question, but the answer depends on the specific synthesizer part — lock time varies by model and isn't a single catalog-wide spec.

To point you to the right datasheet or part, a bit more context helps:

To find the right **synthesizer**, fill in what you know (leave blank / "any" if unsure):
- **Frequency range:** e.g. 500–1000 MHz
- **Step size / resolution:** e.g. 1 kHz, 1 MHz
- **Phase noise requirement:** e.g. −90 dBc/Hz @ 10 kHz offset
- **Reference / control interface:** e.g. SPI, parallel, external ref frequency
- **Part number (if known):** ← fastest path to lock-time spec

If you already have a part number in mind, share it and I'll pull the datasheet directly.

## Test Equipment (Power Sensors, Generators, Racks)

### Q91. What is the measurement uncertainty of the PWR-SEN-8G+ power sensor at -20 dBm at 6 GHz?

The part number **PWR-SEN-8G+** doesn't appear to exist in the Mini-Circuits catalog — it may be a typo or discontinued model. The catalog does not return any results for that exact part number.

A few things to note:

- **Measurement uncertainty** at a specific power level and frequency (e.g., −20 dBm at 6 GHz) is a detailed spec that lives in the datasheet's uncertainty tables or graphs — it's not something I can derive without the actual datasheet data.
- This spec is also **condition-dependent**: it typically varies with frequency, power level, temperature, and mismatch uncertainty from the source.

**What I'd suggest:**

1. Double-check the part number — did you mean something like **PWR-8GHS**, **PWR-8GHS-RC**, or **PWR-8P-RC**? These are 8 GHz USB power sensors in the catalog.
2. If you have the correct part number, share it and I'll pull the datasheet link directly so you can check the uncertainty tables.
3. For detailed uncertainty budgets, the datasheet's "Measurement Uncertainty" section (or its associated graphs) is the authoritative source.

Which part did you have in mind?

*Parts surfaced:* PWR-8GHS, PWR-8GHS-RC, PWR-8P-RC

### Q92. Trying to run the Python API for the USB power sensor on Linux, but getting a pyvisa timeout error.

That's a common snag on Linux. Here are the most frequent causes of pyvisa timeout errors with the Mini-Circuits USB power sensor, in order of likelihood:

**1. USBTMC kernel driver conflict**
Linux loads its own `usbtmc` kernel module, which can block libusb/pyvisa-py from accessing the device.

- Check if it's loaded: `lsmod | grep usbtmc`
- If so, unload it: `sudo rmmod usbtmc`
- To make it persistent across reboots, blacklist it:
`echo "blacklist usbtmc" | sudo tee /etc/modprobe.d/blacklist-usbtmc.conf`

**2. udev permissions (no sudo)**
Without a udev rule, only root can access the USB device.

- Find your device's VID/PID: `lsusb` (Mini-Circuits VID is typically `0x20CE`)
- Create a udev rule:
`echo 'SUBSYSTEM=="usb", ATTR{idVendor}=="20ce", MODE="0666", GROUP="plugdev"' | sudo tee /etc/udev/rules.d/99-minicircuits.rules`
- Reload and replug: `sudo udevadm control --reload-rules && sudo udevadm trigger`

**3. pyvisa backend — make sure you're using pyvisa-py + libusb**
The NI-VISA backend is Windows-only. On Linux you need:
```
pip install pyvisa pyvisa-py
sudo apt install libusb-1.0-0  # or libusb-dev
```
Open the resource with the `@py` backend explicitly:
```python
import pyvisa
rm = pyvisa.ResourceManager('@py')
```

**4. Timeout value too short**
The sensor can be slow to respond on first connect. Increase the timeout:
```python
sensor = rm.open_resource('USB0::0x20CE::...')
sensor.timeout = 10000  # 10 seconds, in ms
```

**5. Resource string — USBTMC format**
Make sure you're using the correct VISA resource string. List available resources first:
```python
print(rm.list_resources())
```
It should look like: `USB0::0x20CE::::::INSTR`

---

**Recommended debug sequence:**
1. Unload `usbtmc` kernel module
2. Add the udev rule and replug
3. Run `rm.list_resources()` — confirm the device appears
4. Increase timeout to 10 s
5. Send a simple query like `*IDN?` to verify comms

If the device still doesn't appear in `list_resources()` after steps 1–2, the issue is at the OS/driver level, not pyvisa. Let me know what `lsusb` shows and which sensor model you're using and I can narrow it down further.

### Q93. What's the difference between a peak power sensor and a true RMS power sensor?

Great question — here's a practical breakdown:

**Peak Power Sensor**

Measures the **instantaneous peak** of the RF waveform envelope. It tracks fast amplitude variations in time, so it can capture:
- Peak power, crest factor, and pulse parameters (rise time, pulse width, duty cycle)
- Burst and pulsed waveforms (radar pulses, TDMA bursts, 5G NR slots)
- Power vs. time profiles

It essentially follows the envelope of the signal, and its bandwidth determines how faithfully it can track fast edges.

**True RMS Power Sensor**

Measures the **average power** of the signal, computed as the true root-mean-square of the voltage waveform — regardless of modulation complexity. This means:
- Accurate average power for **any** waveform shape (CW, modulated, multi-carrier, noise-like)
- Result is independent of crest factor — no correction factor needed for complex signals
- Does **not** capture time-domain envelope behavior

---

**Key differences at a glance:**

  
 | Property |  | Peak Power Sensor |  | True RMS Sensor | 

  
 | Measures |  | Instantaneous envelope peak |  | Average (mean-square) power | 

  
 | Waveform insight |  | Time-domain: pulse shape, duty cycle, crest factor |  | Average power only | 

  
 | Modulation accuracy |  | Requires crest-factor correction for avg power |  | Accurate for any modulation | 

  
 | Best for |  | Pulsed/radar, TDMA, 5G NR, burst signals |  | CW, OFDM, multi-carrier, noise | 

  
 | Typical speed |  | Very fast (ns-level triggering) |  | Slower (averaged over time) | 

---

**Rule of thumb:**
- If you need to characterize a **pulsed or bursty** signal in time — use a peak sensor.
- If you need accurate **average power** on a complex or multi-carrier signal — use a true RMS sensor.
- For OFDM signals (LTE, Wi-Fi, 5G), a true RMS sensor gives you the correct average transmitted power directly; a peak sensor would show the instantaneous peaks, which can be 10+ dB higher depending on PAPR.

Want me to look up Mini-Circuits power sensors in either category for a specific frequency range or application?

### Q94. Can we order the USB RF Signal Generators with a valid NIST-traceable calibration certificate?

Great question. NIST-traceable calibration certificates for test instruments like the USB RF Signal Generators fall outside the standard online catalog and require direct engagement with our team.

That said, Mini-Circuits does offer Hi-Rel screening and calibration-related services for certain products. For a specific request like a NIST-traceable cal cert on a USB signal generator, the best path is to speak directly with our applications or sales team — they can confirm availability and arrange it.

You can also reach out via the Mini-Circuits Contact Page to get connected with the right person quickly.

### Q95. Integrating an RC-1SP4T-A18 rackmount switch into a LabVIEW environment. The provided DLL is throwing a 32-bit architecture mismatch error.

Good — I can confirm the RC-1SP4T-A18 is a real part in our catalog. The 32-bit DLL/LabVIEW mismatch is a common integration snag. Here's the breakdown:

---

**Root Cause**

Mini-Circuits ships two DLL variants for its USB/Ethernet-controlled switch and test products:

- `MCL_RF_Switch_Controller64.dll` — for 64-bit applications
- `MCL_RF_Switch_Controller.dll` — for 32-bit applications

LabVIEW's bitness must match the DLL's bitness exactly. If you're running **LabVIEW 64-bit** and calling the **32-bit DLL** (or vice versa), you'll get the architecture mismatch error.

---

**How to resolve it**

1. **Check your LabVIEW bitness.** In LabVIEW: *Help → About LabVIEW* — the title bar or About dialog will say "64-bit" or "32-bit."

2. **Use the matching DLL.** Download the correct DLL package from the Mini-Circuits software page:
Mini-Circuits Switch Controller Software & DLL Download

3. **Update your `Call Library Function Node`.** In LabVIEW, open the Call Library Function Node, point it at the correct DLL path, and verify the function name and calling convention (typically `stdcall` / `Pascal`).

4. **If you must stay on 32-bit LabVIEW** but your OS/project is otherwise 64-bit, you can run the 32-bit LabVIEW runtime alongside — NI supports this — and the 32-bit DLL will load correctly.

5. **Alternatively, use the USB API via .NET or the ActiveX wrapper** (also provided in the same download package), which can be less sensitive to bitness in some LabVIEW configurations.

---

**Useful resources for this unit:**

- Datasheet (PDF)
- View Data (PDF)

---

If after matching bitness you're still seeing errors — function name not found, parameter type mismatch, etc. — let me know the exact error code and I can help you trace it further. For deep software integration support, our apps team can also work directly with you:

*Parts surfaced:* RC-1SP4T-A18

### Q96. my power sensor says -30dbm but my spectrum analyzer says -20dbm. who is right?

Good question — this is a classic 10 dB discrepancy, and both instruments could be "right" given their own reference points. Here are the most common culprits:

**1. Impedance mismatch (most likely)**
If one instrument is 50Ω and the other is 75Ω, you'll see a systematic offset. The mismatch loss is:
ML = −10·log₁₀(1 − |Γ|²), where |Γ| = (75−50)/(75+50) = 0.2
→ ML ≈ 0.18 dB — small, so this alone doesn't explain 10 dB.

**2. Detector type mismatch**
- Power sensors measure **true RMS power** (all energy in band)
- Spectrum analyzers, by default, display **peak** or **quasi-peak** power of a single bin, with a resolution bandwidth (RBW) that matters a lot

**3. RBW / noise power — the most likely cause of a 10 dB gap**
The SA reading is RBW-dependent. If you're looking at a wideband or noise-like signal, the SA shows power in one narrow bin, while the power sensor integrates everything. A 10 dB difference corresponds to roughly a 10× difference in bandwidth — very plausible.

**To diagnose, work through this checklist:**

1. **What type of signal?** CW tone → both should agree within ~1 dB. Wideband/noise → power sensor wins for total power.
2. **Check SA settings** — switch to "channel power" or "band power" mode (set the integration bandwidth to match the signal bandwidth). This is almost always the fix.
3. **Calibration factors** — is the power sensor's cal factor set correctly for your frequency? A missing cal factor table can cause multi-dB errors.
4. **Cable/connector losses** — are both instruments connected at the same point, or is there a cable, coupler, or splitter in between one path?
5. **Attenuator settings** — confirm the SA's reference level and input attenuator are set correctly. An SA with 10 dB input attenuation applied but not accounted for will read 10 dB low.
6. **Power sensor zeroing** — was the sensor zeroed with the source off? A non-zeroed sensor reads high on low-level signals.

**Bottom line:** For a CW signal, the spectrum analyzer is usually more trustworthy once you account for RBW. For a modulated or wideband signal, the power sensor gives the correct total power — just make sure the cal factor is entered for your frequency.

What type of signal are you measuring, and what frequency? I can help narrow it down further.

### Q97. Why do I need to zero the power sensor before measuring low power signals?

Great question — this comes up a lot in RF power measurement setups.

## Why You Zero a Power Sensor

**Zeroing removes internal DC offsets and thermal noise from the sensor's baseline.**

Here's what's actually happening:

**1. Internal offset voltages**
Power sensors (especially diode-based ones) have small DC offset voltages in their detector and amplifier circuitry. At high power levels these are negligible, but at low signal levels they become a significant fraction of the detected signal — introducing a fixed additive error.

**2. Thermal noise floor**
The sensor's internal electronics generate Johnson (thermal) noise. At low power levels (say, −50 dBm and below), this noise floor can be comparable to the signal you're measuring. Zeroing captures the current noise baseline so it can be subtracted.

**3. Temperature drift**
Offsets shift with temperature. Even if you zeroed the sensor an hour ago, if the ambient temperature has changed, the baseline has drifted. Re-zeroing before a measurement session (or periodically during a long one) keeps the correction current.

**4. The math**
If your sensor has an internal offset equivalent to, say, −60 dBm, and you're trying to measure a −55 dBm signal, the uncorrected reading could be off by a dB or more. Zeroing null this out so the sensor reports only what's coming in through the RF port.

---

**The rule of thumb:** always zero with the RF source off (or the port terminated/disconnected), so the sensor captures only its own internal offsets — not any residual signal. Then apply your signal.

**When it matters most:**
- Measuring signals below roughly −40 dBm
- After a temperature change
- After a long period of inactivity
- Any high-accuracy CW or wideband measurement

At high power levels (say, 0 dBm and up) zeroing still doesn't hurt, but its effect on accuracy is much smaller relative to the signal level.

Want help selecting a Mini-Circuits USB power sensor for your application?

### Q98. Can the SSG-6000PRO sweep power and frequency simultaneously (list mode) via SCPI commands?

The SSG-6000PRO doesn't appear in the online catalog as a directly searchable product page, which is typical for Mini-Circuits' benchtop instruments — their full programming documentation lives in dedicated user manuals rather than the standard catalog.

Here's what I can tell you from general knowledge of the SSG-6000RC/PRO line, and where to get the definitive answer:

**On list/sweep mode with simultaneous frequency + power steps:**

The SSG-6000 series supports both frequency sweep and power sweep modes via SCPI, but whether both parameters can be swept *simultaneously* in a single list mode (i.e., each step has an independent freq+power pair) is a detail that depends on the firmware version and is documented in the **Programming Manual**, not the product datasheet. Some instruments in this class support a true list mode with per-step {frequency, power, dwell time} tuples; others only support independent frequency or power sweeps.

**What to do:**

1. **Check the programming manual directly** — it's the authoritative source for SCPI command syntax and list mode capability:
   SSG Series Signal Generators — Mini-Circuits
   From there, navigate to the SSG-6000PRO product page and download the Programming Manual / User Guide.

2. **Contact the Mini-Circuits team directly** for a definitive answer on list mode behavior, especially if you need confirmation for a specific firmware revision. 

If you can share what you're trying to accomplish (e.g., stimulus-response testing across a freq/power grid), I'm happy to help you think through the test approach or suggest complementary hardware.

*Parts surfaced:* SSG-6000RC

### Q99. Do your rackmount test systems come with standard 19-inch rack ears included?

Rack-mount test systems are custom-configured solutions — pricing, mechanical details like rack ears, and exact configurations aren't published in the online catalog. That's something the applications team would need to walk you through based on your specific requirements.

I'd recommend reaching out directly: 

In the meantime, you can browse the custom test systems page here:
Custom RF Test Systems — Mini-Circuits

The team there can confirm exactly what's included mechanically (rack ears, handles, front-panel layout, etc.) and help spec out the right system for your application.

### Q100. can i plug the usb signal generator directly into a wall adapter to use it without a computer?

That's a practical question. The short answer is: **it depends on the specific model**, but generally no — here's why.

Mini-Circuits' USB signal generators (like the SSG series) are designed to be controlled via USB from a computer. The USB connection serves **two purposes**:

1. **Power** — draws power over USB (5V)
2. **Control** — receives commands from software/API to set frequency, amplitude, modulation, etc.

Without a computer (or microcontroller) sending control commands over the USB data lines, the generator has no way to know what frequency or power level to output. A plain wall USB charger provides power but **no data** — so the unit either won't output a signal, or may output whatever was last programmed (behavior varies by model and firmware).

**What you can do instead:**

- Use a **laptop, Raspberry Pi, or any USB host** running Mini-Circuits' software or API — this gives you full control.
- Some models support **USB-to-serial or Ethernet** control modes; check your specific model's datasheet.
- If you need a **standalone signal source** with no PC, a dedicated **benchtop VCO or synthesizer module** with onboard controls may be a better fit.

Want me to look up the specific model you have, or help find a standalone signal source for your frequency range?

---

## Note on the 4 incomplete answers

Questions Q14, Q34, Q40, Q64 are open-ended "find me a part that matches these specs" queries that match many catalog items. On these, the model fetched live details for candidate after candidate (one query reached ~126,000 input tokens) and ran out of tool-use turns before writing its recommendation. The fix is a prompt-level guardrail: answer directly from the catalog search results and only fetch full live details for a specific named part. This is a tuning change, not a capability gap — the same query types (e.g. Q24, Q54, Q64-style) answered fine when the match set was smaller.
