export function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const endpoint = form.dataset.endpoint;
  const button = form.querySelector('button[type="submit"]');
  const result = form.querySelector('.form-result');
  let pending = false;
  const fields = ['name','reply','subject','message'];
  function validate() {
    let firstInvalid;
    for (const name of fields) {
      const input = form.elements.namedItem(name);
      const value = input.value.trim();
      let error = value ? '' : 'Preencha este campo.';
      if (name === 'reply' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !(/^[+\d\s()-]{8,25}$/.test(value) && /^\d{8,15}$/.test(value.replace(/\D/g,'')))) {
        error = 'Informe um e-mail ou telefone válido.';
      }
      document.getElementById(`${name}-error`).textContent = error;
      input.setAttribute('aria-invalid', String(Boolean(error)));
      if (error && !firstInvalid) firstInvalid = input;
    }
    firstInvalid?.focus();
    return !firstInvalid;
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!endpoint || pending) return;
    result.textContent = '';
    if (!validate()) return;
    pending = true;
    button.disabled = true;
    button.setAttribute('aria-busy','true');
    const label = button.innerHTML;
    button.textContent = 'Enviando…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const payload = Object.fromEntries(fields.map(name => [name, form.elements.namedItem(name).value.trim()]));
      const response = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type':'application/json', 'Accept':'application/json' },
        body: JSON.stringify(payload), signal: controller.signal, credentials: 'omit',
      });
      if (!response.ok) throw new Error('send-failed');
      result.textContent = 'Mensagem enviada. Aguarde o retorno do escritório pelo canal informado.';
      form.reset();
    } catch {
      result.textContent = 'Não foi possível enviar. Seus dados foram preservados nos campos. Tente novamente ou consulte os canais de contato disponíveis.';
    } finally {
      clearTimeout(timeout);
      pending = false;
      button.disabled = false;
      button.removeAttribute('aria-busy');
      button.innerHTML = label;
    }
  });
}
