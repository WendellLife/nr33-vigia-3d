# NR 33 • Vigia (jogo educativo 3D)

Jogo educativo da série de jogos de segurança do trabalho, sobre **espaços confinados (NR 33)**, na função de **vigia**. Capacitação da função: **16 horas** iniciais e 8 horas a cada 12 meses (Anexo III da NR 33).

Você é a **vigia** da limpeza interna do tanque T-02 de uma estação de tratamento. Fique no posto, só deixe entrar quem está na PET, mantenha a contagem e a comunicação, opere o guincho, ordene o abandono, acione o resgate e nunca entre.

As outras funções têm jogo próprio, na mesma operação e no mesmo padrão: [Supervisor de entrada](https://github.com/WendellLife/nr33-supervisor-3d) • [Trabalhador autorizado](https://github.com/WendellLife/nr33-trabalhador-3d).

> **Conteúdo educativo.** Não substitui a capacitação com prática e avaliação, a PET, os procedimentos nem o plano de resgate da empresa. Leia o [SAFETY-NOTES.md](SAFETY-NOTES.md).

## Como abrir

Requer Node.js 18 ou superior (ou Python 3).

- **Windows:** dê dois cliques em `INICIAR.cmd` e abra http://127.0.0.1:8765
- **Qualquer sistema:** `npm start` (ou `node server.mjs`) e abra http://127.0.0.1:8765
- **Hospedagem estática:** publique a pasta `dist/` como está. Não há build nem dependências npm. O Three.js 0.170.0 está em `dist/`.

## Controles

| Ação | Teclado | Celular |
|---|---|---|
| Mover | WASD ou setas | botões de seta na tela |
| Correr | Shift | — |
| Interagir | E | botão AÇÃO |
| Fontes e origem do conteúdo | botão **Fontes** | botão **Fontes** |
| Pausar | Esc ou botão Ⅱ | botão Ⅱ |

O losango verde é você. O losango azul, o alvo luminoso e as setas no chão marcam o destino.

**Painel do detector** (canto superior direito): leitura de oxigênio, inflamáveis (% do LIE), gás sulfídrico e monóxido de carbono, com o limite de cada um, em verde quando aceitável e em vermelho quando não; a situação da **PET**; e **quantas pessoas estão dentro do tanque**.

**Tanque em corte:** o T-02 aparece sem o teto, para o jogador ver o interior. A entrada é só pela boca de visita, onde ficam a placa do Anexo I, o tripé com guincho e o posto do vigia. Quando a atmosfera fica perigosa, o interior ganha uma névoa amarelada e o alarme pisca na entrada.

## Origem do conteúdo (muito importante)

| Etiqueta | Significa |
|---|---|
| **Em vigor** | NR 33 com a redação da Portaria SEPRT 1.690/2022, em vigor desde 03/10/2022, incluídos os Anexos I (sinalização), II (modelo de PET) e III (capacitação). Também NR 7 quando citada. |
| **Boa prática — não é item de NR** | Procedimentos técnicos úteis, que não são exigência de NR. Os limites de H₂S (8 ppm) e CO (39 ppm) do painel são os limites de tolerância da NR 15, usados como referência. |

Etiquetas com **“conferir subitem”** marcam o Quadro 1 do Anexo III, que deve ser conferido no texto oficial antes do uso em sala de aula.

## Sequência das 12 etapas

| # | Etapa | Origem |
|---|---|---|
| 1 | Confira a sua capacitação | 33.6.2 • Anexo III — Quadro 1: vigia, 16 h inicial e 8 h a cada 12 meses • 33.7.1 c) e d) |
| 2 | Não saia do posto | 33.3.4 c) • 33.3.4 g) |
| 3 | Só entra quem está na PET | 33.3.4 a) • 33.5.6 • 33.7.1 a) |
| 4 | Controle quem está dentro | 33.3.4 b) • Boa prática: quadro de entrada e saída com nome e horário (boa prática) |
| 5 | Mantenha a comunicação | 33.3.4 c) • Boa prática: chamadas em intervalos fixos e sinal combinado de abandono (boa prática) |
| 6 | Opere o movimentador de pessoas | 33.3.4 e) • 33.5.2 • Boa prática: inspeção do tripé, do guincho e do cabo antes do uso (boa prática) |
| 7 | Você precisa sair do posto | 33.3.4 f) • 33.3.3 g) • 33.5.11 |
| 8 | Acompanhe o monitoramento | 33.5.15.3 • 33.5.15.4 • 33.5.16.2 |
| 9 | Ordene o abandono | 33.3.4 f) |
| 10 | Não entre: acione o resgate | 33.3.4 d) • 33.3.4 c) • 33.5.17.2 • 33.3.6 a) |
| 11 | Comunique ao supervisor | 33.3.4 h) • 33.3.3 e) • 33.5.11 |
| 12 | Feche a contagem | 33.3.4 b) • 33.5.11 |

Cada decisão tem três opções, uma única correta, e cada opção tem um feedback didático.

## Personagens

Você é: **Vigia**. Com você na operação: Marcos (supervisor de entrada), Rui e Bento (trabalhadores autorizados), Sandra (líder da equipe de emergência), Gil (mecânico de contratada) e Nelson (operador de processo).

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| `dist/index.html`, `dist/style.css` | Interface (mesma da série, com painel do detector e etiquetas de origem) |
| `dist/rules.mjs` | Regras puras e testáveis: etapas, decisões, referências, capacitação, atmosfera, PET, contagem e objetos do cenário |
| `dist/layout.mjs` | Planta da estação, tanque, equipe e estados de cada pessoa |
| `dist/crew.mjs` | Fase de cada pessoa conforme o andamento e busca de rotas |
| `dist/scenery.mjs` | Cenário 3D |
| `dist/game.mjs` | Jogo: câmera, equipe, painel do detector e diálogos |
| `dist/graphics.mjs` | Qualidade, pós-processamento e texturas |
| `dist/characters.mjs` | Personagens com esqueleto, animações e poses de ação |
| `dist/models/` | Modelos GLB dos personagens |
| `server.mjs`, `INICIAR.cmd` | Servidor local (127.0.0.1:8765) |
| `manifest.mjs` | Gera o `MANIFESTO-SHA256.json` (`npm run manifest`) |
| `test.mjs` | Testes em Node puro (`npm test`) |

## Testes

```
npm test
```

Cobrem: ordem das etapas; uma única resposta certa por decisão, com feedback; todo item e alínea da NR 33 citados existem no texto em vigor; a função cobre todas as suas atribuições na norma; carga horária da capacitação; limites e leituras da atmosfera, coerentes com os textos; situação da PET e contagem em cada etapa; gás e alarme no cenário só quando a leitura é perigosa; o tanque só se acessa pela boca de visita; e acessibilidade de todos os destinos.
