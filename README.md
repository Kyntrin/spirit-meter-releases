# Spirit Meter — distribuição

Página pública de distribuição do Spirit Meter, um overlay independente para SpiritVale.

**Status:** em desenvolvimento. Nenhuma release ou download público disponível neste momento.

Site: https://kyntrin.github.io/spirit-meter-releases/

## Escopo deste repositório

Somente o site estático, documentação pública e, futuramente, pacotes de distribuição e notas de versão. O desenvolvimento do aplicativo permanece em um repositório privado separado. Não copie seu histórico Git para cá.

## Publicação da página

GitHub Pages publica a raiz da branch `main`. A página usa HTML, CSS e JavaScript locais, sem dependências externas, analytics ou arquivos do jogo.

Idiomas: inglês, português, espanhol, chinês simplificado e japonês, os mesmos do overlay. O seletor salva a preferência localmente quando permitido; no primeiro acesso usamos o idioma compatível do navegador, com fallback para inglês. Sem JavaScript, o conteúdo inicial continua legível em português.

## Checklist antes da primeira release

- Validar o pacote no Windows com os testers.
- Revisar o conteúdo extraído do ZIP: não publicar fontes do backend, source maps, dumps, logs, credenciais, configurações pessoais ou arquivos de desenvolvimento.
- Revisar permissões de redistribuição de dependências e assets.
- Incluir instruções, requisitos e limitações conhecidas.
- Gerar SHA-256 do pacote final e registrar nas notas de versão.
- Publicar apenas os artefatos revisados em GitHub Releases e então habilitar os links de download na página.

Não existe sincronização automática com o repositório privado. Publicar pacotes requer uma etapa explícita de revisão; manter o repositório privado não protege fontes incluídos dentro do ZIP.
