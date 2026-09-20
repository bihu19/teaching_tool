/**
 * IJSO Thailand selection exam — shared bilingual content.
 *
 * Every string is a [thai, english] pair so pages can feed it straight into t().
 * Scope mirrors the official IJSO syllabus that Thailand's selection rounds
 * are built around; see POSN_EXAM_URL for the official past-paper archive.
 */

export type Bi = [th: string, en: string];

export type TopicGroup = {
  title: Bi;
  items: Bi[];
};

export type Subject = {
  key: "math" | "physics" | "chemistry" | "biology" | "skills";
  name: Bi;
  blurb: Bi;
  /** CSS token used for the icon chip background. */
  softVar: string;
  /** Text colour on the chip. Mirrors the palette used on the homepage. */
  chipText: string;
  /** Fixed accent used for numbering and rules inside the section. */
  accent: string;
  /** Shown as a caveat strip above the topic list when present. */
  note?: Bi;
  groups: TopicGroup[];
};

export const POSN_EXAM_URL =
  "https://www.posn.or.th/projects/academic-olympiad/ijso/examination/";

const physics: Subject = {
  key: "physics",
  name: ["ฟิสิกส์", "Physics"],
  blurb: [
    "10 กลุ่มเนื้อหา ตั้งแต่กลศาสตร์พื้นฐานไปจนถึงนิวเคลียร์และดาราศาสตร์",
    "10 topic groups, from basic mechanics through to nuclear physics and astronomy.",
  ],
  softVar: "--accent-soft",
  chipText: "var(--accent)",
  accent: "#ef4444",
  groups: [
    {
      title: ["แรงและพลศาสตร์", "Forces and dynamics"],
      items: [
        ["มวล น้ำหนัก จุดศูนย์กลางมวล", "Mass, weight, centre of mass"],
        ["กฎการเคลื่อนที่ของนิวตัน", "Newton's laws of motion"],
        ["แรงเสียดทาน", "Friction"],
        ["คาน รอก ล้อและเพลา", "Levers, pulleys, wheel and axle"],
        ["หลักอาร์คิมิดีสและแรงลอยตัว", "Archimedes' principle and buoyancy"],
        ["แรงโน้มถ่วงและแรงแม่เหล็กไฟฟ้า", "Gravitational and electromagnetic forces"],
      ],
    },
    {
      title: ["การเคลื่อนที่และจลนศาสตร์", "Motion and kinematics"],
      items: [
        ["การเคลื่อนที่แนวตรงและวงกลม", "Linear and circular motion"],
        ["การเคลื่อนที่แบบเร่งสม่ำเสมอ", "Uniformly accelerated motion"],
        ["การตกอย่างเสรี", "Free fall"],
        ["โมเมนตัมและการชน", "Momentum and collisions"],
      ],
    },
    {
      title: ["งานและพลังงาน", "Work and energy"],
      items: [
        ["การอนุรักษ์และแปลงพลังงาน", "Conservation and transformation of energy"],
        ["พลังงานกล ความร้อน ไฟฟ้า เคมี นิวเคลียร์", "Mechanical, thermal, electrical, chemical and nuclear energy"],
        ["งานและกำลัง", "Work and power"],
        ["ประสิทธิภาพ", "Efficiency"],
      ],
    },
    {
      title: ["ความร้อนและอุณหพลศาสตร์", "Heat and thermodynamics"],
      items: [
        ["การนำ พา และแผ่รังสีความร้อน", "Conduction, convection and radiation"],
        ["ความจุความร้อนจำเพาะ", "Specific heat capacity"],
        ["การเปลี่ยนสถานะและความร้อนแฝง", "Phase change and latent heat"],
        ["กฎข้อที่หนึ่งของอุณหพลศาสตร์", "First law of thermodynamics"],
      ],
    },
    {
      title: ["ไฟฟ้าและแม่เหล็ก", "Electricity and magnetism"],
      items: [
        ["กฎคูลอมบ์และกฎโอห์ม", "Coulomb's law and Ohm's law"],
        ["วงจรอนุกรมและขนาน", "Series and parallel circuits"],
        ["กฎของเคอร์ชอฟฟ์", "Kirchhoff's laws"],
        ["สนามแม่เหล็กและขั้วแม่เหล็ก", "Magnetic fields and poles"],
        ["การเหนี่ยวนำแม่เหล็กไฟฟ้า", "Electromagnetic induction"],
        ["มอเตอร์ เครื่องกำเนิดไฟฟ้า หม้อแปลง", "Motors, generators and transformers"],
      ],
    },
    {
      title: ["คลื่นและการสั่น", "Waves and oscillations"],
      items: [
        ["การสั่นแบบฮาร์มอนิก", "Harmonic oscillation"],
        ["สมบัติทั่วไปของคลื่น", "General wave properties"],
        ["การสะท้อนและหักเห", "Reflection and refraction"],
        ["คลื่นตามขวางและตามยาว", "Transverse and longitudinal waves"],
      ],
    },
    {
      title: ["แสงและทัศนศาสตร์", "Light and optics"],
      items: [
        ["การสะท้อนและหักเหของแสง", "Reflection and refraction of light"],
        ["เลนส์และกระจกทรงกลม", "Lenses and spherical mirrors"],
        ["สเปกตรัมแม่เหล็กไฟฟ้า", "The electromagnetic spectrum"],
        ["การกระจายแสง", "Dispersion of light"],
        ["ปรากฏการณ์โฟโตอิเล็กทริก", "The photoelectric effect"],
      ],
    },
    {
      title: ["เสียง", "Sound"],
      items: [
        ["ธรรมชาติของเสียงในฐานะคลื่นตามยาว", "Sound as a longitudinal wave"],
        ["ปรากฏการณ์ดอปเพลอร์", "The Doppler effect"],
      ],
    },
    {
      title: ["ความดันและของไหล", "Pressure and fluids"],
      items: [
        ["กฎของปาสกาล", "Pascal's law"],
        ["หลักการเบื้องต้นของแบร์นูลลี", "Introductory Bernoulli's principle"],
      ],
    },
    {
      title: ["นิวเคลียร์และดาราศาสตร์", "Nuclear physics and astronomy"],
      items: [
        ["ไอโซโทป กัมมันตรังสี ครึ่งชีวิต", "Isotopes, radioactivity and half-life"],
        ["ระบบสุริยะและกฎของเคปเลอร์", "The solar system and Kepler's laws"],
      ],
    },
  ],
};

const chemistry: Subject = {
  key: "chemistry",
  name: ["เคมี", "Chemistry"],
  blurb: [
    "8 กลุ่มเนื้อหา ตั้งแต่โครงสร้างอะตอมไปจนถึงพลังงานของปฏิกิริยา",
    "8 topic groups, from atomic structure through to reaction energetics.",
  ],
  softVar: "--lilac-soft",
  chipText: "#6D28D9",
  accent: "#a855f7",
  groups: [
    {
      title: ["โครงสร้างอะตอมและสสาร", "Atomic structure and matter"],
      items: [
        ["กฎทรงมวลและสถานะของสสาร", "Conservation of mass and states of matter"],
        ["อนุภาคย่อยของอะตอม เลขอะตอม เลขมวล", "Subatomic particles, atomic number, mass number"],
        ["การจัดเรียงอิเล็กตรอน", "Electron configuration"],
        ["ตารางธาตุและสมบัติตามหมู่", "The periodic table and group properties"],
      ],
    },
    {
      title: ["พันธะเคมีและสารประกอบ", "Chemical bonding and compounds"],
      items: [
        ["พันธะไอออนิก โคเวเลนต์ โลหะ", "Ionic, covalent and metallic bonding"],
        ["แรงระหว่างโมเลกุลและพันธะไฮโดรเจน", "Intermolecular forces and hydrogen bonding"],
        ["สูตรเคมีของสารประกอบ", "Chemical formulae of compounds"],
      ],
    },
    {
      title: ["ปฏิกิริยาเคมีและการคำนวณ", "Reactions and calculations"],
      items: [
        ["การดุลสมการเคมี", "Balancing chemical equations"],
        ["โมลและการคำนวณมวลกับโมล", "The mole and mass-to-mole calculations"],
        ["ปฏิกิริยาตกตะกอนและกรดเบส", "Precipitation and acid-base reactions"],
        ["เลขออกซิเดชันและปฏิกิริยารีดอกซ์", "Oxidation numbers and redox reactions"],
      ],
    },
    {
      title: ["อัตราการเกิดปฏิกิริยาและสมดุลเคมี", "Kinetics and equilibrium"],
      items: [
        ["อัตราการเกิดปฏิกิริยาและปัจจัยที่มีผล", "Reaction rate and the factors affecting it"],
        ["ค่าคงที่สมดุล", "The equilibrium constant"],
        ["ผลของตัวเร่งปฏิกิริยา", "The effect of catalysts"],
      ],
    },
    {
      title: ["กรด เบส และ pH", "Acids, bases and pH"],
      items: [
        ["กรดเบสแก่และอ่อน", "Strong and weak acids and bases"],
        ["การแตกตัวของน้ำและ pH", "Self-ionisation of water and pH"],
        ["สารละลายบัฟเฟอร์", "Buffer solutions"],
        ["ผลคูณการละลาย", "Solubility product"],
      ],
    },
    {
      title: ["ไฟฟ้าเคมี", "Electrochemistry"],
      items: [
        ["โครงสร้างเซลล์ไฟฟ้าเคมี", "Structure of an electrochemical cell"],
        ["ปฏิกิริยาครึ่งเซลล์", "Half-cell reactions"],
        ["การแยกสารด้วยไฟฟ้า", "Electrolysis"],
      ],
    },
    {
      title: ["แก๊ส", "Gases"],
      items: [
        ["กฎของบอยล์ ชาร์ล และกฎแก๊สรวม", "Boyle's law, Charles's law and the combined gas law"],
        ["กฎอาโวกาโดรและแก๊สอุดมคติ", "Avogadro's law and the ideal gas"],
        ["ความดันย่อยของแก๊สผสม", "Partial pressures in gas mixtures"],
      ],
    },
    {
      title: ["พลังงานกับปฏิกิริยาเคมี", "Energy and chemical reactions"],
      items: [
        ["ปฏิกิริยาคายความร้อนและดูดความร้อน", "Exothermic and endothermic reactions"],
        ["เอนทัลปีของปฏิกิริยา", "Enthalpy of reaction"],
      ],
    },
  ],
};

const biology: Subject = {
  key: "biology",
  name: ["ชีววิทยา", "Biology"],
  blurb: [
    "9 กลุ่มเนื้อหา ตั้งแต่ระดับเซลล์ไปจนถึงระบบนิเวศและสุขภาพ",
    "9 topic groups, from the cell through to ecosystems and health.",
  ],
  softVar: "--sage-soft",
  chipText: "#166534",
  accent: "#22c55e",
  groups: [
    {
      title: ["ชีวเคมีและสารอาหาร", "Biochemistry and nutrients"],
      items: [
        ["องค์ประกอบทางเคมีของสิ่งมีชีวิต", "Chemical composition of living things"],
        ["คาร์โบไฮเดรต โปรตีน กรดนิวคลีอิก ลิพิด", "Carbohydrates, proteins, nucleic acids, lipids"],
        ["สารอาหารหลักและรอง", "Macronutrients and micronutrients"],
      ],
    },
    {
      title: ["ชีววิทยาของเซลล์", "Cell biology"],
      items: [
        ["โครงสร้างและหน้าที่ของเซลล์พืช สัตว์ แบคทีเรีย", "Structure and function of plant, animal and bacterial cells"],
        ["การลำเลียงสารผ่านเซลล์", "Transport across the cell membrane"],
        ["การหายใจระดับเซลล์", "Cellular respiration"],
        ["การแบ่งเซลล์ ไมโทซิสและไมโอซิส", "Cell division: mitosis and meiosis"],
      ],
    },
    {
      title: ["ความหลากหลายและการจัดหมวดหมู่", "Diversity and taxonomy"],
      items: [
        ["หลักอนุกรมวิธาน", "Principles of taxonomy"],
        ["อาณาจักรของสิ่งมีชีวิต", "Kingdoms of living things"],
        ["จุลินทรีย์และไวรัส", "Microorganisms and viruses"],
      ],
    },
    {
      title: ["การสืบพันธุ์", "Reproduction"],
      items: [
        ["การสืบพันธุ์แบบไม่อาศัยเพศและอาศัยเพศ", "Asexual and sexual reproduction"],
        ["การสืบพันธุ์ของพืชดอก", "Reproduction in flowering plants"],
        ["รูปแบบการปฏิสนธิ", "Modes of fertilisation"],
      ],
    },
    {
      title: ["โครงสร้างและสรีรวิทยาของพืช", "Plant structure and physiology"],
      items: [
        ["เนื้อเยื่อพืช", "Plant tissues"],
        ["การลำเลียงน้ำและธาตุอาหาร", "Transport of water and nutrients"],
        ["การสังเคราะห์ด้วยแสง", "Photosynthesis"],
        ["ฮอร์โมนพืชและการตอบสนองต่อสิ่งเร้า", "Plant hormones and responses to stimuli"],
      ],
    },
    {
      title: ["โครงสร้างและสรีรวิทยาของสัตว์", "Animal structure and physiology"],
      items: [
        ["เนื้อเยื่อสัตว์", "Animal tissues"],
        ["ระบบต่างๆ ในร่างกายสัตว์", "Organ systems in animals"],
        ["การกินอาหารของสัตว์กลุ่มต่างๆ", "Feeding in different animal groups"],
        ["อวัยวะรับความรู้สึก", "Sense organs"],
      ],
    },
    {
      title: ["กายวิภาคและสรีรวิทยาของมนุษย์", "Human anatomy and physiology"],
      items: [
        ["ระบบผิวหนัง กระดูก และกล้ามเนื้อ", "Integumentary, skeletal and muscular systems"],
        ["ระบบไหลเวียนเลือด ย่อยอาหาร หายใจ ขับถ่าย", "Circulatory, digestive, respiratory and excretory systems"],
        ["ระบบต่อมไร้ท่อและระบบประสาท", "Endocrine and nervous systems"],
        ["ระบบสืบพันธุ์และวัยแรกรุ่น", "Reproductive system and puberty"],
      ],
    },
    {
      title: ["พันธุศาสตร์และวิวัฒนาการ", "Genetics and evolution"],
      items: [
        ["โครโมโซมและการถ่ายทอดลักษณะ", "Chromosomes and inheritance"],
        ["กฎของเมนเดล", "Mendel's laws"],
        ["การกลายพันธุ์", "Mutation"],
        ["ทฤษฎีวิวัฒนาการและการคัดเลือกโดยธรรมชาติ", "Evolutionary theory and natural selection"],
      ],
    },
    {
      title: ["นิเวศวิทยาและสุขภาพ", "Ecology and health"],
      items: [
        ["วัฏจักรสสารและพลังงาน โซ่อาหาร", "Matter and energy cycles, food chains"],
        ["ปัจจัยทางนิเวศและประชากร", "Ecological factors and populations"],
        ["มลพิษและผลกระทบต่อสิ่งแวดล้อม", "Pollution and environmental impact"],
        ["สารเสพติด ระบบภูมิคุ้มกัน และโรคติดเชื้อ", "Addictive substances, immunity and infectious disease"],
      ],
    },
  ],
};

const math: Subject = {
  key: "math",
  name: ["คณิตศาสตร์", "Mathematics"],
  blurb: [
    "วิชาที่สอบเฉพาะรอบ 1 อิงหลักสูตรคณิตศาสตร์ระดับมัธยมต้น และเน้นการคำนวณที่ใช้ต่อในวิชาวิทยาศาสตร์",
    "Round 1 only. Follows the lower-secondary mathematics curriculum, weighted towards the calculation skills the science papers reuse.",
  ],
  softVar: "--sky-soft",
  chipText: "#1D4ED8",
  accent: "#3b82f6",
  note: [
    "สอวน. ไม่ได้ประกาศรายการหัวข้อคณิตศาสตร์แยกเหมือน 3 วิชาวิทยาศาสตร์ กลุ่มเนื้อหาด้านล่างสรุปจากสาระการเรียนรู้คณิตศาสตร์ ม.ต้น จึงควรใช้เป็นแนวทาง แล้วตรวจสอบขอบเขตจริงจากข้อสอบเก่า",
    "POSN does not publish a separate mathematics topic list the way it does for the three sciences. The groups below summarise the lower-secondary mathematics strands, so treat them as indicative and check the real scope against past papers.",
  ],
  groups: [
    {
      title: ["จำนวนและพีชคณิต", "Number and algebra"],
      items: [
        ["อัตราส่วน สัดส่วน และร้อยละ", "Ratio, proportion and percentage"],
        ["เลขยกกำลังและกรณฑ์", "Exponents and radicals"],
        ["สมการและอสมการเชิงเส้น", "Linear equations and inequalities"],
        ["พหุนามและการแยกตัวประกอบ", "Polynomials and factorisation"],
        ["ระบบสมการสองตัวแปร", "Systems of equations in two variables"],
      ],
    },
    {
      title: ["เรขาคณิตและการวัด", "Geometry and measurement"],
      items: [
        ["ทฤษฎีบทพีทาโกรัส", "The Pythagorean theorem"],
        ["ความเท่ากันทุกประการและความคล้าย", "Congruence and similarity"],
        ["พื้นที่ พื้นที่ผิว และปริมาตร", "Area, surface area and volume"],
        ["อัตราส่วนตรีโกณมิติเบื้องต้น", "Introductory trigonometric ratios"],
      ],
    },
    {
      title: ["สถิติและความน่าจะเป็น", "Statistics and probability"],
      items: [
        ["การนำเสนอข้อมูลและแผนภาพ", "Data presentation and diagrams"],
        ["ค่ากลางและการกระจายของข้อมูล", "Measures of centre and spread"],
        ["ความน่าจะเป็นเบื้องต้น", "Introductory probability"],
      ],
    },
    {
      title: ["การให้เหตุผลและโจทย์ปัญหา", "Reasoning and problem solving"],
      items: [
        ["แบบรูปและลำดับ", "Patterns and sequences"],
        ["การให้เหตุผลเชิงตรรกะ", "Logical reasoning"],
        ["โจทย์ปัญหาเชิงสถานการณ์", "Word problems in context"],
        ["การประมาณค่าและหน่วยการวัด", "Estimation and units of measurement"],
      ],
    },
  ],
};

const skills: Subject = {
  key: "skills",
  name: ["ทักษะและคณิตศาสตร์ประกอบ", "Supporting skills and mathematics"],
  blurb: [
    "ไม่ใช่วิชาสอบแยก แต่แทรกอยู่ในข้อสอบทั้งสามวิชา",
    "Not a separate paper. These are woven into all three science papers.",
  ],
  softVar: "--butter-soft",
  chipText: "#A16207",
  accent: "#f59e0b",
  groups: [
    {
      title: ["ทักษะกระบวนการทางวิทยาศาสตร์", "Scientific process skills"],
      items: [
        ["การตั้งสมมติฐานและออกแบบการทดลอง", "Forming hypotheses and designing experiments"],
        ["หน่วย SI และการวิเคราะห์มิติ", "SI units and dimensional analysis"],
        ["เลขนัยสำคัญและสัญกรณ์วิทยาศาสตร์", "Significant figures and scientific notation"],
      ],
    },
    {
      title: ["ทักษะปฏิบัติการ", "Laboratory skills"],
      items: [
        ["กล้องจุลทรรศน์และการเตรียมสไลด์", "Microscopy and slide preparation"],
        ["การไทเทรตและสเปกโทรโฟโตเมทรี", "Titration and spectrophotometry"],
        ["การแยกสาร กรอง กลั่น ตกผลึก โครมาโทกราฟี", "Separation: filtration, distillation, crystallisation, chromatography"],
      ],
    },
    {
      title: ["คณิตศาสตร์ที่ใช้ประกอบ", "Supporting mathematics"],
      items: [
        ["สมการเศษส่วน ลอการิทึม เลขยกกำลัง", "Fractional equations, logarithms, exponents"],
        ["เรขาคณิตพื้นฐาน พื้นที่และปริมาตร", "Basic geometry, area and volume"],
        ["พีชคณิตเวกเตอร์เบื้องต้น", "Introductory vector algebra"],
        ["ค่าเฉลี่ยและความไม่แน่นอนของการวัด", "Averages and measurement uncertainty"],
      ],
    },
  ],
};

/** Round 1 is broad: the three sciences plus mathematics, all multiple choice. */
export const ROUND_1_SUBJECTS: Subject[] = [math, physics, chemistry, biology];

/** Round 2 drops mathematics and goes deeper on the three sciences. */
export const ROUND_2_SUBJECTS: Subject[] = [physics, chemistry, biology];

export const SUPPORTING_SKILLS: Subject = skills;

export function countTopics(subject: Subject): number {
  return subject.groups.reduce((sum, g) => sum + g.items.length, 0);
}
