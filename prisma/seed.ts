import {
  PrismaClient,
  Role,
  Availability,
  JobStatus,
  ProposalStatus,
  ProficiencyLevel,
} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seeding...')

  // 1️⃣ Clear existing data (Optional but recommended for a clean seed)
  // await prisma.proposal.deleteMany()
  // await prisma.job.deleteMany()
  // await prisma.freelancerSkill.deleteMany()
  // await prisma.skill.deleteMany()
  // await prisma.freelancerProfile.deleteMany()
  // await prisma.clientProfile.deleteMany()
  // await prisma.user.deleteM  // 2️⃣ Skills
  const commonSkills = [
    { name: 'Next.js', category: 'Frontend' },
    { name: 'React', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'AWS', category: 'DevOps' },
    { name: 'Figma', category: 'Design' },
    { name: 'UI Design', category: 'Design' },
    { name: 'UX Research', category: 'Design' },
    { name: 'Flutter', category: 'Mobile' },
    { name: 'Dart', category: 'Mobile' },
    { name: 'Firebase', category: 'Backend' },
    { name: 'Python', category: 'Backend' },
    { name: 'SQL', category: 'Database' },
    { name: 'Tableau', category: 'Data' },
    { name: 'SEO', category: 'Marketing' },
    { name: 'Copywriting', category: 'Content' },
    { name: 'Translation', category: 'Content' },
    { name: 'Social Media Marketing', category: 'Marketing' },
    { name: 'Financial Modeling', category: 'Finance' },
    { name: 'Market Research', category: 'Business' },
  ]

  const createdSkills = await Promise.all(
    commonSkills.map((s) =>
      prisma.skill.upsert({
        where: { id: s.name }, // This is a hack because name isn't unique in schema, but for seeding it's fine if we use UUIDs or just findFirst
        create: { name: s.name, category: s.category },
        update: {},
      }).catch(async () => {
         // If upsert mapping fails (since ID is uuid not name), fallback to findFirst
         let skill = await prisma.skill.findFirst({ where: { name: s.name } })
         if (!skill) {
           skill = await prisma.skill.create({ data: { name: s.name, category: s.category } })
         }
         return skill
      })
    )
  )

  const skillMap = Object.fromEntries(createdSkills.map(s => [s.name, s.id]))

  // 3️⃣ Clients
  const clientsData = [
    {
      email: 'techstore@example.com',
      phone: '88112233',
      name: 'TechStore LLC',
      company: 'TechStore LLC',
      location: 'Улаанбаатар',
      industry: 'E-Commerce'
    },
    {
      email: 'creative@example.com',
      phone: '99112233',
      name: 'Creative Agency',
      company: 'Creative Agency',
      location: 'Зайнаас',
      industry: 'Design'
    },
    {
      email: 'fintech@example.com',
      phone: '77112233',
      name: 'Fintech Startup',
      company: 'Fintech Startup',
      location: 'Улаанбаатар',
      industry: 'Finance'
    },
    {
      email: 'marketing@example.com',
      phone: '88223344',
      name: 'Global Reach SEO',
      company: 'Global Reach SEO',
      location: 'Улаанбаатар',
      industry: 'Marketing'
    },
    {
      email: 'writer@example.com',
      phone: '99223344',
      name: 'WordCraft Solutions',
      company: 'WordCraft Solutions',
      location: 'Зайнаас',
      industry: 'Content & Translation'
    }
  ]

  for (const c of clientsData) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {
        passwordHash: '$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.'
      },
      create: {
        email: c.email,
        phone: c.phone,
        full_name: c.name,
        passwordHash: '$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.', // Password: password123
        role: Role.CLIENT,
        is_verified: true,
        email_verified: true,
        phone_verified: true,
      }
    })

    await prisma.clientProfile.upsert({
      where: { user_id: user.id },
      update: {
        company_name: c.company,
        industry: c.industry,
        location: c.location,
      },
      create: {
        user_id: user.id,
        company_name: c.company,
        industry: c.industry,
        location: c.location,
        total_jobs_posted: 0,
      }
    })
  }

  // 4️⃣ Freelancers
  const freelancersData = [
    {
      email: 'bat@example.com',
      phone: '88001122',
      name: 'Д. Бат-Эрдэнэ',
      title: 'Ахлах Full-Stack хөгжүүлэгч',
      rate: 45000,
      location: 'Улаанбаатар',
      skills: ['React', 'Node.js', 'TypeScript']
    },
    {
      email: 'selenge@example.com',
      phone: '99001122',
      name: 'Б. Сэлэнгэ',
      title: 'UI/UX Дизайнер',
      rate: 35000,
      location: 'Улаанбаатар',
      skills: ['Figma', 'UI Design', 'UX Research']
    },
    {
      email: 'togoldor@example.com',
      phone: '77001122',
      name: 'Э. Төгөлдөр',
      title: 'Mobile App Хөгжүүлэгч',
      rate: 40000,
      location: 'Эрдэнэт',
      skills: ['Flutter', 'Dart', 'Firebase']
    },
    {
      email: 'nara@example.com',
      phone: '88445566',
      name: 'Г. Нарантуяа',
      title: 'Дижитал Маркетинг Мэргэжилтэн',
      rate: 25000,
      location: 'Улаанбаатар',
      skills: ['SEO', 'Social Media Marketing', 'Market Research']
    },
    {
      email: 'bold@example.com',
      phone: '99445566',
      name: 'Т. Болд',
      title: 'Контент бичигч & Орчуулагч',
      rate: 20000,
      location: 'Дархан',
      skills: ['Copywriting', 'Translation', 'Market Research']
    },
    {
      email: 'zaya@example.com',
      phone: '77445566',
      name: 'С. Заяа',
      title: 'Бизнес Аналитик',
      rate: 50000,
      location: 'Улаанбаатар',
      skills: ['Financial Modeling', 'SQL', 'Tableau']
    }
  ]

  for (const f of freelancersData) {
    const user = await prisma.user.upsert({
      where: { email: f.email },
      update: {
        passwordHash: '$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.'
      },
      create: {
        email: f.email,
        phone: f.phone,
        full_name: f.name,
        passwordHash: '$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.', // Password: password123
        role: Role.FREELANCER,
        is_verified: true,
        email_verified: true,
        phone_verified: true,
      }
    })

    const profile = await prisma.freelancerProfile.upsert({
      where: { user_id: user.id },
      update: {
        title: f.title,
        hourly_rate: f.rate,
        location: f.location,
      },
      create: {
        user_id: user.id,
        title: f.title,
        hourly_rate: f.rate,
        location: f.location,
        ai_score: 4.5 + Math.random() * 0.5,
        availability: Availability.AVAILABLE,
        bio: `${f.title} мэргэжилтэй, олон жилийн туршлагатай фрилансер.`
      }
    })

    // Add skills
    for (const sName of f.skills) {
      const sId = skillMap[sName]
      if (sId) {
        await prisma.freelancerSkill.upsert({
          where: { freelancer_id_skill_id: { freelancer_id: profile.id, skill_id: sId } },
          update: {},
          create: {
            freelancer_id: profile.id,
            skill_id: sId,
            proficiency_level: ProficiencyLevel.EXPERT
          }
        })
      }
    }
  }

  // 5️⃣ Jobs
  const techStore = await prisma.clientProfile.findFirst({ where: { company_name: 'TechStore LLC' } })
  const creativeAgency = await prisma.clientProfile.findFirst({ where: { company_name: 'Creative Agency' } })
  const fintechStartup = await prisma.clientProfile.findFirst({ where: { company_name: 'Fintech Startup' } })
  const marketingAgency = await prisma.clientProfile.findFirst({ where: { company_name: 'Global Reach SEO' } })
  const wordCraft = await prisma.clientProfile.findFirst({ where: { company_name: 'WordCraft Solutions' } })

  if (techStore && !(await prisma.job.findFirst({ where: { title: 'E-Commerce Вебсайт хийлгэнэ (Next.js & Tailwind)' } }))) {
    await prisma.job.create({
      data: {
        client_id: techStore.id,
        title: 'E-Commerce Вебсайт хийлгэнэ (Next.js & Tailwind)',
        description: 'Манай компанид шинээр e-commerce вебсайт хэрэгтэй байна. Next.js болон Tailwind CSS ашиглаж хийх шаардлагатай.',
        budget_min: 3000000,
        budget_max: 5000000,
        status: JobStatus.OPEN,
        deadline: new Date('2026-05-30'),
        skills: {
          connect: [
            { id: skillMap['Next.js'] },
            { id: skillMap['React'] },
            { id: skillMap['Tailwind CSS'] },
            { id: skillMap['TypeScript'] }
          ].filter(s => !!s.id) as { id: string }[]
        }
      }
    })
  }

  if (creativeAgency && !(await prisma.job.findFirst({ where: { title: 'Брендийн танилцуулга хуудасны UI/UX дизайн' } }))) {
    await prisma.job.create({
      data: {
        client_id: creativeAgency.id,
        title: 'Брендийн танилцуулга хуудасны UI/UX дизайн',
        description: 'Шинэ брендийн танилцуулга хуудас хийх гэж байгаа тул UI/UX дизайн хэрэгтэй байна.',
        budget_min: 1000000,
        budget_max: 2000000,
        status: JobStatus.OPEN,
        deadline: new Date('2026-05-15'),
        skills: {
          connect: [
            { id: skillMap['Figma'] },
            { id: skillMap['UI Design'] }
          ].filter(s => !!s.id) as { id: string }[]
        }
      }
    })
  }

  if (marketingAgency && !(await prisma.job.findFirst({ where: { title: 'Сошиал медиа маркетингийн ажилтан хайж байна' } }))) {
    await prisma.job.create({
      data: {
        client_id: marketingAgency.id,
        title: 'Сошиал медиа маркетингийн ажилтан хайж байна',
        description: 'Манай компанид шинээр гаргаж буй бүтээгдэхүүний сошиал медиа маркетингийг хариуцах ажилтан хэрэгтэй байна.',
        budget_min: 500000,
        budget_max: 1500000,
        status: JobStatus.OPEN,
        deadline: new Date('2026-06-01'),
        skills: {
          connect: [
            { id: skillMap['Social Media Marketing'] },
            { id: skillMap['SEO'] },
            { id: skillMap['Copywriting'] }
          ].filter(s => !!s.id) as { id: string }[]
        }
      }
    })
  }

  if (wordCraft && !(await prisma.job.findFirst({ where: { title: 'Англи хэлнээс Монгол хэл рүү орчуулга хийх' } }))) {
    await prisma.job.create({
      data: {
        client_id: wordCraft.id,
        title: 'Англи хэлнээс Монгол хэл рүү орчуулга хийх',
        description: 'Техникийн гарын авлагыг Англи хэлнээс Монгол хэл рүү алдаагүй хөрвүүлж өгөх богино хугацааны ажил.',
        budget_min: 200000,
        budget_max: 800000,
        status: JobStatus.OPEN,
        deadline: new Date('2026-05-10'),
        skills: {
          connect: [
            { id: skillMap['Translation'] },
            { id: skillMap['Copywriting'] }
          ].filter(s => !!s.id) as { id: string }[]
        }
      }
    })
  }

  // 6️⃣ Experience (Completed Jobs, Contracts, and Reviews)
  console.log('📜 Seeding comprehensive historical contracts and reviews...')
  
  const batFreelancer = await prisma.freelancerProfile.findUnique({ where: { user_id: (await prisma.user.findUnique({ where: { email: 'bat@example.com' } }))?.id } })
  const naraFreelancer = await prisma.freelancerProfile.findUnique({ where: { user_id: (await prisma.user.findUnique({ where: { email: 'nara@example.com' } }))?.id } })
  const selengeFreelancer = await prisma.freelancerProfile.findUnique({ where: { user_id: (await prisma.user.findUnique({ where: { email: 'selenge@example.com' } }))?.id } })
  const boldFreelancer = await prisma.freelancerProfile.findUnique({ where: { user_id: (await prisma.user.findUnique({ where: { email: 'bold@example.com' } }))?.id } })
  const zayaFreelancer = await prisma.freelancerProfile.findUnique({ where: { user_id: (await prisma.user.findUnique({ where: { email: 'zaya@example.com' } }))?.id } })
  const togoldorFreelancer = await prisma.freelancerProfile.findUnique({ where: { user_id: (await prisma.user.findUnique({ where: { email: 'togoldor@example.com' } }))?.id } })

  // Data for batch creation of historical contracts
  const historicalData = [
    { client: techStore, freelancer: batFreelancer, title: 'Inventory System Backend', rating: 5, comment: 'Great work on the inventory system! Very professional.' },
    { client: marketingAgency, freelancer: naraFreelancer, title: 'Initial Brand Strategy', rating: 5, comment: 'Nara performed exceptionally well with our brand strategy.' },
    { client: wordCraft, freelancer: boldFreelancer, title: 'English Content Translation', rating: 4, comment: 'Good quality translation, delivered on time.' },
    { client: fintechStartup, freelancer: zayaFreelancer, title: 'Market Analysis Report', rating: 5, comment: 'Very deep analysis, helped us secure funding.' },
    { client: fintechStartup, freelancer: batFreelancer, title: 'Mobile API Integration', rating: 4, comment: 'Fast developer and very reliable.' },
    { client: creativeAgency, freelancer: selengeFreelancer, title: 'Portfolio Website UI', rating: 5, comment: 'Incredible designs! Our clients loved it.' }
  ]

  for (const [index, entry] of historicalData.entries()) {
    if (entry.client && entry.freelancer) {
      const oldJob = await prisma.job.create({
        data: {
          client_id: entry.client.id,
          title: entry.title,
          description: `Historical project for ${entry.freelancer.title}.`,
          budget_min: 500000,
          budget_max: 2000000,
          status: JobStatus.CLOSED,
          deadline: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
        }
      })

      const contract = await prisma.contract.create({
        data: {
          job_id: oldJob.id,
          freelancer_id: entry.freelancer.id,
          client_id: entry.client.id,
          agreed_amount: 1500000,
          status: 'COMPLETED' as any,
          start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
        }
      })

      await prisma.review.upsert({
        where: { id: `review-hist-${index}` },
        create: {
          id: `review-hist-${index}`,
          contract_id: contract.id,
          reviewer_id: entry.client.user_id,
          rating: entry.rating,
          comment: entry.comment,
        },
        update: {}
      })
    }
  }

  // 7️⃣ Active Contracts (To show "Active" state for all clients)
  console.log('⚡ Seeding active contracts...')
  
  // 8️⃣ Mass User Seeding (at least 100 total)
  console.log('👥 Seeding 100 extra users (Clients and Freelancers)...')
  
  const mnlNames = ['Бат', 'Болд', 'Тулга', 'Гэрэл', 'Эрдэнэ', 'Сүх', 'Наран', 'Цэцэг', 'Алтан', 'Баяр']
  const mnlSurnames = ['Д.', 'Б.', 'Г.', 'С.', 'А.', 'Т.', 'М.', 'Л.', 'Ж.', 'У.']
  const industries = ['IT', 'Marketing', 'Finance', 'Education', 'Construction', 'Retail', 'Design']
  const titles = ['Web Dev', 'Graphic Designer', 'Marketing Specialist', 'Data Analyst', 'Project Manager']

  for (let i = 1; i <= 100; i++) {
    const role = i % 2 === 0 ? Role.CLIENT : Role.FREELANCER
    const email = `user${i}@example.com`
    const phone = `8900${i.toString().padStart(4, '0')}`
    const name = `${mnlSurnames[i % 10]} ${mnlNames[Math.floor(Math.random() * 10)]}`
    
    const user = await prisma.user.upsert({
      where: { email },
      update: {}, // Don't overwrite existing if they were created before
      create: {
        email,
        phone,
        full_name: name,
        passwordHash: '$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.', // password123
        role,
        is_verified: true,
        email_verified: true,
        phone_verified: true,
      }
    })

    if (role === Role.CLIENT) {
      await prisma.clientProfile.upsert({
        where: { user_id: user.id },
        update: {},
        create: {
          user_id: user.id,
          company_name: `${name} Co., Ltd`,
          industry: industries[i % industries.length],
          location: 'Улаанбаатар',
          total_jobs_posted: Math.floor(Math.random() * 5)
        }
      })
    } else {
      const profile = await prisma.freelancerProfile.upsert({
        where: { user_id: user.id },
        update: {},
        create: {
          user_id: user.id,
          title: titles[i % titles.length],
          hourly_rate: 15000 + (Math.random() * 50000),
          location: 'Улаанбаатар',
          ai_score: 3.5 + (Math.random() * 1.5),
          availability: Availability.AVAILABLE,
          bio: `Туршлагатай ${titles[i % titles.length]} мэргэжилтэн.`
        }
      })
      
      // Randomly assign 2-3 skills
      const randomSkillNames = Object.keys(skillMap).sort(() => 0.5 - Math.random()).slice(0, 3)
      for (const sName of randomSkillNames) {
        await prisma.freelancerSkill.upsert({
          where: { freelancer_id_skill_id: { freelancer_id: profile.id, skill_id: skillMap[sName] } },
          update: {},
          create: {
            freelancer_id: profile.id,
            skill_id: skillMap[sName],
            proficiency_level: ProficiencyLevel.INTERMEDIATE
          }
        })
      }
    }
  }

  // 9️⃣ High Traffic Scenario (One client, one job, 20+ proposals)
  console.log('🚀 Seeding high traffic scenario (Client with 25 proposals)...')
  
  const hrUser = await prisma.user.upsert({
    where: { email: 'hr@example.com' },
    update: {
      passwordHash: '$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.'
    },
    create: {
      email: 'hr@example.com',
      phone: '88998899',
      full_name: 'HR Manager',
      passwordHash: '$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.', // password123
      role: Role.CLIENT,
      is_verified: true,
      email_verified: true,
      phone_verified: true,
    }
  })

  const hrProfile = await prisma.clientProfile.upsert({
    where: { user_id: hrUser.id },
    update: { company_name: 'Global Solutions Tech' },
    create: {
      user_id: hrUser.id,
      company_name: 'Global Solutions Tech',
      industry: 'Human Resources & Technology',
      location: 'Улаанбаатар',
      total_jobs_posted: 1,
    }
  })

  // Create one job that will get many proposals
  const highTrafficJob = await prisma.job.create({
    data: {
      client_id: hrProfile.id,
      title: 'Senior Full-stack Developer (Next.js & Node.js)',
      description: 'Манай компанид урт хугацаанд ажиллах туршлагатай Full-stack хөгжүүлэгч хэрэгтэй байна. Бид AI болон Fintech чиглэлээр ажилладаг.',
      budget_min: 5000000,
      budget_max: 15000000,
      status: JobStatus.OPEN,
      deadline: new Date('2026-08-30'),
      skills: {
        connect: [
          { id: skillMap['Next.js'] },
          { id: skillMap['Node.js'] },
          { id: skillMap['TypeScript'] },
          { id: skillMap['PostgreSQL'] }
        ].filter(s => !!s.id) as { id: string }[]
      }
    }
  })

  // Get all freelancers we created earlier
  const allFreelancers = await prisma.freelancerProfile.findMany({
    include: { user: true },
    where: { 
      user: {
        role: Role.FREELANCER
      }
    } 
  })

  // Create 25 proposals from random freelancers
  const freelancerProfiles = await prisma.freelancerProfile.findMany({
      take: 25,
      orderBy: { createdAt: 'desc' }
  })

  for (let i = 0; i < freelancerProfiles.length; i++) {
    const f = freelancerProfiles[i]
    
    // Manual check instead of upsert due to missing unique constraint in schema
    const existingProposal = await prisma.proposal.findFirst({
      where: { 
          job_id: highTrafficJob.id, 
          freelancer_id: f.id 
      }
    })

    if (!existingProposal) {
      await prisma.proposal.create({
        data: {
          job_id: highTrafficJob.id,
          freelancer_id: f.id,
          bid_amount: 5000000 + (Math.random() * 5000000),
          cover_letter: `Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #${i+1})`,
          status: ProposalStatus.PENDING,
          ai_relevance_score: 0.4 + (Math.random() * 0.6) // Random realistic scores
        }
      })
    }
  }

  // Create some contracts for this HR user as well
  const randomFreelancers = await prisma.freelancerProfile.findMany({
    take: 2,
    skip: 30, // Get different ones
    orderBy: { createdAt: 'asc' }
  })

  // 1. One Active Contract
  if (randomFreelancers[0]) {
    const activeJob = await prisma.job.create({
      data: {
        client_id: hrProfile.id,
        title: 'Middle React Developer (Ongoing)',
        description: 'Ongoing project support.',
        budget_min: 2000000,
        budget_max: 4000000,
        status: JobStatus.IN_PROGRESS,
        deadline: new Date('2026-10-15'),
      }
    })

    await prisma.contract.create({
      data: {
        job_id: activeJob.id,
        freelancer_id: randomFreelancers[0].id,
        client_id: hrProfile.id,
        agreed_amount: 3500000,
        status: 'ACTIVE' as any,
        start_date: new Date(),
      }
    })
  }

  // 2. One Completed Contract
  if (randomFreelancers[1]) {
    const closedJob = await prisma.job.create({
      data: {
        client_id: hrProfile.id,
        title: 'Legacy Bug Fix (Completed)',
        description: 'Completed bug fixing project.',
        budget_min: 500000,
        budget_max: 1000000,
        status: JobStatus.CLOSED,
        deadline: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      }
    })

    const compContract = await prisma.contract.create({
      data: {
        job_id: closedJob.id,
        freelancer_id: randomFreelancers[1].id,
        client_id: hrProfile.id,
        agreed_amount: 800000,
        status: 'COMPLETED' as any,
        start_date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
      }
    })

    await prisma.review.create({
      data: {
        contract_id: compContract.id,
        reviewer_id: hrUser.id,
        rating: 5,
        comment: 'Perfect job! All bugs were fixed quickly.'
      }
    })
  }

  console.log('✅ Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
