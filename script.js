// Salvar e carregar API Key
function saveApiKey() {
  const key = document.getElementById('apiKey').value;
  if (key) localStorage.setItem('notusApiKey', key);
}

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

// === SMART WALLETS ===
async function testWalletGet() {
  const addr = document.getElementById('getAddress').value;
  const eoa = document.getElementById('getEoa').value;
  const factory = document.getElementById('getFactory').value;
  const params = new URLSearchParams({ address: addr, externallyOwnedAccount: eoa, factory });
  const result = await callApi('GET', `/wallets/address?${params}`);
  document.getElementById('result-wallet-get').textContent = JSON.stringify(result, null, 2);
}

async function testWalletRegister() {
  const body = {
    externallyOwnedAccount: document.getElementById('eoaReg').value,
    factory: document.getElementById('factoryReg').value
  };
  const salt = document.getElementById('saltReg').value;
  if (salt) body.salt = salt;
  const result = await callApi('POST', '/wallets/register', body);
  document.getElementById('result-wallet-register').textContent = JSON.stringify(result, null, 2);
}

async function testPortfolio() {
  const addr = document.getElementById('portfolioAddress').value;
  const result = await callApi('GET', `/wallets/${addr}/portfolio`);
  document.getElementById('result-portfolio').textContent = JSON.stringify(result, null, 2);
}

async function testHistory() {
  const addr = document.getElementById('historyAddress').value;
  const result = await callApi('GET', `/wallets/${addr}/history`);
  document.getElementById('result-history').textContent = JSON.stringify(result, null, 2);
}

async function testDeposit() {
  const addr = document.getElementById('depositAddress').value;
  const body = {
    amount: document.getElementById('depositAmount').value,
    token: document.getElementById('tokenAddr').value,
    chainId: parseInt(document.getElementById('chainIdDep').value),
    fromAddress: document.getElementById('fromAddr').value
  };
  const result = await callApi('POST', `/wallets/${addr}/deposit`, body);
  document.getElementById('result-deposit').textContent = JSON.stringify(result, null, 2);
}

async function testUpdateWalletMetadata() {
  const addr = document.getElementById('metaWalletAddr').value;
  let meta;
  try {
    meta = JSON.parse(document.getElementById('walletMeta').value);
  } catch (e) {
    document.getElementById('result-wallet-meta').textContent = JSON.stringify({ error: 'JSON inválido' }, null, 2);
    return;
  }
  const result = await callApi('PATCH', `/wallets/${addr}/metadata`, { meta: meta });
  document.getElementById('result-wallet-meta').textContent = JSON.stringify(result, null, 2);
}

async function testUpdateTxMetadata() {
  const txId = document.getElementById('txIdMeta').value;
  const meta = document.getElementById('txMeta').value;
  const result = await callApi('PATCH', `/wallets/transactions/${txId}/metadata`, { meta: meta });
  document.getElementById('result-tx-meta').textContent = JSON.stringify(result, null, 2);
}

// === KYC ===
async function testKycCreate() {
  const body = {
    firstName: "João",
    lastName: "Silva",
    birthDate: "1990-01-15",
    documentCategory: "IDENTITY_CARD",
    documentCountry: "BRAZIL",
    documentId: "123456789",
    livenessRequired: false,
    email: "joao@example.com",
    address: "Rua Teste, 123",
    city: "São Paulo",
    state: "SP",
    postalCode: "01000-000"
  };
  const result = await callApi('POST', '/kyc/individual-verification-sessions/standard', body);
  document.getElementById('result-kyc-create').textContent = JSON.stringify(result, null, 2);
}

async function testKycCreateMinimal() {
  const body = {
    firstName: "João",
    lastName: "Silva",
    birthDate: "1990-01-15",
    documentCategory: "IDENTITY_CARD",
    documentCountry: "BRAZIL",
    documentId: "123456789"
  };
  const result = await callApi('POST', '/kyc/individual-verification-sessions/standard', body);
  document.getElementById('result-kyc-create-minimal').textContent = JSON.stringify(result, null, 2);
}

async function testKycGet() {
  const id = document.getElementById('kycSessionId').value;
  const result = await callApi('GET', `/kyc/individual-verification-sessions/standard/${id}`);
  document.getElementById('result-kyc-get').textContent = JSON.stringify(result, null, 2);
}

async function testKycProcess() {
  const id = document.getElementById('kycProcessId').value;
  const result = await callApi('POST', `/kyc/individual-verification-sessions/standard/${id}/process`);
  document.getElementById('result-kyc-process').textContent = JSON.stringify(result, null, 2);
}

async function testKycNotFound() {
  const result = await callApi('GET', '/kyc/individual-verification-sessions/standard/invalid-id');
  document.getElementById('result-kyc-notfound').textContent = JSON.stringify(result, null, 2);
}

// === FIAT ===
async function testFiatQuote() {
  const body = {
    paymentMethodToSend: "PIX",
    amountToSendInFiatCurrency: 100,
    receiveCryptoCurrency: "USDC",
    chainId: 137,
    walletAddress: "0x34378c28a87ac84266211aa9b1c77caca241a659"
  };
  const result = await callApi('POST', '/fiat/deposit/quote', body);
  document.getElementById('result-fiat-quote').textContent = JSON.stringify(result, null, 2);
}