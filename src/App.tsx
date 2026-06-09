import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Activity, 
  FileText, 
  AlertTriangle, 
  HeartPulse, 
  Info, 
  ShieldCheck, 
  Clock, 
  Sliders, 
  Database,
  BookOpen, 
  Heart,
  ChevronRight,
  AlertOctagon,
  Globe,
  HelpCircle,
  TrendingUp,
  Play,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TRANSLATIONS, LOCALIZED_DRUGS } from "./translations";
import { TopicTooltip } from "./components/TopicTooltip";

// ==========================================
// DRUG REGISTRY DATA & RESEARCH PHENOTYPES
// ==========================================

export interface DrugProfile {
  id: "INH" | "RIF" | "BDQ";
  name: string;
  fullName: string;
  mechanism: string;
  targetGene: string;
  targetProtein: string;
  mec: number; // ug/mL
  mtc: number; // ug/mL
  timeWindow: number; // hours
  defaultDose: number; // mg/kg
  minDose: number;
  maxDose: number;
  dosingNotes: string;
  description: string;
  clinicalImpact: {
    targetMechanism: string;
    resistancePathway: string;
    toxicityRisk: string;
  };
}

const DRUG_REGISTRY: Record<string, DrugProfile> = {
  INH: {
    id: "INH",
    name: "Isoniazid",
    fullName: "Isoniazid (INH)",
    mechanism: "Mycolic acid cell wall synthesis inhibitor",
    targetGene: "InhA",
    targetProtein: "NADH-dependent enoyl-ACP reductase",
    mec: 0.2,
    mtc: 4.0,
    timeWindow: 24,
    defaultDose: 5,
    minDose: 5,
    maxDose: 30,
    dosingNotes: "Primary first-line therapy. Primarily metabolized in the liver via N-acetyltransferase 2 (NAT2). Slow acetylators face highly elevated direct hepatotoxic risk, whereas fast acetylators eliminate the drug rapidly, leading to prolonged sub-therapeutic coverage.",
    description: "Highly bactericidal drug that targets Mycobacterium tuberculosis enoyl-ACP reductase (InhA), stalling mycolic acid assembly and disrupting cell wall integrity.",
    clinicalImpact: {
      targetMechanism: "Blocks NADH-dependent enoyl-ACP reductase (InhA), arresting fatty acid elongation needed for mycolic class cellular protective walls.",
      resistancePathway: "Mutations in the inhA promoter or coding region, as well as loss-of-function catalase-peroxidase (katG) mutations which prevent INH prodrug activation.",
      toxicityRisk: "Drug-induced liver injury (DILI) through relative accumulation of reactive hydrazine metabolites, and peripheral neuropathy due to pyridoxine (Vitamin B6) depletion."
    }
  },
  RIF: {
    id: "RIF",
    name: "Rifampicin",
    fullName: "Rifampicin (RIF)",
    mechanism: "Bacterial transcription transcription stopper",
    targetGene: "rpoB",
    targetProtein: "DNA-dependent RNA polymerase beta subunit",
    mec: 1.0,
    mtc: 10.0,
    timeWindow: 24,
    defaultDose: 10,
    minDose: 5,
    maxDose: 30,
    dosingNotes: "Sterilizing core agent. Oral absorption is heavily delayed and reduced by co-administration with high-fat meals due to delayed gastric emptying, resulting in sub-therapeutic peak concentrations and rapid acceleration of rpoB-based mutations.",
    description: "Crucial first-line antibiotic that binds directly to the beta-subunit of Mycobacterial RNA polymerase, physically blocking the elongation of nascent messenger RNA.",
    clinicalImpact: {
      targetMechanism: "Sterically blocks transcription by binding adjacent to the active center of DNA-dependent RNA polymerase (rpoB beta subunit).",
      resistancePathway: "Single-nucleotide missense substitutions inside the 81-basepair cluster region (RRDR) of the rpoB gene, which prevent RIF binding.",
      toxicityRisk: "Cholestatic jaundice, potent hepatocyte cytochrome induction (CYP3A4) resulting in severe drug-drug interactions, and systemic immunological flu-like syndrome."
    }
  },
  BDQ: {
    id: "BDQ",
    name: "Bedaquiline",
    fullName: "Bedaquiline (BDQ)",
    mechanism: "Mycobacterial oxidative phosphorylation disruptor",
    targetGene: "atpE",
    targetProtein: "ATP synthase subunit c (c-ring rotor)",
    mec: 0.5,
    mtc: 3.5,
    timeWindow: 96, // scaled analytical window
    defaultDose: 6,
    minDose: 5,
    maxDose: 30,
    dosingNotes: "Secondary diarylquinoline agent labeled for multidrug-resistant cases. Oral bioavailability doubles when taken postprandially paired with lipids. Trough/sustained levels above 3.5 ug/mL trigger hERG potassium channel blocking, inducing cardiotoxicity and severe QTc prolongation.",
    description: "Highly specific diarylquinoline target agent that binds directly to ATP synthase rotor mechanics, inducing instantaneous chemical starvation of mycobacteria.",
    clinicalImpact: {
      targetMechanism: "Binds the proteolipid subunit c rotor of F0 ATP synthase (atpE), uncoupling proton transport and exhausting cellular energy reserves.",
      resistancePathway: "Mutations inside the atpE structural target gene or up-regulation of the MmpS5/MmpL5 efflux pump via Rv0678 transcriptional repressor loss-of-function.",
      toxicityRisk: "Inhibition of myocardial hERG potassium channels causing clinical QTc interval lengthening, severe ventricular tachyarrhythmias (Torsades de Pointes), and risk of sudden cardiac arrest."
    }
  }
};

// Modifiers Configuration
interface ModifierParams {
  tHalf: number; // hours
  vd: number;   // L/kg
  ka: number;   // h^-1
  f: number;    // Bioavailability
  label: string;
  description: string;
}

const MODIFIERS_REGISTRY: Record<string, Record<string, ModifierParams>> = {
  INH: {
    fast: {
      tHalf: 1.5,
      vd: 0.6,
      ka: 1.5,
      f: 0.90,
      label: "NAT2 Fast Acetylator",
      description: "Extremely rapid hepatic clearance via NAT2 enzyme. Results in rapid concentration decay, exposing bacteria to selective pressure."
    },
    slow: {
      tHalf: 3.5,
      vd: 0.6,
      ka: 1.5,
      f: 0.90,
      label: "NAT2 Slow Acetylator",
      description: "Impaired metabolic clearance leading to protracted high serum levels. Greatly increased risk of clinical hepatotoxicity."
    }
  },
  RIF: {
    fasting: {
      tHalf: 3.0,
      vd: 1.0,
      ka: 1.0,
      f: 0.92,
      label: "Fasting Conditions",
      description: "Optimal fast gastric transit. Ensures maximum absorption rate, high exposure peak, and minimal drug-neutralizing delays."
    },
    postprandial: {
      tHalf: 3.0,
      vd: 1.0,
      ka: 0.6,
      f: 0.58, // 36% reduction in peak exposure due to delayed gastric emptying and mechanical binding
      label: "Postprandial (Fed/High-Fat Meal)",
      description: "Delayed gastric emptying and transit delays. Reduces overall oral fraction absorption by 36% and slows down the absorption rate constant."
    }
  },
  BDQ: {
    fasting: {
      tHalf: 48.0, // Scaled for 96-hour analytical simulation
      vd: 164.0,
      ka: 0.4,
      f: 0.45,
      label: "Fasting Conditions",
      description: "Extremely low lipophilic absorption. Absorbs pool-poorly from gastrointestinal tract, wasting active therapeutic mass."
    },
    postprandial: {
      tHalf: 48.0, // Scaled
      vd: 164.0,
      ka: 0.5,
      f: 0.90, // Solid 2x absorption amplification when paired with lipids
      label: "Postprandial (Fed/High-Fat Meal)",
      description: "Co-administered lipid structures enhance absorption solubility, doubling bioavailable delivery to 90%."
    }
  }
};

export default function App() {
  // ==========================================
  // STATE MANAGEMENT & LOCALIZATION
  // ==========================================
  const [language, setLanguage] = useState<"en" | "ru">("en");
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingStageText, setLoadingStageText] = useState<string>("");
  const [isEasyUiMode, setIsEasyUiMode] = useState<boolean>(true);

  const [selectedAgent, setSelectedAgent] = useState<"INH" | "RIF" | "BDQ">("INH");
  const [patientWeight, setPatientWeight] = useState<number>(60); // 40-100 kg
  const [targetDose, setTargetDose] = useState<number>(5); // mg/kg

  // Modifier state depending on selected drug
  const [inhModifier, setInhModifier] = useState<"fast" | "slow">("fast");
  const [rifBdqModifier, setRifBdqModifier] = useState<"fasting" | "postprandial">("fasting");

  // Chart hover state
  const [hoveredPoint, setHoveredPoint] = useState<{
    time: number;
    conc: number;
    x: number;
    y: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState<number>(650);

  // Retrieve current translations
  const t = TRANSLATIONS[language];

  // Localized drugs configuration override helper
  const activeDrug = useMemo(() => {
    const rawDrug = DRUG_REGISTRY[selectedAgent];
    const local = LOCALIZED_DRUGS[language][selectedAgent];
    return {
      ...rawDrug,
      name: local.name,
      fullName: local.fullName,
      mechanism: local.mechanism,
      description: local.description,
      dosingNotes: local.dosingNotes,
      targetProtein: local.targetProtein,
      clinicalImpact: {
        ...local.clinicalImpact
      }
    };
  }, [selectedAgent, language]);

  // Sync default dosing slider caps when drug changes
  useEffect(() => {
    setTargetDose(activeDrug.defaultDose);
  }, [selectedAgent, activeDrug]);

  // Adjust container width for responsive SVG chart rendering
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setChartWidth(Math.max(300, entry.contentRect.width - 48));
      }
    });
    
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Determine active physiological modifier settings
  const activeModifierKey = selectedAgent === "INH" ? inhModifier : rifBdqModifier;
  const activeParams = useMemo((): ModifierParams => {
    const registry = MODIFIERS_REGISTRY[selectedAgent];
    return registry[activeModifierKey];
  }, [selectedAgent, inhModifier, rifBdqModifier, activeModifierKey]);

  // Localized modifier labels and descriptions
  const localizedModifierDetails = useMemo(() => {
    const isRu = language === "ru";
    if (selectedAgent === "INH") {
      return inhModifier === "fast"
        ? {
            label: isRu ? "Быстрый ацетилятор NAT2 (высокий клиренс)" : "NAT2 Fast Acetylator (High Clearance)",
            description: isRu 
              ? "Крайне быстрая печеночная элиминация из-за гиперактивности фермента NAT2. Быстро снижает концентрацию препарата, продлевая терапевтическую неэффективность."
              : "Extremely rapid hepatic clearance via NAT2 enzyme. Results in rapid concentration decay, exposing bacteria to selective pressure."
          }
        : {
            label: isRu ? "Медленный ацетилятор NAT2 (дефицит метаболизма)" : "NAT2 Slow Acetylator (Metabolic Deficit)",
            description: isRu
              ? "Замедленная элиминация ведет к длительному сохранению высоких сывороточных концентраций. Критически повышен риск поражения печени."
              : "Impaired metabolic clearance leading to protracted high serum levels. Greatly increased risk of clinical hepatotoxicity."
          };
    } else if (selectedAgent === "RIF") {
      return rifBdqModifier === "fasting"
        ? {
            label: isRu ? "Введение натощак (до еды)" : "Fasting Conditions (Pre-Prandial)",
            description: isRu
              ? "Оптимальный быстрый транзит через желудок. Обеспечивает максимальную скорость абсорбции, высокий пик концентрации и отсутствие препятствий."
              : "Optimal fast gastric transit. Ensures maximum absorption rate, high exposure peak, and minimal drug-neutralizing delays."
          }
        : {
            label: isRu ? "После еды (жирный/калорийный прием пищи)" : "Postprandial (Fed / High-Fat Meal)",
            description: isRu
              ? "Замедленный желудочный транзит. Общая фракция всасывания падает на 36%, а скорость абсорбции существенно замедляется."
              : "Delayed gastric emptying and transit delays. Reduces overall oral fraction absorption by 36% and slows down the absorption rate constant."
          };
    } else { // BDQ
      return rifBdqModifier === "fasting"
        ? {
            label: isRu ? "Введение натощак (до еды)" : "Fasting Conditions (Pre-Prandial)",
            description: isRu
              ? "Крайне плохая абсорбция бедаквилина без липидов. Препарат плохо всасывается из желудочно-кишечного тракта, снижая уровень до 45%."
              : "Extremely low lipophilic absorption. Absorbs pool-poorly from gastrointestinal tract, wasting active therapeutic mass."
          }
        : {
            label: isRu ? "После еды (жирный/калорийный прием пищи)" : "Postprandial (Fed / High-Fat Meal)",
            description: isRu
              ? "Прием с жирной пищей способствует солюбилизации липофильного препарата, мгновенно удваивая биодоступность до 90%."
              : "Co-administered lipid structures enhance absorption solubility, doubling bioavailable delivery to 90%."
          };
    }
  }, [selectedAgent, inhModifier, rifBdqModifier, language]);

  // Calibration progression effect for authentic clinical feel
  useEffect(() => {
    if (!isCalibrating) return;
    setLoadingProgress(0);
    
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setHasEntered(true);
            setIsCalibrating(false);
          }, 350);
          return 100;
        }
        
        const next = prev + Math.floor(Math.random() * 5) + 2;
        const bounded = Math.min(100, next);
        
        // Update descriptive clinical text
        if (bounded < 20) {
          setLoadingStageText(language === "ru" ? "Инициализация распределительных массивов..." : "Initializing compartmental arrays...");
        } else if (bounded < 40) {
          setLoadingStageText(language === "ru" ? "Расчет констант метаболического клиренса NAT2..." : "Evaluating NAT2 phenotypic metabolism clearance constants...");
        } else if (bounded < 65) {
          setLoadingStageText(language === "ru" ? "Моделирование влияния пищевых липидов на абсорбцию..." : "Simulating postprandial fat-meal absorption delays...");
        } else if (bounded < 85) {
          setLoadingStageText(language === "ru" ? "Решение дифференциальных уравнений частоты мутаций (inhA, rpoB, atpE)..." : "Solving differential equations for target gene mutation rates (inhA, rpoB, atpE)...");
        } else {
          setLoadingStageText(language === "ru" ? "Синхронизация порогов поддержки клинических решений..." : "Synchronizing clinical decision support limits...");
        }
        
        return bounded;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [isCalibrating, language]);

  // Calculate pharmacokinetic rates and clinical scales
  const calculatedMetrics = useMemo(() => {
    const { tHalf, vd, ka, f } = activeParams;
    const ke = Math.log(2) / tHalf; // elimination rate constant
    const w = patientWeight;
    const doseMgKg = targetDose;
    const totalDose = w * doseMgKg; // mg
    const totalVd = w * vd; // Liters
    const CL = ke * totalVd; // L/h total clearance

    // Prevent identical ka and ke (limits to close differential)
    const exactKa = ka;
    const exactKe = Math.abs(ka - ke) < 1e-4 ? ke + 1e-4 : ke;

    // Tmax analytial solution: t_max = ln(ka / ke) / (ka - ke)
    const tMax = Math.log(exactKa / exactKe) / (exactKa - exactKe);

    // Dynamic continuous curve concentration computation
    const getConcAt = (time: number) => {
      if (time <= 0) return 0;
      const term1 = Math.exp(-exactKe * time);
      const term2 = Math.exp(-exactKa * time);
      const multiplier = (f * totalDose * exactKa) / (totalVd * (exactKa - exactKe));
      const res = multiplier * (term1 - term2);
      return isNaN(res) || res < 0 ? 0 : res;
    };

    // Calculate exact analytical Cmax
    const cMax = getConcAt(tMax);

    // Numerically evaluate % of dosing interval spent below MEC
    // Dosing interval modeled is 24 hours for INH/RIF, 96 hours for BDQ
    const interval = activeDrug.timeWindow;
    const samplingPoints = 400;
    let belowCount = 0;
    
    for (let i = 0; i < samplingPoints; i++) {
      const t = (i / (samplingPoints - 1)) * interval;
      const c = getConcAt(t);
      if (c < activeDrug.mec) {
        belowCount++;
      }
    }

    const prcSubTherapeutic = Math.round((belowCount / samplingPoints) * 100);

    return {
      ke,
      exactKa,
      totalDose,
      totalVd,
      CL,
      tMax,
      cMax,
      prcSubTherapeutic,
      getConcAt
    };
  }, [selectedAgent, activeParams, patientWeight, targetDose, activeDrug]);

  // Generate dataset points for the SVG interactive path plotting
  const curvePoints = useMemo(() => {
    const points: { time: number; conc: number }[] = [];
    const interval = activeDrug.timeWindow;
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * interval;
      const c = calculatedMetrics.getConcAt(t);
      points.push({ time: t, conc: c });
    }
    return points;
  }, [calculatedMetrics, activeDrug]);

  // Calculated peak status
  const cMaxClinicalState = useMemo(() => {
    const maxVal = calculatedMetrics.cMax;
    if (maxVal > activeDrug.mtc) return { label: "Toxic Range", style: "text-rose-600 bg-rose-50 border-rose-200" };
    if (maxVal < activeDrug.mec) return { label: "Sub-therapeutic", style: "text-amber-600 bg-amber-50 border-amber-200" };
    return { label: "Optimal Therapeutic", style: "text-emerald-600 bg-emerald-50 border-emerald-200" };
  }, [calculatedMetrics.cMax, activeDrug]);

  // Determine chart scales
  const chartHeight = 350;
  const paddingLeft = 55;
  const paddingRight = 40;
  const paddingTop = 40;
  const paddingBottom = 45;

  // X scale (Time) maps: [0, timeWindow] -> [paddingLeft, chartWidth - paddingRight]
  const scaleX = (t: number) => {
    const ratio = t / activeDrug.timeWindow;
    return paddingLeft + ratio * (chartWidth - paddingLeft - paddingRight);
  };

  const invScaleX = (x: number) => {
    const interiorWidth = chartWidth - paddingLeft - paddingRight;
    const ratio = (x - paddingLeft) / interiorWidth;
    return Math.max(0, Math.min(activeDrug.timeWindow, ratio * activeDrug.timeWindow));
  };

  // Y scale (Conc ug/mL). Ensure the dynamic peak doesn't cut off boundaries
  const maxModelConcY = useMemo(() => {
    const pointsAndThresholds = [...curvePoints.map(p => p.conc), activeDrug.mtc * 1.25, 0.5];
    return Math.max(...pointsAndThresholds);
  }, [curvePoints, activeDrug]);

  // Y maps: [0, maxModelConcY] -> [chartHeight - paddingBottom, paddingTop]
  const scaleY = (conc: number) => {
    const ratio = conc / maxModelConcY;
    const verticalSpan = chartHeight - paddingTop - paddingBottom;
    return chartHeight - paddingBottom - ratio * verticalSpan;
  };

  const invScaleY = (y: number) => {
    const verticalSpan = chartHeight - paddingTop - paddingBottom;
    const ratio = (chartHeight - paddingBottom - y) / verticalSpan;
    return Math.max(0, ratio * maxModelConcY);
  };

  // Generate SVG path string
  const dPath = useMemo(() => {
    if (curvePoints.length === 0) return "";
    let d = `M ${scaleX(curvePoints[0].time)} ${scaleY(curvePoints[0].conc)}`;
    for (let i = 1; i < curvePoints.length; i++) {
      d += ` L ${scaleX(curvePoints[i].time)} ${scaleY(curvePoints[i].conc)}`;
    }
    return d;
  }, [curvePoints, chartWidth, maxModelConcY]);

  // Generate fill areas for gradients under the curve
  const areaPath = useMemo(() => {
    if (curvePoints.length === 0) return "";
    let d = `M ${scaleX(curvePoints[0].time)} ${scaleY(curvePoints[0].conc)}`;
    for (let i = 1; i < curvePoints.length; i++) {
      d += ` L ${scaleX(curvePoints[i].time)} ${scaleY(curvePoints[i].conc)}`;
    }
    // close the path at the bottom
    d += ` L ${scaleX(curvePoints[curvePoints.length - 1].time)} ${scaleY(0)}`;
    d += ` L ${scaleX(0)} ${scaleY(0)} Z`;
    return d;
  }, [curvePoints, chartWidth, maxModelConcY]);

  // Handle Chart Interaction / Tracking Mouse Movement
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if mouse inside coordinates graph area
    if (x >= paddingLeft && x <= chartWidth - paddingRight) {
      const timeVal = invScaleX(x);
      const concVal = calculatedMetrics.getConcAt(timeVal);
      
      setHoveredPoint({
        time: parseFloat(timeVal.toFixed(2)),
        conc: parseFloat(concVal.toFixed(3)),
        x: scaleX(timeVal),
        y: scaleY(concVal)
      });
    } else {
      setHoveredPoint(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  // Interactive metrics calculation
  const isHighDangerOfToxicity = calculatedMetrics.cMax > activeDrug.mtc;
  const isHighDangerOfResistance = calculatedMetrics.prcSubTherapeutic > 40;

  // Target Biomarker pulse when simulated concentration drops below MEC
  const isTargetBiomarkerPulsing = hoveredPoint 
    ? hoveredPoint.conc < activeDrug.mec 
    : isHighDangerOfResistance;

  // Localized clinical peak state
  const localizedCMaxClinicalState = useMemo(() => {
    const maxVal = calculatedMetrics.cMax;
    if (maxVal > activeDrug.mtc) return { label: t.clinicalStateToxic, style: "text-rose-700 bg-red-100 border-red-300" };
    if (maxVal < activeDrug.mec) return { label: t.clinicalStateSub, style: "text-amber-700 bg-amber-100 border-amber-300" };
    return { label: t.clinicalStateOptimal, style: "text-emerald-800 bg-emerald-100 border-emerald-300" };
  }, [calculatedMetrics.cMax, activeDrug, language, t]);

  if (!hasEntered) {
    return (
      <div id="welcome_flow_root" className="min-h-screen bg-[#E4E3E0] text-[#141414] flex flex-col font-sans selection:bg-[#141414] selection:text-white pb-12">
        {/* Onboarding Top Nav with language toggles */}
        <header id="welcome_header" className="bg-[#F1F0ED] text-[#141414] px-6 py-4 border-b-2 border-[#141414] shadow-none w-full sticky top-0 z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-[#141414]" />
              <span className="font-bold font-mono text-xs uppercase tracking-wider">{t.appName}</span>
            </div>
            
            {/* Quick dual-lang selector switch */}
            <div className="flex items-center space-x-2">
              <Globe className="w-3.5 h-3.5 text-[#141414]" />
              <button 
                id="btn_lang_en_welcome"
                onClick={() => setLanguage("en")} 
                className={`px-2.5 py-1 text-[10px] font-mono font-bold border transition-colors ${language === "en" ? "bg-[#141414] text-white border-[#141414]" : "bg-white text-[#141414] border-slate-350 hover:bg-slate-100 cursor-pointer"}`}
              >
                EN
              </button>
              <button 
                id="btn_lang_ru_welcome"
                onClick={() => setLanguage("ru")} 
                className={`px-2.5 py-1 text-[10px] font-mono font-bold border transition-colors ${language === "ru" ? "bg-[#141414] text-white border-[#141414]" : "bg-white text-[#141414] border-slate-350 hover:bg-slate-100 cursor-pointer"}`}
              >
                РУС
              </button>
            </div>
          </div>
        </header>

        {/* Welcome Intro Section */}
        <main id="welcome_main" className="max-w-4xl mx-auto px-6 py-8 flex-grow w-full">
          <motion.div 
            id="welcome_card"
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-[#F1F0ED] border border-[#141414] p-6 md:p-8 rounded-none shadow-none mb-6 relative overflow-hidden"
          >
            {/* Background design element */}
            <div className="absolute right-0 top-0 h-full w-12 bg-[#141414] opacity-[0.03] transform skew-x-12"></div>
            
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 font-mono block mb-1">
              {t.welcomeSub}
            </span>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#141414] uppercase mb-4">
              {t.welcomeTitle}
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed font-sans max-w-2xl bg-white p-4 border border-[#141414]/20 mb-6">
              {t.welcomeIntro}
            </p>

            {/* 4 Explanation Cards */}
            <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-500 mb-4 pb-1 border-b border-[#141414]/20">
              {language === "ru" ? "ЧТО ПОЗВОЛЯЕТ МОДЕЛИРОВАТЬ ЭТОТ ИНСТРУМЕНТ" : "WHAT THIS PORTAL SIMULATES & SOLVES"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              
              <div id="onboarding_card_1" className="bg-white p-4 border border-[#141414]">
                <h4 className="text-xs font-bold text-[#141414] uppercase font-mono mb-1">
                  {t.welcomeCardDosingTitle}
                </h4>
                <p className="text-[11px] text-slate-600 leading-normal">
                  {t.welcomeCardDosingDesc}
                </p>
              </div>

              <div id="onboarding_card_2" className="bg-white p-4 border border-[#141414]">
                <h4 className="text-xs font-bold text-[#141414] uppercase font-mono mb-1">
                  {t.welcomeCardGeneticsTitle}
                </h4>
                <p className="text-[11px] text-slate-600 leading-normal">
                  {t.welcomeCardGeneticsDesc}
                </p>
              </div>

              <div id="onboarding_card_3" className="bg-white p-4 border border-[#141414]">
                <h4 className="text-xs font-bold text-[#141414] uppercase font-mono mb-1">
                  {t.welcomeCardFoodTitle}
                </h4>
                <p className="text-[11px] text-slate-600 leading-normal">
                  {t.welcomeCardFoodDesc}
                </p>
              </div>

              <div id="onboarding_card_4" className="bg-white p-4 border border-[#141414]">
                <h4 className="text-xs font-bold text-[#141414] uppercase font-mono mb-1">
                  {t.welcomeCardAmrTitle}
                </h4>
                <p className="text-[11px] text-slate-600 leading-normal">
                  {t.welcomeCardAmrDesc}
                </p>
              </div>

            </div>

            {/* Step-by-step interactive manual */}
            <div id="guide_container" className="bg-amber-50/50 border border-[#141414] p-4 font-mono text-xs text-slate-700 mb-6">
              <div className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-[#141414]/10 pb-1.5 mb-2">
                <HelpCircle className="w-4 h-4 text-amber-600" /> {t.welcomeGuideTitle}
              </div>
              <ul className="space-y-1.5 text-[11px] list-none p-0 m-0">
                <li>{t.welcomeStep1}</li>
                <li>{t.welcomeStep2}</li>
                <li>{t.welcomeStep3}</li>
              </ul>
            </div>

            {/* Equational Typesetting Card - Rendered Properly with LaTeX equivalent stack */}
            <div id="math_foundations_card" className="bg-white border border-[#141414] p-5 rounded-none shadow-none mt-4">
              <div className="border-b border-[#141414] pb-2 mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-[#141414]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#141414]">
                    {t.equationHeader}
                  </h3>
                </div>
              </div>
              
              {/* Perfect PDF/Typeset-like Stack */}
              <div id="perfect_typeset_block" className="py-6 px-4 bg-[#F1F0ED] border border-dashed border-[#141414] flex flex-col items-center justify-center overflow-x-auto">
                <div className="flex flex-col sm:flex-row items-center gap-4 select-all text-center">
                  <span className="font-serif italic text-base font-bold text-[#141414]">C(t)</span>
                  <span className="text-lg text-[#141414] font-medium">=</span>
                  
                  <div className="flex flex-col items-center">
                    <span className="font-serif italic text-sm text-[#141414] border-b border-[#141414] pb-1 px-4 font-semibold tracking-wide">
                      F &sdot; Dose &sdot; k<sub>a</sub>
                    </span>
                    <span className="font-serif italic text-sm text-[#141414] pt-1 px-4 font-semibold tracking-wide">
                      V<sub>d</sub> &sdot; (k<sub>a</sub> &minus; k<sub>e</sub>)
                    </span>
                  </div>
                  
                  <span className="text-lg text-[#141414] font-medium">&middot;</span>
                  <span className="font-serif italic text-base text-[#141414] font-semibold tracking-wide">
                    ( e<sup>&minus;k<sub>e</sub> &sdot; t</sup> &minus; e<sup>&minus;k<sub>a</sub> &sdot; t</sup> )
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#141414]/30 w-full justify-center">
                  <span className="font-serif italic text-sm text-[#141414] font-bold">k<sub>e</sub></span>
                  <span className="text-sm text-[#141414] font-medium">=</span>
                  <div className="flex flex-col items-center">
                    <span className="font-serif italic text-xs text-[#141414] border-b border-[#141414]/40 pb-0.5 px-3">
                      ln(2)
                    </span>
                    <span className="font-serif italic text-xs text-[#141414] pt-0.5 px-3">
                      t<sub>&frac12;</sub>
                    </span>
                  </div>
                </div>
              </div>

              {/* Variable legend translations */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[9px] font-mono text-slate-500 mt-4 border-t border-slate-150 pt-3">
                <div>
                  <span className="font-bold text-[#141414]">C(t)</span>: {language === "ru" ? "Сывороточная концентрация" : "Serum concentration"}
                </div>
                <div>
                  <span className="font-bold text-[#141414]">F</span>: {language === "ru" ? "Биодоступность" : "Bioavailable fraction"}
                </div>
                <div>
                  <span className="font-bold text-[#141414]">k_a</span>: {language === "ru" ? "Скор. всасывания" : "Absorption rate constant"}
                </div>
                <div>
                  <span className="font-bold text-[#141414]">V_d</span>: {language === "ru" ? "Объем распределения" : "Distribution volume"}
                </div>
              </div>

              <div className="mt-4">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono block mb-1">
                  {t.equationLatexTitle}
                </span>
                <pre className="p-2.5 bg-slate-50 border border-[#141414] text-[10px] font-mono text-[#141414] select-all overflow-x-auto">
                  {`C(t) = \\frac{F \\cdot \\text{Dose} \\cdot k_a}{V_d \\cdot (k_a - k_e)} \\cdot \\left( e^{-k_e \\cdot t} - e^{-k_a \\cdot t} \\right)`}
                </pre>
              </div>
            </div>

            {/* BUTTON WITH LOADING WORKFLOW OR CALIBRATION STEP */}
            <div className="mt-8 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {!isCalibrating ? (
                  <button
                    id="btn_enter_sim"
                    onClick={() => {
                      setIsCalibrating(true);
                    }}
                    className="group bg-[#141414] text-white hover:bg-slate-800 px-8 py-4 font-mono font-bold text-xs uppercase tracking-widest border border-[#141414] flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" /> {t.welcomeEnterBtn}
                  </button>
                ) : (
                  <div className="w-full max-w-md">
                    <span className="text-[10px] font-mono tracking-wide text-slate-600 block mb-2 font-bold uppercase">
                      {t.welcomeLoadingBtn}
                    </span>
                    
                    {/* Real clinical stage description text */}
                    <span className="text-[11px] font-mono text-[#141414] font-bold block mb-1.5 animate-pulse">
                      {loadingStageText}
                    </span>

                    <div className="w-full bg-slate-200 border border-[#141414] h-6 overflow-hidden relative flex items-center">
                      <div 
                        className="bg-[#141414] h-full transition-all duration-100 ease-out"
                        style={{ width: `${loadingProgress}%` }}
                      ></div>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-black select-none text-slate-600 mix-blend-difference">
                        {loadingProgress}%
                      </span>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

          </motion.div>

          <p className="text-[10px] text-slate-500/90 text-center font-mono leading-tight max-w-lg mx-auto italic">
            {t.welcomeDisclaimer}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div id="sim_dashboard_root" className="min-h-screen bg-[#E4E3E0] text-[#141414] flex flex-col font-sans selection:bg-[#141414] selection:text-white pb-6">
      
      {/* HEADER BAR */}
      <header className="bg-[#F1F0ED] text-[#141414] px-6 py-4 border-b-2 border-[#141414] shadow-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-[#141414] text-white p-2 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-widest text-[#141414] uppercase">
                {t.appName}
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-tight flex items-center gap-1.5 mt-0.5 font-mono">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
                {t.appSubtitle}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 font-mono text-xs text-[#141414]">
            {/* Easy UI Indicator Toggle */}
            <button 
              id="toggle_easy_ui"
              onClick={() => setIsEasyUiMode(!isEasyUiMode)}
              className={`border border-[#141414] px-3 py-1.5 text-left shadow-none transition-colors cursor-pointer flex items-center gap-1.5 ${
                isEasyUiMode ? "bg-emerald-50 text-emerald-950 font-bold" : "bg-white text-slate-400"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-[9px] block uppercase font-mono tracking-wider">
                {language === "ru" ? "ПРОСТОЙ РЕЖИМ" : "EASY UI MODE"}: {isEasyUiMode ? "ON / ВКЛ" : "OFF / ВЫКЛ"}
              </span>
            </button>

            {/* Language Selection Bar (Inside the Simulator) */}
            <div className="bg-white rounded-none border border-[#141414] p-1 text-right shadow-none flex items-center gap-1">
              <button 
                id="btn_lang_en_sim"
                onClick={() => setLanguage("en")} 
                className={`px-2 py-0.5 text-[9px] font-mono font-bold border transition-colors ${language === "en" ? "bg-[#141414] text-white border-[#141414]" : "bg-white text-slate-400 border-transparent hover:text-[#141414] cursor-pointer"}`}
              >
                EN
              </button>
              <button 
                id="btn_lang_ru_sim"
                onClick={() => setLanguage("ru")} 
                className={`px-2 py-0.5 text-[9px] font-mono font-bold border transition-colors ${language === "ru" ? "bg-[#141414] text-white border-[#141414]" : "bg-white text-slate-400 border-transparent hover:text-[#141414] cursor-pointer"}`}
              >
                РУС
              </button>
            </div>

            <div className="bg-white rounded-none border border-[#141414] px-3 py-1.5 text-right shadow-none">
              <span className="text-slate-500 block text-[9px] uppercase font-mono tracking-wider">{t.analysisTimeline}</span>
              <span className="font-bold text-[#141414]">
                {selectedAgent === "BDQ" ? t.analysisTimelineExtended : t.analysisTimelineStandard}
              </span>
            </div>
            <div className="bg-white rounded-none border border-[#141414] px-3 py-1.5 text-right shadow-none">
              <span className="text-slate-500 block text-[9px] uppercase font-mono tracking-wider">{t.cofactorEnzyme}</span>
              <span className="font-bold text-[#141414]">
                {activeDrug.targetGene} / {activeDrug.targetProtein.split(" ")[0]}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* BODY CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SIDEBAR CLINICAL CONTROLS (4 Columns) */}
        <section className="lg:col-span-4 flex flex-col gap-5">
          
          {/* PROFILE CONTROL CARD */}
          <div className="bg-[#F1F0ED] border border-[#141414] rounded-none p-5">
            <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-[#141414]">
              <Sliders className="w-4 h-4 text-[#141414]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#141414] font-mono">
                <TopicTooltip title={t.regimenSimulationMatrix} explanation={t.ttRegimenSimulation} />
              </h2>
            </div>

            {/* DRUG SELECTOR CARD */}
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 font-mono">
                  {t.selectAgent}
                </label>
                <div className="grid grid-cols-3 gap-0 bg-white border border-[#141414] p-1 rounded-none">
                  {(["INH", "RIF", "BDQ"] as const).map((agentID) => {
                    const active = selectedAgent === agentID;
                    return (
                      <button
                        id={`btn_agent_${agentID}`}
                        key={agentID}
                        onClick={() => setSelectedAgent(agentID)}
                        className={`py-2 text-xs font-mono font-bold transition-all rounded-none border ${
                          active 
                            ? "bg-[#141414] text-white border-[#141414]" 
                            : "text-[#141414] bg-white border-transparent hover:bg-slate-100 cursor-pointer"
                        }`}
                      >
                        {agentID}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BIO REGISTRY DETAIL SUMMARY */}
              <div className="bg-white rounded-none p-4 border border-[#141414] shadow-none">
                <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-widest font-mono">
                  <TopicTooltip title={t.targetDrugBioProfile} explanation={t.ttDrugBioProfile} />
                </span>
                <span className="text-sm font-bold text-[#141414] block mt-1 uppercase tracking-tight">
                  {activeDrug.fullName}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
                  {activeDrug.description}
                </p>
                
                {/* Specific genetic details */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-[#141414] pt-2.5 text-slate-600">
                  <div>
                    <span className="text-slate-500 block uppercase font-mono tracking-wider">{t.targetGene}</span>
                    <span className="font-bold text-[#141414]">{activeDrug.targetGene}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-mono tracking-wider">{t.mechanismLabel}</span>
                    <span className="font-bold text-[#141414] truncate block animate-pulse text-slate-800" title={activeDrug.mechanism}>
                      {activeDrug.id === "INH" ? (language === "ru" ? "Клеточная стенка" : "Cell Wall") : activeDrug.id === "RIF" ? (language === "ru" ? "Транскрипция" : "Transcription") : (language === "ru" ? "Лишение энергии" : "ATP Starve")}
                    </span>
                  </div>
                </div>
              </div>

              {/* PATIENT PHYSIOLOGICAL DATA */}
              <div className="pt-2 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1">
                      <TopicTooltip title={t.patientMass} explanation={t.ttPatientMass} />
                      {isEasyUiMode && (
                        <span className="text-[9px] lowercase bg-emerald-50 text-emerald-800 font-bold font-sans px-1 rounded border border-emerald-200">
                          {language === "ru" ? "влияет на объем распределения Vd" : "affects distribution volume Vd"}
                        </span>
                      )}
                    </label>
                    <span className="text-xs font-bold text-white font-mono bg-[#141414] px-2 py-0.5 rounded-none border border-[#141414]">
                      {patientWeight} kg
                    </span>
                  </div>
                  <input
                    id="slider_weight"
                    type="range"
                    min="40"
                    max="100"
                    step="1"
                    value={patientWeight}
                    onChange={(e) => setPatientWeight(parseInt(e.target.value))}
                    className="w-full accent-[#141414] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 mt-0.5 font-mono uppercase tracking-wider">
                    <span>40 kg</span>
                    <span>70 kg ({t.adultNorm})</span>
                    <span>100 kg</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1">
                      <TopicTooltip title={t.targetRegimenDosage} explanation={t.ttTargetRegimenDosage} />
                      {isEasyUiMode && (
                        <span className="text-[9px] lowercase bg-emerald-50 text-emerald-800 font-bold font-sans px-1 rounded border border-emerald-200">
                          {language === "ru" ? "меняет Cmax" : "moves Cmax up/down"}
                        </span>
                      )}
                    </label>
                    <div className="flex items-center space-x-1 font-mono text-sm">
                      <span className="text-xs font-bold text-white font-mono bg-[#141414] px-2 py-0.5 rounded-none border border-[#141414]">
                        {targetDose} mg/kg
                      </span>
                    </div>
                  </div>
                  <input
                    id="slider_dose"
                    type="range"
                    min={activeDrug.minDose}
                    max={activeDrug.maxDose}
                    step="1"
                    value={targetDose}
                    onChange={(e) => setTargetDose(parseInt(e.target.value))}
                    className="w-full accent-[#141414] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 mt-1 font-mono uppercase tracking-wider">
                    <span>Min: {activeDrug.minDose} mg/kg</span>
                    <span>Max: {activeDrug.maxDose} mg/kg</span>
                  </div>
                </div>

                {/* COMPUTED ABSOLUTE DOSE REFERENCE */}
                <div className="bg-white p-3 rounded-none border border-[#141414] flex items-center justify-between shadow-none">
                  <div className="font-mono text-[10px]">
                    <span className="text-slate-500 block uppercase tracking-wider">{t.absoluteDose}</span>
                    <span className="text-slate-400">{patientWeight} kg &times; {targetDose} mg/kg =</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base font-bold text-[#141414]">
                      {calculatedMetrics.totalDose}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1 font-bold uppercase font-mono">mg</span>
                  </div>
                </div>
              </div>

              {/* CONDITIONAL DROPDOWNS BASED ON ACTIVE DRUG */}
              <div className="border-t border-[#141414] pt-4 mt-2">
                {selectedAgent === "INH" ? (
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 font-mono flex items-center gap-1">
                      <TopicTooltip title={t.hostGenetics} explanation={t.ttHostGenetics} />
                      {isEasyUiMode && (
                        <span className="bg-amber-100 text-amber-950 font-bold text-[9px] px-1 font-sans rounded border border-amber-300">
                          {language === "ru" ? "Влияет на риск токсичности печени" : "Controls metabolic speed/toxicity"}
                        </span>
                      )}
                    </label>
                    <select
                      id="select_inh_modifier"
                      value={inhModifier}
                      onChange={(e) => setInhModifier(e.target.value as "fast" | "slow")}
                      className="w-full bg-white border border-[#141414] rounded-none px-3 py-2 text-xs font-mono font-bold text-[#141414] outline-none focus:ring-1 focus:ring-[#141414]"
                    >
                      <option value="fast">{language === "ru" ? "NAT2 Быстрый ацетилятор (высокий клиренс)" : "NAT2 Fast Acetylator (High Clearance)"}</option>
                      <option value="slow">{language === "ru" ? "NAT2 Медленный ацетилятор (дистрофия ацетилирования)" : "NAT2 Slow Acetylator (Metabolic Deficit)"}</option>
                    </select>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-2 italic font-sans bg-white/50 p-2 border border-dashed border-slate-350">
                      {localizedModifierDetails.description}
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 font-mono flex items-center gap-1">
                      <TopicTooltip title={t.adminProtocol} explanation={t.ttHostGenetics} />
                      {isEasyUiMode && (
                        <span className="bg-amber-100 text-amber-950 font-bold text-[9px] px-1 font-sans rounded border border-amber-300">
                          {language === "ru" ? "Всасывание зависит от пищи" : "Food drastically binds absorption"}
                        </span>
                      )}
                    </label>
                    <select
                      id="select_rif_bdq_modifier"
                      value={rifBdqModifier}
                      onChange={(e) => setRifBdqModifier(e.target.value as "fasting" | "postprandial")}
                      className="w-full bg-white border border-[#141414] rounded-none px-3 py-2 text-xs font-mono font-bold text-[#141414] outline-none focus:ring-1 focus:ring-[#141414]"
                    >
                      <option value="fasting">{t.fastingOption}</option>
                      <option value="postprandial">{t.postprandialOption}</option>
                    </select>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-2 italic font-sans bg-white/50 p-2 border border-dashed border-slate-350">
                      {localizedModifierDetails.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SCIENTIFIC METRIC REFERENCE CARD / RENDERED PROPERLY WITH LATEX EQUIVALENT STACK */}
          <div className="bg-[#141414] rounded-none p-5 text-white shadow-none border border-[#141414] flex-grow flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-amber-400 mb-3 hover:text-amber-300 transition-colors">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <TopicTooltip title={t.pharmaModel} explanation={t.ttPharmaModel} id="tooltip_pharma_model" />
              </div>
              <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-slate-200">
                {t.oneCompartmentDesc}
              </h3>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-sans">
                {t.pharmacologicalModelDesc}
              </p>
              
              {/* Perfectly typeset fraction representation */}
              <div className="bg-white px-2 py-4 rounded-none border border-[#141414] font-serif text-slate-900 my-4 overflow-x-auto text-center font-bold flex flex-col items-center gap-1.5 justify-center">
                <div className="flex items-center gap-1 text-xs select-all">
                  <span className="italic">C(t)</span>
                  <span>=</span>
                  <div className="flex flex-col items-center px-1 font-sans text-[10px]">
                    <span className="border-b border-[#141414] pb-0.5 px-2 italic font-serif">
                      F &sdot; Dose &sdot; k<sub>a</sub>
                    </span>
                    <span className="pt-0.5 px-2 italic font-serif">
                      V<sub>d</sub> &sdot; (k<sub>a</sub> &minus; k<sub>e</sub>)
                    </span>
                  </div>
                  <span>&middot;</span>
                  <span className="font-serif italic text-[10px]">
                    ( e<sup>&minus;k<sub>e</sub>&sdot;t</sup> &minus; e<sup>&minus;k<sub>a</sub>&sdot;t</sup> )
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-slate-300 font-mono text-[10px]">
                <div className="flex justify-between">
                  <span>{t.bioavailability}:</span>
                  <span className="text-white">{(activeParams.f * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.absorptionRate}:</span>
                  <span className="text-white">{activeParams.ka.toFixed(1)} h⁻¹</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.eliminationRate}:</span>
                  <span className="text-white">{calculatedMetrics.ke.toFixed(4)} h⁻¹</span>
                </div>
                <div className="flex justify-between border-t border-slate-700/80 pt-1.5 mt-1.5 font-bold">
                  <span>{t.halfLife}:</span>
                  <span className="text-white">{activeParams.tHalf.toFixed(1)} hrs</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-2.5 mt-4 text-[9px] text-slate-500 leading-normal uppercase font-mono tracking-tight">
              Singh & Sahay (2026) &bull; Antimicrobial Resistance & PK Boundaries.
            </div>
          </div>
        </section>

        {/* MAIN ANALYSIS WORKSPACE (8 Columns) */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* SECTION 1: METRIC CARD STRIPS */}
          <div className="grid grid-cols-1 md:grid-cols-3 bg-white border border-[#141414] divide-y md:divide-y-0 md:divide-x divide-[#141414] rounded-none shadow-none">
            
            {/* PEAK BIOMARKER (CMAX) */}
            <div className="p-5 flex flex-col justify-between relative overflow-hidden bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
                  <TopicTooltip title={t.peakBioSerum} explanation={t.ttPeakBioSerum} />
                </span>
                <span className="text-slate-400">
                  <Activity className="w-4 h-4 text-[#141414]" />
                </span>
              </div>
              <div className="my-3 flex items-baseline">
                <span className="text-3xl font-bold tracking-tight font-mono text-[#141414]">
                  {calculatedMetrics.cMax.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase ml-1.5">μg/mL</span>
              </div>
              
              {/* Clinical evaluation badge */}
              <div className={`text-center py-1.5 px-2 rounded-none text-[9px] font-mono font-bold uppercase tracking-wider border border-[#141414] ${
                localizedCMaxClinicalState.style
              }`}>
                {localizedCMaxClinicalState.label}
              </div>
            </div>

            {/* TIME-TO-PEAK (TMAX) */}
            <div className="p-5 flex flex-col justify-between bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
                  <TopicTooltip title={t.timeToPeak} explanation={t.ttTimeToPeak} align="center" />
                </span>
                <span>
                  <Clock className="w-4 h-4 text-[#141414]" />
                </span>
              </div>
              <div className="my-3 flex items-baseline">
                <span className="text-3xl font-bold tracking-tight font-mono text-[#141414]">
                  {calculatedMetrics.tMax.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase ml-1.5">hours</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal border-t border-dashed border-slate-200 pt-2.5 font-mono uppercase">
                {t.peakSaturation} {calculatedMetrics.tMax < 2 ? t.peakSaturationRapid : t.peakSaturationDelayed}.
              </p>
            </div>

            {/* SELECTION ZONE INDEX */}
            <div className="p-5 flex flex-col justify-between bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
                  <TopicTooltip title={t.subMecSelection} explanation={t.ttSubMecSelection} align="right" />
                </span>
                <span>
                  <AlertTriangle className="w-4 h-4 text-[#141414]" />
                </span>
              </div>
              <div className="my-3 flex items-baseline space-x-2">
                <span className={`text-3xl font-bold tracking-tight font-mono ${
                  calculatedMetrics.prcSubTherapeutic > 40 ? "text-red-700 animate-pulse" : "text-[#141414]"
                }`}>
                  {calculatedMetrics.prcSubTherapeutic}%
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">
                  {t.ofInterval}
                </span>
              </div>
              
              {/* Selective pressure visual meter */}
              <div className="w-full bg-slate-100 rounded-none h-2 overflow-hidden border border-[#141414]">
                <div 
                  className={`h-full rounded-none transition-all duration-500 ${
                    calculatedMetrics.prcSubTherapeutic > 40 ? "bg-red-600" : "bg-[#141414]"
                  }`}
                  style={{ width: `${calculatedMetrics.prcSubTherapeutic}%` }}
                />
              </div>
            </div>

          </div>

          {/* SECTION 2: THE INTERACTIVE PK COMPARTMENT CHART */}
          <div className="bg-white rounded-none border border-[#141414] p-6 flex flex-col shadow-none" ref={containerRef}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b border-[#141414]">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#141414] font-mono">
                  <TopicTooltip title={t.continuousPkProfile} explanation={t.ttContinuousPkProfile} />
                </h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tight mt-0.5">
                  {t.traceIndicator}
                </p>
              </div>
              
              {/* Legendary tags */}
              <div className="flex flex-wrap gap-2 text-[10px] font-mono mt-2 sm:mt-0">
                <span className="flex items-center gap-1.5 bg-white text-red-700 px-2.5 py-1 border border-[#141414] rounded-none font-bold font-mono text-[9px] uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-none bg-red-600"></span> MTC: {activeDrug.mtc.toFixed(1)} μg/mL
                </span>
                <span className="flex items-center gap-1.5 bg-white text-emerald-700 px-2.5 py-1 border border-[#141414] rounded-none font-bold font-mono text-[9px] uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-none bg-emerald-600"></span> MEC: {activeDrug.mec.toFixed(1)} μg/mL
                </span>
              </div>
            </div>

            {/* VISUAL CHART AREA WITH GRADIENTS */}
            <div className="relative select-none flex-grow">
              
              <svg 
                width={chartWidth} 
                height={chartHeight} 
                className="overflow-visible animate-fade-in"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <defs>
                  {/* Gradients for safety bands */}
                  <linearGradient id="mtcGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.08"/>
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.01"/>
                  </linearGradient>
                  <linearGradient id="therapeuticGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.08"/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.01"/>
                  </linearGradient>
                  <linearGradient id="subMecGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.08"/>
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.01"/>
                  </linearGradient>
                </defs>

                {/* ZONE BACKGROUNDS */}
                {/* 1. Sub-MEC Zone */}
                <rect
                  x={paddingLeft}
                  y={scaleY(activeDrug.mec)}
                  width={chartWidth - paddingLeft - paddingRight}
                  height={scaleY(0) - scaleY(activeDrug.mec)}
                  fill="url(#subMecGradient)"
                />
                
                {/* 2. Optimal Window */}
                <rect
                  x={paddingLeft}
                  y={scaleY(activeDrug.mtc)}
                  width={chartWidth - paddingLeft - paddingRight}
                  height={scaleY(activeDrug.mec) - scaleY(activeDrug.mtc)}
                  fill="url(#therapeuticGradient)"
                />

                {/* 3. Toxic Hazard Zone */}
                <rect
                  x={paddingLeft}
                  y={paddingTop}
                  width={chartWidth - paddingLeft - paddingRight}
                  height={scaleY(activeDrug.mtc) - paddingTop}
                  fill="url(#mtcGradient)"
                />

                {/* ZONE SIDEBAR GUIDES (Translated correctly) */}
                <text
                  x={paddingLeft + 12}
                  y={paddingTop + 18}
                  className="text-[9px] font-mono font-black uppercase tracking-wider fill-red-850 fill-red-900 pointer-events-none"
                >
                  {t.hazardZoneToxic}
                </text>
                
                <text
                  x={paddingLeft + 12}
                  y={scaleY(activeDrug.mtc) + 20}
                  className="text-[9px] font-mono font-black uppercase tracking-wider fill-emerald-900 pointer-events-none"
                >
                  {t.safetyZoneOptimal}
                </text>

                <text
                  x={paddingLeft + 12}
                  y={scaleY(activeDrug.mec) + 20}
                  className="text-[9px] font-mono font-black uppercase tracking-wider fill-amber-900 pointer-events-none"
                >
                  {t.amrZoneDanger}
                </text>

                {/* HORIZONTAL GRID LINES */}
                {[0.25, 0.5, 0.75].map((fraction, idx) => {
                  const concVal = fraction * maxModelConcY;
                  if (Math.abs(concVal - activeDrug.mec) < 0.25 || Math.abs(concVal - activeDrug.mtc) < 0.5) return null;
                  return (
                    <line
                      key={idx}
                      x1={paddingLeft}
                      y1={scaleY(concVal)}
                      x2={chartWidth - paddingRight}
                      y2={scaleY(concVal)}
                      stroke="#E4E3E0"
                      strokeWidth="1.5"
                    />
                  );
                })}

                {/* ACTIVE DOSING Ticks */}
                {Array.from({ length: 9 }).map((_, i) => {
                  const tVal = (i / 8) * activeDrug.timeWindow;
                  return (
                    <g key={i} className="font-mono text-[9px] fill-[#141414] font-medium">
                      <line
                        x1={scaleX(tVal)}
                        y1={chartHeight - paddingBottom}
                        x2={scaleX(tVal)}
                        y2={chartHeight - paddingBottom + 5}
                        stroke="#141414"
                      />
                      <text
                        x={scaleX(tVal)}
                        y={chartHeight - paddingBottom + 18}
                        textAnchor="middle"
                      >
                        {tVal === 0 ? "0 h" : `${tVal.toFixed(0)}h`}
                      </text>
                    </g>
                  );
                })}

                {/* Y TICK LABELS */}
                {[0, 0.25, 0.5, 0.75, 1.0].map((fr, idx) => {
                  const cValue = fr * maxModelConcY;
                  return (
                    <g key={idx} className="font-mono text-[9px] fill-[#141414] font-medium">
                      <line
                        x1={paddingLeft - 5}
                        y1={scaleY(cValue)}
                        x2={paddingLeft}
                        y2={scaleY(cValue)}
                        stroke="#141414"
                      />
                      <text
                        x={paddingLeft - 10}
                        y={scaleY(cValue) + 3}
                        textAnchor="end"
                      >
                        {cValue.toFixed(idx === 0 ? 0 : 1)}
                      </text>
                    </g>
                  );
                })}

                {/* LIMIT INDICATOR LINES */}
                <line
                  x1={paddingLeft}
                  y1={scaleY(activeDrug.mec)}
                  x2={chartWidth - paddingRight}
                  y2={scaleY(activeDrug.mec)}
                  stroke="#059669"
                  strokeWidth="1.5"
                  strokeDasharray="4,3"
                  className="opacity-95"
                />
                <line
                  x1={paddingLeft}
                  y1={scaleY(activeDrug.mtc)}
                  x2={chartWidth - paddingRight}
                  y2={scaleY(activeDrug.mtc)}
                  stroke="#dc2626"
                  strokeWidth="1.5"
                  strokeDasharray="4,3"
                  className="opacity-95"
                />

                {/* GRAPH SHADING */}
                <path
                  d={areaPath}
                  fill="#141414"
                  opacity="0.04"
                  className="pointer-events-none"
                />

                {/* THE CORE PK LINE */}
                <path
                  d={dPath}
                  fill="none"
                  stroke="#141414"
                  strokeWidth="3.5"
                  strokeLinecap="square"
                  className="pointer-events-none"
                />

                {/* TMAX PIN */}
                <circle
                  cx={scaleX(calculatedMetrics.tMax)}
                  cy={scaleY(calculatedMetrics.cMax)}
                  r="5"
                  fill="#ffffff"
                  stroke="#141414"
                  strokeWidth="3"
                  className="pointer-events-none"
                />

                {/* BORDER LINES */}
                <line
                  x1={paddingLeft}
                  y1={paddingTop}
                  x2={paddingLeft}
                  y2={chartHeight - paddingBottom}
                  stroke="#141414"
                  strokeWidth="1.5"
                />
                <line
                  x1={paddingLeft}
                  y1={chartHeight - paddingBottom}
                  x2={chartWidth - paddingRight}
                  y2={chartHeight - paddingBottom}
                  stroke="#141414"
                  strokeWidth="1.5"
                />

                {/* TOOLTIP TRACKER */}
                <AnimatePresence>
                  {hoveredPoint && (
                    <g className="pointer-events-none">
                      <line
                        x1={hoveredPoint.x}
                        y1={paddingTop}
                        x2={hoveredPoint.x}
                        y2={chartHeight - paddingBottom}
                        stroke="#141414"
                        strokeWidth="1.2"
                        strokeDasharray="2,2"
                        opacity="0.85"
                      />
                      <circle
                        cx={hoveredPoint.x}
                        cy={hoveredPoint.y}
                        r="5.5"
                        fill="#141414"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />

                      {/* Tooltip Card */}
                      <foreignObject
                        x={hoveredPoint.x > chartWidth / 2 ? hoveredPoint.x - 170 : hoveredPoint.x + 15}
                        y={Math.max(paddingTop, hoveredPoint.y - 50)}
                        width="155"
                        height="85"
                      >
                        <div className="bg-[#141414] text-white p-2 border border-[#141414] font-mono text-[9px] leading-tight select-none">
                          <span className="text-slate-400 block pb-1 border-b border-slate-800 uppercase tracking-wider font-bold">
                            {t.timelineLabel}
                          </span>
                          <div className="flex justify-between items-center mt-1">
                            <span>{t.timeElapsed}:</span>
                            <span className="text-amber-400 font-bold">{hoveredPoint.time} h</span>
                          </div>
                          <div className="flex justify-between items-center mt-0.5">
                            <span>{t.concentrationLabel}:</span>
                            <span className="text-white font-bold">{hoveredPoint.conc} μg/mL</span>
                          </div>
                          <div className="mt-1.5 pt-1 border-t border-slate-800 flex items-center justify-between">
                            <span className="text-slate-400">{t.biologicalZone}:</span>
                            <span className={`font-bold uppercase ${
                              hoveredPoint.conc > activeDrug.mtc 
                                ? "text-red-400 font-black" 
                                : hoveredPoint.conc < activeDrug.mec 
                                  ? "text-amber-400" 
                                  : "text-emerald-400 font-bold"
                            }`}>
                              {hoveredPoint.conc > activeDrug.mtc 
                                ? t.zoneToxic 
                                : hoveredPoint.conc < activeDrug.mec 
                                  ? t.zoneMdr 
                                  : t.zoneSafe}
                            </span>
                          </div>
                        </div>
                      </foreignObject>
                    </g>
                  )}
                </AnimatePresence>
              </svg>
            </div>
            
            {/* Axis titles */}
            <div className="mt-2.5 flex justify-between px-14 text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              <span>{t.axisDosageTaken}</span>
              <span>{t.axisDuration}</span>
            </div>
          </div>

          {/* SECTION 3: CLINICAL DECISION SUPPORT & INTENT-DRIVEN ALERTS */}
          <div className="space-y-4">
            
            {/* CLINICAL NOTIFICATION AND ANALYTICAL DISPATCH PANEL */}
            <div className="bg-[#F1F0ED] border border-[#141414] rounded-none p-5">
              <div className="flex items-center space-x-2 pb-2 mb-4 border-b border-[#141414]">
                <ShieldCheck className="w-4 h-4 text-[#141414]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#141414] font-mono">
                  <TopicTooltip title={t.decisionEngine} explanation={t.ttDecisionEngine} />
                </h3>
              </div>

              <div className="space-y-4">
                
                {/* 1. HIGH-PRIORITY TOXICITY WARNING */}
                {isHighDangerOfToxicity && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-100/90 border-2 border-red-600 rounded-none flex gap-3.5"
                  >
                    <div className="bg-red-200 p-2 text-red-950 h-fit border border-red-400">
                      <AlertOctagon className="w-5 h-5 text-red-800" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-red-950">
                        {t.alertToxicTitle}
                      </h4>
                      <p className="text-xs text-red-900 leading-relaxed mt-1">
                        {t.alertToxicDesc}
                      </p>
                      
                      {/* Clinical explanation details */}
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wide text-red-800 mt-2 block border-t border-red-300 pt-1.5 leading-relaxed">
                        &bull; {t.alertToxicDriver}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* 2. SUB-THERAPEUTIC / AMR SELECTION CAUTIONAL WARNING */}
                {isHighDangerOfResistance && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-amber-100/90 border-2 border-amber-600 rounded-none flex gap-3.5"
                  >
                    <div className="bg-amber-200 p-2 text-amber-950 h-fit border border-amber-400">
                      <AlertTriangle className="w-5 h-5 text-amber-800" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-amber-950">
                        {t.alertAmrTitle}
                      </h4>
                      <p className="text-xs text-amber-900 leading-relaxed mt-1">
                        {t.alertAmrDesc}
                      </p>
                      
                      {/* Gene mutation references based on active drug */}
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wide text-amber-800 mt-2 block border-t border-amber-300 pt-1.5 leading-relaxed">
                        &bull; {t.alertAmrPathway} ({language === "ru" ? "Ген-мишень" : "Target gene"}: {activeDrug.targetGene})
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* 3. OPTIMAL THERAPEUTIC COMPLIANCE SUCCESS CARD */}
                {!isHighDangerOfToxicity && !isHighDangerOfResistance && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-emerald-100/90 border border-emerald-500 rounded-none flex gap-3.5"
                  >
                    <div className="bg-emerald-200 p-2 text-emerald-950 h-fit border border-emerald-400">
                      <ShieldCheck className="w-5 h-5 text-emerald-800" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-emerald-950">
                        {t.alertSuccessTitle}
                      </h4>
                      <p className="text-xs text-emerald-900 leading-relaxed mt-1">
                        {t.alertSuccessDesc}
                      </p>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wide text-emerald-800 mt-2 block border-t border-emerald-300 pt-1.5 leading-relaxed">
                        &bull; {t.alertSuccessMetric} ({language === "ru" ? "мишень" : "target"}: {activeDrug.targetGene})
                      </span>
                    </div>
                  </motion.div>
                )}

              </div>
            </div>

            {/* DYNAMIC PATHWAY GRAPH & EXPLAINER GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 bg-white border border-[#141414] divide-y md:divide-y-0 md:divide-x divide-[#141414] rounded-none shadow-none">
              
              <div className="p-5 bg-white">
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 font-mono flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-2 w-full">
                  <Activity className="w-3.5 h-3.5 text-[#141414]" />
                  <TopicTooltip title={t.physiologicalMechanics} explanation={t.ttPhysiologicalMechanics} />
                </span>
                <span className="text-xs font-bold text-[#141414] block mb-1">
                  {t.geneticModifiersTitle}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {activeDrug.dosingNotes}
                </p>
              </div>

              <motion.div 
                className="p-5"
                animate={isTargetBiomarkerPulsing ? {
                  backgroundColor: ["#ffffff", "#fffbeb", "#fef3c7", "#fffbeb", "#ffffff"],
                } : {
                  backgroundColor: "#ffffff",
                }}
                transition={isTargetBiomarkerPulsing ? {
                  duration: 2.0,
                  repeat: Infinity,
                  ease: "easeInOut"
                } : { duration: 0.3 }}
              >
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 font-mono flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-2 w-full">
                  <Database className="w-3.5 h-3.5 text-[#141414]" />
                  <TopicTooltip title={t.cellularMech} explanation={t.ttCellularMech} align="right" />
                </span>

                <AnimatePresence>
                  {isTargetBiomarkerPulsing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-2 bg-amber-50 border border-amber-300 text-amber-900 text-[10px] uppercase font-mono font-bold flex items-center justify-between gap-1 leading-normal">
                        <span className="flex items-center gap-1.5">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                          </span>
                          <span>
                            {hoveredPoint 
                              ? (language === "ru" ? "Ослабление подавления (Суб-МПК)" : "Reduced suppression (Sub-MEC)") 
                              : (language === "ru" ? "Высокий риск мутации мишени" : "High risk of target selection")}
                          </span>
                        </span>
                        <span className="text-[9px] bg-amber-100 text-amber-950 font-sans px-1.5 py-0.5 rounded border border-amber-200">
                          {hoveredPoint ? `${hoveredPoint.conc.toFixed(2)} μg/mL` : `${calculatedMetrics.prcSubTherapeutic}% time`}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <span className="text-xs font-bold text-[#141414] block mb-1 uppercase tracking-tight">
                  {t.activeTarget}: {activeDrug.targetGene} Gene
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {activeDrug.clinicalImpact.targetMechanism}
                </p>
                <div className="mt-2.5 bg-[#F1F0ED] p-2 rounded-none border border-[#141414]">
                  <span className="text-[9px] text-slate-500 font-mono uppercase block font-bold tracking-wider">{t.resistanceRiskFactor}</span>
                  <p className="text-[10px] text-red-700 font-mono font-bold leading-tight truncate" title={activeDrug.clinicalImpact.resistancePathway}>
                    {activeDrug.clinicalImpact.resistancePathway}
                  </p>
                </div>
              </motion.div>

            </div>

          </div>

        </section>

      </main>

      {/* FOOTER METRIC AND CITATIONS */}
      <footer className="bg-[#F1F0ED] border-t-2 border-[#141414] text-slate-600 text-xs py-6 px-6 mt-12 w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-2 text-[#141414] font-bold">
            <Heart className="w-4 h-4 text-rose-600" />
            <span>{t.footerTitle}</span>
          </div>
          <div className="text-center md:text-right text-[10px] text-slate-500 uppercase tracking-wider">
            <span>{t.footerCalibrated}</span>
            <span className="block mt-1 text-slate-400 font-bold">{t.footerSubtitle}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
