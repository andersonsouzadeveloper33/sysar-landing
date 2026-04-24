'use strict';

// SYSAR Landing Page
// Arquivo: main.js
// Propósito: JavaScript para interatividade da landing page
//
// Funcionalidades implementadas:
// - Máscara de CNPJ e WhatsApp
// - Validação do formulário de leads
// - Simulação de envio de formulário

/* ========================================
   MÁSCARAS DE ENTRADA
   Formatação automática de CNPJ e WhatsApp
========================================= */

/**
 * Aplica máscara de CNPJ: 00.000.000/0000-00
 * @param {string} value - Valor do input
 * @returns {string} - Valor formatado
 */
function maskCNPJ(value) {
  const numbers = value.replace(/\D/g, '');
  const match = numbers.match(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);
  
  if (!match) return value;
  
  let formatted = '';
  if (match[1]) formatted += match[1];
  if (match[2]) formatted += '.' + match[2];
  if (match[3]) formatted += '.' + match[3];
  if (match[4]) formatted += '/' + match[4];
  if (match[5]) formatted += '-' + match[5];
  
  return formatted;
}

/**
 * Aplica máscara de WhatsApp: (00) 00000-0000
 * @param {string} value - Valor do input
 * @returns {string} - Valor formatado
 */
function maskWhatsApp(value) {
  const numbers = value.replace(/\D/g, '').slice(0, 11);
  if (numbers.length === 0) return '';
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 7) return `(${numbers.slice(0,2)}) ${numbers.slice(2)}`;
  return `(${numbers.slice(0,2)}) ${numbers.slice(2,7)}-${numbers.slice(7)}`;
}

/* ========================================
   VALIDAÇÃO DE FORMULÁRIO
   Validações de campos e formato
========================================= */

/**
 * Valida formato de e-mail
 * @param {string} email - E-mail a ser validado
 * @returns {boolean} - True se válido
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Mostra mensagem de erro em um campo
 * @param {HTMLElement} field - Campo com erro
 * @param {string} message - Mensagem de erro
 */
function showError(field, message) {
  const input = field.querySelector('.form-lead__input, .form-lead__select');
  if (!input) return;
  
  // Adiciona classe de erro
  input.classList.add('form-lead__input--error', 'form-lead__select--error');
  
  // Remove erro anterior se existir
  const existingError = field.querySelector('.form-lead__error');
  if (existingError) {
    existingError.remove();
  }
  
  // Cria e insere mensagem de erro
  const errorSpan = document.createElement('span');
  errorSpan.className = 'form-lead__error';
  errorSpan.textContent = message;
  field.appendChild(errorSpan);
}

/**
 * Remove mensagem de erro de um campo
 * @param {HTMLElement} input - Input do campo
 */
function clearError(input) {
  input.classList.remove('form-lead__input--error');
  
  const field = input.closest('.form-lead__field');
  if (!field) return;
  
  const errorSpan = field.querySelector('.form-lead__error');
  if (errorSpan) {
    errorSpan.remove();
  }
}

/**
 * Valida todos os campos do formulário
 * @param {HTMLFormElement} form - Formulário a validar
 * @returns {boolean} - True se todos os campos válidos
 */
function validateForm(form) {
  let isValid = true;
  
  // Valida nome
  const nome = form.querySelector('#nome');
  const nomeField = nome.closest('.form-lead__field');
  if (!nome.value.trim()) {
    showError(nomeField, 'Nome é obrigatório');
    isValid = false;
  }
  
  // Valida e-mail
  const email = form.querySelector('#email');
  const emailField = email.closest('.form-lead__field');
  if (!email.value.trim()) {
    showError(emailField, 'E-mail é obrigatório');
    isValid = false;
  } else if (!isValidEmail(email.value.trim())) {
    showError(emailField, 'E-mail inválido');
    isValid = false;
  }
  
  // Valida WhatsApp
  const whatsapp = form.querySelector('#whatsapp');
  const whatsappField = whatsapp.closest('.form-lead__field');
  const whatsappNumbers = whatsapp.value.replace(/\D/g, '');
  if (!whatsapp.value.trim()) {
    showError(whatsappField, 'WhatsApp é obrigatório');
    isValid = false;
  } else if (whatsappNumbers.length < 10) {
    showError(whatsappField, 'WhatsApp inválido');
    isValid = false;
  }
  
  // Valida select "O que você precisa?"
  const necessidade = form.querySelector('#necessidade');
  const necessidadeField = necessidade.closest('.form-lead__field');
  if (!necessidade.value) {
    showError(necessidadeField, 'Selecione uma opção');
    isValid = false;
  }
  
  // Valida campo "Outro" se estiver visível
  const outroDetalhes = form.querySelector('#outroDetalhes');
  if (necessidade.value === 'outro' && outroDetalhes) {
    const outroDetalhesField = outroDetalhes.closest('.form-lead__field');
    if (!outroDetalhes.value.trim()) {
      showError(outroDetalhesField, 'Especifique sua necessidade');
      isValid = false;
    }
  }
  
  return isValid;
}

/* ========================================
   ENVIO DO FORMULÁRIO
   Processamento e exibição de sucesso
========================================= */

/**
 * Processa o envio do formulário
 * @param {Event} event - Evento de submit
 */
function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitButton = form.querySelector('.form-lead__submit');
  
  // Valida o formulário
  if (!validateForm(form)) {
    return;
  }
  
  // Desabilita botão e muda texto
  submitButton.disabled = true;
  submitButton.textContent = 'Enviando...';
  
  // Simula envio com delay de 1 segundo
  setTimeout(() => {
    showSuccessMessage(form);
  }, 1000);
}

/**
 * Exibe mensagem de sucesso após envio
 * @param {HTMLFormElement} form - Formulário enviado
 */
function showSuccessMessage(form) {
  const formLead = form.closest('.form-lead');
  
  // Substitui conteúdo do form por mensagem de sucesso
  formLead.innerHTML = `
    <div class="form-lead__success">
      <p>Solicitação enviada com sucesso!</p>
      <p>Nossa equipe entrará em contato em breve.</p>
    </div>
  `;
}

/* ========================================
   INICIALIZAÇÃO
   Event listeners e configuração inicial
========================================= */

/**
 * Inicializa todos os event listeners da página
 */
function init() {
  // Máscara de CNPJ
  const cnpjInput = document.querySelector('#cnpj');
  if (cnpjInput) {
    cnpjInput.addEventListener('input', (e) => {
      e.target.value = maskCNPJ(e.target.value);
    });
  }
  
  // Máscara de WhatsApp
  const whatsappInput = document.querySelector('#whatsapp');
  if (whatsappInput) {
    whatsappInput.addEventListener('input', (e) => {
      e.target.value = maskWhatsApp(e.target.value);
    });
  }
  
  // Limpa erros ao digitar em qualquer campo
  const formInputs = document.querySelectorAll('.form-lead__input, .form-lead__select, .form-lead__textarea');
  formInputs.forEach((input) => {
    input.addEventListener('input', () => {
      clearError(input);
    });
  });
  
  // Validação e envio do formulário
  const form = document.querySelector('#leadForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
  
  // Toggle do formulário de orçamento
  const btnOrcamento = document.querySelector('#btnOrcamento');
  const formOrcamento = document.querySelector('#formOrcamento');
  if (btnOrcamento && formOrcamento) {
    btnOrcamento.addEventListener('click', () => {
      const isHidden = formOrcamento.hidden;
      formOrcamento.hidden = !isHidden;
      btnOrcamento.setAttribute('aria-expanded', String(isHidden));
    });
  }
  
  // Mostra/esconde campo "Outro" baseado na seleção
  const necessidadeSelect = document.querySelector('#necessidade');
  const outroField = document.querySelector('#outroField');
  const outroDetalhesInput = document.querySelector('#outroDetalhes');
  
  if (necessidadeSelect && outroField && outroDetalhesInput) {
    necessidadeSelect.addEventListener('change', () => {
      if (necessidadeSelect.value === 'outro') {
        outroField.style.display = 'block';
        outroDetalhesInput.required = true;
      } else {
        outroField.style.display = 'none';
        outroDetalhesInput.required = false;
        outroDetalhesInput.value = '';
        clearError(outroDetalhesInput);
      }
    });
  }
}

// Executa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);
