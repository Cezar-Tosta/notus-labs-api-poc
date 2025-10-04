// Salvar API Key com feedback
function saveApiKey() {
  const input = document.getElementById('apiKey');
  const key = input.value.trim();
  if (!key) {
    alert('Por favor, insira uma API Key válida.');
    return;
  }

  const saved = localStorage.getItem('notusApiKey');
  if (saved === key) {
    alert('✅ A API Key já está salva no navegador.');
    return;
  }

  localStorage.setItem('notusApiKey', key);
  input.value = key;
  alert('✅ API Key salva com sucesso!');
}

// Carregar API Key salva
window.onload = () => {
  const saved = localStorage.getItem('notusApiKey');
  if (saved) document.getElementById('apiKey').value = saved;
};

// Helper para chamadas
async function callApi(method, path, body = null) {
  const apiKey = document.getElementById('apiKey').value || localStorage.getItem('notusApiKey');
  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) headers['x-api-key'] = apiKey;

  const url = `https://api.notus.team/api/v1${path}`;
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(url, options);
    let data;
    try {
      data = await res.json();
    } catch {
      data = { raw: await res.text() };
    }
    return { status: res.status, ...data };
  } catch (err) {
    return { error: err.message };
  }
}

// ROTA 1
async function testRoute1() {
  const addr = document.getElementById('r1_address').value;
  const eoa = document.getElementById('r1_eoa').value;
  const factory = document.getElementById('r1_factory').value;
  const params = new URLSearchParams();
  if (addr) params.append('address', addr);
  if (eoa) params.append('externallyOwnedAccount', eoa);
  if (factory) params.append('factory', factory);
  const result = await callApi('GET', `/wallets/address?${params}`);
  document.getElementById('result-r1').textContent = JSON.stringify(result, null, 2);
}

// ROTA 2
async function testRoute2() {
  const body = {};
  const eoa = document.getElementById('r2_eoa').value;
  const factory = document.getElementById('r2_factory').value;
  const salt = document.getElementById('r2_salt').value;
  if (eoa) body.externallyOwnedAccount = eoa;
  if (factory) body.factory = factory;
  if (salt) body.salt = salt;
  const result = await callApi('POST', '/wallets/register', body);
  document.getElementById('result-r2').textContent = JSON.stringify(result, null, 2);
}

// ROTA 3
async function testRoute3() {
  const addr = document.getElementById('r3_address').value;
  const body = {
    amount: document.getElementById('r3_amount').value,
    token: document.getElementById('r3_token').value,
    chainId: parseInt(document.getElementById('r3_chain').value),
    fromAddress: document.getElementById('r3_from').value
  };
  const result = await callApi('POST', `/wallets/${addr}/deposit`, body);
  document.getElementById('result-r3').textContent = JSON.stringify(result, null, 2);
}

// ROTA 4
async function testRoute4() {
  const addr = document.getElementById('r4_address').value;
  let meta;
  try {
    meta = JSON.parse(document.getElementById('r4_meta').value);
  } catch (e) {
    document.getElementById('result-r4').textContent = JSON.stringify({ error: 'JSON inválido' }, null, 2);
    return;
  }
  const result = await callApi('PATCH', `/wallets/${addr}/metadata`, { metadata: meta });
  document.getElementById('result-r4').textContent = JSON.stringify(result, null, 2);
}

// ROTA 5
async function testRoute5() {
  const id = document.getElementById('r5_id').value;
  const meta = document.getElementById('r5_meta').value;
  const result = await callApi('PATCH', `/wallets/transactions/${id}/metadata`, { metadata: meta });
  document.getElementById('result-r5').textContent = JSON.stringify(result, null, 2);
}

// ROTA 6
async function testRoute6() {
  const body = {
    firstName: "Teste",
    lastName: "Usuario",
    birthDate: "1990-01-01",
    documentCategory: "IDENTITY_CARD",
    documentCountry: "BRAZIL",
    documentId: "123456789"
  };
  const result = await callApi('POST', '/kyc/individual-verification-sessions/standard', body);
  document.getElementById('result-r6').textContent = JSON.stringify(result, null, 2);
}

// ROTA 7
async function testRoute7() {
  const body = {
    paymentMethodToSend: "PIX",
    amountToSendInFiatCurrency: 100,
    receiveCryptoCurrency: "USDC",
    chainId: 137,
    walletAddress: "0x34378c28a87ac84266211aa9b1c77caca241a659"
  };
  const result = await callApi('POST', '/fiat/deposit/quote', body);
  document.getElementById('result-r7').textContent = JSON.stringify(result, null, 2);
}