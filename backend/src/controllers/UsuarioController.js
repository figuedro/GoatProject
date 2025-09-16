const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

class UsuarioController {
    static async cadastro(req, res) {
        try {
            const { nomeCompleto, email, curso, semestre, senha } = req.body;
            
            // Validação dos campos obrigatórios
            if (!nomeCompleto || !email || !curso || !semestre || !senha) {
                return res.status(400).json({
                    error: 'Todos os campos são obrigatórios',
                    campos: ['nomeCompleto', 'email', 'curso', 'semestre', 'senha']
                });
            }
            
            // Validação do email institucional
            if (!email.endsWith('@universidade.edu.br')) {
                return res.status(400).json({
                    error: 'Email deve ser institucional (@universidade.edu.br)'
                });
            }
            
            // Validação do formato do email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    error: 'Formato de email inválido'
                });
            }
            
            // Validação do semestre
            if (!Number.isInteger(semestre) || semestre < 1 || semestre > 12) {
                return res.status(400).json({
                    error: 'Semestre deve ser um número entre 1 e 12'
                });
            }
            
            // Validação da senha
            if (senha.length < 6) {
                return res.status(400).json({
                    error: 'Senha deve ter pelo menos 6 caracteres'
                });
            }
            
            // Verificar se o email já existe
            const usuarioExistente = await Usuario.findByEmail(email);
            if (usuarioExistente) {
                return res.status(409).json({
                    error: 'Email já cadastrado no sistema'
                });
            }
            
            // Hash da senha
            const saltRounds = 12;
            const senhaHash = await bcrypt.hash(senha, saltRounds);
            
            // Criar usuário
            const novoUsuario = await Usuario.create({
                nomeCompleto,
                email,
                curso,
                semestre,
                senha: senhaHash
            });
            
            // Retornar sucesso com ID do usuário criado
            res.status(201).json({
                message: 'Usuário cadastrado com sucesso',
                id: novoUsuario.id,
                usuario: {
                    id: novoUsuario.id,
                    nomeCompleto,
                    email,
                    curso,
                    semestre
                }
            });
            
        } catch (error) {
            console.error('Erro no cadastro de usuário:', error);
            
            // Tratamento específico para erro de email duplicado (caso não capturado antes)
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({
                    error: 'Email já cadastrado no sistema'
                });
            }
            
            res.status(500).json({
                error: 'Erro interno do servidor'
            });
        }
    }
    
    static async listarUsuarios(req, res) {
        try {
            const usuarios = await Usuario.getAll();
            res.json({
                usuarios,
                total: usuarios.length
            });
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            res.status(500).json({
                error: 'Erro interno do servidor'
            });
        }
    }
    
    static async buscarUsuario(req, res) {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    error: 'ID do usuário inválido'
                });
            }
            
            const usuario = await Usuario.findById(id);
            
            if (!usuario) {
                return res.status(404).json({
                    error: 'Usuário não encontrado'
                });
            }
            
            res.json({ usuario });
            
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).json({
                error: 'Erro interno do servidor'
            });
        }
    }
}

module.exports = UsuarioController;