/* ─────────────────────────────────────────────────────────────────────────────
   FINBI website — app.js
   Handles: India location dropdowns, pincode lookup, password strength,
            register/login form logic, bank-level security helpers
   ───────────────────────────────────────────────────────────────────────────── */

// ── India States + Districts (official GOI data) ─────────────────────────────
const INDIA = {
  "Andhra Pradesh": ["Alluri Sitharama Raju","Anakapalli","Anantapur","Bapatla","Chittoor","East Godavari","Eluru","Guntur","Kakinada","Konaseema","Krishna","Kurnool","Nandyal","NTR","Palnadu","Parvathipuram Manyam","Prakasam","Srikakulam","Sri Sathya Sai","Tirupati","Visakhapatnam","Vizianagaram","West Godavari","YSR Kadapa"],
  "Arunachal Pradesh": ["Anjaw","Changlang","Dibang Valley","East Kameng","East Siang","Itanagar Capital Complex","Kamle","Kra Daadi","Kurung Kumey","Leparada","Lohit","Longding","Lower Dibang Valley","Lower Siang","Lower Subansiri","Namsai","Pakke-Kessang","Papum Pare","Shi Yomi","Siang","Tawang","Tirap","Upper Siang","Upper Subansiri","West Kameng","West Siang"],
  "Assam": ["Bajali","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo","Chirang","Darrang","Dhemaji","Dhubri","Dibrugarh","Dima Hasao","Goalpara","Golaghat","Hailakandi","Hojai","Jorhat","Kamrup","Kamrup Metropolitan","Karbi Anglong","Karimganj","Kokrajhar","Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari","Sivasagar","Sonitpur","South Salmara-Mankachar","Tamulpur","Tinsukia","Udalguri","West Karbi Anglong"],
  "Bihar": ["Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur","Buxar","Darbhanga","East Champaran","Gaya","Gopalganj","Jamui","Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj","Lakhisarai","Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada","Patna","Purnia","Rohtas","Saharsa","Samastipur","Saran","Sheikhpura","Sheohar","Sitamarhi","Siwan","Supaul","Vaishali","West Champaran"],
  "Chhattisgarh": ["Balod","Baloda Bazar","Balrampur","Bastar","Bemetara","Bijapur","Bilaspur","Dantewada","Dhamtari","Durg","Gariaband","Gaurela-Pendra-Marwahi","Janjgir-Champa","Jashpur","Kabirdham","Kanker","Khairagarh-Chhuikhadan-Gandai","Kondagaon","Korba","Koriya","Mahasamund","Manendragarh-Chirmiri-Bharatpur","Mohla-Manpur-Ambagarh Chouki","Mungeli","Narayanpur","Raigarh","Raipur","Rajnandgaon","Sakti","Sarangarh-Bilaigarh","Sukma","Surajpur","Surguja"],
  "Goa": ["North Goa","South Goa"],
  "Gujarat": ["Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch","Bhavnagar","Botad","Chhota Udaipur","Dahod","Dang","Devbhoomi Dwarka","Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kheda","Kutch","Mahisagar","Mehsana","Morbi","Narmada","Navsari","Panchmahal","Patan","Porbandar","Rajkot","Sabarkantha","Surat","Surendranagar","Tapi","Vadodara","Valsad"],
  "Haryana": ["Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurugram","Hisar","Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh","Mewat (Nuh)","Palwal","Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar"],
  "Himachal Pradesh": ["Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu","Lahaul and Spiti","Mandi","Shimla","Sirmaur","Solan","Una"],
  "Jharkhand": ["Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa","Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti","Koderma","Latehar","Lohardaga","Pakur","Palamu","Ramgarh","Ranchi","Sahebganj","Seraikela Kharsawan","Simdega","West Singhbhum"],
  "Karnataka": ["Bagalkot","Ballari (Bellary)","Belagavi (Belgaum)","Bengaluru Rural","Bengaluru Urban","Bidar","Chamarajanagar","Chikkaballapur","Chikkamagaluru","Chitradurga","Dakshina Kannada","Davanagere","Dharwad","Gadag","Hassan","Haveri","Kalaburagi (Gulbarga)","Kodagu","Kolar","Koppal","Mandya","Mysuru (Mysore)","Raichur","Ramanagara","Shivamogga (Shimoga)","Tumakuru","Udupi","Uttara Kannada","Vijayapura (Bijapur)","Yadgir"],
  "Kerala": ["Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram","Thrissur","Wayanad"],
  "Madhya Pradesh": ["Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori","Guna","Gwalior","Harda","Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone","Maihar","Mandla","Mandsaur","Mauganj","Morena","Narsimhapur","Neemuch","Niwari","Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Satna","Sehore","Seoni","Shahdol","Shajapur","Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha"],
  "Maharashtra": ["Ahmednagar","Akola","Amravati","Aurangabad (Chhatrapati Sambhajinagar)","Beed","Bhandara","Buldhana","Chandrapur","Dhule","Gadchiroli","Gondia","Hingoli","Jalgaon","Jalna","Kolhapur","Latur","Mumbai City","Mumbai Suburban","Nagpur","Nanded","Nandurbar","Nashik","Osmanabad (Dharashiv)","Palghar","Parbhani","Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal"],
  "Manipur": ["Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West","Jiribam","Kakching","Kamjong","Kangpokpi","Noney","Pherzawl","Senapati","Tamenglong","Tengnoupal","Thoubal","Ukhrul"],
  "Meghalaya": ["East Garo Hills","East Jaintia Hills","East Khasi Hills","Eastern West Khasi Hills","North Garo Hills","Ri Bhoi","South Garo Hills","South West Garo Hills","South West Khasi Hills","West Garo Hills","West Jaintia Hills","West Khasi Hills"],
  "Mizoram": ["Aizawl","Champhai","Hnahthial","Khawzawl","Kolasib","Lawngtlai","Lunglei","Mamit","Saitual","Serchhip"],
  "Nagaland": ["Chumoukedima","Dimapur","Kiphire","Kohima","Longleng","Mokokchung","Mon","Noklak","Peren","Phek","Shamator","Tseminyu","Tuensang","Wokha","Zunheboto"],
  "Odisha": ["Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh","Cuttack","Deogarh","Dhenkanal","Gajapati","Ganjam","Jagatsinghpur","Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara","Kendujhar","Khordha","Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nayagarh","Nuapada","Puri","Rayagada","Sambalpur","Subarnapur","Sundargarh"],
  "Punjab": ["Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib","Fazilka","Ferozepur","Gurdaspur","Hoshiarpur","Jalandhar","Kapurthala","Ludhiana","Malerkotla","Mansa","Moga","Mohali (SAS Nagar)","Muktsar","Pathankot","Patiala","Rupnagar","Sangrur","Shaheed Bhagat Singh Nagar","Tarn Taran"],
  "Rajasthan": ["Ajmer","Alwar","Anupgarh","Balotra","Banswara","Baran","Barmer","Beawar","Bharatpur","Bhilwara","Bikaner","Bundi","Chittorgarh","Churu","Dausa","Deeg","Dholpur","Didwana-Kuchaman","Dudu","Dungarpur","Gangapur City","Hanumangarh","Jaipur","Jaipur Rural","Jaisalmer","Jalore","Jhalawar","Jhunjhunu","Jodhpur","Jodhpur Rural","Karauli","Kekri","Khairthal-Tijara","Kotputli-Behror","Kota","Nagaur","Neem ka Thana","Pali","Phalodi","Pratapgarh","Rajsamand","Salumbar","Sanchore","Sawai Madhopur","Shahpura","Sikar","Sirohi","Sri Ganganagar","Tonk","Udaipur"],
  "Sikkim": ["Gangtok","Gyalshing","Namchi","Pakyong","Soreng","Mangan"],
  "Tamil Nadu": ["Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kallakurichi","Kancheepuram","Kanyakumari","Karur","Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram","Ranipet","Salem","Sivaganga","Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tirupathur","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore","Viluppuram","Virudhunagar"],
  "Telangana": ["Adilabad","Bhadradri Kothagudem","Hanumakonda","Hyderabad","Jagtial","Jangaon","Jayashankar Bhupalpally","Jogulamba Gadwal","Kamareddy","Karimnagar","Khammam","Kumuram Bheem","Mahabubabad","Mahabubnagar","Mancherial","Medak","Medchal-Malkajgiri","Mulugu","Nagarkurnool","Nalgonda","Narayanpet","Nirmal","Nizamabad","Peddapalli","Rajanna Sircilla","Rangareddy","Sangareddy","Siddipet","Suryapet","Vikarabad","Wanaparthy","Warangal","Yadadri Bhuvanagiri"],
  "Tripura": ["Dhalai","Gomati","Khowai","North Tripura","Sepahijala","Sipahijala","South Tripura","Unakoti","West Tripura"],
  "Uttar Pradesh": ["Agra","Aligarh","Ambedkar Nagar","Amethi","Amroha","Auraiya","Ayodhya","Azamgarh","Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki","Bareilly","Basti","Bhadohi","Bijnor","Budaun","Bulandshahr","Chandauli","Chitrakoot","Deoria","Etah","Etawah","Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar","Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi","Kheri","Kushinagar","Lalitpur","Lucknow","Maharajganj","Mahoba","Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Pilibhit","Pratapgarh","Prayagraj","Raebareli","Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur","Shamli","Shravasti","Siddharthnagar","Sitapur","Sonbhadra","Sultanpur","Unnao","Varanasi"],
  "Uttarakhand": ["Almora","Bageshwar","Chamoli","Champawat","Dehradun","Haridwar","Nainital","Pauri Garhwal","Pithoragarh","Rudraprayag","Tehri Garhwal","Udham Singh Nagar","Uttarkashi"],
  "West Bengal": ["Alipurduar","Bankura","Birbhum","Cooch Behar","Dakshin Dinajpur","Darjeeling","Hooghly","Howrah","Jalpaiguri","Jhargram","Kalimpong","Kolkata","Malda","Murshidabad","Nadia","North 24 Parganas","Paschim Bardhaman","Paschim Medinipur","Purba Bardhaman","Purba Medinipur","Purulia","South 24 Parganas","Uttar Dinajpur"],
  // Union Territories
  "Andaman and Nicobar Islands": ["Nicobar","North and Middle Andaman","South Andaman"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli","Daman","Diu"],
  "Delhi": ["Central Delhi","East Delhi","New Delhi","North Delhi","North East Delhi","North West Delhi","Shahdara","South Delhi","South East Delhi","South West Delhi","West Delhi"],
  "Jammu and Kashmir": ["Anantnag","Bandipora","Baramulla","Budgam","Doda","Ganderbal","Jammu","Kathua","Kishtwar","Kulgam","Kupwara","Poonch","Pulwama","Rajouri","Ramban","Reasi","Samba","Shopian","Srinagar","Udhampur"],
  "Ladakh": ["Kargil","Leh"],
  "Lakshadweep": ["Lakshadweep"],
  "Puducherry": ["Karaikal","Mahe","Puducherry","Yanam"]
}

// ── Populate State dropdown ───────────────────────────────────────────────────
function populateStates() {
  const sel = document.getElementById('state')
  if (!sel) return
  const states = Object.keys(INDIA).sort()
  states.forEach(s => {
    const opt = document.createElement('option')
    opt.value = s
    opt.textContent = s
    sel.appendChild(opt)
  })
  sel.addEventListener('change', () => populateDistricts(sel.value))
}

function populateDistricts(state) {
  const sel = document.getElementById('district')
  if (!sel) return
  sel.innerHTML = '<option value="">Select District</option>'
  if (!state || !INDIA[state]) { sel.disabled = true; return }
  INDIA[state].forEach(d => {
    const opt = document.createElement('option')
    opt.value = d
    opt.textContent = d
    sel.appendChild(opt)
  })
  sel.disabled = false
}

// ── Pincode auto-fill ─────────────────────────────────────────────────────────
function initPincode() {
  const inp = document.getElementById('pincode')
  const spinner = document.getElementById('pincodeSpinner')
  const status = document.getElementById('pincodeStatus')
  if (!inp) return

  let debounce
  inp.addEventListener('input', () => {
    const v = inp.value.replace(/\D/g, '')
    inp.value = v
    clearTimeout(debounce)
    if (v.length !== 6) { if (status) { status.textContent = ''; status.className = 'pincode-status' }; return }
    debounce = setTimeout(() => lookupPincode(v), 500)
  })

  async function lookupPincode(pin) {
    try {
      if (spinner) spinner.style.display = 'block'
      if (status) { status.textContent = 'Looking up…'; status.className = 'pincode-status' }
      const res = await fetch('/api/pincode/' + pin)
      const data = await res.json().catch(() => null)
      if (spinner) spinner.style.display = 'none'
      if (!res.ok || !data || data.error) {
        if (status) { status.textContent = 'Pincode not found'; status.className = 'pincode-status err' }
        return
      }
      const stateName = data.state
      const distName  = data.district

      // Set state
      const stateSel = document.getElementById('state')
      if (stateSel && INDIA[stateName]) {
        stateSel.value = stateName
        populateDistricts(stateName)
        const distSel = document.getElementById('district')
        if (distSel) {
          const match = INDIA[stateName].find(d => d.toLowerCase().includes(distName.toLowerCase()) || distName.toLowerCase().includes(d.toLowerCase()))
          if (match) distSel.value = match
        }
      }
      if (status) { status.textContent = '✓ ' + distName + ', ' + stateName; status.className = 'pincode-status ok' }
    } catch(e) {
      if (spinner) spinner.style.display = 'none'
      if (status) { status.textContent = 'Could not look up pincode'; status.className = 'pincode-status err' }
    }
  }
}

// ── Password strength ─────────────────────────────────────────────────────────
function initPasswordStrength() {
  const pwd = document.getElementById('password')
  const wrap = document.getElementById('pwdStrength')
  const label = document.getElementById('pwdLabel')
  const segs = [1,2,3,4].map(i => document.getElementById('seg'+i))
  if (!pwd || !wrap) return
  pwd.addEventListener('input', () => {
    const v = pwd.value
    wrap.style.display = v ? 'block' : 'none'
    let score = 0
    if (v.length >= 8) score++
    if (/[A-Z]/.test(v)) score++
    if (/[0-9]/.test(v)) score++
    if (/[^A-Za-z0-9]/.test(v)) score++
    const classes = ['','weak','fair','good','strong']
    const labels  = ['','Weak','Fair','Good','Strong']
    segs.forEach((s,i) => { if(s) s.className = 'pwd-seg ' + (i < score ? classes[score] : '') })
    if (label) label.textContent = labels[score] || ''
  })

  // Toggle visibility
  const toggle = document.getElementById('togglePwd')
  if (toggle) toggle.addEventListener('click', () => {
    pwd.type = pwd.type === 'password' ? 'text' : 'password'
  })
}

// ── Register form submit ──────────────────────────────────────────────────────
function initRegisterForm() {
  const form = document.getElementById('registerForm')
  if (!form) return
  const btn   = document.getElementById('submitBtn')
  const alert = document.getElementById('alert')

  function showAlert(msg, type = 'error') {
    if (!alert) return
    alert.textContent = msg
    alert.className = 'alert alert-' + (type === 'error' ? 'error' : type === 'success' ? 'success' : 'info') + ' show'
  }
  function hideAlert() { if (alert) { alert.textContent = ''; alert.className = 'alert' } }

  form.addEventListener('submit', async e => {
    e.preventDefault()
    hideAlert()

    const firstName = document.getElementById('firstName').value.trim()
    const middleName = document.getElementById('middleName') ? document.getElementById('middleName').value.trim() : ''
    const lastName  = document.getElementById('lastName').value.trim()
    const email     = document.getElementById('email').value.trim()
    const password  = document.getElementById('password').value
    const confirm   = document.getElementById('confirmPassword').value
    const pincode   = document.getElementById('pincode').value.trim()
    const state     = document.getElementById('state').value
    const district  = document.getElementById('district').value
    const city      = document.getElementById('city') ? document.getElementById('city').value.trim() : ''
    const phone     = (document.getElementById('phone').value || '').trim()
    const agree     = document.getElementById('agree').checked

    if (!firstName) return showAlert('First name is required')
    if (!lastName)  return showAlert('Last name is required')
    if (!email)     return showAlert('Email is required')
    if (password.length < 8) return showAlert('Password must be at least 8 characters')
    if (password !== confirm) return showAlert('Passwords do not match')
    if (!state)     return showAlert('Please select your state')
    if (!district)  return showAlert('Please select your district')
    if (!city)      return showAlert('Please provide your city, town or village')
    if (!agree)     return showAlert('Please accept the terms to continue')

    btn.disabled = true
    btn.innerHTML = '<span class="spinner"></span> Creating account…'

    try {
      const combinedFirstName = firstName + (middleName ? ' ' + middleName : '')
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: combinedFirstName, last_name: lastName, email, password, phone, state, district, pincode, city })
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        // Save token securely
        if (data.token) {
          sessionStorage.setItem('_ft', data.token)
          sessionStorage.setItem('_fu', JSON.stringify(data.user || { firstName, lastName, email }))
        }
        showAlert('Account created! Redirecting…', 'success')
        setTimeout(() => window.location.href = 'dashboard.html', 1200)
      } else {
        btn.disabled = false
        btn.innerHTML = 'Create Account & Start Trial'
        showAlert(data.message || data.error || 'Registration failed. Please try again.')
      }
    } catch(err) {
      btn.disabled = false
      btn.innerHTML = 'Create Account & Start Trial'
      showAlert('Network error. Please check your connection.')
    }
  })
}

// ── Security helpers (shared across all pages) ────────────────────────────────
;(function initSecurity() {
  const INACTIVITY_MS = 15 * 60 * 1000
  function getToken() { return sessionStorage.getItem('_ft') || null }

  // 15-min inactivity auto-logout
  let _idle
  function resetIdle() {
    clearTimeout(_idle)
    if (getToken()) {
      _idle = setTimeout(() => {
        sessionStorage.clear()
        window.location.href = 'login.html?reason=timeout'
      }, INACTIVITY_MS)
    }
  }
  ;['mousemove','keydown','click','touchstart'].forEach(e => window.addEventListener(e, resetIdle, { passive:true }))
  resetIdle()

  // Redirect logged-in users away from auth pages
  const page = location.pathname.split('/').pop()
  if ((page === 'login.html' || page === 'register.html') && getToken()) {
    window.location.replace('dashboard.html')
  }

  // Show timeout message
  if (page === 'login.html' && location.search.includes('reason=timeout')) {
    window.addEventListener('DOMContentLoaded', () => {
      const a = document.getElementById('alert')
      if (a) { a.textContent = 'Signed out after 15 minutes of inactivity.'; a.className = 'alert alert-warning show' }
    })
  }
})()

// ── Real-time Email & Phone uniqueness ────────────────────────────────────────
function initRealtimeValidation() {
  const emailInp = document.getElementById('email')
  const emailErr = document.getElementById('emailError')
  if (emailInp && emailErr) {
    emailInp.addEventListener('blur', async () => {
      const v = emailInp.value.trim()
      if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return
      const res = await fetch('/api/auth/check-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: v }) }).catch(()=>null)
      const data = res ? await res.json().catch(()=>({})) : {}
      if (data.exists) {
        emailErr.innerHTML = 'Email already registered. <a href="login.html" style="font-weight:600;">Log in instead?</a>'
        emailInp.style.borderColor = '#ef4444'
      }
    })
    emailInp.addEventListener('input', () => { emailErr.innerHTML = ''; emailInp.style.borderColor = '' })
  }

  const phoneInp = document.getElementById('phone')
  const phoneErr = document.getElementById('phoneError')
  if (phoneInp && phoneErr) {
    phoneInp.addEventListener('blur', async () => {
      const v = phoneInp.value.trim()
      if (v.length < 10) return
      const res = await fetch('/api/auth/check-phone', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: v }) }).catch(()=>null)
      const data = res ? await res.json().catch(()=>({})) : {}
      if (data.exists) {
        phoneErr.innerHTML = 'Phone number already registered. <a href="login.html" style="font-weight:600;">Log in instead?</a>'
        phoneInp.style.borderColor = '#ef4444'
      }
    })
    phoneInp.addEventListener('input', () => { phoneErr.innerHTML = ''; phoneInp.style.borderColor = '' })
  }
}

// ── Boot ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  populateStates()
  initPincode()
  initPasswordStrength()
  initRegisterForm()
  initRealtimeValidation()
})

