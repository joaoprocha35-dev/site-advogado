// Dados usados na geração do HTML. Após editar, reinicie npm run dev ou faça o build.
export const site = {
  name: '[NOME DO ESCRITÓRIO]',
  lawyer: 'Geraldo',
  oab: '[OAB/UF Nº]',
  city: '[CIDADE/UF]',
  phone: '', // Ex.: +5511999999999; só números, espaços, parênteses, + ou hífen.
  email: '',
  whatsapp: '', // Número completo: DDI + DDD + número. Entre 10 e 15 dígitos.
  address: '',
  hours: '',
  serviceMode: '',
  region: '',
  biography: '',
  education: '',
  career: '',
  formEndpoint: '', // Endpoint HTTPS de um serviço que aceite POST JSON; não inserir segredos.
  privacyRetention: '',
  privacyServices: '', // Preencher ao integrar formulário, hospedagem e outros serviços.
  demo: true, // Só desativar depois de concluir TODA a revisão para publicação.
  domain: '', // Origem HTTPS real, sem caminho; libera canonical/OG e sitemap.
};

export function contactLinks(config = site) {
  const raw = config.phone.trim();
  const phone = raw.replace(/\D/g, '');
  const whatsapp = config.whatsapp.replace(/\D/g, '');
  const email = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(config.email) ? config.email : '';
  return {
    phone: /^[+\d\s()-]+$/.test(raw) && /^\d{10,15}$/.test(phone) ? `tel:+${phone}` : '',
    email: email ? `mailto:${email}` : '',
    whatsapp: /^\d{10,15}$/.test(whatsapp)
      ? `https://wa.me/${whatsapp}?text=${encodeURIComponent('Olá! Gostaria de obter informações sobre o atendimento do escritório.')}`
      : '',
  };
}
