"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";

type TrendKey =
  | "category"
  | "atomicSize"
  | "ionSize"
  | "ie1"
  | "ea"
  | "en"
  | "reactivity";

type Category =
  | "alkali"
  | "alkaline"
  | "tm"
  | "ptm"
  | "metalloid"
  | "nm"
  | "halogen"
  | "noble"
  | "lan"
  | "act";

type ElementData = {
  z: number;
  s: string;
  nTH: string;
  nEN: string;
  p: number; // period (row)
  g: number; // group (column 1-18)
  cat: Category;
  am: string;          // standard atomic weight (or [mass number] for radioactive elements)
  ar: number;          // atomic radius (pm)
  ir: number | null;   // common ionic radius (pm)
  ie1: number;         // first ionization energy (kJ/mol)
  ea: number | null;   // electron affinity magnitude (kJ/mol; positive = energy released)
  en: number | null;   // Pauling electronegativity
  rx: number;          // reactivity score (0-100, hand-curated)
};

/* -------------------- Element data (periods 1–7, no f-block) -------------------- */
const ELEMENTS: ElementData[] = [
  // Period 1
  { z: 1,  s: "H",  nTH: "ไฮโดรเจน",   nEN: "Hydrogen",   p: 1, g: 1,  cat: "nm",        am: "1.008", ar: 53,  ir: null, ie1: 1312, ea: 73,   en: 2.20, rx: 50 },
  { z: 2,  s: "He", nTH: "ฮีเลียม",     nEN: "Helium",     p: 1, g: 18, cat: "noble",     am: "4.003", ar: 31,  ir: null, ie1: 2372, ea: 0,    en: null, rx: 0  },

  // Period 2
  { z: 3,  s: "Li", nTH: "ลิเทียม",     nEN: "Lithium",    p: 2, g: 1,  cat: "alkali",    am: "6.94", ar: 167, ir: 76,   ie1: 520,  ea: 60,   en: 0.98, rx: 65 },
  { z: 4,  s: "Be", nTH: "เบริลเลียม",  nEN: "Beryllium",  p: 2, g: 2,  cat: "alkaline",  am: "9.012", ar: 112, ir: 45,   ie1: 899,  ea: 0,    en: 1.57, rx: 15 },
  { z: 5,  s: "B",  nTH: "โบรอน",       nEN: "Boron",      p: 2, g: 13, cat: "metalloid", am: "10.81", ar: 87,  ir: 27,   ie1: 801,  ea: 27,   en: 2.04, rx: 20 },
  { z: 6,  s: "C",  nTH: "คาร์บอน",     nEN: "Carbon",     p: 2, g: 14, cat: "nm",        am: "12.01", ar: 67,  ir: null, ie1: 1086, ea: 122,  en: 2.55, rx: 25 },
  { z: 7,  s: "N",  nTH: "ไนโตรเจน",    nEN: "Nitrogen",   p: 2, g: 15, cat: "nm",        am: "14.01", ar: 56,  ir: 146,  ie1: 1402, ea: 0,    en: 3.04, rx: 35 },
  { z: 8,  s: "O",  nTH: "ออกซิเจน",    nEN: "Oxygen",     p: 2, g: 16, cat: "nm",        am: "16.00", ar: 48,  ir: 140,  ie1: 1314, ea: 141,  en: 3.44, rx: 75 },
  { z: 9,  s: "F",  nTH: "ฟลูออรีน",    nEN: "Fluorine",   p: 2, g: 17, cat: "halogen",   am: "19.00", ar: 42,  ir: 133,  ie1: 1681, ea: 328,  en: 3.98, rx: 99 },
  { z: 10, s: "Ne", nTH: "นีออน",       nEN: "Neon",       p: 2, g: 18, cat: "noble",     am: "20.18", ar: 38,  ir: null, ie1: 2081, ea: 0,    en: null, rx: 0  },

  // Period 3
  { z: 11, s: "Na", nTH: "โซเดียม",     nEN: "Sodium",     p: 3, g: 1,  cat: "alkali",    am: "22.99", ar: 190, ir: 102,  ie1: 496,  ea: 53,   en: 0.93, rx: 80 },
  { z: 12, s: "Mg", nTH: "แมกนีเซียม",  nEN: "Magnesium",  p: 3, g: 2,  cat: "alkaline",  am: "24.31", ar: 145, ir: 72,   ie1: 738,  ea: 0,    en: 1.31, rx: 40 },
  { z: 13, s: "Al", nTH: "อะลูมิเนียม", nEN: "Aluminium",  p: 3, g: 13, cat: "ptm",       am: "26.98", ar: 118, ir: 54,   ie1: 577,  ea: 43,   en: 1.61, rx: 35 },
  { z: 14, s: "Si", nTH: "ซิลิคอน",     nEN: "Silicon",    p: 3, g: 14, cat: "metalloid", am: "28.09", ar: 111, ir: null, ie1: 786,  ea: 134,  en: 1.90, rx: 25 },
  { z: 15, s: "P",  nTH: "ฟอสฟอรัส",    nEN: "Phosphorus", p: 3, g: 15, cat: "nm",        am: "30.97", ar: 98,  ir: null, ie1: 1012, ea: 72,   en: 2.19, rx: 45 },
  { z: 16, s: "S",  nTH: "กำมะถัน",     nEN: "Sulfur",     p: 3, g: 16, cat: "nm",        am: "32.07", ar: 88,  ir: 184,  ie1: 1000, ea: 200,  en: 2.58, rx: 50 },
  { z: 17, s: "Cl", nTH: "คลอรีน",      nEN: "Chlorine",   p: 3, g: 17, cat: "halogen",   am: "35.45", ar: 79,  ir: 181,  ie1: 1251, ea: 349,  en: 3.16, rx: 88 },
  { z: 18, s: "Ar", nTH: "อาร์กอน",     nEN: "Argon",      p: 3, g: 18, cat: "noble",     am: "39.95", ar: 71,  ir: null, ie1: 1521, ea: 0,    en: null, rx: 0  },

  // Period 4
  { z: 19, s: "K",  nTH: "โพแทสเซียม",  nEN: "Potassium",  p: 4, g: 1,  cat: "alkali",    am: "39.10", ar: 243, ir: 138,  ie1: 419,  ea: 48,   en: 0.82, rx: 90 },
  { z: 20, s: "Ca", nTH: "แคลเซียม",    nEN: "Calcium",    p: 4, g: 2,  cat: "alkaline",  am: "40.08", ar: 194, ir: 100,  ie1: 590,  ea: 2,    en: 1.00, rx: 55 },
  { z: 21, s: "Sc", nTH: "สแกนเดียม",   nEN: "Scandium",   p: 4, g: 3,  cat: "tm",        am: "44.96", ar: 184, ir: 75,   ie1: 633,  ea: 18,   en: 1.36, rx: 30 },
  { z: 22, s: "Ti", nTH: "ไทเทเนียม",   nEN: "Titanium",   p: 4, g: 4,  cat: "tm",        am: "47.87", ar: 176, ir: 61,   ie1: 659,  ea: 8,    en: 1.54, rx: 25 },
  { z: 23, s: "V",  nTH: "วาเนเดียม",   nEN: "Vanadium",   p: 4, g: 5,  cat: "tm",        am: "50.94", ar: 171, ir: 54,   ie1: 651,  ea: 51,   en: 1.63, rx: 25 },
  { z: 24, s: "Cr", nTH: "โครเมียม",    nEN: "Chromium",   p: 4, g: 6,  cat: "tm",        am: "52.00", ar: 166, ir: 62,   ie1: 653,  ea: 65,   en: 1.66, rx: 25 },
  { z: 25, s: "Mn", nTH: "แมงกานีส",    nEN: "Manganese",  p: 4, g: 7,  cat: "tm",        am: "54.94", ar: 161, ir: 83,   ie1: 717,  ea: 0,    en: 1.55, rx: 25 },
  { z: 26, s: "Fe", nTH: "เหล็ก",        nEN: "Iron",       p: 4, g: 8,  cat: "tm",        am: "55.85", ar: 156, ir: 65,   ie1: 762,  ea: 15,   en: 1.83, rx: 25 },
  { z: 27, s: "Co", nTH: "โคบอลต์",     nEN: "Cobalt",     p: 4, g: 9,  cat: "tm",        am: "58.93", ar: 152, ir: 75,   ie1: 760,  ea: 64,   en: 1.88, rx: 20 },
  { z: 28, s: "Ni", nTH: "นิกเกิล",     nEN: "Nickel",     p: 4, g: 10, cat: "tm",        am: "58.69", ar: 149, ir: 69,   ie1: 737,  ea: 112,  en: 1.91, rx: 20 },
  { z: 29, s: "Cu", nTH: "ทองแดง",      nEN: "Copper",     p: 4, g: 11, cat: "tm",        am: "63.55", ar: 145, ir: 73,   ie1: 745,  ea: 119,  en: 1.90, rx: 15 },
  { z: 30, s: "Zn", nTH: "สังกะสี",     nEN: "Zinc",       p: 4, g: 12, cat: "tm",        am: "65.38", ar: 142, ir: 74,   ie1: 906,  ea: 0,    en: 1.65, rx: 25 },
  { z: 31, s: "Ga", nTH: "แกลเลียม",    nEN: "Gallium",    p: 4, g: 13, cat: "ptm",       am: "69.72", ar: 136, ir: 62,   ie1: 579,  ea: 30,   en: 1.81, rx: 30 },
  { z: 32, s: "Ge", nTH: "เจอร์เมเนียม", nEN: "Germanium", p: 4, g: 14, cat: "metalloid", am: "72.63", ar: 125, ir: null, ie1: 762,  ea: 119,  en: 2.01, rx: 20 },
  { z: 33, s: "As", nTH: "อาร์เซนิก",    nEN: "Arsenic",    p: 4, g: 15, cat: "metalloid", am: "74.92", ar: 114, ir: null, ie1: 947,  ea: 78,   en: 2.18, rx: 30 },
  { z: 34, s: "Se", nTH: "ซีลีเนียม",   nEN: "Selenium",   p: 4, g: 16, cat: "nm",        am: "78.97", ar: 103, ir: 198,  ie1: 941,  ea: 195,  en: 2.55, rx: 40 },
  { z: 35, s: "Br", nTH: "โบรมีน",      nEN: "Bromine",    p: 4, g: 17, cat: "halogen",   am: "79.90", ar: 94,  ir: 196,  ie1: 1140, ea: 325,  en: 2.96, rx: 78 },
  { z: 36, s: "Kr", nTH: "คริปทอน",     nEN: "Krypton",    p: 4, g: 18, cat: "noble",     am: "83.80", ar: 88,  ir: null, ie1: 1351, ea: 0,    en: 3.00, rx: 0  },

  // Period 5
  { z: 37, s: "Rb", nTH: "รูบิเดียม",   nEN: "Rubidium",   p: 5, g: 1,  cat: "alkali",    am: "85.47", ar: 265, ir: 152,  ie1: 403,  ea: 47,   en: 0.82, rx: 93 },
  { z: 38, s: "Sr", nTH: "สตรอนเชียม",  nEN: "Strontium",  p: 5, g: 2,  cat: "alkaline",  am: "87.62", ar: 219, ir: 118,  ie1: 549,  ea: 5,    en: 0.95, rx: 65 },
  { z: 39, s: "Y",  nTH: "อิตเทรียม",   nEN: "Yttrium",    p: 5, g: 3,  cat: "tm",        am: "88.91", ar: 212, ir: 90,   ie1: 600,  ea: 30,   en: 1.22, rx: 35 },
  { z: 40, s: "Zr", nTH: "เซอร์โคเนียม", nEN: "Zirconium", p: 5, g: 4,  cat: "tm",        am: "91.22", ar: 206, ir: 72,   ie1: 640,  ea: 41,   en: 1.33, rx: 25 },
  { z: 41, s: "Nb", nTH: "ไนโอเบียม",   nEN: "Niobium",    p: 5, g: 5,  cat: "tm",        am: "92.91", ar: 198, ir: 64,   ie1: 652,  ea: 86,   en: 1.60, rx: 25 },
  { z: 42, s: "Mo", nTH: "โมลิบดีนัม",  nEN: "Molybdenum", p: 5, g: 6,  cat: "tm",        am: "95.95", ar: 190, ir: 59,   ie1: 684,  ea: 72,   en: 2.16, rx: 20 },
  { z: 43, s: "Tc", nTH: "เทคนีเชียม",  nEN: "Technetium", p: 5, g: 7,  cat: "tm",        am: "[98]", ar: 183, ir: null, ie1: 702,  ea: 53,   en: 1.90, rx: 20 },
  { z: 44, s: "Ru", nTH: "รูทีเนียม",   nEN: "Ruthenium",  p: 5, g: 8,  cat: "tm",        am: "101.07", ar: 178, ir: null, ie1: 710,  ea: 101,  en: 2.20, rx: 15 },
  { z: 45, s: "Rh", nTH: "โรเดียม",     nEN: "Rhodium",    p: 5, g: 9,  cat: "tm",        am: "102.91", ar: 173, ir: 67,   ie1: 720,  ea: 110,  en: 2.28, rx: 10 },
  { z: 46, s: "Pd", nTH: "แพลเลเดียม",  nEN: "Palladium",  p: 5, g: 10, cat: "tm",        am: "106.42", ar: 169, ir: 86,   ie1: 804,  ea: 54,   en: 2.20, rx: 10 },
  { z: 47, s: "Ag", nTH: "เงิน",         nEN: "Silver",     p: 5, g: 11, cat: "tm",        am: "107.87", ar: 165, ir: 115,  ie1: 731,  ea: 126,  en: 1.93, rx: 10 },
  { z: 48, s: "Cd", nTH: "แคดเมียม",    nEN: "Cadmium",    p: 5, g: 12, cat: "tm",        am: "112.41", ar: 161, ir: 95,   ie1: 868,  ea: 0,    en: 1.69, rx: 25 },
  { z: 49, s: "In", nTH: "อินเดียม",    nEN: "Indium",     p: 5, g: 13, cat: "ptm",       am: "114.82", ar: 156, ir: 80,   ie1: 558,  ea: 30,   en: 1.78, rx: 30 },
  { z: 50, s: "Sn", nTH: "ดีบุก",        nEN: "Tin",        p: 5, g: 14, cat: "ptm",       am: "118.71", ar: 145, ir: 93,   ie1: 709,  ea: 107,  en: 1.96, rx: 25 },
  { z: 51, s: "Sb", nTH: "พลวง",        nEN: "Antimony",   p: 5, g: 15, cat: "metalloid", am: "121.76", ar: 133, ir: 76,   ie1: 834,  ea: 101,  en: 2.05, rx: 25 },
  { z: 52, s: "Te", nTH: "เทลลูเรียม",  nEN: "Tellurium",  p: 5, g: 16, cat: "metalloid", am: "127.60", ar: 123, ir: 221,  ie1: 869,  ea: 190,  en: 2.10, rx: 30 },
  { z: 53, s: "I",  nTH: "ไอโอดีน",     nEN: "Iodine",     p: 5, g: 17, cat: "halogen",   am: "126.90", ar: 115, ir: 220,  ie1: 1008, ea: 295,  en: 2.66, rx: 65 },
  { z: 54, s: "Xe", nTH: "ซีนอน",       nEN: "Xenon",      p: 5, g: 18, cat: "noble",     am: "131.29", ar: 108, ir: null, ie1: 1170, ea: 0,    en: 2.60, rx: 5  },

  // Period 6 (La in group 3, lanthanides 58-71 omitted)
  { z: 55, s: "Cs", nTH: "ซีเซียม",     nEN: "Caesium",    p: 6, g: 1,  cat: "alkali",    am: "132.91", ar: 298, ir: 167,  ie1: 376,  ea: 46,   en: 0.79, rx: 96 },
  { z: 56, s: "Ba", nTH: "แบเรียม",     nEN: "Barium",     p: 6, g: 2,  cat: "alkaline",  am: "137.33", ar: 253, ir: 135,  ie1: 503,  ea: 14,   en: 0.89, rx: 75 },
  { z: 57, s: "La", nTH: "แลนทานัม",    nEN: "Lanthanum",  p: 6, g: 3,  cat: "lan",       am: "138.91", ar: 195, ir: 103,  ie1: 538,  ea: 48,   en: 1.10, rx: 40 },
  { z: 72, s: "Hf", nTH: "แฮฟเนียม",    nEN: "Hafnium",    p: 6, g: 4,  cat: "tm",        am: "178.49", ar: 208, ir: 71,   ie1: 659,  ea: 0,    en: 1.30, rx: 25 },
  { z: 73, s: "Ta", nTH: "แทนทาลัม",    nEN: "Tantalum",   p: 6, g: 5,  cat: "tm",        am: "180.95", ar: 200, ir: 64,   ie1: 761,  ea: 31,   en: 1.50, rx: 25 },
  { z: 74, s: "W",  nTH: "ทังสเตน",     nEN: "Tungsten",   p: 6, g: 6,  cat: "tm",        am: "183.84", ar: 193, ir: 60,   ie1: 770,  ea: 79,   en: 2.36, rx: 20 },
  { z: 75, s: "Re", nTH: "รีเนียม",     nEN: "Rhenium",    p: 6, g: 7,  cat: "tm",        am: "186.21", ar: 188, ir: null, ie1: 760,  ea: 15,   en: 1.90, rx: 15 },
  { z: 76, s: "Os", nTH: "ออสเมียม",    nEN: "Osmium",     p: 6, g: 8,  cat: "tm",        am: "190.23", ar: 185, ir: null, ie1: 840,  ea: 106,  en: 2.20, rx: 10 },
  { z: 77, s: "Ir", nTH: "อิริเดียม",   nEN: "Iridium",    p: 6, g: 9,  cat: "tm",        am: "192.22", ar: 180, ir: null, ie1: 880,  ea: 151,  en: 2.20, rx: 10 },
  { z: 78, s: "Pt", nTH: "แพลทินัม",    nEN: "Platinum",   p: 6, g: 10, cat: "tm",        am: "195.08", ar: 177, ir: 80,   ie1: 870,  ea: 205,  en: 2.28, rx: 8  },
  { z: 79, s: "Au", nTH: "ทองคำ",       nEN: "Gold",       p: 6, g: 11, cat: "tm",        am: "196.97", ar: 174, ir: 137,  ie1: 890,  ea: 223,  en: 2.54, rx: 5  },
  { z: 80, s: "Hg", nTH: "ปรอท",        nEN: "Mercury",    p: 6, g: 12, cat: "tm",        am: "200.59", ar: 171, ir: 102,  ie1: 1007, ea: 0,    en: 2.00, rx: 15 },
  { z: 81, s: "Tl", nTH: "แทลเลียม",    nEN: "Thallium",   p: 6, g: 13, cat: "ptm",       am: "204.38", ar: 156, ir: 150,  ie1: 589,  ea: 19,   en: 1.62, rx: 35 },
  { z: 82, s: "Pb", nTH: "ตะกั่ว",       nEN: "Lead",       p: 6, g: 14, cat: "ptm",       am: "207.2", ar: 154, ir: 119,  ie1: 716,  ea: 35,   en: 2.33, rx: 25 },
  { z: 83, s: "Bi", nTH: "บิสมัท",      nEN: "Bismuth",    p: 6, g: 15, cat: "ptm",       am: "208.98", ar: 143, ir: 103,  ie1: 703,  ea: 91,   en: 2.02, rx: 20 },
  { z: 84, s: "Po", nTH: "พอโลเนียม",   nEN: "Polonium",   p: 6, g: 16, cat: "metalloid", am: "[209]", ar: 135, ir: null, ie1: 812,  ea: 183,  en: 2.00, rx: 30 },
  { z: 85, s: "At", nTH: "แอสทาทีน",    nEN: "Astatine",   p: 6, g: 17, cat: "halogen",   am: "[210]", ar: 127, ir: null, ie1: 920,  ea: 270,  en: 2.20, rx: 50 },
  { z: 86, s: "Rn", nTH: "เรดอน",       nEN: "Radon",      p: 6, g: 18, cat: "noble",     am: "[222]", ar: 120, ir: null, ie1: 1037, ea: 0,    en: null, rx: 5  },

  // Period 7 (Fr, Ra, Ac only — actinides 90-103 omitted)
  { z: 87, s: "Fr", nTH: "แฟรนเซียม",   nEN: "Francium",   p: 7, g: 1,  cat: "alkali",    am: "[223]", ar: 348, ir: 180,  ie1: 380,  ea: 47,   en: 0.70, rx: 99 },
  { z: 88, s: "Ra", nTH: "เรเดียม",     nEN: "Radium",     p: 7, g: 2,  cat: "alkaline",  am: "[226]", ar: 283, ir: 148,  ie1: 509,  ea: 9,    en: 0.90, rx: 80 },
  { z: 89, s: "Ac", nTH: "แอกทิเนียม",  nEN: "Actinium",   p: 7, g: 3,  cat: "act",       am: "[227]", ar: 215, ir: 112,  ie1: 499,  ea: 33,   en: 1.10, rx: 45 },
];

/* -------------------- Helpers -------------------- */
const CATEGORY_BG: Record<Category, string> = {
  alkali:    "#fca5a5",
  alkaline:  "#fdba74",
  tm:        "#fde68a",
  ptm:       "#bbf7d0",
  metalloid: "#a7f3d0",
  nm:        "#bfdbfe",
  halogen:   "#c4b5fd",
  noble:     "#f5d0fe",
  lan:       "#fbcfe8",
  act:       "#fbcfe8",
};

const CATEGORY_LABEL: Record<Category, { th: string; en: string }> = {
  alkali:    { th: "โลหะแอลคาไล",      en: "Alkali metal" },
  alkaline:  { th: "โลหะแอลคาไลน์เอิร์ท", en: "Alkaline earth metal" },
  tm:        { th: "โลหะแทรนซิชัน",    en: "Transition metal" },
  ptm:       { th: "โลหะหลังแทรนซิชัน", en: "Post-transition metal" },
  metalloid: { th: "ธาตุกึ่งโลหะ",      en: "Metalloid" },
  nm:        { th: "อโลหะ",            en: "Nonmetal" },
  halogen:   { th: "แฮโลเจน",          en: "Halogen" },
  noble:     { th: "ก๊าซเฉื่อย",        en: "Noble gas" },
  lan:       { th: "แลนทาไนด์",        en: "Lanthanide" },
  act:       { th: "แอกทิไนด์",        en: "Actinide" },
};

function getValue(el: ElementData, trend: TrendKey): number | null {
  switch (trend) {
    case "atomicSize": return el.ar;
    case "ionSize":    return el.ir;
    case "ie1":        return el.ie1;
    case "ea":         return el.ea;
    case "en":         return el.en;
    case "reactivity": return el.rx;
    default:           return null;
  }
}

function formatValue(v: number | null, trend: TrendKey): string {
  if (v == null) return "—";
  if (trend === "en") return v.toFixed(2);
  return Math.round(v).toString();
}

function unitFor(trend: TrendKey, t: (th: string, en: string) => string): string {
  switch (trend) {
    case "atomicSize":
    case "ionSize":    return "pm";
    case "ie1":
    case "ea":         return "kJ/mol";
    case "en":         return t("(พอลิง)", "(Pauling)");
    case "reactivity": return t("คะแนน", "score");
    default:           return "";
  }
}

function valueToColor(v: number | null, min: number, max: number): string {
  if (v == null || !Number.isFinite(min) || !Number.isFinite(max)) return "#e5e7eb";
  if (max === min) return "hsl(140, 65%, 65%)";
  const t = Math.min(1, Math.max(0, (v - min) / (max - min)));
  // blue (low) → green (mid) → red (high)
  const hue = 220 - t * 220;
  return `hsl(${hue}, 70%, 65%)`;
}

/* -------------------- Page -------------------- */
export default function PeriodicTablePage() {
  const { t } = useLang();
  const [trend, setTrend] = useState<TrendKey>("category");
  const [hovered, setHovered] = useState<ElementData | null>(null);

  const { min, max } = useMemo(() => {
    if (trend === "category") return { min: NaN, max: NaN };
    let mn = Infinity, mx = -Infinity;
    for (const el of ELEMENTS) {
      const v = getValue(el, trend);
      if (v != null) {
        if (v < mn) mn = v;
        if (v > mx) mx = v;
      }
    }
    return { min: mn, max: mx };
  }, [trend]);

  const trends: { key: TrendKey; labelTH: string; labelEN: string; icon: string }[] = [
    { key: "category",   labelTH: "หมู่ธาตุ",        labelEN: "Categories",   icon: "🎨" },
    { key: "atomicSize", labelTH: "ขนาดอะตอม",      labelEN: "Atomic Size",  icon: "⚛︎" },
    { key: "ionSize",    labelTH: "ขนาดไอออน",      labelEN: "Ion Size",     icon: "⊕" },
    { key: "ie1",        labelTH: "IE₁",             labelEN: "IE₁",          icon: "⚡" },
    { key: "ea",         labelTH: "EA",              labelEN: "EA",           icon: "↘" },
    { key: "en",         labelTH: "EN",              labelEN: "EN",           icon: "🧲" },
    { key: "reactivity", labelTH: "ความว่องไว",     labelEN: "Reactivity",   icon: "🔥" },
  ];

  const trendInfo: Record<
    TrendKey,
    { titleTH: string; titleEN: string; descTH: string; descEN: string }
  > = {
    category: {
      titleTH: "ตารางธาตุ", titleEN: "Periodic Table",
      descTH: "ระบายสีตามประเภทของธาตุ — กดปุ่มด้านบนเพื่อดูแนวโน้มต่างๆ",
      descEN: "Colored by element category. Click a button above to highlight a trend.",
    },
    atomicSize: {
      titleTH: "ขนาดอะตอม (รัศมีอะตอม)", titleEN: "Atomic Size (Atomic Radius)",
      descTH: "เพิ่มขึ้นเมื่อลงตามหมู่ ↓  •  ลดลงเมื่อข้ามคาบไปทางขวา →  (เพราะประจุนิวเคลียสสุทธิเพิ่มขึ้น)",
      descEN: "Increases ↓ down a group  •  Decreases → across a period (effective nuclear charge increases).",
    },
    ionSize: {
      titleTH: "ขนาดไอออน",
      titleEN: "Ionic Size",
      descTH: "ไอออนบวก (cation) เล็กกว่าอะตอมเดิม  •  ไอออนลบ (anion) ใหญ่กว่าอะตอมเดิม  •  ในหมู่เดียวกันจะใหญ่ขึ้นเมื่อลงล่าง ↓",
      descEN: "Cations are smaller than their parent atoms  •  Anions are larger  •  Within a group, ionic size grows ↓.",
    },
    ie1: {
      titleTH: "พลังงานไอออไนเซชันลำดับที่ 1 (IE₁)",
      titleEN: "First Ionization Energy (IE₁)",
      descTH: "เพิ่มขึ้นเมื่อขึ้นตามหมู่ ↑  •  เพิ่มขึ้นเมื่อข้ามคาบไปทางขวา →  (ฟลูออรีน/ก๊าซเฉื่อยมีค่าสูงสุด)",
      descEN: "Increases ↑ up a group  •  Increases → across a period (peaks at noble gases).",
    },
    ea: {
      titleTH: "สัมพรรคภาพอิเล็กตรอน (EA)",
      titleEN: "Electron Affinity (EA)",
      descTH: "พลังงานที่ปล่อยออกเมื่อรับอิเล็กตรอน — มีแนวโน้มเพิ่มขึ้น ↑→ (สูงสุดที่หมู่ 17 เช่น Cl, F)",
      descEN: "Energy released when an atom gains an electron — generally increases ↑→ (highest in halogens like Cl, F).",
    },
    en: {
      titleTH: "อิเล็กโทรเนกาติวิตี (EN)",
      titleEN: "Electronegativity (EN)",
      descTH: "ความสามารถดึงอิเล็กตรอนในพันธะ — เพิ่มขึ้น ↑→  (ฟลูออรีน F = 3.98 สูงสุด, ฟรานเซียม Fr ต่ำสุด)",
      descEN: "Tendency to attract bonding electrons — increases ↑→ (F = 3.98 highest, Fr lowest).",
    },
    reactivity: {
      titleTH: "ความว่องไวต่อปฏิกิริยา",
      titleEN: "Reactivity",
      descTH: "โลหะ: ว่องไวมากที่สุดที่มุมล่างซ้าย ↙ (Cs, Fr)  •  อโลหะ: ว่องไวมากที่สุดที่มุมบนขวา ↗ (F, O)  •  ก๊าซเฉื่อยเฉื่อยที่สุด",
      descEN: "Metals: most reactive at bottom-left ↙ (Cs, Fr)  •  Nonmetals: most reactive at top-right ↗ (F, O)  •  Noble gases are nearly inert.",
    },
  };

  const info = trendInfo[trend];

  // Build placeholder cells for the omitted f-block ranges so users see the gap
  const placeholders = [
    { row: 6, col: 3, label: "57–71", titleTH: "แลนทาไนด์ (Ce–Lu)", titleEN: "Lanthanides (Ce–Lu)" },
    { row: 7, col: 3, label: "90–103", titleTH: "แอกทิไนด์ (Th–Lr)", titleEN: "Actinides (Th–Lr)" },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/chemistry" className="hover:underline">
          {t("เคมี", "Chemistry")}
        </Link>
        <span>&rsaquo;</span>
        <span>{t("ตารางธาตุ", "Periodic Table")}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">
        ⚗️ {t("ตารางธาตุและแนวโน้มในตารางธาตุ", "Periodic Table & Periodic Trends")}
      </h1>
      <p className="text-sm text-[var(--muted)] mb-5">
        {t(
          "กดปุ่มด้านล่างเพื่อแสดงแนวโน้มของสมบัติต่างๆ ของธาตุในตารางธาตุ",
          "Press a button below to highlight a periodic trend across the table."
        )}
      </p>

      {/* Trend selector buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        {trends.map((tr) => {
          const active = trend === tr.key;
          return (
            <button
              key={tr.key}
              onClick={() => setTrend(tr.key)}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all active:scale-[0.98] ${
                active
                  ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                  : "bg-[var(--card-bg)] text-[var(--foreground)] border-[var(--card-border)] hover:bg-[var(--background)]"
              }`}
            >
              <span className="mr-1">{tr.icon}</span>
              {t(tr.labelTH, tr.labelEN)}
            </button>
          );
        })}
      </div>

      {/* Trend description card */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3 mb-4">
        <div className="text-sm font-medium mb-1">{t(info.titleTH, info.titleEN)}</div>
        <div className="text-xs text-[var(--muted)] leading-relaxed">
          {t(info.descTH, info.descEN)}
        </div>
      </div>

      {/* Periodic table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 mb-4">
        <div className="min-w-[760px] px-4 sm:px-0">
          <div
            className="grid gap-[3px]"
            style={{
              gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
              gridAutoRows: "1fr",
            }}
          >
            {ELEMENTS.map((el) => {
              const v = getValue(el, trend);
              const bg =
                trend === "category"
                  ? CATEGORY_BG[el.cat]
                  : valueToColor(v, min, max);
              const dim = trend !== "category" && v == null;
              const isHovered = hovered?.z === el.z;
              return (
                <button
                  key={el.z}
                  type="button"
                  onMouseEnter={() => setHovered(el)}
                  onFocus={() => setHovered(el)}
                  onMouseLeave={() => setHovered(null)}
                  onBlur={() => setHovered(null)}
                  style={{
                    gridColumn: el.g,
                    gridRow: el.p,
                    background: bg,
                    opacity: dim ? 0.35 : 1,
                  }}
                  className={`aspect-square rounded p-0.5 flex flex-col items-center justify-center text-black
                    transition-all ${
                      isHovered
                        ? "ring-2 ring-[var(--foreground)] scale-[1.06] z-10"
                        : "hover:ring-2 hover:ring-[var(--foreground)]"
                    }`}
                >
                  <div className="text-[7px] sm:text-[8px] leading-none opacity-70">
                    {el.z}
                  </div>
                  <div className="text-[10px] sm:text-[12px] font-bold leading-tight">
                    {el.s}
                  </div>
                  <div className="text-[6px] sm:text-[7px] leading-none mt-0.5 font-medium">
                    {trend === "category" ? el.am : formatValue(v, trend)}
                  </div>
                </button>
              );
            })}

            {/* f-block placeholders */}
            {placeholders.map((ph) => (
              <div
                key={ph.label}
                style={{ gridColumn: ph.col, gridRow: ph.row }}
                title={t(ph.titleTH, ph.titleEN)}
                className="aspect-square rounded border border-dashed border-[var(--card-border)] bg-[var(--card-bg)]
                           flex items-center justify-center text-[8px] sm:text-[9px] text-[var(--muted)]"
              >
                {ph.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Color legend (only when a trend is active) */}
      {trend !== "category" && Number.isFinite(min) && Number.isFinite(max) && (
        <div className="flex items-center gap-3 text-xs mb-4">
          <span className="text-[var(--muted)]">
            {t("ต่ำ", "Low")} {formatValue(min, trend)}
          </span>
          <div
            className="flex-1 h-3 rounded"
            style={{
              background:
                "linear-gradient(to right, hsl(220,70%,65%), hsl(110,70%,65%), hsl(0,70%,65%))",
            }}
          />
          <span className="text-[var(--muted)]">
            {formatValue(max, trend)} {t("สูง", "High")}
          </span>
          <span className="text-[var(--muted)] hidden sm:inline">{unitFor(trend, t)}</span>
        </div>
      )}

      {/* Hovered element details */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 mb-4 min-h-[140px]">
        {hovered ? (
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <div className="text-3xl font-bold leading-none">{hovered.s}</div>
              <div className="text-xs text-[var(--muted)] mt-1">
                #{hovered.z} &middot; {hovered.am}
              </div>
              <div className="text-sm font-medium mt-1">
                {t(hovered.nTH, hovered.nEN)}
              </div>
              <div
                className="inline-block text-[10px] mt-1 px-2 py-0.5 rounded text-black"
                style={{ background: CATEGORY_BG[hovered.cat] }}
              >
                {t(CATEGORY_LABEL[hovered.cat].th, CATEGORY_LABEL[hovered.cat].en)}
              </div>
            </div>

            <Cell
              label={t("มวลอะตอม", "Atomic mass")}
              value={hovered.am}
            />
            <Cell
              label={t("ขนาดอะตอม", "Atomic radius")}
              value={`${hovered.ar} pm`}
            />
            <Cell
              label={t("ขนาดไอออน", "Ionic radius")}
              value={hovered.ir != null ? `${hovered.ir} pm` : "—"}
            />
            <Cell label="IE₁" value={`${hovered.ie1} kJ/mol`} />
            <Cell
              label="EN"
              value={hovered.en != null ? hovered.en.toFixed(2) : "—"}
            />
          </div>
        ) : (
          <div className="text-sm text-[var(--muted)]">
            {t(
              "เลื่อนเมาส์/แตะที่ธาตุเพื่อดูข้อมูลทั้งหมด",
              "Hover or tap an element to see all of its data."
            )}
          </div>
        )}
      </div>

      {/* Category legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-[var(--muted)]">
        {(Object.keys(CATEGORY_BG) as Category[]).map((c) => (
          <div key={c} className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded"
              style={{ background: CATEGORY_BG[c] }}
            />
            {t(CATEGORY_LABEL[c].th, CATEGORY_LABEL[c].en)}
          </div>
        ))}
      </div>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--background)] border border-[var(--card-border)] rounded-lg p-2">
      <div className="text-[10px] text-[var(--muted)] mb-0.5">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
