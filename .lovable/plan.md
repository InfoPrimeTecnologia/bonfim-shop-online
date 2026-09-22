# Cadastro com senha guiada, e-mail da marca e gestão de administradores

## Objetivo
- Facilitar a criação de senha com requisitos visíveis enquanto a pessoa digita.
- Exigir confirmação da senha antes de criar a conta.
- Manter a confirmação obrigatória por e-mail, sem marca Lovable visível.
- Tornar `luan.contasmu@gmail.com` o primeiro administrador com segurança.
- Criar uma área onde administradores possam consultar e adicionar outros administradores por e-mail.

## Implementação
1. **Cadastro e redefinição de senha**
   - Mostrar requisitos claros e estado de atendimento em tempo real.
   - Adicionar campo “Confirmar senha”, opção de visualizar/ocultar e mensagens em português.
   - Validar nome, e-mail e senha antes do envio, traduzindo o alerta de senha fraca para uma orientação útil.
2. **Validação por e-mail com identidade Bonfim**
   - Manter a conta bloqueada até a confirmação do e-mail.
   - Configurar os modelos de confirmação e recuperação com textos, cores e remetente do marketplace, usando o domínio próprio já conectado.
3. **Administradores**
   - Criar uma função protegida no backend que valida a sessão e a função administrativa no servidor.
   - Permitir listar administradores e promover uma conta já cadastrada informando o e-mail.
   - Permitir que `luan.contasmu@gmail.com` faça a promoção inicial somente ao entrar com esse mesmo e-mail e apenas enquanto ainda não existir administrador.
   - Adicionar a seção “Administradores” à navegação do painel.
4. **Segurança e validação**
   - Não expor e-mails de clientes; a busca e a promoção ocorrerão somente na função protegida.
   - Validar os dados tanto na tela quanto no backend.
   - Verificar cadastro, confirmação pendente, proteção do painel e gestão de administradores em desktop e celular.

## Alteração no banco
- A estrutura existente de funções em `user_roles` será reutilizada; não é necessária uma nova tabela.
- Se a implementação exigir ajuste de política, função ou permissão, o SQL idempotente de produção será atualizado e entregue junto da alteração.

## Observação
- O e-mail informado precisa criar e confirmar a conta antes de acessar o painel; a promoção inicial ocorrerá automaticamente no primeiro acesso confirmado.
