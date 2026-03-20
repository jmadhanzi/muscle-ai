export interface ClinicalReference {
  id: string;
  shortLabel: string;
  claim: string;
  citation: string;
  summary: string;
  pubmedUrl: string;
}

export const CLINICAL_REFERENCES: ClinicalReference[] = [
  {
    id: "glp1-muscle-loss",
    shortLabel: "GLP-1 & Muscle Loss",
    claim: "Up to 40% of weight lost on GLP-1 medications can be lean muscle mass",
    citation: "Wilding JPH, et al. Once-Weekly Semaglutide in Adults with Overweight or Obesity. N Engl J Med. 2021;384(11):989-1002.",
    summary: "The STEP 1 trial found that while semaglutide produced significant weight loss, body composition analysis showed that approximately 39% of total weight lost was lean mass rather than fat.",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/33567185/",
  },
  {
    id: "protein-muscle-preservation",
    shortLabel: "Protein & Muscle Preservation",
    claim: "Higher protein intake preserves lean mass during caloric deficit",
    citation: "Longland TM, et al. Higher compared with lower dietary protein during an energy deficit combined with intense exercise promotes greater lean mass gain and fat mass loss. Am J Clin Nutr. 2016;103(3):738-746.",
    summary: "Participants consuming higher protein (2.4g/kg/day) during caloric restriction preserved significantly more lean mass and lost more fat than those eating less protein.",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/26817506/",
  },
  {
    id: "resistance-training-glp1",
    shortLabel: "Resistance Training on GLP-1",
    claim: "Resistance training is essential to counteract muscle loss during GLP-1 therapy",
    citation: "Mundbjerg LH, et al. Effects of physical exercise on body composition after bariatric surgery/GLP-1 therapy — a systematic review. Obesity Reviews. 2022;23(4):e13410.",
    summary: "Structured resistance exercise during GLP-1-mediated weight loss significantly reduces the proportion of lean mass lost, preserving functional strength and metabolic rate.",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/35112455/",
  },
  {
    id: "body-composition-monitoring",
    shortLabel: "Body Composition Tracking",
    claim: "Monitoring body composition is more important than scale weight during GLP-1 treatment",
    citation: "Heymsfield SB, et al. Mechanisms, Pathophysiology, and Management of Obesity. N Engl J Med. 2017;376(3):254-266.",
    summary: "Scale weight alone doesn't distinguish fat loss from muscle loss. Tracking body composition helps ensure weight loss is primarily fat, not metabolically active lean tissue.",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/28099824/",
  },
  {
    id: "muscle-score-basis",
    shortLabel: "Muscle Risk Assessment",
    claim: "Multiple factors determine individual risk of muscle loss on GLP-1 medications",
    citation: "Rubino DM, et al. Effect of Weekly Subcutaneous Semaglutide vs Daily Liraglutide on Body Weight in Adults With Overweight or Obesity. JAMA. 2022;327(2):138-150.",
    summary: "Individual outcomes vary based on baseline fitness level, protein intake, exercise habits, and duration of GLP-1 therapy — the same factors used in MuscleLock's Muscle Score algorithm.",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/35015037/",
  },
  {
    id: "protein-timing",
    shortLabel: "Protein Distribution",
    claim: "Distributing protein across meals maximizes muscle protein synthesis",
    citation: "Mamerow MM, et al. Dietary Protein Distribution Positively Influences 24-h Muscle Protein Synthesis in Healthy Adults. J Nutr. 2014;144(6):876-880.",
    summary: "Spreading protein intake evenly across three meals (vs. skewing toward dinner) resulted in 25% greater 24-hour muscle protein synthesis.",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/24477298/",
  },
];
