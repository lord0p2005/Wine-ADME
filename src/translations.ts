// Multi-language translation dictionaries for the TB PK/PD Therapy Simulator

export interface LocalizedDrugProfile {
  name: string;
  fullName: string;
  mechanism: string;
  dosingNotes: string;
  description: string;
  targetProtein: string;
  clinicalImpact: {
    targetMechanism: string;
    resistancePathway: string;
    toxicityRisk: string;
  };
}

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  analysisTimeline: string;
  analysisTimelineStandard: string;
  analysisTimelineExtended: string;
  cofactorEnzyme: string;
  regimenSimulationMatrix: string;
  selectAgent: string;
  targetDrugBioProfile: string;
  targetGene: string;
  mechanismLabel: string;
  patientMass: string;
  adultNorm: string;
  targetRegimenDosage: string;
  absoluteDose: string;
  hostGenetics: string;
  adminProtocol: string;
  fastingOption: string;
  postprandialOption: string;
  pharmaModel: string;
  oneCompartmentDesc: string;
  pharmacologicalModelDesc: string;
  bioavailability: string;
  absorptionRate: string;
  eliminationRate: string;
  halfLife: string;
  peakBioSerum: string;
  timeToPeak: string;
  subMecSelection: string;
  ofInterval: string;
  peakSaturation: string;
  peakSaturationRapid: string;
  peakSaturationDelayed: string;
  clinicalStateToxic: string;
  clinicalStateSub: string;
  clinicalStateOptimal: string;
  continuousPkProfile: string;
  traceIndicator: string;
  hazardZoneToxic: string;
  safetyZoneOptimal: string;
  amrZoneDanger: string;
  timelineLabel: string;
  timeElapsed: string;
  concentrationLabel: string;
  biologicalZone: string;
  zoneToxic: string;
  zoneMdr: string;
  zoneSafe: string;
  axisDosageTaken: string;
  axisDuration: string;
  decisionEngine: string;
  alertToxicTitle: string;
  alertToxicDesc: string;
  alertToxicDriver: string;
  alertAmrTitle: string;
  alertAmrDesc: string;
  alertAmrPathway: string;
  alertSuccessTitle: string;
  alertSuccessDesc: string;
  alertSuccessMetric: string;
  physiologicalMechanics: string;
  geneticModifiersTitle: string;
  cellularMech: string;
  activeTarget: string;
  resistanceRiskFactor: string;
  footerTitle: string;
  footerCalibrated: string;
  footerSubtitle: string;
  
  // Welcome page keys
  welcomeTitle: string;
  welcomeSub: string;
  welcomeIntro: string;
  welcomeCardDosingTitle: string;
  welcomeCardDosingDesc: string;
  welcomeCardGeneticsTitle: string;
  welcomeCardGeneticsDesc: string;
  welcomeCardFoodTitle: string;
  welcomeCardFoodDesc: string;
  welcomeCardAmrTitle: string;
  welcomeCardAmrDesc: string;
  welcomeEnterBtn: string;
  welcomeLoadingBtn: string;
  welcomeGuideTitle: string;
  welcomeStep1: string;
  welcomeStep2: string;
  welcomeStep3: string;
  welcomeDisclaimer: string;
  easyUiPrompt: string;
  equationHeader: string;
  equationLatexTitle: string;
  // Tooltips keys
  ttRegimenSimulation: string;
  ttDrugBioProfile: string;
  ttPatientMass: string;
  ttTargetRegimenDosage: string;
  ttHostGenetics: string;
  ttPharmaModel: string;
  ttPeakBioSerum: string;
  ttTimeToPeak: string;
  ttSubMecSelection: string;
  ttContinuousPkProfile: string;
  ttDecisionEngine: string;
  ttPhysiologicalMechanics: string;
  ttCellularMech: string;
}

export const TRANSLATIONS: Record<"en" | "ru", TranslationDictionary> = {
  en: {
    appName: "TB PK/PD Therapy Simulator",
    appSubtitle: "Clinical Decision Support System (CDSS) & Research Standard (Singh & Sahay, 2026)",
    analysisTimeline: "ANALYSIS TIMELINE",
    analysisTimelineStandard: "24 h Standard",
    analysisTimelineExtended: "96 h Extended",
    cofactorEnzyme: "CO-FACTOR ENZYME",
    regimenSimulationMatrix: "Regimen Simulation Matrix",
    selectAgent: "Select Active Mycobactericidal Agent",
    targetDrugBioProfile: "Target Drug Bio-Profile",
    targetGene: "Target Gene",
    mechanismLabel: "Mechanism",
    patientMass: "Patient Mass (Weight)",
    adultNorm: "Adult Norm",
    targetRegimenDosage: "Target Regimen Dosage",
    absoluteDose: "Absolute Administered Dose",
    hostGenetics: "Host Genetic Phenotype (NAT2 Variant)",
    adminProtocol: "Administration Protocol (Food Interactions)",
    fastingOption: "Fasting Conditions (Pre-Prandial)",
    postprandialOption: "Postprandial (Fed / High-Fat Meal)",
    pharmaModel: "Pharmacological Model",
    oneCompartmentDesc: "One-Compartment Model with First-Order Absorption and Elimination",
    pharmacologicalModelDesc: "Represents oral dosing dynamics. Relates continuous serum concentration over time using biological rates:",
    bioavailability: "BIOAVAILABILITY (F)",
    absorptionRate: "ABSORPTION RATE (k_a)",
    eliminationRate: "ELIMINATION RATE (k_e)",
    halfLife: "BIOLOGICAL HALF-LIFE (t½)",
    peakBioSerum: "Peak Bio-Serum (Cmax)",
    timeToPeak: "Time-to-Peak (Tmax)",
    subMecSelection: "Sub-MEC Selection Window",
    ofInterval: "of interval",
    peakSaturation: "Peak saturation:",
    peakSaturationRapid: "Rapid oral kinetics",
    peakSaturationDelayed: "Delayed oral kinetics",
    clinicalStateToxic: "Toxic Range",
    clinicalStateSub: "Sub-therapeutic",
    clinicalStateOptimal: "Optimal Therapeutic",
    continuousPkProfile: "Continuous Pharmacokinetic Concentration Profile",
    traceIndicator: "Trace indicator: Serum Concentration over time (One-Compartment Model)",
    hazardZoneToxic: "Hepatotoxicity / Cardiotoxicity Hazard Zone",
    safetyZoneOptimal: "Optimal Sterile Clearance Window",
    amrZoneDanger: "AMR Selection Trough / Resistance Mutation Factory (rpoB / katG / atpE)",
    timelineLabel: "Simulated Timeline",
    timeElapsed: "Time elapsed",
    concentrationLabel: "Concentration",
    biologicalZone: "Biological zone",
    zoneToxic: "Toxic",
    zoneMdr: "MDR Select",
    zoneSafe: "Safe",
    axisDosageTaken: "Oral Dosage Taken (Hour 0)",
    axisDuration: "Observed Elimination Track Duration (Hours)",
    decisionEngine: "Therapeutic Decision Support Engine",
    alertToxicTitle: "CRITICAL ALERT: Toxic Exposure Pattern Identified",
    alertToxicDesc: "CRITICAL ALERT: Target concentrations enter the toxic zone. High risk of drug-induced liver injury (DILI) or prolonged QTc intervals. Adjust dosing matrix down.",
    alertToxicDriver: "Biological Driver: Peak concentrations exceeding the MTC limit trigger direct tissue toxicity, metabolic overload, or hERG cardiac channel block.",
    alertAmrTitle: "AMR DANGER ALERT: Protracted Sub-Therapeutic Exposure",
    alertAmrDesc: "WARNING: Protracted sub-therapeutic exposure profile detected. High selective pressure for low-frequency variant selection.",
    alertAmrPathway: "Mutation Pathway: Low-dosage selective pressure accelerates target gene mutations, increasing the fixation probability of resistant strains.",
    alertSuccessTitle: "Therapeutic Goal Reached (Safe Clinical Corridor)",
    alertSuccessDesc: "THERAPEUTIC COMPLIANCE ASSURED: Safe target containment achieved. Maximizes sterile bacterial clearance while suppressing mutational fixation pathways.",
    alertSuccessMetric: "Success Metric: Peak serum level safely within optimal bactericidal bounds. Sub-MEC selective pressure limited for target gene.",
    physiologicalMechanics: "Physiological Mechanics",
    geneticModifiersTitle: "Genetic Modifiers & Clinical Bounds",
    cellularMech: "Cellular Mechanism of Action",
    activeTarget: "Active Drug Target",
    resistanceRiskFactor: "Resistance Risk Factor",
    footerTitle: "Interactive PK/PD Anti-TB Model (One-Compartment Absorption Kinetics)",
    footerCalibrated: "Model parameters calibrated under clinical supervision (Singh & Sahay, 2026).",
    footerSubtitle: "Clinical Decision Support Tool • Sandbox v2.4",
    
    // Welcome Page Localizations
    welcomeTitle: "TB PK/PD Therapy Simulator",
    welcomeSub: "Clinical Simulation & Decision Support Tool",
    welcomeIntro: "Welcome to the interactive Tuberculosis Pharmacokinetics (PK) and Pharmacodynamics (PD) simulation dashboard. This portal models oral drug kinetics to help optimize treatment regimens, visualize blood plasma concentration levels, and prevent antimicrobial resistance.",
    welcomeCardDosingTitle: "💊 Patient Weight Optimizer",
    welcomeCardDosingDesc: "Calculate custom absolute dose adjustments dynamically based on body weight to ensure therapeutic drug coverage.",
    welcomeCardGeneticsTitle: "🧬 Genetics-Driven Clearance",
    welcomeCardGeneticsDesc: "Simulate genetic polymorphisms such as NAT2 fast/slow acetylation to prevent severe liver toxicity.",
    welcomeCardFoodTitle: "🍔 Food & Meal Effects",
    welcomeCardFoodDesc: "Visualize how meals alter absorption rate constants, gastric transit times, and bioavailable drug fractions.",
    welcomeCardAmrTitle: "🛑 Avoid Drug Resistance",
    welcomeCardAmrDesc: "Track time spent in the sub-MEC Mutant Selection Window (MSW) to prevent multi-drug resistant mutation selection.",
    welcomeEnterBtn: "Enter Simulation Dashboard",
    welcomeLoadingBtn: "Calibrating Mathematical Engine...",
    welcomeGuideTitle: "📋 Steps to run a clinical simulation:",
    welcomeStep1: "1. Select a drug profile (Isoniazid, Rifampicin, or Bedaquiline) to load its specific biological parameters.",
    welcomeStep2: "2. Adjust patient weight and target dosing ranges using the slider controls.",
    welcomeStep3: "3. Configure host genetic phenotypes and food administration states to analyze dynamic PK/PD results in real-time.",
    welcomeDisclaimer: "Disclaimer: This is a simulated training tool calibrated for instructional purposes. Always consult professional medical guidelines for clinical therapy decisions.",
    easyUiPrompt: "Easy Interactive UI Mode Active",
    equationHeader: "Mathematical Foundations & LaTeX Reference",
    equationLatexTitle: "Raw LaTeX Equation Representation",
    ttRegimenSimulation: "Configure the active drug, dosing level (mg/kg), and patient's biological markers here.",
    ttDrugBioProfile: "The biological characteristics, targets, and metabolic clearance of the selected antimicrobial agent.",
    ttPatientMass: "Determines the clinical Volume of Distribution (Vd). Higher body weights dilute peak serum concentrations.",
    ttTargetRegimenDosage: "Target dosage scale relative to weight. Determines total mass of active drug substance administered.",
    ttHostGenetics: "Hosts differ in metabolic speed. Fast metabolizers clear drugs quickly, slow metabolizers risk systemic toxicities.",
    ttPharmaModel: "Mathematical framework correlating time and serum concentrations based on biological velocities.",
    ttPeakBioSerum: "The absolute peak drug concentration reached in blood plasma (Cmax). Exceeding MTC causes toxic events.",
    ttTimeToPeak: "The physical time duration required to reach maximum peak serum concentration inside the bloodstream.",
    ttSubMecSelection: "Percentage of time where drug levels fall below MEC but stay high enough to select for resistant mutated strains.",
    ttContinuousPkProfile: "Dynamic visual chart projecting serum concentrations against safety (MTC) and resistance selection (MEC) zones.",
    ttDecisionEngine: "Kinetics diagnostic auditing dosing hazards and sterile clearance success in real time.",
    ttPhysiologicalMechanics: "Clinical notes detailing metabolic genetics, enzyme interactions, and clinical clearance limitations.",
    ttCellularMech: "Biochemical target mechanisms explaining how the antibiotic halts transcription, walls, or ATP energy pathways."
  },
  ru: {
    appName: "Симулятор ТК/ТД противотуберкулезной терапии",
    appSubtitle: "Система поддержки принятия клинических решений (СППКР) и исследовательский стандарт (Singh & Sahay, 2026)",
    analysisTimeline: "ВРЕМЕННАЯ ШКАЛА АНАЛИЗА",
    analysisTimelineStandard: "24 ч Стандарт",
    analysisTimelineExtended: "96 ч Расширенная",
    cofactorEnzyme: "ФЕРМЕНТ-КОФАКТОР",
    regimenSimulationMatrix: "Матрица симуляции режима",
    selectAgent: "Выберите активный микобактерицидный препарат",
    targetDrugBioProfile: "Биологический профиль препарата",
    targetGene: "Целевой ген",
    mechanismLabel: "Механизм действия",
    patientMass: "Масса тела пациента (Вес)",
    adultNorm: "норма для взрослых",
    targetRegimenDosage: "Целевая дозировка режима",
    absoluteDose: "Абсолютная вводимая доза",
    hostGenetics: "Генетический фенотип хозяина (вариант NAT2)",
    adminProtocol: "Протокол введения препарата (взаимодействие с пищей)",
    fastingOption: "Введение натощак (до еды)",
    postprandialOption: "После еды (жирная пища)",
    pharmaModel: "Фармакологическая модель",
    oneCompartmentDesc: "Однокамерная модель с абсорбцией и элиминацией первого порядка",
    pharmacologicalModelDesc: "Представляет динамику перорального приема. Связывает непрерывную сывороточную концентрацию во времени с помощью биологических показателей:",
    bioavailability: "БИОДОСТУПНОСТЬ (F)",
    absorptionRate: "СКОРОСТЬ АБСОРБЦИИ (k_a)",
    eliminationRate: "СКОРОСТЬ ЭЛИМИНАЦИИ (k_e)",
    halfLife: "ПЕРИОД ПОЛУВЫВЕДЕНИЯ (t½)",
    peakBioSerum: "Максимальная концентрация (Cmax)",
    timeToPeak: "Время достижения пика (Tmax)",
    subMecSelection: "Селективное окно (ниже МПК)",
    ofInterval: "от интервала",
    peakSaturation: "Пиковое насыщение:",
    peakSaturationRapid: "Быстрая пероральная кинетика",
    peakSaturationDelayed: "Замедленная пероральная кинетика",
    clinicalStateToxic: "Токсический диапазон",
    clinicalStateSub: "Субтерапевтический уровень",
    clinicalStateOptimal: "Оптимальный терапевтический",
    continuousPkProfile: "Непрерывный профиль ТК-концентрации препарата",
    traceIndicator: "График: сывороточная концентрация во времени (однокамерная модель)",
    hazardZoneToxic: "Зона риска гепатотоксичности / кардиотоксичности",
    safetyZoneOptimal: "Оптимальное терапевтическое окно",
    amrZoneDanger: "Окно селекции ЛУ / Фабрика устойчивых мутаций (rpoB / katG / atpE)",
    timelineLabel: "Симулируемая шкала времени",
    timeElapsed: "Прошедшее время",
    concentrationLabel: "Концентрация",
    biologicalZone: "Биологическая зона",
    zoneToxic: "Токсичная",
    zoneMdr: "Селекция ЛУ",
    zoneSafe: "Безопасная",
    axisDosageTaken: "Пероральный прием препарата (0 часов)",
    axisDuration: "Наблюдаемая длительность элиминации (часов)",
    decisionEngine: "СППКР: Терапевтические решения и аудит",
    alertToxicTitle: "КРИТИЧЕСКАЯ УГРОЗА: Выявлен паттерн токсической передозировки",
    alertToxicDesc: "Концентрация препарата вошла в опасную токсическую зону. Высокий риск лекарственного поражения печени (DILI) или критического удлинения интервала QTc.",
    alertToxicDriver: "Биологический триггер: Превышение порога MTC вызывает прямое повреждение клеток печени, метаболическую перегрузку или блокаду калиевых каналов сердца hERG.",
    alertAmrTitle: "ОПАСНОСТЬ ЛУ: Затяжная субтерапевтическая концентрация",
    alertAmrDesc: "Обнаружен затяжной субтерапевтический профиль. Бактерии находятся в зоне мутационного окна, стимулируя выработку лекарственной устойчивости к туберкулезу.",
    alertAmrPathway: "Мутационный путь: Длительное нахождение ниже порога MEC ускоряет отбор мутировавших штаммов и закрепление лекарственной устойчивости микобактерий.",
    alertSuccessTitle: "Терапевтический успех (Безопасный коридор)",
    alertSuccessDesc: "БЕЗОПАСНАЯ КОНЦЕНТРАЦИЯ ДОСТИГНУТА: Препарат находится в оптимальном терапевтическом окне. Максимизирует санацию при минимальном риске мутаций.",
    alertSuccessMetric: "Показатель успеха: Пиковый уровень находится в безопасных пределах санации. Селективное мутационное давление сведено к минимуму.",
    physiologicalMechanics: "Физиологические механизмы",
    geneticModifiersTitle: "Генетические модификаторы и клинические границы",
    cellularMech: "Клеточный механизм действия",
    activeTarget: "Активная мишень микобактерии",
    resistanceRiskFactor: "Фактор риска устойчивости",
    footerTitle: "Интерактивная модель ТК/ТД против туберкулеза (однокамерная абсорбция)",
    footerCalibrated: "Параметры модели откалиброваны под клиническим руководством (Singh & Sahay, 2026).",
    footerSubtitle: "Инструмент клинической поддержки принятия решений • Сендбокс v2.4",
    
    // Welcome Page Localizations (Russian)
    welcomeTitle: "Симулятор ТК/ТД противотуберкулезной терапии",
    welcomeSub: "Интерактивный портал клинического моделирования",
    welcomeIntro: "Добро пожаловать в интерактивный симулятор фармакокинетики (ФК) и фармакодинамики (ФД) противотуберкулезных препаратов. Этот веб-интерфейс моделирует биологические кривые лекарств в крови для оптимизации дозирования, предотвращения устойчивости (мутаций ЛУ-ТБ) и персонализации лечения.",
    welcomeCardDosingTitle: "💊 Подбор под вес пациента",
    welcomeCardDosingDesc: "Динамически рассчитывает абсолютную дозировку в мг в зависимости от массы тела для достижения идеальной терапевтической мишени.",
    welcomeCardGeneticsTitle: "🧬 Генетический клиренс",
    welcomeCardGeneticsDesc: "Моделирует генетический полиморфизм фермента NAT2 (быстрый/медленный ацетилятор) во избежание гепатотоксичности.",
    welcomeCardFoodTitle: "🍔 Взаимодействие с пищей",
    welcomeCardFoodDesc: "Наглядно визуализирует влияние приема пищи и липидов на скорость всасывания и биодоступность активных молекул.",
    welcomeCardAmrTitle: "🛑 Предотвращение устойчивости",
    welcomeCardAmrDesc: "Определяет долю времени, проведенную в опасной селективной зоне мутаций ниже порога MEC, предотвращая появление супербактерий.",
    welcomeEnterBtn: "Запустить интерактивную симуляцию",
    welcomeLoadingBtn: "Калибровка математического движка...",
    welcomeGuideTitle: "📋 Как запустить клиническую симуляцию:",
    welcomeStep1: "1. Выберите препарат (Изониазид, Рифампицин или Бедаквилин) для загрузки специфических биологических констант.",
    welcomeStep2: "2. Настройте вес пациента и целевую дозировку в мг/кг с помощью простых интерактивных интефейсов.",
    welcomeStep3: "3. Выберите сопутствующие факторы (генетику NAT2 или условия приема пищи) и мгновенно оцените ТК/ТД кривую на графике.",
    welcomeDisclaimer: "Внимание: Это симуляционный обучающий инструмент, откалиброванный на базе научных исследований. При назначении реальной терапии всегда руководствуйтесь официальными медицинскими протоколами.",
    easyUiPrompt: "Активен упрощенный интерфейс",
    equationHeader: "Математические основы симуляции & Ссылка LaTeX",
    equationLatexTitle: "Исходная формула на LaTeX",
    ttRegimenSimulation: "Панель настройки активного препарата, дозы в мг/кг и биологических факторов пациента.",
    ttDrugBioProfile: "Биологические свойства, молекулярные мишени и пути метаболического выведения выбранного антибиотика.",
    ttPatientMass: "Определяет клинический объем распределения (Vd). Высокий вес пациента сильнее разбавляет пик концентрации.",
    ttTargetRegimenDosage: "Подбираемая клиническая доза относительно веса тела. Обусловливает полную массу вводимого вещества.",
    ttHostGenetics: "Люди различаются биологической скоростью выведения. Быстрые выводят лекарство слишком рано, медленные — рискуют токсичностью.",
    ttPharmaModel: "Математические алгоритмы, рассчитывающие кинетику абсорбции и элиминации лекарства в организме.",
    ttPeakBioSerum: "Пиковая сывороточная концентрация антибиотика (Cmax). Превышение порога MTC вызывает повреждение тканей.",
    ttTimeToPeak: "Время, необходимое для достижения пиковой концентрации препарата в системном кровотоке после перорального приема.",
    ttSubMecSelection: "Процент времени, когда уровень препарата ниже MEC, но достаточен для закрепления опасных устойчивых мутаций бактерий.",
    ttContinuousPkProfile: "График плазменных концентраций во времени сопоставленный с линиями токсичности (MTC) и терапевтического минимума (MEC).",
    ttDecisionEngine: "Интеллектуальная оценка безопасности дозирования и эффективности подавления бактерий в реальном времени.",
    ttPhysiologicalMechanics: "Клинические примечания по влиянию генетических полиморфизмов на расщепление и концентрационные пики лекарств.",
    ttCellularMech: "Биохимическая мишень антибиотика, детально развертывающая механизм гибели Mycobacterium Tuberculosis."
  }
};

export const LOCALIZED_DRUGS: Record<"en" | "ru", Record<string, LocalizedDrugProfile>> = {
  en: {
    INH: {
      name: "Isoniazid",
      fullName: "Isoniazid (INH)",
      mechanism: "Mycolic acid cell wall synthesis inhibitor",
      dosingNotes: "Primary first-line therapy. Primarily metabolized in the liver via N-acetyltransferase 2 (NAT2). Slow acetylators face highly elevated direct hepatotoxic risk, whereas fast acetylators eliminate the drug rapidly, leading to prolonged sub-therapeutic coverage.",
      description: "Highly bactericidal drug that targets Mycobacterium tuberculosis enoyl-ACP reductase (InhA), stalling mycolic acid assembly and disrupting cell wall integrity.",
      targetProtein: "NADH-dependent enoyl-ACP reductase",
      clinicalImpact: {
        targetMechanism: "Blocks NADH-dependent enoyl-ACP reductase (InhA), arresting fatty acid elongation needed for mycolic class cellular protective walls.",
        resistancePathway: "Mutations in the inhA promoter or coding region, as well as loss-of-function catalase-peroxidase (katG) mutations which prevent INH prodrug activation.",
        toxicityRisk: "Drug-induced liver injury (DILI) through relative accumulation of reactive hydrazine metabolites, and peripheral neuropathy due to pyridoxine (Vitamin B6) depletion."
      }
    },
    RIF: {
      name: "Rifampicin",
      fullName: "Rifampicin (RIF)",
      mechanism: "Bacterial transcription transcription stopper",
      dosingNotes: "Sterilizing core agent. Oral absorption is heavily delayed and reduced by co-administration with high-fat meals due to delayed gastric emptying, resulting in sub-therapeutic peak concentrations and rapid acceleration of rpoB-based mutations.",
      description: "Crucial first-line antibiotic that binds directly to the beta-subunit of Mycobacterial RNA polymerase, physically blocking the elongation of nascent messenger RNA.",
      targetProtein: "DNA-dependent RNA polymerase beta subunit",
      clinicalImpact: {
        targetMechanism: "Sterically blocks transcription by binding adjacent to the active center of DNA-dependent RNA polymerase (rpoB beta subunit).",
        resistancePathway: "Single-nucleotide missense substitutions inside the 81-basepair cluster region (RRDR) of the rpoB gene, which prevent RIF binding.",
        toxicityRisk: "Cholestatic jaundice, potent hepatocyte cytochrome induction (CYP3A4) resulting in severe drug-drug interactions, and systemic immunological flu-like syndrome."
      }
    },
    BDQ: {
      name: "Bedaquiline",
      fullName: "Bedaquiline (BDQ)",
      mechanism: "Mycobacterial oxidative phosphorylation disruptor",
      dosingNotes: "Secondary diarylquinoline agent labeled for multidrug-resistant cases. Oral bioavailability doubles when taken postprandially paired with lipids. Trough/sustained levels above 3.5 ug/mL trigger hERG potassium channel blocking, inducing cardiotoxicity and severe QTc prolongation.",
      description: "Highly specific diarylquinoline target agent that binds directly to ATP synthase rotor mechanics, inducing instantaneous chemical starvation of mycobacteria.",
      targetProtein: "ATP synthase subunit c (c-ring rotor)",
      clinicalImpact: {
        targetMechanism: "Binds the proteolipid subunit c rotor of F0 ATP synthase (atpE), uncoupling proton transport and exhausting cellular energy reserves.",
        resistancePathway: "Mutations inside the atpE structural target gene or up-regulation of the MmpS5/MmpL5 efflux pump via Rv0678 transcriptional repressor loss-of-function.",
        toxicityRisk: "Inhibition of myocardial hERG potassium channels causing clinical QTc interval lengthening, severe ventricular tachyarrhythmias (Torsades de Pointes), and risk of sudden cardiac arrest."
      }
    }
  },
  ru: {
    INH: {
      name: "Изониазид",
      fullName: "Изониазид (INH)",
      mechanism: "Ингибитор синтеза миколовых кислот клеточной стенки",
      dosingNotes: "Основной препарат первого ряда. В основном метаболизируется в печени ферментом N-ацетилтрансферазой-2 (NAT2). Медленные ацетиляторы имеют крайне высокий риск гепатотоксичности, тогда как быстрые ацетиляторы выводят препарат мгновенно, что ведет к затяжному неэффективному лечению.",
      description: "Высокоактивный бактерицидный препарат мишени InhA (еноил-АПБ-редуктаза), блокирующий синтез миколовых кислот и разрушающий клеточную герметичность микобактерий.",
      targetProtein: "NADH-зависимая еноил-АПБ-редуктаза",
      clinicalImpact: {
        targetMechanism: "Блокирует субъединицу InhA, останавливая элонгацию жирных кислот, необходимых для жизнедеятельности и бронирования микобактерий.",
        resistancePathway: "Мутации промотора или кодирующей части inhA, а также инактивирующие мутации каталазы-пероксидазы (katG), нарушающие превращение пролекарства в активную форму.",
        toxicityRisk: "Токсическое поражение печени реактивными гидразиновыми метаболитами и периферическая нейропатия вследствие истощения запасов витамина B6."
      }
    },
    RIF: {
      name: "Рифампицин",
      fullName: "Рифампицин (RIF)",
      mechanism: "Ингибитор транскрипции бактериальной РНК",
      dosingNotes: "Стерилизующий ключевой агент. Всасывание сильно замедляется и снижается при совместном приеме с жирной пищей из-за задержки опорожнения желудка, что ведет к падению экспозиции в крови и селекции мутантных штаммов rpoB.",
      description: "Важнейший антибиотик первого ряда, связывающийся с бета-субъединицей РНК-полимеразы бактерий и физически блокирующий элонгацию нити информационной РНК.",
      targetProtein: "DNA-зависимая РНК-полимераза (бета-субъединица)",
      clinicalImpact: {
        targetMechanism: "Стерически препятствует транскрипции соприкосновением с активным центром ДНК-зависимой РНК-полимеразы (ген rpoB).",
        resistancePathway: "Однонуклеотидные миссенс-замены внутри хромосомного 81-нуклеотидного кластера RRDR гена rpoB туберкулезных микобактерий.",
        toxicityRisk: "Холестатическая желтуха, мощная индукция цитохрома P450 печени (CYP3A4), ведущая к лекарственным несовместимостям, и системный иммунный гриппоподобный синдром."
      }
    },
    BDQ: {
      name: "Бедаквилин",
      fullName: "Бедаквилин (BDQ)",
      mechanism: "Блокатор окислительного фосфорилирования",
      dosingNotes: "Резервный препарат нового класса диарилхинолинов для лечения лекарственно-устойчивого туберкулеза. Биодоступность удваивается при приеме с жирной пищей. Высокие уровни в плазме вызывают удлинение интервала QTc вследствие блокады калиевых каналов hERG.",
      description: "Высокоспецифичный таргетный препарат, связывающий вращающийся ротор АТФ-синтазы, лишая микобактерию энергетического метаболизма.",
      targetProtein: "субъединица c АТФ-синтазы (вращающееся c-кольцо)",
      clinicalImpact: {
        targetMechanism: "Связывает протеолипидную субъединицу c ротора F0 АТФ-синтазы (atpE), прекращая транспорт протонов и истощая запасы АТФ.",
        resistancePathway: "Мутации гена atpE в области сайта связывания или гиперэкспрессия помпы эффлюкса MmpS5/MmpL5 вследствие мутаций регуляторного гена Rv0678.",
        toxicityRisk: "Ингибирование калиевых каналов сердечной мышцы hERG, приводящее к фатальной аритмии (Torsades de Pointes) и риску внезапной остановки сердца."
      }
    }
  }
};
