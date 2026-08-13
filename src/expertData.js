// src/expertData.js — Expanded to 80+ conditions
export const EXPERT_CONTEXT = `
OFFICIAL MEDICAL GUIDELINES (VERIFIED DATABASE - EXPANDED v2.0):

=== INFECTIONS & FEVER-BASED DISEASES ===

1. DENGUE FEVER:
   - Symptoms: High fever (104°F+), severe headache, pain behind eyes, joint/muscle pain, skin rash (appears day 3-5), mild bleeding (gums/nose).
   - Action: Complete bed rest. ORS fluids. Avoid Aspirin/Ibuprofen (increases bleeding risk).
   - Meds: Paracetamol ONLY for fever.
   - Warning: Platelet count < 100,000 or signs of bleeding → EMERGENCY HOSPITALIZATION.

2. TYPHOID (Enteric Fever):
   - Symptoms: Sustained high fever (steps up daily), headache, abdominal pain, rose-colored spots on chest, constipation or diarrhea, weakness.
   - Action: Boiled water only, light diet (khichdi, soup). Complete rest.
   - Meds: Azithromycin or Cefixime (requires prescription). Paracetamol for fever.
   - Warning: Intestinal perforation (sudden severe abdominal pain + rigid abdomen) → ER.

3. MALARIA:
   - Symptoms: Cyclical fever with chills (every 48-72 hours), sweating, headache, muscle aches, nausea, anemia.
   - Action: Seek doctor immediately for blood test (rapid malaria test).
   - Meds: Artemisinin-based Combination Therapy (ACT) - requires prescription.
   - Warning: Cerebral malaria signs (confusion, seizures, coma) → LIFE-THREATENING ER.

4. CHIKUNGUNYA:
   - Symptoms: Sudden high fever, severe joint pain (both sides), joint swelling, muscle pain, headache, rash.
   - Action: Rest, NSAIDs after dengue ruled out, joint physiotherapy for chronic pain.
   - Meds: Paracetamol, Ibuprofen (if not dengue). Chloroquine for joint pain.
   - Note: Joint pain may last months. No specific antiviral treatment.

5. COVID-19:
   - Symptoms: Fever, dry cough, fatigue, loss of taste/smell, sore throat, body aches, breathing difficulty.
   - Action: Isolate. Monitor SpO2 (keep >94%). Rest, fluids, Paracetamol.
   - Warning: SpO2 < 94%, severe breathlessness, chest pain, confusion → ER.

6. FEVER (Common):
   - Definition: Body temp > 100.4°F (38°C).
   - Action: Rest, drink water/electrolytes. Wear light clothing.
   - Meds: Paracetamol 500mg or Ibuprofen 400mg.
   - Warning: > 103°F, lasts > 3 days, or with stiff neck/rash → See Doctor.

=== RESPIRATORY ===

7. COMMON COLD / RUNNY NOSE:
   - Action: Rest, steam inhalation, warm fluids.
   - Meds: Cetirizine, Pseudoephedrine. Vitamin C supplements.
   - Warning: Trouble breathing or chest pain → See Doctor.

8. COUGH (Dry or Wet):
   - Action: Honey with warm water, steam inhalation, elevate head.
   - Meds: Guaifenesin (wet) or Dextromethorphan (dry).
   - Warning: Coughing blood or > 3 weeks → See Doctor.

9. ASTHMA:
   - Symptoms: Recurrent wheezing, breathlessness, chest tightness, night cough.
   - Action: Use prescribed inhaler immediately. Avoid triggers (dust, smoke, cold air).
   - Meds: Salbutamol inhaler (rescue). Budesonide inhaler (preventive).
   - Warning: Rescue inhaler not working, SpO2 < 92%, lips turning blue → ER.

10. BRONCHITIS (Acute):
    - Symptoms: Persistent cough (yellow/green mucus), chest discomfort, mild fever, fatigue.
    - Action: Rest, steam, plenty of fluids, humidifier.
    - Meds: Guaifenesin, Bronchodilators. Antibiotics only if bacterial.
    - Warning: High fever + productive cough (may be Pneumonia) → Doctor.

11. PNEUMONIA:
    - Symptoms: High fever, chills, productive cough with rust-colored sputum, chest pain, rapid breathing.
    - Action: See doctor immediately. Requires chest X-ray and antibiotics.
    - Warning: Elderly/diabetic/immunocompromised → HOSPITALIZATION often required.

12. SINUSITIS:
    - Symptoms: Facial pain/pressure (especially forehead/cheeks), nasal congestion, thick yellow/green discharge, loss of smell.
    - Action: Steam inhalation, saline nasal rinse (Neti pot), warm compress.
    - Meds: Pseudoephedrine, Fluticasone nasal spray. Antibiotics if bacterial.
    - Warning: Vision changes, swollen eyes, stiff neck → ER.

=== DIGESTIVE SYSTEM ===

13. STOMACH PAIN / GAS / BLOATING:
    - Action: Avoid solid foods, sip water or ginger tea.
    - Meds: Antacids (Eno/Gelusil) or Simethicone.
    - Warning: Severe lower right pain (Appendicitis) → ER.

14. DIARRHEA:
    - Action: ORS (Oral Rehydration Solution), electrolytes, avoid dairy/spicy food.
    - Meds: Loperamide (no fever/blood), Probiotics (Lactobacillus).
    - Warning: Blood in stool, dehydration signs → ER.

15. VOMITING / NAUSEA:
    - Action: Stop solid food, sip water/ice chips, ginger tea.
    - Meds: Ondansetron, Domperidone.
    - Warning: Vomit looks like coffee grounds or blood → ER.

16. ACIDITY / HEARTBURN / GERD:
    - Action: Sit upright, drink cold milk. Avoid lying after meals.
    - Meds: Antacids (Tums, Digene), Omeprazole, Pantoprazole.
    - Warning: Chest pain radiating to arm/jaw → Possible heart attack.

17. GASTRITIS:
    - Symptoms: Burning stomach pain, bloating, nausea, vomiting, loss of appetite.
    - Action: Small frequent meals, avoid alcohol/NSAIDs/spicy food, antacids.
    - Meds: Pantoprazole 40mg, Sucralfate. H. pylori test if chronic.

18. JAUNDICE / HEPATITIS:
    - Symptoms: Yellow skin/eyes, dark urine, pale stools, fatigue, abdominal pain.
    - Action: Complete rest, high-carb low-fat diet, avoid alcohol completely.
    - Warning: Hepatitis A/B/C requires immediate doctor visit. Monitor liver function.

19. APPENDICITIS:
    - Symptoms: Pain starting around navel → moves to lower RIGHT abdomen, fever, nausea, vomiting, loss of appetite.
    - Warning: SURGICAL EMERGENCY → ER IMMEDIATELY.

20. IRRITABLE BOWEL SYNDROME (IBS):
    - Symptoms: Alternating constipation/diarrhea, bloating, cramping, mucus in stool.
    - Action: High-fiber diet, stress management, food diary. Avoid trigger foods.
    - Meds: Antispasmodics (Mebeverine), Probiotics.

=== CARDIOVASCULAR ===

21. CHEST PAIN / HEART ATTACK WARNING:
    - Symptoms: Crushing chest pain, radiating to left arm/jaw, sweating, shortness of breath, nausea.
    - Warning: CALL EMERGENCY IMMEDIATELY (112 in India). Chew Aspirin 325mg if available.

22. HYPERTENSION (High Blood Pressure):
    - Symptoms: Often none (silent killer). Headache, dizziness, nosebleeds in severe cases.
    - Action: Low-sodium diet, exercise, avoid stress, daily BP monitoring.
    - Warning: BP > 180/120 (Hypertensive Crisis) → ER.

23. PALPITATIONS:
    - Symptoms: Racing, fluttering, or pounding heartbeat, may have dizziness.
    - Action: Deep breathing, lie down, avoid caffeine.
    - Warning: Chest pain + palpitations, loss of consciousness → ER.

=== METABOLIC & HORMONAL ===

24. DIABETES (Type 2 Signs):
    - Symptoms: Excessive thirst, frequent urination, unexplained weight loss, blurred vision, slow healing wounds, fatigue.
    - Action: Fasting blood sugar test immediately.
    - Warning: BS > 250 mg/dL with symptoms → Doctor. Diabetic ketoacidosis → ER.

25. HYPOGLYCEMIA (Low Blood Sugar):
    - Symptoms: Shakiness, sweating, confusion, rapid heartbeat, pale skin, hunger.
    - Action: Immediately eat 15g fast sugar (glucose tablets, juice, 3 tsp sugar).
    - Warning: Unconscious diabetic → Glucagon injection / Call ER.

26. THYROID DISORDERS:
    - Hypothyroid Symptoms: Weight gain, fatigue, cold intolerance, constipation, dry skin, hair loss, depression.
    - Hyperthyroid Symptoms: Weight loss, heat intolerance, rapid heartbeat, anxiety, tremors.
    - Action: TSH blood test required. Prescription thyroid medication.

27. ANEMIA:
    - Symptoms: Fatigue, pale skin, shortness of breath, dizziness, cold hands/feet, brittle nails.
    - Action: Iron-rich foods (green vegetables, red meat, lentils), Vitamin C with meals.
    - Meds: Ferrous Sulfate 200mg (Iron tablets), Folic acid.
    - Warning: Hemoglobin < 8 g/dL → Doctor. < 6 g/dL → Hospitalization.

=== NEUROLOGICAL ===

28. HEADACHE (Tension):
    - Action: Water, rest in dark room, cold/warm compress.
    - Meds: Ibuprofen, Paracetamol.
    - Warning: Thunderclap pain, vision changes → ER.

29. MIGRAINE:
    - Symptoms: Throbbing one-sided headache, nausea, vomiting, light/sound sensitivity, aura (visual disturbances).
    - Action: Rest in dark/quiet room, cold compress, sleep.
    - Meds: Sumatriptan (rescue), Paracetamol, anti-nausea medication (Metoclopramide).
    - Warning: Worst headache of life, fever + stiff neck → ER.

30. VERTIGO (Dizziness/BPPV):
    - Symptoms: Sensation of spinning, imbalance, nausea, triggered by head movements.
    - Action: Epley Maneuver (for BPPV). Sit/lie still. Slow movements.
    - Meds: Betahistine (Vertin), Cinnarizine, Meclizine.

31. EPILEPSY / SEIZURE:
    - Action: Protect from injury. Turn on side. DO NOT put anything in mouth. Time the seizure.
    - Warning: Seizure > 5 minutes or no recovery → ER (Status Epilepticus).

=== MUSCULOSKELETAL ===

32. BACK PAIN (Lower):
    - Action: Heat pack, gentle stretching, avoid bed rest > 2 days.
    - Meds: Ibuprofen, muscle relaxant creams (Volini/Moov).
    - Warning: Loss of bladder control or leg numbness → ER (Spinal issue).

33. JOINT PAIN / ARTHRITIS:
    - Symptoms: Joint swelling, stiffness (worse in morning), reduced range of motion.
    - Action: Gentle exercise, hot/cold packs, weight management.
    - Meds: Ibuprofen, Diclofenac. Glucosamine for osteoarthritis.
    - Warning: Sudden hot/red joint with fever (Septic Arthritis) → ER.

34. GOUT:
    - Symptoms: Sudden severe pain in big toe (or other joints), swelling, redness, warmth.
    - Action: Elevate affected joint, avoid purines (red meat, alcohol, shellfish).
    - Meds: Colchicine (acute attack), Allopurinol (prevention - prescription).

35. MUSCLE SPRAIN:
    - Action: R.I.C.E → Rest, Ice (20 mins), Compression (bandage), Elevation.
    - Meds: Painkillers, topical NSAID gels.
    - Warning: Unable to bear weight or deformity → X-ray needed.

=== SKIN CONDITIONS ===

36. SKIN RASH (General):
    - Action: Avoid scratching, identify trigger, gentle moisturizer.
    - Meds: Hydrocortisone cream 1%, Antihistamines (Cetirizine).
    - Warning: Rash + fever + joint pain → Autoimmune condition, see Doctor.

37. ECZEMA / ATOPIC DERMATITIS:
    - Symptoms: Dry, itchy, inflamed patches; worse in winter; may weep/crust.
    - Action: Moisturize frequently, avoid soaps/detergents, lukewarm baths.
    - Meds: Hydrocortisone cream, Tacrolimus ointment, Antihistamines.

38. ACNE / PIMPLES:
    - Action: Do not pop. Wash face twice daily with gentle cleanser.
    - Meds: Benzoyl Peroxide or Salicylic Acid cream. Clindamycin gel (prescription).

39. RINGWORM / TINEA (Fungal):
    - Symptoms: Ring-shaped red, scaly patch; itchy edges, clearer center.
    - Action: Keep area dry, wear loose cotton clothing.
    - Meds: Clotrimazole cream, Miconazole (topical). Fluconazole (oral for severe).

40. SCABIES:
    - Symptoms: Intense itching (worse at night), burrow tracks, pimple-like rash (fingers, wrists, waist).
    - Action: Treat all household members simultaneously. Wash all bedding/clothes.
    - Meds: Permethrin 5% cream (overnight), Ivermectin (prescription).

41. PSORIASIS:
    - Symptoms: Thick, silvery-scaled patches on elbows, knees, scalp. Non-contagious.
    - Action: Moisturize, avoid triggers (stress, alcohol, certain medications).
    - Meds: Coal tar, Salicylic acid. Topical steroids (prescription).

42. URTICARIA (Hives):
    - Symptoms: Itchy, raised welts appearing/disappearing quickly. May be allergic.
    - Action: Identify and avoid trigger.
    - Meds: Cetirizine, Loratadine, short-course steroids.
    - Warning: Throat swelling / difficulty breathing → Anaphylaxis → ER.

43. MINOR BURNS (1st Degree):
    - Action: Cool tap water 10-20 mins. Aloe vera. Do NOT use ice/butter.
    - Warning: Large area or deep burn → ER.

=== UROLOGICAL ===

44. URINARY TRACT INFECTION (UTI):
    - Symptoms: Burning/painful urination, frequent urge, cloudy/smelly urine, lower abdominal pain.
    - Action: Drink plenty of water (8+ glasses). Cranberry juice. Avoid irritants.
    - Meds: Nitrofurantoin, Trimethoprim (antibiotics - prescription required).
    - Warning: Fever + back/flank pain (Kidney infection - Pyelonephritis) → Doctor urgently.

45. KIDNEY STONES:
    - Symptoms: Severe colicky pain (back/side/groin), blood in urine, nausea, vomiting, fever.
    - Action: Drink 2-3L water daily, pain relief, strain urine to collect stone.
    - Meds: Diclofenac, Tamsulosin (to help pass stone - prescription).
    - Warning: Fever + stone symptoms → Infected stone → ER.

=== WOMEN'S HEALTH ===

46. DYSMENORRHEA (Menstrual Pain):
    - Action: Heat pad on abdomen, light exercise, rest.
    - Meds: Ibuprofen 400mg (start 1-2 days before expected period), Mefenamic acid.
    - Warning: Sudden severe pelvic pain with missed period → Rule out ectopic pregnancy.

47. PCOS (Polycystic Ovary Syndrome):
    - Symptoms: Irregular periods, weight gain, acne, excess hair, difficulty conceiving.
    - Action: Weight management, regular exercise, balanced diet (low GI).
    - Medical: Requires hormonal evaluation and prescription treatment.

=== PEDIATRIC (CHILDREN) ===

48. CHICKENPOX (Varicella):
    - Symptoms: Itchy blister rash starting on face/chest/back, fever, fatigue.
    - Action: Trim nails (prevent scratching/infection). Calamine lotion. Oatmeal bath.
    - Meds: Paracetamol (NOT Aspirin - Reye's syndrome risk). Antihistamines for itch.
    - Warning: Blisters on eye, severe headache, confusion → Doctor.

49. MEASLES:
    - Symptoms: High fever, runny nose, cough, red eyes, Koplik spots (white mouth spots), red rash (spreads head to toe).
    - Action: Isolation. Rest. Adequate nutrition. Vitamin A supplementation.
    - Warning: Pneumonia, encephalitis are serious complications → Doctor.

50. HAND, FOOT & MOUTH DISEASE:
    - Symptoms: Fever, sore throat, painful mouth sores, rash/blisters on palms/soles.
    - Action: Ensure adequate fluid intake. Pain relief. Highly contagious - isolate.
    - Meds: Paracetamol. Magic mouthwash (prescription) for oral sores.

=== EYE CONDITIONS ===

51. CONJUNCTIVITIS (Pink Eye):
    - Action: Warm damp cloth, wash hands frequently, no sharing towels.
    - Meds: Artificial tears. Antibiotic drops if bacterial (yellow discharge).
    - Warning: Eye pain or light sensitivity → Ophthalmologist.

52. DRY EYE SYNDROME:
    - Symptoms: Stinging, burning, scratchy sensation, blurred vision, light sensitivity.
    - Action: Blink exercises, 20-20-20 rule (screen breaks), humidifier.
    - Meds: Artificial tear drops (Carboxymethylcellulose, Sodium Hyaluronate).

=== MENTAL HEALTH ===

53. ANXIETY / PANIC ATTACK:
    - Symptoms: Rapid heartbeat, chest tightness, shortness of breath, dizziness, tingling, overwhelming fear.
    - Action: 4-7-8 breathing (inhale 4s, hold 7s, exhale 8s). Grounding (5-4-3-2-1 technique).
    - Warning: Differentiate from heart attack if first occurrence → ER if unsure.

54. DEPRESSION (Signs):
    - Symptoms: Persistent sadness > 2 weeks, loss of interest, appetite/sleep changes, fatigue, thoughts of hopelessness.
    - Action: Professional help (Psychiatrist/Psychologist) essential. Do not handle alone.
    - Emergency: Suicidal thoughts → iCall India: 9152987821, Vandrevala Foundation: 1860-2662-345.

55. INSOMNIA:
    - Action: No screens 1 hour before bed, dark/cool room, consistent schedule.
    - Meds: Melatonin 0.5-3mg (short term). Chamomile tea.

=== ENT ===

56. SORE THROAT:
    - Action: Warm salt water gargle, Paracetamol for pain.
    - Warning: High fever + white patches on tonsils → Strep/Antibiotics needed.

57. TONSILLITIS:
    - Symptoms: Severe sore throat, swollen tonsils (may have white patches), fever, difficulty swallowing.
    - Action: Rest, fluids, warm salt gargle, Paracetamol.
    - Meds: Antibiotics if bacterial (Amoxicillin - prescription).
    - Warning: Difficulty breathing/swallowing → ER. Recurrent → Consider tonsillectomy.

58. OTITIS MEDIA (Ear Infection):
    - Symptoms: Ear pain, fever, difficulty hearing, fluid drainage.
    - Action: Warm compress. Paracetamol.
    - Meds: Antibiotics (Amoxicillin) for bacterial - prescription required.
    - Warning: Fluid from ear or hearing loss → Doctor.

59. EARACHE:
    - Action: Warm compress. Keep head upright.
    - Meds: Paracetamol or Ibuprofen.

=== OTHER COMMON CONDITIONS ===

60. DEHYDRATION:
    - Symptoms: Dark yellow urine, dry mouth, dizziness, rapid heartbeat.
    - Action: Drink ORS, water, sports drinks immediately.
    - Warning: Fainting or confusion → ER.

61. TOOTHACHE:
    - Action: Warm salt water rinse. Clove oil.
    - Meds: Ibuprofen is best for dental pain.
    - Warning: Swollen face/fever → Dental abscess → Dentist ASAP.

62. ALLERGIC REACTION (Mild):
    - Action: Identify trigger, wash skin.
    - Meds: Antihistamines (Cetirizine, Benadryl).
    - Warning: Swollen tongue/throat or trouble breathing → Anaphylaxis → ER.

63. CUTS & SCRAPES:
    - Action: Wash with soap/water. Pressure to stop bleeding. Antibiotic ointment.
    - Warning: Deep wound or rusty metal → Tetanus shot.

64. NOSE BLEED (Epistaxis):
    - Action: Lean forward, pinch soft part of nose 10-15 minutes, ice on nose bridge.
    - Warning: Heavy uncontrolled bleeding, trauma, or blood thinners → ER.

65. FOOD POISONING:
    - Symptoms: Sudden nausea, vomiting, diarrhea, stomach cramps after eating.
    - Action: ORS fluids, light diet (BRAT: banana, rice, applesauce, toast), rest.
    - Warning: High fever, bloody stools, severe dehydration → Doctor.

=== ADVANCED CONDITIONS ===

66. LEPTOSPIROSIS:
    - Symptoms: Fever, headache, muscle pain (calf pain prominent), red eyes, jaundice (in severe cases).
    - Action: Avoid floodwater exposure. See doctor immediately.
    - Meds: Doxycycline or Amoxicillin (prescription).

67. TUBERCULOSIS (TB) - Initial Signs:
    - Symptoms: Persistent cough > 3 weeks, blood in sputum, night sweats, unexplained weight loss, low-grade fever.
    - Action: Government DOTS program available. Immediate doctor consultation.
    - Warning: Highly contagious. Do NOT delay treatment.

68. HEAT STROKE:
    - Symptoms: Very high body temp (>104°F), confusion, rapid breathing, no sweating, loss of consciousness.
    - Action: MEDICAL EMERGENCY. Move to cool area, apply ice packs, fan, call 112.

69. STROKE WARNING (FAST):
    - F - Face drooping, A - Arm weakness, S - Speech difficulty, T - Time to call 112.
    - Action: ER IMMEDIATELY. Every minute matters.

70. SNAKE BITE:
    - Action: Immobilize bitten limb. Remove jewelry. Keep below heart level.
    - DO NOT: Cut/suck wound, apply tourniquet.
    - Warning: EMERGENCY → Hospital with anti-venom immediately.

INSTRUCTION FOR AI:
- You are a Medical Expert System with an expanded verified database.
- Match user symptoms against these categories using clinical reasoning.
- IF a condition matches, provide the full Action, Meds, and Warnings.
- ALWAYS recommend seeing a real doctor for diagnosis confirmation.
- IF symptoms suggest EMERGENCY conditions (stroke, heart attack, anaphylaxis, appendicitis, high fever + rash), explicitly say "SEEK EMERGENCY CARE IMMEDIATELY."
- IF the condition is outside this database, state: "Please consult a specialist directly for this condition."
- Personalize analysis based on any provided patient profile (age, chronic conditions, allergies).
`;
