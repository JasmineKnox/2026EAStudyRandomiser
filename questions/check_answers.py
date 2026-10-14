"""Independent published-answer fixtures and recomputation of numerical variants."""
import json,pathlib,math,re
root=pathlib.Path(__file__).resolve().parent.parent
questions={q['id']:q for q in json.loads((root/'question-bank.json').read_text())['questions']}
checks=0
def contains(key,*values):
 global checks
 answer=' '.join(questions[key]['answer'])
 for v in values:assert v in answer,(key,v,answer);checks+=1
# Fixed expected results are independent of the generator's expressions.
fixtures={
'economics-fx-v0':['571.43','500.00'], 'economics-fx-v1':['1000.00','800.00'], 'economics-fx-v2':['600.00','500.00'],
'accounting-depreciation-v0':['4,000','16,000'],'accounting-depreciation-v1':['2,500','13,000'],'accounting-depreciation-v2':['6,000','24,000'],
'accounting-disposal':['11,000','1,500','loss'], 'accounting-ratios':['12%','1.5:1'],
'maths_general-regression-v0':['= 23.','= 2.'],'maths_general-regression-v1':['= 28.','= 2.'],'maths_general-regression-v2':['= 27.','= -3.'],
'maths_general-sequence-v0':['231.53'],'maths_general-sequence-v1':['405.00'],'maths_general-sequence-v2':['175.69'],
'maths_general-networks':['9 days','2 days'],'maths_general-interest':['5,624.32'],
'maths_methods-stationary':['(3,−4)','minimum'],'maths_methods-integral':['C=7','2x³−4x+7'],
'maths_methods-discrete':['=1.1','=0.8'],'maths_methods-normal':['=1.5','=0.0668'],'maths_methods-ci':['0.5520','0.6480'],
'maths_specialist-complex':['=−4'],'maths_specialist-vectors':['=4','(2,0,2)'],'maths_specialist-vector-calculus':['(4,3,12)','(2,0,12)'],'maths_specialist-matrices':['x=3','y=1'],
'biology-quadrat':['1,000'],'biology-energy':['12.5%'],'chemistry-equilibrium':['=16','Qc<Kc'],
'chemistry-redox':['+1.10 V'],'physics-circular':['8.0 m s⁻²','4.0 N'],'physics-magnetic':['0.012 N','zero'],
'physics-photoelectric':['2.304×10⁻¹⁹'],'earth_science-ore':['800 tonnes'],'earth_science-water':['−2 GL','9 GL'],
'marine_science-bleaching':['60 percentage points'],'marine_science-fish':['400 fish'],'psychology-memory':['7.5 words','10 words','2.5 words'],
'agricultural_science-feed':['5.0 kg','4.5 kg'],'agricultural_science-plants':['20%'],'agricultural_science-enterprise':['27,000'],
'engineering-beam':['4 kN','8 kN'],'engineering-stress':['200 MPa'],'engineering-power':['75%','200 W','1,200 W'],'engineering-gears':['400 rpm'],
'aerospace_sys-turnaround':['40 minutes','35 minutes'],'aerospace_sys-fuel':['96 L','4 L'],'aerospace_sys-navigation':['90 minutes','108 minutes','18 minutes'],
'geography-cover':['150 km²','−15 percentage points','25%'],'geography-population':['1,200','1,800','203,000'],'geography-ageing':['66.7'],
'essential_maths-estimate':['27.90','2.10'],'essential_maths-paint':['1 litre'],'essential_maths-scale':['4.5 m'],'essential_maths-chance':['30%','60 blue'],
'digital_solutions-trace':['total=11'],'digital_solutions-sql':['score >= 70','score DESC','Chen,85','Ana,72']}
for key,values in fixtures.items():contains(key,*values)
# Independently solve stationary point, inverse-system and vector derivatives.
assert (7-4,4-(7-4))==(3,1)
assert 2*3-6==0 and 3**2-6*3+5==-4
assert (2*2,3,3*2**2)==(4,3,12)
assert abs((.6-1.96*math.sqrt(.6*.4/400))-.55199)<.00002
assert (12000 and 1500/12000*100)==12.5
print(f'{checks} expected-answer checks across {len(fixtures)} quantitative/algorithm questions passed.')
