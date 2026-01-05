# Instruções para Migrar Cursos para MongoDB

Os cursos estão agora configurados para serem buscados do MongoDB através da API `/api/courses`.

## Passos para Migrar os Cursos

### 1. Acesse o Dashboard Admin
- Vá para `/admin/cursos`
- Clique em "Novo Curso"

### 2. Cadastre os Cursos (um por um)

Use os dados abaixo para cadastrar cada curso:

#### 1. Armas não letais
- **Título:** Armas não letais
- **Slug:** armas-nao-letais
- **Subtítulo:** Formação Especializada em Armas Não Letais
- **Descrição (Frente):** Aprenda técnicas de contenção e uso responsável de armamentos não letais.
- **Descrição (Verso):** Capacitação prática para o uso de armamentos não letais, como spray de pimenta, tasers e bastões retráteis. Enfoque em técnicas de contenção, controle de distúrbios e atuação preventiva com segurança.
- **Ícone:** thunderbolt

#### 2. Atualização de Vigilantes
- **Título:** Atualização de Vigilantes
- **Slug:** atualizacao-de-vigilantes
- **Subtítulo:** Atualização e Recapacitação em Segurança Privada
- **Descrição (Frente):** Reforce habilidades em vigilância, defesa pessoal e uso de armamentos.
- **Descrição (Verso):** Atualização obrigatória para vigilantes em atividade. Aulas teóricas e práticas com foco em vigilância patrimonial, defesa pessoal e uso de armamentos. Reforce suas habilidades e mantenha-se apto a atuar com excelência na segurança privada.
- **Ícone:** certificate

#### 3. Atualização Escolta Armada
- **Título:** Atualização Escolta Armada
- **Slug:** atualizacao-escolta-armada
- **Subtítulo:** Recapacitação em Operações de Escolta Armada
- **Descrição (Frente):** Mantenha-se atualizado em prevenção, reação e uso de armamentos em escoltas.
- **Descrição (Verso):** Treinamento de atualização para profissionais de escolta armada. Enfoque em técnicas preventivas, reação a ataques e prática com armamentos específicos, garantindo atuação eficiente e dentro das normas da segurança privada.
- **Ícone:** certificate

#### 4. Atualização Transporte de Valores
- **Título:** Atualização Transporte de Valores
- **Slug:** atualizacao-transporte-de-valores
- **Subtítulo:** Recapacitação em Operações de Transporte de Valores
- **Descrição (Frente):** Atualize seus conhecimentos em segurança e reações operacionais, com foco em práticas reais de transporte de valores.
- **Descrição (Verso):** Treinamento voltado para profissionais que já atuam na área e buscam reciclagem em técnicas de prevenção, resposta a incidentes e manejo seguro de armamentos. Inclui exercícios com pistola .380, escopeta calibre 12 e simulações em veículo blindado.
- **Ícone:** certificate

#### 5. Atualização Segurança Pessoal
- **Título:** Atualização Segurança Pessoal
- **Slug:** atualizacao-seguranca-pessoal (ou atualizacao-vssp)
- **Subtítulo:** Recapacitação em Segurança Pessoal Privada
- **Descrição (Frente):** Aprimore sua atuação em proteção de pessoas e segurança pessoal.
- **Descrição (Verso):** Curso obrigatório de atualização em Segurança Pessoal Privada. Revisão de técnicas de escolta de pessoas, prevenção de riscos, planejamento de rotas e uso adequado de armamentos para manter a excelência no serviço.
- **Ícone:** certificate

#### 6. Escolta Armada
- **Título:** Escolta Armada
- **Slug:** escolta-armada
- **Subtítulo:** Preparação para Operações de Escolta Armada
- **Descrição (Frente):** Capacite-se em prevenção, reação e uso de armamentos específicos.
- **Descrição (Verso):** Formação para atuar na proteção de cargas e valores com ações preventivas e reativas. Treinamento com pistola .380 e escopeta calibre 12, seguindo os padrões da segurança armada profissional.
- **Ícone:** pistol

#### 7. Extensão em Segurança Pessoal
- **Título:** Extensão em Segurança Pessoal
- **Slug:** extensao-seguranca-pessoal (ou vssp)
- **Subtítulo:** Especialização em Segurança Pessoal Privada
- **Descrição (Frente):** Domine técnicas avançadas de proteção de pessoas em diferentes cenários.
- **Descrição (Verso):** O curso de extensão em Segurança Pessoal Privada oferece formação aprofundada em estratégias de proteção de indivíduos. Inclui planejamento de segurança, escolta em diferentes situações e uso de armamentos, garantindo alta performance no setor.
- **Ícone:** house-user

#### 8. Formação de Vigilantes
- **Título:** Formação de Vigilantes
- **Slug:** formacao-de-vigilantes
- **Subtítulo:** Excelência em Segurança Privada
- **Descrição (Frente):** Capacite-se em vigilância, segurança patrimonial, defesa pessoal e uso de armamento.
- **Descrição (Verso):** Formação profissional para atuar na segurança privada, com foco em vigilância patrimonial, segurança de estabelecimentos, defesa pessoal e uso de armamentos letais e não letais. Prepare-se para proteger pessoas e patrimônios com responsabilidade e técnica.
- **Ícone:** police-officer

#### 9. Operador de CFTV
- **Título:** Operador de CFTV
- **Slug:** operador-de-cftv
- **Subtítulo:** Formação em Operação de Sistemas de Monitoramento
- **Descrição (Frente):** Aprenda a operar câmeras PTZ e sistemas de vigilância eletrônica.
- **Descrição (Verso):** Capacitação para operar sistemas de vigilância eletrônica com câmeras PTZ e equipamentos BOSCH. Inclui aulas práticas com rádio comunicação, simulações de pronta resposta e controle por mesa KBD universal.
- **Ícone:** security-camera

#### 10. Supervisão, Chefia e Segurança
- **Título:** Supervisão, Chefia e Segurança
- **Slug:** supervisao-chefia-e-seguranca
- **Subtítulo:** Liderança e Gestão em Segurança Privada
- **Descrição (Frente):** Aprenda liderança, análise de risco e técnicas de supervisão eficiente.
- **Descrição (Verso):** Curso voltado à formação de líderes na segurança privada. Aborda análise de risco, planejamento estratégico, tipos de liderança, motivação de equipe, regras de segurança, manuseio e vistoria de armamentos.
- **Ícone:** alert

#### 11. Transporte de Valores
- **Título:** Transporte de Valores
- **Slug:** transporte-de-valores
- **Subtítulo:** Formação Especializada em Transporte de Valores
- **Descrição (Frente):** Aprenda segurança, reação e práticas com armamentos e carro-forte.
- **Descrição (Verso):** Capacitação para atuar em carros-fortes com técnicas de prevenção e reação a ataques. Treinamento com pistola .380, escopeta calibre 12 e prática em veículo blindado.
- **Ícone:** truck

## Ícones Disponíveis

Os ícones devem ser especificados como string no campo "Ícone" do formulário:
- `thunderbolt` - Raio/Arma não letal
- `certificate` - Certificado
- `pistol` - Pistola
- `house-user` - Casa com usuário
- `police-officer` - Policial
- `security-camera` - Câmera de segurança
- `alert` - Alerta
- `truck` - Caminhão

## Notas

- Os campos Video e Imagens são opcionais
- Após cadastrar todos os cursos, eles aparecerão automaticamente na página inicial
- Você pode editar/excluir cursos a qualquer momento através do dashboard em `/admin/cursos`

