// Sucesso.js - Lógica para a página de sucesso

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
});

// Inicializa a página com as informações do usuário
function initializePage() {
    displayUserInfo();
    displayCurrentDate();
    animateElements();
}

// Configura os event listeners
function setupEventListeners() {
    const resendEmailBtn = document.getElementById('resendEmail');
    if (resendEmailBtn) {
        resendEmailBtn.addEventListener('click', handleResendEmail);
    }
}

// Exibe as informações do usuário
function displayUserInfo() {
    // Pega o email da URL (passado pelo formulário de cadastro)
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    
    const emailElement = document.getElementById('userEmail');
    if (email && emailElement) {
        emailElement.textContent = email;
    } else if (emailElement) {
        emailElement.textContent = 'Não informado';
    }
}

// Exibe a data atual
function displayCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        dateElement.textContent = now.toLocaleDateString('pt-BR', options);
    }
}

// Anima os elementos da página
function animateElements() {
    // Anima os passos um por um
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        setTimeout(() => {
            step.style.opacity = '0';
            step.style.transform = 'translateX(-20px)';
            step.style.transition = 'all 0.5s ease-out';
            
            setTimeout(() => {
                step.style.opacity = '1';
                step.style.transform = 'translateX(0)';
            }, 100);
        }, 200 * index);
    });
    
    // Anima os botões
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach((button, index) => {
        setTimeout(() => {
            button.style.opacity = '0';
            button.style.transform = 'translateY(20px)';
            button.style.transition = 'all 0.5s ease-out';
            
            setTimeout(() => {
                button.style.opacity = '1';
                button.style.transform = 'translateY(0)';
            }, 100);
        }, 1000 + (100 * index));
    });
}

// Manipula o reenvio de email
async function handleResendEmail() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    
    if (!email) {
        showToast('Erro: Email não encontrado', 'error');
        return;
    }
    
    // Mostra loading
    showLoading(true);
    
    try {
        // Simula chamada para API de reenvio de email
        await simulateResendEmail(email);
        
        // Sucesso
        showToast('E-mail reenviado com sucesso!', 'success');
        
        // Desabilita o botão temporariamente
        const resendBtn = document.getElementById('resendEmail');
        disableResendButton(resendBtn);
        
    } catch (error) {
        console.error('Erro ao reenviar email:', error);
        showToast('Erro ao reenviar e-mail. Tente novamente.', 'error');
    } finally {
        showLoading(false);
    }
}

// Simula o reenvio de email
function simulateResendEmail(email) {
    return new Promise((resolve, reject) => {
        console.log(`📧 Reenviando email de confirmação para: ${email}`);
        
        // Simula tempo de processamento
        setTimeout(() => {
            // Simula sucesso (90% de chance)
            if (Math.random() > 0.1) {
                console.log(`✅ Email de confirmação reenviado para ${email}`);
                resolve();
            } else {
                console.log(`❌ Falha ao reenviar email para ${email}`);
                reject(new Error('Falha no envio'));
            }
        }, 2000);
    });
}

// Controla o estado de loading
function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }
}

// Exibe toast de notificação
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastMessage) return;
    
    // Define a cor baseada no tipo
    if (type === 'error') {
        toast.style.background = '#dc3545';
    } else {
        toast.style.background = '#28a745';
    }
    
    // Define a mensagem e mostra o toast
    toastMessage.textContent = message;
    toast.style.display = 'block';
    
    // Remove o toast após 4 segundos
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            toast.style.display = 'none';
            toast.style.animation = 'slideInRight 0.3s ease-out';
        }, 300);
    }, 4000);
}

// Desabilita o botão de reenvio temporariamente
function disableResendButton(button) {
    if (!button) return;
    
    const originalText = button.innerHTML;
    let countdown = 60;
    
    button.disabled = true;
    button.style.opacity = '0.6';
    button.style.cursor = 'not-allowed';
    
    const updateButton = () => {
        button.innerHTML = `<i class="fas fa-clock"></i> Aguarde ${countdown}s`;
        countdown--;
        
        if (countdown < 0) {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
            button.innerHTML = originalText;
        } else {
            setTimeout(updateButton, 1000);
        }
    };
    
    updateButton();
}

// Verifica se há parâmetros na URL e trata erros
function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    
    if (!email) {
        // Se não há email na URL, pode ser que o usuário acessou diretamente
        const userInfoDiv = document.querySelector('.user-info');
        if (userInfoDiv) {
            userInfoDiv.style.display = 'none';
        }
        
        // Mostra mensagem alternativa
        const successMessage = document.querySelector('.success-message');
        if (successMessage) {
            successMessage.innerHTML = `
                <p>🎉 Seu cadastro foi realizado com sucesso!</p>
                <p>Você pode fazer login para acessar o sistema.</p>
            `;
        }
    }
}

// Adiciona animação CSS para slideOutRight
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Verifica parâmetros da URL quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    checkUrlParameters();
});

// Função para voltar ao cadastro (caso necessário)
function backToRegister() {
    if (confirm('Tem certeza que deseja voltar ao formulário de cadastro?')) {
        window.location.href = 'cadastro.html';
    }
}

// Função para ir direto para o login
function goToLogin() {
    window.location.href = 'login.html';
}

// Função para ir para a página inicial
function goToHome() {
    window.location.href = 'index.html';
}

// Analytics/Tracking (simulado)
function trackPageView() {
    console.log('📊 Página de sucesso visualizada');
    console.log('📧 Email de confirmação enviado');
    
    // Aqui você poderia enviar dados para analytics
    // Exemplo: gtag('event', 'sign_up', { method: 'email' });
}

// Chama tracking quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    trackPageView();
});

// Função para copiar email para clipboard (funcionalidade extra)
function copyEmailToClipboard() {
    const userEmail = document.getElementById('userEmail');
    if (userEmail && userEmail.textContent !== 'carregando...' && userEmail.textContent !== 'Não informado') {
        navigator.clipboard.writeText(userEmail.textContent).then(() => {
            showToast('E-mail copiado para a área de transferência!', 'success');
        }).catch(() => {
            showToast('Erro ao copiar e-mail', 'error');
        });
    }
}

// Adiciona evento de clique no email para copiar
document.addEventListener('DOMContentLoaded', function() {
    const userEmail = document.getElementById('userEmail');
    if (userEmail) {
        userEmail.style.cursor = 'pointer';
        userEmail.title = 'Clique para copiar';
        userEmail.addEventListener('click', copyEmailToClipboard);
    }
});

// Detecta se o usuário está saindo da página
window.addEventListener('beforeunload', function(e) {
    // Log para analytics
    console.log('📊 Usuário saindo da página de sucesso');
});

// Função de utilidade para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}