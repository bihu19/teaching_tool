"use client";

import { useLang } from "@/components/LangContext";
import { Formula, Kicker, P, Panel, Prompt, Quiz, Reveal, SlideTitle, Small, Split, Table } from "../deck/ui";
import SlideDeck, { type Slide } from "../deck/SlideDeck";
import { Cancel, ConcentrationLab, Fraction, LimitingLab, MassLab } from "./labs";

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
      {children}
    </h3>
  );
}

export default function IjsoChemicalCalculationsPage() {
  const { lang, t } = useLang();

  const slides: Slide[] = [
    /* 1 ── Cover */
    {
      title: t("เริ่มจากหน่วย", "Start with units"),
      body: (
        <>
          <Kicker>{t("บทเรียนแบบโต้ตอบ • IJSO เคมี", "Interactive lesson • IJSO chemistry")}</Kicker>
          <h2
            className="text-4xl sm:text-5xl leading-tight my-4"
            style={{
              fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
              letterSpacing: "-0.02em",
              color: "var(--foreground)",
            }}
          >
            {t("เคมีคำนวณ: ให้", "Chemical calculations: let the ")}
            <em style={{ color: "var(--accent-deep)", fontStyle: "italic" }}>{t("หน่วย", "units")}</em>
            {t("นำทาง", " lead")}
          </h2>
          <p className="text-base mb-8 max-w-xl" style={{ color: "var(--muted)" }}>
            {t(
              "เชื่อมโยงมวล จำนวนโมล จำนวนอนุภาค และความเข้มข้น ด้วยวิธีตัดหน่วยแบบ “โดมิโน”",
              "Connect mass, moles, particles and concentration using the “domino” unit-cancellation method."
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {[
              ["01 / COUNT", t("หนึ่งโมลหมายถึงอะไร?", "What does one mole mean?")],
              ["02 / CONNECT", t("ใช้ตัวแปลงหน่วยตัวไหน?", "Which conversion factor fits?")],
              ["03 / PREDICT", t("อะไรกำหนดปริมาณผลิตภัณฑ์?", "What limits the product?")],
            ].map(([k, v]) => (
              <div key={k} className="pt-3" style={{ borderTop: "1px solid var(--card-border-strong)" }}>
                <span className="text-[11px] font-mono" style={{ color: "var(--accent)" }}>
                  {k}
                </span>
                <P>{v}</P>
              </div>
            ))}
          </div>
          <Small>
            {t(
              "ใช้เมนูเลือกสไลด์หรือปุ่มลูกศร ทำนายก่อนปรับค่า แล้วค่อยเปิดเฉลยหลังลองทำ",
              "Use the slide menu or arrow keys. Predict before changing a control; reveal answers after trying."
            )}
          </Small>
        </>
      ),
      notes: t(
        "ใช้เวลา 45–60 นาที ผู้เรียนต้องคล่องการคูณ อัตราส่วน และเลขยกกำลังสิบ ให้เขียนชื่อสารกำกับทุกหน่วย",
        "Suggested lesson: 45–60 minutes. Learners need multiplication, ratios and powers of ten. Ask them to include substance names with every unit."
      ),
    },

    /* 2 ── The mole */
    {
      title: t("โมลคือหน่วยนับ", "A mole is a counting unit"),
      body: (
        <>
          <Kicker>{t("01 / โมล", "01 / Moles")}</Kicker>
          <SlideTitle>{t("หนึ่งโหลนับได้ 12 หนึ่งโมลนับได้…", "A dozen counts 12. A mole counts…")}</SlideTitle>
          <Split>
            <div>
              <div
                className="text-5xl sm:text-6xl py-4"
                style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif", color: "var(--accent)" }}
              >
                6.02 × 10<sup>23</sup>
              </div>
              <P>{t("อนุภาคที่ระบุ ต่อหนึ่งโมล", "specified entities per mole.")}</P>
              <P>
                {t(
                  "อนุภาคอาจเป็นอะตอม โมเลกุล ไอออน หรือหน่วยสูตร ต้องระบุเสมอว่าเป็นอะไร",
                  "Entities may be atoms, molecules, ions or formula units. Always say which."
                )}
              </P>
              <Formula>
                N = n × N<sub>A</sub>
              </Formula>
              <Small>
                {t(
                  "N = จำนวนอนุภาค, n = จำนวนโมล (mol), N_A ≈ 6.02 × 10²³ mol⁻¹ ในแบบฝึกนี้",
                  "N = number of entities; n = amount in mol; N_A ≈ 6.02 × 10²³ mol⁻¹ in these exercises."
                )}
              </Small>
            </div>
            <Panel>
              <H3>{t("จำนวนโมลเท่ากัน แต่อนุภาคต่างชนิด", "Same amount, different entities")}</H3>
              <P>{t("O₂ 1 mol → โมเลกุล O₂ 6.02 × 10²³ โมเลกุล", "1 mol O₂ → 6.02 × 10²³ O₂ molecules.")}</P>
              <P>{t("แต่ละโมเลกุลมีอะตอมออกซิเจน 2 อะตอม", "Each molecule has 2 oxygen atoms.")}</P>
              <Reveal label={t("O₂ 1 mol มีอะตอมออกซิเจนกี่อะตอม?", "How many oxygen atoms in 1 mol O₂?")}>
                2 × 6.02 × 10²³ = <b>1.204 × 10²⁴ {t("อะตอม", "atoms")}</b> {t("ก่อนปัดเศษ", "before final rounding")}
              </Reveal>
              <Small>
                {t(
                  "ค่าคงที่อาโวกาโดรตาม SI คือ 6.02214076 × 10²³ mol⁻¹ ในบทนี้ใช้ค่าปัดเศษเพื่อให้คำนวณสม่ำเสมอ",
                  "The exact SI Avogadro constant is 6.02214076 × 10²³ mol⁻¹. We use the rounded value for consistent arithmetic."
                )}
              </Small>
            </Panel>
          </Split>
        </>
      ),
      notes: t(
        "โมลคือปริมาณ ไม่ใช่มวล เทียบขนนก 1 โหลกับก้อนหิน 1 โหล",
        "A mole is an amount, not a mass. Compare one dozen feathers with one dozen stones."
      ),
    },

    /* 3 ── Molar mass */
    {
      title: t("มวลโมลาร์เชื่อมกรัมกับโมล", "Molar mass connects grams to moles"),
      body: (
        <>
          <Kicker>{t("01 / มวลโมลาร์", "01 / Molar mass")}</Kicker>
          <SlideTitle>{t("มวลของสารหนึ่งโมล", "The mass of one mole")}</SlideTitle>
          <Split>
            <div>
              <Formula>
                n = {t("มวล", "mass")} / M<sub>m</sub>
              </Formula>
              <P>
                {t(
                  "Mₘ คือมวลโมลาร์ หน่วย g/mol หาได้จากผลรวมมวลของทุกอะตอมในสูตร",
                  "Mₘ is molar mass in g/mol. Add the contributions of all atoms in the formula."
                )}
              </P>
              <P>
                {t("มวลอะตอมที่ใช้ในห้องเรียน:", "Classroom atomic masses:")} H = 1, C = 12, O = 16, Na = 23, Cl = 35.5
              </P>
              <Prompt>{t("ตัวห้อยคือจำนวนเท่าของอะตอมนั้น", "Subscripts multiply the atom’s contribution.")}</Prompt>
              <Small>
                {t(
                  "มวลโมลาร์ (g/mol) ต่างจากมวลโมเลกุลสัมพัทธ์ ซึ่งไม่มีหน่วย",
                  "Molar mass (g/mol) differs from relative molecular mass, which has no unit."
                )}
              </Small>
            </div>
            <Panel>
              <P>
                O₂: 2 × 16 = <b>32 g/mol</b>
              </P>
              <P>
                H₂O: 2 × 1 + 16 = <b>18 g/mol</b>
              </P>
              <P>
                CO₂: 12 + 2 × 16 = <b>44 g/mol</b>
              </P>
              <Reveal label={t("ลองหา NaCl แล้วเปิดเฉลย", "Try NaCl, then reveal")}>
                23 + 35.5 = <b>58.5 g/mol</b>{" "}
                {t(
                  "ของแข็ง NaCl ใช้คำว่าหน่วยสูตร ไม่ใช่โมเลกุลเดี่ยว",
                  "Solid NaCl is described using formula units rather than discrete molecules."
                )}
              </Reveal>
            </Panel>
          </Split>
        </>
      ),
    },

    /* 4 ── Domino chain */
    {
      title: t("ต่อโดมิโนการตัดหน่วย", "Build a domino chain"),
      body: (
        <>
          <Kicker>{t("02 / การตัดหน่วย", "02 / Factor-label method")}</Kicker>
          <SlideTitle>{t("ทำให้หน่วยที่ไม่ต้องการหายไปทีละตัว", "Make each unwanted unit disappear")}</SlideTitle>
          <P>
            {t(
              "เริ่มจากปริมาณที่โจทย์ให้ วางหน่วยนั้นไว้ที่ตัวส่วนของตัวแปลงถัดไป และวางหน่วยที่ต้องการไว้ที่ตัวเศษ",
              "Start with the given quantity. Put its unit in the denominator of the next factor; put the next desired unit in the numerator."
            )}
          </P>
          <div className="flex flex-wrap items-center gap-3 my-6 text-sm sm:text-base" style={{ color: "var(--foreground)" }}>
            <b>
              64 <Cancel>g O₂</Cancel>
            </b>
            <span>×</span>
            <Fraction
              top={
                <>
                  1 <Cancel>mol O₂</Cancel>
                </>
              }
              bottom={
                <>
                  32 <Cancel>g O₂</Cancel>
                </>
              }
            />
            <span>×</span>
            <Fraction
              top={<>6.02 × 10²³ {t("โมเลกุล O₂", "molecules O₂")}</>}
              bottom={
                <>
                  1 <Cancel>mol O₂</Cancel>
                </>
              }
            />
          </div>
          <Formula>= 1.204 × 10²⁴ {t("โมเลกุล O₂", "molecules O₂")}</Formula>
          <Split>
            <P>
              {t(
                "ตัวแปลงหน่วยแต่ละตัวมีค่าบนและล่างเท่ากัน จึงเปลี่ยนหน่วยได้โดยไม่เปลี่ยนปริมาณจริง",
                "Each conversion factor represents the same amount on top and bottom, so it changes the unit without changing the physical quantity."
              )}
            </P>
            <div>
              <P>
                <span style={{ color: "var(--accent)" }}>
                  {t("ตรวจ: กรัม → โมล → โมเลกุล", "Check: grams → moles → molecules.")}
                </span>
              </P>
              <Reveal label={t("ทำไมไม่คูณ 32 g/mol ก่อน?", "Why not multiply by 32 g/mol first?")}>
                {t(
                  "หน่วยจะกลายเป็น g²/mol กรัมไม่ถูกตัด จึงไม่ได้จำนวนอนุภาค",
                  "The units would be g²/mol. Grams would not cancel, so the chain would not produce a particle count."
                )}
              </Reveal>
            </div>
          </Split>
          <Small>
            {t(
              "แสดงผลก่อนปัดเศษ ถ้าใช้เลขนัยสำคัญ 3 ตัว ได้ 1.20 × 10²⁴ ถ้า 64 g มีเลขนัยสำคัญ 2 ตัว ให้ตอบ 1.2 × 10²⁴",
              "Arithmetic shown before final rounding. To 3 significant figures, the count is 1.20 × 10²⁴; if 64 g is a 2-significant-figure measurement, report 1.2 × 10²⁴."
            )}
          </Small>
        </>
      ),
    },

    /* 5 ── Mass lab */
    {
      title: t("ทดลองแปลงมวลเป็นอนุภาค", "Explore mass → particles"),
      body: (
        <>
          <Kicker>{t("02 / ห้องทดลองการแปลงหน่วย", "02 / Interactive conversion")}</Kicker>
          <SlideTitle>{t("มวลเพิ่มสองเท่า อนุภาคเพิ่มสองเท่าไหม?", "Twice the mass. Twice the particles?")}</SlideTitle>
          <Split wide>
            <div>
              <P>
                {t(
                  "เลือกสาร แล้วเปลี่ยนมวล แบบจำลองใช้ n = มวล / Mₘ และ N = nN_A",
                  "Choose a substance, then change its mass. The model uses n = mass / Mₘ and N = nN_A."
                )}
              </P>
              <Prompt>
                {t(
                  "ทำนาย: ที่มวลเท่ากัน H₂O หรือ CO₂ มีจำนวนโมเลกุลมากกว่า?",
                  "Predict: at the same mass, will H₂O or CO₂ contain more molecules?"
                )}
              </Prompt>
              <Reveal label={t("อธิบายการเปรียบเทียบ", "Explain the comparison")}>
                {t(
                  "H₂O มีมวลโมลาร์น้อยกว่า มวลเท่ากันจึงมีจำนวนโมลมากกว่า และมีจำนวนโมเลกุลมากกว่า",
                  "H₂O has the smaller molar mass. The same mass contains more moles, so it contains more molecules."
                )}
              </Reveal>
              <Small>
                {t(
                  "ทุกค่าในที่นี้นับเป็นโมเลกุล แบบจำลองไม่ได้แสดงขนาดหรือการเคลื่อนที่ของโมเลกุล",
                  "All counts here are molecules. This model does not represent their physical size or motion."
                )}
              </Small>
            </div>
            <Panel>
              <MassLab />
            </Panel>
          </Split>
        </>
      ),
    },

    /* 6 ── Quiz 1 */
    {
      title: t("เลือกตัวแปลงหน่วย", "Choose the conversion factor"),
      body: (
        <>
          <Kicker>{t("02 / ตรวจความเข้าใจ", "02 / Check your understanding")}</Kicker>
          <SlideTitle>{t("แปลง CO₂ 0.50 mol เป็นกรัม", "Convert 0.50 mol CO₂ to grams")}</SlideTitle>
          <P>{t("ตัวแปลงใดควรต่อจาก 0.50 mol CO₂ ทันที?", "Which factor belongs immediately after 0.50 mol CO₂?")}</P>
          <div className="mt-4">
            <Quiz
              key={lang}
              answer={1}
              options={[
                "1 mol CO₂ / 44 g CO₂",
                "44 g CO₂ / 1 mol CO₂",
                t("6.02 × 10²³ โมเลกุล CO₂ / 1 mol CO₂", "6.02 × 10²³ molecules CO₂ / 1 mol CO₂"),
              ]}
              explain={t(
                "คูณด้วย 44 g CO₂ / 1 mol CO₂ โมลถูกตัด เหลือ 0.50 × 44 = 22 g CO₂",
                "Multiply by 44 g CO₂ / 1 mol CO₂. Moles cancel, leaving 0.50 × 44 = 22 g CO₂."
              )}
            />
          </div>
        </>
      ),
      notes: t(
        "ให้ผู้เรียนวิเคราะห์หน่วยของตัวเลือกที่ผิดทั้งสอง: mol²/g และโมเลกุล",
        "Ask learners to diagnose the units of both incorrect options: mol²/g and molecules."
      ),
    },

    /* 7 ── Molarity vs molality */
    {
      title: t("โมลาริตีและโมแลลิตี", "Molarity and molality"),
      body: (
        <>
          <Kicker>{t("03 / ความเข้มข้น", "03 / Concentration")}</Kicker>
          <SlideTitle>{t("ตัวส่วนเปลี่ยน ความหมายก็เปลี่ยน", "The denominator changes the meaning")}</SlideTitle>
          <Split>
            <Panel>
              <H3>{t("โมลาริตี (Molarity)", "Molarity")}</H3>
              <Formula>
                c = n<sub>{t("ตัวละลาย", "solute")}</sub> / V<sub>{t("สารละลาย", "solution")}</sub>
              </Formula>
              <P>{t("หน่วย mol/L มักเขียนเป็น M", "Unit: mol/L, often written M.")}</P>
              <P>
                {t("ใช้", "Use the")} <b>{t("ปริมาตรสารละลายสุดท้าย", "final solution volume")}</b> {t("เป็นลิตร", "in litres.")}
              </P>
              <P>{t("0.20 mol ในสารละลาย 0.50 L → 0.40 M", "0.20 mol in 0.50 L solution → 0.40 M.")}</P>
            </Panel>
            <Panel>
              <H3>{t("โมแลลิตี (Molality)", "Molality")}</H3>
              <Formula>
                b = n<sub>{t("ตัวละลาย", "solute")}</sub> / {t("มวล", "mass")}
                <sub>{t("ตัวทำละลาย", "solvent")}</sub>
              </Formula>
              <P>{t("หน่วย mol/kg มักเขียนเป็น m", "Unit: mol/kg, often written m.")}</P>
              <P>
                {t("ใช้", "Use the")} <b>{t("มวลตัวทำละลาย", "solvent mass")}</b> {t("เป็นกิโลกรัม", "in kilograms.")}
              </P>
              <P>{t("0.20 mol ในตัวทำละลาย 0.50 kg → 0.40 m", "0.20 mol in 0.50 kg solvent → 0.40 m.")}</P>
            </Panel>
          </Split>
          <Prompt>
            {t(
              "สารละลาย = ตัวละลาย + ตัวทำละลาย ป้าย “น้ำ 500 mL” ไม่ได้บอกว่าสารละลายสุดท้ายมีปริมาตร 500 mL",
              "Solution = solute + solvent. A label such as “500 mL water” does not specify a final solution volume of 500 mL."
            )}
          </Prompt>
        </>
      ),
      notes: t(
        "ใช้สัญลักษณ์ c และ b เพื่อไม่ให้สับสนกับมวลและมวลโมลาร์ ตัว m เล็กก็นิยมใช้แทนโมแลลิตี จึงต้องระบุหน่วยเสมอ",
        "c and b keep concentration symbols distinct from mass and molar mass. Lowercase m is also commonly used for molality, so always state units."
      ),
    },

    /* 8 ── Concentration lab */
    {
      title: t("ทดลองโมลาริตี", "Explore molarity"),
      body: (
        <>
          <Kicker>{t("03 / ห้องทดลองความเข้มข้น", "03 / Interactive concentration")}</Kicker>
          <SlideTitle>{t("ตัวละลายเท่าเดิม ปริมาตรสุดท้ายมากขึ้น", "Same solute, larger final volume")}</SlideTitle>
          <Split wide>
            <div>
              <Formula>
                c = n / (V<sub>mL</sub> / 1000)
              </Formula>
              <P>{t("โดมิโนแปลงหน่วย: 1 L / 1000 mL", "Conversion domino: 1 L / 1000 mL.")}</P>
              <Prompt>
                {t(
                  "ให้ n คงที่ ถ้าปริมาตรสารละลายสุดท้ายเพิ่มเป็นสองเท่า c จะเป็นอย่างไร?",
                  "Keep n fixed. What happens to c when the final solution volume doubles?"
                )}
              </Prompt>
              <Reveal label={t("เปิดความสัมพันธ์", "Reveal the relationship")}>
                {t(
                  "ความเข้มข้นลดลงครึ่งหนึ่ง เมื่อ n คงที่ c₁V₁ = c₂V₂ โดยสมมติว่าไม่มีการเติม สูญเสีย หรือใช้ตัวละลายไป",
                  "Concentration halves. For fixed n, c₁V₁ = c₂V₂. This assumes no solute is added, lost or consumed."
                )}
              </Reveal>
              <Small>
                {t(
                  "ตัวควบคุมคือปริมาตรสารละลายสุดท้าย ไม่ได้สมมติว่าปริมาตรบวกกันได้เมื่อผสมสาร",
                  "Controls describe final solution volume; they do not assume volumes are additive when substances are mixed."
                )}
              </Small>
            </div>
            <Panel>
              <ConcentrationLab />
            </Panel>
          </Split>
        </>
      ),
    },

    /* 9 ── Percent concentrations */
    {
      title: t("ร้อยละสามแบบ", "Three kinds of percent"),
      body: (
        <>
          <Kicker>{t("03 / ความเข้มข้นเป็นร้อยละ", "03 / Percentage concentrations")}</Kicker>
          <SlideTitle>{t("“10%” ต้องบอกนิยามด้วย", "“10%” needs a definition")}</SlideTitle>
          <Table
            head={[t("ชนิด", "Label"), t("นิยาม", "Definition"), t("10% หมายถึง", "10% means")]}
            rows={[
              [
                t("% w/w (มวล/มวล)", "% w/w (mass / mass)"),
                t("(มวลตัวละลาย / มวลสารละลาย) × 100%", "(mass solute / mass solution) × 100%"),
                t("ตัวละลาย 10 g ในสารละลาย 100 g", "10 g solute per 100 g solution"),
              ],
              [
                t("% w/v (มวล/ปริมาตร)", "% w/v (mass / volume)"),
                t("กรัมของตัวละลายต่อสารละลาย 100 mL", "g solute per 100 mL solution"),
                t("ตัวละลาย 10 g ในสารละลายสุดท้าย 100 mL", "10 g solute in a final 100 mL solution"),
              ],
              [
                t("% v/v (ปริมาตร/ปริมาตร)", "% v/v (volume / volume)"),
                t("(ปริมาตรตัวละลาย / ปริมาตรสารละลายสุดท้าย) × 100%", "(volume solute / final volume solution) × 100%"),
                t("ตัวละลาย 10 mL ในสารละลายสุดท้าย 100 mL", "10 mL solute in a final 100 mL solution"),
              ],
            ]}
          />
          <Prompt>
            {t(
              "w/w และ v/v ต้องใช้หน่วยเดียวกันทั้งเศษและส่วน ส่วน w/v ให้ใช้กรัมต่อ 100 mL อย่างชัดเจน",
              "For w/w and v/v, use matching units in numerator and denominator. For w/v, explicitly use g per 100 mL."
            )}
          </Prompt>
          <Reveal label={t("ลองทำ: ตัวละลาย 5 g + ตัวทำละลาย 95 g ได้กี่ % w/w?", "Try: 5 g solute + 95 g solvent. What is % w/w?")}>
            {t("มวลสารละลาย = 100 g ดังนั้น 5/100 × 100% = ", "Solution mass = 100 g. Therefore 5/100 × 100% = ")}
            <b>5% w/w</b>
          </Reveal>
        </>
      ),
    },

    /* 10 ── Density */
    {
      title: t("ความหนาแน่นก็เป็นโดมิโน", "Density is another domino"),
      body: (
        <>
          <Kicker>{t("03 / ความหนาแน่น", "03 / Density")}</Kicker>
          <SlideTitle>{t("เชื่อมปริมาตรสารละลายกับมวล", "Bridge solution volume and mass")}</SlideTitle>
          <Split>
            <div>
              <P>
                <b>{t("ตัวอย่างเสริม:", "Supplemental example:")}</b>{" "}
                {t(
                  "สารละลาย 10% w/w มีความหนาแน่น 1.5 g/mL จงหามวลตัวละลายในสารละลาย 200 mL",
                  "a 10% w/w solution has density 1.5 g/mL. Find the solute mass in 200 mL of solution."
                )}
              </P>
              <Formula>
                ρ = {t("มวล", "mass")}
                <sub>{t("สารละลาย", "solution")}</sub> / V<sub>{t("สารละลาย", "solution")}</sub>
              </Formula>
              <P>
                {t(
                  "ความหนาแน่นและสัดส่วนมวลต้องเป็นของสารละลายเดียวกัน",
                  "Density and mass fraction refer to the same solution."
                )}
              </P>
              <Reveal label={t("เปิดวิธีคำนวณสองขั้น", "Reveal the two-step calculation")}>
                {t(
                  "สารละลาย 200 mL × 1.5 g สารละลาย/mL สารละลาย = สารละลาย 300 g",
                  "200 mL solution × 1.5 g solution/mL solution = 300 g solution."
                )}
                <br />
                {t("สารละลาย 300 g × ตัวละลาย 10 g/สารละลาย 100 g = ", "300 g solution × 10 g solute/100 g solution = ")}
                <b>{t("ตัวละลาย 30 g", "30 g solute")}</b>
              </Reveal>
            </div>
            <Panel>
              <H3>{t("ติดตามทั้งชื่อสารและหน่วย", "Track the substance as well as the unit")}</H3>
              <Formula>
                {t("mL สารละลาย", "mL solution")}
                <br />↓ {t("ความหนาแน่น", "density")}
                <br />
                {t("g สารละลาย", "g solution")}
                <br />↓ {t("สัดส่วนมวล", "mass fraction")}
                <br />
                {t("g ตัวละลาย", "g solute")}
              </Formula>
              <Small>
                {t(
                  "ความหนาแน่นของสารละลายไม่ใช่ความหนาแน่นของตัวทำละลายบริสุทธิ์ ให้ใช้ค่าที่โจทย์กำหนดตามสภาวะนั้น",
                  "A solution density is not the density of pure solvent. Use the density provided for the relevant conditions."
                )}
              </Small>
            </Panel>
          </Split>
        </>
      ),
    },

    /* 11 ── Quiz 2 */
    {
      title: t("ระบุตัวส่วน", "Identify the denominator"),
      body: (
        <>
          <Kicker>{t("03 / ตรวจความเข้าใจ", "03 / Check your understanding")}</Kicker>
          <SlideTitle>{t("ตัวละลาย 0.10 mol + น้ำ 200 g", "0.10 mol solute + 200 g water")}</SlideTitle>
          <P>
            {t(
              "โจทย์ไม่ได้ให้ปริมาตรสารละลายสุดท้าย คำนวณความเข้มข้นแบบใดได้โดยตรง?",
              "No final solution volume is given. Which concentration can you calculate directly?"
            )}
          </P>
          <div className="mt-4">
            <Quiz
              key={lang}
              answer={2}
              options={[
                t("0.50 M โดยถือว่า 200 g คือสารละลาย 200 mL", "0.50 M, using 200 g as 200 mL solution"),
                t("0.00050 mol/kg โดยใช้ 200 ตรงๆ", "0.00050 mol/kg, using 200 directly"),
                t("0.50 mol/kg หลังแปลงมวลน้ำเป็น kg", "0.50 mol/kg, after converting water mass to kg"),
              ]}
              explain={t(
                "โมแลลิตีใช้มวลตัวทำละลาย: 200 g × (1 kg / 1000 g) = 0.200 kg แล้ว 0.10 / 0.200 = 0.50 mol/kg ส่วนโมลาริตีต้องรู้ปริมาตรสารละลายสุดท้าย",
                "Molality uses solvent mass: 200 g × (1 kg / 1000 g) = 0.200 kg. Then 0.10 / 0.200 = 0.50 mol/kg. Molarity needs final solution volume."
              )}
            />
          </div>
        </>
      ),
    },

    /* 12 ── Limiting reactant */
    {
      title: t("อะไรหมดก่อน?", "What runs out first?"),
      body: (
        <>
          <Kicker>{t("04 / สารกำหนดปริมาณ", "04 / Limiting reactant")}</Kicker>
          <SlideTitle>{t("เทียบปริมาณกับสูตรอาหาร", "Compare amounts with the recipe")}</SlideTitle>
          <Split>
            <div>
              <P>
                {t(
                  "ชุดอาหาร 1 ชุดใช้เฟรนช์ฟรายส์ 1 ถุง + น้ำ 1 แก้ว ถ้ามี 4 ถุงกับ 2 แก้ว ทำได้ 2 ชุด",
                  "A meal set needs 1 fries pack + 1 water cup. With 4 packs and 2 cups, you can make 2 sets."
                )}
              </P>
              <P>
                {t("สมการเคมีให้ “สูตร” เป็น", "A chemical equation supplies the recipe in")}{" "}
                <b>{t("อัตราส่วนโมล", "mole ratios")}</b>
              </P>
              <Formula>2 H₂ + O₂ → 2 H₂O</Formula>
              <P>
                {t(
                  "เทียบ n(H₂)/2 กับ n(O₂)/1 ค่าที่น้อยกว่าบอกว่าปฏิกิริยาดำเนินไปได้แค่ไหน",
                  "Compare n(H₂)/2 with n(O₂)/1. The smaller value sets how far the reaction can proceed."
                )}
              </P>
            </div>
            <Panel>
              <H3>{t("ตัวอย่างเสริม", "Supplemental worked example")}</H3>
              <P>{t("เริ่มด้วย H₂ 3 mol และ O₂ 2 mol", "Start with 3 mol H₂ and 2 mol O₂.")}</P>
              <Reveal label={t("สารใดกำหนดปริมาณผลิตภัณฑ์?", "Which reactant limits the product?")}>
                {t("3/2 = 1.5; 2/1 = 2 ดังนั้น H₂ เป็นสารกำหนดปริมาณ", "3/2 = 1.5; 2/1 = 2. Hydrogen is limiting.")}
                <br />
                {t("น้ำที่เกิด = 2 × 1.5 = ", "Water formed = 2 × 1.5 = ")}
                <b>3 mol</b>
                <br />
                {t("O₂ เหลือ = 2 − 1.5 = ", "O₂ remaining = 2 − 1.5 = ")}
                <b>0.5 mol</b>
              </Reveal>
              <Small>
                {t(
                  "สมมติว่าเกิดปฏิกิริยาสมบูรณ์ ไม่มีปฏิกิริยาข้างเคียง และไม่มีผลิตภัณฑ์ตั้งต้น นี่คือผลได้ทางทฤษฎี ไม่ใช่แบบจำลองอัตราการเกิดปฏิกิริยา",
                  "Assume complete reaction, no side reactions and no initial product. This is theoretical yield, not a reaction-rate model."
                )}
              </Small>
            </Panel>
          </Split>
        </>
      ),
    },

    /* 13 ── Limiting lab */
    {
      title: t("ทดลองสารกำหนดปริมาณ", "Explore the limiting reactant"),
      body: (
        <>
          <Kicker>{t("04 / ห้องทดลองปริมาณสารสัมพันธ์", "04 / Interactive stoichiometry")}</Kicker>
          <SlideTitle>{t("สารตั้งต้นมากขึ้น ไม่ได้แปลว่าผลิตภัณฑ์มากขึ้นเสมอ", "More reactant does not always mean more product")}</SlideTitle>
          <Split wide>
            <div>
              <Formula>2 H₂ + O₂ → 2 H₂O</Formula>
              <P>{t("ขอบเขตปฏิกิริยา ξ = min[n(H₂)/2, n(O₂)]", "Reaction extent ξ = min[n(H₂)/2, n(O₂)]")}</P>
              <P>
                n(H₂O) = 2ξ
                <br />
                {t("H₂ เหลือ", "H₂ left")} = n(H₂) − 2ξ
                <br />
                {t("O₂ เหลือ", "O₂ left")} = n(O₂) − ξ
              </P>
              <Prompt>
                {t(
                  "ตั้ง H₂ = 4 mol แล้วเพิ่ม O₂ จาก 1 ถึง 4 mol ผลได้ของน้ำหยุดเพิ่มเมื่อใด?",
                  "Set H₂ to 4 mol. Increase O₂ from 1 to 4 mol. When does the water yield stop increasing?"
                )}
              </Prompt>
              <Reveal label={t("เปิดจุดเปลี่ยน", "Reveal the turning point")}>
                {t(
                  "ที่ O₂ 2 mol ปริมาณตรงกับอัตราส่วน 2:1 พอดี เพิ่ม O₂ อย่างเดียวไม่สามารถให้น้ำเกิน 4 mol",
                  "At 2 mol O₂, the amounts match the 2:1 ratio. More O₂ alone cannot produce more than 4 mol H₂O."
                )}
              </Reveal>
            </div>
            <Panel>
              <LimitingLab />
            </Panel>
          </Split>
        </>
      ),
    },

    /* 14 ── Practice */
    {
      title: t("โจทย์ฝึกพร้อมเฉลย", "Practice with revealable answers"),
      body: (
        <>
          <Kicker>{t("05 / ฝึกทำด้วยตนเอง", "05 / Independent practice")}</Kicker>
          <SlideTitle>{t("เขียนหน่วยก่อนคำนวณ", "Write the units before calculating")}</SlideTitle>
          <Split>
            <div>
              <P>
                <b>1.</b> {t("H₂O 9.0 g มีกี่โมเลกุล? ใช้ 18 g/mol", "How many molecules are in 9.0 g H₂O? Use 18 g/mol.")}
              </P>
              <Reveal label={t("เฉลยข้อ 1", "Answer 1")}>
                9.0 g × (1 mol/18 g) × (6.02 × 10²³ {t("โมเลกุล", "molecules")}/mol) = 3.01 × 10²³{" "}
                {t("ก่อนปัดเศษ หรือ", "before rounding;")} <b>3.0 × 10²³</b>{" "}
                {t("ที่เลขนัยสำคัญ 2 ตัว", "to 2 significant figures")}
              </Reveal>
              <div className="mt-5" />
              <P>
                <b>2.</b>{" "}
                {t(
                  "ละลาย NaCl 5.85 g ทำเป็นสารละลายสุดท้าย 250 mL จงหาโมลาริตี",
                  "Dissolve 5.85 g NaCl to make a final 250 mL solution. Find molarity."
                )}
              </P>
              <Reveal label={t("เฉลยข้อ 2", "Answer 2")}>
                n = 5.85/58.5 = 0.100 mol. V = 0.250 L. c = 0.100/0.250 = <b>0.400 mol/L</b>
              </Reveal>
            </div>
            <div>
              <P>
                <b>3.</b>{" "}
                {t(
                  "จงหาโมแลลิตีของตัวละลาย 0.30 mol ในตัวทำละลาย 600 g",
                  "Find the molality of 0.30 mol solute in 600 g solvent."
                )}
              </P>
              <Reveal label={t("เฉลยข้อ 3", "Answer 3")}>
                600 g = 0.600 kg. b = 0.30/0.600 = <b>0.50 mol/kg</b>
              </Reveal>
              <div className="mt-5" />
              <P>
                <b>4.</b>{" "}
                {t(
                  "จาก 2 H₂ + O₂ → 2 H₂O เริ่มด้วย H₂ 6 mol และ O₂ 2 mol จงหาน้ำที่เกิดและสารที่เหลือ",
                  "For 2 H₂ + O₂ → 2 H₂O, start with 6 mol H₂ and 2 mol O₂. Find water formed and excess reactant remaining."
                )}
              </P>
              <Reveal label={t("เฉลยข้อ 4", "Answer 4")}>
                {t(
                  "min(6/2, 2/1) = 2 mol ขอบเขตปฏิกิริยา O₂ เป็นสารกำหนดปริมาณ เกิดน้ำ ",
                  "min(6/2, 2/1) = 2 mol reaction extent. O₂ limits the reaction; "
                )}
                <b>4 mol H₂O</b>
                {t(" และ H₂ เหลือ ", " forms and ")}
                <b>2 mol H₂</b>
                {t("", " remains")}
              </Reveal>
            </div>
          </Split>
        </>
      ),
      notes: t(
        "ให้จับคู่แลกเปลี่ยนเฉพาะโซ่หน่วยก่อน ถ้าคำตอบตัวเลขถูกแต่โซ่หน่วยผิด ต้องแก้ไข",
        "Ask pairs to exchange only their unit chains first. A correct numerical answer with an invalid chain needs revision."
      ),
    },

    /* 15 ── Checklist */
    {
      title: t("เช็กลิสต์การคำนวณ", "Your calculation checklist"),
      body: (
        <>
          <Kicker>{t("06 / สรุป", "06 / Synthesis")}</Kicker>
          <SlideTitle>{t("วิธีเดียว ใช้ได้กับหลายปริมาณทางเคมี", "One method. Many chemical quantities.")}</SlideTitle>
          <Split>
            <ol className="list-decimal pl-5 space-y-2 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
              <li>
                <b>{t("ระบุเป้าหมาย:", "Name the target:")}</b> {t("ปริมาณ หน่วย และชื่อสาร", "quantity, unit and substance.")}
              </li>
              <li>
                <b>{t("เลือกสะพาน:", "Choose the bridge:")}</b>{" "}
                {t(
                  "มวลโมลาร์ N_A ความเข้มข้น ความหนาแน่น หรืออัตราส่วนโมล",
                  "molar mass, N_A, concentration, density or mole ratio."
                )}
              </li>
              <li>
                <b>{t("วางตัวแปลงให้ถูกทิศ", "Orient every factor")}</b>{" "}
                {t("เพื่อให้หน่วยที่ไม่ต้องการถูกตัด", "so unwanted units cancel.")}
              </li>
              <li>
                <b>{t("ตรวจตัวส่วน:", "Check the denominator:")}</b> {t("สารละลายหรือตัวทำละลาย?", "solution or solvent?")}
              </li>
              <li>
                <b>{t("ถ้าเป็นปฏิกิริยา:", "For reactions:")}</b>{" "}
                {t("ดุลสมการก่อน แล้วหาสารกำหนดปริมาณ", "balance first, then find the limiting reactant.")}
              </li>
              <li>
                <b>{t("ตรวจและปัดเศษ:", "Check and round:")}</b>{" "}
                {t("ขนาดของคำตอบ หน่วย และเลขนัยสำคัญ", "magnitude, units and significant figures.")}
              </li>
            </ol>
            <Panel>
              <H3>{t("คำถามก่อนออกจากห้อง", "Exit ticket")}</H3>
              <P>
                {t(
                  "ทำไมสารสองตัวอย่างที่มวลเท่ากันจึงมีจำนวนโมเลกุลต่างกันได้?",
                  "Why can two samples of equal mass contain different numbers of molecules?"
                )}
              </P>
              <Reveal label={t("เปิดแนวคิดหลัก", "Reveal the core idea")}>
                {t(
                  "มวลโมลาร์อาจต่างกัน เพราะ N = (มวล/Mₘ)N_A มวลโมลาร์น้อยกว่าจึงมีโมเลกุลมากกว่าที่มวลเท่ากัน",
                  "Their molar masses may differ. Since N = (mass/Mₘ)N_A, a smaller molar mass gives more molecules at the same mass."
                )}
              </Reveal>
            </Panel>
          </Split>
        </>
      ),
    },
  ];

  return (
    <SlideDeck
      crumb={t("เคมี: เคมีคำนวณ", "Chemistry: calculations")}
      heading={t("สไลด์เคมีคำนวณแบบโต้ตอบ", "Interactive chemical calculations slides")}
      slides={slides}
    />
  );
}
