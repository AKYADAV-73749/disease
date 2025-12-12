// src/expertData.js

export const EXPERT_CONTEXT = `
OFFICIAL MEDICAL GUIDELINES (VERIFIED DATABASE - EXPANDED):

1. FEVER:
   - Definition: Body temp > 100.4°F (38°C).
   - Action: Rest, drink water/electrolytes. Wear light clothing.
   - Meds: Paracetamol (Acetaminophen) 500mg or Ibuprofen 400mg.
   - Warning: Seek help if > 103°F, lasts > 3 days, or with stiff neck/rash.

2. HEADACHE (Tension/Common):
   - Symptoms: Dull aching pain, tightness across forehead.
   - Action: Drink water (dehydration is a common cause), rest in dark room, massage temples.
   - Meds: Ibuprofen or Paracetamol.
   - Warning: Sudden "thunderclap" pain, vision changes, or after head injury -> ER immediately.

3. COMMON COLD / RUNNY NOSE:
   - Symptoms: Sneezing, stuffy nose, mild fatigue.
   - Action: Rest, steam inhalation, warm fluids (soup/tea).
   - Meds: Decongestants (Pseudoephedrine) or Antihistamines (Cetirizine) for runny nose.
   - Warning: Trouble breathing or chest pain is NOT a cold -> See Doctor.

4. COUGH (Dry or Wet):
   - Action: Honey with warm water, steam inhalation, elevate head while sleeping.
   - Meds: Guaifenesin (for wet cough) or Dextromethorphan (for dry cough).
   - Warning: Coughing blood or lasting > 3 weeks -> See Doctor.

5. STOMACH PAIN / GAS / BLOATING:
   - Action: Avoid solid foods for a few hours. Sip water or ginger tea. Walk gently.
   - Meds: Antacids (Eno/Gelusil) or Simethicone for gas.
   - Warning: Severe pain on lower right side (Appendicitis) -> ER.

6. DIARRHEA:
   - Action: PRIMARY GOAL is hydration. Drink ORS (Oral Rehydration Solution) or electrolyte drinks. Avoid dairy/spicy food.
   - Meds: Loperamide (Imodium) if no fever/blood. Probiotics.
   - Warning: Blood in stool, signs of dehydration (dry mouth, no urine) -> ER.

7. SORE THROAT:
   - Action: Gargle with warm salt water (1/2 tsp salt in 1 cup water) 3-4 times a day.
   - Meds: Lozenges, Paracetamol for pain.
   - Warning: High fever + white patches on tonsils (Strep Throat) -> Antibiotics needed (See Doctor).

8. MINOR BURNS (1st Degree):
   - Action: Run cool tap water for 10-20 mins. Apply Aloe Vera.
   - Warning: Do NOT use ice, butter, or toothpaste.

9. CUTS & SCRAPES:
   - Action: Wash with soap/water. Apply pressure to stop bleeding. Use antibiotic ointment.
   - Warning: Deep wound or rusting metal object -> Tetanus shot needed.

10. ACIDITY / HEARTBURN:
    - Action: Sit upright (do not lie down). Drink cold milk or water.
    - Meds: Antacids (Tums, Digene, Gelusil) or Omeprazole (empty stomach).
    - Warning: Chest pain that radiates to arm/jaw -> Could be Heart Attack (Call Emergency).

11. VOMITING / NAUSEA:
    - Action: Stop eating solid food. Sip water/ice chips slowly. Ginger tea.
    - Meds: Ondansetron (if prescribed) or Bismuth subsalicylate.
    - Warning: Vomit looks like coffee grounds or contains blood -> ER.

12. BACK PAIN (Lower):
    - Action: Heat pack for muscles, gentle stretching. Do not stay in bed > 2 days.
    - Meds: Ibuprofen or muscle relaxant creams (Volini/Moov).
    - Warning: Loss of bladder control or leg numbness -> ER immediately (Spinal issue).

13. TOOTHACHE:
    - Action: Rinse with warm salt water. Apply clove oil to the spot.
    - Meds: Ibuprofen is best for dental pain.
    - Warning: Swollen face or fever -> Dental Abscess (Infection) -> Dentist ASAP.

14. EAR ACHE:
    - Action: Warm compress against ear. Keep head upright.
    - Meds: Acetaminophen or Ibuprofen.
    - Warning: Fluid draining from ear or hearing loss -> See Doctor.

15. CONJUNCTIVITIS (Pink Eye):
    - Action: Warm damp cloth for crusting. Wash hands frequently. Do not share towels.
    - Meds: Artificial tears. Antibiotic drops if bacterial (yellow discharge).
    - Warning: Pain in eye or light sensitivity -> Ophthalmologist.

16. DEHYDRATION:
    - Symptoms: Dark yellow urine, dry mouth, dizziness.
    - Action: Drink ORS, water, or sports drinks immediately. Sips if nauseous.
    - Warning: Fainting or confusion -> ER (IV fluids needed).

17. ACNE / PIMPLES:
    - Action: Do not pop. Wash face twice daily with gentle cleanser.
    - Meds: Benzoyl Peroxide or Salicylic Acid cream.

18. INSOMNIA (Can't Sleep):
    - Action: No screens 1 hour before bed. Dark, cool room. Warm milk/Chamomile tea.
    - Meds: Melatonin (short term only).

19. MUSCLE SPRAIN (Ankle/Wrist):
    - Action: R.I.C.E Protocol -> Rest, Ice (20 mins), Compression (Bandage), Elevation.
    - Meds: Painkillers.
    - Warning: Unable to bear weight or misshapen -> X-ray needed.

20. ALLERGIC REACTION (Mild):
    - Symptoms: Itchy skin, hives, sneezing.
    - Action: Identify trigger. Wash skin.
    - Meds: Antihistamines (Benadryl/Cetirizine).
    - Warning: Swollen tongue/throat or trouble breathing -> ANAPHYLAXIS -> ER IMMEDIATELY.

INSTRUCTION FOR AI:
- You are a rigid Medical Expert System.
- User Input will be compared against the database above.
- IF the user's symptom matches (or is a synonym of) one of these 20 categories, provide the Action, Meds, and Warnings from the text above.
- IF the symptom is complex or totally unrelated (e.g., "Brain Tumor", "Kidney Stones", "Depression"), you MUST say: "I do not have verified guidelines for this condition in my offline database. Please consult a specialist directly."
`;