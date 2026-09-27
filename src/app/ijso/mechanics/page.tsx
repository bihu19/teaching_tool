"use client";

import { useLang } from "@/components/LangContext";
import { BalanceLab, ForceLab, InclineLab, MotionLab, ProjectileLab } from "./labs";
import { Formula, Kicker, P, Panel, Prompt, Quiz, Reveal, SlideTitle, Small, Split, Table } from "../deck/ui";
import SlideDeck, { type Slide } from "../deck/SlideDeck";

export default function IjsoMechanicsPage() {
  const { lang, t } = useLang();

  const slides: Slide[] = [
    /* 1 ── Cover */
    {
      title: t("กลศาสตร์: การเคลื่อนที่และแรง", "Mechanics: motion and force"),
      body: (
        <>
          <Kicker>{t("บทเรียนแบบทดลอง • IJSO ฟิสิกส์", "Hands-on lesson • IJSO physics")}</Kicker>
          <h2
            className="text-4xl sm:text-5xl leading-tight my-4"
            style={{
              fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
              letterSpacing: "-0.02em",
              color: "var(--foreground)",
            }}
          >
            {t("กลศาสตร์ ", "Mechanics: motion and ")}
            <em style={{ color: "var(--accent-deep)", fontStyle: "italic" }}>
              {t("การเคลื่อนที่และแรง", "force")}
            </em>
          </h2>
          <p className="text-base mb-8 max-w-xl" style={{ color: "var(--muted)" }}>
            {t(
              "ทำไมวัตถุจึงเคลื่อนที่ หยุดนิ่ง หรือเปลี่ยนทิศทาง?",
              "Why do objects move, stay still, or change direction?"
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {[
              ["01 / MOTION", t("การเคลื่อนที่แนวเส้นตรง", "Straight-line motion")],
              ["02 / NEWTON", t("กฎนิวตันและแรงลัพธ์", "Newton's laws and net force")],
              ["03 / EQUILIBRIUM", t("สมดุลของแรงและโมเมนต์", "Equilibrium of forces and torques")],
              ["04 / PROJECTILE", t("การเคลื่อนที่แบบโพรเจกไทล์", "Projectile motion")],
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
              "ใช้ปุ่มก่อนหน้า/ถัดไป หรือปุ่มลูกศรบนแป้นพิมพ์ • ปรับค่าในห้องทดลองเพื่อทดสอบคำทำนาย",
              "Use the previous/next buttons or the arrow keys • adjust the labs to test your predictions"
            )}
          </Small>
        </>
      ),
      notes: t(
        "แนะนำ 2 คาบ คาบแรกสไลด์ 1–8 คาบที่สองสไลด์ 9–16 ให้นักเรียนทำนาย อธิบาย แล้วทดลองก่อนเปิดเฉลย",
        "Plan for two periods: slides 1–8 in the first, 9–16 in the second. Have students predict, explain, then experiment before revealing answers."
      ),
    },

    /* 2 ── Distance vs displacement */
    {
      title: t("ระยะทางกับการกระจัด", "Distance and displacement"),
      body: (
        <>
          <Kicker>{t("01 / การเคลื่อนที่", "01 / Motion")}</Kicker>
          <SlideTitle>{t("ระยะทางกับการกระจัด", "Distance and displacement")}</SlideTitle>
          <Split>
            <div>
              <P>
                {t(
                  "เดินจาก x = 0 m ไปที่ x = 6 m แล้วเดินกลับมาที่ x = 2 m",
                  "Walk from x = 0 m to x = 6 m, then back to x = 2 m."
                )}
              </P>
              <Formula>{t("Δx = xปลาย − xต้น", "Δx = x_final − x_initial")}</Formula>
              <P>
                <b>{t("ระยะทาง", "Distance")}</b>{" "}
                {t("รวมความยาวเส้นทาง เป็นสเกลาร์", "adds up the path length. It is a scalar.")}
              </P>
              <P>
                <b>{t("การกระจัด", "Displacement")}</b>{" "}
                {t(
                  "บอกการเปลี่ยนตำแหน่งและทิศทาง เป็นเวกเตอร์",
                  "is the change in position, with direction. It is a vector."
                )}
              </P>
              <Reveal label={t("เฉลยการเดินครั้งนี้", "Answer for this walk")}>
                {t("ระยะทาง = 6 + 4 = 10 m", "Distance = 6 + 4 = 10 m")}
                <br />
                {t("การกระจัด = 2 − 0 = +2 m", "Displacement = 2 − 0 = +2 m")}
              </Reveal>
            </div>
            <div>
              <div
                className="text-5xl sm:text-6xl py-6"
                style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif", color: "var(--accent)" }}
              >
                0 → 6 → 2
              </div>
              <P>{t("กำหนดทิศขวาเป็นบวก", "Take right as positive.")}</P>
              <Prompt>
                {t(
                  "ถ้าใช้เวลา 5 s อัตราเร็วเฉลี่ยกับความเร็วเฉลี่ยเท่ากันหรือไม่?",
                  "If the walk takes 5 s, are the average speed and average velocity equal?"
                )}
              </Prompt>
              <Reveal label={t("เฉลยพร้อมหน่วย", "Answer with units")}>
                {t("อัตราเร็วเฉลี่ย = 10/5 = 2 m/s", "Average speed = 10/5 = 2 m/s")}
                <br />
                {t("ความเร็วเฉลี่ย = 2/5 = +0.4 m/s", "Average velocity = 2/5 = +0.4 m/s")}
              </Reveal>
            </div>
          </Split>
        </>
      ),
      notes: t(
        "ให้ผู้เรียนเดินจริงหน้าห้อง ความเร็วเฉลี่ยใช้การกระจัด ส่วนอัตราเร็วเฉลี่ยใช้ระยะทางเสมอ",
        "Have a student walk it out at the front. Average velocity always uses displacement; average speed always uses distance."
      ),
    },

    /* 3 ── Constant acceleration */
    {
      title: t("ความเร็วเปลี่ยนตามเวลาอย่างไร?", "How does velocity change with time?"),
      body: (
        <>
          <Kicker>{t("01 / ความเร่งคงตัว", "01 / Constant acceleration")}</Kicker>
          <SlideTitle>{t("ความเร็วเปลี่ยนตามเวลาอย่างไร?", "How does velocity change with time?")}</SlideTitle>
          <Split>
            <div>
              <Formula>
                v = u + at
                <br />
                Δx = ut + ½at²
                <br />
                v² = u² + 2aΔx
              </Formula>
              <P>
                {t("u คือความเร็วต้น, v คือความเร็วปลาย", "u is the initial velocity, v the final velocity")}
                <br />
                {t("a คือความเร่ง, t คือเวลาที่ผ่านไป", "a is the acceleration, t the elapsed time")}
              </P>
              <Small>
                {t(
                  "ใช้สมการชุดนี้เมื่อ a คงตัว และเลือกทิศบวกก่อนแทนค่า",
                  "Use these only when a is constant, and pick a positive direction before substituting."
                )}
              </Small>
              <Prompt>
                {t("ความเร่งติดลบ ทำให้วัตถุช้าลงเสมอหรือไม่?", "Does a negative acceleration always slow an object down?")}
              </Prompt>
              <Reveal label={t("เปิดคำอธิบาย", "Show explanation")}>
                {t(
                  "ไม่เสมอ ถ้า v กับ a มีเครื่องหมายเดียวกัน อัตราเร็วจะเพิ่มขึ้น เช่น v = −4 m/s และ a = −2 m/s²",
                  "Not always. If v and a have the same sign, the speed increases, for example v = −4 m/s with a = −2 m/s²."
                )}
              </Reveal>
            </div>
            <Panel>
              <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                {t("ตัวอย่าง: รถเริ่มจากหยุดนิ่ง", "Example: a car starting from rest")}
              </h3>
              <P>u = 0, a = 2 m/s², t = 3 s</P>
              <Reveal label={t("คำนวณความเร็วและการกระจัด", "Work out velocity and displacement")}>
                <Formula>
                  v = 6 m/s
                  <br />
                  Δx = 9 m
                </Formula>
                {t("ตรวจหน่วย: (m/s²) × s = m/s", "Unit check: (m/s²) × s = m/s")}
              </Reveal>
              <Small>
                {t(
                  "ความเร็วบอกทิศการเคลื่อนที่ ส่วนความเร่งบอกทิศการเปลี่ยนความเร็ว",
                  "Velocity tells you which way it moves; acceleration tells you which way the velocity is changing."
                )}
              </Small>
            </Panel>
          </Split>
        </>
      ),
    },

    /* 4 ── Motion lab */
    {
      title: t("กราฟ x–t และ v–t", "x–t and v–t graphs"),
      body: (
        <>
          <Kicker>{t("01 / ห้องทดลอง", "01 / Lab")}</Kicker>
          <SlideTitle>{t("กราฟ x–t และ v–t ของการเคลื่อนที่", "x–t and v–t graphs of motion")}</SlideTitle>
          <Split wide>
            <div>
              <P>
                {t(
                  "ปรับ u และ a แล้วเลื่อนเวลา สังเกตจุดบนกราฟทั้งสอง",
                  "Adjust u and a, then move through time and watch the dot on both graphs."
                )}
              </P>
              <Formula>x = ut + ½at²</Formula>
              <P>
                {t("ความชันกราฟ x–t คือ v", "Slope of x–t is v")}
                <br />
                {t("ความชันกราฟ v–t คือ a", "Slope of v–t is a")}
                <br />
                {t(
                  "พื้นที่แบบมีเครื่องหมายใต้กราฟ v–t คือ Δx",
                  "Signed area under v–t is Δx"
                )}
              </P>
              <Prompt>
                {t("ลอง u = 8 และ a = −2 วัตถุกลับทิศเมื่อใด?", "Try u = 8 and a = −2. When does the object turn around?")}
              </Prompt>
              <Reveal label={t("เฉลย", "Answer")}>
                {t(
                  "ที่ t = 4 s ความเร็วเป็นศูนย์ หลังจากนั้น v ติดลบและเคลื่อนกลับ ที่ t = 8 s กลับถึง x = 0 แต่ระยะทางรวมเป็น 32 m",
                  "At t = 4 s the velocity is zero. After that v is negative and it moves back. At t = 8 s it is back at x = 0, but the total distance is 32 m."
                )}
              </Reveal>
            </div>
            <Panel>
              <MotionLab />
            </Panel>
          </Split>
        </>
      ),
    },

    /* 5 ── Newton's laws */
    {
      title: t("แรงลัพธ์เปลี่ยนการเคลื่อนที่", "Net force changes motion"),
      body: (
        <>
          <Kicker>{t("02 / กฎนิวตัน", "02 / Newton's laws")}</Kicker>
          <SlideTitle>{t("แรงลัพธ์เปลี่ยนการเคลื่อนที่", "Net force changes motion")}</SlideTitle>
          <Table
            head={[t("กฎ", "Law"), t("ใจความ", "Statement"), t("ตัวอย่าง", "Example")]}
            rows={[
              [
                t("ข้อ 1 ความเฉื่อย", "1st: inertia"),
                t("ΣF = 0 ทำให้ v คงตัว", "ΣF = 0 means v is constant"),
                t(
                  "วัตถุอาจหยุดนิ่ง หรือเคลื่อนที่ตรงด้วยความเร็วคงตัว",
                  "The object may be at rest, or moving in a straight line at constant velocity"
                ),
              ],
              [
                t("ข้อ 2 แรงกับความเร่ง", "2nd: force and acceleration"),
                "ΣF = ma",
                t(
                  "แรงลัพธ์เท่าเดิม มวลมากขึ้น ความเร่งลดลง",
                  "Same net force, larger mass, smaller acceleration"
                ),
              ],
              [
                t("ข้อ 3 แรงกิริยา–ปฏิกิริยา", "3rd: action–reaction"),
                "F(A→B) = −F(B→A)",
                t(
                  "เท้าดันพื้นไปด้านหลัง พื้นดันเท้าไปด้านหน้า",
                  "Your foot pushes the ground backward; the ground pushes your foot forward"
                ),
              ],
            ]}
          />
          <Prompt>
            {t(
              "แรงคู่กิริยา–ปฏิกิริยากระทำต่อวัตถุคนละชิ้น จึงไม่หักล้างกันในแผนภาพแรงของวัตถุชิ้นเดียว",
              "An action–reaction pair acts on two different objects, so the pair never cancels in a single object's free-body diagram."
            )}
          </Prompt>
          <Small>
            {t(
              "ใช้ในกรอบอ้างอิงเฉื่อย กฎข้อ 2 ในรูปนี้สมมติให้มวลคงตัว",
              "Valid in inertial frames. This form of the second law assumes constant mass."
            )}
          </Small>
        </>
      ),
      notes: t(
        "ถามเรื่องรถวิ่งด้วยความเร็วคงตัว แม้แรงลัพธ์ศูนย์ก็ยังมีแรงหลายแรงกระทำได้",
        "Ask about a car cruising at constant velocity: net force is zero, yet several forces still act on it."
      ),
    },

    /* 6 ── Force lab */
    {
      title: t("แรงเท่าเดิม มวลมากขึ้น", "Same force, more mass"),
      body: (
        <>
          <Kicker>{t("02 / ห้องทดลองแรง", "02 / Force lab")}</Kicker>
          <SlideTitle>{t("แรงเท่าเดิม มวลมากขึ้น", "Same force, more mass")}</SlideTitle>
          <Split wide>
            <div>
              <P>
                {t(
                  "กล่องบนพื้นราบลื่น มีแรงแนวนอนสองแรง กำหนดขวาเป็นบวก",
                  "A box on a smooth floor with two horizontal forces. Take right as positive."
                )}
              </P>
              <Formula>
                {t("ΣFₓ = Fขวา − Fซ้าย", "ΣFₓ = F_right − F_left")}
                <br />
                aₓ = ΣFₓ / m
              </Formula>
              <P>{t("แนวดิ่งไม่มีความเร่ง จึงได้ N = mg", "There is no vertical acceleration, so N = mg.")}</P>
              <Prompt>
                {t(
                  "ทำให้แรงลัพธ์เป็นศูนย์ แล้วอธิบายว่าเหตุใดจึงยังสรุปไม่ได้ว่าวัตถุหยุดนิ่ง",
                  "Make the net force zero, then explain why you still cannot conclude the box is at rest."
                )}
              </Prompt>
              <Reveal label={t("คำอธิบาย", "Explanation")}>
                {t(
                  "แรงลัพธ์ศูนย์หมายถึง a = 0 ความเร็วคงเดิม ซึ่งอาจไม่เป็นศูนย์",
                  "Zero net force means a = 0: the velocity stays the same, which need not be zero."
                )}
              </Reveal>
            </div>
            <Panel>
              <ForceLab />
            </Panel>
          </Split>
        </>
      ),
    },

    /* 7 ── Incline */
    {
      title: t("น้ำหนักแยกได้เป็นสององค์ประกอบ", "Weight splits into two components"),
      body: (
        <>
          <Kicker>{t("02 / แรงบนพื้นเอียง", "02 / Forces on an incline")}</Kicker>
          <SlideTitle>{t("น้ำหนักแยกได้เป็นสององค์ประกอบ", "Weight splits into two components")}</SlideTitle>
          <Split>
            <div>
              <Formula>
                W∥ = mg sin θ
                <br />
                W⊥ = mg cos θ
              </Formula>
              <P>
                {t("θ คือมุมพื้นเอียงกับแนวราบ", "θ is the angle of the slope to the horizontal.")}
                <br />
                {t("เลือกแกนขนานและตั้งฉากกับพื้น", "Choose axes parallel and perpendicular to the slope.")}
              </P>
              <P>
                {t("พื้นลื่นและไม่มีแรงอื่น: N = mg cos θ", "Smooth slope, no other forces: N = mg cos θ")}
                <br />
                {t("ความเร่งลงตามพื้น: a = g sin θ", "Acceleration down the slope: a = g sin θ")}
              </P>
              <Prompt>
                {t(
                  "น้ำหนัก mg กับองค์ประกอบทั้งสองเป็นแรงเดียวกันที่เขียนต่างรูป ห้ามนับรวมซ้ำ",
                  "mg and its two components are the same force written two ways. Never count both."
                )}
              </Prompt>
              <P>
                {t(
                  "หากกล่องอยู่นิ่งเพราะแรงเสียดทานสถิต fₛ = mg sin θ โดยต้องมี fₛ ≤ μₛN",
                  "If static friction holds the box still, fₛ = mg sin θ, which requires fₛ ≤ μₛN."
                )}
              </P>
              <Small>
                {t(
                  "fₛ ปรับตามความจำเป็นได้ ค่าสูงสุดเท่านั้นที่เท่ากับ μₛN ส่วนแรงเสียดทานจลน์ในแบบจำลองมาตรฐานคือ fₖ = μₖN",
                  "fₛ adjusts to whatever is needed; only its maximum equals μₛN. Kinetic friction in the standard model is fₖ = μₖN."
                )}
              </Small>
            </div>
            <Panel>
              <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                {t("กล่องมวล 5 kg บนพื้นลื่น", "A 5 kg box on a smooth slope")}
              </h3>
              <InclineLab />
            </Panel>
          </Split>
        </>
      ),
    },

    /* 8 ── Quiz 1 */
    {
      title: t("รถเคลื่อนที่ไปทางขวา แต่แรงลัพธ์ชี้ซ้าย", "Moving right, net force to the left"),
      body: (
        <>
          <Kicker>{t("02 / ตรวจความเข้าใจ", "02 / Check your understanding")}</Kicker>
          <SlideTitle>{t("รถเคลื่อนที่ไปทางขวา แต่แรงลัพธ์ชี้ซ้าย", "Moving right, net force to the left")}</SlideTitle>
          <P>
            {t(
              "ทันทีที่แรงลัพธ์ชี้ซ้ายและรถยังมีความเร็วไปทางขวา จะเกิดอะไรขึ้น?",
              "At the instant the net force points left while the car still moves right, what happens?"
            )}
          </P>
          <div className="mt-4">
            <Quiz
              key={lang}
              answer={1}
              options={[
                t("รถเคลื่อนที่ไปทางซ้ายทันที", "The car immediately moves left"),
                t("รถยังไปทางขวา แต่อัตราเร็วลดลง", "The car keeps moving right, but its speed decreases"),
                t("รถมีอัตราเร็วเพิ่มขึ้น", "The car speeds up"),
                t("รถหยุดนิ่งทันที", "The car stops instantly"),
              ]}
              explain={t(
                "ความเร่งชี้ซ้าย สวนทางกับความเร็ว จึงทำให้อัตราเร็วลดลงในช่วงนี้ ถ้าแรงคงอยู่ รถอาจหยุดแล้วเคลื่อนกลับได้",
                "The acceleration points left, opposite the velocity, so the speed drops for now. If the force persists, the car can stop and then move back."
              )}
            />
          </div>
        </>
      ),
    },

    /* 9 ── Equilibrium */
    {
      title: t("สมดุลของแรงและสมดุลของการหมุน", "Force and rotational equilibrium"),
      body: (
        <>
          <Kicker>{t("03 / สมดุล", "03 / Equilibrium")}</Kicker>
          <SlideTitle>{t("สมดุลของแรงและสมดุลของการหมุน", "Force and rotational equilibrium")}</SlideTitle>
          <Split>
            <Panel>
              <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {t("สมดุลเชิงเส้น", "Linear equilibrium")}
              </h3>
              <Formula>
                ΣFₓ = 0
                <br />
                ΣFᵧ = 0
              </Formula>
              <P>{t("ไม่มีความเร่งของจุดศูนย์กลางมวล", "The centre of mass does not accelerate.")}</P>
            </Panel>
            <Panel>
              <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {t("สมดุลเชิงมุม", "Rotational equilibrium")}
              </h3>
              <Formula>
                Στ = 0
                <br />τ = Fd⊥
              </Formula>
              <P>
                {t(
                  "d⊥ คือระยะตั้งฉากจากจุดหมุนถึงแนวแรง",
                  "d⊥ is the perpendicular distance from the pivot to the line of action."
                )}
              </P>
            </Panel>
          </Split>
          <Prompt>
            {t(
              "สมดุลสถิตต้องสมดุลทั้งแรงและโมเมนต์ และเริ่มต้นอยู่นิ่งโดยไม่หมุน",
              "Static equilibrium needs both forces and torques to balance, starting at rest and not rotating."
            )}
          </Prompt>
          <Small>
            {t(
              "โมเมนต์มีหน่วย N·m • กำหนดทวนเข็มเป็นบวก ตามเข็มเป็นลบ • แรงลัพธ์ศูนย์อย่างเดียวไม่รับประกันว่าโมเมนต์ลัพธ์เป็นศูนย์",
              "Torque is in N·m • counter-clockwise positive, clockwise negative • zero net force alone does not guarantee zero net torque."
            )}
          </Small>
        </>
      ),
      notes: t(
        "ตัวอย่างแรงคู่ควบ: แรงขนาดเท่ากันทิศตรงข้ามแต่คนละแนว ทำให้แรงลัพธ์ศูนย์แต่ยังมีโมเมนต์",
        "Couple example: equal and opposite forces on different lines of action give zero net force but a non-zero torque."
      ),
    },

    /* 10 ── Lever lab */
    {
      title: t("คานสมดุลได้ด้วยแรงที่ไม่เท่ากัน", "Unequal forces can balance a lever"),
      body: (
        <>
          <Kicker>{t("03 / ห้องทดลองคาน", "03 / Lever lab")}</Kicker>
          <SlideTitle>{t("คานสมดุลได้ด้วยแรงที่ไม่เท่ากัน", "Unequal forces can balance a lever")}</SlideTitle>
          <Split wide>
            <div>
              <P>
                {t(
                  "คานเบา มีจุดหมุนตรงกลาง แรงทั้งสองกดลงตั้งฉากกับคาน",
                  "A light beam pivoted at its centre, with both forces pushing down perpendicular to it."
                )}
              </P>
              <Formula>{t("Στ = Fซ้ายdซ้าย − Fขวาdขวา", "Στ = F_L·d_L − F_R·d_R")}</Formula>
              <Prompt>
                {t(
                  "แรงซ้าย 20 N อยู่ห่าง 2 m ถ้าแรงขวา 40 N ต้องวางห่างเท่าใด?",
                  "A 20 N force sits 2 m to the left. Where must a 40 N force go on the right?"
                )}
              </Prompt>
              <Reveal label={t("เฉลย", "Answer")}>
                {t("20 × 2 = 40 × dขวา", "20 × 2 = 40 × d_R")}
                <br />
                {t("จึงได้ dขวา = 1 m", "so d_R = 1 m")}
              </Reveal>
              <Small>
                {t(
                  "ภาพแสดงคานขณะอยู่แนวนอนและแนวโน้มการหมุน ไม่จำลองมุมเอียงตามเวลา",
                  "The diagram shows the beam horizontal and its tendency to turn; it does not simulate tilting over time."
                )}
              </Small>
            </div>
            <Panel>
              <BalanceLab />
            </Panel>
          </Split>
        </>
      ),
    },

    /* 11 ── Projectile concept */
    {
      title: t("สองแนวแกน ใช้เวลาเดียวกัน", "Two axes, one clock"),
      body: (
        <>
          <Kicker>{t("04 / โพรเจกไทล์", "04 / Projectile")}</Kicker>
          <SlideTitle>{t("สองแนวแกน ใช้เวลาเดียวกัน", "Two axes, one clock")}</SlideTitle>
          <Split>
            <Panel>
              <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {t("แนวราบ: ความเร็วคงตัว", "Horizontal: constant velocity")}
              </h3>
              <Formula>
                uₓ = u cos θ
                <br />x = (u cos θ)t
                <br />
                aₓ = 0
              </Formula>
            </Panel>
            <Panel>
              <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {t("แนวดิ่ง: ความเร่งลง", "Vertical: accelerating down")}
              </h3>
              <Formula>
                uᵧ = u sin θ
                <br />y = h + (u sin θ)t − ½gt²
                <br />
                vᵧ = u sin θ − gt
              </Formula>
            </Panel>
          </Split>
          <P>
            {t(
              "กำหนด x ไปทางขวาและ y ขึ้นเป็นบวก จุดเริ่มอยู่ที่ (0, h)",
              "Take x to the right and y upward as positive, starting from (0, h)."
            )}
          </P>
          <Prompt>
            {t(
              "ที่จุดสูงสุด vᵧ = 0 แต่ aᵧ = −g ตลอดการเคลื่อนที่ และ vₓ ยังเท่าเดิม",
              "At the top vᵧ = 0, but aᵧ = −g throughout, and vₓ is unchanged."
            )}
          </Prompt>
          <Small>
            {t(
              "สมมติวัตถุเป็นจุด ไม่คิดแรงต้านอากาศ g คงตัว และพื้นรับวัตถุอยู่ที่ y = 0",
              "Assumes a point object, no air resistance, constant g, and the ground at y = 0."
            )}
          </Small>
        </>
      ),
    },

    /* 12 ── Projectile lab */
    {
      title: t("มุมยิงเปลี่ยนระยะทางอย่างไร?", "How does launch angle change range?"),
      body: (
        <>
          <Kicker>{t("04 / ห้องทดลองโพรเจกไทล์", "04 / Projectile lab")}</Kicker>
          <SlideTitle>{t("มุมยิงเปลี่ยนระยะทางอย่างไร?", "How does launch angle change range?")}</SlideTitle>
          <Split wide>
            <div>
              <P>
                {t(
                  "ทำนายก่อนทดลอง: เมื่อ u เท่าเดิม มุม 30° กับ 60° ให้พิสัยเท่ากันหรือไม่?",
                  "Predict first: with the same u, do 30° and 60° give the same range?"
                )}
              </P>
              <Formula>
                T = 2u sin θ / g
                <br />R = u² sin(2θ) / g
              </Formula>
              <Small>
                {t(
                  "สองสูตรนี้ใช้เฉพาะยิงและตกที่ระดับเดียวกัน (h = 0) เมื่อ h > 0 ให้แก้ y(T) = 0 แล้วใช้ R = uₓT",
                  "These two formulas only hold for launch and landing at the same level (h = 0). For h > 0, solve y(T) = 0 and use R = uₓT."
                )}
              </Small>
              <Reveal label={t("คำตอบและเงื่อนไข", "Answer and conditions")}>
                {t(
                  "เมื่อ h = 0 มุมคู่ที่รวมกันได้ 90° ให้พิสัยเท่ากัน และ 45° ให้พิสัยมากที่สุด เมื่อ h > 0 ข้อสรุปนี้ใช้ไม่ได้ทั่วไป",
                  "With h = 0, complementary angles (summing to 90°) give equal range and 45° gives the maximum. For h > 0 this no longer holds in general."
                )}
              </Reveal>
              <Small>
                {t(
                  "เส้นทางเต็มแสดงวิถีที่คำนวณได้ จุดวงกลมแสดงตำแหน่งขณะทดลอง • สเกลกราฟปรับตามระยะและความสูง",
                  "The solid line is the predicted path; the dot is the live position • the axes rescale to fit range and height."
                )}
              </Small>
            </div>
            <Panel>
              <ProjectileLab />
            </Panel>
          </Split>
        </>
      ),
    },

    /* 13 ── Worked example */
    {
      title: t("ยิงด้วย u = 20 m/s ที่มุม 30°", "Launch at u = 20 m/s, 30°"),
      body: (
        <>
          <Kicker>{t("04 / ตัวอย่างคำนวณ", "04 / Worked example")}</Kicker>
          <SlideTitle>{t("ยิงด้วย u = 20 m/s ที่มุม 30°", "Launch at u = 20 m/s, 30°")}</SlideTitle>
          <P>
            {t(
              "ยิงจากพื้นและตกที่พื้นระดับเดียวกัน ใช้ g = 9.8 m/s² ไม่คิดแรงต้านอากาศ",
              "Launched from and landing on level ground. Use g = 9.8 m/s² and ignore air resistance."
            )}
          </P>
          <Split>
            <div>
              <Formula>
                uₓ = 20 cos 30° ≈ 17.32 m/s
                <br />
                uᵧ = 20 sin 30° = 10 m/s
              </Formula>
              <Reveal label={t("1. เวลาถึงจุดสูงสุด", "1. Time to the top")}>
                {t("vᵧ = 0 จึงได้ tสูงสุด = 10/9.8 ≈ 1.02 s", "vᵧ = 0, so t_top = 10/9.8 ≈ 1.02 s")}
              </Reveal>
              <Reveal label={t("2. ความสูงสูงสุดเหนือพื้น", "2. Maximum height")}>
                H = uᵧ²/(2g) = 100/19.6 ≈ 5.10 m
              </Reveal>
            </div>
            <div>
              <Reveal label={t("3. เวลาบินทั้งหมด", "3. Total flight time")}>T = 2uᵧ/g = 20/9.8 ≈ 2.04 s</Reveal>
              <Reveal label={t("4. พิสัย", "4. Range")}>
                R = uₓT ≈ 17.32 × 2.04 ≈ 35.35 m
                <br />
                {t("คำนวณจากค่าที่ยังไม่ปัดเศษ", "Computed from unrounded values.")}
              </Reveal>
              <Prompt>
                {t(
                  "กลับไปห้องทดลอง เปลี่ยนมุมเป็น 60° แล้วเทียบเวลาบิน ความสูง และพิสัย",
                  "Go back to the lab, change the angle to 60°, and compare flight time, height and range."
                )}
              </Prompt>
            </div>
          </Split>
        </>
      ),
    },

    /* 14 ── Quiz 2 */
    {
      title: t("ที่จุดสูงสุดของวิถี", "At the top of the path"),
      body: (
        <>
          <Kicker>{t("04 / ตรวจความเข้าใจ", "04 / Check your understanding")}</Kicker>
          <SlideTitle>{t("ที่จุดสูงสุดของวิถี", "At the top of the path")}</SlideTitle>
          <P>
            {t(
              "ยิงลูกบอลด้วยมุม 45° โดยไม่คิดแรงต้านอากาศ ข้อใดถูกต้อง?",
              "A ball is launched at 45° with no air resistance. Which statement is correct?"
            )}
          </P>
          <div className="mt-4">
            <Quiz
              key={lang}
              answer={2}
              options={[
                t("ความเร็วและความเร่งเป็นศูนย์ทั้งหมด", "Velocity and acceleration are both zero"),
                t("ความเร็วเป็นศูนย์ แต่ความเร่งชี้ลง", "Velocity is zero, acceleration points down"),
                t("ความเร็วเป็นแนวราบ และความเร่งชี้ลง", "Velocity is horizontal, acceleration points down"),
                t("ความเร็วเป็นแนวราบ และความเร่งเป็นศูนย์", "Velocity is horizontal, acceleration is zero"),
              ]}
              explain={t(
                "ที่จุดสูงสุด vᵧ = 0 แต่ vₓ ยังเป็นบวก จึงมีความเร็วในแนวราบ ขณะเดียวกันแรงโน้มถ่วงยังทำให้ความเร่งชี้ลงขนาด g",
                "At the top vᵧ = 0 but vₓ is still positive, so the velocity is horizontal. Gravity still gives a downward acceleration of magnitude g."
              )}
            />
          </div>
        </>
      ),
    },

    /* 15 ── Practice problems */
    {
      title: t("โจทย์ท้ายบท", "Practice problems"),
      body: (
        <>
          <Kicker>{t("ฝึกเชื่อมโยง", "Putting it together")}</Kicker>
          <SlideTitle>{t("โจทย์ท้ายบท", "Practice problems")}</SlideTitle>
          <Split>
            <div>
              <P>
                <b>1.</b>{" "}
                {t(
                  "วัตถุเริ่มด้วย u = 6 m/s และ a = −2 m/s² หลัง 4 s มี v และ Δx เท่าใด?",
                  "An object starts with u = 6 m/s and a = −2 m/s². Find v and Δx after 4 s."
                )}
              </P>
              <Reveal label={t("เฉลยข้อ 1", "Answer 1")}>
                v = 6 − 8 = −2 m/s
                <br />
                Δx = 6(4) + ½(−2)(4²) = 8 m
                <br />
                {t(
                  "หยุดชั่วขณะที่ 3 s แล้วกลับทิศ ระยะทางรวม 10 m",
                  "It stops momentarily at 3 s and reverses; total distance is 10 m."
                )}
              </Reveal>
              <div className="mt-5" />
              <P>
                <b>2.</b>{" "}
                {t(
                  "กล่อง 4 kg บนพื้นลื่น ถูกดึงขวา 18 N และซ้าย 6 N จงหา a",
                  "A 4 kg box on a smooth floor is pulled right with 18 N and left with 6 N. Find a."
                )}
              </P>
              <Reveal label={t("เฉลยข้อ 2", "Answer 2")}>
                {t("a = (18 − 6)/4 = +3 m/s² ไปทางขวา", "a = (18 − 6)/4 = +3 m/s² to the right")}
              </Reveal>
            </div>
            <div>
              <P>
                <b>3.</b>{" "}
                {t(
                  "คานเบามีแรงลง 30 N ที่ซ้ายห่าง 2 m ด้านขวาห่าง 3 m ต้องมีแรงลงเท่าใดจึงสมดุล?",
                  "A light beam has a 30 N downward force 2 m left of the pivot. What downward force 3 m to the right balances it?"
                )}
              </P>
              <Reveal label={t("เฉลยข้อ 3", "Answer 3")}>
                {t("30 × 2 = F × 3 จึงได้ F = 20 N", "30 × 2 = F × 3, so F = 20 N")}
                <br />
                {t("แรงพยุงขึ้นที่จุดหมุน = 30 + 20 = 50 N", "Upward support at the pivot = 30 + 20 = 50 N")}
              </Reveal>
              <div className="mt-5" />
              <P>
                <b>4.</b>{" "}
                {t(
                  "ปล่อยลูกบอลในแนวราบด้วยความเร็ว 10 m/s จากความสูง 4.9 m ตกห่างฐานเท่าใด? ใช้ g = 9.8 m/s²",
                  "A ball is launched horizontally at 10 m/s from a height of 4.9 m. How far from the base does it land? Use g = 9.8 m/s²."
                )}
              </P>
              <Reveal label={t("เฉลยข้อ 4", "Answer 4")}>
                {t("0 = 4.9 − 4.9T² จึงได้ T = 1 s", "0 = 4.9 − 4.9T², so T = 1 s")}
                <br />R = 10 × 1 = 10 m
              </Reveal>
            </div>
          </Split>
        </>
      ),
    },

    /* 16 ── Summary */
    {
      title: t("การเลือกแบบจำลองและสมการ", "Choosing the model and equations"),
      body: (
        <>
          <Kicker>{t("สรุปบทเรียน", "Lesson summary")}</Kicker>
          <SlideTitle>{t("การเลือกแบบจำลองและสมการ", "Choosing the model and equations")}</SlideTitle>
          <Table
            head={[
              t("สิ่งที่ต้องการหา", "What you need"),
              t("ความสัมพันธ์หลัก", "Key relation"),
              t("เงื่อนไขที่ต้องตรวจ", "Check that"),
            ]}
            rows={[
              [t("ตำแหน่งและความเร็ว", "Position and velocity"), "v = u + at, Δx = ut + ½at²", t("ความเร่งคงตัว", "Acceleration is constant")],
              [t("ความเร่งจากแรง", "Acceleration from forces"), "ΣF = ma", t("วาดแรงของวัตถุชิ้นเดียว เลือกแกน", "Draw forces on one object; choose axes")],
              [t("สมดุลสถิต", "Static equilibrium"), "ΣF = 0, Στ = 0", t("เริ่มอยู่นิ่ง ระยะโมเมนต์ตั้งฉากกับแรง", "Starts at rest; torque arm is perpendicular to the force")],
              [t("โพรเจกไทล์", "Projectile"), "aₓ = 0, aᵧ = −g", t("ไม่คิดแรงต้านอากาศ ใช้เวลาเดียวกันทั้งสองแกน", "No air resistance; the same time on both axes")],
            ]}
          />
          <Prompt>
            {t(
              "ก่อนแทนสูตร: วาดสถานการณ์ เลือกแกน ระบุสิ่งที่รู้ แล้วตรวจเครื่องหมายและหน่วย",
              "Before substituting: sketch the situation, choose axes, list what you know, then check signs and units."
            )}
          </Prompt>
          <Small>
            {t(
              "ขอบเขตบทเรียนนี้ครอบคลุมกลศาสตร์ของนิวตัน ไม่รวมของไหล",
              "This lesson covers Newtonian mechanics and does not include fluids."
            )}
          </Small>
        </>
      ),
      notes: t(
        "Exit ticket: ให้นักเรียนอธิบายหนึ่งประโยคว่า “วัตถุมีความเร็วศูนย์ แต่มีความเร่งไม่เป็นศูนย์” เกิดขึ้นได้อย่างไร เช่น โยนขึ้นในแนวดิ่งที่จุดสูงสุด",
        "Exit ticket: in one sentence, explain how an object can have zero velocity but non-zero acceleration (for example, a ball thrown straight up, at its highest point)."
      ),
    },
  ];

  return (
    <SlideDeck
      crumb={t("ฟิสิกส์: กลศาสตร์", "Physics: mechanics")}
      heading={t("สไลด์กลศาสตร์แบบโต้ตอบ", "Interactive mechanics slides")}
      slides={slides}
    />
  );
}
