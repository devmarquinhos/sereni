import { PrismaClient, lesson_step_type, module_type } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Começando o seed...');

  // 1. Criar o Módulo de Ansiedade
  const moduloAnsiedade = await prisma.modules.create({
    data: {
      title: 'Desbravando a Ansiedade',
      description: 'Entenda o que é, como funciona e quando procurar ajuda.',
      type: module_type.FOR_USER,
    },
  });

  // 2. Criar a Lição 1: O Básico
  const licaoBasica = await prisma.lessons.create({
    data: {
      title: 'Medo vs. Ansiedade',
      order: 1,
      module_id: moduloAnsiedade.id,
    },
  });

  // 3. Adicionar as Perguntas (Steps) dentro dessa lição
  // Usaremos o campo JSON 'content' para guardar pergunta + opções + resposta correta

  // Pergunta 1
  await prisma.lesson_steps.create({
    data: {
      lesson_id: licaoBasica.id,
      step_type: lesson_step_type.MULTIPLE_CHOICE,
      order: 1,
      content: {
        question:
          'Muita gente confunde medo com ansiedade. Qual a principal diferença?',
        options: [
          'O medo acontece só na cabeça, ansiedade é no corpo.',
          'O medo é reação ao perigo real (agora), ansiedade é preocupação com o futuro.', // Correta
          'A ansiedade é tristeza, medo é susto.',
          'Não tem diferença.',
        ],
        correctIndex: 1,
      },
    },
  });

  // Pergunta 2
  await prisma.lesson_steps.create({
    data: {
      lesson_id: licaoBasica.id,
      step_type: lesson_step_type.MULTIPLE_CHOICE,
      order: 2,
      content: {
        question: 'Quando a ansiedade pode ser considerada um transtorno?',
        options: [
          'Quando é excessiva, frequente e atrapalha a rotina há meses.', // Correta
          'Quando você sente frio na barriga antes de um encontro.',
          'Quando você tem um pesadelo.',
          'Quando fica irritado com fome.',
        ],
        correctIndex: 0,
      },
    },
  });

  // Pergunta 3
  await prisma.lesson_steps.create({
    data: {
      lesson_id: licaoBasica.id,
      step_type: lesson_step_type.MULTIPLE_CHOICE,
      order: 3,
      content: {
        question: 'Por que o coração dispara numa crise?',
        options: [
          'O coração está parando.',
          'O corpo quer dormir.',
          "É um alarme falso preparando para 'lutar ou fugir'.", // Correta
          'Porque a temperatura subiu.',
        ],
        correctIndex: 2,
      },
    },
  });

  console.log('✅ Banco populado usando a estrutura existente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
