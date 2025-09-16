// Cadastro.js - Lógica de validação e envio do formulário de cadastro

// Configuração da API
const API_BASE_URL = '/api';

// Elementos do DOM
let formElements = {};

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    initializeFormElements();
    setupEventListeners();
    setupPasswordValidation();
});

// Inicializa referências dos elementos do formulário
function initializeFormElements() {
    formElements = {
        form: document.getElementById('cadastroForm'),
        nomeCompleto: document.getElementById('nomeCompleto'),
        email: document.getElementById('email'),
        curso: document.getElementById('curso'),
        semestre: document.getElementById('semestre'),
        senha: document.getElementById('senha'),
        confirmarSenha: document.getElementById('confirmarSenha'),
        termos: document.getElementById('termos'),
        submitBtn: document.getElementById('submitBtn'),
        loading: document.getElementById('loading'),
        successMessage: document.getElementById('successMessage'),
        errorMessage: document.getElementById('errorMessage')
    };
}

// Configura os event listeners
function setupEventListeners() {
    // Validação em tempo real
    formElements.nomeCompleto.addEventListener('blur', () => validateNomeCompleto());
    formElements.email.addEventListener('blur', () => validateEmail());
    formElements.curso.addEventListener('change', () => validateCurso());
    formElements.semestre.addEventListener('change', () => validateSemestre());
    formElements.senha.addEventListener('input', () => validateSenha());
    formElements.confirmarSenha.addEventListener('blur', () => validateConfirmarSenha());
    formElements.termos.addEventListener('change', () => validateTermos());

    // Submit do formulário
    formElements.form.addEventListener('submit', handleFormSubmit);

    // Previne espaços no início dos campos de texto
    formElements.nomeCompleto.addEventListener('input', preventLeadingSpaces);
    formElements.email.addEventListener('input', preventLeadingSpaces);
}

// Remove espaços no início dos campos
function preventLeadingSpaces(event) {
    if (event.target.value.startsWith(' ')) {
        event.target.value = event.target.value.trimStart();
    }
}

// Configuração da validação em tempo real da senha
function setupPasswordValidation() {
    formElements.senha.addEventListener('input', function() {
        const senha = this.value;
        
        // Requisitos da senha
        const requirements = {
            length: senha.length >= 8,
            uppercase: /[A-Z]/.test(senha),
            lowercase: /[a-z]/.test(senha),
            number: /[0-9]/.test(senha)
        };
        
        // Atualiza a interface dos requisitos
        updatePasswordRequirement('lengthReq', requirements.length);
        updatePasswordRequirement('uppercaseReq', requirements.uppercase);
        updatePasswordRequirement('lowercaseReq', requirements.lowercase);
        updatePasswordRequirement('numberReq', requirements.number);
        
        // Valida a confirmação de senha se já foi preenchida
        if (formElements.confirmarSenha.value) {
            validateConfirmarSenha();
        }
    });
}

// Atualiza o status visual dos requisitos da senha
function updatePasswordRequirement(elementId, isValid) {
    const element = document.getElementById(elementId);
    if (isValid) {
        element.classList.add('valid');
    } else {
        element.classList.remove('valid');
    }
}

// Função para mostrar/ocultar senha
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = document.getElementById(`toggleIcon${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)}`);
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Validações individuais dos campos
function validateNomeCompleto() {
    const nome = formElements.nomeCompleto.value.trim();
    const errorElement = document.getElementById('nomeCompletoError');
    
    if (!nome) {
        showFieldError(formElements.nomeCompleto, errorElement, 'Nome completo é obrigatório');
        return false;
    }
    
    if (nome.length < 3) {
        showFieldError(formElements.nomeCompleto, errorElement, 'Nome deve ter pelo menos 3 caracteres');
        return false;
    }
    
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nome)) {
        showFieldError(formElements.nomeCompleto, errorElement, 'Nome deve conter apenas letras e espaços');
        return false;
    }
    
    // Verifica se tem pelo menos nome e sobrenome
    const partesNome = nome.split(' ').filter(parte => parte.length > 0);
    if (partesNome.length < 2) {
        showFieldError(formElements.nomeCompleto, errorElement, 'Digite nome e sobrenome');
        return false;
    }
    
    showFieldSuccess(formElements.nomeCompleto, errorElement);
    return true;
}

function validateEmail() {
    const email = formElements.email.value.trim().toLowerCase();
    const errorElement = document.getElementById('emailError');
    
    if (!email) {
        showFieldError(formElements.email, errorElement, 'E-mail é obrigatório');
        return false;
    }
    
    // Validação do formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError(formElements.email, errorElement, 'Formato de e-mail inválido');
        return false;
    }
    
    // Validação do domínio institucional
    if (!email.endsWith('@universidade.edu.br')) {
        showFieldError(formElements.email, errorElement, 'O e-mail informado não é um e-mail institucional válido');
        return false;
    }
    
    // Atualiza o valor no campo para garantir lowercase
    formElements.email.value = email;
    
    showFieldSuccess(formElements.email, errorElement);
    return true;
}

function validateCurso() {
    const curso = formElements.curso.value;
    const errorElement = document.getElementById('cursoError');
    
    if (!curso) {
        showFieldError(formElements.curso, errorElement, 'Seleção do curso é obrigatória');
        return false;
    }
    
    showFieldSuccess(formElements.curso, errorElement);
    return true;
}

function validateSemestre() {
    const semestre = formElements.semestre.value;
    const errorElement = document.getElementById('semestreError');
    
    if (!semestre) {
        showFieldError(formElements.semestre, errorElement, 'Seleção do período é obrigatória');
        return false;
    }
    
    const semestreNum = parseInt(semestre);
    if (semestreNum < 1 || semestreNum > 12) {
        showFieldError(formElements.semestre, errorElement, 'Período deve estar entre 1 e 12');
        return false;
    }
    
    showFieldSuccess(formElements.semestre, errorElement);
    return true;
}

function validateSenha() {
    const senha = formElements.senha.value;
    const errorElement = document.getElementById('senhaError');
    
    if (!senha) {
        showFieldError(formElements.senha, errorElement, 'Senha é obrigatória');
        return false;
    }
    
    // Validação dos requisitos da senha
    const requirements = {
        length: senha.length >= 8,
        uppercase: /[A-Z]/.test(senha),
        lowercase: /[a-z]/.test(senha),
        number: /[0-9]/.test(senha)
    };
    
    if (!requirements.length) {
        showFieldError(formElements.senha, errorElement, 'Senha deve ter pelo menos 8 caracteres');
        return false;
    }
    
    if (!requirements.uppercase) {
        showFieldError(formElements.senha, errorElement, 'Senha deve conter pelo menos uma letra maiúscula');
        return false;
    }
    
    if (!requirements.lowercase) {
        showFieldError(formElements.senha, errorElement, 'Senha deve conter pelo menos uma letra minúscula');
        return false;
    }
    
    if (!requirements.number) {
        showFieldError(formElements.senha, errorElement, 'Senha deve conter pelo menos um número');
        return false;
    }
    
    showFieldSuccess(formElements.senha, errorElement);
    return true;
}

function validateConfirmarSenha() {
    const senha = formElements.senha.value;
    const confirmarSenha = formElements.confirmarSenha.value;
    const errorElement = document.getElementById('confirmarSenhaError');
    
    if (!confirmarSenha) {
        showFieldError(formElements.confirmarSenha, errorElement, 'Confirmação de senha é obrigatória');
        return false;
    }
    
    if (senha !== confirmarSenha) {
        showFieldError(formElements.confirmarSenha, errorElement, 'Senhas não coincidem');
        return false;
    }
    
    showFieldSuccess(formElements.confirmarSenha, errorElement);
    return true;
}

function validateTermos() {
    const termos = formElements.termos.checked;
    const errorElement = document.getElementById('termosError');
    
    if (!termos) {
        showFieldError(formElements.termos, errorElement, 'Você deve aceitar os termos e condições');
        return false;
    }
    
    showFieldSuccess(formElements.termos, errorElement);
    return true;
}

// Funções auxiliares para mostrar status dos campos
function showFieldError(field, errorElement, message) {
    field.classList.remove('valid');
    field.classList.add('invalid');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Adiciona efeito de shake
    field.parentElement.classList.add('shake');
    setTimeout(() => {
        field.parentElement.classList.remove('shake');
    }, 500);
}

function showFieldSuccess(field, errorElement) {
    field.classList.remove('invalid');
    field.classList.add('valid');
    errorElement.textContent = '';
    errorElement.style.display = 'none';
}

// Validação completa do formulário
function validateForm() {
    const validations = [
        validateNomeCompleto(),
        validateEmail(),
        validateCurso(),
        validateSemestre(),
        validateSenha(),
        validateConfirmarSenha(),
        validateTermos()
    ];
    
    return validations.every(isValid => isValid);
}

// Manipulador do envio do formulário
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Limpa mensagens anteriores
    hideMessages();
    
    // Valida o formulário
    if (!validateForm()) {
        showError('Por favor, corrija os erros antes de continuar.');
        return;
    }
    
    // Desabilita o botão e mostra loading
    setLoadingState(true);
    
    try {
        // Coleta os dados do formulário
        const formData = {
            nomeCompleto: formElements.nomeCompleto.value.trim(),
            email: formElements.email.value.trim().toLowerCase(),
            curso: formElements.curso.value,
            semestre: parseInt(formElements.semestre.value),
            senha: formElements.senha.value
        };
        
        // Envia para a API
        const response = await fetch(`${API_BASE_URL}/usuarios/cadastro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Sucesso
            showSuccess('Conta criada com sucesso! Redirecionando...');
            
            // Simula envio de email
            simulateEmailSend(formData.email);
            
            // Redireciona após 3 segundos
            setTimeout(() => {
                window.location.href = 'sucesso.html?email=' + encodeURIComponent(formData.email);
            }, 3000);
            
        } else {
            // Erro da API
            if (response.status === 409) {
                showError('Este e-mail já está cadastrado no sistema. Tente fazer login ou use outro e-mail.');
                formElements.email.focus();
            } else if (response.status === 400) {
                showError(result.error || 'Dados inválidos. Verifique as informações e tente novamente.');
            } else {
                showError('Erro interno do servidor. Tente novamente mais tarde.');
            }
        }
        
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        showError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
        setLoadingState(false);
    }
}

// Simula o envio de email de confirmação
function simulateEmailSend(email) {
    console.log(`📧 Simulando envio de email de confirmação para: ${email}`);
    
    // Em uma implementação real, aqui seria feita a chamada para o serviço de email
    // Exemplo: sendConfirmationEmail(email, userId);
    
    // Por enquanto, apenas simula o envio
    setTimeout(() => {
        console.log(`✅ Email de confirmação "enviado" para ${email}`);
    }, 1000);
}

// Controla o estado de loading
function setLoadingState(isLoading) {
    if (isLoading) {
        formElements.submitBtn.disabled = true;
        formElements.submitBtn.style.display = 'none';
        formElements.loading.style.display = 'block';
    } else {
        formElements.submitBtn.disabled = false;
        formElements.submitBtn.style.display = 'block';
        formElements.loading.style.display = 'none';
    }
}

// Funções para mostrar mensagens
function showSuccess(message) {
    hideMessages();
    document.getElementById('successText').textContent = message;
    formElements.successMessage.style.display = 'flex';
    formElements.successMessage.scrollIntoView({ behavior: 'smooth' });
}

function showError(message) {
    hideMessages();
    document.getElementById('errorText').textContent = message;
    formElements.errorMessage.style.display = 'flex';
    formElements.errorMessage.scrollIntoView({ behavior: 'smooth' });
}

function hideMessages() {
    formElements.successMessage.style.display = 'none';
    formElements.errorMessage.style.display = 'none';
}

// Função global para toggle de senha (chamada pelo HTML)
window.togglePassword = togglePassword;

// Verificação se o servidor está rodando
document.addEventListener('DOMContentLoaded', function() {
    checkServerStatus();
});

async function checkServerStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (!response.ok) {
            showWarning('Servidor offline. Algumas funcionalidades podem não estar disponíveis.');
        }
    } catch (error) {
        showWarning('Não foi possível conectar ao servidor. Verifique sua conexão.');
    }
}

function showWarning(message) {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'message warning';
    warningDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span>${message}</span>`;
    warningDiv.style.backgroundColor = '#fff3cd';
    warningDiv.style.color = '#856404';
    warningDiv.style.border = '1px solid #ffeaa7';
    
    const form = document.querySelector('.cadastro-form');
    form.insertBefore(warningDiv, form.firstChild);
    
    // Remove a mensagem após 5 segundos
    setTimeout(() => {
        if (warningDiv.parentNode) {
            warningDiv.parentNode.removeChild(warningDiv);
        }
    }, 5000);
}