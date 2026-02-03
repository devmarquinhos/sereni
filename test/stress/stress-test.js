import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuração do Teste
export const options = {
  stages: [
    { duration: '10s', target: 25 },  // Aquece com 10 usuários
    { duration: '30s', target: 75 },  // Sobe para 50 usuários simultâneos
    { duration: '30s', target: 250 }, // Estressa com 100 usuários simultâneos
    { duration: '10s', target: 0 },   // Esfria (acaba)
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% das requisições devem ser mais rápidas que 500ms
    http_req_failed: ['rate<0.01'],   // Menos de 1% de erro permitido
  },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  const loginPayload = JSON.stringify({
    email: 'marcos@email.com',
    password: 'senhasegura123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, params);

  const loginSuccess = check(loginRes, {
    'Login feito com sucesso': (r) => r.status === 201,
  });

  if (!loginSuccess) {
    return;
  }

  const authToken = loginRes.json('access_token');
  const authParams = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  };

  const profileRes = http.get(`${BASE_URL}/auth/me`, authParams);
  check(profileRes, {
    'Perfil carregado': (r) => r.status === 200,
  });

  const modulesRes = http.get(`${BASE_URL}/content/modules`, authParams);
  check(modulesRes, {
    'Módulos carregados': (r) => r.status === 200,
  });

  sleep(1);
}