
document.addEventListener('DOMContentLoaded',()=>{
  const whatsappButton=document.createElement('a');
  whatsappButton.className='floating-whatsapp';
  whatsappButton.href='https://wa.me/2348060938754?text='+encodeURIComponent('Hello BuyLocate, I would like to make an enquiry.');
  whatsappButton.target='_blank';
  whatsappButton.rel='noopener noreferrer';
  whatsappButton.setAttribute('aria-label','Chat with BuyLocate on WhatsApp');
  whatsappButton.innerHTML='<span aria-hidden="true">✆</span><b>WhatsApp</b>';
  document.body.appendChild(whatsappButton);
  const toggle=document.querySelector('.mobile-toggle'), links=document.querySelector('.nav-links');
  if(toggle && links){
    toggle.setAttribute('aria-label',toggle.getAttribute('aria-label')||'Open navigation');
    toggle.setAttribute('aria-expanded','false');
    toggle.addEventListener('click',()=>{
      const open=links.classList.toggle('open');
      toggle.setAttribute('aria-expanded',String(open));
      toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    });
    links.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Open navigation');
    }));
  }
  const form=document.getElementById('shipping-form');
  if(form){
    const ids=['weight','destination','shipmentType'];
    ids.forEach(id=>document.getElementById(id)?.addEventListener('input',calculate));
    document.getElementById('weightUnit')?.addEventListener('change',calculate);
    form.addEventListener('submit',e=>{e.preventDefault();calculate(true)});
    calculate();
  }
  const testimonialViewport=document.querySelector('.testimonial-viewport');
  if(testimonialViewport){
    const slide=direction=>testimonialViewport.scrollBy({left:direction*testimonialViewport.clientWidth,behavior:'smooth'});
    document.getElementById('testimonialPrev')?.addEventListener('click',()=>slide(-1));
    document.getElementById('testimonialNext')?.addEventListener('click',()=>slide(1));
  }
});
function calculate(scroll=false){
  const val=id=>document.getElementById(id)?.value;
  let w=parseFloat(val('weight'))||0;
  if(val('weightUnit')==='lb') w*=0.453592;
  const actualTotal=w;
  const chargeable=actualTotal;
  const billedWeight=Math.ceil(chargeable);
  const rateWeights=[1,2,3,4,5,6,7,8,9,10,15,20,25,30,35,40,45,50,55,60,65,70];
  const rates={
    zone2:[51209,66691,82903,99499,114968,129667,144368,159073,173774,179563,253118,326401,383352,440300,497533,550388,603237,656087,708933,761788,814639,861467],
    zone3:[51897,68346,85080,101716,117191,131975,146758,161548,176337,182084,255190,327996,386939,445882,503255,556524,609797,663077,716350,769614,822887,870075],
    zone4:[58186,75568,93272,110855,127159,143015,158870,174712,190574,196664,267434,337578,399586,461590,519292,575811,632325,688842,745356,801864,858381,908540],
    zone5:[59788,78437,97980,117997,136663,155323,173989,192659,211329,219112,304803,389050,462867,536687,604150,669816,735500,801170,866847,932522,998202,1056492],
    zone6:[70043,90716,112404,134615,155275,173989,192707,211424,230149,237089,324454,409399,487021,564638,642250,718718,795174,871634,948100,1024558,1101020,1169305],
    zone7:[70393,91071,112797,135077,155825,174933,194058,213181,232309,239545,330729,418839,503707,588571,672228,754404,836562,918738,1000904,1083079,1165243,1238754],
    zone8:[76918,99227,122602,146496,168716,190333,211939,233555,255159,263686,371842,477733,581025,684326,785771,885376,984974,1084573,1184182,1283777,1383383,1472685],
    zone9:[94013,119469,146271,173759,199232,224714,250204,275683,301163,311198,434778,557814,677807,797806,917812,1037336,1156851,1276377,1395905,1515424,1634957,1742298]
  };
  const over70Rates={zone2:12306,zone3:12429,zone4:12979,zone5:15092,zone6:16704,zone7:17696,zone8:21038,zone9:24890};
  const zone=val('destination')||'zone3';
  let total=0, rateBasis='Enter shipment weight';
  if(billedWeight>0 && billedWeight<=70){
    const exactIndex=rateWeights.indexOf(billedWeight);
    if(exactIndex>=0){
      total=rates[zone][exactIndex];
    }else{
      const upperIndex=rateWeights.findIndex(weight=>weight>billedWeight);
      const lowerIndex=upperIndex-1;
      const lowerWeight=rateWeights[lowerIndex], upperWeight=rateWeights[upperIndex];
      const lowerRate=rates[zone][lowerIndex], upperRate=rates[zone][upperIndex];
      total=lowerRate+((upperRate-lowerRate)*(billedWeight-lowerWeight)/(upperWeight-lowerWeight));
    }
    rateBasis=billedWeight+' kg published rate';
  }else if(billedWeight>70){
    const perKg=over70Rates[zone];
    total=billedWeight*perKg;
    rateBasis='₦'+perKg.toLocaleString('en-NG')+'/kg × '+billedWeight+' kg';
  }
  const money=n=>'₦'+Math.round(n).toLocaleString('en-NG');
  const set=(id,t)=>{const el=document.getElementById(id);if(el)el.textContent=t}
  set('actualWeight',actualTotal.toFixed(2)+' kg');
  set('chargeableWeight',chargeable.toFixed(2)+' kg (billed as '+billedWeight+' kg)'); set('shippingPrice',money(total));
  set('baseCharge',rateBasis); set('handlingCharge','Not included'); set('estimatedTransit','5–7 days');
  const destination=document.getElementById('destination');
  const shipmentType=document.getElementById('shipmentType');
  const destinationLabel=destination?.options[destination.selectedIndex]?.text||'';
  const shipmentLabel=shipmentType?.options[shipmentType.selectedIndex]?.text||'';
  const message='Hello BuyLocate, I would like to book this shipment.\n\nDestination: '+destinationLabel+'\nShipment type: '+shipmentLabel+'\nQuantity: '+qty+'\nActual shipping weight: '+actualTotal.toFixed(2)+' kg\nEstimated shipping price: '+money(total);
  const bookingLink=document.getElementById('bookingWhatsApp');
  if(bookingLink) bookingLink.href='https://wa.me/2348060938754?text='+encodeURIComponent(message);
  if(scroll) document.getElementById('quote-result')?.scrollIntoView({behavior:'smooth',block:'start'});
}
