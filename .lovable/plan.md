# Login, pedidos e administração segura

## Resultado esperado
- Clientes entram com e-mail/senha ou Google antes de finalizar uma compra.
- Cada cliente vê seus próprios pedidos e acompanha pagamento, entrega ou retirada.
- O painel administrativo só aparece e só abre para contas com função de administrador.
- Produtos, variações, estoque e pagamento continuam centralizados na Shopify.

## Já concluído
- Loja Shopify reivindicada e conexão validada.
- Dois produtos cadastrados por R$ 60,00, com tamanhos PP, P, M, G, GG e XGG e fotos enviadas.
- Login por e-mail/senha e Google habilitado no Lovable Cloud.
- Estrutura segura criada para perfis, funções administrativas e pedidos, com acesso isolado por usuário.

## Implementação
1. Criar a tela de entrar/criar conta e manter o destino original após o acesso.
2. Adicionar sessão global, sair da conta e atalhos “Entrar”/“Minha conta” no cabeçalho.
3. Bloquear checkout para visitantes e direcioná-los ao login sem perder o carrinho.
4. Registrar a tentativa de compra no histórico do cliente antes de abrir o checkout Shopify.
5. Criar “Minha conta” com pedidos, situação do pagamento e método de recebimento.
6. Proteger `/admin` por sessão e função `admin`, ocultando o atalho para usuários comuns.
7. Atualizar o painel para mostrar pedidos autorizados pelas regras do banco.
8. Preparar a ligação de eventos da Shopify para atualizar automaticamente pagamento e entrega/retirada.

## Estoque
- Os tamanhos estão disponíveis para compra.
- A ferramenta de catálogo disponível não permite gravar diretamente a quantidade física “100” por tamanho ou por produto. Essa quantidade será ajustada no inventário da Shopify; até lá, a venda permanece permitida sem bloqueio por falta de estoque.

## Segurança e banco
- Funções ficam em tabela separada; nenhuma permissão administrativa depende do navegador.
- Clientes só acessam seus próprios registros; administradores acessam os pedidos necessários à gestão.
- Será mantido um SQL idempotente equivalente, pronto para reaplicação no ambiente de produção quando necessário.

## Validação
- Testar cadastro, confirmação de e-mail, login por senha e Google.
- Confirmar redirecionamento ao checkout somente após login.
- Confirmar que usuário comum não vê nem abre o painel administrativo.
- Confirmar catálogo, tamanhos, carrinho e criação do histórico.
- Testar telas em computador e celular e verificar erros do navegador.

## Dependências externas
- Para sincronizar automaticamente os estados reais de pagamento e entrega, será necessário cadastrar o endereço de eventos gerado pelo sistema na Shopify e guardar o segredo compartilhado com segurança.
- A primeira conta administradora será promovida somente depois que ela existir; a função não será concedida automaticamente a novos cadastros.
